import json


with open("app/data/cve_db.json", "r") as file:

    CVE_DATABASE = json.load(file)


def map_cves(banner):

    matches = []

    for software, cves in CVE_DATABASE.items():

        if software.lower() in banner.lower():

            matches.extend(cves)

    return matches