import requests
from urllib.parse import urlparse


def is_valid_url(url):
    parsed = urlparse(url)
    return all([parsed.scheme, parsed.netloc])

def check_security_headers(url):
    if not is_valid_url(url):
        return {"error": "Invalid URL"}

    try:
        response = requests.get(url, timeout=5)

        headers = response.headers

        security_headers = {
            "Content-Security-Policy": {
                "value": headers.get("Content-Security-Policy"),
                "status": "Present" if headers.get("Content-Security-Policy") else "Missing",
                "risk": "High" if not headers.get("Content-Security-Policy") else "Low",
                "recommendation": None if headers.get("Content-Security-Policy")
                else "Add Content-Security-Policy header to prevent XSS attacks"
            },

            "X-Frame-Options": {
                "value": headers.get("X-Frame-Options"),
                "status": "Present" if headers.get("X-Frame-Options") else "Missing",
                "risk": "Medium" if not headers.get("X-Frame-Options") else "Low",
                "recommendation": None if headers.get("X-Frame-Options")
                else "Add X-Frame-Options header to prevent clickjacking"
            },

            "Strict-Transport-Security": {
                "value": headers.get("Strict-Transport-Security"),
                "status": "Present" if headers.get("Strict-Transport-Security") else "Missing",
                "risk": "High" if not headers.get("Strict-Transport-Security") else "Low",
                "recommendation": None if headers.get("Strict-Transport-Security")
                else "Enable HSTS to enforce HTTPS connections"
            },

            "X-Content-Type-Options": {
                "value": headers.get("X-Content-Type-Options"),
                "status": "Present" if headers.get("X-Content-Type-Options") else "Missing",
                "risk": "Medium" if not headers.get("X-Content-Type-Options") else "Low",
                "recommendation": None if headers.get("X-Content-Type-Options")
                else "Add X-Content-Type-Options header to prevent MIME-type sniffing"
            }
        }

        return security_headers

    except requests.exceptions.RequestException:
        return {"error": "Unable to access the website"}