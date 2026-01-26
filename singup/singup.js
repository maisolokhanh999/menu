const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    // Simple redirect, in real app, check credentials
    window.location.href = "../login/login.html";
});
