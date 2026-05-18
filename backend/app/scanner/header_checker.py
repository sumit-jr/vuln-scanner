import requests


def check_security_headers(url):
    try:
        response = requests.get(url, timeout=5)

        headers = response.headers

        security_headers = {
            "Content-Security-Policy": headers.get("Content-Security-Policy"),
            "X-Frame-Options": headers.get("X-Frame-Options"),
            "Strict-Transport-Security": headers.get("Strict-Transport-Security"),
            "X-Content-Type-Options": headers.get("X-Content-Type-Options"),
        }

        return security_headers

    except requests.exceptions.RequestException:
        return {"error": "Unable to access the website"}