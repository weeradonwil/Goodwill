# 08 — Data Dictionary

## ขอบเขตและวิธีอ่าน

สแกน header จาก CSV ทั้ง 464 Worksheets โดยใช้ header row และ subheader แยกกันสำหรับชีต Lot/ส่งสินค้า ซึ่งมีหัวตารางหลายแถว พบ **41 ข้อความ header ที่ไม่ซ้ำกัน** หลังตัดช่องว่างรอบข้อความ (ไม่รวมช่อง header ว่าง) และ **44 รูปแบบ header แบบหลายแถวที่มีข้อมูลจริง** เมื่อพิจารณาคู่หัวกลุ่มสินค้า + subheader; ในกลุ่ม transaction มี 22 raw header variants

CSV เก็บทุกค่าเป็นข้อความ การระบุชนิดข้อมูลด้านล่างจึงหมายถึงรูปแบบค่าที่สังเกตและชนิดที่ระบบอาจแปลงได้ ไม่ใช่ชนิดที่ประกาศใน Google Sheets ความหมายที่ไม่ปรากฏจากชื่อ header/ข้อมูลจะระบุ Candidate หรือ Unknown สถานะในตารางใช้กับ English field ที่เสนอ; หาก header แปลตรงได้แต่การเชื่อมไป entity ยังไม่ยืนยัน จะระบุสถานะแยกกัน

- Nullable: Yes หมายถึงพบช่องว่างในข้อมูลจริง; ไม่ได้แปลว่าธุรกิจอนุญาตให้เว้นว่างเสมอ
- Nullable: No observed หมายถึงไม่พบช่องว่างใน record ที่ตรวจ แต่ไม่ใช่ข้อสรุปให้ตั้ง NOT NULL
- Confirmed ยืนยันได้เฉพาะ header/รูปแบบที่เห็น ไม่ได้ยืนยันกฎธุรกิจ
- Candidate เป็นการเสนอ mapping จากชื่อ โครงสร้าง หรือตัวอย่าง ต้องให้เจ้าของระบบยืนยัน
- Unknown ยังไม่มีหลักฐานพอระบุความหมาย
- ตัวอย่างชื่อร้าน/ที่อยู่ถูกย่อหรือแทนด้วยข้อความทั่วไปเพื่อลดการเผยข้อมูลลูกค้า

ตัวอย่าง Worksheet ที่ใช้เป็นแหล่งอ้างอิง: 27/05/2568 และ 01/07/2568 (Lot/transaction), ข้อมูลทีมเซล, ข้อมูลทีมเซล V2, Lot Report Evap 2026/05/10 และ แบบฟอร์ม

## A. Header ระดับแถวและข้อมูลร้านค้า/วันที่

