from fastapi import APIRouter
from app.scanner.header_checker import check_security_headers
from app.models.scan_models import ScanRequest
import os
import json


router = APIRouter()


@router.get("/")
def root():
    return {"message": "Vulnerability Scanner Running"}


@router.post("/scan")
def scan(request: ScanRequest):
    return check_security_headers(request.url)

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