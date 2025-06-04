import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { MindMap, MindMapNode } from "@/services/mindmapService";

interface SchedulerProps {
  mindMapData?: MindMap | null;
}

interface DailyPlan {
  day: number;
  topics: string[];
}

// Mock function to split nodes over n days
const createLearningSchedule = (nodes: string[], days: number): DailyPlan[] => {
  if (days <= 0 || nodes.length === 0) return [];
  
  const schedule: DailyPlan[] = [];
  const topicsPerDay = Math.ceil(nodes.length / days);
  
  for (let day = 1; day <= days; day++) {
    const startIndex = (day - 1) * topicsPerDay;
    const endIndex = Math.min(startIndex + topicsPerDay, nodes.length);
    const topics = nodes.slice(startIndex, endIndex);
    
    if (topics.length > 0) {
      schedule.push({
        day,
        topics
      });
    }
  }
  
  return schedule;
};

const Scheduler = ({ mindMapData }: SchedulerProps) => {
  const [learningDays, setLearningDays] = useState<number>(7);
  const [schedule, setSchedule] = useState<DailyPlan[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);  // Function to extract all node titles from mind map data
  const extractAllNodeTitles = (nodes: MindMapNode[]): string[] => {
    const titles: string[] = [];
    for (const node of nodes) {
      titles.push(node.title);
      if (node.children && node.children.length > 0) {
        titles.push(...extractAllNodeTitles(node.children));
      }
    }
    return titles;
  };

  // Mock mind map nodes if not provided
  const defaultNodes = [
    "Target Market Analysis",
    "Tech Stack Planning", 
    "Revenue Model Design",
    "Marketing Strategy",
    "User Experience Design",
    "Competitive Analysis",
    "Financial Projections",
    "Legal Considerations"
  ];

  const nodes = mindMapData ? extractAllNodeTitles(mindMapData.nodes) : defaultNodes;

  const generateSchedule = () => {
    const newSchedule = createLearningSchedule(nodes, learningDays);
    setSchedule(newSchedule);
    setIsGenerated(true);
  };

  const resetSchedule = () => {
    setSchedule([]);
    setIsGenerated(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Learning Schedule
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {!isGenerated ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                Plan Your Learning Journey
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We'll create a personalized learning schedule based on your business idea components.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How many days do you want to spend learning?
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={learningDays}
                  onChange={(e) => setLearningDays(parseInt(e.target.value) || 1)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-24 text-center dark:bg-gray-700 dark:text-white"
                />
                <span className="text-gray-600 dark:text-gray-400">days</span>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topics to Cover ({nodes.length} total):
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {nodes.map((topic, index) => (
                  <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    • {topic}
                  </div>
                ))}
              </div>
            </div>
            
            <Button onClick={generateSchedule} className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              Generate Learning Schedule
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Your {learningDays}-Day Learning Plan
              </h2>
              <Button onClick={resetSchedule} variant="outline" size="sm">
                Create New Schedule
              </Button>
            </div>
            
            <div className="space-y-4">
              {schedule.map((dayPlan) => (
                <div 
                  key={dayPlan.day}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                >
                  <div className="flex items-center mb-3">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      Day {dayPlan.day}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {dayPlan.topics.map((topic, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                      >
                        <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full flex items-center justify-center mr-3">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {topic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                💡 Learning Tips
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Set aside 30-60 minutes per day for focused learning</li>
                <li>• Take notes and reflect on each topic</li>
                <li>• Apply concepts to your specific business idea</li>
                <li>• Review previous days' topics regularly</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scheduler;
