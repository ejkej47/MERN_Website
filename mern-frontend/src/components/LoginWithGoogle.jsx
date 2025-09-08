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
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-borderSoft bg-surface px-4 py-2 shadow-sm transition hover:bg-background"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="h-5 w-5"
      />
      <span className="text-sm font-medium text-text">Prijavi se preko Google-a</span>
    </button>
  );
};

export default LoginWithGoogle;
