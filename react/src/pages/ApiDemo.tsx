import { useState } from "react";
import axios from "axios";
import { useCsrf } from "../hooks/useCsrf";

// Axios defaults for XSRF and cookies
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

const API_BASE = "/api/demo";

export default function ApiDemo() {
  const [input, setInput] = useState("");
  const [responseText, setResponseText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ use the custom hook
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
      setResponseText(JSON.stringify(res.data, null, 2));
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
    <div className="l-container u-py-4">
      <h1 className="u-mb-4">API Demo</h1>
      <div className="c-api-demo">
        <div className="c-api-demo__form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="c-api-demo__input"
            disabled={loading || !csrfReady}
          />
          <button
            onClick={handlePost}
            disabled={loading || !csrfReady}
            className="c-button c-button--primary"
          >
            {loading ? 'Sending...' : 'Send to API'}
          </button>
        </div>
        
        {responseText && (
          <div className="c-api-demo__response">
            <pre className="c-api-demo__pre">{responseText}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
