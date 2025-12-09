import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '@/config/base-url';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const LoginAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
  const emailInputRef = useRef(null);
  const navigate = useNavigate();
const loadingMessages = [
    "Setting things up for you...",
    "Checking your credentials...",
    "Preparing your dashboard...",
    "Almost there...",
  ];

 

  useEffect(() => {
    let messageIndex = 0;
    let intervalId;

    if (isLoading) {
      setLoadingMessage(loadingMessages[0]);
      intervalId = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 800);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoading]);
  // Auto-focus on email input
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !isLoading) {
      handleSubmit(event);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await axios.post(`${BASE_URL}/api/loginWithDonorId`, formData);

      if (res.data.code === 200) {
        if (!res.data.UserInfo || !res.data.UserInfo.token) {
          toast.error("Login Failed: No token received.");
          setIsLoading(false);
          return;
        }

        const { UserInfo, version, year } = res.data;
        const isProduction = window.location.protocol === "https:";

        const cookieOptions = {
          expires: 7,
          secure: isProduction,
          sameSite: "Strict",
          path: "/",
        };

        // Set all cookies
        Cookies.set("token", UserInfo.token, cookieOptions);
        Cookies.set("id", UserInfo.user.id, cookieOptions);
        Cookies.set("name", UserInfo.user.indicomp_full_name, cookieOptions);
        Cookies.set("chapter_id", UserInfo.user.chapter_id, cookieOptions);
        Cookies.set("email", UserInfo.user.indicomp_email, cookieOptions);
        Cookies.set("token-expire-time", UserInfo?.token_expires_at, cookieOptions);
        Cookies.set("ver_con", version?.version_panel, cookieOptions);
        Cookies.set("currentYear", year?.current_year, cookieOptions);

        const token = Cookies.get("token");
        const tokenExpireTime = Cookies.get("token-expire-time");
        if (!token && !tokenExpireTime) {
          throw new Error("Cookies not set properly");
        }

        navigate("/home", { replace: true });
      } else {
        toast.error(res.data.message || "Login Failed: Unexpected response.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Login Card */}
        <div className="bg-gradient-to-br from-gray-100 to-amber-50 rounded-md shadow-lg p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mb-4">
              <div className="w-12 h-12 bg-gray-900 rounded-md flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">FTS Champ</h1>
            <p className="text-gray-600 text-sm">Donor Management System</p>
          </div>

          {/* Login Form */}
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Donor Fts ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  ref={emailInputRef}
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your donor Fts ID"
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-900 focus:ring-1"
                  disabled={isLoading}
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-gray-900 hover:text-gray-700 transition-colors"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{loadingMessage}</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-4">
            <div className="h-px bg-gray-300"></div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <button className="text-gray-900 hover:text-gray-700 transition-colors">
                Terms
              </button>{' '}
              and{' '}
              <button className="text-gray-900 hover:text-gray-700 transition-colors">
                Privacy
              </button>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gray-900/10 rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginAuth;