const axios = require('axios')
const { createDecipheriv } = require('crypto')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const YTDL = require('@distube/ytdl-core')
const cheerio = require('cheerio')
const { createCanvas, loadImage } = require('canvas')
const ytSearch = require('yt-search')
const puppeteer = require('puppeteer')

async function laheluSearch(query) {
 let { data } = await axios.get(`https://lahelu.com/api/post/get-search?query=${query}&cursor=cursor`)
 return data.postInfos
}

async function ttstalk(username) {

 let url = 'https://tiktoklivecount.com/search_profile';
 let data = {
 username: username.startsWith('@') ? username : `@${username}`
 };

 try {
 let res = await axios.post(url, data, {
 headers: {
 'Content-Type': 'application/json',
 'Accept': 'application/json',
 'X-Requested-With': 'XMLHttpRequest',
 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
 'Referer': 'https://tiktoklivecount.com/'
 }
 });

 let json = res.data;
 if (!json || !json.followers) return {
 error: 'Profil tidak ditemukan.'
 };

 return {
 name: json.name,
 username: username,
 Pengikut: json.followers,
 Top: json.rankMessage.replace(/<\/?b>/g, '') || 'Tidak tersedia',
 url_profile: json.profile_pic
 };
 } catch (error) {
 return {
 error: 'Error saat mengambil data.'
 };
 }
}

function toBase64(text) {
    return Buffer.from(text).toString('base64');
}

function utf8(encodedText) {
    return Buffer.from(encodedText, 'base64').toString('utf-8');
}

function viooai(content, user, prompt, imageBuffer) {
 return new Promise(async (resolve, reject) => {
 const payload = {
 content,
 user,
 prompt
 }
 if (imageBuffer) {
 payload.imageBuffer = Array.from(imageBuffer)
 }
 try {
 const response = await axios.post('https://luminai.my.id/',
 payload, {
 headers: {
 'Content-Type': 'application/json'
 }
 })
 resolve(response.data.result)
 } catch (error) {
 reject(error.response ? error.response.data : error.message)
 }
 })
 }

async function blackbox(content) {
try {
const response = await axios.post('https://luminai.my.id/', { content, cName: "Vortexion", cID: "Vortex0Uf9A72" })
return response.data
} catch (error) {
console.error(error)
throw error
}}

async function searchImageWithOptions(query, limit = 10) {
    const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Untuk kompatibilitas server
        });
        const page = await browser.newPage();
        console.log('Membuka URL:', url);
        await page.goto(url, { waitUntil: 'networkidle2' });

        const images = await page.evaluate(() => {
            const imgElements = Array.from(document.querySelectorAll('img'));
            let imageUrls = [];
            imgElements.forEach(img => {
                const src = img.src || img.getAttribute('data-src');
                if (src && src.startsWith('http')) {
                    imageUrls.push(src);
                }
            });
            return imageUrls;
        });

        console.log(`Gambar ditemukan: ${images.length}, mengambil hingga ${limit}`);
        await browser.close();
        return images.slice(0, limit); // Batasi jumlah gambar sesuai limit
    } catch (error) {
        console.error('Kesalahan saat mencari gambar dengan opsi:', error);
        throw error;
    }
}

async function BratGenerator(teks) {
  let width = 512;
  let height = 512;
  let margin = 20;
  let wordSpacing = 50;

  let canvas = createCanvas(width, height);
  let ctx = canvas.getContext('2d');

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  let fontSize = 80;
  let lineHeightMultiplier = 1.3;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'black';

  let words = teks.split(' ');
  let lines = [];

  let rebuildLines = () => {
    lines = [];
    let currentLine = '';

    for (let word of words) {
      let testLine = currentLine ? `${currentLine} ${word}` : word;
      let lineWidth =
        ctx.measureText(testLine).width + (currentLine.split(' ').length - 1) * wordSpacing;

      if (lineWidth < width - 2 * margin) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }
  };

  ctx.font = `${fontSize}px Sans-serif`;
  rebuildLines();

  while (lines.length * fontSize * lineHeightMultiplier > height - 2 * margin) {
    fontSize -= 2;
    ctx.font = `${fontSize}px Sans-serif`;
    rebuildLines();
  }

  let lineHeight = fontSize * lineHeightMultiplier;
  let y = margin;

  for (let line of lines) {
    let wordsInLine = line.split(' ');
    let x = margin;

    for (let word of wordsInLine) {
      ctx.fillText(word, x, y);
      x += ctx.measureText(word).width + wordSpacing;
    }

    y += lineHeight;
  }

  let buffer = canvas.toBuffer('image/png');
  let image = await Jimp.read(buffer);

  image.blur(3);
  let blurredBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

  return blurredBuffer;
}

