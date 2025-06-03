import requests
import json
import urllib3
from requests.exceptions import RequestException

# Disable SSL verification warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class APITester:
    def __init__(self, base_url="https://localhost:5000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.verify = False
        self.csrf_token = None

    def get_csrf_token(self):
        """Get CSRF token from the server"""
        try:
            response = self.session.get(f"{self.base_url}/health")
            self.csrf_token = response.headers.get('X-CSRF-Token')
            return self.csrf_token
        except RequestException as e:
            print(f"Error getting CSRF token: {str(e)}")
            return None

    def test_health(self):
        """Test the health check endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/health")
            print(f"Health Check Status Code: {response.status_code}")
            print(f"Health Check Response: {response.text}")
            return response.status_code == 200
        except RequestException as e:
            print(f"Could not connect to the server: {str(e)}")
            return False

    def test_create_hospital(self):
        """Test hospital creation endpoint"""
        if not self.csrf_token:
            self.get_csrf_token()

        url = f"{self.base_url}/api/hospitals"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRF-Token": self.csrf_token
        }
        data = {
            "name": "Test Hospital",
            "address": "123 Main St",
            "phone": "555-0123",
            "capacity": 100
        }
        
        print("\nSending request to", url)
        print("Headers:", json.dumps(headers, indent=2))
        print("Data:", json.dumps(data, indent=2))
        
        try:
            response = self.session.post(url, headers=headers, json=data)
            print(f"\nCreate Hospital Status Code: {response.status_code}")
            print(f"Response Headers: {dict(response.headers)}")
            print(f"Response Body: {response.text}")
            return response.status_code == 201
        except RequestException as e:
            print(f"Error creating hospital: {str(e)}")
            return False

def main():
    tester = APITester()
    
    # Test health endpoint first
    if tester.test_health():
        print("\nServer is healthy, proceeding with hospital creation test...")
        if tester.test_create_hospital():
            print("\nHospital creation test successful!")
        else:
            print("\nHospital creation test failed!")
    else:
        print("\nServer health check failed. Please check if the server is running correctly.")

if __name__ == "__main__":
    main() 