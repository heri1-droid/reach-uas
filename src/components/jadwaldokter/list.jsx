import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function JadwaldokterList() {
    const [schedules, setSchedules] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedulesAndDoctors();
    }, []);

    const fetchSchedulesAndDoctors = async () => {
        try {
            setLoading(true);

            // Fetch schedules and doctors in parallel
            const [schedulesResponse, doctorsResponse] = await Promise.all([
                axios.get("https://rsiarrasyid.com/api/jadwaldokter"),
                axios.get("https://rsiarrasyid.com/api/dokter"),
            ]);

            // Map doctors by ID for quick access
            const doctorsMap = {};
            doctorsResponse.data.data.forEach((doctor) => {
                doctorsMap[doctor.id] = doctor.nama;
            });

            // Add doctor name to each schedule
            const schedulesWithDoctors = schedulesResponse.data.data.map((schedule) => ({
                ...schedule,
                doctorName: doctorsMap[schedule.doctor_id] || "Dokter tidak ditemukan",
            }));

            setSchedules(schedulesWithDoctors);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Gagal mengambil data: " + (err.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        window.Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`https://rsiarrasyid.com/api/jadwaldokter/${id}`)
                    .then(() => {
                        Swal.fire("Deleted!", "Your data has been deleted.", "success");
                        fetchSchedulesAndDoctors(); // Refresh data after deletion
                    })
                    .catch((error) => {
                        console.error("Error deleting data:", error);
                        Swal.fire("Error", "There was an issue deleting the data.", "error");
                    });
            }
        });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!schedules || schedules.length === 0) {
        return <div className="alert alert-info">Tidak ada jadwal dokter yang tersedia.</div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Daftar Jadwal Dokter</h2>
                <Link to="/jadwaldokter/create" className="btn btn-primary">
                    Tambah Jadwal
                </Link>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col" className="text-center">No</th>
                            <th scope="col">Hari</th>
                            <th scope="col">Waktu Mulai</th>
                            <th scope="col">Waktu Selesai</th>
                            <th scope="col">Nama Dokter</th>
                            <th scope="col" className="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((schedule, index) => (
                            <tr key={schedule.id || index}>
                                <td className="text-center">{index + 1}</td>
                                <td>{schedule.day || "-"}</td>
                                <td>{schedule.start_time || "-"}</td>
                                <td>{schedule.end_time || "-"}</td>
                                <td>{schedule.doctorName}</td>
                                <td className="text-center">
                                    <Link
                                        to={`/jadwaldokter/edit/${schedule.id}`}
                                        className="btn btn-warning btn-sm me-2"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(schedule.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
