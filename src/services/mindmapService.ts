import axios from "axios";

export interface MindMapNode {
  id: number;
  title: string;
  children: MindMapNode[];
}

export interface MindMap {
  idea: string;
  nodes: MindMapNode[];
}

// Mock data as fallback
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

class MindMapService {
  private n8nApiUrl = "http://localhost:5678/webhook-test/mindmap";
  private timeout = 10000; // 10 seconds timeout

  /**
   * Generate a mind map from a business idea using n8n webhook
   * @param idea - The business idea to generate a mind map for
   * @returns Promise<MindMap> - The generated mind map or mock data as fallback
   */
  async generateMindMap(idea: string): Promise<MindMap> {
    try {
      console.log(`Generating mind map for idea: "${idea}"`);
      
      const response = await axios.post(
        this.n8nApiUrl,
        { idea },
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      // Validate response structure
      if (this.isValidMindMapResponse(response.data)) {
        console.log('Successfully generated mind map from n8n');
        return response.data;
      } else {
        console.warn('Invalid response structure from n8n, using mock data');
        return this.getMockMindMap(idea);
      }
    } catch (error) {
      console.error('Error calling n8n API:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          console.warn('n8n service not available, using mock data');
        } else if (error.code === 'ECONNABORTED') {
          console.warn('n8n request timed out, using mock data');
        } else {
          console.warn(`n8n API error: ${error.message}, using mock data`);
        }
      }
      
      // Fallback to mock data
      return this.getMockMindMap(idea);
    }
  }  /**
   * Validate if the response from n8n has the expected structure
   * @param data - Response data to validate
   * @returns boolean - True if valid MindMap structure
   */
  private isValidMindMapResponse(data: unknown): data is MindMap {
    if (!data || typeof data !== 'object') return false;
    
    const obj = data as Record<string, unknown>;
    return (
      typeof obj.idea === 'string' &&
      Array.isArray(obj.nodes) &&
      obj.nodes.every((node: unknown) => this.isValidNode(node))
    );
  }

  /**
   * Validate if a node has the expected structure
   * @param node - Node to validate
   * @returns boolean - True if valid node structure
   */
  private isValidNode(node: unknown): node is MindMapNode {
    if (!node || typeof node !== 'object') return false;
    
    const obj = node as Record<string, unknown>;
    return (
      typeof obj.id === 'number' &&
      typeof obj.title === 'string' &&
      Array.isArray(obj.children) &&
      obj.children.every((child: unknown) => this.isValidNode(child))
    );
  }

  /**
   * Get mock mind map data with the provided idea
   * @param idea - The business idea to use
   * @returns MindMap - Mock mind map with the provided idea
   */
  private getMockMindMap(idea: string): MindMap {
    return {
      ...mockMindMap,
      idea: idea || mockMindMap.idea
    };
  }

  /**
   * Test connection to n8n service
   * @returns Promise<boolean> - True if n8n is available
   */
  async testConnection(): Promise<boolean> {
    try {
      // Use a simple test idea to check if n8n is responding
      await axios.post(
        this.n8nApiUrl,
        { idea: "test connection" },
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      return true;
    } catch (error) {
      console.log('n8n service not available:', error);
      return false;
    }
  }
}

// Export singleton instance
export const mindmapService = new MindMapService();
export default mindmapService;
