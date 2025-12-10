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
    return <div className="loading">Loading your posts...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h2>Your Posts</h2>
        <button onClick={handleCreateNew} className="create-post-btn">
          + Create New Post
        </button>
      </div>
      
      {posts.length === 0 ? (
        <div className="no-posts">
          <p>You haven't created any posts yet.</p>
          <button onClick={handleCreateNew} className="create-post-btn">
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p className="post-body">{post.body}</p>
              <div className="post-meta">
                <span>Created: {formatDate(post.createdAt)}</span>
                {post.updatedAt !== post.createdAt && (
                  <span> • Updated: {formatDate(post.updatedAt)}</span>
                )}
              </div>
              <div className="post-actions">
                <button 
                  className="edit-btn"
                  onClick={() => navigate(`/edit-post/${post.id}`)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}