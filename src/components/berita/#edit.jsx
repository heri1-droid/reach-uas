/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";  // Mengimpor React, useState, dan useEffect dari library React
import { useParams, useNavigate } from "react-router-dom";  // Mengimpor useParams dan useNavigate dari react-router-dom untuk menangani parameter dan navigasi
import axios from "axios";  // Mengimpor axios untuk melakukan request HTTP

export default function Edit() {
    const { id } = useParams();  // Mengambil parameter "id" dari URL menggunakan useParams
    const navigate = useNavigate();  // Menggunakan useNavigate untuk navigasi setelah proses selesai
    const [judul, setJudul] = useState("");  // Menginisialisasi state 'nama' untuk menyimpan nama fakultas
    const [slug, setSlug] = useState("");  // Menginisialisasi state 'nama' untuk menyimpan nama fakultas
    const [image, setImage] = useState("");  // Menginisialisasi state 'nama' untuk menyimpan nama fakultas
    const [desc, setDesc] = useState("");  // Menginisialisasi state 'nama' untuk menyimpan nama fakultas

    const [listBerita, setListBerita] = useState([]);
    const [error, setError] = useState(null);  // Menginisialisasi state 'error' untuk menyimpan pesan error jika ada

    // Mengambil data fakultas berdasarkan id ketika komponen pertama kali dimuat
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/berita/${id}`)
            // Mengirimkan request GET untuk mendapatkan data fakultas berdasarkan ID
            .then((response) => {
                setJudul(response.data.result.judul);  // Jika sukses, mengisi state 'nama' dengan nama fakultas dari 
                setSlug(response.data.result.slug);  // Jika sukses, mengisi state 'nama' dengan nama fakultas dari response
                setImage(response.data.result.image);  // Jika sukses, mengisi state 'nama' dengan nama fakultas dari response
                setDesc(response.data.result.desc);  // Jika sukses, mengisi state 'nama' dengan nama fakultas dari response

            })
            .catch((error) => {
                console.error("Error fetching data:", error);  // Menampilkan pesan error di console jika request gagal
                setError("Data tidak ditemukan");  // Menampilkan pesan error jika data tidak ditemukan
            });

        axios
            .get("http://127.0.0.1:8000/api/berita") // Request ke API fakultas
            .then((response) => {
                setListBerita(response.data.data); // Menyimpan daftar fakultas ke dalam state 'listFakultas'
            })
            .catch((error) => {
                console.error("Error fetching fakultas data:", error); // Menangani error jika request gagal
            });
    }, [id]);  // useEffect akan dijalankan ulang setiap kali 'id' berubah

    // Menghandle perubahan input saat pengguna mengetik di form
    const handleChangeJudul = (e) => {
        setJudul(e.target.value);  // Mengubah state 'nama' sesuai dengan nilai input yang diisi pengguna
    };

    const handleChangeSlug = (e) => {
        setSlug(e.target.value);  // Mengubah state 'nama' sesuai dengan nilai input yang diisi pengguna
    };

    const handleChangeImage = (e) => {
        setImage(e.target.value);  // Mengubah state 'nama' sesuai dengan nilai input yang diisi pengguna
    };

    const handleChangeDesc= (e) => {
        setDesc(e.target.value);  // Mengubah state 'nama' sesuai dengan nilai input yang diisi pengguna
    };



    // Menghandle submit form untuk mengedit data fakultas
    const handleSubmit = (e) => {
        e.preventDefault();  // Mencegah reload halaman saat form disubmit
        axios
            .put(`http://127.0.0.1:8000/api/berita/${id}`, { judul, slug, image, desc })  // Mengirimkan request PATCH untuk mengupdate data fakultas berdasarkan ID
            .then((response) => {
                navigate("/berita");  // Jika update berhasil, navigasi kembali ke halaman list fakultas
            })
            .catch((error) => {
                console.error("Error updating data:", error);  // Menampilkan error di console jika ada kesalahan
                setError("Gagal mengupdate data");  // Mengubah state 'error' jika terjadi kesalahan dalam proses update
            });
    };

    return (
        <div>
            <h2>Edit Berita</h2>  {/* Menampilkan judul halaman */}
            {error && <p className="text-danger">{error}</p>}  {/* Menampilkan pesan error jika ada */}
            <form onSubmit={handleSubmit}>  {/* Form untuk mengedit nama fakultas */}
                <div className="mb-3">
                    <label htmlFor="judul" className="form-label">Judul Berita</label>  {/* Label untuk input nama */}
                    <input
                        type="text"
                        className="form-control"
                        id="judul"
                        value={judul}  // Mengisi nilai input dengan state 'nama'
                        onChange={handleChangeJudul}  // Mengubah nilai input saat ada perubahan (user mengetik)
                        required  // Input wajib diisi
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="slug" className="form-label">Slug</label>  {/* Label untuk input nama */}
                    <input
                        type="text"
                        className="form-control"
                        id="slug"
                        value={slug}  // Mengisi nilai input dengan state 'nama'
                        onChange={handleChangeSlug}  // Mengubah nilai input saat ada perubahan (user mengetik)
                        required  // Input wajib diisi
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image</label>  {/* Label untuk input nama */}
                    <input
                        type="text"
                        className="form-control"
                        id="image"
                        value={image}  // Mengisi nilai input dengan state 'nama'
                        onChange={handleChangeImage}  // Mengubah nilai input saat ada perubahan (user mengetik)
                        required  // Input wajib diisi
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="desc" className="form-label">Deskripsi</label>  {/* Label untuk input nama */}
                    <input
                        type="text"
                        className="form-control"
                        id="desc"
                        value={desc}  // Mengisi nilai input dengan state 'nama'
                        onChange={handleChangeDesc}  // Mengubah nilai input saat ada perubahan (user mengetik)
                        required  // Input wajib diisi
                    />
                </div>


                <button type="submit" className="btn btn-primary">Save</button>  {/* Tombol untuk submit form */}
            </form>
        </div>
    );
}