async function bingI(query) {
const response = await axios.get(`https://www.bing.com/images/search?q=${query}`);
const html = response.data;
const $ = cheerio.load(html);
const urls = [];
$(".imgpt > a").each((i, el) => {
urls[i] = $(el).attr("href");
});
const results = urls.map(url => ({
photo: `https://www.bing.com${url}`
}));
return results;
}

async function islamai(question) {
const url = 'https://vercel-server-psi-ten.vercel.app/chat'
const data = {
text: question,
array: [
{ content: "Assalamualaikum", role: "user" },
{ content: "Waalaikumsalam", role: "assistant" }
]}
const response = await axios.post(url, data, {
headers: {
'Content-Type': 'application/json',
'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
'Referer': 'https://islamandai.com/'
}})
return response.data
}

async function ChatGPT(question, model) {
const validModels = ["openai", "llama", "mistral", "mistral-large"]
const data = JSON.stringify({
messages: [question],
character: model
})
const config = {
method: 'POST',
url: 'https://chatsandbox.com/api/chat',
headers: {
'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
'Content-Type': 'application/json',
'accept-language': 'id-ID',
'referer': `https://chatsandbox.com/chat/${model}`,
'origin': 'https://chatsandbox.com',
'alt-used': 'chatsandbox.com',
'sec-fetch-dest': 'empty',
'sec-fetch-mode': 'cors',
'sec-fetch-site': 'same-origin',
'priority': 'u=0',
'te': 'trailers',
'Cookie': '_ga_V22YK5WBFD=GS1.1.1734654982.3.0.1734654982.0.0.0; _ga=GA1.1.803874982.1734528677'
},
data: data
}
const response = await axios.request(config)
return response.data
}

async function removeBackground(imageUrl) {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');
    const image = await loadImage(imageBuffer);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];     // Red
        const g = data[i + 1]; // Green
        const b = data[i + 2]; // Blue
        const a = data[i + 3]; // Alpha
        if (r > 200 && g > 200 && b > 200) {
            data[i + 3] = 0; 
        }
    }

    ctx.putImageData(imageData, 0, 0);

    const outputPath = path.join('/tmp', 'no-bg.png');
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    return outputPath;
}

async function bratv2(prompt) {
const url = 'https://www.bestcalculators.org/wp-admin/admin-ajax.php'
const headers = {
'authority': 'www.bestcalculators.org',
'accept': '*/*',
'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
'origin': 'https://www.bestcalculators.org',
'referer': 'https://www.bestcalculators.org/online-generators/brat-text-generator/',
'user-agent': 'Postify/1.0.0',
'x-requested-with': 'XMLHttpRequest'
}
const data = new URLSearchParams({
'action': 'generate_brat_text',
'text': prompt,
'fontSize': "100",
'blurLevel': "5"
})
const response = await axios.post(url, data.toString(), { headers })
return `data:image/png;base64,${response.data}`
}

async function generateBrat(text) {
    const size = 800; // Ukuran 1:1 (800x800)
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background putih
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Teks warna hitam dengan font bawaan
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 60px sans-serif'; // Ukuran font lebih kecil biar pas
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Tulis teks di tengah canvas, dengan auto-wrap
    const maxWidth = size - 100; // Batas panjang teks
    wrapText(ctx, text, size / 2, size / 2, maxWidth, 80);

    // Simpan file ke /tmp/
    const filePath = path.join('/tmp', 'brat.png');
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, buffer);

    return filePath;
}

// Fungsi auto-wrap teks biar gak keluar gambar
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lines = [];

    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
            lines.push(line);
            line = words[i] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    let startY = y - (lines.length - 1) * (lineHeight / 2);
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, startY + i * lineHeight);
    }
}

