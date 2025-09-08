// ==========================
// FUNÇÕES GERAIS DO SITE
// ==========================

// FUNÇÕES DE MENU LATERAL
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        if (sidebar.style.left === '0px' || sidebar.style.width === '250px') {
            sidebar.style.left = '-250px';
            sidebar.style.width = '0';
        } else {
            sidebar.style.left = '0';
            sidebar.style.width = '250px';
        }
    }
}

// FUNÇÕES DE LOGIN/CADASTRO
function showForm(formId) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => button.classList.remove('active'));

    if (loginForm) loginForm.classList.remove('active');
    if (registerForm) registerForm.classList.remove('active');

    if (formId === 'login') {
        if (loginForm) loginForm.classList.add('active');
        document.querySelector('.tab-button:nth-child(1)')?.classList.add('active');
    } else if (formId === 'register') {
        if (registerForm) registerForm.classList.add('active');
        document.querySelector('.tab-button:nth-child(2)')?.classList.add('active');
    }
}

// FUNÇÕES DO CARRINHO
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCountEl = document.querySelector('.cart-count');

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountEl) {
        cartCountEl.textContent = count;
    }
}

// Função para adicionar produto ao carrinho
function addToCart(product) {
    const existingProduct = cart.find(item => item._id === product._id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`"${product.name}" adicionado ao carrinho!`);
}

// Carregar carrinho na página de carrinho.html
function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    if (!cartItemsContainer || !subtotalEl) return;

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach((product, index) => {
        subtotal += product.price * product.quantity;
        const card = document.createElement('div');
        card.classList.add('cart-item');
        card.innerHTML = `
            <img src="${product.photo || 'images/default-product.png'}" alt="${product.name}">
            <div class="cart-info">
                <h4>${product.name}</h4>
                <p>Preço: R$ ${product.price.toFixed(2)}</p>
                <p>Quantidade: ${product.quantity}</p>
                <p>Total: R$ ${(product.price * product.quantity).toFixed(2)}</p>
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
    if (totalEl) totalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
}

// ==========================
// FUNÇÕES DO PAINEL DE ADMIN
// ==========================

// Função para alternar entre seções do painel
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-button[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

// Subcategorias dinâmicas no formulário de produto
const categorySelect = document.getElementById('product-category');
const subcategorySelect = document.getElementById('product-subcategory');
const subcategories = {
    "Instrumentos": ["Guitarras", "Violões", "Teclados", "Baterias", "Outros instrumentos"],
    "Acessórios": ["Palhetas", "Bolsas", "Mochilas", "Camisas", "Pedais para teclado", "Cordas de nylon", "Cordas de metal", "Outros acessórios"]
};
if (categorySelect && subcategorySelect) {
    categorySelect.addEventListener('change', () => {
        const selected = categorySelect.value;
        subcategorySelect.innerHTML = '<option value="">Selecione...</option>';
        if (subcategories[selected]) {
            subcategories[selected].forEach(sub => {
                const option = document.createElement('option');
                option.value = sub;
                option.textContent = sub;
                subcategorySelect.appendChild(option);
            });
        }
    });
}

// Pré-visualização de imagem
const photoFile = document.getElementById('product-photo-file');
const photoURL = document.getElementById('product-photo');
const preview = document.getElementById('preview-photo');
if (photoFile && photoURL && preview) {
    photoFile.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                preview.src = ev.target.result;
                preview.style.display = 'block';
                photoURL.value = '';
            };
            reader.readAsDataURL(file);
        }
    });
    photoURL.addEventListener('input', e => {
        if (photoURL.value) {
            preview.src = photoURL.value;
            preview.style.display = 'block';
            photoFile.value = '';
        } else {
            preview.style.display = 'none';
        }
    });
}

// Fetch e render (Painel Admin)
let users = [], products = [];

async function fetchUsers() {
    try {
        const res = await fetch('https://backend-fk1s.onrender.com/admin/users', { credentials: 'include' });
        if (!res.ok) {
            const errorText = await res.text();
            if (document.getElementById('users-table')) {
                document.getElementById('users-table').querySelector('tbody').innerHTML = `<tr><td colspan="5">Erro ao carregar usuários: ${errorText}</td></tr>`;
            }
            return;
        }
        users = await res.json();
        const tbody = document.querySelector('#users-table tbody');
        tbody.innerHTML = '';
        document.getElementById('total-users').innerText = users.length;
        users.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${u.photo || 'images/minha-conta.png'}" class="user-thumb"></td>
                <td>${u.displayName || ''}</td>
                <td>${u.email || ''}</td>
                <td class="role-${u.role || 'user'}">${u.role || 'user'}</td>
                <td>${new Date(u.createdAt).toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
        if (document.getElementById('users-table')) {
            document.getElementById('users-table').querySelector('tbody').innerHTML = '<tr><td colspan="5">Erro ao carregar usuários. Verifique sua conexão.</td></tr>';
        }
    }
}

async function fetchProducts() {
    try {
        const res = await fetch('https://backend-fk1s.onrender.com/admin/products', { credentials: 'include' });
        if (!res.ok) {
            const errorText = await res.text();
            if (document.getElementById('products-table')) {
                document.getElementById('products-table').querySelector('tbody').innerHTML = `<tr><td colspan="8">Erro ao carregar produtos: ${errorText}</td></tr>`;
            }
            return;
        }
        products = await res.json();
        const tbody = document.querySelector('#products-table tbody');
        tbody.innerHTML = '';
        products.forEach(p => {
            if (!p._id) return;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${p.photo || 'images/default-product.png'}" width="50"></td>
                <td><input type="text" value="${p.name || ''}" data-id="${p._id}" class="prod-name"></td>
                <td><input type="number" value="${p.price || 0}" data-id="${p._id}" class="prod-price"></td>
                <td><input type="number" value="${p.stock || 0}" data-id="${p._id}" class="prod-stock"></td>
                <td><input type="text" value="${p.description || ''}" data-id="${p._id}" class="prod-desc"></td>
                <td><input type="text" value="${p.category || ''}" data-id="${p._id}" class="prod-category"></td>
                <td><input type="text" value="${p.subcategory || ''}" data-id="${p._id}" class="prod-subcategory"></td>
                <td>
                    <button onclick="updateProduct('${p._id}')">Atualizar</button>
                    <button onclick="deleteProduct('${p._id}')">Remover</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
        if (document.getElementById('products-table')) {
            document.getElementById('products-table').querySelector('tbody').innerHTML = '<tr><td colspan="8">Erro ao carregar produtos. Verifique sua conexão.</td></tr>';
        }
    }
}

async function updateProduct(id) {
    const name = document.querySelector(`.prod-name[data-id="${id}"]`)?.value;
    const price = parseFloat(document.querySelector(`.prod-price[data-id="${id}"]`)?.value);
    const stock = parseInt(document.querySelector(`.prod-stock[data-id="${id}"]`)?.value);
    const desc = document.querySelector(`.prod-desc[data-id="${id}"]`)?.value;
    const category = document.querySelector(`.prod-category[data-id="${id}"]`)?.value;
    const subcategory = document.querySelector(`.prod-subcategory[data-id="${id}"]`)?.value;

    const res = await fetch(`https://backend-fk1s.onrender.com/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, stock, description: desc, category, subcategory }),
        credentials: 'include'
    });
    if (res.ok) {
        alert('Produto atualizado!');
        fetchProducts();
    } else {
        alert('Erro ao atualizar produto.');
    }
}

