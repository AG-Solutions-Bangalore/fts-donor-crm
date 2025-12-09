import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Search, AlertTriangle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-amber-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        

        {/* Main Content */}
        <div className="bg-gradient-to-br from-gray-100 to-amber-50 rounded-[3rem] p-8 md:p-12 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
              Oops! The page you're looking for seems to have wandered off into the digital wilderness.
            </p>
            
            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-1 bg-gray-900 rounded-full"></div>
              <Search className="w-5 h-5 text-gray-600" />
              <div className="w-8 h-1 bg-yellow-400 rounded-full"></div>
            </div>
            
            <div className="bg-white/50 rounded-2xl p-4 mb-6">
              <p className="text-gray-700">
                Don't worry, even the best explorers sometimes take wrong turns. Let's get you back on track!
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1  gap-4 max-w-md mx-auto">
           
            
            <button
     onClick={()=>navigate('/')}
              className="group flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-300 text-gray-900 rounded-full text-lg font-medium hover:bg-gray-50 transition-all transform hover:scale-[1.02] shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
          </div>

         

          {/* Decorative Bottom */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-gray-900 rounded-full animate-ping animation-delay-200"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping animation-delay-400"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a href="mailto:support@ftschamp.com" className="text-gray-900 hover:text-yellow-500 transition-colors">
              Contact Support
            </a>
          </p>
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
};

export default NotFound;