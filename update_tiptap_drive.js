const fs = require('fs');
let code = fs.readFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', 'utf8');

// 1. Add RichTextEditor and Eye icon import
if (!code.includes('RichTextEditor')) {
  code = code.replace(/import \{.*?\} from "lucide-react";/, (match) => {
    if (match.includes('Eye')) return match;
    return match.replace('}', ', Eye }');
  });
  code = code.replace('import { useProgress } from "@/context/ProgressContext";', 'import { useProgress } from "@/context/ProgressContext";\nimport RichTextEditor from "@/app/components/RichTextEditor";');
}

// 2. Add previewLinkId state
if (!code.includes('previewLinkId')) {
  code = code.replace(/const \[isUploading, setIsUploading\] = useState\(false\);/, 'const [isUploading, setIsUploading] = useState(false);\n  const [previewLinkId, setPreviewLinkId] = useState<string | null>(null);');
}

// 3. Replace textarea with RichTextEditor
const textareaRegex = /<textarea[\s\S]*?className="w-full border border-border rounded-lg p-5 bg-white text-zinc-900 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-accent transition-all min-h-\[200px\] resize-y font-mono"\n\s*\/>/;

if (code.match(textareaRegex)) {
  code = code.replace(textareaRegex, '<RichTextEditor value={localNote || ""} onChange={setLocalNote} placeholder="Write down your observations... Paste rich text from Google Docs seamlessly!" />');
} else {
  // If exact match fails, let's just do a string replacement on what we found earlier.
  // We know it starts with <textarea and ends with />
  const oldTextArea = `<textarea 
            value={localNote}
            onChange={(e) => setLocalNote(e.target.value)}
            placeholder="Write down your observations (Markdown supported)..."
            className="w-full border border-border rounded-lg p-5 bg-white text-zinc-900 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-accent transition-all min-h-[200px] resize-y font-mono"
          />`;
  code = code.replace(oldTextArea, '<RichTextEditor value={localNote || ""} onChange={setLocalNote} placeholder="Write down your observations... Paste rich text from Google Docs seamlessly!" />');
}

// Change the markdown rendering part in the readonly view
// Before:
// <div className="w-full border border-zinc-200 rounded-lg p-5 bg-white min-h-[200px] prose prose-sm prose-zinc max-w-none">
//   {currentNote ? (
//     <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentNote}</ReactMarkdown>
//   ) : ( ... )}
// </div>
const readOnlyRegex = /<ReactMarkdown remarkPlugins=\{\[remarkGfm\]\}>\{currentNote\}<\/ReactMarkdown>/;
if (code.match(readOnlyRegex)) {
  code = code.replace(readOnlyRegex, '<div dangerouslySetInnerHTML={{ __html: currentNote }} />');
}

// 4. Google Drive Preview
const linkMapRegex = /<li key=\{link\.id\} className="flex items-center justify-between p-4 border border-border rounded-xl bg-card mb-2 hover:border-accent transition-colors group">[\s\S]*?<\/li>/g;

const newLinkMap = `{(() => {
              const isDrive = link.url.includes('drive.google.com') || link.url.includes('docs.google.com');
              const isPreviewing = previewLinkId === link.id;
              
              return (
                <li key={link.id} className="flex flex-col border border-border rounded-xl bg-card mb-2 hover:border-accent transition-colors group overflow-hidden">
                  <div className="flex items-center justify-between p-4">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      {link.title}
                    </a>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isDrive && (
                        <button onClick={() => setPreviewLinkId(isPreviewing ? null : link.id)} className="text-muted-foreground hover:text-accent transition-colors p-2 rounded-md hover:bg-muted" title={isPreviewing ? "Close Preview" : "Live Preview"}>
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleEditClick(link)} className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted" title="Edit Link">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteLink(link.id)} className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted" title="Delete Link">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {isPreviewing && isDrive && (
                    <div className="p-4 border-t border-border bg-muted/10">
                      <iframe 
                        src={link.url.replace(/\\/view.*?$/, '/preview').replace(/\\/edit.*?$/, '/preview')} 
                        width="100%" 
                        height="600px" 
                        className="border border-border rounded-xl bg-white"
                      />
                    </div>
                  )}
                </li>
              );
            })()}`;

if (code.includes('li key={link.id}')) {
  // We can just replace the whole map body
  code = code.replace(/<li key=\{link\.id\} className="flex items-center justify-between p-4 border border-border rounded-xl bg-card mb-2 hover:border-accent transition-colors group">[\s\S]*?<\/li>/, newLinkMap);
}

fs.writeFileSync('src/app/framework/[type]/[year]/resources/[criterionId]/[guidelineId]/ResourceInteractive.tsx', code);
console.log('ResourceInteractive updated successfully');