async function deleteProduct(id) {
    if (confirm('Deseja remover este produto?')) {
        const res = await fetch(`https://backend-fk1s.onrender.com/admin/products/${id}`, { method: 'DELETE', credentials: 'include' });
        if (res.ok) {
            fetchProducts();
        } else {
            alert('Erro ao remover produto.');
        }
    }
}

// Adicionar produto
const newProductForm = document.getElementById('new-product-form');
if (newProductForm) {
    newProductForm.addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        const desc = document.getElementById('product-description').value;
        const category = categorySelect.value;
        const subcategory = subcategorySelect.value;

        let photo = photoURL.value;

        if (photoFile && photoFile.files[0]) {
            const file = photoFile.files[0];
            photo = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.onerror = err => reject(err);
                reader.readAsDataURL(file);
            });
        }

        const res = await fetch('https://backend-fk1s.onrender.com/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, stock, description: desc, category, subcategory, photo }),
            credentials: 'include'
        });

        if (res.ok) {
            alert('Produto adicionado!');
            document.getElementById('new-product-form').reset();
            if (preview) preview.style.display = 'none';
            fetchProducts();
        } else {
            const text = await res.text();
            alert('Erro: ' + text);
        }
    });
}

// Inicial
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('cart-items-container')) {
        loadCart();
    }
    // Verifica se a página é o painel de admin antes de tentar buscar os dados
    if (document.getElementById('users-section')) {
        fetchUsers();
    }
    if (document.getElementById('products-section')) {
        fetchProducts();
    }
});