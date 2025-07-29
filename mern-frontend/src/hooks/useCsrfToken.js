import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

export default function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/csrf-token")
      .then((res) => {
        if (res.data?.csrfToken) {
          setCsrfToken(res.data.csrfToken);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch CSRF token", err);
      });
  }, []);

  return csrfToken;
}
