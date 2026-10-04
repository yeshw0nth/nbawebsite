const fs = require('fs');
let code = fs.readFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', 'utf8');
if (!code.includes('import RichTextEditor')) {
  code = code.replace('import { useProgress }', 'import RichTextEditor from "@/app/components/RichTextEditor";\nimport { useProgress }');
  fs.writeFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', code);
  console.log('Added import');
}
