# 03 — ความสัมพันธ์ของข้อมูลและ Candidate Keys

## สรุปสถานะหลักฐาน
การ match ด้วยรหัสเป็นหลักฐานว่า export มีค่าตรงกัน แต่ยังต้องยืนยันความหมายทางธุรกิจและ cardinality ก่อนสร้าง constraints

## ความสัมพันธ์ที่ยืนยันได้จากข้อมูล
1. **INV ใน transaction กับ Sales Team**
   - Transaction sheets มีแถวที่ขึ้นต้นด้วยเลขลำดับ 12,828 แถว
   - พบ 6,312 ค่า INV แบบตัวเลข และ 2,752 ค่าแบบ alphanumeric ในแถวที่ INV ไม่ว่างและไม่ใช่เครื่องหมายขีด
   - INV ที่ใช้ได้ 9,064 occurrences มี 8,697 ค่าไม่ซ้ำ; 298 ค่า INV ปรากฏซ้ำ รวม 367 occurrences ส่วนเกิน
   - 4,315 ค่า INV ใน Sales Team legacy และ 5,068 ค่าใน Sales Team V2 อยู่ในชุด INV ของ transaction ด้วย
   - ยืนยันได้ว่ามีค่ารหัส INV ทับซ้อนกัน แต่ยังไม่ยืนยันว่า INV unique ทั้งระบบหรือทุก transaction ต้องมี Sales Team row

2. **Lot Report กับ transaction**
   - ตรวจซ้ำทั้งชีตพบ INV 25 ค่าไม่ซ้ำ; 24 ค่าอยู่ในชุด INV ของ transaction sheets และ 1 ค่า (SG002500518) ไม่พบใน transaction export
   - มี 23 ค่า match กับ Sales Team legacy และไม่มีค่าใด match กับ V2 ใน snapshot นี้
   - ใน Lot Report มีแถวเริ่ม invoice 25 แถว และมี 58 แถวต่อเนื่องที่มีข้อมูลสินค้าแต่ช่อง INV ว่าง; จึงไม่ควรนับทุกแถวเป็น invoice

3. **Sales Team legacy กับ V2**
   - พบ INV ตรงกัน 1,561 ค่า
   - ยืนยันได้ว่ามี record overlap แต่ยังไม่ทราบว่า V2 แทน legacy หรือมีวัตถุประสงค์คนละแบบ

## Candidate Keys

| Entity ที่อาจเป็น | Candidate | หลักฐาน/ข้อจำกัด |
|---|---|---|
| Invoice/ใบส่งสินค้า | INV | เชื่อมข้ามกลุ่มได้หลายกรณี แต่ซ้ำใน transaction และปรากฏหลายชีต; ยังไม่ใช่ PK ที่ยืนยัน |
| แถวต้นทางใน export | Worksheet/ไฟล์ + เลขแถว CSV | ระบุต้นทางใน snapshot ได้ แต่เปลี่ยนเมื่อ export/เรียงแถวใหม่ เหมาะเป็น provenance ชั่วคราว |
| แถวสินค้า/lot | INV + product + BBF + pallet/sequence | เป็นเพียง candidate; มีช่องว่าง, layout ต่างกัน, total rows และหลาย lot/pallet |
| ร้านค้า | ชื่อร้านค้า | ไม่ unique; สะกดต่างกันและบางค่าหาย/เป็น formula error |
| Sales Team V2 row | INV | Unique ใน V2 snapshot (6,379 ค่า) แต่ยังไม่ยืนยันข้อกำหนดในระยะยาว |

## ความสัมพันธ์ที่เป็นข้อสันนิษฐาน
- Transaction → Sales Team: มี INV match จำนวนมาก แต่ cardinality อาจเป็น 1:1, 1:many หรือมีประวัติ/รายการซ้ำ
- Transaction → Lot Report: 24/25 INV match แต่ไม่ทราบว่า report เป็น snapshot, รายงานเฉพาะสินค้า หรือข้อมูลจากแหล่งแยก
- Transaction → Store: มีชื่อร้านค้าและ V2 มีที่อยู่/จังหวัด/อำเภอ แต่ชื่อเป็น weak join; ควรมี Store ID
- Product columns → Product master: label ที่คล้ายกันอาจเป็น alias ต้องยืนยัน SKU
- ชื่อ Worksheet → วันที่ธุรกรรม: 207 ชีตไม่มีวันที่ใน header; ชื่อบางชีตไม่ใช่วันที่มาตรฐาน

## คำถามที่ต้องยืนยัน
1. INV unique ทั้งระบบหรือไม่? ถ้าซ้ำคือ split delivery, corrected/re-exported data หรือ duplicate?
2. Sales Team V2 เป็นข้อมูลล่าสุดแทน legacy หรือเก็บคนละวัตถุประสงค์?
3. วันที่ของ 207 ชีตที่ไม่มีคอลัมน์ ใช้ชื่อ Worksheet ได้หรือไม่? 31/07/259 และ ชีต467 หมายถึงอะไร?
4. Lot Report เป็นข้อมูลคำนวณจาก transaction, snapshot หรือแหล่ง lot แยก?
5. Free/ยอดสินค้าใน V2 เกี่ยวกับจำนวนส่งอย่างไร? TOTAL เป็น formula/subtotal หรือยอดยืนยัน?
6. มี Store ID จากระบบต้นทางหรือไม่ และจัดการร้านเปลี่ยนชื่ออย่างไร?
