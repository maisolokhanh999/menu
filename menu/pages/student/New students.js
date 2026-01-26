const textarea = document.getElementById("address");
const counter = document.getElementById("charCount");
if(textarea && counter){
  const updateCounter = () => {
    counter.textContent = `${textarea.value.length}/2000`;
  };
  textarea.addEventListener("input", updateCounter);
  updateCounter();
}

const parentTextarea = document.getElementById("parentAddress");
const parentCounter = parentTextarea ? parentTextarea.parentElement.querySelector('.parent-char-count') : null;
if(parentTextarea && parentCounter){
  const updateParentCounter = () => {
    parentCounter.textContent = `${parentTextarea.value.length}/2000`;
  };
  parentTextarea.addEventListener("input", updateParentCounter);
  updateParentCounter();
}

function previewImage(event) {
  const input = event.target;
  const photoUpload = input.closest('.photo-upload');
  const uploadText = photoUpload.querySelector('.upload-text');
  
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const existingImg = photoUpload.querySelector('img');
      if (existingImg) {
        existingImg.remove();
      }
      
      const img = document.createElement('img');
      img.src = e.target.result;
      photoUpload.insertBefore(img, uploadText);
      
      uploadText.style.display = 'none';
    }
    
    reader.readAsDataURL(input.files[0]);
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showError(input, message) {
  const formGroup = input.closest('.form-group') || input.closest('.form-field') || input.parentElement;
  formGroup.classList.add('has-error');
  const errorEl = formGroup.querySelector('.error-message');
  if (errorEl && message) {
    errorEl.textContent = message;
  }
}

function clearError(input) {
  const formGroup = input.closest('.form-group') || input.closest('.form-field') || input.parentElement;
  formGroup.classList.remove('has-error');
}

function validateField(input) {
  const value = input.value.trim();
  const type = input.type;
  
  if (type === 'email') {
    if (!value || !validateEmail(value)) {
      showError(input, 'Email không hợp lệ');
      return false;
    }
  } else if (type === 'tel' || input.id === 'phone' || input.id === 'parentPhone') {
    if (!value || value.length < 6) {
      showError(input, 'Số điện thoại không hợp lệ');
      return false;
    }
  } else {
    if (!value) {
      showError(input, 'Trường này là bắt buộc');
      return false;
    }
  }
  
  clearError(input);
  return true;
}

const studentForm = document.querySelector('form');
if (studentForm) {
  const studentInputs = studentForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea, input[type="file"]');
  
  studentInputs.forEach(input => {
    if (input.type !== 'file') {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        const formField = input.closest('.form-field') || input.closest('.address-group');
        if (formField && formField.classList.contains('has-error')) {
          clearError(input);
        }
      });
    }
  });

  studentForm.addEventListener('submit', function(e) {
    e.preventDefault();
  });
  
  const photoInput = document.getElementById('photoInput');
  if (photoInput) {
    photoInput.addEventListener('change', function() {
      if (this.files.length > 0) {
        const photoField = this.closest('.photo-field');
        photoField.classList.remove('has-error');
      }
    });
  }
}

const parentForm = document.getElementById('parentForm');
if (parentForm) {
  const parentInputs = parentForm.querySelectorAll('input[type="text"], input[type="email"], textarea');
  parentInputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.form-group').classList.contains('has-error')) {
        clearError(input);
      }
    });
  });

  parentForm.addEventListener('submit', function(e) {
    e.preventDefault();
  });
}

const finalSubmitBtn = document.getElementById('finalSubmitBtn');
if (finalSubmitBtn) {
  finalSubmitBtn.addEventListener('click', function() {
    let isValid = true;
    let firstErrorElement = null;

    if (studentForm) {
      const photoInput = document.getElementById('photoInput');
      if (photoInput && !photoInput.files.length) {
        const photoField = photoInput.closest('.photo-field');
        photoField.classList.add('has-error');
        isValid = false;
        if (!firstErrorElement) firstErrorElement = photoField;
      }
      
      const studentTextInputs = studentForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
      studentTextInputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
          if (!firstErrorElement) {
            firstErrorElement = input.closest('.form-field') || input.closest('.address-group');
          }
        }
      });
    }

    if (parentForm) {
      const parentInputs = parentForm.querySelectorAll('input[type="text"], input[type="email"], textarea');
      parentInputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
          if (!firstErrorElement) {
            firstErrorElement = input.closest('.form-group');
          }
        }
      });
    }

    if (isValid) {
      alert('Đăng ký thành công! Tất cả thông tin đã được điền đầy đủ và hợp lệ.');
    } else {
      alert('Vui lòng điền đầy đủ và chính xác tất cả thông tin bắt buộc trong cả Student Details và Parent Details!');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}
