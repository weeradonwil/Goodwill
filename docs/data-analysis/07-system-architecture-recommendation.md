# 07 — System Architecture Recommendation

## เป้าหมายและสมมติฐาน
ระบบมีผู้ใช้ประมาณ 2–3 คน ต้องการเริ่มต้นเรียบง่ายและให้ Google Sheets เป็น Source of Truth สำหรับข้อมูลธุรกิจ เอกสารนี้เป็นคำแนะนำระดับระบบ ไม่ได้สร้างฐานข้อมูลหรือแก้โค้ด

## สถาปัตยกรรมที่แนะนำ
ผู้ใช้ 2–3 คน → Browser → React Frontend → HTTPS/JSON API → FastAPI Backend → Google Sheets API
และ FastAPI Backend → SQLite บนเครื่อง Server เดียว

ใช้ Single Application แบบ modular monolith: React สำหรับ UI และ FastAPI สำหรับ API/กฎธุรกิจ/การเชื่อม Sheets โดยเริ่ม deploy เป็น application เดียวบนเครื่องหรือ host เดียวได้ ไม่ต้องแยก services

## หน้าที่ของแต่ละส่วน

### React Frontend
- แสดงหน้าจอ Inventory, Bill/Delivery, Lot และ Sales Team ตามสิทธิ์
- เรียก API ของ FastAPI เท่านั้น; ไม่มี Google service-account key หรือการเรียก Google Sheets API จาก browser
- แสดงสถานะ sync ล่าสุด, validation issues และรายการที่ต้องตรวจ

### FastAPI Backend
- เป็นจุดเดียวที่ตรวจสิทธิ์และเรียก Google Sheets API
- อ่าน worksheet, map header variants, validate และแปลงข้อมูลแบบ explicit
- ใช้กฎธุรกิจที่ยืนยันแล้ว; candidate relationships ยังไม่บังคับเป็น constraints
- จัดการ sync, error reporting, audit และกฎการเขียนกลับ Sheets
- เก็บ service-account credential นอก source control และจำกัดสิทธิ์เท่าที่จำเป็น

### SQLite ช่วงเริ่มต้น
ใช้ SQLite สำหรับบัญชีผู้ใช้/role, app settings, sync status, mapping/version, validation errors, local cache/read model จาก Sheets และ audit metadata

เมื่อ Google Sheets เป็น Source of Truth ไม่ควรให้ข้อมูลธุรกิจใน SQLite แตกต่างจาก Sheets โดยไม่มีสถานะกำกับ; ให้เก็บ source worksheet/row และ sync timestamp ประกอบทุก record ที่ mirror มา

## แนวทางการไหลของข้อมูล
1. FastAPI อ่าน Google Sheets ตาม schedule หรือเมื่อ Admin สั่ง sync
2. Backend ตรวจ header/schema, parse ค่า, เก็บ raw source/provenance และสร้าง validation report
3. ข้อมูลที่ผ่าน mapping ปรับปรุง SQLite cache; รายการผิดรูปหรือไม่รู้ mapping เข้ารายการให้ Admin ตรวจ ไม่ทิ้งเงียบ ๆ
4. React อ่านข้อมูลผ่าน FastAPI; frontend ไม่ถือ credentials ของ Google
5. เริ่มด้วย read-only import จนกว่าจะยืนยัน business rules และ write policy
6. หากต้องให้แก้จากแอป ให้เขียนกลับผ่าน FastAPI ไป Google Sheets แล้วอัปเดต cache หลังยืนยันผล; เมื่อ write ล้มเหลวให้แสดงสถานะและ reconcile อย่างชัดเจน

กำหนด single-writer policy สำหรับข้อมูลธุรกิจ เช่น แก้ผ่านแอป/Backend หรือแก้ใน Sheets แล้ว sync เข้ามา หากทั้งสองช่องทางแก้พร้อมกัน ต้องกำหนดวิธีตรวจและแก้ conflict ก่อนเปิดใช้งานจริง

