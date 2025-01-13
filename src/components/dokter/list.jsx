import React, { useEffect, useState } from "react"
import axios from 'axios'
import { NavLink } from "react-router-dom";


export default function DokterList() {
    // state fakultas
    const [dokter, setDokter] = useState([]);

    useEffect(() => {
        axios
            .get("https://rsiarrasyid.com/api/dokter")
            .then((response) => {
                console.log(response);
                setDokter(response.data.data)
            })
    }, [])

    const handleDelete = (id, nama) => {
        window.Swal.fire({
            title: "Are you sure?",
            text: `You won't be able to revert this! Dokter: ${nama}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                // Lakukan penghapusan jika dikonfirmasi
                axios
                    .delete(`https://rsiarrasyid.com/api/dokter/${id}`)
                    .then((response) => {
                        // Hapus fakultas dari state setelah sukses dihapus dari server
                        setDokter(dokter.filter((f) => f.id !== id));
                        // Tampilkan notifikasi sukses
                        Swal.fire("Deleted!", "Your data has been deleted.", "success");
                    })
                    .catch((error) => {
                        console.error("Error deleting data:", error); // Menangani error
                        Swal.fire(
                            "Error",
                            "There was an issue deleting the data.",
                            "error"
                        );
                    });
            }
        });
    };

    return (
        <>
            <div className="container mt-4">
            <h2 className="mb-4 text-center text-secondary">List Dokter</h2>

                <div className="card shadow-lg rounded-3 p-4">
                    <div className="d-flex justify-content-end mb-3">
                        <NavLink to="/dokter/Create" className="btn btn-primary shadow-sm rounded">
                            Tambah Dokter
                        </NavLink>
                    </div>
                    <table className="table table-striped table-bordered shadow-sm rounded-3">
                        <thead className="table-light">
                            <tr>
                                <th>Nama Dokter</th>
                                <th>Foto</th>
                                <th>Spesialis</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dokter.map((data) => (
                                <tr key={data.id}>
                                    <td>{data.nama}</td>
                                    <td>
                                        <img
                                            src={`https://rsiarrasyid.com/storage/doctor/${data.foto}`}
                                            alt={data.nama}
                                            style={{ width: "100px", height: "auto", borderRadius: "10px" }}
                                        />
                                    </td>
                                    <td>{data.spesialis}</td>
                                    <td>
                                        <NavLink
                                            to={`/dokter/edit/${data.id}`}
                                            className="btn btn-warning shadow-sm rounded"
                                        >
                                            Edit
                                        </NavLink>
                                        <button
                                            onClick={() => handleDelete(data.id, data.nama)}
                                            className="btn btn-danger ms-2 shadow-sm rounded"
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


        </>
    )
}