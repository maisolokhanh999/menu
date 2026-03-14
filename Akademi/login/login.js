const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const users = JSON.parse(localStorage.getItem('akademiUsers')) || [];
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('akademiLoggedInUser', JSON.stringify(user));
        window.location.href = "../dashboard/Dashboard.html";
    } else {
        errorMessage.textContent = "Invalid username or password!";
        errorMessage.style.display = "block";
        
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
    }
});
