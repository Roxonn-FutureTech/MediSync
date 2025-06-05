"""Authentication routes for the MediSync API.

This module contains routes for user authentication, including login and logout.
"""

from flask import Blueprint, request, flash, redirect, url_for, render_template_string
from flask_login import login_user, logout_user, login_required
from werkzeug.security import check_password_hash
from ..models import User
from ..extensions import login_manager
import logging

auth_bp = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)

@login_manager.user_loader
def load_user(user_id):
    """Load user by ID for Flask-Login."""
    return User.query.get(int(user_id))

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Handle user login."""
    if request.method == 'POST':
        username_or_email = request.form.get('username')
        password = request.form.get('password')
        
        if not username_or_email or not password:
            flash('Please provide both username/email and password', 'error')
            return render_template_string(LOGIN_TEMPLATE, error="Please provide both username/email and password")
        
        try:
            user = User.query.filter(
                (User.username == username_or_email) | 
                (User.email == username_or_email)
            ).first()
            
            logger.info(f"Login attempt for user: {username_or_email}")
            
            if user and check_password_hash(user.password_hash, password):
                login_user(user)
                logger.info(f"Successful login for user: {user.username}")
                return redirect(url_for('admin.index'))
            
            logger.warning(f"Failed login attempt for: {username_or_email}")
            flash('Invalid username/email or password', 'error')
            
        except Exception as e:
            logger.error(f"Error during login: {str(e)}")
            flash('An error occurred during login. Please try again.', 'error')
    
    error_message = request.args.get('error', '')
    return render_template_string(LOGIN_TEMPLATE, error=error_message)

@auth_bp.route('/logout')
@login_required
def logout():
    """Handle user logout."""
    logout_user()
    return redirect(url_for('auth.login'))

# Login page template
LOGIN_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>MediSync Login</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            width: 400px;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        input[type="submit"] {
            width: 100%;
            padding: 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        input[type="submit"]:hover {
            background-color: #45a049;
        }
        .error {
            color: #ff0000;
            text-align: center;
            margin-top: 10px;
        }
        .demo-accounts {
            margin-top: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .tab-buttons {
            display: flex;
            border-bottom: 1px solid #ddd;
        }
        .tab-button {
            flex: 1;
            padding: 10px;
            border: none;
            background: none;
            cursor: pointer;
            font-size: 14px;
            color: #666;
        }
        .tab-button.active {
            background-color: #f8f8f8;
            border-bottom: 2px solid #4CAF50;
            color: #333;
        }
        .tab-content {
            display: none;
            padding: 15px;
            background-color: #f8f8f8;
        }
        .tab-content.active {
            display: block;
        }
        .account-info {
            margin: 5px 0;
            font-size: 0.9em;
        }
        .use-credentials {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
            margin-top: 10px;
        }
        .use-credentials:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>MediSync Login</h1>
        <form method="post" id="loginForm">
            <div class="form-group">
                <input type="text" name="username" id="username" placeholder="Username or Email" value="admin">
            </div>
            <div class="form-group">
                <input type="password" name="password" id="password" placeholder="Password" value="admin123">
            </div>
            <input type="submit" value="Login">
            <div class="error">{{ error }}</div>
        </form>
        
        <div class="demo-accounts">
            <div class="tab-buttons">
                <button class="tab-button active" onclick="showTab('admin')">Admin Account</button>
                <button class="tab-button" onclick="showTab('doctor')">Doctor Account</button>
                <button class="tab-button" onclick="showTab('nurse')">Nurse Account</button>
            </div>
            
            <div id="admin" class="tab-content active">
                <div class="account-info">Username: admin</div>
                <div class="account-info">Password: admin123</div>
                <div class="account-info">Role: Administrator</div>
                <button class="use-credentials" onclick="useCredentials('admin', 'admin123')">Use These Credentials</button>
            </div>
            
            <div id="doctor" class="tab-content">
                <div class="account-info">Username: doctor</div>
                <div class="account-info">Password: doctor123</div>
                <div class="account-info">Role: Doctor</div>
                <button class="use-credentials" onclick="useCredentials('doctor', 'doctor123')">Use These Credentials</button>
            </div>
            
            <div id="nurse" class="tab-content">
                <div class="account-info">Username: nurse</div>
                <div class="account-info">Password: nurse123</div>
                <div class="account-info">Role: Nurse</div>
                <button class="use-credentials" onclick="useCredentials('nurse', 'nurse123')">Use These Credentials</button>
            </div>
        </div>
    </div>
    
    <script>
        function showTab(tabId) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.tab-button').forEach(button => {
                button.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(tabId).classList.add('active');
            document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add('active');
        }
        
        function useCredentials(username, password) {
            document.getElementById('username').value = username;
            document.getElementById('password').value = password;
        }
    </script>
</body>
</html>
''' 