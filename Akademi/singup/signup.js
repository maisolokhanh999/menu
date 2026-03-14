const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    
    const users = JSON.parse(localStorage.getItem('akademiUsers')) || [];
    
    const existingUser = users.find(u => u.username === username);
    
    if (existingUser) {
        errorMessage.textContent = "Username already exists!";
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
        
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
        return;
    }
    
    const existingEmail = users.find(u => u.email === email);
    
    if (existingEmail) {
        errorMessage.textContent = "Email already registered!";
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
        
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
        return;
    }
    
    const newUser = {
        id: Date.now(),
        username: username,
        password: password,
        fullName: fullName,
        email: email,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('akademiUsers', JSON.stringify(users));
    
    successMessage.textContent = "Account created successfully! Redirecting to login...";
    successMessage.style.display = "block";
    errorMessage.style.display = "none";
    
    loginForm.reset();
    
    setTimeout(() => {
        window.location.href = "../login/login.html";
    }, 2000);
});