| Worksheet / กลุ่ม | Header ต้นฉบับ | English field ที่เสนอ | ความหมายตามหลักฐาน | รูปแบบชนิดที่พบ / ตัวอย่าง | Nullable จากข้อมูลจริง | Key / relationship candidate | สถานะ |
|---|---|---|---|---|---|---|---|
| Lot/ส่งสินค้า 460 ชีต, Lot Report, แบบฟอร์ม | ลำดับ | source_sequence | ค่าลำดับในคอลัมน์ต้นแถว | ข้อความตัวเลข เช่น 1, 2; มีแถวว่าง/ข้อความอื่นนอก record | Yes นอกแถวข้อมูล; ภายในแถวที่มี INV มักมีค่า | อาจระบุลำดับภายใน Worksheet; ไม่ unique ข้ามชีต | Candidate |
| Lot/ส่งสินค้า, Sales Team, Lot Report, แบบฟอร์ม | INV | inv_reference | รหัสที่หัวคอลัมน์เรียก INV | ตัวเลขและ alphanumeric เช่น 2504042, DIA…; ควรเก็บเป็นข้อความ | Yes ใน transaction; Legacy มี #N/A; V2 records ที่มี INV มีค่า | Join candidate ระหว่าง transaction, Sales Team และ Lot Report; ซ้ำใน transaction จึงไม่ใช่ PK ที่ยืนยัน | Candidate |
| Lot/ส่งสินค้า, Sales Team, Lot Report, แบบฟอร์ม | ชื่อร้านค้า | store_name | ข้อความชื่อร้านในแถว | ข้อความ; พบ blank, #N/A/#REF! และค่าผิดรูปบางรายการ | Yes | Relationship ไป Store candidate; ชื่อร้านไม่ใช่ key ที่เชื่อถือได้ | Confirmed ที่ header; Candidate สำหรับ Store key |
| Lot/ส่งสินค้า (253 ชีต), Lot Report, แบบฟอร์ม | วันที่↵นำจ่ายสินค้า | delivery_date_candidate | Header ระบุวันที่นำจ่ายสินค้า | date-like text เช่น 27/05/2568; พบ #N/A และข้อความอื่น | Yes; มี error และช่องว่าง | เทียบกับชื่อชีต/Legacy ตรง 337 จาก 341 comparisons แต่ยังมี 4 ค่าไม่ตรง | Candidate |
| Sales Team Legacy | วันที่ นำจ่าย | legacy_delivery_date_candidate | Header ระบุวันที่นำจ่าย | D/M/YYYY เช่น 02/05/2568; พบ #N/A 1 ค่าใน Legacy | ไม่พบ blank ใน 5,098 แถวที่มี INV; มี error sentinel | Match กับชื่อชีต 337/341 comparisons ใน 16 ชีตที่ไม่มีคอลัมน์วันที่ | Candidate |
| Sales Team V2 | วันที่ | v2_source_date | วันที่ตาม header ทั่วไป ไม่ระบุว่าเป็นวันชนิดใด | 3,080 ค่า YYYY-MM-DD และ 3,299 ค่า D/M/YYYY ใน 6,379 records | No observed blank ใน records ที่มี INV | Join กับ INV ได้ แต่วันที่ตรงกับชื่อชีตเพียง 679/3,993 comparisons; อย่ารวมกับ delivery_date | Unknown |
| Sales Team V2 | เดือน | source_month_label | ป้ายเดือนตามข้อความในชีต | ข้อความ เช่น มกราคม 2026 | No observed blank ใน 6,379 records ที่มี INV | ไม่มี key relation ที่ยืนยัน | Candidate |
| Sales Team V2 | ที่อยู่ | store_address | ข้อความที่อยู่ร้าน | ข้อความที่อยู่ (ตัวอย่างถูกย่อ) | Yes; ว่าง 11 จาก 6,379 records ที่มี INV | Candidate attribute ของ Store; ไม่มี Store ID ใน header | Confirmed ที่ header; Candidate สำหรับ Store relation |
| Sales Team V2 | จังหวัด | province_name | ชื่อจังหวัดตาม header | ข้อความ เช่น กรุงเทพ, ระยอง | Yes; ว่าง 14 จาก 6,379 records ที่มี INV | Candidate attribute ของ Store | Confirmed ที่ header; Candidate สำหรับ Store relation |
| Sales Team V2 | อำเภอ/เขต | district_or_area_name | พื้นที่ระดับอำเภอ/เขตตาม header | ข้อความ เช่น เขตปทุมวัน; พบ #N/A 62 ค่า | Yes; ว่าง 5 จาก 6,379 records ที่มี INV | Candidate attribute ของ Store | Candidate |
| Sales Team V2 | ไม่มีชื่อ header, คอลัมน์ 1 และ 5 | v2_unlabelled_column_1 / v2_unlabelled_column_5 | ไม่มีชื่อใน header; อาจเป็น spacer หรือ field ที่ไม่ตั้งชื่อ | ส่วนใหญ่/ทั้งหมดว่างในตัวอย่างที่ตรวจ; ต้องยืนยันจากค่าทั้งสองคอลัมน์ | Yes / ไม่มีข้อมูลให้ infer type | ยังไม่เสนอ relationship | Unknown |
| Sales Team V2 | 0 | v2_field_0_unknown | Header เป็นอักขระ 0; ความหมายไม่ทราบ | ตัวเลขข้อความ เช่น 100, 214; ว่าง 5 จาก 6,379 records | Yes | ห้ามอนุมานว่าเป็นยอดรวม/จำนวนใด | Unknown |

