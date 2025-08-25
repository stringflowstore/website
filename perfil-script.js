// Funções de navegação do menu lateral (mantido como está no seu código)
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px';
    } else {
        sidebar.style.left = '0px';
    }
}

// Lógica para obter e exibir os dados do usuário
document.addEventListener('DOMContentLoaded', () => {
    fetch('/user')
        .then(response => response.json())
        .then(user => {
            if (user.isLoggedIn) {
                // Seleciona o elemento da foto e do nome usando os IDs do SEU HTML
                const profileImg = document.getElementById('profile-picture');
                const profileName = document.getElementById('profile-name');

                // Tenta carregar a foto do Google. Se falhar, usa a foto padrão.
                if (user.photo) {
                    profileImg.src = user.photo;
                    profileImg.onerror = () => {
                        // Se a foto do Google não carregar, use a imagem padrão
                        profileImg.src = 'images/minha-conta.png';
                    };
                }
                
                // Exibe o nome do usuário
                profileName.innerText = user.displayName;

                // Adiciona o link do painel de controle se for um admin
                if (user.role === 'admin') {
                    const profileInfo = document.querySelector('.profile-info');
                    const adminLink = document.createElement('a');
                    adminLink.href = 'painel.html';
                    adminLink.innerText = 'Painel Administrativo';
                    adminLink.className = 'cta-button';
                    adminLink.style.marginTop = '20px';
                    profileInfo.appendChild(adminLink);
                }

            } else {
                // Se não estiver logado, redireciona para a página de login
                window.location.href = '/minha-conta.html';
            }
        })
        .catch(error => console.error('Erro ao buscar dados do usuário:', error));
});
