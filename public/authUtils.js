function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function parseJwt(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
    } catch (e) {
        return null;
    }
}

function updateNavbarOnLogin() {
    const token = getCookie('jwt');
    const user = parseJwt(token);

    const registerLogin = document.getElementById('registerLoginNavItem');
    const dashboard = document.getElementById('dashboardNavItem');
    const profileDropdown = document.getElementById('profileDropdown');

    if (user) {
        registerLogin.classList.add('d-none');
        profileDropdown.classList.remove('d-none');

        // Show dashboard only for specific roles
        if (user.role === 'shopOwner' || user.role === 'admin') {
            dashboard.classList.remove('d-none');
        } else {
            dashboard.classList.add('d-none');
        }
    } else {
        registerLogin.classList.remove('d-none');
        profileDropdown.classList.add('d-none');
        dashboard.classList.add('d-none');
    }
}

function logout() {
    document.cookie = "jwt=; path=/; max-age=0"; // Clear JWT
    updateNavbarOnLogin(); // Reset navbar
    window.location.href = "index.html"; // Redirect
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavbarOnLogin();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});
