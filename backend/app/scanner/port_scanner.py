import socket
from app.scanner.banner_grabber import grab_banner
from app.scanner.cve_mapper import map_cves


COMMON_PORTS = {
    21: "FTP",
    22: "SSH",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    3306: "MySQL",
    8080: "HTTP-ALT"
}


def scan_ports(host):

    open_ports = []

    for port, service in COMMON_PORTS.items():

        try:

            sock = socket.socket(
                socket.AF_INET,
                socket.SOCK_STREAM
            )

            sock.settimeout(1)

            result = sock.connect_ex((host, port))

            if result == 0:

                banner = grab_banner(host, port)
                cves = map_cves(banner)

                open_ports.append({
                    "port": port,
                    "service": service,
                    "status": "Open",
                    "banner": banner,
                    "cves": cves
                })

            sock.close()

        except Exception:

            continue

    return {
        "total_open_ports": len(open_ports),
        "open_ports": open_ports
    }