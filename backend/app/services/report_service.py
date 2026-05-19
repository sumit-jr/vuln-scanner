import json
from datetime import datetime


def save_report(data):

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    filename = f"reports/scan_{timestamp}.json"

    with open(filename, "w") as file:
        json.dump(data, file, indent=4)

    return filename