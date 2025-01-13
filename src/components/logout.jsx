// src/components/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authToken"); // Menghapus token dari localStorage
    navigate("/login"); // Redirect ke halaman login setelah logout
  }, [navigate]);

  return null; // Tidak perlu menampilkan apa pun, hanya mengarahkan setelah logout
}