หมายเหตุ: หัววันที่ใน transaction มี raw line break ระหว่างคำว่า วันที่ กับ นำจ่ายสินค้า; แสดงเป็น ↵ ในตารางเพื่อให้เห็นการขึ้นบรรทัด ไม่ได้ลบความต่างของ header นี้

## B. Header กลุ่มสินค้าใน Lot/ส่งสินค้าและ Lot Report

ชื่อด้านล่างเป็นหัวกลุ่มของคอลัมน์ ไม่ใช่ค่าข้อมูลในแต่ละแถว จึงเก็บเป็น product label ต้นฉบับก่อน อย่ารวมชื่อคล้ายกันจนกว่าเจ้าของระบบจะยืนยันรหัสสินค้า

| Worksheet / กลุ่ม | Header ต้นฉบับ | English field ที่เสนอ | ชนิด/ตัวอย่าง | Nullable | Candidate relationship | สถานะ |
|---|---|---|---|---|---|---|
| Lot/ส่งสินค้า, Lot Report, แบบฟอร์ม | NDC 2KG | product_label_raw | ค่าคงที่ใน header; NDC 2KG | N/A — เป็น header | Candidate ไป Product master | Candidate |
| Lot/ส่งสินค้า, Lot Report | EVM (หัวกลุ่มสินค้า) | product_label_raw | ค่าคงที่ใน header; แยกจาก EVM ใน Sales Team V2 ซึ่งเป็นปริมาณ | N/A | Candidate ไป Product master | Candidate |
| Lot/ส่งสินค้า | UHT (หัวกลุ่มสินค้า) | product_label_raw | ค่าคงที่ใน header; แยกจาก UHT ใน Sales Team V2 ซึ่งเป็นปริมาณ | N/A | Candidate ไป Product master | Candidate |
| Lot/ส่งสินค้า | NDC 400G | product_label_raw | ค่าคงที่ใน header | N/A | Candidate ไป Product master | Candidate |
| Lot/ส่งสินค้า | 400กรัม | product_label_raw | ค่าคงที่ใน header; สะกดคนละแบบกับกลุ่ม 400G | N/A | ห้ามรวมกับ NDC 400G โดยอัตโนมัติ | Candidate |
| Lot/ส่งสินค้า, Lot Report | Creamix | product_label_raw | ค่าคงที่ใน header | N/A | Candidate ไป Product master | Candidate |
| Lot/ส่งสินค้า | Cream mix | product_label_raw | ค่าคงที่ใน header; เว้นวรรคต่าง | N/A | ห้ามรวมกับ Creamix โดยอัตโนมัติ | Candidate |
| Lot/ส่งสินค้า | CREAM MIX | product_label_raw | ค่าคงที่ใน header; ตัวพิมพ์ต่าง | N/A | ห้ามรวมกับ Creamix โดยอัตโนมัติ | Candidate |
| Lot/ส่งสินค้า | NDC 400 G. | product_label_raw | ค่าคงที่ใน header; เว้นวรรค/จุดต่าง | N/A | ห้ามรวมกับ NDC 400G โดยอัตโนมัติ | Candidate |

## C. Subheader ที่เป็นคุณลักษณะของสินค้า

คอลัมน์เหล่านี้เกิดซ้ำใต้หัวกลุ่มสินค้าในหลาย Worksheets ช่องหัวกลุ่มที่ว่างใน CSV อาจเป็นส่วนต่อของกลุ่มก่อนหน้า แต่ mapping ของ product-to-column ต้องอาศัยตำแหน่งใน header สองแถวและยังต้องตรวจเมื่อมี layout ใหม่

