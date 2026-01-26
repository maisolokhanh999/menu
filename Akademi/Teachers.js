document.addEventListener('DOMContentLoaded', function() {
  const newTeacherBtn = document.querySelector('.btn-new-student');
  
  if (newTeacherBtn) {
    newTeacherBtn.addEventListener('click', function() {
      window.location.href = 'New teachers.html';
    });
  }
  
  const searchInput = document.querySelector('.search-box input[type="search"]');
  const teacherCards = document.querySelectorAll('.teacher-card');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      
      teacherCards.forEach(function(card) {
        const teacherName = card.querySelector('.teacher-name');
        const teacherSubject = card.querySelector('.teacher-subject');
        
        if (teacherName && teacherSubject) {
          const name = teacherName.textContent.toLowerCase().trim();
          const subject = teacherSubject.textContent.toLowerCase().trim();
          
          if (searchTerm === '' || name.includes(searchTerm) || subject.includes(searchTerm)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  }
});
