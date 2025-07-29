// src/hooks/useCsrfToken.js
import { useEffect, useState } from "react";
import axios from "../axiosInstance";

export default function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await axios.get("/csrf-token"); // cookie se postavlja automatski
        setCsrfToken(res.data.csrfToken); // vrati i kao string ako ti treba za axios
      } catch (err) {
        console.error("Greška pri dohvatanju CSRF tokena:", err);
      }
    };

    getToken();
  }, []);

  return csrfToken;
}
