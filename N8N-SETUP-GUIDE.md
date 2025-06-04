# N8N Mastermind AI Workflow Setup Guide

## 📋 Overview
This workflow receives business ideas via webhook and returns structured mind map JSON data for the mastermind.ai application.

## 🚀 Quick Setup Instructions

### Step 1: Install and Start n8n
```powershell
# Install n8n globally
npm install n8n -g

# Start n8n (will run on http://localhost:5678)
n8n start
```

### Step 2: Import the Workflow
1. Open n8n in your browser: `http://localhost:5678`
2. Click **"+ Add workflow"** or **"Import from file"**
3. Import the `mastermind-workflow.json` file from your project directory
4. The workflow will be automatically imported

### Step 3: Activate the Workflow
1. Open the imported workflow
2. Click **"Activate"** toggle in the top-right corner
3. The webhook will be available at: `http://localhost:5678/webhook/mindmap`

## 🔧 Workflow Components

### 1. Webhook Node
- **URL**: `http://localhost:5678/webhook/mindmap`
- **Method**: POST
- **Expected Input**: 
```json
{
  "idea": "Your business idea here"
}
```

### 2. Generate Mind Map Node (JavaScript Code)
- Analyzes the business idea using keyword detection
- Selects appropriate template based on idea type:
  - **AI/ML projects**: Technology Stack, Target Market, Revenue Model, etc.
  - **E-commerce**: Product Strategy, Marketing Channels, Operations, etc.
  - **Mobile Apps**: User Experience, Technical Architecture, Monetization, etc.
  - **SaaS**: Product Development, Customer Acquisition, Technical Infrastructure, etc.
  - **Default**: General business categories for any other type

### 3. Webhook Response Node
- Returns properly formatted JSON response
- Includes CORS headers for frontend integration
- Matches the exact format expected by your React components

## 📊 Example Response Structure

```json
{
  "idea": "AI-powered gym coach app",
  "nodes": [
    {
      "id": 1,
      "title": "Technology Stack",
      "children": [
        { "id": 2, "title": "Machine Learning", "children": [] },
        { "id": 3, "title": "Cloud Infrastructure", "children": [] },
        { "id": 4, "title": "API Development", "children": [] },
        { "id": 5, "title": "Data Processing", "children": [] }
      ]
    },
    {
      "id": 6,
      "title": "Target Market",
      "children": [
        { "id": 7, "title": "Enterprise Clients", "children": [] },
        { "id": 8, "title": "Individual Users", "children": [] },
        { "id": 9, "title": "Developers", "children": [] },
        { "id": 10, "title": "Small Businesses", "children": [] }
      ]
    }
  ]
}
```

## 🧪 Testing the Workflow

### Option 1: Test from n8n Interface
1. Click **"Test workflow"** in n8n
2. Use the manual trigger
3. Provide test data: `{"idea": "AI fitness app"}`

### Option 2: Test with curl
```powershell
curl -X POST http://localhost:5678/webhook/mindmap `
  -H "Content-Type: application/json" `
  -d '{"idea": "AI-powered fitness coaching app"}'
```

### Option 3: Test from your React app
Once n8n is running, your mastermind.ai app will automatically use the webhook!

## 🎯 Supported Business Idea Types

The workflow intelligently categorizes ideas based on keywords:

| **Keywords** | **Template Used** | **Categories Generated** |
|-------------|------------------|-------------------------|
| ai, artificial intelligence, ml | AI Template | Technology Stack, Target Market, Revenue Model, Competitive Analysis, Development Roadmap |
| ecommerce, online store, marketplace | E-commerce Template | Product Strategy, Marketing Channels, Operations, Technology, Financial Planning |
| app, mobile, ios, android | App Template | User Experience, Technical Architecture, Monetization, Growth Strategy, Market Research |
| saas, platform, dashboard | SaaS Template | Product Development, Customer Acquisition, Technical Infrastructure, Business Model, Scaling Strategy |
| *any other* | Default Template | Market Analysis, Business Model, Operations, Marketing Strategy, Financial Planning |

## 🔗 Integration Notes

- The webhook URL `http://localhost:5678/webhook/mindmap` is already configured in your `mindmapService.ts`
- CORS headers are included for seamless frontend integration
- Response format matches exactly what your React components expect
- Fallback to mock data is handled in your service layer if n8n is unavailable

## 🛠️ Customization

To modify the mind map categories or add new templates:
1. Open the workflow in n8n
2. Edit the "Generate Mind Map" node
3. Modify the `templates` object in the JavaScript code
4. Save and test the workflow

## ⚡ Production Deployment

For production use:
- Deploy n8n to a cloud service (Heroku, DigitalOcean, AWS)
- Update the `n8nApiUrl` in your `mindmapService.ts`
- Consider adding authentication to the webhook
- Add more sophisticated AI integration (OpenAI, etc.) for dynamic content generation

## 📞 Support

If you encounter issues:
1. Ensure n8n is running on port 5678
2. Check the workflow is activated
3. Verify the webhook URL in browser: `http://localhost:5678/webhook/mindmap`
4. Check n8n logs for any errors
