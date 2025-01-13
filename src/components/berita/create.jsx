import React, { useState } from "react";
import axios from "axios";

export default function CreateBerita() {
    const [namaJudul, setNamaJudul] = useState("");
    const [slug, setSlug] = useState("");
    const [image, setImage] = useState(null);
    const [desc, setDeskripsi] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validation
        if (namaJudul.trim() === "") {
            setError("Nama Judul is required");
            return;
        }
        if (slug.trim() === "") {
            setError("Slug is required");
            return;
        }
        if (!image) {
            setError("Image is required");
            return;
        }
        if (desc.trim() === "") {
            setError("Deskripsi is required");
            return;
        }

        try {
            // Create FormData object for image
            const formData = new FormData();
            formData.append('image', image);

            // Send text fields as separate parameters
            const response = await axios.post(
                "https://rsiarrasyid.com/api/berita",
                formData,
                {
                    params: {
                        judul: namaJudul,
                        slug: slug,
                        desc: desc
                    },
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 201) {
                setSuccess("Berita created successfully!");
                // Reset form fields
                setNamaJudul("");
                setSlug("");
                setImage(null);
                setDeskripsi("");
                // Clear file input
                document.getElementById('image').value = '';
            } else {
                setError("Failed to create Berita");
            }
        } catch (error) {
            setError("An error occurred while creating Berita: " +
                (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Tambah Berita</h2>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            {success && (
                <div className="alert alert-success" role="alert">
                    {success}
                </div>
            )}
            <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <div className="form-group mb-4">
                    <label htmlFor="namaJudul" className="form-label">Judul</label>
                    <input
                        type="text"
                        className="form-control"
                        id="namaJudul"
                        value={namaJudul}
                        onChange={(e) => setNamaJudul(e.target.value)}
                        placeholder="Masukkan judul berita"
                        required
                    />
                </div>

                <div className="form-group mb-4">
                    <label htmlFor="slug" className="form-label">Slug</label>
                    <input
                        type="text"
                        className="form-control"
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="Masukkan slug berita"
                        required
                    />
                </div>

                <div className="form-group mb-4">
                    <label htmlFor="image" className="form-label">Gambar</label>
                    <input
                        type="file"
                        className="form-control"
                        id="image"
                        accept=".jpg,.jpeg,.png,.gif,.svg,.webp"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <small className="form-text text-muted">
                        Format yang didukung: JPG, PNG, GIF, SVG, WEBP.
                    </small>
                </div>

                <div className="form-group mb-4">
                    <label htmlFor="desc" className="form-label">Deskripsi</label>
                    <textarea
                        className="form-control"
                        id="desc"
                        rows="5"
                        value={desc}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        placeholder="Masukkan deskripsi berita"
                        required
                    ></textarea>
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary px-5 py-2">
                        Buat Berita
                    </button>
                </div>
            </form>
        </div>

    );
}