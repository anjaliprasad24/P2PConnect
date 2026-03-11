window.addEventListener('load', () => {
            document.querySelectorAll('.form-input, .form-select').forEach(input => {
                const savedValue = localStorage.getItem(input.placeholder); // or use id/name if set
                if (savedValue) {
                input.value = savedValue;
                }
            });
            });


        // Form submission handler
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
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
            
            localStorage.clear();
            // Show success message
            showSuccess();
            
            // Store user data (in real app, send to server)
            localStorage.setItem('userData', JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                hostel: hostel,
                joinDate: new Date().toISOString()
            }));
            
            console.log('User registered:', { name, email, phone, hostel });
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