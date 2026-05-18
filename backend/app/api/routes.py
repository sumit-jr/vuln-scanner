@app.get("/")
def root():
    return {"message": "Vulnerability Scanner Running"}