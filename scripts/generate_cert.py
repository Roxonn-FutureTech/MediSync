import os
import subprocess
from pathlib import Path

def generate_ssl_cert():
    """Generate self-signed SSL certificates for development"""
    certs_dir = Path("certs")
    cert_path = certs_dir / "cert.pem"
    key_path = certs_dir / "key.pem"
    
    # Create certs directory if it doesn't exist
    certs_dir.mkdir(exist_ok=True)
    
    # Generate SSL certificate and private key
    command = [
        "openssl", "req", "-x509",
        "-newkey", "rsa:4096",
        "-nodes",
        "-out", str(cert_path),
        "-keyout", str(key_path),
        "-days", "365",
        "-subj", "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    ]
    
    try:
        subprocess.run(command, check=True)
        print(f"SSL certificate and key generated successfully:")
        print(f"Certificate: {cert_path}")
        print(f"Private Key: {key_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error generating SSL certificate: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    generate_ssl_cert() 