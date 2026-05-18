from fastapi import APIRouter
from app.scanner.header_checker import check_security_headers
from app.models.scan_models import ScanRequest

router = APIRouter()


@router.get("/")
def root():
    return {"message": "Vulnerability Scanner Running"}


@router.post("/scan")
def scan(request: ScanRequest):
    return check_security_headers(request.url)