/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react"; // Mengimpor React, useState, dan useEffect dari library React
import { useParams, useNavigate } from "react-router-dom"; // Mengimpor useParams dan useNavigate dari react-router-dom untuk menangani parameter dan navigasi
import axios from "axios"; // Mengimpor axios untuk melakukan request HTTP

export default function Edit() {
    const { id } = useParams(); // Mengambil parameter "id" dari URL menggunakan useParams
    const navigate = useNavigate(); // Menggunakan useNavigate untuk navigasi setelah proses selesai

    const [formData, setFormData] = useState({
        day: "",
        start_time: "",
        end_time: "",
        doctor_id: "",
    }); // State untuk menyimpan data form

    const [listDokter, setListDokter] = useState([]); // State untuk daftar dokter
    const [error, setError] = useState(null); // State untuk menyimpan pesan error jika ada

    const days = [
        "Senin", "Selasa", "Rabu", "Kamis",
        "Jumat", "Sabtu", "Minggu"
    ];

    // Mengambil data jadwal dokter berdasarkan id ketika komponen pertama kali dimuat
    useEffect(() => {
        axios
            .get(`https://rsiarrasyid.com/api/jadwaldokter/${id}`)
            .then((response) => {
                const data = response.data.result;
                setFormData({
                    day: data.day,
                    start_time: data.start_time,
                    end_time: data.end_time,
                    doctor_id: data.doctor_id,
                });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError("Data tidak ditemukan");
            });

        axios
            .get("https://rsiarrasyid.com/api/dokter")
            .then((response) => {
                setListDokter(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching Dokter data:", error);
            });
    }, [id]);

    // Menghandle perubahan input saat pengguna mengetik di form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Menghandle submit form untuk mengedit data jadwal dokter
    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .put(`https://rsiarrasyid.com/api/jadwaldokter/${id}`, formData)
            .then((response) => {
                navigate("/jadwaldokter");
            })
            .catch((error) => {
                console.error("Error updating data:", error);
                setError("Gagal mengupdate data");
            });
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center text-secondary">Edit Jadwal Dokter</h2>

            <div className="card shadow-lg rounded-3 p-4">
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label className="form-label text-muted">Hari</label>
                        <select
                            className="form-select shadow-sm rounded"
                            name="day"
                            value={formData.day}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Pilih Hari</option>
                            {days.map((day) => (
                                <option key={day} value={day}>
                                    {day}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted">Waktu Mulai</label>
                        <input
                            type="time"
                            className="form-control shadow-sm rounded"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted">Waktu Selesai</label>
                        <input
                            type="time"
                            className="form-control shadow-sm rounded"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="d-flex justify-content-center mb-4">
                        <button
                            type="submit"
                            className="btn btn-primary shadow-sm rounded px-5 py-2"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}
