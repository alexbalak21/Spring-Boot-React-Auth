import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorizedApi } from "../../hooks/useAuthorizedApi";
import "./css/Post.css";

const POST_URL = "/posts"

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const api = useAuthorizedApi();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !body.trim()) {
      setError("Title and body are required");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post(POST_URL, {
        title: title.trim(),
        body: body.trim(),
      });

      // Redirect to the post details page or home page
      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create post. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Create New Post</h2>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              disabled={isSubmitting}
              placeholder="Enter post title"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="body" className="form-label">
              Content
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="form-input"
              disabled={isSubmitting}
              placeholder="Write your post content here..."
              rows={6}
            />
          </div>

          <button
            type="submit"
            className={`login-button ${isSubmitting ? 'login-button-disabled' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
