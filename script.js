// Função para alternar a exibição dos formulários de login e cadastro
function showForm(formId) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabButtons = document.querySelectorAll('.tab-button');

    // Remove a classe 'active' de todos os botões de abas
    tabButtons.forEach(button => button.classList.remove('active'));

    // Esconde todos os formulários
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');

    // Exibe o formulário e ativa o botão da aba correspondente
    if (formId === 'login') {
        loginForm.classList.add('active');
        document.querySelector('.tab-button:nth-child(1)').classList.add('active');
    } else if (formId === 'register') {
        registerForm.classList.add('active');
        document.querySelector('.tab-button:nth-child(2)').classList.add('active');
    }
}

// O restante do seu código JavaScript, como a função toggleMenu, pode ser adicionado aqui.
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.width === '250px') {
        sidebar.style.width = '0';
    } else {
        sidebar.style.width = '250px';
    }
}

// Adiciona os event listeners para submissão dos formulários
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    
    // Simula um login bem-sucedido
    console.log('Login form submitted!');
    sessionStorage.setItem('isLoggedIn', 'true'); // Define o estado de login
    
    // Redireciona o usuário para a página de perfil
    window.location.href = 'perfil.html';
});

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Simula um cadastro e login bem-sucedido
    console.log('Register form submitted!');
    sessionStorage.setItem('isLoggedIn', 'true'); // Define o estado de login
    
    // Redireciona o usuário para a página de perfil
    window.location.href = 'perfil.html';
});

// Define o formulário de login como visível na carga inicial
document.addEventListener('DOMContentLoaded', () => {
    // Isso é importante para que o script do HTML não seja o único a checar o login,
    // garantindo que, se o usuário voltar, o estado seja mantido.
    showForm('login');
});
