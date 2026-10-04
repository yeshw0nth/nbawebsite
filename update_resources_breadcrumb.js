const fs = require('fs');

let code = fs.readFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/page.tsx', 'utf8');

if (!code.includes('BreadcrumbNav')) {
  code = code.replace('import ResourceInteractive from "./ResourceInteractive";', 'import ResourceInteractive from "./ResourceInteractive";\nimport BreadcrumbNav from "@/app/components/BreadcrumbNav";');
}

const oldRenderRegex = /<div className="text-sm text-muted">\s*Context and Resources for Guideline <span className="font-medium text-foreground">\{guidelineId\}<\/span>\s*<\/div>/;

if (code.match(oldRenderRegex)) {
  code = code.replace(oldRenderRegex, '<BreadcrumbNav />');
}

fs.writeFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/page.tsx', code);
console.log('resources page updated successfully');
