
  document.addEventListener('DOMContentLoaded', function() {
    const selectAllCheckbox = document.querySelector('thead .checkbox-col input[type="checkbox"]');
    const rowCheckboxes = document.querySelectorAll('tbody .checkbox-col input[type="checkbox"]');
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', function() {
        const isChecked = this.checked;
        rowCheckboxes.forEach(function(checkbox) {
          checkbox.checked = isChecked;
          const row = checkbox.closest('tr');
          if (isChecked) {
            row.classList.add('selected');
          } else {
            row.classList.remove('selected');
          }
        });
      });
    }
    
    rowCheckboxes.forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {
        const row = this.closest('tr');
        if (this.checked) {
          row.classList.add('selected');
        } else {
          row.classList.remove('selected');
        }
        
        const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
        const someChecked = Array.from(rowCheckboxes).some(cb => cb.checked);
        if (selectAllCheckbox) {
          selectAllCheckbox.checked = allChecked;
          selectAllCheckbox.indeterminate = someChecked && !allChecked;
        }
      });
    });
    
    const searchInput = document.querySelector('.search-box input[type="search"]');
    const tableRows = document.querySelectorAll('tbody tr');
    
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        tableRows.forEach(function(row) {
          const studentName = row.querySelector('.student-name');
          if (studentName) {
            const name = studentName.textContent.toLowerCase().trim();
            if (searchTerm === '' || name.startsWith(searchTerm)) {
              row.style.display = '';
            } else {
              row.style.display = 'none';
            }
          }
        });
      });
    }
  });
