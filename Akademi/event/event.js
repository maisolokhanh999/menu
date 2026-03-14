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


let selectedDate = "";

const NOTES_STORAGE_KEY = "calendarNotes";


function getAllNotes() {
    const notes = localStorage.getItem(NOTES_STORAGE_KEY);
    return notes ? JSON.parse(notes) : {};
}

function saveNoteToStorage(dateKey, noteText) {
    const allNotes = getAllNotes();
    if (noteText.trim()) {
        allNotes[dateKey] = noteText;
    } else {
        delete allNotes[dateKey]; 
    }
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(allNotes));
}

function getNoteFromStorage(dateKey) {
    const allNotes = getAllNotes();
    return allNotes[dateKey] || "";
}

for (let i = 0; i < 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = "Tháng " + (i + 1);
    monthSelect.appendChild(option);
}


for (let i = 1990; i <= 2027; i++) {
    const yearOption = document.createElement("option");
    yearOption.value = i;
    yearOption.text = "Năm " + i;
    yearSelect.appendChild(yearOption);
}


monthSelect.value = new Date().getMonth();
yearSelect.value = new Date().getFullYear();
monthSelect.addEventListener("change", renderCalendar);
yearSelect.addEventListener("change", renderCalendar);


function renderCalendar() {
    calendar.innerHTML = "";
    const month = Number(monthSelect.value);
    const year = Number(yearSelect.value);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    daysOfWeek.forEach(day => {

        const headerDiv = document.createElement("div");
        headerDiv.textContent = day;
        headerDiv.classList.add("header");
        calendar.appendChild(headerDiv);
    });

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("empty");
        calendar.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${month + 1}-${day}`;
        const dayDiv = document.createElement("div");
        dayDiv.textContent = day;
        dayDiv.classList.add("box");

        const savedNote = getNoteFromStorage(dateKey);
        if (savedNote) {
            dayDiv.classList.add("has-note");
        }

        dayDiv.addEventListener("click", () => openModal(dateKey));
        calendar.appendChild(dayDiv);
    }
}

function openModal(dateKey) {
    selectedDate = dateKey;
    const [year, month, day] = dateKey.split("-");
    selectedDateText.textContent = `Ngày ${day} tháng ${month} năm ${year}`;
    const savedNote = getNoteFromStorage(dateKey);
    noteInput.value = savedNote;
    if (savedNote) {
        savedNoteDisplay.innerHTML = `<p><strong>Ghi chú hiện tại:</strong> ${savedNote}</p>`;
        savedNoteDisplay.classList.add("show");
    } else {
        savedNoteDisplay.classList.remove("show");
    }
    

    modalOverlay.classList.add("show");

    setTimeout(() => {
        noteInput.focus();
    }, 100);
}


function closeModal() {
    modalOverlay.classList.remove("show");
    noteInput.value = "";
    savedNoteDisplay.classList.remove("show");
    selectedDate = "";
}


function saveNote() {
    const noteText = noteInput.value.trim();
    
    if (!selectedDate) {
        alert("Vui lòng chọn một ngày!");
        return;
    }
    
   
    saveNoteToStorage(selectedDate, noteText);
    

    if (noteText) {
        alert(`✅ Đã lưu ghi chú cho ngày ${selectedDate}`);
    } else {
        alert(`🗑️ Đã xóa ghi chú cho ngày ${selectedDate}`);
    }
    

    closeModal();


    renderCalendar();
}


saveBtn.addEventListener("click", saveNote);
cancelBtn.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);

renderCalendar();



