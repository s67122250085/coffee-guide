# Coffee Guide - Project Handoff

**Assignment:** งานที่ 7 การพัฒนา ทดสอบ และนำเสนอเว็บแอปพลิเคชัน  
**วันที่จัดทำ:** 19 ตุลาคม 2026

## 1. ชื่อและวัตถุประสงค์

**Coffee Guide** เป็นเว็บแอปพลิเคชันสำหรับสำรวจเรื่องราวของกาแฟ ตั้งแต่สายพันธุ์และแหล่งปลูกไปจนถึงเมนูกาแฟ มีเป้าหมายให้ผู้ใช้ค้นพบข้อมูลกาแฟได้ง่ายผ่านหน้าเว็บที่อ่านสบาย ใช้งานได้หลายขนาดหน้าจอ และเล่าเนื้อหาเป็นลำดับระหว่างการเลื่อน

## 2. ขอบเขตและฟังก์ชันที่พัฒนา

- หน้า Home นำเสนอแนวคิดและทางเข้าสู่สายพันธุ์กาแฟหรือเมนู
- แคตตาล็อกสายพันธุ์กาแฟ 10 รายการ และเมนูกาแฟ 20 รายการ
- ค้นหารายการจากชื่อ รายละเอียด รสชาติ หรือข้อมูลที่เกี่ยวข้อง
- แสดงรายละเอียด แหล่งปลูก รสชาติ ประเภท และแหล่งข้อมูลตามข้อมูลที่มี
- เล่าเรื่องทีละรายการด้วยภาพที่สัมพันธ์กับรายการและแอนิเมชันระหว่างเลื่อน
- มีสถานะกำลังโหลด ไม่พบผลลัพธ์ และข้อผิดพลาด พร้อมทางให้ลองโหลดใหม่
- รองรับ Desktop, Tablet และ Mobile
- อ่านข้อมูลจาก Firebase Realtime Database เมื่อกำหนดค่าไว้ และใช้ข้อมูล JSON ในเครื่องเป็น fallback

**ขอบเขตที่ยังไม่มี:** ระบบสมาชิกและการเขียน/แก้ไขข้อมูลจากหน้าเว็บ เนื่องจากระบบนี้เป็นแคตตาล็อกข้อมูลสาธารณะ

## 3. เทคโนโลยีและโครงสร้างข้อมูล

- React 19 และ JavaScript สำหรับส่วนติดต่อผู้ใช้
- Vite 8 สำหรับพัฒนาและสร้าง production build
- React Router 8 สำหรับ client-side routing
- Firebase JavaScript SDK และ Realtime Database สำหรับอ่านข้อมูล
- CSS สำหรับ layout, responsive design และ scroll animation

Firebase Realtime Database จัดข้อมูลไว้ที่ root สองโหนด:

| โหนด | จำนวน | รูปแบบ key | ฟิลด์หลัก |
|---|---:|---|---|
| `coffee_varieties` | 10 | `C001` ถึง `C010` | `coffee_id`, `name_th`, `name_en`, `type`, `description`, `province`, `flavor`, `source`, `image`, `tag` |
| `coffee_menu` | 20 | `M001` ถึง `M020` | `menu_id`, `name_th`, `name_en`, `flavor`, `source`, `image`, `tag` และฟิลด์รายละเอียดอื่นตามรายการ |

ไฟล์ `data/firebase-import.json` เป็นชุดนำเข้าที่จัดโครงสร้างไว้ ส่วน `data/coffee.json` เป็น fallback สำหรับแอป

กฎฐานข้อมูลปิดการอ่านที่ root และปิดการเขียนทั้งหมด เปิดอ่านสาธารณะเฉพาะ `coffee_varieties` และ `coffee_menu` ตามการใช้งานแบบแคตตาล็อก

## 4. Routes และ Components

| Route | หน้าที่ | ไฟล์หน้า |
|---|---|---|
| `/` | หน้า Home และทางเลือกเริ่มสำรวจ | `src/pages/HomePage.jsx` |
| `/varieties` | ค้นหาและอ่านเรื่องราวสายพันธุ์กาแฟ | `src/pages/CatalogPage.jsx` (`kind="varieties"`) |
| `/coffee-menu` | ค้นหาและอ่านเรื่องราวเมนูกาแฟ | `src/pages/CatalogPage.jsx` (`kind="menu"`) |

