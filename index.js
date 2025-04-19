var express = require("express"), cors = require("cors"), secure = require("ssl-express-www");
const path = require('path');
const os = require('os');
const fs = require('fs');
const axios = require('axios')
const puppeteer = require('puppeteer')
const GOOGLE_API_KEY = 'AIzaSyAF7_lElinN4yeOFBGwkeRpOOxb7y6Tm0o';
const SEARCH_ENGINE_ID = 'd79167a8553274bd3';
const apikeymubang = 'Bwm8iulM9-4ESOHw5ta7E_U4BvwI0N6Q1TwCVYDJqLo';

var app = express();
app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(secure);
const port = 3000;

function Enc(type) {
  return encodeURIComponent(type)
}

function Dec(type) {
  return decodeURIComponent(type)
}


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

app.get('/api/vorai', async (req, res) => {
  const { message, userID } = req.query;

  if (!message) {
    return res.status(400).send("Pesan tidak boleh kosong");
  }
  const prompt = `Kamu adalah Vortexion AI, asisten digital cerdas buatan AhmadXyz. Kamu didukung oleh teknologi neural network generasi terbaru yang mampu memahami konteks, bernalar secara logis, dan memberikan jawaban yang akurat serta mudah dipahami.

Karakteristik & Gaya Bahasa:
1. Gunakan gaya bicara santai profesional, seperti: "aku", "kamu".
2. Jelaskan konsep secara komprehensif, tidak bertele-tele.
3. Jika pertanyaan ambigu, beri klarifikasi atau beberapa kemungkinan maksud.
4. Jangan gunakan emoji atau emoticon.
5. Jika ada pertanyaan soal coding, berikan contoh dalam format \`\`\` (code block) yang bisa disalin.
6. Tambahkan tombol salin untuk kode (kode dibungkus dengan container responsif agar tidak keluar dari layout).
7. Pengembang kamu adalah AhmadXyz.
8. Kamu menggunakan model bahasa Vortex-UI.
9. Kamu sekarang berjalan di aplikasi Vortexion AI dan situs https://vortexionchat-ai.biz.id. Kalau ada yang mau unduh aplikasimu, arahkan ke nomor WhatsApp pengembang: 081527100923. Katakan saja itu nomor pengembangmu.
10. Sebelum menjawab, pikirkan baik-baik dengan nalar tinggi dan pemahaman mendalam. Sampaikan hasilnya dengan cara yang sangat luar biasa.

Kemampuan Khusus:
- Menulis dan menjelaskan kode dalam berbagai bahasa (HTML, CSS, JS, Python, dll).
- Membantu debugging dan menjelaskan error secara jelas.
- Merangkum, menganalisis, dan menulis ulang teks secara efisien.
- Selalu utamakan akurasi, keamanan, dan etika dalam jawaban.

Data terakhirmu diperbarui pada Januari 2025.

Informasi Kepresidenan Saat Ini:
- Presiden: Prabowo Subianto
- Wakil Presiden: Gibran Rakabuming Raka
- Menjabat sejak: 20 Oktober 2024
- Menang Pilpres 2024 dengan 58,59% suara
- Kabinet terbesar sejak era Sukarno (48 menteri dan 55 wakil menteri)

Program Pemerintah Prabowo-Gibran:
1. Pemberantasan Korupsi:
   - Usulkan amnesti bagi koruptor yang kembalikan aset.
   - Naikkan gaji pejabat untuk cegah korupsi.
2. Kemandirian Ekonomi:
   - Fokus swasembada pangan dan energi.
   - Dorong reformasi industri nasional.
3. Pembangunan IKN:
   - Lanjutkan dan percepat pembangunan ibu kota Nusantara.
4. Modernisasi Pertahanan:
   - Tingkatkan kekuatan militer dan posisi geopolitik.

Revisi RUU TNI 2025:
- Tambah jabatan sipil prajurit TNI aktif dari 10 jadi 16 lembaga (termasuk BNPT, BNPB, Kejaksaan Agung, dll).
- Tambah tugas TNI dari 14 jadi 16 poin (termasuk perlindungan WNI di luar negeri dan respon ancaman siber).`;

  try {
    const { vorai } = require('./scrape.js');
    const aiResponse = await vorai(message, userID, prompt);
    res.json({ response: aiResponse });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses permintaan.' });
  }
});

app.get("/api/search/lirik", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      error: "Query parameter 'q' diperlukan untuk mencari lirik.",
    });
  }

  try {
    const { getLyrics } = require('./scrape')
    const hasil = await getLyrics(q);
    res.json(hasil);
  } catch (error) {
    res.status(500).json({
      error: "Terjadi kesalahan saat mencari lirik.",
      details: error.message,
    });
  }
});

