import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { MindMap, MindMapNode } from "@/services/mindmapService";

interface ElementDetailProps {
  nodeId: number;
  mindMapData?: MindMap | null;
  onBack?: () => void;
}

// Mock data for different nodes
const mockNodeDetails: Record<number, {
  title: string;
  explanation: string;
  audioUrl: string;
}> = {
  1: {
    title: "Target Market",
    explanation: "Understanding your target market is crucial for any business. For an AI Gym Coach, you need to identify who will benefit most from personalized fitness guidance. This includes analyzing demographics, fitness levels, and technology adoption rates.",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  2: {
    title: "Athletes",
    explanation: "Professional and semi-professional athletes represent a premium market segment. They require advanced analytics, performance tracking, and specialized training programs that can adapt to their competitive schedules.",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  3: {
    title: "Beginners",
    explanation: "Fitness beginners need encouragement, proper form guidance, and progressive programs. This market segment values simplicity, safety, and clear progress tracking to build confidence.",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  4: {
    title: "Tech Stack",
    explanation: "The technology foundation of your AI Gym Coach will determine its capabilities and scalability. Consider machine learning frameworks, mobile development platforms, and cloud infrastructure.",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  5: {
    title: "Machine Learning",
    explanation: "ML algorithms will power the personalization engine, analyzing user data to provide tailored workout recommendations, form corrections, and progress predictions.",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  6: {
    title: "Mobile App",
    explanation: "A mobile-first approach ensures accessibility and real-time interaction. Consider cross-platform development for broader reach and native features for optimal performance.",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  7: {
    title: "Revenue Model",
    explanation: "Sustainable revenue streams are essential for long-term success. Consider subscription models, premium features, partnerships with gyms, and potential enterprise licensing.",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  8: {
    title: "Subscription",
    explanation: "Monthly or annual subscriptions provide predictable recurring revenue. Offer different tiers based on features, with a basic free tier to attract users.",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  9: {
    title: "Premium Features",
    explanation: "Advanced analytics, personal trainer consultations, nutrition planning, and exclusive content can justify premium pricing and increase user lifetime value.",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  10: {
    title: "Marketing Strategy",
    explanation: "Effective marketing combines digital channels, influencer partnerships, and fitness community engagement. Focus on demonstrating real results and user testimonials.",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  }
};

const ElementDetail = ({ nodeId, mindMapData, onBack }: ElementDetailProps) => {  // Function to find a node by ID in the mind map data
  const findNodeById = (nodes: MindMapNode[], id: number): MindMapNode | null => {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Find the actual node from mind map data or use mock data
  const actualNode = mindMapData ? findNodeById(mindMapData.nodes, nodeId) : null;
  const nodeDetail = actualNode ? {
    title: actualNode.title,
    explanation: `Detailed explanation for ${actualNode.title}. This element is part of the ${mindMapData?.idea || 'business idea'} concept and plays a crucial role in the overall strategy.`,
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" // Placeholder audio
  } : mockNodeDetails[nodeId];

  if (!nodeDetail) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No details available for this node.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button onClick={onBack} variant="outline" className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Mind Map
      </Button>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          {nodeDetail.title}
        </h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
              Explanation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {nodeDetail.explanation}
            </p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
              Audio Explanation
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <Play className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <audio 
                  controls 
                  className="flex-1"
                  preload="metadata"
                >
                  <source src={nodeDetail.audioUrl} type="audio/wav" />
                  <source src={nodeDetail.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Listen to a detailed explanation of this business concept
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementDetail;
