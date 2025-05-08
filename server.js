// File: server.js
// Server Express.js untuk menjalankan deobfuscate JavaScript menggunakan webcrack
const express = require("express");
const fileUpload = require("express-fileupload");      // middleware untuk menangani file upload
const { webcrack } = require("webcrack");             // library deobfuscate JavaScript
const app = express();

// Gunakan express-fileupload sebagai middleware
app.use(fileUpload());

// Endpoint utama "/" menampilkan halaman HTML dengan form upload .js
app.get("/", (req, res) => {
  // HTML sederhana dengan form upload file JavaScript
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebCrack Decoder</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
    <!-- Main Content -->
    <div class="container mx-auto px-4 py-16">
        <div class="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
            <h1 class="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                WebCrack Decoder
            </h1>
            
            <form action="/api/decode" method="post" enctype="multipart/form-data" class="space-y-6">
                <div class="flex items-center justify-center w-full">
                    <label class="flex flex-col w-full h-32 border-4 border-dashed hover:border-gray-400 transition-all duration-300 cursor-pointer rounded-xl items-center justify-center bg-gray-50 hover:bg-gray-100">
                        <div class="flex flex-col items-center justify-center pt-7">
                            <i class="fas fa-cloud-upload-alt text-3xl text-blue-600 mb-2"></i>
                            <p class="text-sm text-gray-600">
                                <span class="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p class="text-xs text-gray-500 mt-1">File format supported: .txt</p>
                        </div>
                        <input type="file" name="file" class="opacity-0 absolute" required>
                    </label>
                </div>

                <button type="submit" class="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center">
                    <i class="fas fa-unlock-alt mr-2"></i>
                    Decode File
                </button>
            </form>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gradient-to-r from-purple-700/90 to-blue-700/90 backdrop-blur-sm mt-12">
        <div class="container mx-auto px-4 py-6">
            <div class="flex flex-col md:flex-row items-center justify-between">
                <div class="text-white text-sm mb-4 md:mb-0">
                    <p class="mb-1">© 2023 WebCrack Decoder. All rights reserved.</p>
                    <p class="text-white/80">Developed with <i class="fas fa-heart text-red-400"></i> by the community</p>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="https://t.me/Oficiallz" target="_blank" class="text-white hover:text-blue-200 transition-colors duration-300 flex items-center">
                        <i class="fab fa-telegram-plane mr-2"></i>
                        @Oficiallz
                    </a>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>`;
  res.send(html);
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
