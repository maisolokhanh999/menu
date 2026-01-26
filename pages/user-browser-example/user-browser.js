// Dữ liệu mẫu users
let users = [
    {
        id: 1,
        name: "Nguyễn Văn An",
        email: "nguyenvanan@email.com",
        role: "Admin",
        status: "Active",
        avatar: "",
        createdDate: "2024-01-15"
    },
    {
        id: 2,
        name: "Trần Thị Bình",
        email: "tranthibinh@email.com",
        role: "Manager",
        status: "Active",
        avatar: "",
        createdDate: "2024-02-20"
    },
    {
        id: 3,
        name: "Lê Hoàng Cường",
        email: "lehoangcuong@email.com",
        role: "User",
        status: "Active",
        avatar: "",
        createdDate: "2024-03-10"
    },
    {
        id: 4,
        name: "Phạm Thị Dung",
        email: "phamthidung@email.com",
        role: "User",
        status: "Inactive",
        avatar: "",
        createdDate: "2024-01-25"
    },
    {
        id: 5,
        name: "Hoàng Văn Em",
        email: "hoangvanem@email.com",
        role: "Guest",
        status: "Active",
        avatar: "",
        createdDate: "2024-04-05"
    },
    
];

// Biến toàn cục
let currentPage = 1;
let itemsPerPage = 10;
let filteredUsers = [...users];
let editingUserId = null;

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderUsers();
    // updateStats();
    setupEventListeners();
}

// Setup các event listeners
function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Filters
    document.getElementById('roleFilter').addEventListener('change', handleFilter);
    document.getElementById('statusFilter').addEventListener('change', handleFilter);
    
    // Modal controls
    document.getElementById('addUserBtn').addEventListener('click', openAddModal);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('userForm').addEventListener('submit', handleFormSubmit);
    
    // Delete modal
    document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    // Click outside modal to close
    window.addEventListener('click', function(e) {
        const userModal = document.getElementById('userModal');
        const deleteModal = document.getElementById('deleteModal');
        if (e.target === userModal) {
            closeModal();
        }
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
}

// Render danh sách users
function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    const noResults = document.getElementById('noResults');
    
    // Tính toán pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    // Clear table
    tbody.innerHTML = '';
    
    if (paginatedUsers.length === 0) {
        noResults.style.display = 'block';
        tbody.closest('.table-container').querySelector('table').style.display = 'none';
    } else {
        noResults.style.display = 'none';
        tbody.closest('.table-container').querySelector('table').style.display = 'table';
        
        paginatedUsers.forEach(user => {
            const row = createUserRow(user);
            tbody.appendChild(row);
        });
    }
    
    updatePagination();
}

