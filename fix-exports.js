const fs = require('fs');
fs.writeFileSync('src/app/components/DynamicMatrixWidget.tsx', '"use client";\nexport function DynamicMatrixWidget({ guidelineId, ...props }: any) { return <div>M</div>; }\nexport const EditableMatrixCell = () => null;\nexport default DynamicMatrixWidget;');
fs.writeFileSync('src/app/components/DynamicTableWidget.tsx', '"use client";\nexport function DynamicTableWidget({ guidelineId, ...props }: any) { return <div>T</div>; }\nexport default DynamicTableWidget;');
