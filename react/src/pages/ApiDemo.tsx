import { useState } from "react";
import axios from "axios";
import { useCsrf } from "../hooks/useCsrf";
import Button from "../components/Button";
import Input from "../components/Input";

// Axios defaults for XSRF and cookies
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

const API_BASE = "/api/demo";

export default function ApiDemo() {
  const [input, setInput] = useState("");
  const [responseText, setResponseText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const csrfReady = useCsrf();

  const handlePost = async () => {
    if (!input.trim()) {
      setResponseText("Enter a message before sending");
      return;
    }

    setLoading(true);
    setResponseText(null);
    try {
      const res = await axios.post(API_BASE, { message: input });

      // 🔎 Adjust depending on your API response:
      // If backend returns a plain string (e.g. "hello"):
      setResponseText(res.data);

      // If backend returns an object like { message: "hello" }:
      // setResponseText(res.data.message);

      setInput("");
    } catch (err: any) {
      const serverMessage =
        err?.response?.data?.message || err.message || "Unknown error";
      setResponseText(`Error: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">API Demo</h1>
      <div className="flex gap-3 items-center mb-4">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button
          onClick={handlePost}
          disabled={loading || !csrfReady}
          loading={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </div>
      {responseText && (
        <pre className="bg-gray-50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
          {responseText}
        </pre>
      )}
    </div>
  );
}
