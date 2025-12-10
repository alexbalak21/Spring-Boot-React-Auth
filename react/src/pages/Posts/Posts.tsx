// react/src/pages/Posts.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorizedApi } from "../../hooks/useAuthorizedApi";
import "./css/Post.css";

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
    return <div className="c-loading">Loading your posts...</div>;
  }

  if (error) {
    return (
      <div className="c-alert c-alert--error u-mb-4">
        <p className="u-mb-2">Error: {error}</p>
        <button 
          className="c-button c-button--secondary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="l-container u-py-6">
      <div className="c-posts">
        <div className="c-posts__header u-mb-6">
          <h2 className="u-mb-4">Your Posts</h2>
          <button 
            onClick={handleCreateNew} 
            className="c-button c-button--primary"
          >
            + Create New Post
          </button>
        </div>
        
        {posts.length === 0 ? (
          <div className="c-empty-state u-text-center u-py-8">
            <p className="u-mb-4">You haven't created any posts yet.</p>
            <button 
              onClick={handleCreateNew} 
              className="c-button c-button--primary"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="c-posts__grid">
            {posts.map((post) => (
              <article key={post.id} className="c-card c-post">
                <h3 className="c-post__title">{post.title}</h3>
                <div className="c-post__body">
                  <p>{post.body}</p>
                </div>
                <div className="c-post__meta">
                  <span className="c-post__date">
                    Created: {formatDate(post.createdAt)}
                  </span>
                  {post.updatedAt !== post.createdAt && (
                    <span className="c-post__update">
                      • Updated: {formatDate(post.updatedAt)}
                    </span>
                  )}
                </div>
                <div className="c-post__actions">
                  <button 
                    className="c-button c-button--secondary c-button--sm"
                    onClick={() => navigate(`/edit-post/${post.id}`)}
                  >
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}