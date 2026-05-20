import requests


def fetch_live_cves(software):

    try:

        url = "https://vulners.com/api/v3/search/lucene/"

        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        payload = {
            "query": software,
            "size": 5
        }

        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=10
        )

        if response.status_code != 200:

            print("BAD STATUS:", response.status_code)

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

        for item in search_results:

            source = item.get("_source", {})

            results.append({

                "cve_id": source.get(
                    "id",
                    "Unknown"
                ),

                "severity": source.get(
                    "cvss",
                    {}
                ).get(
                    "score",
                    "Unknown"
                ),

                "description": source.get(
                    "description",
                    "No description"
                )[:200]
            })

        return results

    except Exception as e:

        print("LIVE CVE ERROR:", e)

        return []