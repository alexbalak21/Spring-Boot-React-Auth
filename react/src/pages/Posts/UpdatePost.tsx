import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthorizedApi } from "../../hooks/useAuthorizedApi";
import { useToast } from "../../components/ToastContainer";
import Button from "../../components/Button";
import Input from "../../components/Input";

const UPDATE_POST_URL = "/posts";

export default function UpdatePost() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const api = useAuthorizedApi();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const response = await api.get(`${UPDATE_POST_URL}/${id}`);
        const post = response.data;
        setTitle(post.title || "");
        setBody(post.body || "");
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError("Failed to load post for editing");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [api, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !body.trim()) {
      setError("Title and body are required");
      return;
    }

    if (!id) {
      setError("Post ID is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.put(`${UPDATE_POST_URL}/${id}`, {
        title: title.trim(),
        body: body.trim(),
      });

      toast.success("Post updated successfully!");
      // Redirect to posts page
      navigate("/posts");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update post. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <div className="text-center">Loading post...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Edit Post</h2>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Title"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter post title"
              maxLength={100}
              required
            />

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border h-48"
                disabled={isSubmitting}
                placeholder="Write your post content here..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Update Post
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}