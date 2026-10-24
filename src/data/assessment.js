export const evaluationGroups = [
  {
    id: 'satisfaction',
    title: 'ความพึงพอใจต่อเว็บไซต์',
    questions: [
      { id: 'easy', label: 'เว็บไซต์ใช้งานและสำรวจข้อมูลได้ง่าย' },
      { id: 'clear', label: 'รายละเอียดสายพันธุ์และเมนูกาแฟเข้าใจง่าย' },
      { id: 'design', label: 'การจัดวาง ภาพ และการเลื่อนอ่านช่วยให้ติดตามเนื้อหาได้ดี' },
      { id: 'useful', label: 'ข้อมูลในเว็บไซต์เป็นประโยชน์ต่อผู้เริ่มต้นที่สนใจเรื่องกาแฟ' },
      { id: 'overall', label: 'โดยรวมแล้วพึงพอใจกับเว็บไซต์ Coffee Guide' },
    ],
  },
  {
    id: 'perceivedImpact',
    title: 'ผลที่ได้รับจากเว็บไซต์',
    questions: [
      { id: 'understanding', label: 'หลังดูข้อมูล ฉันเข้าใจความแตกต่างของสายพันธุ์หรือเมนูกาแฟมากขึ้น' },
      { id: 'confidence', label: 'ข้อมูลช่วยให้ฉันเปรียบเทียบและเลือกเรื่องกาแฟที่สนใจได้มั่นใจขึ้น' },
      { id: 'interest', label: 'เว็บไซต์ทำให้ฉันสนใจค้นคว้าเรื่องกาแฟต่อไป' },
    ],
  },
];

export const evaluationQuestions = evaluationGroups.flatMap((group) => group.questions);

export const satisfactionScale = [
  { value: 1, label: 'น้อยที่สุด' },
  { value: 2, label: 'น้อย' },
  { value: 3, label: 'ปานกลาง' },
  { value: 4, label: 'มาก' },
  { value: 5, label: 'มากที่สุด' },
];
