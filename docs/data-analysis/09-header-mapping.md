# 09 — Header Mapping

## ขอบเขตและหลักการ Mapping
วิเคราะห์ header จาก CSV ทั้ง 464 Worksheets พร้อมหัวตารางหลายแถวของ 460 Lot/transaction sheets, Lot Report และแบบฟอร์ม

พบ 41 raw header labels ที่ไม่ซ้ำกัน (ไม่นับ header ว่าง), 44 composite header signatures ที่มีข้อมูลจริง และ 22 raw header variants ใน transaction group. Sales Team V2 มี 22 คอลัมน์ โดย 20 มีชื่อ header และ 2 ช่องไม่มีชื่อ

ตารางนี้แยก Exact header mapping (ข้อความเหมือนกันในบริบทเดียวกัน), Candidate mapping (ข้อมูลคล้ายแต่ชื่อ/unit/ความหมายยังไม่ยืนยัน), และ Unknown/unmapped (ไม่มีหลักฐานให้ตั้งความหมาย) การเสนอ canonical field ไม่ยืนยันกฎธุรกิจหรือสร้าง Primary/Foreign Key

## 1. Header ที่ตรงกัน

| Raw header / structure | Source Worksheets | ตัวอย่าง | Field กลางที่เสนอ | สถานะ/ข้อจำกัด |
|---|---|---|---|---|
| INV | กลุ่มธุรกรรม, Sales Team Legacy/V2, Lot Report, แบบฟอร์ม | 2504042, DIA… | inv_reference | Header mapping ตรงกัน; ค่าเป็นตัวเลขและ alphanumeric; join เป็น Candidate, ไม่ใช่ PK |
| ชื่อร้านค้า | Transaction, Sales Team, Lot Report, Form | ข้อความชื่อร้าน (ย่อ) | store_name | Exact header; ยังไม่มี store identifier |
| ลำดับ | Transaction, Lot Report, Form | 1, 2 | source_sequence | Exact header แต่เป็นลำดับในแหล่ง ไม่ unique ข้ามชีต |
| BBF | subheader ใน product blocks | 2026/05/15 | bbf_value_raw | Exact subheader เมื่ออยู่ใต้ product group; ความหมายคำย่อและ date policy ยังต้องยืนยัน |
| NO.Pallet | subheader ใน product blocks | 46 | pallet_number_raw | Exact subheader; อาจเป็นเลข/ตัวระบุ pallet ต้องยืนยัน |
| จำนวน (ลัง) | subheader ใน product blocks | 60 | quantity_cartons_candidate | Exact header; ตัวเลขเป็นข้อความและมีแถวสรุป/ค่าผิดรูป |
| QA header เดียวกัน | ประมาณ 101–104 Lot/transaction sheets และ Lot Report | TRUE, FALSE, blank | QA fields ตาม header เดิม | mapping ตามข้อความทำได้ แต่ชนิดค่าบางช่องและ grain ของ QA ต้องตรวจ |

ตัวอย่าง Worksheet: 27/05/2568, 01/07/2568, แบบฟอร์ม, Lot Report Evap 2026/05/10, ข้อมูลทีมเซล และข้อมูลทีมเซล V2

## 2. Header ต่างชื่อที่ข้อมูลดูคล้ายกัน

| Header ต้นฉบับ | Source Worksheet | ตัวอย่าง/ลักษณะข้อมูล | Field กลางที่เสนอ | สถานะ |
|---|---|---|---|---|
| วันที่↵นำจ่ายสินค้า | daily Lot sheets ที่มี date column | D/M/YYYY, #N/A | delivery_date_candidate | Candidate จากคำ header และค่าที่พบ |
| วันที่ นำจ่าย | ข้อมูลทีมเซล (Legacy) | D/M/YYYY; เทียบกับชื่อชีตตรง 337/341 row comparisons | delivery_date_candidate | Candidate; มี 4 รายการไม่ตรง |
| วันที่ | ข้อมูลทีมเซล V2 | 3,080 YYYY-MM-DD และ 3,299 D/M/YYYY | v2_source_date | แยก field จนทราบว่าเป็นวันขาย/order/ส่ง |
| จำนวน (ลัง) | Lot product blocks | ตัวเลข/ข้อความ เช่น 60 | quantity_cartons_candidate | มีหน่วยระบุใน header |
| จำนวน | บาง Lot layouts | ตัวเลข/ข้อความ เช่น 62 | quantity_unknown_unit | แยกจาก จำนวน (ลัง) เพราะหน่วยไม่ปรากฏ |
| NDC 400G / 400กรัม / NDC 400 G. / 400G | Transaction, V2 | header group หรือค่าปริมาณ | product_label_raw + product context | Similar labels; ห้ามรวม Product เดียวจนยืนยัน |
| Creamix / Cream mix / CREAM MIX | Transaction | ต่างตัวพิมพ์/เว้นวรรค | product_label_raw | ห้าม normalize alias อัตโนมัติ |
| Free 2KG / 2KG / TOTAL 2KG | V2 | Free, regular, total ของกลุ่ม 2KG | free_quantity / regular_quantity / total_quantity + product label | โครงสร้าง header สนับสนุน mapping; ความหมาย/unit เป็น Candidate |
| Free EVM / EVM / TOTAL EVM | V2 | numeric text; EVM ยังเป็นหัวกลุ่มสินค้าใน Lot | free_quantity / regular_quantity / total_quantity + product label | แยก EVM column ใน V2 จาก EVM group header |
| Free UHT / UHT / TOTAL UHT | V2 | numeric text; UHT ยังเป็นหัวกลุ่มสินค้าใน Lot | free_quantity / regular_quantity / total_quantity + product label | แยก UHT column ใน V2 จาก UHT group header |
| Free 400G / 400G / TOTAL 400G | V2 | mostly blank numeric columns | free_quantity / regular_quantity / total_quantity + product label | Alias และ unit ยังต้องยืนยัน |

