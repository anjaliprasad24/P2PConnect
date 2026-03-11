window.addEventListener('load', () => {
            document.querySelectorAll('.form-input, .form-select').forEach(input => {
                const savedValue = localStorage.getItem(input.placeholder); // or use id/name if set
                if (savedValue) {
                input.value = savedValue;
                }
            });
            });


        // Form submission handler
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const phone = this.querySelector('input[type="tel"]').value.trim();
            const hostel = this.querySelector('select').value;

            if (!name || !email || !phone || !hostel) {
                alert('Please fill in all fields');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
                alert('Please enter a valid phone number');
                return;
            }

            try {
                const res = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, hostel })
                });

                const contentType = res.headers.get('content-type') || '';
                const data = contentType.includes('application/json') ? await res.json() : await res.text();

                if (res.status === 201 || res.ok) {
                    localStorage.clear();
                    showSuccess();
                } else if (res.status === 409) { // duplicate email
                    alert((data && data.error) ? data.error : 'Email already exists');
                } else {
                    const msg = (data && data.error) ? data.error : `Failed to create user (${res.status})`;
                    alert(msg);
                }
            } catch (err) {
                alert('Network error while creating user');
            }
        });

        // Show success message
        function showSuccess() {
            const successDiv = document.getElementById('successAnimation');
            successDiv.style.display = 'block';
            
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = 'HomePage_01.html'; // Change to your homepage URL
            }, 1000);
        }

        // Add input focus effects
        document.querySelectorAll('.form-input, .form-select').forEach(input => {
            input.addEventListener('focus', function() {
                const icon = this.parentElement.querySelector('.input-icon');
                if (icon) {
                    icon.style.color = '#4CAF50';
                }
            });
            
            input.addEventListener('blur', function() {
                const icon = this.parentElement.querySelector('.input-icon');
                if (icon) {
                    icon.style.color = '#999';
                }
            });
        });

        document.querySelectorAll('.form-input, .form-select').forEach(input => {
            input.addEventListener('input', function() {
                localStorage.setItem(input.placeholder, input.value);
            });
        });