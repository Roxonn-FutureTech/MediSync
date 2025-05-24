from setuptools import setup, find_packages

setup(
    name="medisync",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        'Flask>=2.2.0',
        'Flask-SQLAlchemy>=3.0.0',
        'SQLAlchemy>=2.0.0',
        'Flask-Limiter>=3.5.0',
        'Flask-Caching>=2.1.0',
        'marshmallow>=3.20.1',
        'python-dotenv>=1.0.0',
        'Flask-JWT-Extended>=4.5.2',
        'Flask-Security-Too>=5.1.2',
        'Flask-Mail>=0.9.1',
        'pyotp>=2.9.0',
        'bcrypt>=4.0.1',
        'Flask-Cors>=4.0.0',
        'cryptography>=41.0.0',
    ],
    python_requires='>=3.8',
) 