## 3. Header เดียวกันที่ต้องแยกตามบริบท/ชนิดข้อมูล

| Raw header | บริบท A | บริบท B | การจัดการที่แนะนำ |
|---|---|---|---|
| EVM | หัวกลุ่ม product ใน Lot; ตามด้วย BBF/pallet/quantity fields | คอลัมน์ปริมาณ EVM ใน Sales Team V2 | บันทึก group label ใน Lot และ quantity field ใน V2 แยกกัน |
| UHT | หัวกลุ่ม product ใน Lot | คอลัมน์ปริมาณ UHT ใน V2 | แยกตาม context |
| 2KG / NDC 2KG | 2KG เป็น V2 quantity header; NDC 2KG เป็น Lot product group header | label ใกล้กันแต่ไม่ใช่ข้อความ/ตำแหน่งเดียวกัน | เก็บ raw label; mapping SKU รอผู้ใช้ยืนยัน |
| INV | มีทั้งตัวเลขล้วนและ alphanumeric | พบ blank/placeholder ใน transaction และ error sentinel บาง source | เก็บเป็น text; อย่าบังคับเลขหรือ unique |
| date fields | D/M/YYYY พ.ศ., D/M/YYYY และ ISO/slash date-like strings | ความหมายต่างตาม header และ source | เก็บ raw source + source type; parse หลังยืนยัน calendar/meaning |
| ชื่อร้านค้า | ข้อความ, blank, #N/A/#REF!, numeric-like anomaly | header เดียวกันแต่คุณภาพค่าไม่เหมือนกัน | common text field candidate; เก็บ error/status แยก |

## 4. Product group labels ที่ต้องเก็บแยกก่อน

| Raw product header | Representative Worksheet | ตัวอย่างข้อมูลประกอบ | Mapping |
|---|---|---|---|
| NDC 2KG | 27/05/2568 | subheader BBF มี date-like เช่น 2026/05/15 | product_label_raw; ไม่ alias โดยอัตโนมัติ |
| EVM | Lot transaction / Lot Report | ตามด้วย BBF, pallet, quantity | product_label_raw; แยกจาก Sales Team V2 field EVM |
| UHT | Lot transaction | ตามด้วย BBF/pallet/quantity | product_label_raw; แยกจาก V2 |
| NDC 400G | Transaction | BBF/quantity fields | คง raw label |
| 400กรัม | Transaction | BBF field | คง raw label แยกจาก NDC 400G |
| NDC 400 G. | Transaction | BBF field; พบจำนวนน้อย | คง raw label |
| Creamix | Transaction, Lot Report | BBF field | คง raw label |
| Cream mix | Transaction | BBF field | คง raw label แยกจาก Creamix |
| CREAM MIX | Transaction | BBF field | คง raw label แยกจาก Creamix |

## 5. Sales Team V2 fields และ field ที่ยัง map ไม่ได้

