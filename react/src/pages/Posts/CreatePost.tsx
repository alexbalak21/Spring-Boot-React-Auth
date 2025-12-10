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
    <div className="l-container u-py-8">
      <div className="c-auth__card">
        <h2 className="c-auth__title">Create New Post</h2>

        {error && (
          <div className="c-alert c-alert--error u-mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="c-auth__form">
          <div className="c-form-group">
            <label htmlFor="title" className="c-form__label">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="c-form__input"
              disabled={isSubmitting}
              placeholder="Enter post title"
              maxLength={100}
              required
            />
          </div>

          <div className="c-form-group">
            <label htmlFor="body" className="c-form__label">
              Content
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="c-form__input c-form__input--textarea"
              disabled={isSubmitting}
              placeholder="Write your post content here..."
              rows={6}
              required
            />
          </div>

          <div className="c-form__actions">
            <button
              type="button"
              className="c-button c-button--secondary u-mr-3"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`c-button c-button--primary ${
                isSubmitting ? 'c-button--disabled' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
