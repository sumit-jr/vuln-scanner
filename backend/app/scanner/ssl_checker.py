import socket
import ssl
from urllib.parse import urlparse


def check_ssl(url):

    try:

        parsed_url = urlparse(url)

        hostname = parsed_url.netloc

        context = ssl.create_default_context()

        with socket.create_connection((hostname, 443), timeout=5) as sock:

            with context.wrap_socket(
                sock,
                server_hostname=hostname
            ) as secure_sock:

                cert = secure_sock.getpeercert()

                return {
                    "ssl_enabled": True,
                    "issuer": dict(x[0] for x in cert["issuer"]),
                    "expiry_date": cert["notAfter"]
                }

    except Exception as e:

        return {
            "ssl_enabled": False,
            "error": str(e)
        }