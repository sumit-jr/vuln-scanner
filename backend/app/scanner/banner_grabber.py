import socket
import requests
import urllib3


urllib3.disable_warnings(
    urllib3.exceptions.InsecureRequestWarning
)


def build_banner(server, powered, via):

    detected = []

    if server:
        detected.append(server)

    if powered:
        detected.append(powered)

    if via:
        detected.append(via)

    if detected:

        return " | ".join(detected)

    return None


def grab_banner(target, port):

    try:

        # SSH BANNER

        if port == 22:

            sock = socket.socket()

            sock.settimeout(3)

            sock.connect((target, port))

            banner = sock.recv(1024).decode(
                errors="ignore"
            ).strip()

            sock.close()

            return banner

        # HTTP

        elif port == 80:

            response = requests.get(
                f"http://{target}",
                timeout=5,
                headers={
                    "User-Agent": "Mozilla/5.0"
                }
            )

            server = response.headers.get(
                "Server"
            )

            powered = response.headers.get(
                "X-Powered-By"
            )

            via = response.headers.get(
                "Via"
            )

            banner = build_banner(
                server,
                powered,
                via
            )

            if banner:

                return banner

            return "HTTP Service Detected"

        # HTTPS

        elif port == 443:

            response = requests.get(
                f"https://{target}",
                timeout=5,
                verify=False,
                headers={
                    "User-Agent": "Mozilla/5.0"
                }
            )

            server = response.headers.get(
                "Server"
            )

            powered = response.headers.get(
                "X-Powered-By"
            )

            via = response.headers.get(
                "Via"
            )

            banner = build_banner(
                server,
                powered,
                via
            )

            if banner:

                return banner

            return "HTTPS Service Detected"

        # PORT 8080

        elif port == 8080:

            response = requests.get(
                f"http://{target}:8080",
                timeout=5,
                headers={
                    "User-Agent": "Mozilla/5.0"
                }
            )

            server = response.headers.get(
                "Server"
            )

            powered = response.headers.get(
                "X-Powered-By"
            )

            via = response.headers.get(
                "Via"
            )

            banner = build_banner(
                server,
                powered,
                via
            )

            if banner:

                return banner

            return "HTTP-ALT Service Detected"

        return "Banner Not Detected"

    except Exception:

        return "Banner Not Detected"