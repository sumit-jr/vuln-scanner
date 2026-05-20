from app.utils.http_client import safe_get
from urllib.parse import urlencode


SQLI_PAYLOADS = [

    "' OR '1'='1",
    "\" OR \"1\"=\"1",
    "'--",
    "' OR 1=1--",
    "' UNION SELECT NULL--"

]


SQL_ERRORS = [

    "sql syntax",
    "mysql_fetch",
    "syntax error",
    "unclosed quotation mark",
    "quoted string not properly terminated",
    "mysql",
    "sqlite",
    "postgresql",
    "oracle error",
    "database error"

]


def scan_sqli(target):

    findings = []

    test_params = [

        "id",
        "cat",
        "page",
        "search",
        "query"

    ]

    # BASELINE RESPONSE

    baseline_response = safe_get(
        target,
        timeout=5
    )

    if baseline_response:

        baseline_length = len(
            baseline_response.text
        )

    else:

        baseline_length = 0

    # SQLi TESTING

    for param in test_params:

        for payload in SQLI_PAYLOADS:

            try:

                params = {
                    param: payload
                }

                url = (
                    f"{target}?"
                    f"{urlencode(params)}"
                )

                response = safe_get(
                    url,
                    timeout=5
                )

                if not response:

                    continue

                content = response.text.lower()

                response_length = len(
                    response.text
                )

                error_detected = any(
                    error in content
                    for error in SQL_ERRORS
                )

                length_difference = abs(
                    response_length - baseline_length
                )

                suspicious = (

                    error_detected

                    or (

                        response.status_code >= 500

                        and length_difference > 1000

                    )

                )

                if suspicious:

                    findings.append({

                        "parameter": param,

                        "payload": payload,

                        "url": url,

                        "status_code": response.status_code,

                        "risk": "High"

                    })

            except Exception:

                continue

    return {

        "total_found": len(findings),

        "vulnerabilities": findings

    }