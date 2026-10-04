const fs = require('fs');
let code = fs.readFileSync('src/context/ProgressContext.tsx', 'utf8');

code = code.replace(
  /select\("table_id, payload, accreditation_nodes!inner\(framework_type, academic_year, node_id\)"\)/g,
  'select("table_identifier, grid_payload, accreditation_nodes!inner(framework, academic_year, node_id)")'
);

fs.writeFileSync('src/context/ProgressContext.tsx', code);
console.log('ProgressContext updated');