async function searchImage(query) {
    const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        console.log('Membuka URL:', url);
        await page.goto(url, { waitUntil: 'networkidle2' });

        const images = await page.evaluate(() => {
            const imgElements = Array.from(document.querySelectorAll('img'));
            let imageUrls = [];
            imgElements.forEach(img => {
                const src = img.src || img.getAttribute('data-src');
                if (src && src.startsWith('http')) {
                    imageUrls.push(src);
                }
            });
            return imageUrls.slice(0, 10); 
        });

        console.log('Gambar ditemukan:', images);
        await browser.close();
        return images.length ? images : 'Tidak ditemukan gambar';
    } catch (error) {
        console.error('Kesalahan saat mencari gambar:', error);
        throw error;
    }
}

async function githubSearch(query, page = 1, lang = '') {
	try {
		const res = await axios.get(`https://github.com/search?q=${query}&type=repositories&p=${page}&l=${lang}`)
		const $ = cheerio.load(res.data)
		let script = $('script[data-target="react-app.embeddedData"]').html()
 let json = JSON.parse(script).payload.results
 const result = json.map(res => {
 return {
 archived: res.archived,
 desc: res.hl_trunc_description?.replace(/<em>/g, '').replace(/<\/em>/g, '') || null,
 lang: res.language,
 mirror: res.mirror,
 public: res.public,
 repo: 'https://github.com/' + res.repo.repository.owner_login + '/' + res.repo.repository.name,
 updated_at: res.repo.repository.updated_at,
 sponsorable: res.sponsorable,
 topics: res.topics
 }
 })
 return result
	} catch (e) {
		throw e
	}
}

async function ytsearch(query) {
try {
const searchResults = await ytSearch.search(query)
const videos = searchResults.videos.map(video => ({
title: video.title,
description: video.description,
url: video.url,
videoId: video.videoId,
timestamp: video.timestamp,
duration: video.duration,
ago: video.ago,
views: video.views,
author: {
name: video.author.name,
url: video.author.url,
verified: video.author.verified
},
image: video.image,
thumbnail: video.thumbnail
}))

return videos
} catch (error) {
console.error("Error during YouTube search:", error)
return []
}
}

async function npmStalk(pname) {
 let stalk = await axios.get("https://registry.npmjs.org/" + pname)
 let versions = stalk.data.versions
 let allver = Object.keys(versions)
 let verLatest = allver[allver.length - 1]
 let verPublish = allver[0]
 let packageLatest = versions[verLatest]
 return {
 name: pname,
 versionLatest: verLatest,
 versionPublish: verPublish,
 versionUpdate: allver.length,
 latestDependencies: Object.keys(packageLatest.dependencies).length,
 publishDependencies: Object.keys(versions[verPublish].dependencies).length,
 publishTime: stalk.data.time.created,
 latestPublishTime: stalk.data.time[verLatest]
 }
}

async function getCookies() {
 try {
 const response = await axios.get('https://www.pinterest.com/csrf_error/');
 const setCookieHeaders = response.headers['set-cookie'];
 if (setCookieHeaders) {
 const cookies = setCookieHeaders.map(cookieString => {
 const cookieParts = cookieString.split(';');
 const cookieKeyValue = cookieParts[0].trim();
 return cookieKeyValue;
 });
 return cookies.join('; ');
 } else {
 console.warn('No set-cookie headers found in the response.');
 return null;
 }
 } catch (error) {
 console.error('Error fetching cookies:', error);
 return null;
 }
}

