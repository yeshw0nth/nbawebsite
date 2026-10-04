const fs = require('fs');
let code = fs.readFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', 'utf8');

const fetchReplacement = `const fetchResources = async () => {
      // First, get node_uuid if exists to fetch cleanly
      const { data: nodeData } = await supabase
        .from('accreditation_nodes')
        .select('id')
        .eq('framework', (params?.type as string) || 'NBA')
        .eq('academic_year', (params?.year as string) || '2025-26')
        .eq('node_id', globalGuidelineId)
        .single();
        
      if (nodeData?.id) {
        const { data: linksData } = await supabase
          .from('evidence_links')
          .select('*')
          .eq('node_uuid', nodeData.id);
          
        if (linksData) setLinks(linksData);

        const { data: filesData } = await supabase
          .from('evidence_files')
          .select('*')
          .eq('node_uuid', nodeData.id);
          
        if (filesData) {
          setFiles(filesData.map(f => ({
            id: f.id,
            name: f.file_name,
            size: 0,
            type: 'file',
            url: f.public_url
          })));
        }
      }
    };
    fetchResources();`;
code = code.replace(/const fetchResources = async \(\) => \{[\s\S]*?fetchResources\(\);/m, fetchReplacement);

// Fix handleSaveLink
const saveLinkReplacement = `const handleSaveLink = async () => {
    if (!linkForm.title || !linkForm.url) return;
    
    // Get UUID
    const nodeUuid = await ensureNodeExists(globalGuidelineId);
    
    if (editingLinkId) {
      // Update
      setLinks(prev => prev.map(l => l.id === editingLinkId ? { ...l, title: linkForm.title, url: linkForm.url } : l));
      const { data, error } = await supabase
        .from('evidence_links')
        .update({ title: linkForm.title, url: linkForm.url })
        .eq('id', editingLinkId)
        .select()
        .single();
        
      if (error) console.error(error);
      else {
        setLinks(prev => prev.map(l => l.id === editingLinkId ? { id: l.id, title: data.title, url: data.url } : l));
      }
    } else {
      // Insert
      const tempId = Date.now().toString();
      setLinks(prev => [...prev, { id: tempId, title: linkForm.title, url: linkForm.url }]);
      
      const { data, error } = await supabase
        .from('evidence_links')
        .insert({ node_uuid: nodeUuid, title: linkForm.title, url: linkForm.url })
        .select()
        .single();
        
      if (error) {
        console.error(error);
        setLinks(prev => prev.filter(l => l.id !== tempId));
      } else {
        setLinks(prev => prev.map(l => l.id === tempId ? { id: data.id, title: data.title, url: data.url } : l));
      }
    }
    
    setLinkForm({ title: '', url: '' });
    setEditingLinkId(null);
    setIsAddingLink(false);
  };`;
code = code.replace(/const handleSaveLink = async \(\) => \{[\s\S]*?setIsAddingLink\(false\);\n  \};/m, saveLinkReplacement);

// Fix handleDeleteLink
const deleteLinkReplacement = `const handleDeleteLink = async (id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
    await supabase.from('evidence_links').delete().eq('id', id);
  };`;
code = code.replace(/const handleDeleteLink = async \(id: string\) => \{[\s\S]*?\};/m, deleteLinkReplacement);

// Fix onDrop (File upload)
const onDropReplacement = `const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    const nodeUuid = await ensureNodeExists(globalGuidelineId);
    
    for (const file of acceptedFiles) {
      const tempId = Math.random().toString(36).substring(7);
      const fileExt = file.name.split('.').pop();
      const fileName = \`\${Math.random()}.\${fileExt}\`;
      const filePath = \`\${(params?.type as string) || 'NBA'}/\${(params?.year as string) || '2025-26'}/\${globalGuidelineId}/\${fileName}\`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('accreditation_evidence')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Upload Error:', uploadError);
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('accreditation_evidence')
        .getPublicUrl(filePath);
        
      setFiles(prev => [...prev, {
        id: tempId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl
      }]);
      
      const { data: dbData, error: dbError } = await supabase
        .from('evidence_files')
        .insert({
          node_uuid: nodeUuid,
          file_name: file.name,
          storage_path: filePath,
          public_url: publicUrl
        })
        .select()
        .single();
        
      if (dbError) {
        console.error('DB Insert Error:', dbError);
      } else {
        setFiles(prev => prev.map(f => f.id === tempId ? { ...f, id: dbData.id } : f));
      }
    }
    setIsUploading(false);
  }, [globalGuidelineId, ensureNodeExists, params]);`;
code = code.replace(/const onDrop = useCallback\(async \(acceptedFiles: File\[\]\) => \{[\s\S]*?\}\], \);\n  \}, \[globalGuidelineId\]\);/m, onDropReplacement);

// Also need to just replace the simple ending with the new one
code = code.replace(/const onDrop = useCallback\(async \(acceptedFiles: File\[\]\) => \{[\s\S]*?\}\], \);\n  \}, \[globalGuidelineId, ensureNodeExists\]\);/m, onDropReplacement);
// Wait, regex might fail to match perfectly.
// Instead, let's just do a string replacement for the node_resources ones in onDrop and handleDeleteFile
code = code.replace(/const handleDeleteFile = async \(id: string\) => \{[\s\S]*?\};/m, `const handleDeleteFile = async (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    await supabase.from('evidence_files').delete().eq('id', id);
  };`);
  
// For onDrop, replacing `node_resources` and payload manually might be easier:
code = code.replace(/insert\(\{\n\s*node_id: globalGuidelineId,\n\s*resource_type: 'file',\n\s*title: file.name,\n\s*url: publicUrl\n\s*\}\)/, `insert({
          node_uuid: nodeUuid,
          file_name: file.name,
          storage_path: filePath,
          public_url: publicUrl
        })`);
code = code.replace(/\.from\('node_resources'\)/g, `.from('evidence_files')`);

fs.writeFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', code);
console.log("Done updating ResourceInteractive");
