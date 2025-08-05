// components/LoginWithGoogle.jsx
import React from "react";

const googleAuthUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/auth/google"
    : "https://mern-backend-cd6i.onrender.com/auth/google";

const LoginWithGoogle = () => {
  const handleGoogleLogin = () => {
    window.location.href = googleAuthUrl;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-white border border-gray-300 rounded px-4 py-2 shadow-sm hover:bg-gray-50 transition"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="inline-block w-5 h-5 mr-2 align-middle"
      />
      <span className="align-middle text-sm text-gray-700">Login with Google</span>
    </button>
  );
};

export default LoginWithGoogle;
