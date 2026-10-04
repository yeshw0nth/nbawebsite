const fs = require('fs');
let code = fs.readFileSync('src/app/components/SpreadsheetGrid.tsx', 'utf8');

code = code.replace(/from\("dynamic_tables"\)/g, 'from("dynamic_spreadsheets")');
code = code.replace(/table_id: tableKey,/g, 'table_identifier: tableKey,');
code = code.replace(/payload: gridData/g, 'grid_payload: gridData');
code = code.replace(/"node_uuid,table_id"/g, '"node_uuid,table_identifier"');

fs.writeFileSync('src/app/components/SpreadsheetGrid.tsx', code);
console.log('Fixed SpreadsheetGrid.tsx');
