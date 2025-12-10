import { useState } from "react";
import axios from "axios";
import { useCsrf } from "../hooks/useCsrf";
import { useAuthToken } from "../hooks/useAuthToken";

const LOGIN_URL = "/api/auth/login";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  useCsrf();
  const { setAccessToken } = useAuthToken();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loginResult, setLoginResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoginResult(null);

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(LOGIN_URL, formData, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      });

      const access_token = response.data?.access_token;
      if (access_token) {
        setAccessToken(access_token);
        setLoginResult("Login successful");
        console.log("JWT saved via hook:", access_token);
      } else {
        setError("No access token returned from server");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>

        {error && <div className="alert-error">{error}</div>}
        {loginResult && <div className="alert-success">{loginResult}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'login-button-disabled' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}