window.addEventListener('load', () => {
            document.querySelectorAll('.form-input, .form-select').forEach(input => {
                const savedValue = localStorage.getItem(input.placeholder); // or use id/name if set
                if (savedValue) {
                input.value = savedValue;
                }
            });
            });


        const BACKEND = window.location.origin && window.location.origin.startsWith('http') ? window.location.origin : 'http://localhost:4000';

        // Form submission handler
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const phone = this.querySelector('input[type="tel"]').value.trim();
            const hostel = this.querySelector('select').value;
            
            // Basic validation
            if (!name || !email || !phone || !hostel) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Phone validation
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
                alert('Please enter a valid phone number');
                return;
            }

            try {
                const res = await fetch(BACKEND + '/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, hostel })
                });

                const contentType = res.headers.get('content-type') || '';
                const data = contentType.includes('application/json') ? await res.json() : await res.text();

                if (res.status === 201 || res.ok) {
                    // Persist logged-in user
                    try {
                        const userObj = typeof data === 'string' ? null : data;
                        if (userObj && (userObj.email || userObj.id)) {
                            localStorage.setItem('currentUser', JSON.stringify(userObj));
                        } else {
                            // fallback minimal
                            localStorage.setItem('currentUser', JSON.stringify({ name, email, phone, hostel }));
                        }
                    } catch (_) {}
                    // Optionally clear only form placeholder cache
                    document.querySelectorAll('.form-input, .form-select').forEach(input => {
                        if (input.placeholder) localStorage.removeItem(input.placeholder);
                    });
                    showSuccess();
                } else if (res.status === 409) {
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