import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MindMap, MindMapNode } from "@/services/mindmapService";

interface MindMapViewerProps {
  mindMapData?: MindMap | null;
  onNodeSelect?: (nodeId: number) => void;
}

const mockMindMap: MindMap = {
  idea: "AI Gym Coach",
  nodes: [
    {
      id: 1,
      title: "Target Market",
      children: [
        { id: 2, title: "Athletes", children: [] },
        { id: 3, title: "Beginners", children: [] }
      ]
    },
    {
      id: 4,
      title: "Tech Stack",
      children: [
        { id: 5, title: "Machine Learning", children: [] },
        { id: 6, title: "Mobile App", children: [] }
      ]
    },
    {
      id: 7,
      title: "Revenue Model",
      children: [
        { id: 8, title: "Subscription", children: [] },
        { id: 9, title: "Premium Features", children: [] }
      ]
    },
    {
      id: 10,
      title: "Marketing Strategy",
      children: []
    }
  ]
};

const TreeNode = ({ 
  node, 
  selectedId, 
  onSelect, 
  onToggle, 
  expandedNodes 
}: {
  node: MindMapNode;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onToggle: (id: number) => void;
  expandedNodes: Set<number>;
}) => {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <div className="ml-4">
      <div 
        className={`flex items-center py-2 px-3 rounded cursor-pointer transition-colors ${
          isSelected 
            ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        onClick={() => onSelect(node.id)}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            className="mr-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        <span className={`${!hasChildren ? 'ml-6' : ''} text-gray-800 dark:text-white`}>
          {node.title}
        </span>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              onToggle={onToggle}
              expandedNodes={expandedNodes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MindMapViewer = ({ mindMapData, onNodeSelect }: MindMapViewerProps) => {
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set([1, 4, 7]));

  // Use provided mindMapData or fallback to mock
  const currentMindMap = mindMapData || mockMindMap;

  const handleNodeSelect = (nodeId: number) => {
    setSelectedNodeId(nodeId);
    onNodeSelect?.(nodeId);
  };

  const handleToggle = (nodeId: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Mind Map: {currentMindMap.idea}
      </h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="space-y-2">
          {currentMindMap.nodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              selectedId={selectedNodeId}
              onSelect={handleNodeSelect}
              onToggle={handleToggle}
              expandedNodes={expandedNodes}
            />
          ))}
        </div>
      </div>
      
      {selectedNodeId && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Selected node ID: {selectedNodeId}
          </p>
        </div>
      )}
    </div>
  );
};

export default MindMapViewer;
