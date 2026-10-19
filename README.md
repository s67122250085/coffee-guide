# Coffee Guide

เว็บแอป React สำหรับเรียนรู้สายพันธุ์กาแฟและสำรวจเมนู ผ่านหน้าเล่าเรื่องที่มีแอนิเมชันตามการเลื่อน รองรับคอมพิวเตอร์ แท็บเล็ต และมือถือ ข้อมูลเดิมมีสายพันธุ์ 10 รายการและเมนู 20 รายการ

## เปิดเว็บในเครื่อง

```bash
npm install
npm run dev
```

เปิด URL ที่ Vite แสดงใน Terminal สร้างไฟล์สำหรับ production ด้วย `npm run build` และตรวจ bundle ด้วย `npm run preview`

## หน้าและไฟล์หลัก

| Route | เนื้อหา | ไฟล์หลัก |
|---|---|---|
| `/` | Home และทางไปหน้าสำรวจ | `src/pages/HomePage.jsx` |
| `/varieties` | สายพันธุ์กาแฟ ค้นหาได้ | `src/pages/CatalogPage.jsx` |
| `/coffee-menu` | เมนูกาแฟ ค้นหาได้ | `src/pages/CatalogPage.jsx` |

คอมโพเนนต์ที่ใช้ร่วมกันอยู่ใน `src/components/` แอนิเมชันหน้าเปิดอยู่ใน `Introduction.jsx` ส่วนการ reveal รายการและเปลี่ยนภาพระหว่างเลื่อนอยู่ใน `CatalogPage.jsx` สไตล์หลักอยู่ใน `styles.css` และ responsive/สถานะเฉพาะแอปอยู่ใน `src/app.css`

## ข้อมูลกาแฟ

ไฟล์ `data/data.js` เก็บชุดข้อมูลเดิม ส่วน React ใช้ `data/coffee.json` ซึ่งเตรียมสำหรับ import เข้า Firebase Realtime Database ที่ root และ `public/coffee.json` เป็นสำเนาที่ให้บริการเป็น static file โครงสร้างหลักคือ `Coffee_Varietals` และ `Coffee_Menu` ให้ใช้ไฟล์ JSON ฉบับเต็มในการ import

## ตั้งค่า Firebase

1. สร้าง Firebase Project, ลงทะเบียน Web App และสร้าง Realtime Database
2. Import ข้อมูลจาก `data/coffee.json` ที่ root ของ Realtime Database
3. คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ค่า Firebase Web App config
4. เริ่มเว็บใหม่ เมื่อ config ครบ ระบบจะอ่านสอง collection จาก Realtime Database หากยังไม่มี config จะใช้ JSON ในโปรเจกต์เพื่อให้เว็บและข้อมูลเดิมใช้งานได้ต่อ
5. ตรวจสอบ `database.rules.json` และ Project ที่เลือกก่อน deploy rules

เว็บนี้แสดงแคตตาล็อกสาธารณะและไม่มีข้อมูลแยกตามผู้ใช้ จึงยังไม่ต้องมีระบบบัญชี Firebase Authentication กฎตัวอย่างปิดการเขียนข้อมูล และเปิดอ่านเฉพาะสอง collection นี้ ทบทวนให้ตรงกับขอบเขตงานก่อน deploy

ห้ามใส่ Service Account key ในเว็บฝั่ง client เก็บค่า `.env.local` ไว้ในเครื่อง ไฟล์นี้ถูก ignore โดย Git

## Firebase Hosting

`firebase.json` เตรียม Hosting ให้ใช้ `dist/` และส่งเส้นทาง SPA กลับไปที่ `index.html` หลังตั้งค่า Firebase CLI และเลือก project ที่ถูกต้องแล้ว:

```bash
npm run build
firebase deploy --only hosting,database
```

ตรวจ project ที่ Firebase CLI เลือกก่อน deploy ทุกครั้ง

## ความคืบหน้าตาม Assignment 7

- **ทำแล้ว:** เก็บข้อมูล รูปภาพ การค้นหา และรายละเอียดกาแฟเดิมไว้ พร้อมย้าย UI มาเป็น React components
- **ทำแล้ว:** ตั้ง Vite, routes, responsive layout, scroll animation/reveal, loading/empty/error states และ build production
- **เตรียมแล้ว:** ไฟล์ JSON สำหรับ import, ตัวอ่าน Firebase Realtime Database, ตัวอย่าง environment config, Firebase Hosting rewrite และ rules แบบ read-only
- **ยังต้องทำ:** สร้าง/เลือก Firebase Project, ใส่ config, import data, ตรวจ rules ใน Firebase จริง, deploy และทดสอบ URL สาธารณะ
- **ยังต้องทำ:** รวบรวมผลทดสอบ/ภาพหลักฐาน, รายงาน PDF, สไลด์นำเสนอ และวิดีโอ demo
