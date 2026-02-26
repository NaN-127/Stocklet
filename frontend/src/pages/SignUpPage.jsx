import React from "react";
import { TrendingUp } from "lucide-react";
import SignUpForm from "../components/auth/SignUpForm";

function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1115] transition-colors duration-200 flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp size={32} className="text-blue-600 dark:text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">STOCKLET</h1>
          </div>
          <p className="text-xs tracking-widest text-gray-500 uppercase">Create Your Account</p>
        </div>

        <div className="bg-white dark:bg-[#1a1d24] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;