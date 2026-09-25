const fs = require('fs');
let content = fs.readFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', 'utf8');

const newImports = 'import SpreadsheetGrid from "@/app/components/SpreadsheetGrid";\n';
content = content.replace(/import { Table5AWidget }.*?from "@\/app\/components\/tables\/Table9Widget";/s, newImports);

const newTableMap = `
const tableMap: Record<string, string[]> = {
  "c1-s1-ss5": ["1.1.5.1"],
  "c1-s4-ss2": ["1.4.2"],
  "c1-s5-ss1": ["1.5.1"],
  "c3-s8-ss1": ["3.8.1", "3.8.2", "3.8.3"],
  "c4-s2-ss1": ["4A", "4B", "4C"],
  "c5-s1-ss1": ["5.1.2", "5A"],
  "c5-s2-ss1": ["5.2.1"],
  "c5-s3-ss1": ["5.3.1"],
  "c6-s1-ss1": ["6.1.1"],
  "c6-s1-ss2": ["6.1.2.1", "6.1.2.2"],
  "c6-s1-ss3": ["6.1.3"],
  "c6-s1-ss4": ["6.1.4"],
  "c6-s1-ss5": ["6.1.5"],
  "c6-s1-ss6": ["6.1.6"],
  "c6-s1-ss7": ["6.1.7"],
  "c6-s2-ss1": ["6.2.1"],
  "c6-s2-ss2": ["6.2.2"],
  "c6-s2-ss4": ["6.2.4"],
  "c6-s2-ss5": ["6.2.5"],
  "c6-s2-ss6": ["6.2.6"],
  "c7-s1-ss1": ["7.1.1"],
  "c7-s5-ss1": ["7.5.1"],
  "c9-s7-ss1": ["9.7.1"],
  "c9-s8-ss1": ["9.8.1"],
};
`;

content = content.replace(/const tableMap: Record<string, React\.FC<TableProps> \| React\.FC<TableProps>\[\]> = \{.*?\};/s, newTableMap);
content = content.replace(/const TableComponent = tableMap\[criterionId\];/s, 'const tableKeysForCriterion = tableMap[criterionId] || [];');
content = content.replace(/\{TableComponent && \(\s*<section className="mt-12 pt-8 border-t border-border">.*?\)\s*\}/s, `{tableKeysForCriterion.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border">
          <div className="mb-6">
            <h3 className="text-lg font-medium tracking-tight text-zinc-900">Evaluation Data Grids</h3>
            <p className="text-sm text-zinc-500 mt-1">Quantitative tables required for this criterion.</p>
          </div>
          <div className="space-y-12">
            {tableKeysForCriterion.map((key) => (
              <SpreadsheetGrid key={key} guidelineId={criterionId} tableKey={key} />
            ))}
          </div>
        </section>
      )}`);

fs.writeFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', content);
console.log('done');
