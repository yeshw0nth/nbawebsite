const fs = require('fs');
let code = fs.readFileSync('src/app/components/BreadcrumbNav.tsx', 'utf8');

code = code.replace(
  /className=\{\`hover:text-foreground transition-colors \$\{isMiddle \? 'truncate max-w-\[200px\]' : ''\}\`\}/g,
  "className={`hover:text-foreground transition-colors ${isMiddle ? 'inline-block align-bottom truncate max-w-[200px]' : ''}`}"
);

code = code.replace(
  /className=\{\`text-foreground font-medium \$\{\!isLast && isMiddle \? 'truncate max-w-\[200px\]' : ''\}\`\}/g,
  "className={`text-foreground font-medium ${!isLast && isMiddle ? 'inline-block align-bottom truncate max-w-[200px]' : ''}`}"
);

fs.writeFileSync('src/app/components/BreadcrumbNav.tsx', code);
console.log('Fixed block-level truncate');