async function pin(query) {
 try {
 const cookies = await getCookies();
 if (!cookies) {
 console.log('Failed to retrieve cookies. Exiting.');
 return;
 }

 const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/';

 const params = {
 source_url: `/search/pins/?q=${query}`, // Use encodedQuery here
 data: JSON.stringify({
 "options": {
 "isPrefetch": false,
 "query": query,
 "scope": "pins",
 "no_fetch_context_on_resource": false
 },
 "context": {}
 }),
 _: Date.now()
 };

 const headers = {
 'accept': 'application/json, text/javascript, */*, q=0.01',
 'accept-encoding': 'gzip, deflate',
 'accept-language': 'en-US,en;q=0.9',
 'cookie': cookies,
 'dnt': '1',
 'referer': 'https://www.pinterest.com/',
 'sec-ch-ua': '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
 'sec-ch-ua-full-version-list': '"Not(A:Brand";v="99.0.0.0", "Microsoft Edge";v="133.0.3065.92", "Chromium";v="133.0.6943.142"',
 'sec-ch-ua-mobile': '?0',
 'sec-ch-ua-model': '""',
 'sec-ch-ua-platform': '"Windows"',
 'sec-ch-ua-platform-version': '"10.0.0"',
 'sec-fetch-dest': 'empty',
 'sec-fetch-mode': 'cors',
 'sec-fetch-site': 'same-origin',
 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0',
 'x-app-version': 'c056fb7',
 'x-pinterest-appstate': 'active',
 'x-pinterest-pws-handler': 'www/[username]/[slug].js',
 'x-pinterest-source-url': '/hargr003/cat-pictures/',
 'x-requested-with': 'XMLHttpRequest'
 };

 const { data } = await axios.get(url, {
 headers: headers,
 params: params
 })

 const container = [];
 const results = data.resource_response.data.results.filter((v) => v.images?.orig);
 results.forEach((result) => {
 container.push({
 upload_by: result.pinner.username,
 fullname: result.pinner.full_name,
 followers: result.pinner.follower_count,
 caption: result.grid_title,
 image: result.images.orig.url,
 source: "https://id.pinterest.com/pin/" + result.id,
 });
 });

 return container;
 } catch (error) {
 console.log(error);
 return [];
 }
}
const ffStalk = {
 api: {
 base: "https://tools.freefireinfo.in/profileinfo.php"
 },

 headers: {
 'authority': 'tools.freefireinfo.in',
 'accept': 'text/data,application/xdata+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
 'accept-language': 'en-US,en;q=0.9',
 'cache-control': 'max-age=0',
 'content-type': 'application/x-www-form-urlencoded',
 'origin': 'https://tools.freefireinfo.in',
 'referer': 'https://tools.freefireinfo.in/',
 'user-agent': 'Postify/1.0.0'
 },

 generateCookie: () => {
 const now = Date.now();
 const timestamp = Math.floor(now / 1000);
 const visitorId = Math.floor(Math.random() * 1000000000);
 const sessionId = Math.random().toString(36).substring(2, 15);
 return `PHPSESSID=${sessionId}; _ga=GA1.1.${visitorId}.${timestamp}; _ga_PDQN6PX6YK=GS1.1.${timestamp}.1.1.${timestamp}.0.0.0`;
 },

 parse: (data) => {
 try {
 const toCamelCase = (str) => {
 return str
 .split(/[\s-_]+/)
 .map((word, index) => {
 if (index === 0) return word.toLowerCase();
 return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
 })
 .join('');
 };

 const accountInfo = {};
 const info = data.match(/<h3>Your Account Info:<\/h3>\s*(.*?)(?=<br \/>\s*<br \/>)/s);
 if (info) {
 const lines = info[1].split('<br />');
 lines.forEach(line => {
 const match = line.match(/[╭├╰]\s*([^:]+):\s*([^<]+)/);
 if (match) {
 accountInfo[toCamelCase(match[1].trim())] = match[2].trim();
 }
 });
 }
 
 const booyahPass = {};
 const bm = data.match(/╭\s*Booyah Pass[^]*?(?=<br \/>\s*<br \/>)/);
 if (bm) {
 const lines = bm[0].split('<br />');
 lines.forEach(line => {
 const match = line.match(/[╭╰]\s*([^:]+):\s*([^<]+)/);
 if (match) {
 const key = match[1].trim().toLowerCase().includes('premium') ? 'premium' : 'level';
 booyahPass[key] = match[2].trim();
 }
 });
 }

 const pet = {};
 const pm = data.match(/🐾\s*Pet Information[^]*?(?=<br \/>\s*<br \/>)/);
 if (pm) {
 const lines = pm[0].split('<br />');
 lines.forEach(line => {
 const match = line.match(/[╭├╰]\s*([^:]+):\s*([^<]+)/);
 if (match) {
 pet[toCamelCase(match[1].trim())] = match[2].trim();
 }
 });
 }

 const guild = {};
 const gm = data.match(/Guild Information[^]*?(?=<br \/>\s*<br \/>)/);
 if (gm) {
 const lines = gm[0].split('<br />');
 lines.forEach(line => {
 const match = line.match(/[╭├╰]\s*([^:]+):\s*([^<]+)/);
 if (match) {
 guild[toCamelCase(match[1].trim())] = match[2].trim();
 }
 });
 }

 const vm = data.match(/Current Version:\s*([^\s<]+)/);
 const version = vm ? vm[1] : null;
 const equippedItems = {
 outfit: [],
 pet: [],
 avatar: [],
 banner: [],
 weapons: [],
 title: []
 };

 const categoryMapping = {
 'Outfit': 'outfit',
 'Pet': 'pet',
 'Avatar': 'avatar',
 'Banner': 'banner',
 'Weapons': 'weapons',
 'Title': 'title'
 };

 Object.entries(categoryMapping).forEach(([dataCategory, jsonCategory]) => {
 const cp = new RegExp(`<h4>${dataCategory}</h4>(.*?)(?=<h4>|<script|$)`, 's');
 const cm = data.match(cp);
 
 if (cm) {
 const ip = /<div class='equipped-item'><img src='([^']+)' alt='([^']+)'[^>]*><p>([^<]+)<\/p><\/div>/g;
 let im;
 
 while ((im = ip.exec(cm[1])) !== null) {
 equippedItems[jsonCategory].push({
 imageUrl: im[1],
 itemName: im[2],
 itemDescription: im[3]
 });
 }
 }
 });

 return {
 status: true,
 code: 200,
 message: "Success",
 result: {
 accountInfo,
 booyahPass,
 pet,
 guild,
 version,
 equippedItems
 }
 };

 } catch (error) {
 return {
 status: false,
 code: 500,
 error: error.message
 };
 }
 },

 stalk: async (uid) => {
 try {
 if (!uid) {
 return {
 status: false,
 code: 400,
 message: "Seriously? lu mau ngestalking akun orang, kagak nginput apa2 ? 🗿"
 };
 }

 if (!/^\d+$/.test(uid)) {
 return {
 status: false,
 code: 400,
 message: "UIDnya kudu angka bree, dah jangan macem2 dah 😑"
 }
 }

 const cookie = ffStalk.generateCookie();
 
 const formData = new URLSearchParams();
 formData.append('uid', uid);

 const response = await axios({
 method: 'POST',
 url: ffStalk.api.base,
 headers: {
 ...ffStalk.headers,
 'cookie': cookie
 },
 data: formData,
 maxRedirects: 5,
 validateStatus: status => status >= 200 && status < 400
 });

 if (!response.data || typeof response.data !== 'string' || response.data.length < 100) {
 return {
 status: false,
 code: 404,
 message: "Kagak ada response nya bree 👍🏻"
 };
 }

 return ffStalk.parse(response.data);

 } catch (error) {
 return {
 status: false,
 code: error.response?.status || 500,
 error: {
 type: error.name,
 details: error.message
 }
 };
 }
 }
};

