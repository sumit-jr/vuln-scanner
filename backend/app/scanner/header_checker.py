import requests


def check_security_headers(url):
    response = requests.get(url)

    headers = response.headers

    security_headers = {
        "Content-Security-Policy": headers.get("Content-Security-Policy"),
        "X-Frame-Options": headers.get("X-Frame-Options"),
        "Strict-Transport-Security": headers.get("Strict-Transport-Security"),
        "X-Content-Type-Options": headers.get("X-Content-Type-Options"),
    }

    return security_headers