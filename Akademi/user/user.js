// Dữ liệu mẫu users
let users = [
    {
        id: 1,
        name: "Nguyễn Văn An",
        email: "nguyenvanan@email.com",
        role: "Manager",
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


let currentPage = 1;
let itemsPerPage = 10;
let filteredUsers = [...users];
let editingUserId = null;


document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderUsers();
    setupEventListeners();
}


function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('roleFilter').addEventListener('change', handleFilter);
    document.getElementById('statusFilter').addEventListener('change', handleFilter);
    document.getElementById('addUserBtn').addEventListener('click', openAddModal);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
 
    
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


function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    const noResults = document.getElementById('noResults');
    
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    
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


function createUserRow(user) {
    const tr = document.createElement('tr');
    
    
    const nameTd = document.createElement('td');
    nameTd.innerHTML = `<strong>${user.name}</strong>`;
    tr.appendChild(nameTd);
    
    
    const emailTd = document.createElement('td');
    emailTd.textContent = user.email;
    tr.appendChild(emailTd);
    
    
    const roleTd = document.createElement('td');
    const roleClass = `badge-${user.role.toLowerCase()}`;
    roleTd.innerHTML = `<span class="badge ${roleClass}">${user.role}</span>`;
    tr.appendChild(roleTd);
    
    
    const statusTd = document.createElement('td');
    const statusClass = `badge-${user.status.toLowerCase()}`;
    const statusText = user.status === 'Active' ? 'Active' : 'Inactive';
    statusTd.innerHTML = `<span class="badge ${statusClass}">${statusText}</span>`;
    tr.appendChild(statusTd);
    
    
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


function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    filteredUsers = users.filter(user => {
        const nameMatch = user.name.toLowerCase().includes(searchTerm);
        const emailMatch = user.email.toLowerCase().includes(searchTerm);
        return nameMatch || emailMatch;
    });
    
    applyFilters();
}


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


function openAddModal() {
    editingUserId = null;
    document.getElementById('modalTitle').textContent = 'Thêm User Mới';
    document.getElementById('submitBtnText').textContent = 'Thêm User';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userModal').classList.add('active');
}

function closeModal() {
    document.getElementById('userModal').classList.remove('active');
    document.getElementById('userForm').reset();
    editingUserId = null;
}

