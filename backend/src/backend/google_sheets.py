
import os
from pathlib import Path

from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build

# ตำแหน่งโฟลเดอร์ backend
BACKEND_DIR = Path(__file__).resolve().parents[2]

# โหลดค่าจาก backend/.env
load_dotenv(BACKEND_DIR / ".env")

# Google Sheets ID
SPREADSHEET_ID = "1C7wqpV7kqxKFG2oW2Shn2XuvQjdJteTnF3CRQPe2jbA"

# อ่านข้อมูลได้อย่างเดียว
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]


def test_google_sheets():
    credentials_path = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE")

    if not credentials_path:
        raise ValueError("ไม่พบ GOOGLE_SERVICE_ACCOUNT_FILE ใน .env")

    credentials_file = (BACKEND_DIR / credentials_path).resolve()

    if not credentials_file.is_file():
        raise FileNotFoundError(
            f"ไม่พบไฟล์ Service Account: {credentials_file}"
        )

    credentials = service_account.Credentials.from_service_account_file(
        str(credentials_file),
        scopes=SCOPES,
    )

    service = build(
        "sheets",
        "v4",
        credentials=credentials,
        cache_discovery=False,
    )

    result = (
        service.spreadsheets()
        .get(
            spreadsheetId=SPREADSHEET_ID,
            fields="properties.title,sheets.properties",
        )
        .execute()
    )

    print("เชื่อมต่อ Google Sheets สำเร็จ")
    print(f"ชื่อไฟล์: {result['properties']['title']}")
    print("\nรายการ Worksheet:")

    for sheet in result.get("sheets", []):
        print(f"- {sheet['properties']['title']}")


if __name__ == "__main__":
    test_google_sheets()
