const fs = require('fs');

let code = fs.readFileSync('src/app/components/SpreadsheetGrid.tsx', 'utf8');

const regex = /\.upsert\(\{[\s\S]*?\} as any, \{ onConflict: "framework_type,academic_year,node_id,table_id" \}\);/;

const replacement = `.upsert({
        node_uuid: nodeUuid,
        table_identifier: tableKey,
        grid_payload: gridData
      } as any, { onConflict: "node_uuid,table_identifier" });`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/app/components/SpreadsheetGrid.tsx', code);
console.log('Fixed SpreadsheetGrid saving');
