import React from "react";

const facebookAuthUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/auth/facebook"
    : "https://mern-backend-cd6i.onrender.com/auth/facebook";

const LoginWithFacebook = () => {
  const handleFacebookLogin = () => {
    window.location.href = facebookAuthUrl;
  };

  /*return (
    <button
      onClick={handleFacebookLogin}
      className="bg-blue-600 text-white rounded px-4 py-2 shadow-sm hover:bg-blue-700 transition flex items-center"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
        alt="Facebook"
        className="w-5 h-5 mr-2"
      />
      <span className="text-sm">Login with Facebook</span>
    </button>
  );*/
};

export default LoginWithFacebook;