| Worksheet / กลุ่ม | Header ต้นฉบับ | English field ที่เสนอ | ชนิด/ตัวอย่างจริง | Nullable จากข้อมูลจริง | Key / relationship candidate | สถานะ |
|---|---|---|---|---|---|---|
| Lot/ส่งสินค้า, Lot Report, Form | BBF | bbf_value_raw | ข้อความ date-like เช่น 2026/05/15; ยังพบ text ที่ parse เป็นวันที่ไม่ได้ เช่น 2025/21/22 | Yes; ว่างจำนวนมากใน product blocks | Candidate เป็น lot/best-before attribute แต่ความหมาย BBF ยังต้องยืนยัน | Candidate |
| Lot/ส่งสินค้า, Lot Report, Form | NO.Pallet | pallet_number_raw | ตัวเลขข้อความ เช่น 46; พบข้อความที่ไม่ใช่ตัวเลขด้วย | Yes; ว่างจำนวนมาก | อาจระบุ pallet หรือเลขอ้างอิง pallet; ไม่ใช่ key ที่ยืนยัน | Candidate |
| Lot/ส่งสินค้า, Lot Report, Form | จำนวน (ลัง) | quantity_cartons_candidate | ตัวเลขข้อความ เช่น 60; มีข้อความ/แถวสรุป | Yes; ว่างจำนวนมาก | รายละเอียดจำนวนของ product group; ตรวจ grain/unit ก่อน | Candidate |
| บาง transaction layouts | จำนวน | quantity_unknown_unit | ตัวเลขข้อความ เช่น 62, 70; header ไม่มีหน่วย | Yes | อย่ารวมกับ จำนวน (ลัง) จนกว่าจะยืนยันหน่วย | Unknown |

## D. Header ตรวจสอบ/QA

พบในประมาณ 101–104 Worksheets ตาม header แต่หลายคอลัมน์ว่างทั้งหมดในข้อมูลที่ export และบางค่ามีชนิดไม่เข้ากับข้อความ header

| Worksheet / กลุ่ม | Header ต้นฉบับ | English field ที่เสนอ | ชนิด/ตัวอย่างจริง | Nullable | Candidate relationship | สถานะ |
|---|---|---|---|---|---|---|
| Lot/ส่งสินค้า, Lot Report | จำนวนชั้นในการซ้อน↵(ไม่เกิน 6 ชั้น) | stacking_check_value | พบ TRUE และตัวเลข 4 ค่า; ไม่ใช่ชนิดตัวเลขล้วนตามชื่อ header | Yes | QA อาจผูกกับ shipment/pallet; grain ยังไม่ยืนยัน | Unknown |
| Lot/ส่งสินค้า, Lot Report | มีแผ่นไม้กั้นระหว่างชั้น↵(Yes/No) | wood_divider_check | พบ TRUE และตัวเลข 4 ค่า | Yes | QA candidate; ต้องตรวจค่าที่ไม่ใช่ boolean | Candidate |
| Lot/ส่งสินค้า, Lot Report | สภาพกล่องสมบูรณ์↵(Yes/No) | box_condition_check | TRUE/FALSE เป็นข้อความ boolean | Yes | QA candidate | Candidate |
| Lot/ส่งสินค้า, Lot Report | พาเลทอยู่ในสภาพดี↵(Yes/No) | pallet_condition_check | TRUE/FALSE เป็นข้อความ boolean | Yes | QA candidate | Candidate |
| Lot/ส่งสินค้า, Lot Report | การขนส่งปลอดการกระแทก↵(Yes/No) | safe_transport_check | TRUE/FALSE เป็นข้อความ boolean | Yes | QA candidate | Candidate |
| Lot/ส่งสินค้า, Lot Report | ผู้ตรวจสอบ | inspector_name_raw | ไม่พบค่าที่กรอกในข้อมูลที่ scan; type ยังสรุปไม่ได้ | Yes; ว่างทั้งหมดใน export ที่ตรวจ | อาจเป็นผู้ใช้/พนักงาน แต่ไม่มีข้อมูลยืนยัน | Unknown |
| Lot/ส่งสินค้า, Lot Report | หมายเหตุ | inspection_remark_raw | ไม่พบค่าที่กรอกในข้อมูลที่ scan; type ยังสรุปไม่ได้ | Yes; ว่างทั้งหมดใน export ที่ตรวจ | อาจเป็น QA note แต่ต้องยืนยัน | Candidate |

