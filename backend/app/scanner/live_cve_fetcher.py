import requests


def get_severity(score):

    try:

        score = float(score)

        if score >= 9:
            return "Critical"

        elif score >= 7:
            return "High"

        elif score >= 4:
            return "Medium"

        elif score > 0:
            return "Low"

        return "Unknown"

    except:

        return "Unknown"


def fetch_live_cves(software):

    try:

        url = "https://vulners.com/api/v3/search/lucene/"

        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        payload = {
            "query": software,
            "size": 10
        }

        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=10
        )

        if response.status_code != 200:

            print(
                "BAD STATUS:",
                response.status_code
            )

            return []

        data = response.json()

        search_results = data.get(
            "data",
            {}
        ).get(
            "search",
            []
        )

        results = []

        seen_cves = set()

        for item in search_results:

            source = item.get(
                "_source",
                {}
            )

            cve_id = source.get(
                "id",
                "Unknown"
            )

            # SKIP NON-CVE RESULTS
            if not cve_id.startswith("CVE-"):

                continue

            # SKIP DUPLICATES
            if cve_id in seen_cves:

                continue

            seen_cves.add(cve_id)

            cvss_score = source.get(
                "cvss",
                {}
            ).get(
                "score",
                0
            )

            description = source.get(
                "description",
                "No description available"
            )

            results.append({

                "cve_id": cve_id,

                "cvss_score": cvss_score,

                "severity": get_severity(
                    cvss_score
                ),

                "description": description[:200]

            })

        return results

    except Exception as e:

        print(
            "LIVE CVE ERROR:",
            e
        )

        return []