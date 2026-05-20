import re


def normalize_version(version):

    # Remove trailing letters like p1
    version = re.sub(
        r"[a-zA-Z].*$",
        "",
        version
    )

    return version


def extract_software_version(banner):

    if not banner:

        return None

    patterns = [

        r"OpenSSH[_\-\/ ]([\d\.]+)",

        r"Apache\/([\d\.]+)",

        r"nginx\/([\d\.]+)",

        r"PHP\/([\d\.]+)"

    ]

    for pattern in patterns:

        match = re.search(
            pattern,
            banner,
            re.IGNORECASE
        )

        if match:

            version = normalize_version(
                match.group(1)
            )

            if "openssh" in pattern.lower():

                return f"OpenSSH_{version}"

            elif "apache" in pattern.lower():

                return f"Apache/{version}"

            elif "nginx" in pattern.lower():

                return f"nginx/{version}"

            elif "php" in pattern.lower():

                return f"PHP/{version}"

    return None