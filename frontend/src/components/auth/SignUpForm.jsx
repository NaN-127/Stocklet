import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun, AlertCircle, RefreshCw } from "lucide-react";

function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await register(name, email, password);

    if (result.success) {

      navigate("/");
    } else {
        
      setError(result.error || "Failed to register account");
      setIsLoading(false);
    }
  };

  return (

    <div className="w-full max-w-md">
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}

          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p>{error}</p>

        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase block">
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0f1115] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all text-sm placeholder-gray-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase block">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0f1115] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all text-sm placeholder-gray-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase block">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0f1115] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all text-sm placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full bg-[#0f1115] hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-lg flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase text-[12px] tracking-wider"
        >
          {isLoading ? (
            <>
              <RefreshCw size={16} className="animate-spin mr-2" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>

      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-gray-900 dark:text-white hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpForm;
