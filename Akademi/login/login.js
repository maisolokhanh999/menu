const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('akademiUsers')) || [];
    
    // Find user with matching credentials
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store logged in user
        localStorage.setItem('akademiLoggedInUser', JSON.stringify(user));
        // Redirect to dashboard
        window.location.href = "../dashboard/Dashboard.html";
    } else {
        // Show error message
        errorMessage.textContent = "Invalid username or password!";
        errorMessage.style.display = "block";
        
        // Hide error after 3 seconds
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
    }
});