## Users และ roles
เริ่มเพียง 2 roles:
- **Admin:** จัดการผู้ใช้/role, mapping, sync, validation issues และการตั้งค่าระบบ
- **Staff:** ดูและทำงานประจำตามสิทธิ์ที่อนุมัติ เช่น บันทึก/แก้ delivery หรือ lot เมื่อเปิด write workflow แล้ว

ไม่เปิด self-registration; ให้ Admin สร้างบัญชี จำกัดสิทธิ์ตาม role และบันทึก audit action ที่เปลี่ยนข้อมูลสำคัญ รายละเอียดสิทธิ์ Staff ต้องยืนยันตาม workflow ก่อนใช้งานจริง

## เหตุผลที่ SQLite เหมาะในช่วงเริ่มต้น
สำหรับ 2–3 คนและ backend instance เดียว SQLite เป็นจุดเริ่มต้นที่พอเหมาะและดูแลง่าย แนะนำให้:
- เก็บไฟล์ DB บน local disk ของ host ไม่วางบน network share
- เปิด foreign-key enforcement และใช้ transaction สำหรับการเขียน
- ทำ backup สม่ำเสมอและทดสอบ restore ก่อนใช้งานจริง
- มี backend process เดียวที่เขียน DB; อย่าเปิดหลาย app instances ที่แชร์ไฟล์ SQLite
- หาก concurrent writes สูง, ต้อง deploy หลาย backend instances หรือจำเป็นต้องมี server database ค่อยประเมิน PostgreSQL

## การ deploy และขอบเขต
- เสิร์ฟ React build ผ่าน FastAPI หรือ reverse proxy ตัวเดียวภายใต้ domain เดียว เพื่อลดการตั้งค่า CORS
- ใช้ HTTPS หากเปิดให้เข้าถึงผ่านเครือข่าย
- เริ่มด้วย scheduled/manual sync ใน backend เดียว; บันทึกผลและแจ้ง error ให้ Admin
- ยังไม่ต้องใช้ Microservices, Kubernetes, Redis หรือ distributed job queue

## ประเด็นที่ต้องยืนยันก่อนพัฒนา
1. แอปเริ่มต้น read-only หรือผู้ใช้ต้องแก้ข้อมูลผ่านแอปทันที?
2. ถ้าแก้ได้ Google Sheets ยังคงเป็น master และ Backend เขียนกลับทุกการแก้หรือไม่?
3. ผู้ใช้แก้ Google Sheets โดยตรงได้พร้อมกับแอปหรือจะใช้ single-writer?
4. รอบ sync ที่ยอมรับได้คือ manual, รายชั่วโมง หรือใกล้ real-time?
5. Staff อ่าน/แก้/อนุมัติ entity ใดได้บ้าง?
6. จะ host backend/SQLite ที่ใด และใครดูแล backup/restore?

## ลำดับนำไปใช้
1. ยืนยัน business rules และ record grain จาก 06-business-rules-investigation.md
2. ยืนยัน ownership, write policy, sync frequency และ role permissions
3. ทำ data dictionary และ mapping ของ header variants
4. ออกแบบ schema โดยไม่ตั้ง PK/FK จาก candidate fields จนกฎยืนยัน
5. ทำ prototype read-only: FastAPI sync → SQLite cache → React views พร้อมรายงาน unmatched/errors
6. ตรวจ reconciliation กับ Google Sheets ก่อนเปิด write-through
7. เพิ่ม workflow เขียนกลับและ audit หลังยืนยันกติกา conflict

## ข้อจำกัด
Google Sheets ยังเป็น Source of Truth ตามสมมติฐาน จึงต้องออกแบบ conflict handling ให้เหมาะกับการแก้ไขจากหลายช่องทาง เอกสารนี้ไม่ได้สร้าง SQLite, ER Diagram, SQL หรือแก้ Backend/Frontend

