const express = require('express');
const bodyParser = require("body-parser");
const fs = require("fs");
const serverless = require("serverless-http"); // install via npm
const path = require("path");

const app = express();

app.use(require("morgan")("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", "./views");
app.set("view engine", "ejs");


const multer = require('multer');
const { webcrack } = require('webcrack');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage });

app.get("/", (request, response) => {
    response.render("index", { 
        message: "Welcome in Express !" 
    });
});

app.post('/api/decode', upload.single('file'), async (request, response) => {
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

/*fs.readdirSync(path.join(__dirname, "routes")).forEach(file => {
    app.use("/", require(path.join(__dirname, "routes", file)));
});*/

app.get("*", (req, res) => {
    res.status(404).render("error");
});

// Export sebagai serverless function:
module.exports = serverless(app);
