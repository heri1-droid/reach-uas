import React, { useState } from "react";
import axios from "axios";

export default function CreateDokter() {
    const [namaDokter, setNamaDokter] = useState("");
    const [foto, setFoto] = useState("null");
    const [desc, setDeskripsi] = useState("");
    const [spesialis, setSpesialis] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validation
        if (namaDokter.trim() === "") {
            setError("Nama Dokter is required");
            return;
        }

        if (!foto) {
            setError("Image is required");
            return;
        }
        if (desc.trim() === "") {
            setError("Deskripsi is required");
            return;
        }
        if (spesialis.trim() === "") {
            setError("Spesialis is required");
            return;
        }

        try {
            // Create FormData object for image
            const formData = new FormData();
            formData.append('foto', foto);

            // Send text fields as separate parameters
            const response = await axios.post(
                "https://rsiarrasyid.com/api/dokter",
                formData,
                {
                    params: {
                        nama: namaDokter,
                        desc: desc,
                        spesialis: spesialis

                    },
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 201) {
                setSuccess("Dokter created successfully!");
                // Reset form fields
                setNamaDokter("");
                setDeskripsi("");
                setFoto(null);
                setSpesialis("");
                // Clear file input
                document.getElementById('foto').value = '';
            } else {
                setError("Failed to create Dokter");
            }
        } catch (error) {
            setError("An error occurred while creating Dokter: " +
                (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center text-secondary">Tambah Dokter</h2>

            <div className="card shadow-lg rounded-3 p-4">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label text-muted">Nama Dokter</label>
                        <input
                            type="text"
                            className="form-control shadow-sm rounded"
                            id="namaDokter"
                            value={namaDokter}
                            onChange={(e) => setNamaDokter(e.target.value)}
                            placeholder="Enter Dokter Name"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted">Foto</label>
                        <input
                            type="file"
                            className="form-control shadow-sm rounded"
                            id="foto"
                            accept=".jpg,.jpeg,.png,.gif,.svg,.webp"
                            onChange={(e) => setFoto(e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted">Deskripsi</label>
                        <textarea
                            className="form-control shadow-sm rounded-3"
                            id="desc"
                            placeholder="Enter deskripsi"
                            rows="5"
                            value={desc}
                            onChange={(e) => setDeskripsi(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted">Spesialis</label>
                        <input
                            type="text"
                            className="form-control shadow-sm rounded"
                            id="spesialis"
                            value={spesialis}
                            onChange={(e) => setSpesialis(e.target.value)}
                            placeholder="Enter spesialis Name"
                            required
                        />
                    </div>

                    <div className="text-center mb-4">
                        <button
                            type="submit"
                            className="btn btn-primary shadow-sm rounded px-5 py-2"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}