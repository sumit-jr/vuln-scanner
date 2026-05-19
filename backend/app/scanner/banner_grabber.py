import socket


def grab_banner(host, port):

    try:

        sock = socket.socket(
            socket.AF_INET,
            socket.SOCK_STREAM
        )

        sock.settimeout(2)

        sock.connect((host, port))

        banner = sock.recv(1024).decode().strip()

        sock.close()

        return banner if banner else "Unknown Service"

    except Exception:

        return "Banner Not Detected"