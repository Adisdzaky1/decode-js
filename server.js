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
const JsConfuser = require("js-confuser");

// Fungsi pembuat konfigurasi obfuscation
const getBigObfuscationConfig = (flatteningLevel = 0.75) => {
    const generateBigName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const length = Math.floor(Math.random() * 5) + 5;
        let name = "";
        for (let i = 0; i < length; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateBigName(),

        stringConcealing: true,
        stringEncoding: true,
        stringSplitting: true,

        controlFlowFlattening: flatteningLevel,
        flatten: true,

        shuffle: true,
        rgf: true,
        calculator: true,

        duplicateLiteralsRemoval: true,
        deadCode: true,
        opaquePredicates: true,

        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true,
        },
    };
};

// Endpoint utama "/" menampilkan halaman HTML dengan form upload .js
app.get("/", (req, res) => {
  // HTML sederhana dengan form upload file JavaScript
  const html = ``;
  res.send(fs.readFileSync(path.join(__dirname, 'inde.html'), 'utf8'));
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






app.post("/api/encode", async (req, res) => {
    const { level, mb } = req.query;
    const jsFile = req.files.file; 
    const originalName = jsFile.name;
    
    
      // Baca isi file .js sebagai teks (utf-8)
    const content = jsFile.data.toString("utf8");
    
    let flatteningLevel = parseFloat(level);
    if (isNaN(flatteningLevel) || flatteningLevel < 0.1 || flatteningLevel > 1.0) {
        flatteningLevel = 0.75;
    }

    try {
        const obfuscated = await JsConfuser.obfuscate(content, getBigObfuscationConfig(flatteningLevel));
        let obfCode = obfuscated.code;

        // Tambahkan padding jika user menentukan ukuran file (dalam MB)
        const desiredSizeMb = parseFloat(mb);
        if (!isNaN(desiredSizeMb) && desiredSizeMb > 0) {
            const desiredBytes = desiredSizeMb * 1024 * 1024;
            const currentBytes = Buffer.byteLength(obfCode, "utf8");

            if (currentBytes < desiredBytes) {
                const paddingBytes = desiredBytes - currentBytes;
                const dummyData = `\n// PAD_START\nvar _pad = "${"X".repeat(paddingBytes - 30)}";\n// PAD_END\n`;
                obfCode += dummyData;
            }
        }

        const outputName = "ench-" + originalName;
    // Atur header agar browser mendownload file sebagai lampiran
    res.setHeader('Content-Disposition', `attachment; filename="${outputName}"`);
    res.setHeader('Content-Type', 'application/javascript');
    
        res.send(obfCode);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal melakukan obfuscation.", detail: err.message });
    }
});

// Start server

// Export app untuk digunakan oleh Vercel
module.exports = app;
