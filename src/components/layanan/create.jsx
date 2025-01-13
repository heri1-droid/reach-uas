import React, { useState } from "react";
import axios from "axios";

export default function CreateLayanan() {
    const [namaLayanan, setNamaLayanan] = useState("");
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
        if (namaLayanan.trim() === "") {
            setError("Nama Layanan is required");
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
                "https://rsiarrasyid.com/api/layanan",
                formData,
                {
                    params: {
                        layanan: namaLayanan,
                        slug: slug,
                        desc: desc
                    },
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 201) {
                setSuccess("Layanan created successfully!");
                // Reset form fields
                setNamaLayanan("");
                setSlug("");
                setImage(null);
                setDeskripsi("");
                // Clear file input
                document.getElementById('image').value = '';
            } else {
                setError("Failed to create layanan");
            }
        } catch (error) {
            setError("An error occurred while creating layanan: " +
                (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center text-secondary">Tambah Layanan</h2>

            <div className="card shadow-lg rounded-3 p-4">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label text-muted">Nama Layanan</label>
                        <input
                            type="text"
                            className="form-control shadow-sm rounded"
                            id="namaLayanan"
                            value={namaLayanan}
                            onChange={(e) => setNamaLayanan(e.target.value)}
                            placeholder="Enter Layanan Name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-muted">Slug</label>
                        <input
                            type="text"
                            className="form-control shadow-sm rounded"
                            id="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="Enter Slug Name"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted">Image</label>
                        <input
                            type="file"
                            className="form-control shadow-sm rounded"
                            id="image"
                            accept=".jpg,.jpeg,.png,.gif,.svg,.webp"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-muted">Deskripsi</label>
                        <textarea
                            className="form-control shadow-sm rounded"
                            id="desc"
                            placeholder="Enter Deskripsi"
                            rows="5"
                            value={desc}
                            onChange={(e) => setDeskripsi(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary shadow-sm rounded px-5 py-1">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}