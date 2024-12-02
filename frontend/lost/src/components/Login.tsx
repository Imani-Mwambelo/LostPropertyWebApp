import React, { useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  // const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    // setLoading(true);

    try {
      const response = await axios.post(
        "https://b894-196-249-97-31.ngrok-free.app/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // setLoading(false);

      if (response.status === 200) {
        const { access_token } = response.data;
        if (access_token) {
          localStorage.setItem("token", access_token);
          console.log("Token saved to localStorage:", localStorage.getItem("token")); // Debugging statement
          navigate("/", { replace: true });
        } else {
          setError("Invalid response from server.");
        }
      }
    } catch (error: any) {
      // setLoading(false);
      if (error.response && error.response.data) {
        setError(error.response.data.detail || "Authentication failed! Incorrect email or password.");
      } else {
        setError("An error occurred. Please try again later.");
      }
      console.error("Error during login:", error); // Debugging statement
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 shadow-lg rounded">
        <h2 className="text-2xl mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-500">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-500 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-500">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-500 rounded"
            required
          />
        </div>
        <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:scale-95 text-white py-2 rounded transition-all duration-300 ease-in-out transform"
          >
            Login
          </button>

        <p className="mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-blue-500">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
