// --- DATA ---
let cart = [];
const FREE_SHIPPING_LIMIT = 150000;
let currentUser = null;
let registeredUsers = [];

const products = [
    { id: 1, name: "Kit Post-Láser", price: 45000, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887" },
    { id: 2, name: "Serum Vitamina C", price: 32000, img: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=2670" },
    { id: 3, name: "Crema Hidratante", price: 28000, img: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1760" },
    { id: 4, name: "Exfoliante Suave", price: 18000, img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888" },
];

const chapters = [
    { title: "Origen", text: "En 2024, desafiamos la norma. La belleza no tiene por qué doler. Lo que empezó como una idea se convirtió en revolución.", img: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070" },
    { title: "Filosofía", text: "La piel es el espejo de tu historia. Nosotros solo ayudamos a pulirlo. Creemos en el minimalismo eficaz.", img: "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=2073" },
    { title: "Tecnología", text: "Láser diodo de triple longitud de onda. Precisión milimétrica para todo tipo de pieles, sin excepciones.", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961" },
    { title: "Espacios", text: "Diseñamos clínicas que parecen galerías de arte, no hospitales. El ambiente sana tanto como el tratamiento.", img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000" },
    { title: "Equipo", text: "Dermatólogos, ingenieros y artistas trabajando juntos. La multidisciplina es nuestro superpoder.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887" },
    { title: "Ingredientes", text: "Biotecnología limpia. Sin parabenos, sin crueldad animal. Solo resultados clínicamente probados.", img: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1760" },
    { title: "Manifiesto", text: "El futuro de la piel es inteligente, sostenible y sin dolor. Bienvenido a Depiline.", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053" },
];

window.onload = () => { renderShop(); renderAbout(); updateCart(); };

function router(view) {
        if(view === 'account' && currentUser) view = 'profile';
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        document.getElementById(`view-${view}`).classList.add('active');
        window.scrollTo(0,0);
}

function toggleOverlay(id) { document.getElementById(`overlay-${id}`).classList.toggle('open'); }
function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function renderShop() {
    const grid = document.getElementById('shop-grid');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="pc-img"><img src="${p.img}"></div>
            <div class="pc-name">${p.name}</div>
            <div style="font-size:13px; color:#777; margin-bottom:10px;">$${p.price.toLocaleString()}</div>
            <button class="pc-btn" onclick="addToCart(${p.id})">ADD TO CART</button>
        </div>
    `).join('');
}

function addToCart(id) {
    const prod = products.find(p => p.id === id);
    cart.push(prod);
    updateCart();
    toggleOverlay('cart');
    showToast('Added to cart');
}

function addUpsell() {
    cart.push({name: "Pocket Blush", price: 25000, img: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=1000"});
    updateCart();
    showToast('Upsell added');
}

function updateCart() {
    document.getElementById('cart-counter').innerText = cart.length;
    const list = document.getElementById('cart-list');
    let total = 0;
    if(cart.length === 0) {
            list.innerHTML = '';
            document.getElementById('cart-title').innerText = "Your cart is currently empty";
    } else {
            document.getElementById('cart-title').innerText = "Your Cart";
            list.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" class="ci-img">
                <div class="ci-details"><div class="ci-name">${item.name}</div><div class="ci-price">$${item.price.toLocaleString()}</div></div>
            </div>`).join('');
    }
    cart.forEach(item => total += item.price);
    document.getElementById('cart-total').innerText = '$' + total.toLocaleString();
    const percentage = Math.min((total / FREE_SHIPPING_LIMIT) * 100, 100);
    document.getElementById('ship-fill').style.width = percentage + '%';
    const remaining = FREE_SHIPPING_LIMIT - total;
    const shipMsg = document.getElementById('ship-msg');
    if(total >= FREE_SHIPPING_LIMIT) shipMsg.innerHTML = "You've unlocked <strong>FREE</strong> shipping!";
    else shipMsg.innerHTML = `add $${remaining.toLocaleString()} more for <strong>FREE</strong> shipping`;
}

function toggleAuth(type) {
    document.getElementById('auth-login').classList.toggle('hidden');
    document.getElementById('auth-register').classList.toggle('hidden');
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    registeredUsers.push({name, email, pass, avatar: null});
    showToast('Cuenta creada con éxito');
    setTimeout(() => { toggleAuth('login'); document.getElementById('login-email').value = email; }, 1000);
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    const user = registeredUsers.find(u => u.email === email && u.pass === pass);
    if(user) { currentUser = user; loginSuccess(); }
    else if (email === 'admin@depiline.com' && pass === '123') { currentUser = {name: 'Admin', email: 'admin@depiline.com', pass: '123', avatar: null}; loginSuccess(); }
    else { alert('Credenciales inválidas'); }
}

function loginSuccess() {
    showToast(`Hola, ${currentUser.name}`);
    document.getElementById('btn-login-nav').classList.add('hidden');
    document.getElementById('btn-profile-nav').classList.remove('hidden');
    document.getElementById('btn-profile-nav').style.display = 'flex';
    loadProfileData();
    setTimeout(() => router('profile'), 1000);
}

function handleLogout() {
    currentUser = null;
    document.getElementById('btn-login-nav').classList.remove('hidden');
    document.getElementById('btn-profile-nav').classList.add('hidden');
    document.getElementById('btn-profile-nav').style.display = 'none';
    showToast('Sesión cerrada');
    router('shop');
}

function loadProfileData() {
    document.getElementById('profile-name-display').innerText = currentUser.name;
    document.getElementById('profile-email-display').innerText = currentUser.email;
    document.getElementById('prof-name').value = currentUser.name;
    document.getElementById('prof-email').value = currentUser.email;
    const avatarImg = document.getElementById('profile-img-preview');
    const navAvatar = document.getElementById('header-avatar-img');
    if(currentUser.avatar) {
        avatarImg.src = currentUser.avatar;
        navAvatar.innerHTML = `<img src="${currentUser.avatar}">`;
        navAvatar.classList.add('show');
    } else {
        avatarImg.src = "https://via.placeholder.com/150/cccccc/ffffff?text=" + currentUser.name.charAt(0);
        navAvatar.innerHTML = "";
        navAvatar.classList.remove('show');
    }
}

function updateAvatar(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) { currentUser.avatar = e.target.result; loadProfileData(); showToast('Foto actualizada'); }
        reader.readAsDataURL(input.files[0]);
    }
}

function handleUpdateProfile(e) {
    e.preventDefault();
    currentUser.name = document.getElementById('prof-name').value;
    currentUser.email = document.getElementById('prof-email').value;
    const newPass = document.getElementById('prof-pass').value;
    if(newPass) currentUser.pass = newPass;
    loadProfileData();
    showToast('Perfil actualizado');
}

function renderAbout() {
    const nav = document.getElementById('about-nav');
    const content = document.getElementById('about-content');
    chapters.forEach((ch, i) => {
        const btn = document.createElement('button');
        btn.className = `chapter-btn ${i===0?'active':''}`;
        btn.innerText = `0${i+1}. ${ch.title}`;
        btn.onclick = () => setChapter(i);
        nav.appendChild(btn);
        
        const page = document.createElement('div');
        page.className = `chapter-page ${i===0?'active':''}`;
        page.id = `ch-${i}`;
        page.innerHTML = `<div class="ch-header"><div class="ch-num">0${i+1}</div><div class="ch-title">${ch.title}</div></div><div class="ch-body"><p class="ch-text">${ch.text}</p><div class="ch-img-box"><img src="${ch.img}"></div></div>`;
        content.appendChild(page);
    });
}

function setChapter(i) {
    document.querySelectorAll('.chapter-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.chapter-btn')[i].classList.add('active');
    document.querySelectorAll('.chapter-page').forEach(p => p.classList.remove('active'));
    document.getElementById(`ch-${i}`).classList.add('active');
}

let currentSlide = 0;
const totalSlides = 7;
function nextSlide() {
    document.getElementById(`f-slide-${currentSlide}`).classList.remove('active');
    document.getElementById(`dot-${currentSlide}`).classList.remove('active');
    currentSlide = (currentSlide + 1) % totalSlides;
    document.getElementById(`f-slide-${currentSlide}`).classList.add('active');
    document.getElementById(`dot-${currentSlide}`).classList.add('active');
}