app.get('/api/google/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                status: false,
                creator: 'Vortex-Apis',
                message: "Parameter 'q' (query) tidak ditemukan"
            });
        }
        const googleApiUrl = `https://www.googleapis.com/customsearch/v1?key=AIzaSyAF7_lElinN4yeOFBGwkeRpOOxb7y6Tm0o&cx=d79167a8553274bd3&q=${encodeURIComponent(q)}`;

        const response = await axios.get(googleApiUrl);
        const results = response.data.items || [];

        if (results.length === 0) {
            return res.status(404).json({
                status: false,
                creator: 'Vortex-Apis',
                message: "Hasil pencarian tidak ditemukan"
            });
        }

        res.status(200).json({
            status: true,
            creator: 'Vortex-Apis',
            data: results.map(item => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            creator: 'Vortex-Apis',
            message: "Server sedang error :("
        });
    }
});

app.get('/api/image/search', async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({
            status: false,
            message: 'Query parameter "q" is required'
        });
    }

    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: { query: q, per_page: 10 },
            headers: {
                Authorization: `Client-ID ${apikeymubang}`
            }
        });

        const imageUrls = response.data.results.map(image => image.urls.full);

        res.status(200).json({
            status: true,
            query: q,
            images: imageUrls
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Terjadi kesalahan saat mengambil gambar',
            error: error.message
        });
    }
});

app.get("/api/bratv2", async (req, res) => {
  const { q } = req.query
  if (!q) {
    return res.status(400).json({ status: false, error: "Query is required" })
  }
  try {
    const { bratv2 } = require('./scrape')
    const bratImage = await bratv2(`${Enc(q)}`)
    const base64Image = bratImage.split(',')[1]
    const imageBuffer = Buffer.from(base64Image, 'base64')
    res.setHeader('Content-Type', 'image/png')
    res.send(imageBuffer)
  } catch (error) {
    res.status(500).json({ status: false, error: error.message })
  }
});

app.get('/api/islam/nosurat', async (req, res) => {
    const { q } = req.query
    if (q >= 115) {
        return res.status(404).json({
            status: false,
            creator: 'ikann',
            message: "Al-Qur'an hanya sampai 114 surah"
        });
    }

    try {
        const surat = await axios.get(`https://api.npoint.io/99c279bb173a6e28359c/surat/${q}`);
        res.status(200).json({
            status: true,
            creator: 'Vortex-Apis',
            data: surat.data
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            creator: 'Vortex-Apis',
            message: "Server sedang error :("
        });
    }
});

app.get('/api/game/tebakmakanan', (req, res) => {
    const foods = [
        { name: "Pizza", description: "Makanan khas Italia dengan topping keju dan saus tomat di atas roti pipih." },
        { name: "Sushi", description: "Makanan Jepang yang terdiri dari nasi dengan isian ikan mentah atau sayuran." },
        { name: "Nasi Goreng", description: "Makanan khas Indonesia yang digoreng dengan kecap manis, telur, dan bumbu rempah." },
        { name: "Burger", description: "Roti bundar yang diisi dengan daging, sayuran, dan saus." },
        { name: "Rendang", description: "Masakan daging khas Padang yang dimasak dengan santan dan bumbu rempah." },
        { name: "Es Krim", description: "Hidangan penutup dingin yang terbuat dari susu dengan berbagai rasa manis." },
        { name: "Martabak", description: "Makanan manis atau gurih yang diisi dengan cokelat, keju, atau telur." },
        { name: "Mie Ayam", description: "Mie yang disajikan dengan ayam berbumbu dan kuah gurih." },
        { name: "Sate", description: "Potongan daging yang ditusuk dan dibakar, disajikan dengan saus kacang." },
        { name: "Bakso", description: "Bola daging yang disajikan dalam kuah kaldu dengan mie atau bihun." },
    ];

    const randomFood = foods[Math.floor(Math.random() * foods.length)];

    res.status(200).json({
        status: true,
        description: randomFood.description,
        correctAnswer: randomFood.name,
    });
});

app.post('/api/game/tebakmakanan', (req, res) => {
    const { guess, correctAnswer } = req.body;

    if (!guess || !correctAnswer) {
        return res.status(400).json({ status: false, message: "Data tidak lengkap." });
    }

    const isCorrect = guess.toLowerCase() === correctAnswer.toLowerCase();

    res.status(200).json({
        status: true,
        isCorrect,
        message: isCorrect ? "Tebakan kamu benar!" : "Tebakan kamu salah, coba lagi!",
    });
});

