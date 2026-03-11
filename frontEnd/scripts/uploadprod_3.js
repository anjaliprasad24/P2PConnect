/* --- NEW SCRIPT FOR SIDENAV --- */
    const menuToggle = document.getElementById('menuToggle');
    const sideNav = document.getElementById('sideNav');
    const closeBtn = document.getElementById('closeBtn');
    const overlay = document.getElementById('overlay');

    menuToggle.addEventListener('click', () => {
        sideNav.classList.add('open');
        overlay.classList.add('show');
    });

    closeBtn.addEventListener('click', () => {
        sideNav.classList.remove('open');
        overlay.classList.remove('show');
    });

    overlay.addEventListener('click', () => {
        sideNav.classList.remove('open');
        overlay.classList.remove('show');
    });


    /* --- ORIGINAL SCRIPT FOR FORM --- */

    // Set date constraints
    document.addEventListener('DOMContentLoaded', function() {
      const today = new Date().toISOString().split('T')[0];
      
      // Set minimum date for expiry (today)
      document.getElementById('expiryDate').min = today;
      
      // Set maximum date for manufacturing (today)
      document.getElementById('manufacturingDate').max = today;
    });

    // Photo upload handling
    const photoInput = document.getElementById('photoInput');
    const photoUpload = document.querySelector('.photo-upload');
    const photoPreview = document.getElementById('photoPreview');
    const uploadContent = document.querySelector('.photo-upload-content');

    photoInput.addEventListener('change', handlePhotoUpload);

    // Drag and drop functionality
    photoUpload.addEventListener('dragover', (e) => {
      e.preventDefault();
      photoUpload.classList.add('dragover');
    });

    photoUpload.addEventListener('dragleave', () => {
      photoUpload.classList.remove('dragover');
    });

    photoUpload.addEventListener('drop', (e) => {
      e.preventDefault();
      photoUpload.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        photoInput.files = files;
        handlePhotoUpload();
      }
    });

    function handlePhotoUpload() {
      const file = photoInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          photoPreview.src = e.target.result;
          photoPreview.style.display = 'block';
          uploadContent.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    }

    // Category-based date field toggle
    function toggleDateField() {
      const category = document.getElementById('category').value;
      const expiryGroup = document.getElementById('expiryDateGroup');
      const manufacturingGroup = document.getElementById('manufacturingDateGroup');
      const expiryInput = document.getElementById('expiryDate');
      const manufacturingInput = document.getElementById('manufacturingDate');

      // Reset fields
      expiryGroup.classList.remove('show');
      manufacturingGroup.classList.remove('show');
      expiryInput.required = false;
      manufacturingInput.required = false;

      // Show appropriate field based on category
      if (category === 'food') {
        expiryGroup.classList.add('show');
        expiryInput.required = true;
      } else if (category) { // For any other selected category
        manufacturingGroup.classList.add('show');
        manufacturingInput.required = true;
      }
    }

    // Form submission handling
document.getElementById('productForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Show loading state
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.querySelector('.btn-text');
  const loadingSpinner = document.getElementById('loadingSpinner');

  btnText.style.display = 'none';
  loadingSpinner.classList.add('show');
  submitBtn.disabled = true;

  try {
    const formEl = document.getElementById('productForm');
    const fd = new FormData(formEl);

    // Ensure numeric fields are strings to satisfy backend parsing
    // and empty date fields remain empty strings
    if (!fd.has('stock')) {
      fd.append('stock', '0');
    }

    const res = await fetch('http://localhost:4000/api/products', {
      method: 'POST',
      body: fd
    });

    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : await res.text();

    if (!res.ok) {
      const msg = (data && data.error) ? data.error : (`Upload failed (${res.status})`);
      alert(msg);
      return;
    }

    // Reset form
    formEl.reset();
    photoPreview.style.display = 'none';
    uploadContent.style.display = 'flex';
    toggleDateField();

    // Redirect to confirmation page
    window.location.href = 'confirmationSeller_04.html';
  } catch (err) {
    alert('Network error while uploading product');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    loadingSpinner.classList.remove('show');
    submitBtn.disabled = false;
  }
});

    // Character counter for textareas
    document.getElementById('description').addEventListener('input', function() {
      const maxLength = this.getAttribute('maxlength');
      const currentLength = this.value.length;
      // You can add a character counter display here if needed
    });

    document.getElementById('condition').addEventListener('input', function() {
      const maxLength = this.getAttribute('maxlength');
      const currentLength = this.value.length;
      // You can add a character counter display here if needed
    });