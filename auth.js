
document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const showSignup = document.getElementById('show-signup');
    const showSignin = document.getElementById('show-signin');
    const signinSection = document.getElementById('signin');
    const signupSection = document.getElementById('signup');

    // Password visibility toggles
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            const icon = toggle.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Form toggle functionality
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        signinSection.style.display = 'none';
        signupSection.style.display = 'block';
    });

    showSignin.addEventListener('click', (e) => {
        e.preventDefault();
        signinSection.style.display = 'block';
        signupSection.style.display = 'none';
    });

    // Form validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const showError = (input, message) => {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            input.classList.add('error');
        }
    };

    const clearError = (input) => {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            input.classList.remove('error');
        }
    };

    // Sign-in form submission
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        clearError(email);
        clearError(password);

        let isValid = true;

        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        if (!validatePassword(password.value)) {
            showError(password, 'Password must be at least 8 characters long');
            isValid = false;
        }

        if (isValid) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email.value, password: password.value }),
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    window.location.href = '/dashboard.html';
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Sign in failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        }
    });

    // Sign-up form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email');
        const password = document.getElementById('signup-password');
        const confirmPassword = document.getElementById('confirm-password');

        clearError(email);
        clearError(password);
        clearError(confirmPassword);

        let isValid = true;

        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        if (!validatePassword(password.value)) {
            showError(password, 'Password must be at least 8 characters long');
            isValid = false;
        }

        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }

        if (isValid) {
            try {
                const response = await fetch('/api/auth/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email.value, password: password.value }),
                });
    
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
    
                const responseText = await response.text();
                console.log('Response text:', responseText);
    
                if (response.ok) {
                    const data = JSON.parse(responseText);
                    localStorage.setItem('token', data.token);
                    window.location.href = '/dashboard.html';
                } else {
                    alert(responseText || 'Sign in failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        }
    });
});