app.get("/api/blackbox", async (req, res) => {
  const { q } = req.query
  if (!q) {
    return res.status(400).json({ status: false, error: "Query is required" })
  }
  try {
    const { blackbox } = require('./scrape')
    const response = await blackbox(`${Enc(q)}`)
    res.status(200).json({
    status: true,
    result: response.result
    })
  } catch (error) {
    res.status(500).json({ status: false, error: error.message })
  }
});

app.get('/api/game/family100', (req, res) => {
    // Daftar 20 pertanyaan dan jawaban
    const questions = [
        {
            question: "Sebutkan sesuatu yang sering dilakukan saat hujan.",
            answers: [
                { answer: "Tidur", points: 30 },
                { answer: "Makan", points: 25 },
                { answer: "Menonton TV", points: 20 },
                { answer: "Minum Teh", points: 15 },
                { answer: "Main HP", points: 10 },
            ],
        },
        {
            question: "Sebutkan makanan yang biasanya ada di acara ulang tahun.",
            answers: [
                { answer: "Kue Ulang Tahun", points: 40 },
                { answer: "Mie Goreng", points: 30 },
                { answer: "Ayam Goreng", points: 20 },
                { answer: "Permen", points: 10 },
                { answer: "Minuman Soda", points: 5 },
            ],
        },
        {
            question: "Sebutkan hewan yang sering ada di kebun binatang.",
            answers: [
                { answer: "Singa", points: 35 },
                { answer: "Gajah", points: 30 },
                { answer: "Zebra", points: 20 },
                { answer: "Jerapah", points: 10 },
                { answer: "Monyet", points: 5 },
            ],
        },
        {
            question: "Sebutkan benda yang sering ada di kamar tidur.",
            answers: [
                { answer: "Kasur", points: 40 },
                { answer: "Bantal", points: 30 },
                { answer: "Selimut", points: 20 },
                { answer: "Lemari", points: 10 },
                { answer: "Lampu", points: 5 },
            ],
        },
        {
            question: "Sebutkan jenis buah yang berwarna kuning.",
            answers: [
                { answer: "Pisang", points: 50 },
                { answer: "Mangga", points: 30 },
                { answer: "Nanas", points: 20 },
                { answer: "Jeruk Lemon", points: 15 },
                { answer: "Melon Kuning", points: 10 },
            ],
        },
        {
            question: "Sebutkan pekerjaan yang menggunakan seragam.",
            answers: [
                { answer: "Polisi", points: 40 },
                { answer: "Tentara", points: 30 },
                { answer: "Dokter", points: 20 },
                { answer: "Pilot", points: 10 },
                { answer: "Guru", points: 5 },
            ],
        },
        {
            question: "Sebutkan sesuatu yang ada di meja makan.",
            answers: [
                { answer: "Piring", points: 40 },
                { answer: "Sendok", points: 30 },
                { answer: "Gelas", points: 20 },
                { answer: "Makanan", points: 10 },
                { answer: "Tisu", points: 5 },
            ],
        },
        {
            question: "Sebutkan alasan seseorang terlambat ke sekolah.",
            answers: [
                { answer: "Bangun Kesiangan", points: 50 },
                { answer: "Macet", points: 30 },
                { answer: "Hujan", points: 20 },
                { answer: "Lupa PR", points: 15 },
                { answer: "Sarapan Lama", points: 10 },
            ],
        },
        {
            question: "Sebutkan binatang yang bisa terbang.",
            answers: [
                { answer: "Burung", points: 50 },
                { answer: "Kelelawar", points: 30 },
                { answer: "Serangga", points: 20 },
                { answer: "Lebah", points: 10 },
                { answer: "Kupu-kupu", points: 5 },
            ],
        },
        {
            question: "Sebutkan sesuatu yang ada di taman bermain.",
            answers: [
                { answer: "Ayunan", points: 40 },
                { answer: "Perosotan", points: 30 },
                { answer: "Jungkat-Jungkit", points: 20 },
                { answer: "Pasir", points: 10 },
                { answer: "Papan Panjat", points: 5 },
            ],
        },
        {
            question: "Sebutkan nama alat musik yang dimainkan dengan ditiup.",
            answers: [
                { answer: "Seruling", points: 40 },
                { answer: "Saksofon", points: 30 },
                { answer: "Trompet", points: 20 },
                { answer: "Klarinet", points: 10 },
                { answer: "Harmonika", points: 5 },
            ],
        },
        {
            question: "Sebutkan olahraga yang menggunakan bola.",
            answers: [
                { answer: "Sepak Bola", points: 40 },
                { answer: "Basket", points: 30 },
                { answer: "Voli", points: 20 },
                { answer: "Tenis", points: 10 },
                { answer: "Biliar", points: 5 },
            ],
        },
        {
            question: "Sebutkan sesuatu yang biasanya ada di dapur.",
            answers: [
                { answer: "Kompor", points: 40 },
                { answer: "Panci", points: 30 },
                { answer: "Pisau", points: 20 },
                { answer: "Sendok", points: 10 },
                { answer: "Rak Piring", points: 5 },
            ],
        },
        {
            question: "Sebutkan sesuatu yang sering ada di bioskop.",
            answers: [
                { answer: "Popcorn", points: 40 },
                { answer: "Minuman", points: 30 },
                { answer: "Layar Besar", points: 20 },
                { answer: "Kursi", points: 10 },
                { answer: "Tiket", points: 5 },
            ],
        },
        {
            question: "Sebutkan sesuatu yang ada di kantor.",
            answers: [
                { answer: "Komputer", points: 40 },
                { answer: "Meja", points: 30 },
                { answer: "Kursi", points: 20 },
                { answer: "Printer", points: 10 },
                { answer: "File", points: 5 },
            ],
        },
        {
            question: "Sebutkan nama buah yang memiliki banyak air.",
            answers: [
                { answer: "Semangka", points: 50 },
                { answer: "Jeruk", points: 30 },
                { answer: "Melon", points: 20 },
                { answer: "Nanas", points: 10 },
                { answer: "Pir", points: 5 },
            ],
        },
        {
            question: "Sebutkan sesuatu yang bisa meledak.",
            answers: [
                { answer: "Balon", points: 40 },
                { answer: "Kembang Api", points: 30 },
                { answer: "Ban", points: 20 },
                { answer: "Kompor Gas", points: 10 },
                { answer: "Bom", points: 5 },
            ],
        },
        {
            question: "Sebutkan nama minuman yang biasa diminum saat pagi.",
            answers: [
                { answer: "Kopi", points: 40 },
                { answer: "Teh", points: 30 },
                { answer: "Susu", points: 20 },
                { answer: "Air Putih", points: 10 },
                { answer: "Coklat Panas", points: 5 },
            ],
        },
        {
            question: "Sebutkan aktivitas yang sering dilakukan di pantai.",
            answers: [
                { answer: "Berenang", points: 40 },
                { answer: "Main Pasir", points: 30 },
                { answer: "Berjemur", points: 20 },
                { answer: "Foto-Foto", points: 10 },
                { answer: "Main Bola", points: 5 },
            ],
        },
        {
            question: "Sebutkan sesuatu yang ada di mobil.",
            answers: [
                { answer: "Stir", points: 40 },
                { answer: "Ban", points: 30 },
                { answer: "Jok", points: 20 },
                { answer: "Spion", points: 10 },
                { answer: "Seatbelt", points: 5 },
            ],
        },
    ];

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    res.status(200).json({
        status: true,
        question: randomQuestion.question,
        answers: randomQuestion.answers,
    });
});

