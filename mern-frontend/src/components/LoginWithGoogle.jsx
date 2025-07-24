// components/LoginWithGoogle.jsx
import React from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const LoginWithGoogle = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <button onClick={handleGoogleLogin} className="google-login-button">
      Login with Google
    </button>
  );
};

export default LoginWithGoogle;
