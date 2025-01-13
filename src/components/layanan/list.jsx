import React, { useEffect, useState } from "react"
import axios from 'axios'
import { NavLink } from "react-router-dom";

export default function LayananList() {
    // state fakultas
    const [layanan, setLayanan] = useState([]);

    useEffect(() => {
        axios
            .get("https://rsiarrasyid.com/api/layanan")
            .then((response) => {
                console.log(response);
                setLayanan(response.data.data)
            })
    }, [])

    const handleDelete = (id, layananName) => {
        window.Swal.fire({
            title: "Are you sure?",
            text: `You won't be able to revert this! Dokter: ${layananName}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                // Lakukan penghapusan jika dikonfirmasi
                axios
                    .delete(`https://rsiarrasyid.com/api/layanan/${id}`)
                    .then((response) => {
                        // Hapus fakultas dari state setelah sukses dihapus dari server
                        setLayanan(layanan.filter((f) => f.id !== id));
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
                <div className="card shadow-lg rounded-3 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">List Layanan</h2>
                        <NavLink
                            to="/layanan/Create"
                            className="btn btn-primary shadow-sm rounded">
                            <i className="fas fa-plus"></i> Tambah Layanan
                        </NavLink>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-bordered shadow-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th>Layanan</th>
                                    <th>Slug</th>
                                    <th>Image</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {layanan.map((data) => (
                                    <tr key={data.id}>
                                        <td>{data.layanan}</td>
                                        <td>{data.slug}</td>
                                        <td>
                                            <img
                                                src={`https://rsiarrasyid.com/storage/layanan/${data.image}`}
                                                alt={data.layanan}
                                                style={{ width: "100px", height: "auto", borderRadius: "8px" }}
                                            />
                                        </td>
                                        <td className="text-center">
                                            <NavLink
                                                to={`/layanan/edit/${data.id}`}
                                                className="btn btn-warning mx-1 shadow-sm rounded"
                                            >
                                                <i className="fas fa-edit"></i> Edit
                                            </NavLink>
                                            <button
                                                onClick={() => handleDelete(data.id, data.layanan)}
                                                className="btn btn-danger mx-1 shadow-sm rounded"
                                            >
                                                <i className="fas fa-trash-alt"></i> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </>


    )
}