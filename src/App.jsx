import React, { Suspense, useState } from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute"; // ProtectedRoute Component
import Logout from "./components/logout";



const Home = React.lazy(() => import("./components/home"))
const LayananList = React.lazy(() => import("./components/layanan/list"))
const LayananCreate = React.lazy(() => import("./components/layanan/create"))
const LayananEdit = React.lazy(() => import("./components/layanan/edit"))

const DokterList = React.lazy(() => import("./components/dokter/list"))
const DokterCreate = React.lazy(() => import("./components/dokter/craete"))
const DokterEdit = React.lazy(() => import("./components/dokter/edit"))

const BeritaList = React.lazy(() => import("./components/berita/list"))
const BeritaCreate = React.lazy(() => import("./components/berita/create"))
const BeritaEdit = React.lazy(() => import("./components/berita/edit"))

const JadwalList = React.lazy(() => import("./components/jadwaldokter/list"))
const JadwalCreate = React.lazy(() => import("./components/jadwaldokter/create"))
const JadwalEdit = React.lazy(() => import("./components/jadwaldokter/edit"))

const Login = React.lazy(() => import("./components/login"));


function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken")); // Ambil token dari localStorage

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary shadow-sm">
        <div className="container-fluid">
          

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/layanan" className="nav-link px-3">
                  Layanan
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/berita" className="nav-link px-3">
                  Berita
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/dokter" className="nav-link px-3">
                  Dokter
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/jadwaldokter" className="nav-link px-3">
                  Jadwal Dokter
                </NavLink>
              </li>

              <li className="nav-item">
                {token ? (
                  <NavLink className="nav-link px-3" to="/logout">
                    Logout
                  </NavLink>
                ) : (
                  <NavLink className="nav-link px-3" to="/login">
                    Login
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/layanan" element={<ProtectedRoute><LayananList /></ProtectedRoute>} />
        <Route path="/layanan/create" element={<ProtectedRoute><LayananCreate /></ProtectedRoute>} />
        <Route path="/layanan/edit/:id" element={<ProtectedRoute><LayananEdit /></ProtectedRoute>} />

        <Route path="/dokter" element={<ProtectedRoute><DokterList /></ProtectedRoute>} />
        <Route path="/dokter/create" element={<ProtectedRoute><DokterCreate /></ProtectedRoute>} />
        <Route path="/dokter/edit/:id" element={<ProtectedRoute><DokterEdit /></ProtectedRoute>} />

        <Route path="/berita" element={<ProtectedRoute><BeritaList /></ProtectedRoute>} />
        <Route path="/berita/create" element={<ProtectedRoute><BeritaCreate /></ProtectedRoute>} />
        <Route path="/berita/edit/:id" element={<ProtectedRoute><BeritaEdit /></ProtectedRoute>} />

        <Route path="/jadwaldokter" element={<ProtectedRoute><JadwalList /></ProtectedRoute>} />
        <Route path="/jadwaldokter/create" element={<ProtectedRoute><JadwalCreate /></ProtectedRoute>} />
        <Route path="/jadwaldokter/edit/:id" element={<ProtectedRoute><JadwalEdit /></ProtectedRoute>} />


      </Routes>
    </Router>
  );
}

export default App