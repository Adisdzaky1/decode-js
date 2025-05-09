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
    <title>WebCrack Decoder PRO</title>
    
    <!-- CDN Resources -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        
        .upload-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .upload-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 font-[Poppins]">
    
    <!-- Main Container -->
    <div class="container mx-auto px-4 py-12">
        <!-- Header -->
        <header class="text-center mb-16" data-aos="fade-down">
            <h1 class="text-5xl font-bold text-white mb-4">
                <span class="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    WebCrack
                </span>
                <span class="text-white">Decoder</span>
            </h1>
            <p class="text-gray-200 text-lg">Advanced File Decryption Solution</p>
        </header>

        <!-- Upload Card -->
        <div class="max-w-3xl mx-auto glass-card rounded-2xl p-8" data-aos="zoom-in">
            <div class="upload-container group">
                <form action="/api/decode" method="post" enctype="multipart/form-data">
                    <!-- Upload Area -->
                    <label class="flex flex-col items-center justify-center w-full h-64 cursor-pointer upload-hover 
                              border-4 border-dashed border-white/30 rounded-2xl bg-white/10 hover:bg-white/20
                              transition-all duration-300 relative overflow-hidden">
                              
                        <div class="upload-content text-center p-6">
                            <div class="upload-prompt">
                                <div class="flex justify-center mb-4">
                                    <div class="p-4 bg-white/10 rounded-full">
                                        <i class="fas fa-file-upload text-3xl text-purple-300"></i>
                                    </div>
                                </div>
                                <h3 class="text-xl font-semibold text-white mb-2">Drag & Drop Files</h3>
                                <p class="text-gray-200 text-sm">or <span class="text-purple-300 font-medium">browse</span> to upload</p>
                                <p class="text-gray-300 text-xs mt-2">Supported format: .txt</p>
                            </div>
                            
                            <div class="file-preview hidden absolute inset-0 bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center">
                                <i class="fas fa-file-alt text-3xl text-purple-300 mb-4"></i>
                                <span class="file-name text-white font-medium text-center px-4"></span>
                                <button type="button" class="change-file mt-4 text-purple-300 hover:text-purple-200 text-sm flex items-center">
                                    <i class="fas fa-sync-alt mr-2"></i>
                                    Change File
                                </button>
                            </div>
                        </div>
                        
                        <input type="file" name="file" class="opacity-0 absolute inset-0 w-full h-full cursor-pointer" required>
                    </label>

                    <!-- Action Buttons -->
                    <div class="mt-8 flex justify-center space-x-4">
                        <button type="submit" 
                                class="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 
                                       text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105
                                       flex items-center">
                            <i class="fas fa-lock-open mr-2"></i>
                            Decode Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="glass-card mt-24 py-6" data-aos="fade-up">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row items-center justify-between">
                <div class="text-center md:text-left mb-4 md:mb-0">
                    <p class="text-gray-200 text-sm">
                        © 2023 WebCrack Decoder. All rights reserved.<br>
                        <span class="text-gray-300">v2.0.1 PRO Edition</span>
                    </p>
                </div>
                <div class="flex items-center space-x-6">
                    <a href="https://t.me/Oficiallz" target="_blank" 
                       class="text-gray-300 hover:text-purple-300 transition-colors flex items-center"
                       data-aos="zoom-in" data-aos-delay="200">
                        <i class="fab fa-telegram-plane text-xl mr-2"></i>
                        <span class="font-medium">Developer Contact</span>
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-in-out'
        });

        // File Upload Logic
        const fileInput = document.querySelector('input[type="file"]');
        const uploadPrompt = document.querySelector('.upload-prompt');
        const filePreview = document.querySelector('.file-preview');
        const fileName = document.querySelector('.file-name');
        const changeFileBtn = document.querySelector('.change-file');

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                uploadPrompt.parentElement.style.display = 'none';
                filePreview.style.display = 'flex';
                fileName.textContent = file.name;
            }
        });

        changeFileBtn.addEventListener('click', () => fileInput.click());
        
        // Drag & Drop Functionality
        const uploadArea = document.querySelector('label');
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-purple-400', 'bg-white/30');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('border-purple-400', 'bg-white/30');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-purple-400', 'bg-white/30');
            fileInput.files = e.dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        });
    </script>
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
