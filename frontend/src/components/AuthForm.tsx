"use client";

import { useState, FormEvent } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import SocialLoginButtons from "./SocialLoginButtons";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (data: { 
    email: string; 
    password: string; 
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) => void;
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = { 
      email, 
      password, 
      ...(type === "register" && { firstName, lastName, phone })
    };
    onSubmit(formData);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: 'url("/images/Job search.jpg")',
          filter: 'brightness(0.7)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      
      {/* Form Container */}
      <div className="w-full max-w-sm bg-white rounded-lg p-6 relative z-20 shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {type === "login" ? "Sign In" : "Create Account"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {type === "register" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="First name *"
                className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <p className="mt-0.5 text-xs text-red-500">
                {!firstName && "First name is required"}
              </p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Last name *"
                className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <p className="mt-0.5 text-xs text-red-500">
                {!lastName && "Last name is required"}
              </p>
            </div>
          </div>
        )}
        
        <div>
          <input
            type="email"
            placeholder="Email or phone number *"
            className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="mt-0.5 text-xs text-gray-500">
            You can sign in with your phone number or email
          </p>
          {!email && (
            <p className="mt-0.5 text-xs text-red-500">
              Email or phone is required
            </p>
          )}
        </div>

        {type === "register" && (
          <div>
            <input
              type="tel"
              placeholder="Phone number (optional)"
              className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        )}
        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password *"
            className="w-full px-3 py-1.5 pr-10 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
          {type === "register" && (
            <p className="mt-0.5 text-xs text-gray-500">
              8+ characters, letters, numbers & symbols
            </p>
          )}
          {!password && (
            <p className="mt-0.5 text-xs text-red-500">
              Password is required
            </p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-1.5 px-4 text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
        >
          {type === "login" ? "Sign In" : "Sign Up"}
        </button>
        
        <p className="text-xs text-gray-600 text-center mt-3">
          {type === "login" ? (
            <>
              No account?{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </>
          ) : (
            <>
              Have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </>
          )}
        </p>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">Social login coming soon!</p>
        {/* Uncomment when ready to implement email login
        <div className="mt-2">
          <button
            type="button"
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Continue with Email
          </button>
        </div>
        */}
          </form>
        </div>
      </div>
    </div>
  );
}
