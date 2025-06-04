import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MindMap, mindmapService } from "@/services/mindmapService";
import IdeaInput from "./IdeaInput";
import MindMapViewer from "./MindMapViewer";
import ElementDetail from "./ElementDetail";
import Scheduler from "./Scheduler";

type ViewType = "input" | "mindmap" | "detail" | "scheduler";

const MastermindApp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewType>("mindmap");
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [currentIdea, setCurrentIdea] = useState<string>("");
  const [mindMapData, setMindMapData] = useState<MindMap | null>(null);
  // Check if we received an idea from the landing page
  useEffect(() => {
    const initializeWithIdea = async () => {
      if (location.state?.idea) {
        setCurrentIdea(location.state.idea);
        setCurrentView("mindmap");
        
        // Generate mind map for the idea received from landing page
        try {
          console.log('Generating mind map for idea from landing page:', location.state.idea);
          const mindMapData = await mindmapService.generateMindMap(location.state.idea);
          setMindMapData(mindMapData);
          console.log('Mind map data set:', mindMapData);
        } catch (error) {
          console.error('Error generating mind map for landing page idea:', error);
          // Continue with null mindMapData, MindMapViewer will handle it
        }
      } else {
        setCurrentView("input");
      }
    };

    initializeWithIdea();
  }, [location.state]);

  const handleIdeaSubmit = (idea: string, mindMapData: MindMap) => {
    setCurrentIdea(idea);
    setMindMapData(mindMapData);
    setCurrentView("mindmap");
  };

  const handleNodeSelect = (nodeId: number) => {
    setSelectedNodeId(nodeId);
    setCurrentView("detail");
  };

  const handleBackToMindMap = () => {
    setSelectedNodeId(null);
    setCurrentView("mindmap");
  };  const renderCurrentView = () => {
    switch (currentView) {
      case "input":
        return <IdeaInput onIdeaSubmit={handleIdeaSubmit} showBackButton={true} />;
      
      case "mindmap":
        return <MindMapViewer mindMapData={mindMapData} onNodeSelect={handleNodeSelect} />;
      
      case "detail":
        return selectedNodeId ? (
          <ElementDetail 
            nodeId={selectedNodeId} 
            mindMapData={mindMapData}
            onBack={handleBackToMindMap} 
          />
        ) : (
          <MindMapViewer mindMapData={mindMapData} onNodeSelect={handleNodeSelect} />
        );
      
      case "scheduler":
        return <Scheduler mindMapData={mindMapData} />;
      
      default:
        return <IdeaInput onIdeaSubmit={handleIdeaSubmit} showBackButton={true} />;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                size="sm"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                mastermind.ai
              </h1>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView("input")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === "input"
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                }`}
              >
                New Idea
              </button>
              
              {currentIdea && (
                <>
                  <button
                    onClick={() => setCurrentView("mindmap")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentView === "mindmap"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                    }`}
                  >
                    Mind Map
                  </button>
                  
                  <button
                    onClick={() => setCurrentView("scheduler")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentView === "scheduler"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                    }`}
                  >
                    Learning Schedule
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default MastermindApp;
