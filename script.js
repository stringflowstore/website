function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');
    
    if (sidebar.style.width === '250px') {
        sidebar.style.width = '0';
        content.style.marginLeft = '0';
    } else {
        sidebar.style.width = '250px';
        content.style.marginLeft = '250px';
    }
}

// Verificar o status de login e atualizar o cabeçalho
document.addEventListener('DOMContentLoaded', () => {
    const accountLink = document.querySelector('.header-icons .account-icon');
    
    if (accountLink) {
        fetch('/user')
            .then(response => response.json())
            .then(user => {
                if (user.isLoggedIn) {
                    const accountText = accountLink.querySelector('span') || document.createElement('span');
                    accountText.innerText = user.displayName;
                    accountLink.href = 'perfil.html';
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados do usuário:', error);
            });
    }
});