## E. Sales Team V2 — ปริมาณรายสินค้า

ค่าเป็นตัวเลขข้อความใน CSV มีช่องว่างจำนวนมาก ไม่ได้สรุปว่าช่องว่างเท่ากับ 0 ผลทดสอบ Free + จำนวนปกติ = TOTAL ตรงทุกกรณีที่มีตัวเลขครบ แต่ยังต้องยืนยันความหมายและสูตร

| Worksheet | Header ต้นฉบับ | English field ที่เสนอ | ชนิด/ตัวอย่าง | Nullable ใน 6,379 rows ที่มี INV | Candidate relationship | สถานะ |
|---|---|---|---|---|---|---|
| ข้อมูลทีมเซล V2 | Free 2KG | free_quantity + product label 2KG | numeric text เช่น 28 | Yes; ว่าง 4,532 | Candidate quantity ของ product 2KG | Candidate |
| ข้อมูลทีมเซล V2 | 2KG | regular_quantity + product label 2KG | numeric text เช่น 4, 10 | Yes; ว่าง 3,228 | Candidate quantity ของ product 2KG | Candidate |
| ข้อมูลทีมเซล V2 | TOTAL 2KG | total_quantity + product label 2KG | numeric text เช่น 0 | Yes; ว่าง 4,885 | สมการตรวจได้ แต่สูตร/blank policy ต้องยืนยัน | Candidate |
| ข้อมูลทีมเซล V2 | Free EVM | free_quantity + product label EVM | numeric text เช่น 14 | Yes; ว่าง 4,513 | Candidate quantity ของ product EVM | Candidate |
| ข้อมูลทีมเซล V2 | EVM (คอลัมน์ปริมาณ) | regular_quantity + product label EVM | numeric text เช่น 100, 170 | Yes; ว่าง 3,057 | แยกจาก EVM ที่เป็นหัวกลุ่ม Lot | Candidate |
| ข้อมูลทีมเซล V2 | TOTAL EVM | total_quantity + product label EVM | numeric text เช่น 100 | Yes; ว่าง 4,885 | สมการตรวจได้ แต่สูตร/blank policy ต้องยืนยัน | Candidate |
| ข้อมูลทีมเซล V2 | Free UHT | free_quantity + product label UHT | numeric text เช่น 14 | Yes; ว่าง 6,258 | Candidate quantity ของ product UHT | Candidate |
| ข้อมูลทีมเซล V2 | UHT (คอลัมน์ปริมาณ) | regular_quantity + product label UHT | numeric text เช่น 200, 30 | Yes; ว่าง 5,630 | แยกจาก UHT ที่เป็นหัวกลุ่ม Lot | Candidate |
| ข้อมูลทีมเซล V2 | TOTAL UHT | total_quantity + product label UHT | numeric text เช่น 0 | Yes; ว่าง 4,885 | สมการตรวจได้ แต่สูตร/blank policy ต้องยืนยัน | Candidate |
| ข้อมูลทีมเซล V2 | Free 400G | free_quantity + product label 400G | numeric text/ข้อความ; พบช่องว่างเกือบทั้งหมด | Yes; ว่าง 6,376 | Product alias ยังไม่ยืนยัน | Candidate |
| ข้อมูลทีมเซล V2 | 400G | regular_quantity + product label 400G | numeric text เช่น 200 | Yes; ว่าง 6,374 | แยกจากกลุ่ม 400 กรัม/NDC 400G จนยืนยัน SKU | Candidate |
| ข้อมูลทีมเซล V2 | TOTAL 400G | total_quantity + product label 400G | numeric text เช่น 0 | Yes; ว่าง 4,885 | สมการตรวจได้ แต่สูตร/blank policy ต้องยืนยัน | Candidate |

