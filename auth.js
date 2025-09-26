document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    // Navigation links
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const showForgotPasswordLink = document.getElementById('showForgotPassword');
    const backToLoginLink = document.getElementById('backToLogin');

    // Form submission handlers
    document.getElementById('login').addEventListener('submit', handleLogin);
    document.getElementById('signup').addEventListener('submit', handleSignup);
    document.getElementById('forgotPassword').addEventListener('submit', handleForgotPassword);

    // Navigation handlers
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        forgotPasswordForm.classList.add('hidden');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        forgotPasswordForm.classList.add('hidden');
    });

    showForgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.add('hidden');
        forgotPasswordForm.classList.remove('hidden');
    });

    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        forgotPasswordForm.classList.add('hidden');
    });

    // Form handling functions
    async function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // Here you would typically make an API call to your backend
            const user = await mockLoginAPI(email, password);
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = '/paraphrase.html'; // Redirect to main app
        } catch (error) {
            showError(loginForm, error.message);
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            showError(signupForm, "Passwords don't match");
            return;
        }

        try {
            // Here you would typically make an API call to your backend
            const user = await mockSignupAPI(name, email, password);
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = '/paraphrase.html'; // Redirect to main app
        } catch (error) {
            showError(signupForm, error.message);
        }
    }

    async function handleForgotPassword(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;

        try {
            // Here you would typically make an API call to your backend
            await mockForgotPasswordAPI(email);
            showSuccess(forgotPasswordForm, 'Password reset instructions sent to your email');
        } catch (error) {
            showError(forgotPasswordForm, error.message);
        }
    }

    // Helper functions
    function showError(form, message) {
        const errorDiv = form.querySelector('.error') || document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        if (!form.querySelector('.error')) {
            form.appendChild(errorDiv);
        }
    }

    function showSuccess(form, message) {
        const successDiv = form.querySelector('.success') || document.createElement('div');
        successDiv.className = 'success';
        successDiv.textContent = message;
        if (!form.querySelector('.success')) {
            form.appendChild(successDiv);
        }
    }

    // Mock API functions (replace these with real API calls)
    async function mockLoginAPI(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'test@example.com' && password === 'password') {
                    resolve({ id: 1, name: 'Test User', email });
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1000);
        });
    }

    async function mockSignupAPI(name, email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'test@example.com') {
                    reject(new Error('Email already exists'));
                } else {
                    resolve({ id: 2, name, email });
                }
            }, 1000);
        });
    }

    async function mockForgotPasswordAPI(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'test@example.com') {
                    resolve();
                } else {
                    reject(new Error('Email not found'));
                }
            }, 1000);
        });
    }
});