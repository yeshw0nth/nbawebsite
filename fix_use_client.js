const fs = require('fs');
let code = fs.readFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', 'utf8');
code = code.replace('import RichTextEditor from "@/app/components/RichTextEditor";\n"use client";\n', '"use client";\nimport RichTextEditor from "@/app/components/RichTextEditor";\n');
fs.writeFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', code);
console.log('Fixed use client');
