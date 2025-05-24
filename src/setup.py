from setuptools import setup, find_packages

setup(
    name="medisync-api",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        'flask',
        'flask-sqlalchemy',
        'flask-cors',
        'flask-jwt-extended',
        'flask-security-too',
        'bcrypt',
        'email-validator',
        'python-dotenv'
    ]
) 