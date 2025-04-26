// authUtils.js
async function authCheck() {
    try {
        const response = await fetch('/api/check-auth', { credentials: 'include' });
        if (!response.ok) throw new Error('Not authenticated');
        const auth = await response.json();
        console.log('Auth Check:', auth); // Καταγραφή της απάντησης
        return auth;
    } catch (error) {
        console.error('Error in authCheck:', error);
        return { isAuthenticated: false, user: null };
    }
}

export async function getUserDetails() {
    try {
        const response = await fetch('/api/user/details', {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch user details');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Εξαγωγή της συνάρτησης
export async function updateNavbarOnLogin() {
    const auth = await authCheck();
    const registerLogin = document.getElementById('registerLoginNavItem');
    const profileDropdown = document.getElementById('profileDropdown');

    // Αποθήκευση της κατάστασης στο sessionStorage
    const navbarState = {
        isAuthenticated: auth.isAuthenticated,
        role: auth.user?.role || null,
    };
    sessionStorage.setItem('navbarState', JSON.stringify(navbarState));
    console.log('Navbar State Updated:', navbarState); // Καταγραφή της αποθηκευμένης κατάστασης

    // Ενημέρωση του DOM
    if (auth.isAuthenticated) {
        registerLogin?.classList.add('d-none');
        profileDropdown?.classList.remove('d-none');
    } else {
        registerLogin?.classList.remove('d-none');
        profileDropdown?.classList.add('d-none');
    }
}

export function applyNavbarStateFromSession() {
    const navbarState = JSON.parse(sessionStorage.getItem('navbarState'));

    const registerLogin = document.getElementById('registerLoginNavItem');
    const profileDropdown = document.getElementById('profileDropdown');

    if (navbarState?.isAuthenticated) {
        registerLogin?.classList.add('d-none');
        profileDropdown?.classList.remove('d-none');
    } else {
        registerLogin?.classList.remove('d-none');
        profileDropdown?.classList.add('d-none');
    }
}

// Logout Functionality
export async function handleLogout() {
    try {
        // Κλήση στο backend για διαγραφή του JWT cookie
        const response = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include', // Περιλαμβάνει cookies για αυθεντικοποίηση
        });

        if (!response.ok) {
            throw new Error('Failed to log out');
        }

        // Καθαρισμός localStorage και sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Ενημέρωση χρήστη και ανακατεύθυνση
        alert('You have been logged out.');
        window.location.href = 'registerLogin.html'; // Ανακατεύθυνση στη σελίδα σύνδεσης
    } catch (error) {
        console.error('Error during logout:', error);
        alert('An error occurred while logging out. Please try again.');
    }
}

