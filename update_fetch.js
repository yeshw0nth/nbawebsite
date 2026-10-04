const fs = require('fs');

let code = fs.readFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', 'utf8');

const oldFetchRegex = /const fetchFilesAndLinks = async \(\) => \{[\s\S]*?fetchFilesAndLinks\(\);/;

const newFetch = `const fetchFilesAndLinks = async () => {
      // Step 1: Query accreditation_nodes
      const { data: nodeData, error: nodeError } = await supabase
        .from('accreditation_nodes')
        .select('id')
        .eq('framework', frameworkType)
        .eq('academic_year', academicYear)
        .eq('node_id', globalGuidelineId)
        .single();
        
      if (nodeError || !nodeData) {
        if (isMounted) {
          setFiles([]);
          setLinks([]);
        }
        return;
      }
      
      const nodeUuid = nodeData.id;
      
      // Step 3: Query evidence_links and evidence_files
      const [filesRes, linksRes] = await Promise.all([
        supabase.from('evidence_files').select('id, file_name, public_url').eq('node_uuid', nodeUuid),
        supabase.from('evidence_links').select('id, title, url').eq('node_uuid', nodeUuid)
      ]);
      
      if (isMounted) {
        if (filesRes.data) {
          setFiles(filesRes.data.map((r: any) => ({
            id: r.id,
            name: r.file_name,
            size: 0,
            type: 'pdf',
            url: r.public_url
          })));
        } else {
          setFiles([]);
        }
        
        if (linksRes.data) {
          setLinks(linksRes.data.map((r: any) => ({
            id: r.id,
            title: r.title,
            url: r.url
          })));
        } else {
          setLinks([]);
        }
      }
    };
    fetchFilesAndLinks();`;

code = code.replace(oldFetchRegex, newFetch);
fs.writeFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', code);
console.log('Done replacing fetchFilesAndLinks');
