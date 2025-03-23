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