/* eslint-disable no-unused-vars */
// src/components/ProtectedRoute.jsx
import React, { useEffect } from "react"; // Mengimpor React dan useEffect dari React untuk menangani efek samping
import { useNavigate } from "react-router-dom"; // Mengimpor useNavigate untuk mengarahkan pengguna ke halaman lain

export default function ProtectedRoute({ children }) {
  // Mendeklarasikan komponen ProtectedRoute yang menerima props 'children'
  const navigate = useNavigate(); // Menginisialisasi fungsi navigate untuk melakukan redirect

  useEffect(() => {
    // Menggunakan hook useEffect untuk menjalankan kode ketika komponen di-mount
    const token = localStorage.getItem("authToken"); // Mengambil token autentikasi dari localStorage
    if (!token) {
      // Mengecek apakah token ada
      navigate("/login"); // Jika token tidak ada, pengguna akan diarahkan ke halaman login
    }
  }, [navigate]); // Menjalankan efek ini saat navigate berubah (meskipun tidak mungkin berubah di sini)

  return children; // Mengembalikan children (komponen yang dilindungi) jika token ada
}