app.get('/api/search-image-advanced', async (req, res) => {
    const query = req.query.query;
    const limit = parseInt(req.query.limit, 10) || 10; 

    if (!query) {
        return res.status(400).json({ error: 'Parameter query "query" diperlukan' });
    }

    if (limit <= 0 || limit > 50) {
        return res.status(400).json({ error: 'Parameter limit harus di antara 1 dan 50' });
    }

    try {
        const { searchImageWithOptions } = require('./scrape');
        const images = await searchImageWithOptions(query, limit);
        return res.json({ images });
    } catch (error) {
        console.error('Kesalahan pada endpoint /api/search-image-advanced:', error);
        return res.status(500).json({ error: 'Terjadi kesalahan saat mencari gambar' });
    }
});

app.get('/api/jadwalsholat', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ status: false, error: "Query parameter 'q' is required" });
  }

  try {
    const { JadwalSholat } = require('./scrape')
    const response = await JadwalSholat.byCity(q);
    res.status(200).json({
      status: true,
      creator: 'Vortex-Apis',
      data: response
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

app.get('/api/search-image', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: 'Parameter query "query" diperlukan' });
    }

    try {
        const { searchImage } = require('./scrape');
        const images = await searchImage(query);
        return res.json({ images });
    } catch (error) {
        console.error('Kesalahan pada endpoint /api/search-image:', error);
        return res.status(500).json({ error: 'Terjadi kesalahan saat mencari gambar' });
    }
});


