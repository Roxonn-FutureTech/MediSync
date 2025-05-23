import urllib.request
import urllib.parse
import json
import urllib.error

BASE_URL = 'http://localhost:5000/api/auth'

def make_request(endpoint, data, method='POST'):
    url = f'{BASE_URL}/{endpoint}'
    headers = {'Content-Type': 'application/json'}
    data_bytes = json.dumps(data).encode('utf-8')
    
    print(f"\nMaking request to: {url}")
    print(f"Request data: {data}")
    
    req = urllib.request.Request(
        url,
        data=data_bytes,
        headers=headers,
        method=method
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            response_data = response.read().decode('utf-8')
            print(f"Response data: {response_data}")
            return {
                'status_code': response.status,
                'data': json.loads(response_data)
            }
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"HTTP Error: {e.code}")
        print(f"Error body: {error_body}")
        try:
            error_data = json.loads(error_body)
        except json.JSONDecodeError:
            error_data = {'error': error_body}
        return {
            'status_code': e.code,
            'data': error_data
        }
    except urllib.error.URLError as e:
        print(f"URL Error: {str(e)}")
        return {
            'status_code': 0,
            'data': {'error': str(e)}
        }
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {
            'status_code': 0,
            'data': {'error': str(e)}
        }

def test_registration():
    data = {
        'email': 'test@example.com',
        'username': 'testuser',
        'password': 'testpass123'
    }
    
    print("\nTesting Registration...")
    result = make_request('register', data)
    print('Registration Response:', result['status_code'])
    print(result['data'])
    
def test_login():
    data = {
        'email': 'test@example.com',
        'password': 'testpass123'
    }
    
    print("\nTesting Login...")
    result = make_request('login', data)
    print('Login Response:', result['status_code'])
    print(result['data'])

if __name__ == '__main__':
    test_registration()
    test_login() 