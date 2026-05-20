import requests
from urllib.parse import urlparse
import logging
import json
import os


# CREATE LOG DIRECTORY IF NOT EXISTS
os.makedirs("logs", exist_ok=True)

logging.basicConfig(
    filename="logs/scanner.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)


def is_valid_url(url):

    parsed = urlparse(url)

    return all([
        parsed.scheme,
        parsed.netloc
    ])


def truncate_value(value, limit=120):

    if not value:
        return None

    if len(value) > limit:
        return value[:limit] + "..."

    return value


def analyze_header(
    header_value,
    risk,
    recommendation
):

    return {

        "value": truncate_value(header_value),

        "status": (
            "Present"
            if header_value
            else "Missing"
        ),

        "risk": (
            "Low"
            if header_value
            else risk
        ),

        "recommendation": (
            None
            if header_value
            else recommendation
        )

    }


def check_security_headers(url):

    if not is_valid_url(url):

        return {
            "error": "Invalid URL"
        }

    try:

        response = requests.get(
            url,
            timeout=5,
            allow_redirects=True,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 "
                    "(Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 "
                    "(KHTML, like Gecko) "
                    "Chrome/124.0 Safari/537.36"
                )
            }
        )

        headers = response.headers

        logging.info(f"Scanning URL: {url}")

        filename = (
            url.replace("https://", "")
            .replace("http://", "")
            .replace("/", "_")
        )

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

        report = {

            "summary": {

                "total_headers_checked": len(security_headers),

                "missing_headers": missing_headers,

                "overall_risk": overall_risk

            },

            "details": security_headers

        }

        return report

    except requests.exceptions.RequestException as e:

        logging.error(
            f"Error scanning {url}: {str(e)}"
        )

        return {
            "error": "Unable to access the website"
        }