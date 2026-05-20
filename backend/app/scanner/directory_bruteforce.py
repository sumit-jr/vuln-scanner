import requests


COMMON_DIRECTORIES = [

    "/admin",
    "/login",
    "/dashboard",
    "/robots.txt",
    "/phpmyadmin",
    "/config",
    "/api",
    "/.git",
    "/backup",
    "/uploads"

]


def scan_directories(target):

    discovered = []

    for directory in COMMON_DIRECTORIES:

        try:

            url = f"{target}{directory}"

            response = requests.get(
                url,
                timeout=3,
                allow_redirects=False,
                headers={
                    "User-Agent": "Mozilla/5.0"
                }
            )

            if response.status_code in [200, 301, 302, 403]:

                content = response.text.lower()

                fake_404_keywords = [

                    "page not found",
                    "404",
                    "not found"

                ]

                is_fake = any(
                    keyword in content
                    for keyword in fake_404_keywords
                )

                if is_fake:

                    continue

                discovered.append({

                    "path": directory,

                    "status_code": response.status_code

                })

        except Exception:

            continue

    return {

        "total_found": len(discovered),

        "directories": discovered

    }