- `src/components/SiteLayout.jsx` จัด Header, Navigation และ Footer
- `src/components/Introduction.jsx` แสดง intro แบบ sticky และเอฟเฟกต์ตาม scroll
- `src/components/Ticker.jsx` แสดงแถบข้อความคั่นเรื่องราว
- `src/hooks/useCoffeeData.js` จัดการ loading, error, retry และแหล่งข้อมูล
- `src/services/coffeeData.js` อ่านและตรวจข้อมูลจาก Firebase พร้อม local fallback
- `src/services/validateCoffeeData.mjs` ตรวจ schema และรหัสรายการ
- `src/utils/assetUrl.js` กำหนดเวอร์ชัน URL รูปเพื่อหลีกเลี่ยง cache เก่า

## 5. วิธีติดตั้งและใช้งาน

ต้องมี Node.js และ npm ติดตั้งในเครื่อง

```bash
git clone https://github.com/s67122250085/coffee-guide.git
cd coffee-guide
npm install
```

หากต้องการเชื่อม Firebase ให้คัดลอก `.env.example` เป็น `.env.local` แล้วกำหนดค่า `VITE_FIREBASE_*` จาก Firebase Web App config จากนั้นเริ่มเซิร์ฟเวอร์ใหม่ หากไม่กำหนดค่า Firebase ระบบจะใช้ข้อมูล fallback ใน `data/coffee.json`

```bash
npm run dev
```

คำสั่งสำคัญ:

```bash
npm test
npm run build
npm run preview
```

## 6. ผลการทดสอบและ Deploy

- Unit tests สำหรับตรวจชุดข้อมูล Firebase ผ่าน 4/4 กรณี: ชุดข้อมูลถูกต้อง, collection หาย, key ไม่ตรง record ID และ record ขาดฟิลด์บังคับ
- `npm run build` ผ่าน และสร้างไฟล์ production ใน `dist/`
- Firebase Hosting deploy สำเร็จ โดยอัปโหลด 36 ไฟล์ รวมไฟล์รูปและ SPA rewrite
- เปิดเว็บสาธารณะและตรวจไฟล์รูปที่ Hosting ให้บริการได้
- Routes และ responsive flow ผ่านการตรวจในขั้นตอนทดสอบของโครงงานที่ขนาด 320, 390, 768 และ 1365 px

## 7. ลิงก์ส่งมอบ

- เว็บที่ Deploy แล้ว: [https://coffeeguide-7fc30.web.app/](https://coffeeguide-7fc30.web.app/)
- GitHub Repository: [https://github.com/s67122250085/coffee-guide](https://github.com/s67122250085/coffee-guide)
- Firebase Project ID: `coffeeguide-7fc30`

**หมายเหตุเรื่องสิทธิ์เข้าถึง:** GitHub Repository ตั้งเป็น Private ตามที่เจ้าของโครงงานเลือกไว้ ผู้สอนต้องได้รับสิทธิ์ Collaborator เพื่อเปิด Source Code ได้ ส่วนเว็บไซต์สาธารณะเปิดดูได้จาก Hosting URL ด้านบน

## 8. ไฟล์สำคัญใน Repository

- `src/` - React application, routes, components, services และ tests
- `data/firebase-import.json` - ข้อมูลสำหรับนำเข้า Firebase
- `data/coffee.json` - ชุดข้อมูล fallback ในเครื่อง
- `public/images/` - รูปที่จัดส่งไปกับ production build
- `database.rules.json` - Firebase Realtime Database rules
- `firebase.json` - Firebase Hosting และ SPA rewrite configuration
- `.env.example` - ชื่อตัวแปร config โดยไม่มีค่าจริง

ไฟล์ `.env.local` และไฟล์ backup ฐานข้อมูลถูก exclude จาก Git ด้วย `.gitignore` อย่าเผยแพร่ Firebase secrets หรือ Service Account keys ใน repository
