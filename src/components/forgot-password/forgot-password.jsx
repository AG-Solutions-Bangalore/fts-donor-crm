import React, { useState, useEffect, useRef } from 'react';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '@/config/base-url';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const usernameInputRef = useRef(null);
  const navigate = useNavigate();

  const loadingMessages = [
    "Processing your request...",
    "Sending password to your email...",
    "Verifying your details...",
    "Almost done...",
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

  // Auto-focus on username input
  useEffect(() => {
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
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
    if (!username.trim() || !email.trim()) {
      toast.error("Please enter both username and email.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);

    try {
      const res = await axios.post(`${BASE_URL}/api/panel-send-donor-password?username=${username}&email=${email}`, formData);

      if (res.data.code === 200) {
        setIsSuccess(true);
        toast.success(res.data.message || "Password sent successfully to your email!");
        
        // Clear form after successful submission
        setUsername("");
        setEmail("");
        
        // Reset success state after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      } else {
        toast.error(res.data.message || "Failed to send password. Please try again.");
      }
    } catch (error) {
      console.error("❌ Forgot Password Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Forgot Password Card */}
        <div className="bg-gradient-to-br from-gray-100 to-amber-50 rounded-md shadow-lg p-6">
          {/* Back Button */}
          <button
            onClick={handleBackToLogin}
            disabled={isLoading}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="mb-4">
              <div className="w-12 h-12 bg-gray-900 rounded-md flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password</h1>
            <p className="text-gray-600 text-sm">Enter your details to receive your password</p>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-green-800 font-medium text-sm">Password Sent!</p>
                  <p className="text-green-700 text-xs mt-1">
                    Check your email for your password. You can now login with the received password.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Forgot Password Form */}
          <div className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Donor Fts ID (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  ref={usernameInputRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your donor Fts ID"
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Registered Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your registered email"
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">
                Enter the email address associated with your account
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || isSuccess}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{loadingMessage}</span>
                </>
              ) : (
                <span>Send Password to Email</span>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-4">
            <div className="h-px bg-gray-300"></div>
          </div>

          {/* Instructions */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Instructions:</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-gray-900">•</span>
                <span>Enter your exact Donor Fts ID (username)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-900">•</span>
                <span>Enter the email associated with your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-900">•</span>
                <span>Check your email inbox (and spam folder) for the password</span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact{' '}
              <button className="text-gray-900 hover:text-gray-700 transition-colors">
                Support
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

export default ForgotPassword;