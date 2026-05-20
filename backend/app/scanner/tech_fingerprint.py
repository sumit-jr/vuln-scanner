import requests
import re


TECH_PATTERNS = {

    "WordPress": {
        "patterns": [
            "wp-content",
            "wp-includes"
        ],
        "confidence": 95
    },

    "React": {
        "patterns": [
            "_reactRootContainer",
            "__REACT_DEVTOOLS_GLOBAL_HOOK__",
            "react.production.min.js"
        ],
        "confidence": 90
    },

    "Next.js": {
        "patterns": [
            "__NEXT_DATA__",
            "/_next/static/"
        ],
        "confidence": 95
    },

    "Cloudflare": {
        "patterns": [
            "cf-ray",
            "cloudflare"
        ],
        "confidence": 90
    },

    "Vercel": {
        "patterns": [
            "x-vercel-id",
            "vercel"
        ],
        "confidence": 85
    },

    "Shopify": {
        "patterns": [
            "cdn.shopify.com",
            "_shopify_y",
            "shopify-payment-button"
        ],
        "confidence": 90
    },

    "Bootstrap": {
        "patterns": [
            "bootstrap.min.css",
            "bootstrap.min.js"
        ],
        "confidence": 80
    },

    "jQuery": {
        "patterns": [
            "jquery.min.js",
            "jquery.js"
        ],
        "confidence": 80
    },

    "Vue.js": {
        "patterns": [
            "vue.js",
            "vue.min.js"
        ],
        "confidence": 80
    },

    "Angular": {
        "patterns": [
            "ng-version",
            "angular"
        ],
        "confidence": 85
    },

    "Laravel": {
        "patterns": [
            "laravel_session"
        ],
        "confidence": 85
    },

    "Django": {
        "patterns": [
            "csrftoken"
        ],
        "confidence": 85
    },

    "Flask": {
        "patterns": [
            "flask"
        ],
        "confidence": 75
    },

    "Apache": {
        "patterns": [
            "apache"
        ],
        "confidence": 85
    },

    "Nginx": {
        "patterns": [
            "nginx"
        ],
        "confidence": 85
    }

}


def fingerprint_technology(url):

    detected = []

    try:

        response = requests.get(
            url,
            timeout=5,
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

        headers = str(response.headers).lower()

        html = response.text.lower()

        cookies = str(response.cookies).lower()

        combined_data = (
            headers +
            html +
            cookies
        )

        # PATTERN DETECTION

        for tech, info in TECH_PATTERNS.items():

            patterns = info["patterns"]

            confidence = info["confidence"]

            for pattern in patterns:

                if pattern.lower() in combined_data:

                    detected.append({
                        "name": tech,
                        "confidence": confidence
                    })

                    break

        # SCRIPT SRC DETECTION

        scripts = re.findall(
            r'<script[^>]+src=["\'](.*?)["\']',
            html
        )

        for script in scripts:

            script = script.lower()

            if "react" in script:

                detected.append({
                    "name": "React",
                    "confidence": 80
                })

            if "vue" in script:

                detected.append({
                    "name": "Vue.js",
                    "confidence": 80
                })

            if "jquery" in script:

                detected.append({
                    "name": "jQuery",
                    "confidence": 75
                })

            if "bootstrap" in script:

                detected.append({
                    "name": "Bootstrap",
                    "confidence": 75
                })

        # REMOVE DUPLICATES

        unique_detected = []

        seen = set()

        for item in detected:

            if item["name"] not in seen:

                unique_detected.append(item)

                seen.add(item["name"])

        # SORT BY CONFIDENCE

        return sorted(
            unique_detected,
            key=lambda x: x["confidence"],
            reverse=True
        )

    except Exception:

        return []