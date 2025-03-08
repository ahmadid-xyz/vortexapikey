var express = require("express"), cors = require("cors"), secure = require("ssl-express-www");
const path = require('path');
const os = require('os');
const fs = require('fs');
const axios = require('axios')

var app = express();
app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(secure);
const port = 3000;

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

app.get('/api/lahelu', async (req, res) => {
 const { q } = req.query;

 if (!q) {
 return res.status(400).json({ status: false, error: "Query parameter 'q' is required" });
 }

 try {
 const { laheluSearch } = require('./scrape')
 const response = await laheluSearch(q); res.status(200).json({
 status: true,
 creator: 'Vortex Apis',
 data: response
 });
 } catch (error) {
 res.status(500).json({ status: false, error: error.message });
 }
});

app.get('/api/utf8', (req, res) => {
    const { encodedText } = req.query;

    if (!encodedText) {
        return res.status(400).json({ status: false, error: "Query parameter 'encodedText' is required" });
    }

    try {
        const { utf8 } = require('./scrape');
        const decodedText = utf8(encodedText);

        res.status(200).json({
            status: true,
            creator: 'Vortex Apis',
            decodedText: decodedText
        });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

app.get('/api/toBase64', (req, res) => {
    const { text } = req.query;

    if (!text) {
        return res.status(400).json({ status: false, error: "Query parameter 'text' is required" });
    }

    try {
        const { toBase64 } = require('./scrape');
        const base64Text = toBase64(text);
        
        res.status(200).json({
            status: true,
            creator: 'Vortex Apis',
            base64: base64Text
        });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

app.get('/api/githubSearch', async (req, res) => {
 const { q } = req.query;

 if (!q) {
 return res.status(400).json({ status: false, error: "Query parameter 'q' is required" });
 }

 try {
 const { githubSearch } = require('./scrape')
 const response = await githubSearch(q); res.status(200).json({
 status: true,
 creator: 'Vortex Apis',
 data: response
 });
 } catch (error) {
 res.status(500).json({ status: false, error: error.message });
 }
});

app.get('/api/pin', async (req, res) => {
 const { q } = req.query;
 if (!q) {
 return res.status(400).json({ status: false, error: "Query parameter 'q' is required" });
 }

 try {
 const { pin } = require('./scrape')
 const response = await pin(q);
 res.status(200).json({
 status: true,
 creator: 'Vortex Apis',
 data: response
 });
 } catch (error) {
 res.status(500).json({ status: false, error: error.message });
 }
});

app.get('/api/ttstalk', async (req, res) => {
 const { q } = req.query;
 if (!q) {
 return res.status(400).json({ status: false, error: "Query parameter 'q' is required" });
 }
 try {
 const { ttstalk } = require('./scrape')
 const response = await ttstalk(q); res.status(200).json({
 status: true,
 creator: 'Vortex Apis',
 data: response
 });
 } catch (error) {
 res.status(500).json({ status: false, error: error.message });
 }
});

app.get('/api/npmStalk', async (req, res) => {
 const { q } = req.query;

 if (!q) {
 return res.status(400).json({ status: false, error: "Query parameter 'q' is required" });
 }

 try {
 const { npmStalk } = require('./scrape')
 const response = await npmStalk(q); res.status(200).json({
 status: true,
 creator: 'Vortex Apis',
 data: response
 });
 } catch (error) {
 res.status(500).json({ status: false, error: error.message });
 }
});

app.get('/api/ffStalk', async (req, res) => {
 const { q } = req.query;
 if (!q) {
 return res.status(400).json({ status: false, error: "Query parameter 'q' is required" });
 }
 try {
 const { ffStalk } = require('./scrape')
 const response = await ffStalk.stalk(q);
 res.status(200).json({
 status: true,
 creator: 'Vortex Apis',
 data: response
 });
 } catch (error) {
 res.status(500).json({ status: false, error: error.message });
 }
});

app.get('/api/viooai', async (req, res) => {
 const { q } = req.query;

 if (!q) {
 return res.status(400).json({ status: false, error: "Query parameter 'q' is required" });
 }

 try {
 const { viooai } = require('./scrape')
 const response = await viooai(q); res.status(200).json({
 status: true,
 creator: 'Vortex Apis',
 data: response
 });
 } catch (error) {
 res.status(500).json({ status: false, error: error.message });
 }
});

app.get('/api/orkut/createPayment', async (req, res) => {
 const { amount, codeqr } = req.query;

 if (!amount) {
 return res.status(400).json({ status: false, error: "Tolong masukkan harganya" });
 }
 if (!codeqr) {
 return res.status(400).json({ status: false, error: "Tolong masukkan codeqr" });
 }

 try {
 const { createPayment } = require('./scrape')
 const response = await createPayment(amount, codeqr); 
 res.status(200).json({
 status: true,
 creator: 'Vortex Apis',
 data: response.result
 });
 } catch (error) {
 res.status(500).json({ status: false, error: error.message });
 }
});

app.use((req, res, next) => {
 res.status(404).send("Halaman tidak ditemukan");
});

app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).send('Ada kesalahan pada server');
});


app.use((req, res, next) => {
 res.status(404).send("Halaman tidak ditemukan");
});

app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).send('Ada kesalahan pada server');
});

app.listen(port, () => {
 console.log(`Server berjalan di http://localhost:${port}`);
});