| Header ต้นฉบับ | Source Worksheet | Field กลางที่เสนอ | ตัวอย่าง/คุณภาพค่า | Mapping |
|---|---|---|---|---|
| เดือน | ข้อมูลทีมเซล V2 | source_month_label | มกราคม 2026 | Candidate; เป็น label ไม่ใช่วันที่ normalized |
| ที่อยู่ | ข้อมูลทีมเซล V2 | store_address | text; ว่าง 11 records | Candidate Store attribute |
| จังหวัด | ข้อมูลทีมเซล V2 | province_name | กรุงเทพ, ระยอง; ว่าง 14 | Candidate Store attribute |
| อำเภอ/เขต | ข้อมูลทีมเซล V2 | district_or_area_name | text และ #N/A; ว่าง 5, error 62 | Candidate Store attribute |
| 0 | ข้อมูลทีมเซล V2 | v2_field_0_unknown | ตัวเลขข้อความ เช่น 100; ว่าง 5 | Unknown |
| Header ว่าง column 1 | ข้อมูลทีมเซล V2 | v2_unlabelled_column_1 | ไม่มีชื่อ; ห้ามสร้างความหมาย | Unmapped |
| Header ว่าง column 5 | ข้อมูลทีมเซล V2 | v2_unlabelled_column_5 | ไม่มีชื่อ; อาจเป็น spacer แต่ต้องยืนยัน | Unmapped |

V2 มี 22 columns รวม 2 ช่องไม่มีชื่อ; ส่วน header ที่ไม่ว่าง 20 ช่องรวม 0

## 6. Header mapping ที่เสนอเข้าฟิลด์กลาง

มี 27 field names ในรายการกลางเพื่อ discussion:
- Source/document: source_sequence, inv_reference, delivery_date_candidate, v2_source_date, source_month_label
- Store: store_name, store_address, province_name, district_or_area_name
- Product/lot detail: product_label_raw, bbf_value_raw, pallet_number_raw, quantity_cartons_candidate, quantity_unknown_unit
- Sales metric: free_quantity, regular_quantity, total_quantity
- QA: stacking_check_value, wood_divider_check, box_condition_check, pallet_condition_check, safe_transport_check, inspector_name_raw, inspection_remark_raw
- Unknown/unmapped: v2_field_0_unknown, v2_unlabelled_column_1, v2_unlabelled_column_5

จำนวนนี้นับชื่อ field ที่เสนอ ไม่ได้หมายถึงจำนวนตารางหรือ schema ที่อนุมัติแล้ว การ map field ที่คล้ายกันเป็น Candidate จนกว่าจะผ่าน data-owner review

## 7. Candidate entity grouping สำหรับเตรียมออกแบบ

| Entity candidate | แนะนำให้จัดข้อมูล | สถานะ |
|---|---|---|
| Transaction/Delivery | source sequence, วันที่, INV reference, ร้าน, source worksheet | Candidate; ต้องยืนยันว่า row คือ shipment, bill หรือ delivery ต่อร้าน |
| Delivery detail / lot allocation | Product label, BBF, pallet, quantity | Candidate; อาจแยกจาก header หากหนึ่ง transaction มีหลาย lot/product |
| Product reference | raw product labels และรหัส SKU หลังผู้ใช้ยืนยัน | Reference candidate; ยังไม่รวม alias |
| Store | ชื่อ, address, province, district | Reference candidate; ต้องมี/ยืนยัน Store ID |
| Sales Team record/metrics | INV, month/date, Free/regular/total quantities | Candidate; grain/meaning และ V2 vs Legacy ยังไม่ชัด |
| Lot Report / inspection | Lot Report lines และ QA fields | อาจเป็น report/projection ไม่จำเป็นต้องเป็น entity แยก |
| Source provenance | Worksheet, source row, export/sync batch | ควรเก็บเพื่อ trace-back แต่ไม่ใช่ business entity |

## 8. คำถามก่อนยืนยัน mapping
1. INV คือเลขอ้างอิงเอกสารชนิดใด และสัมพันธ์กับ Bill อย่างไร?
2. BBF ย่อมาจากอะไร และวันที่บน field นี้ใช้ format/calendar ใด?
3. NO.Pallet คือเลข pallet หรือจำนวน pallet?
4. จำนวน (ลัง) กับ จำนวน เป็นหน่วยเดียวกันหรือไม่?
5. ชื่อสินค้าแต่ละรูปแบบเป็น SKU เดียวกันหรือไม่?
6. วันที่ใน Legacy/V2 หมายถึง event ใด?
7. Free/TOTAL และค่าว่างมีความหมายอย่างไร?
8. QA header ที่มี TRUE ใต้หัวข้อจำนวนชั้น และช่อง Inspector/หมายเหตุที่ว่างทั้งหมด เป็นข้อมูลที่ถูกต้องหรือไม่?
9. คอลัมน์ 0 และ 2 header ว่างใน V2 หมายถึงอะไร?

ยังไม่สร้าง ER Diagram, SQL, Database หรือแก้ไข CSV, Google Sheets, Backend และ Frontend
