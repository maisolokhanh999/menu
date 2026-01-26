// ===== LẤY CÁC ELEMENTS TỪ DOM =====
const calendar = document.getElementById("calendar");
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const modalOverlay = document.getElementById("modalOverlay");
const noteModal = document.getElementById("noteModal");
const noteInput = document.getElementById("noteInput");
const selectedDateText = document.getElementById("selectedDate");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const savedNoteDisplay = document.getElementById("savedNoteDisplay");

// Biến lưu ngày được chọn
let selectedDate = "";

// Key lưu trữ trong localStorage
const NOTES_STORAGE_KEY = "calendarNotes";

// ===== HÀM XỬ LÝ LOCALSTORAGE =====

// Lấy tất cả notes từ localStorage
function getAllNotes() {
    const notes = localStorage.getItem(NOTES_STORAGE_KEY);
    return notes ? JSON.parse(notes) : {};
}

// Lưu note vào localStorage
function saveNoteToStorage(dateKey, noteText) {
    const allNotes = getAllNotes();
    if (noteText.trim()) {
        allNotes[dateKey] = noteText;
    } else {
        delete allNotes[dateKey]; // Xóa note nếu rỗng
    }
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(allNotes));
}

// Lấy note từ localStorage
function getNoteFromStorage(dateKey) {
    const allNotes = getAllNotes();
    return allNotes[dateKey] || "";
}

// ===== KHỞI TẠO DROPDOWN THÁNG VÀ NĂM =====

// Tạo options cho tháng (1-12)
for (let i = 0; i < 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = "Tháng " + (i + 1);
    monthSelect.appendChild(option);
}

// Tạo options cho năm (1990-2030)
for (let i = 1990; i <= 2030; i++) {
    const yearOption = document.createElement("option");
    yearOption.value = i;
    yearOption.text = "Năm " + i;
    yearSelect.appendChild(yearOption);
}

// Set giá trị mặc định là tháng và năm hiện tại
const currentDate = new Date();
monthSelect.value = currentDate.getMonth();
yearSelect.value = currentDate.getFullYear();

// ===== LẮNG NGHE SỰ KIỆN THAY ĐỔI THÁNG/NĂM =====
monthSelect.addEventListener("change", renderCalendar);
yearSelect.addEventListener("change", renderCalendar);

// ===== HÀM RENDER LỊCH =====
function renderCalendar() {
    // Xóa nội dung cũ
    calendar.innerHTML = "";

    const month = Number(monthSelect.value);
    const year = Number(yearSelect.value);

    // Tính số ngày trong tháng
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Tính ngày đầu tiên của tháng là thứ mấy (0 = Chủ nhật)
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Tên các ngày trong tuần
    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    // Tạo header cho các ngày trong tuần
    daysOfWeek.forEach(day => {
        const headerDiv = document.createElement("div");
        headerDiv.textContent = day;
        headerDiv.classList.add("header");
        calendar.appendChild(headerDiv);
    });

    // Tạo các ô trống cho những ngày trước ngày đầu tiên của tháng
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("empty");
        calendar.appendChild(emptyDiv);
    }

    // Tạo các ô cho từng ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${month + 1}-${day}`;
        const dayDiv = document.createElement("div");
        dayDiv.textContent = day;
        dayDiv.classList.add("box");

        // Kiểm tra xem ngày này có note không
        const savedNote = getNoteFromStorage(dateKey);
        if (savedNote) {
            dayDiv.classList.add("has-note");
            dayDiv.title = "Có ghi chú: " + savedNote.substring(0, 50) + "...";
        }

        // Thêm sự kiện click để mở modal
        dayDiv.addEventListener("click", () => openModal(dateKey));
        
        calendar.appendChild(dayDiv);
    }
}

