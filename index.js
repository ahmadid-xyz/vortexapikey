<!DOCTYPE html>
<html lang="id">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <title>Next Generation APIs - Dashboard</title>
<meta name="keywords" content="vor api, vortexion bot, bot vortex, vortex ai, chat gpt, bot WhatsApp, developer baileys, baileys official, baileys button, bot button, baileys interactive, WhatsApp bot, WhatsApp bot interactive, vortexion apikey, vortexion official">
 <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/css/bootstrap.min.css" rel="stylesheet">
 <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
 <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
 <style>

 body {
 font-family: 'Roboto', sans-serif;
 background: #f1f4f9;
 color: #333;
 }
 a {
 text-decoration: none;
 }
 
 .sidebar {
 background: #1f2937;
 min-height: 100vh;
 color: #cbd5e1;
 }
 .sidebar .nav-link {
 color: #cbd5e1;
 transition: background 0.3s, color 0.3s;
 }
 .sidebar .nav-link:hover, .sidebar .nav-link.active {
 background: #374151;
 color: #fff;
 }
 .sidebar .sidebar-brand {
 font-size: 1.25rem;
 font-weight: 500;
 color: #fff;
 padding: 1rem;
 text-align: center;
 border-bottom: 1px solid #374151;
 }
 .sidebar img {
 width: 50px;
 margin-bottom: 0.5rem;
 }
 
 .navbar {
 background: #fff;
 box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
 }
 
 .card {
 border: none;
 border-radius: 0.75rem;
 box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1);
 margin-bottom: 1.5rem;
 }
 .card-title {
 font-weight: 700;
 }
 
 .footer {
 background: #fff;
 padding: 1rem;
 text-align: center;
 border-top: 1px solid #e5e7eb;
 }

 .scroll-to-top {
 position: fixed;
 bottom: 1rem;
 right: 1rem;
 background: #1f2937;
 color: #fff;
 width: 45px;
 height: 45px;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 transition: background 0.3s;
 }
 .scroll-to-top:hover {
 background: #374151;
 }
 </style>
</head>
<body id="top">
 <div class="d-flex">
 <nav class="sidebar p-3">
 <div class="sidebar-brand">
 <img src="https://files.catbox.moe/7hm4hj.jpg" class="rounded-circle" alt="Avatar">
 <div>Vor APIs</div>
 </div>
 <ul class="nav flex-column mt-4">
 <li class="nav-item mb-2">
 <a class="nav-link active" href="#">
 <i class="fas fa-thermometer-three-quarters me-2"></i>
 STATUS
 </a>
 </li>
 <li class="nav-item mt-3">
 <button class="btn btn-outline-light w-100" data-bs-toggle="modal" data-bs-target="#apiModal">
 <i class="fas fa-list me-2"></i> Go To Api
 </button>
 </li>
 </ul>
 </nav>
 <div class="flex-grow-1">
 <nav class="navbar navbar-expand navbar-light mb-4">
 <div class="container-fluid">
 <button class="btn btn-outline-secondary" id="sidebarToggle">
 <i class="fas fa-bars"></i>
 </button>
 <ul class="navbar-nav ms-auto">
 <li class="nav-item dropdown">
 <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
 <img src="https://files.catbox.moe/7hm4hj.jpg" class="rounded-circle" style="width: 40px;" alt="Avatar">
 </a>
<!-- Dropdown Menu -->
<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
 <li><a class="dropdown-item" href="#" id="profileLink">Profil</a></li>
 <li><a class="dropdown-item" href="#" id="settingsLink">Pengaturan</a></li>
 <li><hr class="dropdown-divider"></li>
 <li><a class="dropdown-item" href="#">Keluar</a></li>
</ul>

<!-- Modal Profil -->
<div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
 <div class="modal-dialog">
 <div class="modal-content">
 <div class="modal-header">
 <h5 class="modal-title" id="profileModalLabel">Profile Website</h5>
 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
 </div>
 <div class="modal-body">
 <p id="profileName">Nama Pengembang: Cloud AhmadXyz</p>
 <p id="profileEmail">Email: vortexionchannel@gmail.com</p>
 <p id="profilePhone">Nomor Telepon: +6271527100923</p>
 </div>
 <div class="modal-footer">
 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
 </div>
 </div>
 </div>
</div>
<div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="settingsModalLabel" aria-hidden="true">
 <div class="modal-dialog">
 <div class="modal-content">
 <div class="modal-header">
 <h5 class="modal-title" id="settingsModalLabel">Pengaturan</h5>
 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
 </div>
 <div class="modal-body">
 <div class="mb-3">
 <label for="languageSelect" class="form-label" id="languageLabel">Bahasa</label>
 <select class="form-select" id="languageSelect">
 <option value="id">Bahasa Indonesia</option>
 <option value="en">English</option>
 </select>
 </div>
 <div class="mb-3">
 <label for="themeSelect" class="form-label" id="themeLabel">Tema</label>
 <select class="form-select" id="themeSelect">
 <option value="light">Terang</option>
 <option value="dark">Gelap</option>
 </select>
 </div>
 </div>
 <div class="modal-footer">
 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
 <button type="button" class="btn btn-primary" id="saveSettings">Simpan Perubahan</button>
 </div>
 </div>
 </div>
