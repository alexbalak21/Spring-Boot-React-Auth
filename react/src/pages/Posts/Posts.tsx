// react/src/pages/Posts.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorizedApi } from "../../hooks/useAuthorizedApi";

const MY_POSTS_URL = "/posts/my-posts";

interface Post {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export default function Posts() {
  const api = useAuthorizedApi();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get<Post[]>(MY_POSTS_URL);
        
        // Transform the response to handle any circular references
        const safePosts = Array.isArray(response.data) 
          ? response.data.map(post => ({
              id: post.id,
              title: post.title,
              body: post.body,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt
            }))
          : [];
          
        setPosts(safePosts);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError(err.response?.data?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [api]);

  const handleCreateNew = () => {
    navigate("/create-post");
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid date";
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-gray-600">Loading your posts...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <p className="mb-2">Error: {error}</p>
        <button 
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Your Posts</h2>
          <button 
            onClick={handleCreateNew} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            + Create New Post
          </button>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">You haven't created any posts yet.</p>
            <button 
              onClick={handleCreateNew} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{post.title}</h3>
                  <div className="text-gray-600 mb-4">
                    <p className="whitespace-pre-line">{post.body}</p>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    <span className="block">
                      Created: {formatDate(post.createdAt)}
                    </span>
                    {post.updatedAt !== post.createdAt && (
                      <span className="block mt-1">
                        Updated: {formatDate(post.updatedAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button 
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm focus:outline-none"
                      onClick={() => navigate(`/edit-post/${post.id}`)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}