// Tạo row cho user
function createUserRow(user) {
    const tr = document.createElement('tr');
    
    // Avatar
    const avatarTd = document.createElement('td');
    if (user.avatar) {
        avatarTd.innerHTML = `<img src="${user.avatar}" alt="${user.name}" class="user-avatar">`;
    } else {
        const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        avatarTd.innerHTML = `<div class="avatar-placeholder">${initials}</div>`;
    }
    tr.appendChild(avatarTd);
    
    // Name
    const nameTd = document.createElement('td');
    nameTd.innerHTML = `<strong>${user.name}</strong>`;
    tr.appendChild(nameTd);
    
    // Email
    const emailTd = document.createElement('td');
    emailTd.textContent = user.email;
    tr.appendChild(emailTd);
    
    // Role
    const roleTd = document.createElement('td');
    const roleClass = `badge-${user.role.toLowerCase()}`;
    roleTd.innerHTML = `<span class="badge ${roleClass}">${user.role}</span>`;
    tr.appendChild(roleTd);
    
    // Status
    const statusTd = document.createElement('td');
    const statusClass = `badge-${user.status.toLowerCase()}`;
    const statusText = user.status === 'Active' ? 'Hoạt động' : 'Không hoạt động';
    statusTd.innerHTML = `<span class="badge ${statusClass}">${statusText}</span>`;
    tr.appendChild(statusTd);
    
    // Created Date
    const dateTd = document.createElement('td');
    dateTd.textContent = formatDate(user.createdDate);
    tr.appendChild(dateTd);
    
    // Actions
    const actionsTd = document.createElement('td');
    actionsTd.innerHTML = `
        <div class="action-buttons">
            <button class="action-btn btn-edit" onclick="editUser(${user.id})" title="Chỉnh sửa">
                ✏️
            </button>
            <button class="action-btn btn-delete" onclick="deleteUser(${user.id})" title="Xóa">
                🗑️
            </button>
        </div>
    `;
    tr.appendChild(actionsTd);
    
    return tr;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Update statistics
function updateStats() {
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('activeUsers').textContent = users.filter(u => u.status === 'Active').length;
    document.getElementById('inactiveUsers').textContent = users.filter(u => u.status === 'Inactive').length;
    document.getElementById('adminUsers').textContent = users.filter(u => u.role === 'Admin').length;
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    filteredUsers = users.filter(user => {
        const nameMatch = user.name.toLowerCase().includes(searchTerm);
        const emailMatch = user.email.toLowerCase().includes(searchTerm);
        return nameMatch || emailMatch;
    });
    
    applyFilters();
}

// Handle filters
function handleFilter() {
    applyFilters();
}

function applyFilters() {
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    filteredUsers = users.filter(user => {
        const searchMatch = !searchTerm || 
            user.name.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm);
        const roleMatch = !roleFilter || user.role === roleFilter;
        const statusMatch = !statusFilter || user.status === statusFilter;
        
        return searchMatch && roleMatch && statusMatch;
    });
    
    currentPage = 1;
    renderUsers();
}

// Pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = '';
    

    const nextBtn = document.createElement('div');
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    nextBtn.onclick = () => changePage(currentPage + 1);
    paginationControls.appendChild(nextBtn);
}

function changePage(page) {
    currentPage = page;
    renderUsers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Modal functions
function openAddModal() {
    editingUserId = null;
    document.getElementById('modalTitle').textContent = 'Thêm User Mới';
    document.getElementById('submitBtnText').textContent = 'Thêm User';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userModal').classList.add('active');
}

function openEditModal(user) {
    editingUserId = user.id;
    document.getElementById('modalTitle').textContent = 'Chỉnh Sửa User';
    document.getElementById('submitBtnText').textContent = 'Cập Nhật';
    
    document.getElementById('userId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userStatus').value = user.status;
    document.getElementById('userAvatar').value = user.avatar || '';
    
    document.getElementById('userModal').classList.add('active');
}

function closeModal() {
    document.getElementById('userModal').classList.remove('active');
    document.getElementById('userForm').reset();
    editingUserId = null;
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('userName').value.trim(),
        email: document.getElementById('userEmail').value.trim(),
        role: document.getElementById('userRole').value,
        status: document.getElementById('userStatus').value,
        avatar: document.getElementById('userAvatar').value.trim()
    };
    
    if (editingUserId) {
        // Update existing user
        const userIndex = users.findIndex(u => u.id === editingUserId);
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                ...formData
            };
            showNotification('User đã được cập nhật thành công!', 'success');
        }
    } else {
        // Add new user
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            ...formData,
            createdDate: new Date().toISOString().split('T')[0]
        };
        users.push(newUser);
        showNotification('User mới đã được thêm thành công!', 'success');
    }
    
    closeModal();
    applyFilters();
    updateStats();
}

// Edit user
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        openEditModal(user);
    }
}

// Delete user
let userToDelete = null;

function deleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        userToDelete = userId;
        document.getElementById('deleteUserName').textContent = user.name;
        document.getElementById('deleteModal').classList.add('active');
    }
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    userToDelete = null;
}

function confirmDelete() {
    if (userToDelete) {
        users = users.filter(u => u.id !== userToDelete);
        showNotification('User đã được xóa thành công!', 'success');
        closeDeleteModal();
        applyFilters();
        updateStats();
    }
}

// Notification function
function showNotification(message, type = 'success') {
    // Tạo notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)' : 'linear-gradient(135deg, #ff4757 0%, #ee5a6f 100%)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
