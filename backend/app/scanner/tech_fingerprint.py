import requests


def fingerprint_technology(url):

    detected = []

    try:

        response = requests.get(
            url,
            timeout=5
        )

        headers = response.headers

        html = response.text.lower()

        server_header = headers.get("Server", "").lower()
        powered_by = headers.get("X-Powered-By", "").lower()

        # SERVER DETECTION

        if "nginx" in server_header:
            detected.append("nginx")

        if "apache" in server_header:
            detected.append("Apache")

        # FRAMEWORK DETECTION

        if "express" in powered_by:
            detected.append("Express")

        if "php" in powered_by:
            detected.append("PHP")

        # WORDPRESS DETECTION

        if "wp-content" in html:
            detected.append("WordPress")

        # DJANGO DETECTION

        cookies = str(response.cookies).lower()

        if "csrftoken" in cookies:
            detected.append("Django")

        # CLOUDFLARE

        if "cloudflare" in server_header:
            detected.append("Cloudflare")

    except Exception:

        return []

    return list(set(detected))