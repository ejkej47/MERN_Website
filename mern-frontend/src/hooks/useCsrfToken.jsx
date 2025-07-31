// src/hooks/useCsrfToken.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import {
  getCachedCsrfToken,
  setCachedCsrfToken
} from "../utils/csrfMeta";

export default function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState(() => getCachedCsrfToken());

  useEffect(() => {
    const fetchToken = async () => {
      try {
        if (!csrfToken) {
          const res = await axiosInstance.get("/csrf-token");
          const token = res.data.csrfToken;
          setCsrfToken(token);
          setCachedCsrfToken(token);
        }
      } catch (err) {
        console.error("❌ CSRF token fetch error:", err);
      }
    };

    fetchToken();
  }, [csrfToken]);

  return csrfToken;
}
