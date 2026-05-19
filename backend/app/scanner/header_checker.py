import requests
from urllib.parse import urlparse


def is_valid_url(url):
    parsed = urlparse(url)
    return all([parsed.scheme, parsed.netloc])


def analyze_header(header_value, risk, recommendation):
    return {
        "value": header_value,
        "status": "Present" if header_value else "Missing",
        "risk": "Low" if header_value else risk,
        "recommendation": None if header_value else recommendation
    }


def check_security_headers(url):

    if not is_valid_url(url):
        return {"error": "Invalid URL"}

    try:
        response = requests.get(url, timeout=5)

        headers = response.headers

        security_headers = {
            "Content-Security-Policy": analyze_header(
                headers.get("Content-Security-Policy"),
                "High",
                "Add Content-Security-Policy header to prevent XSS attacks"
            ),

            "X-Frame-Options": analyze_header(
                headers.get("X-Frame-Options"),
                "Medium",
                "Add X-Frame-Options header to prevent clickjacking"
            ),

            "Strict-Transport-Security": analyze_header(
                headers.get("Strict-Transport-Security"),
                "High",
                "Enable HSTS to enforce HTTPS connections"
            ),

            "X-Content-Type-Options": analyze_header(
                headers.get("X-Content-Type-Options"),
                "Medium",
                "Add X-Content-Type-Options header to prevent MIME-type sniffing"
            )
        }

        missing_headers = sum(
            1 for header in security_headers.values()
            if header["status"] == "Missing"
        )

        high_risk_count = sum(
            1 for header in security_headers.values()
            if header["risk"] == "High"
        )

        if high_risk_count >= 2:
            overall_risk = "High"
        elif missing_headers >= 2:
            overall_risk = "Medium"
        else:
            overall_risk = "Low"

        return {
            "summary": {
                "total_headers_checked": len(security_headers),
                "missing_headers": missing_headers,
                "overall_risk": overall_risk    
            },
            "details": security_headers
        }

    except requests.exceptions.RequestException:
        return {"error": "Unable to access the website"}