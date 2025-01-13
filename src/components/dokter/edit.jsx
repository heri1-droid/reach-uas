/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Setup axios interceptor untuk debugging
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
      console.log("Response headers:", error.response.headers);
      console.log("Error detail:", error);
    }
    return Promise.reject(error);
  }
);

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [desc, setDesc] = useState("");
  const [spesialis, setSpesialis] = useState("");
  const [foto, setFoto] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mengambil data dokter berdasarkan ID
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://rsiarrasyid.com/api/dokter/${id}`)
      .then((response) => {
        console.log("Data yang diterima:", response.data);
        const data = response.data.result;
        setNama(data.nama);
        setDesc(data.desc);
        setSpesialis(data.spesialis);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Data tidak ditemukan.");
        setLoading(false);
      });
  }, [id]);

  // Handler untuk perubahan input file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file);

    // Validasi ukuran file (maksimal 2MB)
    if (file && file.size > 2 * 1024 * 1024) {
      setError("Ukuran file tidak boleh lebih dari 2MB");
      return;
    }
    // Validasi tipe file
    if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
      setError("Format file harus JPG atau PNG");
      return;
    }
    setFoto(file);
    setError(null);
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log nilai state sebelum dikirim
    console.log("State values before submit:");
    console.log("nama:", nama);
    console.log("desc:", desc);
    console.log("spesialis:", spesialis);
    console.log("foto:", foto);

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("_method", "PUT"); // Untuk Laravel PUT method
    formData.append("nama", nama.trim());
    formData.append("desc", desc.trim());
    formData.append("spesialis", spesialis.trim());
    if (foto) {
      formData.append("foto", foto);
    }

    // Log isi FormData
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post( // Menggunakan POST dengan _method: PUT
        `https://rsiarrasyid.com/api/dokter/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          },
        }
      );

      console.log("Response sukses:", response.data);
      navigate("/dokter");
    } catch (error) {
      console.error("Error detail:", error);
      if (error.response) {
        console.log("Error response data:", error.response.data);
        const errorMessage = error.response.data.message || "Gagal mengupdate data.";
        if (error.response.data.errors) {
          // Menampilkan semua pesan error validasi
          const validationErrors = Object.values(error.response.data.errors).flat();
          setError(validationErrors.join(", "));
        } else {
          setError(errorMessage);
        }
      } else {
        setError("Terjadi kesalahan pada server.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-lg rounded-3 p-4">
        <h2 className="mb-4 text-center text-secondary">Edit Dokter</h2>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="nama" className="form-label text-muted">
              Nama Dokter
            </label>
            <input
              type="text"
              className="form-control shadow-sm rounded"
              id="nama"
              value={nama}
              onChange={(e) => {
                setNama(e.target.value);
                setError(null);
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="desc" className="form-label text-muted">
              Deskripsi
            </label>
            <textarea
              className="form-control shadow-sm rounded-3"
              id="desc"
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
                setError(null);
              }}
              required
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="spesialis" className="form-label text-muted">
              Spesialis
            </label>
            <input
              type="text"
              className="form-control shadow-sm rounded"
              id="spesialis"
              value={spesialis}
              onChange={(e) => {
                setSpesialis(e.target.value);
                setError(null);
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="foto" className="form-label text-muted">
              Foto
            </label>
            <input
              type="file"
              className="form-control shadow-sm rounded"
              id="foto"
              onChange={handleFileChange}
              accept="image/jpeg,image/png"
            />
            <small className="text-muted">
              Format: JPG/PNG, Maksimal 2MB
            </small>
          </div>

          <div className="mb-4 text-center">
            <button
              type="submit"
              className="btn btn-primary shadow-sm rounded px-5 py-2"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              className="btn btn-secondary shadow-sm rounded ms-2 px-5 py-2"
              onClick={() => navigate("/dokter")}
              disabled={loading}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>

  );
}