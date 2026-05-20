from fastapi import APIRouter
from app.scanner.header_checker import check_security_headers
from app.models.scan_models import ScanRequest
from app.scanner.ssl_checker import check_ssl
from app.services.report_service import save_report
from app.scanner.port_scanner import scan_ports
from urllib.parse import urlparse
from app.scanner.tech_fingerprint import fingerprint_technology
from app.scanner.directory_bruteforce import scan_directories
from app.scanner.xss_scanner import scan_xss
import os
import json


router = APIRouter()


@router.get("/")
def root():
    return {"message": "Vulnerability Scanner Running"}


@router.post("/scan")
def scan(request: ScanRequest):

    target = request.url.strip()

    # Auto add http:// if user enters only domain
    if not target.startswith("http://") and not target.startswith("https://"):
        target = "http://" + target

    parsed_url = urlparse(target)

    host = parsed_url.netloc

    headers_result = check_security_headers(target)

    ssl_result = check_ssl(target)

    ports_result = scan_ports(host)

    scan_result = {

        "target": host,

        "technologies": fingerprint_technology(target),

        "headers": headers_result,

        "ssl": ssl_result,

        "ports": ports_result,

        "directories": scan_directories(target),

        "xss": scan_xss(target)

    }

    save_report(scan_result)

    return scan_result

@router.get("/reports")
def get_reports():

    reports = []

    files = sorted(
        os.listdir("reports"),
        reverse=True
    )

    for file_name in files:

        if file_name.startswith("scan_") and file_name.endswith(".json"):

            with open(f"reports/{file_name}", "r") as file:

                report_data = json.load(file)

                reports.append({
                    "file_name": file_name,
                    "report": report_data
                })

    return reports


@router.delete("/reports/{file_name}")
def delete_report(file_name: str):

    file_path = f"reports/{file_name}"

    if os.path.exists(file_path):

        os.remove(file_path)

        return {"message": "Deleted"}

    return {"error": "File not found"}