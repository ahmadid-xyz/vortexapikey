const express = require("express");
const cors = require("cors");
const secure = require("ssl-express-www");
const os = require("os");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const ptz = require("./function/index");

const app = express();
app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(secure);
const port = 3000;

// Multer untuk upload file langsung
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint untuk mendapatkan stats server
app.get('/stats', (req, res) => {
 const stats = {
 platform: os.platform(),
 architecture: os.arch(),
 totalMemory: os.totalmem(),
 freeMemory: os.freemem(),
 uptime: os.uptime(),
 cpuModel: os.cpus()[0].model,
 numCores: os.cpus().length,
 loadAverage: os.loadavg(),
 hostname: os.hostname(),
 networkInterfaces: os.networkInterfaces(),
 osType: os.type(),
 osRelease: os.release(),
 userInfo: os.userInfo(),
 processId: process.pid,
 nodeVersion: process.version,
 execPath: process.execPath,
 cwd: process.cwd(),
 memoryUsage: process.memoryUsage()
 };
 res.json(stats);
});

// Endpoint utama
app.get('/', (req, res) => {
 res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint untuk konversi file di server ke Base64 (query parameter)
app.get('/api/tobase64', async (req, res) => {
 try {
 const filePath = req.query.file;
 if (!filePath) {
 return res.status(400).json({ error: 'Parameter "file" tidak ditemukan' });
 }

 if (!fs.existsSync(filePath)) {
 return res.status(404).json({ error: 'File tidak ditemukan' });
 }

 const base64String = await ptz.tobase64(filePath);
 res.status(200).json({
 status: 200,
 creator: "Vortex Apis",
 data: { base64: base64String }
 });
 } catch (error) {
 res.status(500).json({ error: error.message });
 }
});

// Endpoint untuk upload file langsung dan konversi ke Base64
app.post('/api/tobase64', upload.single('file'), async (req, res) => {
 try {
 if (!req.file) {
 return res.status(400).json({ error: 'File tidak ditemukan' });
 }

 const base64String = req.file.buffer.toString('base64');
 res.status(200).json({
 status: 200,
 creator: "Vortex Apis",
 data: { base64: base64String }
 });
 } catch (error) {
 res.status(500).json({ error: error.message });
 }
});

// Middleware 404
app.use((req, res) => {
 res.status(404).send("Halaman tidak ditemukan");
});

// Middleware error handling
app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).send('Ada kesalahan pada server');
});

// Jalankan server
app.listen(port, () => {
 console.log(`Server berjalan di http://localhost:${port}`);
});