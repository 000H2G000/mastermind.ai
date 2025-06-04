import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { mindmapService, MindMap } from "@/services/mindmapService";

interface IdeaInputProps {
  onIdeaSubmit?: (idea: string, mindMapData: MindMap) => void;
  showBackButton?: boolean;
}

const IdeaInput = ({ onIdeaSubmit, showBackButton = false }: IdeaInputProps) => {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    if (!idea.trim()) return;
    
    setIsLoading(true);
    
    try {
      console.log('Generating mind map for:', idea);
      const mindMapData = await mindmapService.generateMindMap(idea);
      console.log('Mind map generated successfully:', mindMapData);
      
      setIsLoading(false);
      onIdeaSubmit?.(idea, mindMapData);
      setIdea("");
    } catch (error) {
      console.error('Error generating mind map:', error);
      setIsLoading(false);
      // Could add error handling UI here in the future
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6">
      {showBackButton && (
        <div className="mb-6">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Enter your business idea
      </h1>
      
      <div className="space-y-4">
        <div>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your business idea... (e.g., AI-powered gym coach app)"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            rows={4}
            disabled={isLoading}
          />
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={!idea.trim() || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
        >
          {isLoading ? "Generating mind map..." : "Generate Mind Map"}
        </Button>
      </div>
      
      {isLoading && (
        <div className="mt-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Analyzing your idea and creating mind map...
          </p>
        </div>
      )}
    </div>
  );
};

export default IdeaInput;
