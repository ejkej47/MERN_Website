// src/pages/RegisterPage.jsx
import React from "react";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-dark px-4">
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden max-w-4xl w-full">
        {/* Register form side */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
          <p className="text-sm text-gray-600 mb-6">
            Fill in the information below to register a new account.
          </p>
          <RegisterForm />
          <div className="text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in here
            </Link>
          </div>
        </div>

        {/* Info side */}
        <div className="w-full md:w-1/2 bg-gray-100 p-8">
          <h3 className="text-lg font-semibold mb-2">Why Join Learnify?</h3>
          <ul className="list-disc list-inside text-sm space-y-1 mb-6">
            <li>Access high-quality learning materials</li>
            <li>Personalized learning experience</li>
            <li>Track your progress and success</li>
            <li>Engage with a supportive community</li>
          </ul>
          <Link
            to="/login"
            className="block w-full text-center bg-primary text-white py-2 rounded hover:bg-purple-700"
          >
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}