// ===== HÀM MỞ MODAL =====
function openModal(dateKey) {
    selectedDate = dateKey;
    const [year, month, day] = dateKey.split("-");
    selectedDateText.textContent = `Ngày ${day} tháng ${month} năm ${year}`;
    
    // Lấy note đã lưu (nếu có)
    const savedNote = getNoteFromStorage(dateKey);
    noteInput.value = savedNote;
    
    // Hiển thị note đã lưu
    if (savedNote) {
        savedNoteDisplay.innerHTML = `<p><strong>Ghi chú hiện tại:</strong> ${savedNote}</p>`;
        savedNoteDisplay.classList.add("show");
    } else {
        savedNoteDisplay.classList.remove("show");
    }
    
    // Hiển thị modal
    modalOverlay.classList.add("show");
    
    // Focus vào input
    setTimeout(() => {
        noteInput.focus();
    }, 100);
}

// ===== HÀM ĐÓNG MODAL =====
function closeModal() {
    modalOverlay.classList.remove("show");
    noteInput.value = "";
    savedNoteDisplay.classList.remove("show");
    selectedDate = "";
}

// ===== HÀM LƯU NOTE =====
function saveNote() {
    const noteText = noteInput.value.trim();
    
    if (!selectedDate) {
        alert("Vui lòng chọn một ngày!");
        return;
    }
    
    // Lưu note vào localStorage
    saveNoteToStorage(selectedDate, noteText);
    
    // Hiển thị thông báo
    if (noteText) {
        alert(`✅ Đã lưu ghi chú cho ngày ${selectedDate}`);
    } else {
        alert(`🗑️ Đã xóa ghi chú cho ngày ${selectedDate}`);
    }
    
    // Đóng modal
    closeModal();
    
    // Render lại lịch để cập nhật icon note
    renderCalendar();
}

// ===== LẮNG NGHE SỰ KIỆN =====

// Nút Lưu
saveBtn.addEventListener("click", saveNote);

// Nút Hủy
cancelBtn.addEventListener("click", closeModal);

// Nút X (đóng)
closeModalBtn.addEventListener("click", closeModal);

// Click vào overlay (backdrop) để đóng
modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});

// Phím ESC để đóng modal
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modalOverlay.classList.contains("show")) {
        closeModal();
    }
});

// Phím Enter trong textarea (Ctrl+Enter để lưu)
noteInput.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "Enter") {
        saveNote();
    }
});

// ===== RENDER LỊCH LẦN ĐẦU =====
renderCalendar();

// ===== CÁC HÀM TIỆN ÍCH (GỌI TỪ CONSOLE) =====

// Xóa tất cả notes
function clearAllNotes() {
    if (confirm("Bạn có chắc muốn xóa tất cả ghi chú?")) {
        localStorage.removeItem(NOTES_STORAGE_KEY);
        renderCalendar();
        alert("✅ Đã xóa tất cả ghi chú!");
    }
}

// Export notes ra JSON
function exportNotes() {
    const allNotes = getAllNotes();
    const dataStr = JSON.stringify(allNotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "calendar_notes.json";
    link.click();
    URL.revokeObjectURL(url);
}

// Import notes từ JSON
function importNotes(jsonData) {
    try {
        const notes = JSON.parse(jsonData);
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
        renderCalendar();
        alert("✅ Import thành công!");
    } catch (error) {
        alert("❌ Lỗi: File JSON không hợp lệ!");
    }
}

// Log hướng dẫn
console.log(`
📅 CALENDAR NOTES - Hướng dẫn sử dụng:

✨ Tính năng:
1. Click vào ô ngày để mở popup nhập ghi chú
2. Nhập nội dung và click "Lưu" hoặc Ctrl+Enter
3. Các ngày có ghi chú sẽ hiển thị icon 📝
4. Click lại vào ngày đó để xem/sửa ghi chú
5. Để trống và lưu để xóa ghi chú

⌨️ Phím tắt:
- ESC: Đóng popup
- Ctrl + Enter: Lưu ghi chú nhanh

🛠️ Hàm tiện ích (gọi từ Console):
- clearAllNotes() : Xóa tất cả ghi chú
- exportNotes()   : Export ghi chú ra file JSON
- importNotes(json): Import ghi chú từ JSON string

💾 Dữ liệu được lưu trong localStorage
`);
