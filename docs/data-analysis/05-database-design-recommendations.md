# 05 — ข้อเสนอแนะสำหรับออกแบบฐานข้อมูล

## หลักการ
1. เก็บ operational data ในตาราง normalized ไม่จำลอง 460 worksheets เป็น 460 ตาราง
2. ใช้ surrogate PK ในฐานข้อมูล; เก็บ INV เป็น business identifier/candidate key จนยืนยัน uniqueness
3. เก็บ provenance เช่น spreadsheet/tab, export batch/time, source row และ raw value
4. เก็บ raw snapshot แยก canonical data; บันทึก validation/error แทนการทิ้ง #N/A, #REF!, blank หรือขีด
5. parse วันที่/ตัวเลขแบบ explicit; อย่า parse ตาม locale เครื่องหรือ infer จากชื่อชีต
6. ทำ mapping ตาม header/version เพราะตำแหน่งสินค้าและ QA เปลี่ยน

## Entity ที่ควรพิจารณาใน ER Diagram

| แนวคิด | บทบาทเบื้องต้น | ประเด็นตัดสินใจ |
|---|---|---|
| Delivery/Invoice | หัวการส่ง เช่น INV, วันส่ง, ร้าน, source | INV unique? split/revision? วันที่หายไป 207 sheets |
| Delivery line / lot allocation | รายละเอียดสินค้า, BBF, pallet, จำนวนลัง | grain เป็น product lot หรือ pallet? รวม/แยกอย่างไร |
| Product | รายการสินค้า/SKU | aliases ของ EVM, 400G, Creamix และ SKU ต้นทาง |
| Store | ชื่อ/ที่อยู่/จังหวัด/อำเภอ | Store ID และประวัติชื่อ/ที่อยู่ |
| Sales assignment/team data | INV, วัน/เดือน, Free/ยอดสินค้า | เป็นข้อมูลขาย, ส่ง หรือ summary? |
| Lot report | lot/expiry และ QA | entity แยกหรือ report projection |
| Delivery inspection | stacking/pallet/box/safe transport, inspector, remarks | ผูกกับ Delivery, pallet หรือ shipment? |

แนวคิดเหล่านี้เป็นจุดเริ่มวาด ER Diagram ไม่ใช่ schema ที่ยืนยัน

## Candidate relationships — วาดเป็นเส้นประ
- Delivery INV ↔ Sales Team V2 INV
- Delivery INV ↔ Lot Report INV
- Sales Team legacy INV ↔ V2 INV
- Delivery ↔ Store ผ่าน Store ID (ยังไม่พบใน export; ชื่อร้านเป็นเพียง candidate lookup)
- Delivery line ↔ Product ผ่าน header mapping (รอการยืนยัน SKU)
- Delivery line/lot ↔ QA inspection (ระดับความสัมพันธ์ยังไม่ชัด)

ค่าที่ match ของ INV เป็นหลักฐาน join ที่แข็งแรง แต่ยังไม่ควรเพิ่ม FK/unique constraint จนยืนยันความหมายและกฎ cardinality

## แนวทาง Google Sheets Integration
- อ่านเป็น worksheet snapshots และบันทึก sync time/source version
- ทำ mapping layer ระหว่าง header variants กับ canonical fields; เก็บ unmapped fields เป็น Unknown
- ใช้ idempotent upsert เมื่อมี stable source ID; ชั่วคราวให้เก็บ source row/fingerprint เป็น provenance และห้าม overwrite canonical อัตโนมัติ
- เก็บ INV เป็น text; parse date/number/boolean พร้อม validation report
- ออกรายงาน reconciliation ต่อ batch: read count, insert/update, duplicate candidates, formula errors, unmatched INV, unknown headers
- Hidden ไม่ได้แปลว่าไม่ใช้; มี 458/464 hidden จึงต้องยืนยัน scope ของการ sync
- แยกสิทธิ์ read/import ออกจากการเขียนกลับ Google Sheets

## ลำดับงานก่อน ER Diagram และ migration
1. ยืนยันคำถามใน 03-data-relationships.md และ data owner ของแต่ละกลุ่ม
2. ทำ data dictionary: meaning, type, unit, nullability, code set, calendar, example, owner
3. ยืนยัน record grain ของ Delivery, lot detail, QA และ Sales Team
4. ทำ mapping table สำหรับ header/product aliases พร้อมสถานะ review
5. วาด ER Diagram โดยแสดง candidate relationships เป็นเส้นประ
6. ตรวจ diagram ด้วยตัวอย่าง duplicate/unmatched INV และ formula errors
7. เมื่อกฎผ่านการยืนยัน จึงวาง migration และ reconciliation โดยรักษา raw snapshot

## ข้อจำกัด
เป็น snapshot จาก CSV เท่านั้น ไม่ได้อ่านสูตร/metadata โดยตรง, ไม่ได้ยืนยันว่า Hidden sheet เลิกใช้งาน และไม่สามารถอนุมาน business meaning ที่ไม่มีในข้อมูลได้ งานนี้ไม่ได้สร้าง SQL หรือแก้ฐานข้อมูล
