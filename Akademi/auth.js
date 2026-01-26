(function() {
    const loggedInUser = localStorage.getItem('akademiLoggedInUser');
    
    const currentPath = window.location.pathname;
    
    const isLoginPage = currentPath.includes('/login/') || currentPath.includes('login.html');
    const isSignupPage = currentPath.includes('/singup/') || currentPath.includes('signup.html');
    
    if (!loggedInUser && !isLoginPage && !isSignupPage) {
        const baseFolder = currentPath.includes('/dashboard/') || currentPath.includes('/event/') || currentPath.includes('/user/') 
            ? '../login/login.html' 
            : 'login/login.html';
        window.location.href = baseFolder;
        return;
    }
    
    if (loggedInUser && isLoginPage) {
        window.location.href = '../dashboard/Dashboard.html';
        return;
    }
})();

function getCurrentUser() {
    const userStr = localStorage.getItem('akademiLoggedInUser');
    return userStr ? JSON.parse(userStr) : null;
}
