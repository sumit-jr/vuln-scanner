import requests


def check_security_headers(url):
    try:
        response = requests.get(url, timeout=5)

        headers = response.headers

        security_headers = {
    "Content-Security-Policy": {
        "value": headers.get("Content-Security-Policy"),
        "status": "Present" if headers.get("Content-Security-Policy") else "Missing",
        "risk": "High" if not headers.get("Content-Security-Policy") else "Low"
    },

    "X-Frame-Options": {
        "value": headers.get("X-Frame-Options"),
        "status": "Present" if headers.get("X-Frame-Options") else "Missing",
        "risk": "Medium" if not headers.get("X-Frame-Options") else "Low"
    },

    "Strict-Transport-Security": {
        "value": headers.get("Strict-Transport-Security"),
        "status": "Present" if headers.get("Strict-Transport-Security") else "Missing",
        "risk": "High" if not headers.get("Strict-Transport-Security") else "Low"
    },

    "X-Content-Type-Options": {
        "value": headers.get("X-Content-Type-Options"),
        "status": "Present" if headers.get("X-Content-Type-Options") else "Missing",
        "risk": "Medium" if not headers.get("X-Content-Type-Options") else "Low"
    }
}

        return security_headers

    except requests.exceptions.RequestException:
        return {"error": "Unable to access the website"}