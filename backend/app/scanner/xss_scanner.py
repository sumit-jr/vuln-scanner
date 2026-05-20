import requests
from urllib.parse import urlparse, urlencode


XSS_PAYLOADS = [

    "<script>alert(1)</script>",

    "\"><script>alert(1)</script>",

    "'><img src=x onerror=alert(1)>"

]


COMMON_PARAMETERS = [

    "q",
    "search",
    "query",
    "id",
    "page",
    "keyword"

]


def scan_xss(target):

    vulnerabilities = []

    parsed = urlparse(target)

    base_url = f"{parsed.scheme}://{parsed.netloc}"

    for parameter in COMMON_PARAMETERS:

        for payload in XSS_PAYLOADS:

            try:

                params = {
                    parameter: payload
                }

                url = (
                    f"{base_url}/?"
                    + urlencode(params)
                )

                response = requests.get(
                    url,
                    timeout=5,
                    headers={
                        "User-Agent": "Mozilla/5.0"
                    }
                )

                decoded_payload = payload.replace(
                    "<",
                    "&lt;"
                ).replace(
                    ">",
                    "&gt;"
                )

                if (
                    payload in response.text
                    or decoded_payload in response.text
                ):

                    vulnerabilities.append({

                        "parameter": parameter,

                        "payload": payload,

                        "url": url,

                        "risk": "High"

                    })

            except Exception:

                continue

    return {

        "total_found": len(vulnerabilities),

        "vulnerabilities": vulnerabilities

    }