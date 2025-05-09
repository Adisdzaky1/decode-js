// File: server.js
// Server Express.js untuk menjalankan deobfuscate JavaScript menggunakan webcrack
const express = require("express");
const fileUpload = require("express-fileupload");      // middleware untuk menangani file upload
const { webcrack } = require("webcrack");             // library deobfuscate JavaScript
const app = express();
const fs = require("fs");
const path = require("path");
// Gunakan express-fileupload sebagai middleware
app.use(fileUpload());

// Endpoint utama "/" menampilkan halaman HTML dengan form upload .js
app.get("/", (req, res) => {
  // HTML sederhana dengan form upload file JavaScript
  const html = ``;
  res.send(path.join(__dirname, "./", "inde.html"));
});

// Endpoint "/api/decode" menerima file .js, memprosesnya, dan mengembalikan hasil decode
app.post("/api/decode", async (req, res) => {
  // Pastikan ada file yang diupload
  if (!req.files || !req.files.file) {
    return res.status(400).send("Tidak ada file yang diunggah.");
  }
  const jsFile = req.files.file;            // Ambil objek file dari request
  const originalName = jsFile.name;         // Nama file asli yang diupload

  try {
    // Baca isi file .js sebagai teks (utf-8)
    const content = jsFile.data.toString("utf8");

    // Proses deobfuscation menggunakan webcrack
    const result = await webcrack(content);

    // Ambil kode yang sudah didecode
    const decodedCode = result.code;

    // Buat nama file output dengan prefix "deob-"
    const outputName = "deob-" + originalName;

    // Atur header agar browser mendownload file sebagai lampiran
    res.setHeader('Content-Disposition', `attachment; filename="${outputName}"`);
    res.setHeader('Content-Type', 'application/javascript');

    // Kirim isi kode hasil decode sebagai respon (file untuk didownload)
    res.send(decodedCode);
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan saat memproses file: " + err.message);
  }
});

// Export app untuk digunakan oleh Vercel
module.exports = app;
