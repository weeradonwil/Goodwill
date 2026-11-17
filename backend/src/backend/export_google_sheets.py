
import csv
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build

from google_sheets import SPREADSHEET_ID


# --------------------------------------------------
# 1. Project configuration
# --------------------------------------------------

BACKEND_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = Path(__file__).resolve().parents[3]

load_dotenv(BACKEND_DIR / ".env")

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets.readonly"
]

OUTPUT_DIR = PROJECT_DIR / "data" / "google_sheets_export"


# --------------------------------------------------
# 2. Helper functions
# --------------------------------------------------

def column_to_letter(number: int) -> str:
    """Convert column number to A, B, ..., AA."""
    result = ""

    while number:
        number, remainder = divmod(number - 1, 26)
        result = chr(65 + remainder) + result

    return result


def safe_filename(name: str) -> str:
    """Make worksheet name safe for Windows filenames."""
    name = re.sub(r'[<>:"/\\|?*]', "-", name)
    return name.strip(" .") or "unnamed"


# --------------------------------------------------
# 3. Connect to Google Sheets
# --------------------------------------------------

def create_sheets_service():
    credentials_path = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE")

    if not credentials_path:
        raise ValueError(
            "ไม่พบ GOOGLE_SERVICE_ACCOUNT_FILE ใน backend/.env"
        )

    credentials_file = Path(credentials_path)

    if not credentials_file.is_absolute():
        credentials_file = BACKEND_DIR / credentials_file

    credentials_file = credentials_file.resolve()

    if not credentials_file.is_file():
        raise FileNotFoundError(
            f"ไม่พบ Service Account JSON: {credentials_file}"
        )

    credentials = service_account.Credentials.from_service_account_file(
        str(credentials_file),
        scopes=SCOPES,
    )

    print("Service Account:", credentials.service_account_email)

    return build(
        "sheets",
        "v4",
        credentials=credentials,
        cache_discovery=False,
    )


# --------------------------------------------------
# 4. Get all worksheets
# --------------------------------------------------

def get_all_worksheets(service):
    spreadsheet = service.spreadsheets().get(
        spreadsheetId=SPREADSHEET_ID,
        fields=(
            "properties(title),"
            "sheets(properties(title,hidden,"
            "gridProperties(rowCount,columnCount)))"
        ),
    ).execute()

    print("\nGoogle Sheets:", spreadsheet["properties"]["title"])

    worksheets = spreadsheet.get("sheets", [])

    print("จำนวน Worksheet ทั้งหมด:", len(worksheets))

    return worksheets


# --------------------------------------------------
# 5. Export worksheet data
# --------------------------------------------------

def export_worksheet(service, worksheet, index, total):
    properties = worksheet["properties"]

    title = properties["title"]
    hidden = properties.get("hidden", False)

    grid = properties["gridProperties"]

    row_count = grid["rowCount"]
    column_count = grid["columnCount"]

    if row_count == 0 or column_count == 0:
        print(f"\n[{index}/{total}] {title}: ไม่มีพื้นที่ข้อมูล")
        return None

    last_column = column_to_letter(column_count)
    escaped_title = title.replace("'", "''")

    cell_range = (
        f"'{escaped_title}'!A1:{last_column}{row_count}"
    )

    print("\n" + "=" * 50)
    print(f"[{index}/{total}] {title}")
    print("สถานะ:", "Hidden" if hidden else "Visible")

    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=cell_range,
        valueRenderOption="FORMATTED_VALUE",
    ).execute()

    rows = result.get("values", [])

    filename = f"{index:03d}_{safe_filename(title)}.csv"
    output_file = OUTPUT_DIR / filename

    with output_file.open(
        "w",
        newline="",
        encoding="utf-8-sig",
    ) as file:
        writer = csv.writer(file)
        writer.writerows(rows)

    actual_columns = max(
        (len(row) for row in rows),
        default=0,
    )

    print("จำนวนแถวข้อมูล:", len(rows))
    print("จำนวนคอลัมน์:", actual_columns)
    print("บันทึกไฟล์:", filename)

    return {
        "worksheet": title,
        "visibility": "Hidden" if hidden else "Visible",
        "rows": len(rows),
        "columns": actual_columns,
        "filename": filename,
    }


# --------------------------------------------------
# 6. Export manifest
# --------------------------------------------------

def export_manifest(records):
    manifest_file = OUTPUT_DIR / "manifest.csv"

    with manifest_file.open(
        "w",
        newline="",
        encoding="utf-8-sig",
    ) as file:
        writer = csv.writer(file)

        writer.writerow([
            "Worksheet",
            "Visibility",
            "Rows",
            "Columns",
            "Export File",
        ])

        for record in records:
            writer.writerow([
                record["worksheet"],
                record["visibility"],
                record["rows"],
                record["columns"],
                record["filename"],
            ])

    print("\nสร้าง manifest.csv สำเร็จ")


# --------------------------------------------------
# 7. Main
# --------------------------------------------------

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    service = create_sheets_service()

    worksheets = get_all_worksheets(service)

    if not worksheets:
        print("ไม่พบ Worksheet")
        return

    records = []

    total = len(worksheets)

    for index, worksheet in enumerate(worksheets, start=1):
        record = export_worksheet(
            service,
            worksheet,
            index,
            total,
        )

        if record:
            records.append(record)

    export_manifest(records)

    print("\n" + "=" * 50)
    print("EXPORT COMPLETED")
    print("จำนวน Worksheet:", len(records))
    print("ตำแหน่งจัดเก็บ:", OUTPUT_DIR)


if __name__ == "__main__":
    main()
