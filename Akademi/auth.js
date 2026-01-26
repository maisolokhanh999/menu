// Authentication Guard
// This script should be included in all protected pages

(function() {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('akademiLoggedInUser');
    
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Check if current page is login or signup page
    const isLoginPage = currentPath.includes('/login/') || currentPath.includes('login.html');
    const isSignupPage = currentPath.includes('/singup/') || currentPath.includes('signup.html');
    
    // If not logged in and not on login/signup page, redirect to login
    if (!loggedInUser && !isLoginPage && !isSignupPage) {
        // Determine the correct path to login page based on current location
        const baseFolder = currentPath.includes('/dashboard/') || currentPath.includes('/event/') || currentPath.includes('/user/') 
            ? '../login/login.html' 
            : 'login/login.html';
        window.location.href = baseFolder;
        return;
    }
    
    // If logged in and on login page, redirect to dashboard
    if (loggedInUser && isLoginPage) {
        window.location.href = '../dashboard/Dashboard.html';
        return;
    }
})();

// Logout function
// function logout() {
//     if (confirm('Are you sure you want to logout?')) {
//         localStorage.removeItem('akademiLoggedInUser');
//         const currentPath = window.location.pathname;
//         const loginPath = currentPath.includes('/dashboard/') || currentPath.includes('/event/') || currentPath.includes('/user/') 
//             ? '../login/login.html' 
//             : 'login/login.html';
//         window.location.href = loginPath;
//     }
// }

// Get current user info
function getCurrentUser() {
    const userStr = localStorage.getItem('akademiLoggedInUser');
    return userStr ? JSON.parse(userStr) : null;
}
