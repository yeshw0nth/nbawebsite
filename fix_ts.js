const fs = require('fs');

let code = fs.readFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', 'utf8');

code = code.replace(/nodeData\.id/g, '(nodeData as any).id');
code = code.replace(/await supabase\.from\('evidence_links'\)\s*\.update\(\{ title: linkForm\.title, url: finalUrl \} as any\)/g, "await (supabase.from('evidence_links') as any).update({ title: linkForm.title, url: finalUrl })");

fs.writeFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', code);
console.log('Fixed typescript issues');
