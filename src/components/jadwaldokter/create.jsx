import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function JadwalDokterCreate() {
    const navigate = useNavigate();

    // State untuk menyimpan daftar dokter
    const [doctors, setDoctors] = useState([]);

    // State untuk form input
    const [formData, setFormData] = useState({
        doctor_id: '',
        day: '',
        start_time: '',
        end_time: ''
    });

    // Daftar hari dalam seminggu
    const days = [
        'Senin', 'Selasa', 'Rabu', 'Kamis',
        'Jumat', 'Sabtu', 'Minggu'
    ];

    // Ambil daftar dokter saat komponen dimuat
    useEffect(() => {
        axios.get("https://rsiarrasyid.com/api/dokter")
            .then((response) => {
                setDoctors(response.data.data);
            })
            .catch((error) => {
                console.error("Terjadi kesalahan:", error);
            });
    }, []);

    // Handler untuk mengubah input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handler untuk submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi input
        if (!formData.doctor_id || !formData.day || !formData.start_time || !formData.end_time) {
            alert('Semua field harus diisi');
            return;
        }

        // Kirim data ke backend
        axios.post("https://rsiarrasyid.com/api/jadwaldokter", formData)
            .then((response) => {
                // Redirect ke halaman list setelah berhasil
                navigate('/jadwaldokter');
            })
            .catch((error) => {
                console.error("Terjadi kesalahan:", error.response ? error.response.data : error);
                alert('Gagal menyimpan jadwal dokter');
            });
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center text-secondary">Tambah Jadwal Dokter</h2>

            <div className="card shadow-lg rounded-3 p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label text-muted">Nama Dokter</label>
                        <select
                            className="form-select shadow-sm rounded"
                            name="doctor_id"
                            value={formData.doctor_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Pilih Dokter</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.nama}
                                </option>
                            ))}
                        </select>
                    </div>

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
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}