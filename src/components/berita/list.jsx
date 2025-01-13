import React, { useEffect, useState } from "react"
import axios from 'axios'
import { NavLink } from "react-router-dom";

export default function BeritaList() {
    // state fakultas
    const [berita, setBerita] = useState([]);

    useEffect(() => {
        axios
            .get("https://rsiarrasyid.com/api/berita")
            .then((response) => {
                console.log(response);
                setBerita(response.data.data)
            })
    }, [])


    const handleDelete = (id, judul) => {
        window.Swal.fire({
            title: "Are you sure?",
            text: `You won't be able to revert this! Dokter: ${judul}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                // Lakukan penghapusan jika dikonfirmasi
                axios
                    .delete(`https://rsiarrasyid.com/api/berita/${id}`)
                    .then((response) => {
                        // Hapus fakultas dari state setelah sukses dihapus dari server
                        setBerita(berita.filter((f) => f.id !== id));
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
            <div className="container mt-5">
                <h2 className="text-center mb-4">Daftar Berita</h2>
                <div className="d-flex justify-content-end mb-3">
                    <NavLink to="/berita/Create" className="btn btn-primary">
                        Tambah Berita
                    </NavLink>
                </div>
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Judul</th>
                                <th>Slug</th>
                                <th>Gambar</th>
                                <th className="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {berita.map((data) => (
                                <tr key={data.id}>
                                    <td>{data.judul}</td>
                                    <td>{data.slug}</td>
                                    <td>
                                        <img
                                            src={`https://rsiarrasyid.com/storage/artikel/${data.image}`}
                                            alt={data.judul}
                                            className="img-thumbnail"
                                            style={{ maxWidth: "100px", height: "auto" }}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <NavLink
                                            to={`/berita/edit/${data.id}`}
                                            className="btn btn-warning btn-sm me-2"
                                        >
                                            Edit
                                        </NavLink>
                                        <button
                                            onClick={() => handleDelete(data.id, data.judul)}
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

        </>
    )
}