const multer = require('multer');
const { webcrack } = require('webcrack');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage });
/*
server.get("/", (request, response) => {
    response.render("index", { 
        message: "Welcome in Express !" 
    });
});*/

server.post('/api/decode', upload.single('file'), async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).send('No file uploaded');
    }

    // Read uploaded file
    const fileContent = fs.readFileSync(request.file.path, 'utf8');
    
    // Process with WebCrack
    const result = await webcrack(fileContent);
    
    // Generate decoded filename
    const originalName = request.file.originalname;
    const decodedFilename = `decode-${path.parse(originalName).name}.js`;
    
    // Set response headers for download
    response.setHeader('Content-Disposition', `attachment; filename="${decodedFilename}"`);
    response.setHeader('Content-Type', 'application/javascript');
    
    // Send decoded content
    response.send(result.code);
    
    // Cleanup temporary file
    fs.unlinkSync(request.file.path);
  } catch (error) {
    console.error('Decode error:', error);
    response.status(500).send('Error processing file: ' + error.message);
  }
});
