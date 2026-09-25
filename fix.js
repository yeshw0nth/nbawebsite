const fs = require('fs');
const files = ['src/app/components/tables/Criterion1Tables.tsx', 'src/app/components/tables/Criterion3Tables.tsx', 'src/app/components/tables/Criterion5Tables.tsx', 'src/app/components/tables/Criterion6Tables.tsx', 'src/app/components/tables/Criterion7Tables.tsx'];
for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/import\s+\{\s*ColumnDef\s*\}\s+from\s+[\"']\@tanstack\/react-table[\"'];/g, 'type ColumnDef<T, V=any> = any;');
  fs.writeFileSync(f, content);
}
