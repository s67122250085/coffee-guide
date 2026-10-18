# Coffee Guide

เว็บ Coffee Guide พัฒนาด้วย Node.js และ HTML, CSS, JavaScript แบบไม่ใช้ framework

## เริ่มเว็บในเครื่อง

```bash
npm run dev
```

จากนั้นเปิด `http://localhost:3000` ในเบราว์เซอร์

## แก้ส่วนไหนให้เปิดไฟล์ใด

| ต้องการแก้ | ไฟล์ |
|---|---|
| เนื้อหาและโครงหน้า Home | `index.html` |
| เนื้อหาหน้าสายพันธุ์กาแฟ | `varietals.html` |
| เนื้อหาหน้าเมนูกาแฟ | `menu.html` |
| สี ฟอนต์ ระยะห่าง และหน้าตาร่วมของทุกหน้า | `styles.css` |
| การ์ดและส่วนตกแต่งเฉพาะหน้า Home | `extras.css` |
| แอนิเมชันที่ผูกกับการเลื่อน ใช้ร่วมกันทั้ง 3 หน้า | `intro.js` |
| ตัวเลขและการแสดงการ์ดบน Home | `home.js` |
| ค้นหา รายการข้อมูล และภาพประกอบหน้าสายพันธุ์/เมนู | `site.js` |
| ข้อมูลกาแฟและเมนู | `data/data.js` |
| Node.js server สำหรับเปิดเว็บในเครื่อง | `server.js` |

## โครงสร้างหลัก

```text
Coffee Guide/
├── data/
│   └── data.js
├── images/
├── extras.css
├── home.js
├── index.html
├── intro.js
├── menu.html
├── server.js
├── site.js
├── styles.css
└── varietals.html
```

ข้อมูลเพิ่มเติมเกี่ยวกับ dataset และรูปภาพอยู่ใน [`README_Coffee_Guide.md`](README_Coffee_Guide.md)
