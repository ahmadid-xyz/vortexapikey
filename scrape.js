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

const JadwalSholat = {
LIST: [
{ value: "317", name: "Aceh Barat" },
{ value: "318", name: "Aceh Barat Daya" },
{ value: "319", name: "Aceh Besar" },
{ value: "320", name: "Aceh Jaya" },
{ value: "321", name: "Aceh Selatan" },
{ value: "322", name: "Aceh Singkil" },
{ value: "323", name: "Aceh Tamiang" },
{ value: "324", name: "Aceh Tengah" },
{ value: "325", name: "Aceh Tenggara" },
{ value: "326", name: "Aceh Timur" },
{ value: "327", name: "Aceh Utara" },
{ value: "329", name: "Agam" },
{ value: "330", name: "Alor" },
{ value: "1", name: "Ambarawa" },
{ value: "2", name: "Ambon" },
{ value: "3", name: "Amlapura" },
{ value: "4", name: "Amuntai" },
{ value: "5", name: "Argamakmur" },
{ value: "331", name: "Asahan" },
{ value: "332", name: "Asmat" },
{ value: "6", name: "Atambua" },
{ value: "7", name: "Babo" },
{ value: "333", name: "Badung" },
{ value: "8", name: "Bagan Siapiapi" },
{ value: "316", name: "Bahaur, Kalteng" },
{ value: "9", name: "Bajawa" },
{ value: "334", name: "Balangan" },
{ value: "10", name: "Balige" },
{ value: "11", name: "Balikpapan" },
{ value: "12", name: "Banda Aceh" },
{ value: "335", name: "Bandar Lampung" },
{ value: "13", name: "Bandarlampung" },
{ value: "14", name: "Bandung" },
{ value: "336", name: "Bandung Barat" },
{ value: "337", name: "Banggai" },
{ value: "338", name: "Banggai Kepulauan" },
{ value: "339", name: "Banggai Laut" },
{ value: "340", name: "Bangka" },
{ value: "341", name: "Bangka Barat" },
{ value: "342", name: "Bangka Selatan" },
{ value: "343", name: "Bangka Tengah" },
{ value: "15", name: "Bangkalan" },
{ value: "16", name: "Bangkinang" },
{ value: "17", name: "Bangko" },
{ value: "18", name: "Bangli" },
{ value: "19", name: "Banjar" },
{ value: "20", name: "Banjar Baru" },
{ value: "344", name: "Banjarbaru" },
{ value: "21", name: "Banjarmasin" },
{ value: "22", name: "Banjarnegara" },
{ value: "23", name: "Bantaeng" },
{ value: "24", name: "Banten" },
{ value: "25", name: "Bantul" },
{ value: "345", name: "Banyuasin" },
{ value: "346", name: "Banyumas" },
{ value: "26", name: "Banyuwangi" },
{ value: "27", name: "Barabai" },
{ value: "28", name: "Barito" },
{ value: "347", name: "Barito Kuala" },
{ value: "348", name: "Barito Selatan" },
{ value: "349", name: "Barito Timur" },
{ value: "350", name: "Barito Utara" },
{ value: "29", name: "Barru" },
{ value: "30", name: "Batam" },
{ value: "31", name: "Batang" },
{ value: "351", name: "Batanghari" },
{ value: "32", name: "Batu" },
{ value: "352", name: "Batu Bara" },
{ value: "33", name: "Baturaja" },
{ value: "34", name: "Batusangkar" },
{ value: "353", name: "Bau Bau" },
{ value: "35", name: "Baubau" },
{ value: "36", name: "Bekasi" },
{ value: "354", name: "Belitung" },
{ value: "355", name: "Belitung Timur" },
{ value: "356", name: "Belu" },
{ value: "357", name: "Bener Meriah" },
{ value: "37", name: "Bengkalis" },
{ value: "358", name: "Bengkayang" },
{ value: "38", name: "Bengkulu" },
{ value: "359", name: "Bengkulu Selatan" },
{ value: "360", name: "Bengkulu Tengah" },
{ value: "361", name: "Bengkulu Utara" },
{ value: "39", name: "Benteng" },
{ value: "362", name: "Berau" },
{ value: "40", name: "Biak" },
{ value: "363", name: "Biak Numfor" },
{ value: "41", name: "Bima" },
{ value: "42", name: "Binjai" },
{ value: "364", name: "Bintan" },
{ value: "43", name: "Bireuen" },
{ value: "44", name: "Bitung" },
{ value: "45", name: "Blitar" },
{ value: "46", name: "Blora" },
{ value: "365", name: "Boalemo" },
{ value: "47", name: "Bogor" },
{ value: "48", name: "Bojonegoro" },
{ value: "366", name: "Bolaang Mongondow" },
{ value: "367", name: "Bolaang Mongondow Selatan" },
{ value: "368", name: "Bolaang Mongondow Timur" },
{ value: "369", name: "Bolaang Mongondow Utara" },
{ value: "370", name: "Bombana" },
{ value: "49", name: "Bondowoso" },
{ value: "371", name: "Bone" },
{ value: "372", name: "Bone Bolango" },
{ value: "50", name: "Bontang" },
{ value: "373", name: "Boven Digoel" },
{ value: "51", name: "Boyolali" },
{ value: "52", name: "Brebes" },
{ value: "53", name: "Bukit Tinggi" },
{ value: "374", name: "Bukittinggi" },
{ value: "315", name: "Bula Sbt, Maluku" },
{ value: "375", name: "Buleleng" },
{ value: "54", name: "Bulukumba" },
{ value: "376", name: "Bulungan" },
{ value: "377", name: "Bungo" },
{ value: "55", name: "Buntok" },
{ value: "378", name: "Buol" },
{ value: "379", name: "Buru" },
{ value: "380", name: "Buru Selatan" },
{ value: "381", name: "Buton" },
{ value: "382", name: "Buton Selatan" },
{ value: "383", name: "Buton Tengah" },
{ value: "384", name: "Buton Utara" },
{ value: "56", name: "Cepu" },
{ value: "57", name: "Ciamis" },
{ value: "58", name: "Cianjur" },
{ value: "59", name: "Cibinong" },
{ value: "60", name: "Cilacap" },
{ value: "61", name: "Cilegon" },
{ value: "62", name: "Cimahi" },
{ value: "63", name: "Cirebon" },
{ value: "64", name: "Curup" },
{ value: "385", name: "Dairi" },
{ value: "386", name: "Deiyai" },
{ value: "387", name: "Deli Serdang" },
{ value: "65", name: "Demak" },
{ value: "66", name: "Denpasar" },
{ value: "67", name: "Depok" },
{ value: "388", name: "Dharmasraya" },
{ value: "68", name: "Dili" },
{ value: "389", name: "Dogiyai" },
{ value: "69", name: "Dompu" },
{ value: "70", name: "Donggala" },
{ value: "71", name: "Dumai" },
{ value: "390", name: "Empat Lawang" },
{ value: "72", name: "Ende" },
{ value: "73", name: "Enggano" },
{ value: "74", name: "Enrekang" },
{ value: "391", name: "Fak Fak" },
{ value: "75", name: "Fakfak" },
{ value: "392", name: "Flores Timur" },
{ value: "76", name: "Garut" },
{ value: "393", name: "Gayo Lues" },
{ value: "77", name: "Gianyar" },
{ value: "78", name: "Gombong" },
{ value: "79", name: "Gorontalo" },
{ value: "394", name: "Gorontalo Utara" },
{ value: "395", name: "Gowa" },
{ value: "80", name: "Gresik" },
{ value: "396", name: "Grobogan" },
{ value: "397", name: "Gunung Mas" },
{ value: "81", name: "Gunung Sitoli" },
{ value: "398", name: "Gunungkidul" },
{ value: "399", name: "Gunungsitoli" },
{ value: "400", name: "Halmahera Barat" },
{ value: "401", name: "Halmahera Selatan" },
{ value: "402", name: "Halmahera Tengah" },
{ value: "403", name: "Halmahera Timur" },
{ value: "404", name: "Halmahera Utara" },
{ value: "405", name: "Hulu Sungai Selatan" },
{ value: "406", name: "Hulu Sungai Tengah" },
{ value: "407", name: "Hulu Sungai Utara" },
{ value: "408", name: "Humbang Hasundutan" },
{ value: "409", name: "Indragiri Hilir" },
{ value: "410", name: "Indragiri Hulu" },
{ value: "82", name: "Indramayu" },
{ value: "411", name: "Intan Jaya" },
{ value: "309", name: "Jakarta Barat" },
{ value: "308", name: "Jakarta Pusat" },
{ value: "310", name: "Jakarta Selatan" },
{ value: "311", name: "Jakarta Timur" },
{ value: "312", name: "Jakarta Utara" },
{ value: "83", name: "Jambi" },
{ value: "84", name: "Jayapura" },
{ value: "412", name: "Jayawijaya" },
{ value: "85", name: "Jember" },
{ value: "413", name: "Jembrana" },
{ value: "86", name: "Jeneponto" },
{ value: "87", name: "Jepara" },
{ value: "88", name: "Jombang" },
{ value: "414", name: "Kab Timor Tengah Selatan" },
{ value: "89", name: "Kabanjahe" },
{ value: "415", name: "Kaimana" },
{ value: "90", name: "Kalabahi" },
{ value: "91", name: "Kalianda" },
{ value: "416", name: "Kampar" },
{ value: "92", name: "Kandangan" },
{ value: "417", name: "Kapuas" },
{ value: "418", name: "Kapuas Hulu" },
{ value: "93", name: "Karanganyar" },
{ value: "419", name: "Karangasem" },
{ value: "94", name: "Karawang" },
{ value: "420", name: "Karimun" },
{ value: "421", name: "Karo" },
{ value: "95", name: "Kasungan" },
{ value: "422", name: "Katingan" },
{ value: "423", name: "Kaur" },
{ value: "424", name: "Kayong Utara" },
{ value: "96", name: "Kayuagung" },
{ value: "97", name: "Kebumen" },
{ value: "98", name: "Kediri" },
{ value: "425", name: "Keerom" },
{ value: "99", name: "Kefamenanu" },
{ value: "100", name: "Kendal" },
{ value: "101", name: "Kendari" },
{ value: "328", name: "Kep. Seribu" },
{ value: "426", name: "Kep. Siau Tagulandang Biaro" },
{ value: "427", name: "Kepahiang" },
{ value: "428", name: "Kepulauan Anambas" },
{ value: "429", name: "Kepulauan Aru" },
{ value: "430", name: "Kepulauan Mentawai" },
{ value: "431", name: "Kepulauan Meranti" },
{ value: "432", name: "Kepulauan Sangihe" },
{ value: "433", name: "Kepulauan Selayar" },
{ value: "434", name: "Kepulauan Sula" },
{ value: "435", name: "Kepulauan Talaud" },
{ value: "436", name: "Kepulauan Tanimbar" },
{ value: "437", name: "Kepulauan Yapen" },
{ value: "438", name: "Kerinci" },
{ value: "102", name: "Kertosono" },
{ value: "103", name: "Ketapang" },
{ value: "104", name: "Kisaran" },
{ value: "105", name: "Klaten" },
{ value: "439", name: "Klungkung" },
{ value: "106", name: "Kolaka" },
{ value: "440", name: "Kolaka Timur" },
{ value: "441", name: "Kolaka Utara" },
{ value: "442", name: "Konawe" },
{ value: "443", name: "Konawe Kepulauan" },
{ value: "444", name: "Konawe Selatan" },
{ value: "445", name: "Konawe Utara" },
{ value: "107", name: "Kota Baru Pulau Laut" },
{ value: "108", name: "Kota Bumi" },
{ value: "109", name: "Kota Jantho" },
{ value: "446", name: "Kotabaru" },
{ value: "110", name: "Kotamobagu" },
{ value: "447", name: "Kotawaringin Barat" },
{ value: "448", name: "Kotawaringin Timur" },
{ value: "111", name: "Kuala Kapuas" },
{ value: "112", name: "Kuala Kurun" },
{ value: "113", name: "Kuala Pembuang" },
{ value: "114", name: "Kuala Tungkal" },
{ value: "449", name: "Kuantan Singingi" },
{ value: "450", name: "Kubu Raya" },
{ value: "115", name: "Kudus" },
{ value: "451", name: "Kulon Progo" },
{ value: "116", name: "Kuningan" },
{ value: "117", name: "Kupang" },
{ value: "118", name: "Kutacane" },
{ value: "452", name: "Kutai Barat" },
{ value: "453", name: "Kutai Kartanegara" },
{ value: "454", name: "Kutai Timur" },
{ value: "119", name: "Kutoarjo" },
{ value: "120", name: "Labuhan" },
{ value: "455", name: "Labuhan Batu" },
{ value: "456", name: "Labuhan Batu Selatan" },
{ value: "457", name: "Labuhan Batu Utara" },
{ value: "121", name: "Lahat" },
{ value: "458", name: "Lamandau" },
{ value: "122", name: "Lamongan" },
{ value: "459", name: "Lampung Barat" },
{ value: "460", name: "Lampung Selatan" },
{ value: "461", name: "Lampung Tengah" },
{ value: "462", name: "Lampung Timur" },
{ value: "463", name: "Lampung Utara" },
{ value: "464", name: "Landak" },
{ value: "465", name: "Langkat" },
{ value: "123", name: "Langsa" },
{ value: "466", name: "Lanny Jaya" },
{ value: "124", name: "Larantuka" },
{ value: "125", name: "Lawang" },
{ value: "467", name: "Lebak" },
{ value: "468", name: "Lebong" },
{ value: "469", name: "Lembata" },
{ value: "470", name: "Lhokseumawe" },
{ value: "126", name: "Lhoseumawe" },
{ value: "471", name: "Lima Puluh Kota" },
{ value: "127", name: "Limboto" },
{ value: "472", name: "Lingga" },
{ value: "473", name: "Lombok Barat" },
{ value: "474", name: "Lombok Tengah" },
{ value: "475", name: "Lombok Timur" },
{ value: "476", name: "Lombok Utara" },
{ value: "128", name: "Lubuk Basung" },
{ value: "129", name: "Lubuk Linggau" },
{ value: "130", name: "Lubuk Pakam" },
{ value: "131", name: "Lubuk Sikaping" },
{ value: "132", name: "Lumajang" },
{ value: "477", name: "Luwu" },
{ value: "478", name: "Luwu Timur" },
{ value: "479", name: "Luwu Utara" },
{ value: "133", name: "Luwuk" },
{ value: "134", name: "Madiun" },
{ value: "135", name: "Magelang" },
{ value: "136", name: "Magetan" },
{ value: "480", name: "Mahakam Ulu" },
{ value: "137", name: "Majalengka" },
{ value: "138", name: "Majene" },
{ value: "139", name: "Makale" },
{ value: "140", name: "Makassar" },
{ value: "481", name: "Malaka" },
{ value: "141", name: "Malang" },
{ value: "482", name: "Malinau" },
{ value: "483", name: "Maluku Barat Daya" },
{ value: "484", name: "Maluku Tengah" },
{ value: "485", name: "Maluku Tenggara" },
{ value: "486", name: "Mamasa" },
{ value: "487", name: "Mamberamo Raya" },
{ value: "488", name: "Mamberamo Tengah" },
{ value: "142", name: "Mamuju" },
{ value: "489", name: "Mamuju Tengah" },
{ value: "490", name: "Manado" },
{ value: "491", name: "Mandailing Natal" },
{ value: "492", name: "Manggarai" },
{ value: "493", name: "Manggarai Barat" },
{ value: "494", name: "Manggarai Timur" },
{ value: "143", name: "Manna" },
{ value: "144", name: "Manokwari" },
{ value: "495", name: "Manokwari Selatan" },
{ value: "496", name: "Mappi" },
{ value: "145", name: "Marabahan" },
{ value: "146", name: "Maros" },
{ value: "147", name: "Martapura Kalsel" },
{ value: "314", name: "Masamba, Sulsel" },
{ value: "148", name: "Masohi" },
{ value: "149", name: "Mataram" },
{ value: "150", name: "Maumere" },
{ value: "497", name: "Maybrat" },
{ value: "151", name: "Medan" },
{ value: "498", name: "Melawi" },
{ value: "152", name: "Mempawah" },
{ value: "153", name: "Menado" },
{ value: "154", name: "Mentok" },
{ value: "499", name: "Merangin" },
{ value: "155", name: "Merauke" },
{ value: "500", name: "Mesuji" },
{ value: "156", name: "Metro" },
{ value: "157", name: "Meulaboh" },
{ value: "501", name: "Mimika" },
{ value: "502", name: "Minahasa" },
{ value: "503", name: "Minahasa Selatan" },
{ value: "504", name: "Minahasa Tenggara" },
{ value: "505", name: "Minahasa Utara" },
{ value: "158", name: "Mojokerto" },
{ value: "506", name: "Morowali" },
{ value: "507", name: "Morowali Utara" },
{ value: "159", name: "Muara Bulian" },
{ value: "160", name: "Muara Bungo" },
{ value: "161", name: "Muara Enim" },
{ value: "162", name: "Muara Teweh" },
{ value: "508", name: "Muaro Jambi" },
{ value: "163", name: "Muaro Sijunjung" },
{ value: "509", name: "Muko Muko" },
{ value: "510", name: "Muna" },
{ value: "511", name: "Muna Barat" },
{ value: "164", name: "Muntilan" },
{ value: "512", name: "Murung Raya" },
{ value: "513", name: "Musi Banyuasin" },
{ value: "514", name: "Musi Rawas" },
{ value: "515", name: "Musi Rawas Utara" },
{ value: "165", name: "Nabire" },
{ value: "516", name: "Nagan Raya" },
{ value: "517", name: "Nagekeo" },
{ value: "518", name: "Natuna" },
{ value: "519", name: "Nduga" },
{ value: "166", name: "Negara" },
{ value: "520", name: "Ngada" },
{ value: "167", name: "Nganjuk" },
{ value: "168", name: "Ngawi" },
{ value: "521", name: "Nias" },
{ value: "522", name: "Nias Barat" },
{ value: "523", name: "Nias Selatan" },
{ value: "524", name: "Nias Utara" },
{ value: "169", name: "Nunukan" },
{ value: "525", name: "Ogan Ilir" },
{ value: "526", name: "Ogan Komering Ilir" },
{ value: "527", name: "Ogan Komering Ulu" },
{ value: "528", name: "Ogan Komering Ulu Selatan" },
{ value: "529", name: "Ogan Komering Ulu Timur" },
{ value: "170", name: "Pacitan" },
{ value: "171", name: "Padang" },
{ value: "530", name: "Padang Lawas" },
{ value: "531", name: "Padang Lawas Utara" },
{ value: "172", name: "Padang Panjang" },
{ value: "532", name: "Padang Pariaman" },
{ value: "173", name: "Padang Sidempuan" },
{ value: "533", name: "Padangsidimpuan" },
{ value: "534", name: "Pagar Alam" },
{ value: "174", name: "Pagaralam" },
{ value: "535", name: "Pahuwato" },
{ value: "175", name: "Painan" },
{ value: "536", name: "Pakpak Bharat" },
{ value: "176", name: "Palangkaraya" },
{ value: "177", name: "Palembang" },
{ value: "178", name: "Palopo" },
{ value: "179", name: "Palu" },
{ value: "180", name: "Pamekasan" },
{ value: "181", name: "Pandeglang" },
{ value: "182", name: "Pangka_" },
{ value: "183", name: "Pangkajene Sidenreng" },
{ value: "184", name: "Pangkalan Bun" },
{ value: "185", name: "Pangkalpinang" },
{ value: "186", name: "Panyabungan" },
{ value: "187", name: "Pare" },
{ value: "188", name: "Parepare" },
{ value: "189", name: "Pariaman" },
{ value: "190", name: "Pasuruan" },
{ value: "191", name: "Pati" },
{ value: "192", name: "Payakumbuh" },
{ value: "193", name: "Pekalongan" },
{ value: "194", name: "Pekan Baru" },
{ value: "195", name: "Pemalang" },
{ value: "196", name: "Pematangsiantar" },
{ value: "197", name: "Pendopo" },
{ value: "198", name: "Pinrang" },
{ value: "199", name: "Pleihari" },
{ value: "200", name: "Polewali" },
{ value: "201", name: "Pondok Gede" },
{ value: "202", name: "Ponorogo" },
{ value: "203", name: "Pontianak" },
{ value: "204", name: "Poso" },
{ value: "205", name: "Prabumulih" },
{ value: "206", name: "Praya" },
{ value: "207", name: "Probolinggo" },
{ value: "208", name: "Purbalingga" },
{ value: "209", name: "Purukcahu" },
{ value: "210", name: "Purwakarta" },
{ value: "211", name: "Purwodadigrobogan" },
{ value: "212", name: "Purwokerto" },
{ value: "213", name: "Purworejo" },
{ value: "214", name: "Putussibau" },
{ value: "215", name: "Raha" },
{ value: "216", name: "Rangkasbitung" },
{ value: "217", name: "Rantau" },
{ value: "218", name: "Rantauprapat" },
{ value: "219", name: "Rantepao" },
{ value: "220", name: "Rembang" },
{ value: "221", name: "Rengat" },
{ value: "222", name: "Ruteng" },
{ value: "223", name: "Sabang" },
{ value: "224", name: "Salatiga" },
{ value: "225", name: "Samarinda" },
{ value: "313", name: "Sambas, Kalbar" },
{ value: "226", name: "Sampang" },
{ value: "227", name: "Sampit" },
{ value: "228", name: "Sanggau" },
{ value: "229", name: "Sawahlunto" },
{ value: "230", name: "Sekayu" },
{ value: "231", name: "Selong" },
{ value: "232", name: "Semarang" },
{ value: "233", name: "Sengkang" },
{ value: "234", name: "Serang" },
{ value: "235", name: "Serui" },
{ value: "236", name: "Sibolga" },
{ value: "237", name: "Sidikalang" },
{ value: "238", name: "Sidoarjo" },
{ value: "239", name: "Sigli" },
{ value: "240", name: "Singaparna" },
{ value: "241", name: "Singaraja" },
{ value: "242", name: "Singkawang" },
{ value: "243", name: "Sinjai" },
{ value: "244", name: "Sintang" },
{ value: "245", name: "Situbondo" },
{ value: "246", name: "Slawi" },
{ value: "247", name: "Sleman" },
{ value: "248", name: "Soasiu" },
{ value: "249", name: "Soe" },
{ value: "250", name: "Solo" },
{ value: "251", name: "Solok" },
{ value: "252", name: "Soreang" },
{ value: "253", name: "Sorong" },
{ value: "254", name: "Sragen" },
{ value: "255", name: "Stabat" },
{ value: "256", name: "Subang" },
{ value: "257", name: "Sukabumi" },
{ value: "258", name: "Sukoharjo" },
{ value: "259", name: "Sumbawa Besar" },
{ value: "260", name: "Sumedang" },
{ value: "261", name: "Sumenep" },
{ value: "262", name: "Sungai Liat" },
{ value: "263", name: "Sungai Penuh" },
{ value: "264", name: "Sungguminasa" },
{ value: "265", name: "Surabaya" },
{ value: "266", name: "Surakarta" },
{ value: "267", name: "Tabanan" },
{ value: "268", name: "Tahuna" },
{ value: "269", name: "Takalar" },
{ value: "270", name: "Takengon" },
{ value: "271", name: "Tamiang Layang" },
{ value: "272", name: "Tanah Grogot" },
{ value: "273", name: "Tangerang" },
{ value: "274", name: "Tanjung Balai" },
{ value: "275", name: "Tanjung Enim" },
{ value: "276", name: "Tanjung Pandan" },
{ value: "277", name: "Tanjung Pinang" },
{ value: "278", name: "Tanjung Redep" },
{ value: "279", name: "Tanjung Selor" },
{ value: "280", name: "Tapak Tuan" },
{ value: "281", name: "Tarakan" },
{ value: "282", name: "Tarutung" },
{ value: "283", name: "Tasikmalaya" },
{ value: "284", name: "Tebing Tinggi" },
{ value: "285", name: "Tegal" },
{ value: "286", name: "Temanggung" },
{ value: "287", name: "Tembilahan" },
{ value: "288", name: "Tenggarong" },
{ value: "289", name: "Ternate" },
{ value: "290", name: "Tolitoli" },
{ value: "291", name: "Tondano" },
{ value: "292", name: "Trenggalek" },
{ value: "293", name: "Tual" },
{ value: "294", name: "Tuban" },
{ value: "295", name: "Tulung Agung" },
{ value: "296", name: "Ujung Berung" },
{ value: "297", name: "Ungaran" },
{ value: "298", name: "Waikabubak" },
{ value: "299", name: "Waingapu" },
{ value: "300", name: "Wamena" },
{ value: "301", name: "Watampone" },
{ value: "302", name: "Watansoppeng" },
{ value: "303", name: "Wates" },
{ value: "304", name: "Wonogiri" },
{ value: "305", name: "Wonosari" },
{ value: "306", name: "Wonosobo" },
{ value: "307", name: "Yogyakarta" },
],
searchByName(query) {
  const result = JadwalSholat.LIST.find(
    (item) => item.name.toLowerCase().includes(query.toLowerCase())
  );

  if (result) {
    return result;
  }

  return null;
},
byCity(q){
    return this.byId(this.searchByName(q).value);
},
async byId(id){
    const res = await fetch('https://jadwalsholat.org/jadwal-sholat/monthly.php?id='+id);
    const data = await res.text();
    const $ = cheerio.load(data);
    const out = {
        title: $('tr.table_title h1').text().trim(),
        month: $('tr.table_title h2').text().trim(),
        city: $('option:selected').text().trim(),
        list: []
    };
    
    $('tr').each((i, e)=>{
        if(!['table_highlight','table_dark','table_light'].includes($(e).attr('class'))) return;
        let obj = {
            tanggal: $(e).find('td:eq(0)').text(),
            imsyak: $(e).find('td:eq(1)').text(),
            shubuh: $(e).find('td:eq(2)').text(),
            terbit: $(e).find('td:eq(3)').text(),
            dhuha: $(e).find('td:eq(4)').text(),
            dzuhur: $(e).find('td:eq(5)').text(),
            ashr: $(e).find('td:eq(6)').text(),
            maghrib: $(e).find('td:eq(7)').text(),
            isya: $(e).find('td:eq(8)').text(),
        };
        if ($(e).attr('class')==='table_highlight') out.today = obj;
        out.list.push(obj)
    })
    
    return out;
}
};

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