</div>
 </nav>
 <div class="container-fluid">
 <div class="mb-4">
 <h2 class="fw-bold">Dashboard API</h2>
 <p class="text-muted">Selamat datang! Klik tombol "Go To Api" pada sidebar menu untuk mengeksplorasi seluruh layanan API kami.</p>
 </div>
 <div class="row">
 <div class="col-lg-12">
 <div class="card">
 <div class="card-body">
 <h5 class="card-title text-primary">Project Oleh</h5>
 <p class="card-text">Vortex Fukushima Team</p>
 </div>
 </div>
 </div>
 </div>
 <div class="row">
 <div class="col-md-4">
 <div class="card text-center">
 <div class="card-body">
 <h6 class="text-muted">Post</h6>
 <h4 id="postCount" class="fw-bold">0</h4>
 <i class="fas fa-fire fa-2x text-warning"></i>
 </div>
 </div>
 </div>
 <div class="col-md-4">
 <div class="card text-center">
 <div class="card-body">
 <h6 class="text-muted">Battery</h6>
 <h4 id="batteryLevel" class="fw-bold">100%</h4>
 <i class="fas fa-battery-full fa-2x text-success"></i>
 </div>
 </div>
 </div>
 <div class="col-md-4">
 <div class="card text-center">
 <div class="card-body">
 <h6 class="text-muted">Waktu</h6>
 <h4 id="currentTime" class="fw-bold">Loading...</h4>
 <i class="fas fa-calendar fa-2x text-primary"></i>
 </div>
 </div>
 </div>
 </div>
 <div class="row mt-4">
 <div class="col text-center">
 <p class="fw-bold">Dukung Kami</p>
 <a href="https://whatsapp.com/channel/0029VaxL7402ZjCmqq6FjE1C" class="btn btn-primary btn-sm" target="_blank">
 <i class="fab fa-whatsapp"></i> Whatsapp
 </a>
 </div>
 </div>
 </div>
 <footer class="footer mt-auto">
 <div class="container">
 <span class="text-muted">Made by <a href="#" style="color: #d82007;">Vor APIs</a></span>
 </div>
 </footer>
 </div>
 </div>
 <div class="modal fade" id="apiModal" tabindex="-1" aria-labelledby="apiModalLabel" aria-hidden="true">
 <div class="modal-dialog modal-lg modal-dialog-scrollable">
 <div class="modal-content">
 <div class="modal-header">
 <h5 class="modal-title" id="apiModalLabel">Daftar Layanan API</h5>
 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
 </div>
 <div class="modal-body">
 <h6 class="text-muted">AI</h6>
 <ul class="list-group mb-3">
 <li class="list-group-item">
 <a href="api/viooai?q=hello" target="_blank">LuminAi</a>
 </li>
 <li class="list-group-item">
 <a href="api/openai?q=halo" target="_blank">OpenAi</a>
 </li>
 <li class="list-group-item">
 <a href="api/islamai?q=halo" target="_blank">IslamAi</a>
 </li>
 </ul>
 <h6 class="text-muted">Search</h6>
 <ul class="list-group mb-3">
 <li class="list-group-item">
 <a href="api/appstore?q=minecraft" target="_blank">App Store</a>
 </li>
 <li class="list-group-item">
 <a href="api/bingimg?q=kodok" target="_blank">Bing Img</a>
 </li>
 <li class="list-group-item">
 <a href="api/lahelu?q=anime" target="_blank">Lahelu</a>
 </li>
 <li class="list-group-item">
 <a href="api/playstore?q=minecraft" target="_blank">Play Store</a>
 </li>
 <li class="list-group-item">
 <a href="api/githubSearch?q=webapi" target="_blank">Github Search</a>
 </li>
 <li class="list-group-item">
 <a href="api/pin?q=ikann" target="_blank">Pinterest</a>
 </li>
 <li class="list-group-item">
 <a href="api/search-image?query=ikann" target="_blank">Search Image</a>
 </li>
 <li class="list-group-item">
 <a href="api/yts?q=acumalaka" target="_blank">Youtube Search</a>
 </li>
 </ul>
 <h6 class="text-muted">Stalk</h6>
 <ul class="list-group mb-3">
 <li class="list-group-item">
 <a href="api/ttstalk?q=ikanngeming" target="_blank">Tiktok Stalk</a>
 </li>
 <li class="list-group-item">
 <a href="api/npmStalk?q=ikanngeming" target="_blank">Npm Stalk</a>
 </li>
 <li class="list-group-item">
 <a href="api/ffStalk?q=12345678" target="_blank">FF Stalk</a>
 </li>
 </ul>
 <h6 class="text-muted">Tools API</h6>
 <ul class="list-group mb-3">
 <li class="list-group-item">
 <a href="api/remove-bg?imageUrl=" target="_blank">Remove-bg</a>
 </li>
 <li class="list-group-item">
 <a href="api/bratv1?q=hai" target="_blank">Brat</a>
 </li>
 <li class="list-group-item">
 <a href="api/bratv2?q=halo" target="_blank">BratV2</a>
 </li>
 <li class="list-group-item">
 <a href="api/utf8?encodedText=ZnVrdXNoaW1haWQ=" target="_blank">Utf8</a>
 </li>
 <li class="list-group-item">
 <a href="api/toBase64?text=hai" target="_blank">toBase64</a>
 </li>
 </ul>
 <h6 class="text-muted">Orkut</h6>
 <ul class="list-group">
 <li class="list-group-item">
 <a href="/api/orkut/createPayment?amount=&codeqr=" target="_blank">Create Payment</a>
 </li>
 </ul>
 </div>
 <div class="modal-footer">
 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
 </div>
 </div>
 </div>
 </div>
 <a class="scroll-to-top" href="#top">
 <i class="fas fa-angle-up"></i>
 </a>

 <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/js/bootstrap.bundle.min.js"></script>
 <script>
 function updateClock() {
 const now = new Date();
 document.getElementById('currentTime').textContent = now.toLocaleTimeString();
 }
 setInterval(updateClock, 1000);
 updateClock();

 document.getElementById('postCount').textContent = document.querySelectorAll('.modal-body a').length;

 // Update status baterai (jika didukung)
 async function updateBattery() {
 try {
 const battery = await navigator.getBattery();
 document.getElementById('batteryLevel').textContent = Math.floor(battery.level * 100) + '%';
 } catch (e) {
 document.getElementById('batteryLevel').textContent = '∞';
 }
 }
 updateBattery();

 document.getElementById('sidebarToggle').addEventListener('click', () => {
 document.querySelector('.sidebar').classList.toggle('d-none');
 });
 </script>
 <script>
 function saveSettings() {
 const selectedLanguage = document.getElementById("languageSelect").value;
 const selectedTheme = document.getElementById("themeSelect").value;
 localStorage.setItem("language", selectedLanguage);
 localStorage.setItem("theme", selectedTheme);
 applyLanguage(selectedLanguage);
 applyTheme(selectedTheme);
 }
 function applyLanguage(language) {
 const languageData = {
 id: {
 profileName: "Nama",
 profileEmail: "Email",
 profilePhone: "Nomor Telepon",
 languageLabel: "Bahasa",
 themeLabel: "Tema",
 },
 en: {
 profileName: "Nama Pengembang",
 profileEmail: "Email",
 profilePhone: "Phone Number",
 languageLabel: "Language",
 themeLabel: "Theme",
 },
 };
 document.getElementById("profileName").innerText = languageData[language].profileName + ": Cloud AhmadXyz";
 document.getElementById("profileEmail").innerText = languageData[language].profileEmail + ": vortexionchannel@gmail.com";
 document.getElementById("profilePhone").innerText = languageData[language].profilePhone + ": +62 815 271 00923";
 document.getElementById("languageLabel").innerText = languageData[language].languageLabel;
 document.getElementById("themeLabel").innerText = languageData[language].themeLabel;
 }
 function applyTheme(theme) {
 if (theme === "dark") {
 document.body.classList.add("bg-dark", "text-light");
 document.body.classList.remove("bg-light", "text-dark");
 } else {
 document.body.classList.add("bg-light", "text-dark");
 document.body.classList.remove("bg-dark", "text-light");
 }
 }
 document.getElementById("profileLink").addEventListener("click", function(event) {
 event.preventDefault();
 var profileModal = new bootstrap.Modal(document.getElementById('profileModal'));
 profileModal.show();
 });
 document.getElementById("settingsLink").addEventListener("click", function(event) {
 event.preventDefault();
 var settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
 settingsModal.show();
 });
 document.getElementById("saveSettings").addEventListener("click", function() {
 saveSettings();
 var settingsModal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
 settingsModal.hide();
 });
 document.addEventListener("DOMContentLoaded", function() {
 const language = localStorage.getItem("language") || "id"; 
 const theme = localStorage.getItem("theme") || "light"; 
 applyLanguage(language);
 applyTheme(theme);
 document.getElementById("languageSelect").value = language;
 document.getElementById("themeSelect").value = theme;
 });
</script>
</body>
</html>