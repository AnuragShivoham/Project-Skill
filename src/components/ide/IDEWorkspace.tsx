  import { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import FileExplorer from "./FileExplorer";
import CodeEditor from "./CodeEditor";
import Terminal from "./Terminal";
import AIChatPanel from "./AIChatPanel";
import FileOperationsPanel from "./FileOperationsPanel";
import ActivityBar from "./ActivityBar";
import FileTabs from "./FileTabs";
import StatusBar from "./StatusBar";
import Breadcrumbs from "./Breadcrumbs";
import { useProjectFiles, ProjectFilesProvider } from "@/hooks/useProjectFiles";
import { ConversationHistory } from "@/components/ConversationHistory";

const IDEWorkspaceContent = () => {
  const { files, selectedFile, selectFile, updateNode, deleteNode } = useProjectFiles();
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(true);
  const [activeView, setActiveView] = useState("explorer");
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const currentFileNode = selectedFile ? files[selectedFile] : null;
  const code = currentFileNode?.content || "";

  // Add file to open files when selected
  useEffect(() => {
    if (selectedFile && !openFiles.includes(selectedFile)) {
      setOpenFiles(prev => [...prev, selectedFile]);
    }
  }, [selectedFile]);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined && selectedFile) {
      updateNode(selectedFile, value);
    }
  };

  const handleFileClose = (path: string) => {
    setOpenFiles(prev => prev.filter(f => f !== path));
    if (selectedFile === path) {
      // Select another open file or deselect
      const remaining = openFiles.filter(f => f !== path);
      if (remaining.length > 0) {
        selectFile(remaining[remaining.length - 1]);
      }
    }
  };

  const getLanguage = (path: string): string => {
    if (!path) return "TypeScript";
    if (path.endsWith(".ts") || path.endsWith(".tsx")) return "TypeScript";
    if (path.endsWith(".js") || path.endsWith(".jsx")) return "JavaScript";
    if (path.endsWith(".json")) return "JSON";
    if (path.endsWith(".md")) return "Markdown";
    if (path.endsWith(".css")) return "CSS";
    if (path.endsWith(".html")) return "HTML";
    return "TypeScript";
  };

  return (
    <div className="h-screen bg-ide-bg flex flex-col">
      {/* Main content area with Activity Bar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar (far left) */}
        <ActivityBar activeView={activeView} onViewChange={setActiveView} />

        {/* Resizable Panel Group */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Conversation History */}
          <ResizablePanel defaultSize={12} minSize={10} maxSize={20}>
            <ConversationHistory />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* File Explorer */}
          <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
            <div className="flex flex-col h-full">
              <FileExplorer onFileSelect={selectFile} selectedFile={selectedFile} />
              <FileOperationsPanel />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Editor + Terminal */}
          <ResizablePanel defaultSize={55}>
            <div className="h-full flex flex-col">
              {/* File Tabs */}
              <FileTabs 
                openFiles={openFiles} 
                activeFile={selectedFile} 
                onFileSelect={selectFile}
                onFileClose={handleFileClose}
              />
              
              {/* Breadcrumbs */}
              <Breadcrumbs path={selectedFile || ""} />

              {/* Editor */}
              <div className="flex-1 min-h-0">
                <CodeEditor
                  selectedFile={selectedFile}
                  code={code}
                  onChange={handleCodeChange}
                />
              </div>
              
              {/* Terminal */}
              <Terminal
                isExpanded={isTerminalExpanded}
                onToggle={() => setIsTerminalExpanded((v) => !v)}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* AI Chat Panel */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <AIChatPanel
              currentTask="Implement JWT Authentication"
              currentCode={code}
              currentFiles={files}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Status Bar */}
      <StatusBar 
        language={selectedFile ? getLanguage(selectedFile) : "TypeScript"}
        branch="main"
      />
    </div>
  );
};

const IDEWorkspace = () => {
  return (
    <ProjectFilesProvider>
      <IDEWorkspaceContent />
    </ProjectFilesProvider>
  );
};

export default IDEWorkspace;
