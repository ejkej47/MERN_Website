// src/pages/LoginPage.jsx
import React from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-dark px-4">
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden max-w-4xl w-full">
        {/* Login form side */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-4">Log in</h2>
          <p className="text-sm text-gray-600 mb-6">
            If you are already registered, then please log in.
          </p>
          <LoginForm />
          <div className="text-sm mt-4">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Info side */}
        <div className="w-full md:w-1/2 bg-gray-100 p-8">
          <h3 className="text-lg font-semibold mb-2">Don't have an account?</h3>
          <p className="text-sm mb-4">
            With a Learnify account, you can:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 mb-6">
            <li>Access exclusive courses and content</li>
            <li>Track your progress and achievements</li>
            <li>Save favorite lessons</li>
            <li>Join our learning community</li>
          </ul>
          <Link
            to="/register"
            className="block w-full text-center bg-accent text-dark py-2 rounded hover:bg-green-400"
          >
            Sign up now!
          </Link>
        </div>
      </div>
    </div>
  );
}
