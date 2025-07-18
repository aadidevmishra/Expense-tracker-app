// public/app.js
document.addEventListener('DOMContentLoaded', () => {
    // This is the base URL of your deployed API
    // On Replit, you don't need to specify the full URL,
    // as the frontend and backend are served from the same domain.
    const API_BASE_URL = '/api';

    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname;

    // --- Page Routing ---
    if (token && currentPage.includes('index.html')) {
        window.location.href = 'dashboard.html';
    } else if (!token && currentPage.includes('dashboard.html')) {
        window.location.href = 'index.html';
    }

    // --- Helper function for displaying messages ---
    function showMessage(elementId, message, isError = false) {
        const msgElement = document.getElementById(elementId);
        msgElement.textContent = message;
        msgElement.className = 'message'; // reset class
        if (message) {
            msgElement.classList.add(isError ? 'error' : 'success');
        }
    }

    // --- Login/Register Page Logic (index.html) ---
    if (currentPage.includes('index.html') || currentPage === '/') {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const showRegisterLink = document.getElementById('show-register');
        const showLoginLink = document.getElementById('show-login');

        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'flex';
        });

        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'flex';
        });

        // Handle Registration
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            try {
                const res = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.msg || 'Registration failed');

                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } catch (err) {
                showMessage('register-msg', err.message, true);
            }
        });

        // Handle Login
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const res = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.msg || 'Login failed');

                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } catch (err) {
                showMessage('login-msg', err.message, true);
            }
        });
    }

    // --- Dashboard Page Logic (dashboard.html) ---
    if (currentPage.includes('dashboard.html')) {
        const expenseForm = document.getElementById('expense-form');
        const expenseList = document.getElementById('expense-list');
        const logoutBtn = document.getElementById('logout-btn');

        // Function to fetch and display expenses
        async function fetchExpenses() {
            try {
                const res = await fetch(`${API_BASE_URL}/expenses`, {
                    headers: { 'x-auth-token': token }
                });
                if (!res.ok) throw new Error('Failed to fetch expenses');

                const expenses = await res.json();
                expenseList.innerHTML = ''; // Clear current list
                expenses.forEach(expense => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>
                            <strong>${expense.description}</strong> - ₹${expense.amount.toFixed(2)} 
                            <em>(${expense.category})</em>
                        </span>
                        <button class="expense-delete" data-id="${expense._id}">Delete</button>
                    `;
                    expenseList.appendChild(li);
                });
            } catch (err) {
                showMessage('expense-msg', err.message, true);
            }
        }

        // Add a new expense
        expenseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const description = document.getElementById('expense-description').value;
            const amount = document.getElementById('expense-amount').value;
            const category = document.getElementById('expense-category').value;

            try {
                const res = await fetch(`${API_BASE_URL}/expenses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                    body: JSON.stringify({ description, amount, category }),
                });
                 if (!res.ok) throw new Error('Failed to add expense');

                expenseForm.reset();
                fetchExpenses(); // Refresh the list
            } catch (err) {
                 showMessage('expense-msg', err.message, true);
            }
        });

        // Delete an expense
        expenseList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('expense-delete')) {
                const expenseId = e.target.dataset.id;
                try {
                    const res = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
                        method: 'DELETE',
                        headers: { 'x-auth-token': token },
                    });
                     if (!res.ok) throw new Error('Failed to delete expense');

                    fetchExpenses(); // Refresh the list
                } catch (err) {
                    showMessage('expense-msg', err.message, true);
                }
            }
        });

        // Handle logout
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });

        // Initial fetch of expenses
        fetchExpenses();
    }
});