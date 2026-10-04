const fs = require('fs');
let code = fs.readFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', 'utf8');
code = 'import RichTextEditor from "@/app/components/RichTextEditor";\n' + code;
fs.writeFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', code);
console.log('Added import successfully');
