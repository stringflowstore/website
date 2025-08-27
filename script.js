// ==========================
// FUNÇÕES DE MENU LATERAL
// ==========================
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.left === '0px' || sidebar.style.width === '250px') {
        sidebar.style.left = '-250px';
        sidebar.style.width = '0';
    } else {
        sidebar.style.left = '0';
        sidebar.style.width = '250px';
    }
}

// ==========================
// FUNÇÕES DE LOGIN/CADASTRO
// ==========================
function showForm(formId) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => button.classList.remove('active'));

    loginForm?.classList.remove('active');
    registerForm?.classList.remove('active');

    if (formId === 'login') {
        loginForm?.classList.add('active');
        document.querySelector('.tab-button:nth-child(1)')?.classList.add('active');
    } else if (formId === 'register') {
        registerForm?.classList.add('active');
        document.querySelector('.tab-button:nth-child(2)')?.classList.add('active');
    }
}

// ==========================
// FUNÇÕES DE PERFIL/ADMIN
// ==========================
async function checkUserStatus() {
    try {
        // ⚠️ Alterado para incluir credenciais
        const response = await fetch('https://backend-fk1s.onrender.com/user-status', {
            credentials: 'include'
        });
        const user = await response.json();

        const loginContainer = document.getElementById('login-container');
        const profileContainer = document.getElementById('profile-container');
        const adminLink = document.getElementById('admin-panel-link');
        const logoutBtn = document.getElementById('logout-btn');

        if (user.isLoggedIn) {
            if (loginContainer) loginContainer.style.display = 'none';
            if (profileContainer) profileContainer.style.display = 'block';

            const profileName = document.getElementById('profile-name');
            const profileImg = document.getElementById('profile-picture');

            if (profileName) profileName.innerText = user.displayName || 'Usuário';
            if (profileImg) {
                profileImg.src = user.photo || 'images/minha-conta.png';
                profileImg.onerror = () => profileImg.src = 'images/minha-conta.png';
            }

            if (adminLink) {
                if (user.role === 'admin') {
                    adminLink.style.display = 'block';
                } else {
                    adminLink.style.display = 'none';
                }
            }
            if (logoutBtn) logoutBtn.style.display = 'block';
        } else {
            if (loginContainer) loginContainer.style.display = 'block';
            if (profileContainer) profileContainer.style.display = 'none';
        }
    } catch (err) {
        console.error('Erro ao verificar status do usuário:', err);
    }
}

// ==========================
// LOGOUT
// ==========================
function logout() {
    // ⚠️ Alterado para incluir credenciais
    fetch('https://backend-fk1s.onrender.com/logout', {
        credentials: 'include'
    })
    .then(() => {
        window.location.href = 'minha-conta.html';
    })
    .catch(err => console.error('Erro ao fazer logout:', err));
}

// ==========================
// EVENT LISTENERS GLOBAIS
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    // Para a página de login/cadastro
    const minhaContaPage = document.querySelector('body[onload*="checkUserStatus"]');
    if (minhaContaPage) {
        showForm('login');
        checkUserStatus();
    }
    
    // Para a página de perfil
    if (window.location.pathname.includes('perfil.html')) {
        checkUserStatus();
    }
    
    // Event listeners dos formulários
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', event => {
            event.preventDefault(); 
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', event => {
            event.preventDefault(); 
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

// ==========================
// PRODUTOS
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');

    async function fetchProducts() {
        try {
            // ⚠️ Alterado para incluir credenciais
            const res = await fetch('https://backend-fk1s.onrender.com/products/Instrumentos', {
                credentials: 'include'
            });
            const products = await res.json();
            renderProducts(products);
        } catch (err) {
            console.error('Erro ao buscar produtos:', err);
            if(productGrid) productGrid.innerHTML = '<p>Não foi possível carregar os produtos.</p>';
        }
    }

    async function fetchAccessories() {
        try {
            // ⚠️ Alterado para incluir credenciais
            const res = await fetch('https://backend-fk1s.onrender.com/products/Acessórios', {
                credentials: 'include'
            });
            const products = await res.json();
            renderProducts(products);
        } catch (err) {
            console.error('Erro ao buscar acessórios:', err);
            if(productGrid) productGrid.innerHTML = '<p>Não foi possível carregar os acessórios.</p>';
        }
    }

    function renderProducts(products) {
        if(!productGrid) return;
        productGrid.innerHTML = '';

        products.forEach((product) => {
            const card = document.createElement('div');
            card.classList.add('product-card');

            card.innerHTML = `
                <img src="${product.photo || 'images/default-product.png'}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span class="price">R$ ${product.price.toFixed(2)}</span>
                    <button class="add-to-cart">Adicionar ao Carrinho</button>
                </div>
            `;

            productGrid.appendChild(card);

            card.querySelector('.add-to-cart').addEventListener('click', () => {
                if(!product.category) product.category = "Sem Categoria";
                addToCart(product);
            });
        });
    }

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('Produto adicionado ao carrinho!');
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.length);
    }

    updateCartCount();

    if (window.location.pathname.includes('acessorios.html')) {
        fetchAccessories();
    } else if (window.location.pathname.includes('instrumentos.html') || window.location.pathname === '/' || window.location.pathname === '/index.html') {
        fetchProducts();
    }
});

// ==========================
// CARRINHO EM carrinho.html
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const freteEl = document.getElementById('frete-value');
    const cepInput = document.getElementById('cep');
    const checkoutBtn = document.getElementById('checkout-btn');

    if(!cartItemsContainer) return;

    function loadCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if(cart.length === 0){
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            subtotalEl.textContent = 'R$ 0,00';
            totalEl.textContent = 'R$ 0,00';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach((product, index) => {
            subtotal += product.price;

            const card = document.createElement('div');
            card.classList.add('cart-item');

            card.innerHTML = `
                <img src="${product.photo || 'images/default-product.png'}" alt="${product.name}">
                <div class="cart-info">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <p>R$ ${product.price.toFixed(2)}</p>
                    <p>Categoria: ${product.category || "Sem Categoria"}</p>
                    <button class="remove-item" data-index="${index}">Remover</button>
                </div>
            `;
            cartItemsContainer.appendChild(card);

            card.querySelector('.remove-item').addEventListener('click', () => {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                loadCart();
            });
        });

        subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
        totalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
    }

    document.getElementById('calculate-frete')?.addEventListener('click', () => {
        const cep = cepInput.value.trim();
        if(!cep) return alert('Digite um CEP válido!');
        const frete = 20;
        freteEl.textContent = `Frete: R$ ${frete.toFixed(2)}`;
        const subtotal = parseFloat(subtotalEl.textContent.replace('R$ ',''));
        totalEl.textContent = `R$ ${(subtotal + frete).toFixed(2)}`;
    });

    checkoutBtn?.addEventListener('click', () => {
        alert('Compra finalizada!');
        localStorage.removeItem('cart');
        loadCart();
        updateCartCount();
    });

    loadCart();
});