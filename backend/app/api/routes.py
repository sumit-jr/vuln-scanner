from fastapi import APIRouter
from app.scanner.header_checker import check_security_headers
from app.models.scan_models import ScanRequest
from app.scanner.ssl_checker import check_ssl
from app.services.report_service import save_report
from app.scanner.port_scanner import scan_ports
from urllib.parse import urlparse
import os
import json


router = APIRouter()


@router.get("/")
def root():
    return {"message": "Vulnerability Scanner Running"}


@router.post("/scan")
def scan(request: ScanRequest):
    parsed_url = urlparse(request.url)

    host = parsed_url.netloc

    scan_result = {
        "headers": check_security_headers(request.url),
        "ssl": check_ssl(request.url),
        "ports": scan_ports(host)
    }

    save_report(scan_result)

    return scan_result

@router.get("/reports")
def get_reports():

    reports = []

    for file_name in os.listdir("reports"):

        if file_name.endswith(".json"):

            with open(f"reports/{file_name}", "r") as file:
                report_data = json.load(file)

                reports.append({
                    "file_name": file_name,
                    "report": report_data
                })

    return reports