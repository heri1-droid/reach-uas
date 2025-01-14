/* eslint-disable no-unused-vars */
import React, { useState } from "react"; // Mengimpor React dan useState untuk menangani state dalam komponen
import axios from "axios"; // Mengimpor axios untuk melakukan HTTP request
import { useNavigate } from "react-router-dom"; // Mengimpor useNavigate untuk redirect ke halaman lain

export default function Login() {
  // Mendeklarasikan komponen fungsional Login
  const [email, setEmail] = useState(""); // Mendefinisikan state 'email' dan fungsi 'setEmail' untuk menyimpan email pengguna
  const [password, setPassword] = useState(""); // Mendefinisikan state 'password' dan fungsi 'setPassword' untuk menyimpan password pengguna
  const [error, setError] = useState(""); // Mendefinisikan state 'error' dan fungsi 'setError' untuk menampilkan pesan error jika login gagal
  const navigate = useNavigate(); // Menginisialisasi fungsi navigate untuk melakukan redirect setelah login

  const handleLogin = (e) => {
    // Mendefinisikan fungsi handleLogin yang akan dijalankan saat form login di-submit
    e.preventDefault(); // Mencegah form melakukan submit secara default yang akan me-refresh halaman

    axios
      .post("https://rsiarrasyid.com/api/login", {
        // Melakukan request POST ke API login
        email, // Mengirimkan email yang telah dimasukkan pengguna
        password, // Mengirimkan password yang telah dimasukkan pengguna
      })
      .then((response) => {
        // Jika request berhasil
        const token = response.data.token; // Mengambil token dari response data API
         console.log(response.data.token);
        
        localStorage.setItem("authToken", token); // Menyimpan token ke localStorage untuk keperluan autentikasi di sesi berikutnya

        navigate("/dokter"); // Mengarahkan pengguna ke halaman /fakultas setelah berhasil login
        // window.location.href = "/fakultas"; // Mengarahkan pengguna ke halaman /fakultas setelah login berhasil
      })
      .catch((error) => {
        // Jika request gagal
        setError("Login failed. Please check your credentials."); // Menampilkan pesan error jika login gagal
        console.error("Error during login:", error); // Menampilkan error di console untuk debugging
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Login</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                {/* Mengaitkan fungsi handleLogin ke event submit form */}
                <div className="form-group mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email} // Menghubungkan nilai input dengan state email
                    onChange={(e) => setEmail(e.target.value)} // Mengupdate state email saat input diubah
                    required // Menambahkan validasi agar input ini wajib diisi
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password} // Menghubungkan nilai input dengan state password
                    onChange={(e) => setPassword(e.target.value)} // Mengupdate state password saat input diubah
                    required // Menambahkan validasi agar input ini wajib diisi
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {/* Menampilkan pesan error jika ada */}
                <button type="submit" className="btn btn-primary w-100">
                  {/* Tombol login */}
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}