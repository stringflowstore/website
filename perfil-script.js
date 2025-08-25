// arquivo: perfil-script.js

document.addEventListener('DOMContentLoaded', () => {
    // Fetch para a rota de usuário que criamos no server.js
    fetch('/user')
        .then(response => response.json())
        .then(user => {
            if (user.isLoggedIn) {
                document.getElementById('profile-picture').src = user.photo;
                document.getElementById('profile-name').innerText = user.displayName;
            } else {
                window.location.href = '/minha-conta.html'; // Redireciona se não estiver logado
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados do usuário:', error);
        });
});