## F. ข้อควรระวังเรื่องค่าและชนิดข้อมูล

- #N/A (7,793 ค่า) และ #REF! (46 ค่า) เป็นค่า error จากการ export สูตร ไม่ใช่ค่าปกติของ field; พบรวม 7,839 ค่าใน 364 CSVs
- วันที่ต้องเก็บ raw value และแยกแหล่ง/ความหมายก่อน normalize; ตัวอย่างมี D/M/YYYY, YYYY-MM-DD, YYYY/MM/DD และ error
- INV ต้องเก็บเป็น text แม้บางค่าเป็นตัวเลข เพื่อรักษา alphanumeric และไม่ให้ระบบแปลงรหัส
- quantity/pallet เป็นข้อความในไฟล์; มีค่าว่างและข้อความที่แปลงเป็นตัวเลขไม่ได้
- จำนวน และ จำนวน (ลัง) เป็น raw headers คนละชื่อและยังไม่รวม field
- ช่องที่ไม่มี header ใน V2 และ header 0 แยกเก็บเป็น unmapped จนกว่าจะทราบความหมาย

## G. Candidate fields กลางที่เสนอ (27 fields)

ชื่อเหล่านี้เป็นข้อเสนอสำหรับ data dictionary/schema discussion เท่านั้น ไม่ใช่การยืนยันให้สร้างทุก field:
1. source_sequence
2. delivery_date_candidate
3. v2_source_date
4. inv_reference
5. store_name
6. store_address
7. province_name
8. district_or_area_name
9. source_month_label
10. product_label_raw
11. bbf_value_raw
12. pallet_number_raw
13. quantity_cartons_candidate
14. quantity_unknown_unit
15. stacking_check_value
16. wood_divider_check
17. box_condition_check
18. pallet_condition_check
19. safe_transport_check
20. inspector_name_raw
21. inspection_remark_raw
22. free_quantity
23. regular_quantity
24. total_quantity
25. v2_field_0_unknown
26. v2_unlabelled_column_1
27. v2_unlabelled_column_5

## H. Candidate Entity preparation

| Candidate entity | ข้อมูลที่อาจอยู่ในกลุ่มนี้ | สถานะ/สิ่งที่ต้องยืนยัน |
|---|---|---|
| Transaction / Delivery | source sequence, วันที่, INV, ร้านค้า, source worksheet | ต้องยืนยันว่า row grain คือ shipment, invoice หรือ delivery ต่อร้าน |
| INV / document reference | เก็บ INV แบบข้อความเป็น business identifier | ยังไม่ใช่ entity/PK ที่ยืนยัน; ต้องถามว่า Bill เป็นเลขเดียวกันหรือไม่ |
| Delivery detail / Lot allocation | product label, BBF, pallet, quantity | ควรพิจารณาแยกจากหัวรายการ ถ้ายืนยันว่าหนึ่ง transaction มีหลาย lot/product |
| Product | raw product labels | Reference candidate; ต้องยืนยัน SKU/alias ก่อนรวมชื่อ |
| Store | ชื่อร้าน, ที่อยู่, จังหวัด, อำเภอ/เขต | Reference candidate; ต้องถาม Store ID และประวัติข้อมูลร้าน |
| Sales Team | INV, เดือน/วันที่, Free/regular/total quantities | ยังไม่ทราบว่าเป็นยอดขาย, order, delivery หรือ report |
| Lot Report | report lines และ QA | อาจเป็น report/projection ไม่จำเป็นต้องเป็น entity แยก |
| Inspection / QA | flags, inspector, remark | แยกตารางเมื่อยืนยันว่าเป็น event ต่อ delivery/pallet และ grain |
| Source provenance | Worksheet, source row, export/sync batch | แนะนำให้เก็บเพื่อ trace-back; ไม่ใช่ business entity |

ยังไม่สร้าง ER Diagram, SQL หรือ Database ในขั้นตอนนี้
