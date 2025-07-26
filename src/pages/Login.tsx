import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify"; // Ensure you have toast notifications installed
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userType, setUserType] = useState<"student" | "staff">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Save token & status (if needed)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("status", res.data.status);

      toast.success(`Logged in as ${res.data.status}`);
      navigate("/announcements"); // or "/home" or wherever
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 dark:from-background dark:via-background dark:to-background">
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-2xl shadow-2xl p-10 border border-primary/10">
        <h2 className="text-4xl font-extrabold mb-2 text-center text-primary dark:text-white drop-shadow">
          CampusLink Login
        </h2>
        <p className="mb-8 text-center text-muted-foreground dark:text-gray-300">
          Welcome back! Please login to your account.
        </p>

        {/* User Type Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center bg-muted dark:bg-gray-800 rounded-full p-1">
            <button
              type="button"
              className={`px-5 py-2 rounded-full font-semibold transition ${
                userType === "student"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground dark:text-gray-400"
              }`}
              onClick={() => setUserType("student")}
            >
              Student
            </button>
            <button
              type="button"
              className={`px-5 py-2 rounded-full font-semibold transition ${
                userType === "staff"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground dark:text-gray-400"
              }`}
              onClick={() => setUserType("staff")}
            >
              Staff
            </button>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 font-medium text-foreground dark:text-white">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-primary/20 rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-foreground dark:text-white">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-primary/20 rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-3 rounded-lg shadow-md hover:scale-105 transition-transform"
          >
            Login as {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground dark:text-gray-400">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-primary font-semibold hover:underline dark:text-accent"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
