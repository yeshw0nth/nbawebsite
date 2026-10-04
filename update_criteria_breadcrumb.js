const fs = require('fs');

let code = fs.readFileSync('src/app/framework/[type]/[year]/criteria/[id]/page.tsx', 'utf8');

// 1. Add import
if (!code.includes('BreadcrumbNav')) {
  code = code.replace('import RadialProgress', 'import BreadcrumbNav from "@/app/components/BreadcrumbNav";\nimport RadialProgress');
}

// 2. Remove the old breadcrumb calculation
const oldBreadcrumbCalcRegex = /\/\/ Determine Breadcrumbs\s+const breadcrumbs = \[\];\s+if \(node\.type === 'criterion'\) \{[\s\S]*?\}\s*return \(/;

if (code.match(oldBreadcrumbCalcRegex)) {
  code = code.replace(oldBreadcrumbCalcRegex, 'return (');
}

// 3. Replace the rendering block
const oldRenderRegex = /<div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">[\s\S]*?<\/div>/;

if (code.match(oldRenderRegex)) {
  code = code.replace(oldRenderRegex, '<BreadcrumbNav />');
}

fs.writeFileSync('src/app/framework/[type]/[year]/criteria/[id]/page.tsx', code);
console.log('criteria/[id]/page.tsx updated successfully');
