import socket
import ssl
from urllib.parse import urlparse


def check_ssl(url):

    hostname = urlparse(url).hostname

    context = ssl.create_default_context()

    with socket.create_connection((hostname, 443)) as sock:
        with context.wrap_socket(sock, server_hostname=hostname) as secure_sock:

            certificate = secure_sock.getpeercert()

            return {
                "ssl_enabled": True,
                "issuer": dict(x[0] for x in certificate["issuer"]),
                "expiry_date": certificate["notAfter"]
            }