async function createPayment(amount, codeqr) {
 const apiUrl = "https://linecloud.my.id/api/orkut/createpayment";
 const apikey = "Line";

 try {
 const response = await fetch(`${apiUrl}?apikey=${apikey}&amount=${amount}&codeqr=${codeqr}`, {
 method: "GET",
 });

 if (!response.ok) {
 throw new Error(`HTTP error! Status: ${response.status}`);
 }

 const result = await response.json();
 return result;
 } catch (error) {
 console.error("Error creating payment:", error);
 return { success: false, message: error.message };
 }
}

async function cekStatus(merchant, keyorkut) {
 const apiUrl = "https://linecloud.my.id/api/orkut/cekstatus";
 const apikey = "Line";

 try {
 const response = await fetch(`${apiUrl}?apikey=${apikey}&merchant=${merchant}&keyorkut=${keyorkut}`, {
 method: "GET",
 });

 if (!response.ok) {
 throw new Error(`HTTP error! Status: ${response.status}`);
 }

 const result = await response.json();
 return result;
 } catch (error) {
 console.error("Error creating payment:", error);
 return { success: false, message: error.message };
 }
}

module.exports = { 
 laheluSearch,
 ttstalk,
 viooai,
 githubSearch,
 npmStalk,
 pin,
 ffStalk,
 createPayment,
 cekStatus,
 toBase64,
 utf8,
 searchImage,
 generateBrat,
 removeBackground,
 ChatGPT,
 islamai,
 ytsearch,
 bratv2,
 bingI,
 BratGenerator,
 searchImageWithOptions,
 blackbox
}