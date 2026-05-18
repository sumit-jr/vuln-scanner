from fastapi import APIRouter
from app.scanner.header_checker import check_security_headers

router = APIRouter()


@router.get("/")
def root():
    return {"message": "Vulnerability Scanner Running"}


@router.get("/scan")
def scan(url: str):
    return check_security_headers(url)