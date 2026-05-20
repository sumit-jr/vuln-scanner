import re


PATTERNS = [

    # OpenSSH
    r"(OpenSSH[_\-\/ ]\d+\.\d+(?:\.\d+)?)",

    # Apache
    r"(Apache\/\d+\.\d+(?:\.\d+)?)",

    # nginx
    r"(nginx\/\d+\.\d+(?:\.\d+)?)",

    # PHP
    r"(PHP\/\d+\.\d+(?:\.\d+)?)",

    # MySQL
    r"(MySQL\/\d+\.\d+(?:\.\d+)?)",

    # OpenSSL
    r"(OpenSSL\/\d+\.\d+(?:\.\d+)?)",

    # Exim
    r"(Exim \d+\.\d+(?:\.\d+)?)",

    # vsFTPd
    r"(vsFTPd \d+\.\d+(?:\.\d+)?)"

]


def normalize_software_name(software):

    software = software.replace("_", " ")

    software = software.strip()

    return software


def extract_software_version(banner):

    patterns = [

        # OpenSSH
        (
            r"OpenSSH[_\-\/ ](\d+\.\d+\.\d+)",
            "OpenSSH"
        ),

        # Apache
        (
            r"Apache\/(\d+\.\d+\.\d+)",
            "Apache"
        ),

        # nginx
        (
            r"nginx\/(\d+\.\d+\.\d+)",
            "nginx"
        )
    ]

    for pattern, software_name in patterns:

        match = re.search(
            pattern,
            banner,
            re.IGNORECASE
        )

        if match:

            version = match.group(1)

            return f"{software_name}/{version}"

    return None