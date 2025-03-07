const express = require('express');
const app = express();

// Middleware untuk parsing JSON body
app.use(express.json());

// Endpoint API untuk mengonversi data ke Base64
app.post('/api/tobase64', (req, res) => {
 const { data } = req.body;
 if (!data) {
 return res.status(400).json({ error: 'Data input tidak ditemukan' });
 }
 // Konversi string ke Base64
 const base64data = Buffer.from(data, 'utf-8').toString('base64');
 res.json({ base64: base64data });
});

// Port server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`Server berjalan di port ${PORT}`);
});