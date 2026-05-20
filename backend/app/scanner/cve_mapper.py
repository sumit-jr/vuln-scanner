import json
from app.scanner.version_extractor import extract_software_version
from app.scanner.live_cve_fetcher import fetch_live_cves

with open("app/data/cve_db.json", "r") as file:

    CVE_DATABASE = json.load(file)


def map_cves(banner):

    extracted = extract_software_version(banner)

    if not extracted:

        return []

    matches = []

    # LOCAL DATABASE CHECK

    for software, cves in CVE_DATABASE.items():

        if software.lower() in extracted.lower():

            matches.extend(cves)

    # LIVE CVE FETCH

    if not matches:
        print("LIVE FETCH TRIGGERED")
        live_results = fetch_live_cves(extracted)

        matches.extend(live_results)

    return matches