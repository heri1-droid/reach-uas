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

  const [layanan, setLayanan] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mengambil data dokter berdasarkan ID
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://rsiarrasyid.com/api/layanan/${id}`)
      .then((response) => {
        console.log("Data yang diterima:", response.data);
        const data = response.data.result;
        setLayanan(data.layanan);
        setSlug(data.slug);
        setImage(data.image);
        setDesc(data.desc);
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
    setImage(file);
    setError(null);
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log nilai state sebelum dikirim
    console.log("State values before submit:");
    console.log("layanan:", layanan);
    console.log("slug:", slug);
    console.log("image:", image);
    console.log("desc:", desc);

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("_method", "PUT"); // Untuk Laravel PUT method
    formData.append("layanan", layanan.trim());
    formData.append("slug", slug.trim());
    formData.append("desc", desc.trim());
    if (image) {
      formData.append("image", image);
    }

    // Log isi FormData
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post( // Menggunakan POST dengan _method: PUT
        `https://rsiarrasyid.com/api/layanan/${id}`,
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
      navigate("/layanan");
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
              <h2 className="mb-4 text-center text-secondary">Edit Layanan</h2>

      <div className="card shadow-lg rounded-3 p-4">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="layanan" className="form-label text-muted">
              Nama Layanan
            </label>
            <input
              type="text"
              className="form-control shadow-sm rounded"
              id="layanan"
              value={layanan}
              onChange={(e) => {
                setLayanan(e.target.value);
                setError(null);
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="slug" className="form-label text-muted">
              Slug
            </label>
            <input
              type="text"
              className="form-control shadow-sm rounded"
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setError(null);
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="form-label text-muted">
              Image
            </label>
            <input
              type="file"
              className="form-control shadow-sm rounded"
              id="image"
              onChange={handleFileChange}
              accept="image/jpeg,image/png"
            />
            <small className="text-muted">
              Format: JPG/PNG, Maksimal 2MB
            </small>
          </div>

          <div className="mb-4">
            <label htmlFor="desc" className="form-label text-muted">
              Deskripsi
            </label>
            <textarea
              className="form-control shadow-sm rounded"
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