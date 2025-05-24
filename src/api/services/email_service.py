from flask_mail import Mail, Message
from flask import current_app, render_template_string

mail = Mail()

class EmailService:
    @staticmethod
    def send_password_reset_email(user_email: str, reset_token: str) -> None:
        """Send password reset email with the reset token."""
        reset_url = f"{current_app.config['FRONTEND_URL']}/reset-password?token={reset_token}"
        
        # HTML email template
        html_content = """
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>You have requested to reset your password. Click the link below to proceed:</p>
        <p><a href="{{ reset_url }}">Reset Password</a></p>
        <p>If you did not request this reset, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>MediSync Team</p>
        """
        
        msg = Message(
            'Password Reset Request',
            recipients=[user_email],
            html=render_template_string(html_content, reset_url=reset_url)
        )
        
        try:
            mail.send(msg)
        except Exception as e:
            current_app.logger.error(f"Failed to send password reset email: {str(e)}")
            raise 