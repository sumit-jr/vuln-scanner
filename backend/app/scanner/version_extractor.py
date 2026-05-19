import re


def extract_software_version(banner):

    patterns = [

        r"(OpenSSH[_\-\/ ]\d+\.\d+\.\d+)",
        r"(Apache\/\d+\.\d+\.\d+)",
        r"(nginx\/\d+\.\d+\.\d+)"
    ]

    for pattern in patterns:

        match = re.search(
            pattern,
            banner,
            re.IGNORECASE
        )

        if match:

            software = match.group(1)

            software = software.replace("-", "_")
            software = software.replace("/", "/")

            return software

    return None