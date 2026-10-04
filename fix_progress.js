const fs = require('fs');
let code = fs.readFileSync('src/context/ProgressContext.tsx', 'utf8');

// Replace framework_type with framework in eq queries
code = code.replace(/\.eq\("framework_type", frameworkType\)/g, '.eq("framework", frameworkType)');
code = code.replace(/\.eq\("accreditation_nodes\.framework_type", frameworkType\)/g, '.eq("accreditation_nodes.framework", frameworkType)');

// Replace payload structure in ensureNodeExists
code = code.replace(/framework_type: frameworkType/g, 'framework: frameworkType');
code = code.replace(/"framework_type,academic_year,node_id"/g, '"framework,academic_year,node_id"');

// Replace dynamic_tables
code = code.replace(/from\("dynamic_tables"\)/g, 'from("dynamic_spreadsheets")');
code = code.replace(/select\("table_id, payload, accreditation_nodes!inner\\(framework_type, academic_year, node_id\\)"\)/g, 'select("table_identifier, grid_payload, accreditation_nodes!inner(framework, academic_year, node_id)")');

// Replace table_id and payload extraction
code = code.replace(/newTableData\[nodeId\]\[row\.table_id\] = row\.payload;/g, 'newTableData[nodeId][row.table_identifier] = row.grid_payload;');

// Replace dynamic_tables upsert
code = code.replace(/table_id: tableId,/g, 'table_identifier: tableId,');
code = code.replace(/payload: data/g, 'grid_payload: data');
code = code.replace(/"node_uuid,table_id"/g, '"node_uuid,table_identifier"');

fs.writeFileSync('src/context/ProgressContext.tsx', code);
console.log("ProgressContext updated!");
