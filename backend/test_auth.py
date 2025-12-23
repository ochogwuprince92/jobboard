import requests
import json
import time
from requests.exceptions import RequestException

BASE_URL = "http://localhost:8001/api/auth"
HEADERS = {"Content-Type": "application/json"}


def wait_for_server(max_retries=5):
    for i in range(max_retries):
        try:
            response = requests.get("http://localhost:8001/api/schema/")
            if response.status_code == 200:
                print("Server is ready!")
                return True
        except RequestException:
            print(f"Waiting for server (attempt {i+1}/{max_retries})...")
            time.sleep(2)
    return False


def test_registration():
    print("\nTesting Registration...")
    registration_data = {
        "email": "test@example.com",
        "phone_number": "+1234567890",
        "first_name": "Test",
        "last_name": "User",
        "password1": "TestPass123!",
        "password2": "TestPass123!",
    }

    response = requests.post(
        f"{BASE_URL}/registration/", headers=HEADERS, json=registration_data
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json() if response.status_code == 201 else None


def test_login():
    print("\nTesting Login...")
    login_data = {"email": "test@example.com", "password": "TestPass123!"}

    response = requests.post(f"{BASE_URL}/login/", headers=HEADERS, json=login_data)

    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json() if response.status_code == 200 else None


def test_auth_flow():
    # Try registration
    user = test_registration()

    if user:
        print("\nRegistration successful!")
    else:
        print("\nRegistration failed or user already exists. Trying login...")

    # Try login
    auth_data = test_login()

    if auth_data:
        print("\nLogin successful!")
        # Test accessing protected endpoint
        if "access" in auth_data:
            headers = {
                "Authorization": f'Bearer {auth_data["access"]}',
                "Content-Type": "application/json",
            }
            user_response = requests.get(f"{BASE_URL}/user/", headers=headers)
            print("\nTesting protected endpoint (user profile)...")
            print(f"Status Code: {user_response.status_code}")
            print(f"Response: {json.dumps(user_response.json(), indent=2)}")
    else:
        print("\nLogin failed!")


if __name__ == "__main__":
    test_auth_flow()
