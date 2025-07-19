// components/LoginWithGoogle.jsx
import React from "react";

const LoginWithGoogle = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <button onClick={handleGoogleLogin} className="google-login-button">
      Login with Google
    </button>
  );
};

export default LoginWithGoogle;