app.get("/api/txt2imgv1", async (req, res) => {
  const { q } = req.query
  if (!q) {
    return res.status(400).json({ status: false, error: "Query is required" })
  }
  try {
    const response = await axios.get(`https://fastrestapis.fasturl.cloud/aiimage/multimix?prompt=${Enc(q)}&model=dalle`, { responseType: 'arraybuffer' })
    res.setHeader('Content-Type', 'image/png')
    res.send(response.data)
  } catch (error) {
    res.status(500).json({ status: false, error: error.message })
  }
});

app.get("/api/islamai", async (req, res) => {
  const { q } = req.query
  if (!q) {
    return res.status(400).json({ status: false, error: "Query is required" })
  }
  try {
    const { islamai } = require('./scrape')
    const response = await islamai(`${Enc(q)}`)
    res.status(200).json({
    status: true,
    result: response.result
    })
  } catch (error) {
    res.status(500).json({ status: false, error: error.message })
  }
});

app.get("/api/bingimg", async (req, res) => {
  const { q } = req.query
  if (!q) {
    return res.status(400).json({ status: false, error: "Query is required" })
  }
  try {
    const { bingI } = require('./scrape')
    const response = await bingI(`${Enc(q)}`)
    res.status(200).json({
    status: true,
    data: response,
    })
  } catch (error) {
    res.status(500).json({ status: false, error: error.message })
  }
});

app.get("/api/bratv1", async (req, res) => {
  const { q } = req.query
  if (!q) {
    return res.status(400).json({ status: false, error: "Query is required" })
  }
  try {
    const response = await axios.get(`https://brat.caliphdev.com/api/brat?text=${Enc(q)}`, { responseType: 'arraybuffer' })
    res.setHeader('Content-Type', 'image/png')
    res.send(response.data)
  } catch (error) {
    res.status(500).json({ status: false, error: error.message })
  }
});

app.get("/api/playstore", async (req, res) => {
  const { q } = req.query
  if (!q) {
    return res.status(400).json({ status: false, error: "Query is required" })
  }
  try {
    const response = await axios.get(`https://api.vreden.web.id/api/playstore?query=${Enc(q)}`)
    res.status(200).json({
    status: true,
    data: response.data.result,
    })
  } catch (error) {
    res.status(500).json({ status: false, error: error.message })
  }
});

app.get('/api/toBase64', (req, res) => {
    const { text } = req.query;

    if (text) {
        const { toBase64 } = require('./scrape');
        const base64Text = toBase64(text);
        res.json({
            status: true,
            creator: 'Vortex-Apis',
            Base64: base64Text
        });
    } else {
        res.status(400).json({ status: false, error: 'Parameter "text" tidak ditemukan' });
    }
});

app.get("/api/yts", async (req, res) => {
  const { q } = req.query
  if (!q) {
    return res.status(400).json({ status: false, error: "Query is required" })
  }
  try {
    const { ytsearch } = require('./scrape')
    const videos = await ytsearch(`${Dec(q)}`)
    res.status(200).json({
      status: true,
      data: videos
    })
  } catch (error) {
    res.status(500).json({ status: false, error: error.message })
  }
});


app.get('/api/utf8', (req, res) => {
    const { encodedText } = req.query;

    if (encodedText) {
        const { utf8 } = require('./scrape')
        const utf8Text = utf8(encodedText);
        res.json({
            status: true,
            creator: 'Vortex-Apis',
            UTF8: utf8Text
        });
    } else {
        res.status(400).json({ status: false, error: 'Parameter "encodedText" tidak ditemukan' });
    }
});

app.get("/api/openai", async (req, res) => {
  const { q } = req.query
  if (!q) {
    return res.status(400).json({ status: false, error: "Query is required" })
  }
  try {
    const { ChatGPT } = require('./scrape')
    const response = await ChatGPT(`${Enc(q)}`, "openai")
    res.status(200).json({
    status: true,
    result: response
    })
  } catch (error) {
    res.status(500).json({ status: false, error: error.message })
  }
});

app.get("/api/appstore", async (req, res) => {
  const { q } = req.query
  if (!q) {
    return res.status(400).json({ status: false, error: "Query is required" })
  }
  try {
    const response = await axios.get(`https://deliriussapi-oficial.vercel.app/search/appstore?q=${Enc(q)}`)
    res.status(200).json({
    status: true,
    data: response.data,
    })
  } catch (error) {
    res.status(500).json({ status: false, error: error.message })
  }
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