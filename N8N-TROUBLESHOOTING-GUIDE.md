# N8N Workflow Troubleshooting Guide

## Current Issue Analysis

Based on the testing, we know:
1. ✅ N8N is running on port 5678
2. ✅ First two nodes execute successfully  
3. ❌ Response node is not working properly

## Step-by-Step Debugging

### Step 1: Check Workflow Import
1. Open n8n at `http://localhost:5678`
2. Go to Workflows
3. Click "Import from File"
4. Select `mastermind-workflow.json`
5. **IMPORTANT**: After import, click "Save" and then "Activate"

### Step 2: Test with Debug Workflow
1. Import the `mastermind-debug-workflow.json` (simpler version)
2. Activate it
3. Test endpoint: `http://localhost:5678/webhook-test/mindmap-debug`

### Step 3: Check Node Connections
In the n8n workflow editor:
1. Verify the flow: Webhook → Generate Mind Map → Respond to Webhook
2. Make sure there are no broken connections (red lines)
3. Click on each connection line to verify it's properly connected

### Step 4: Fix Data Access Issue
The main issue is in the JavaScript code. Replace this line:
```javascript
const idea = $input.first().json.idea || 'Business Idea';
```

With this line:
```javascript
const idea = $input.first().json.body.idea || 'Business Idea';
```

### Step 5: Test Commands

**PowerShell Test:**
```powershell
$body = '{"idea": "AI chatbot for customer service"}'
Invoke-RestMethod -Uri "http://localhost:5678/webhook-test/mindmap" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response Format:**
```json
{
  "idea": "AI chatbot for customer service",
  "nodes": [
    {
      "id": 1,
      "title": "Technology Stack",
      "children": [...]
    }
  ]
}
```

### Step 6: Common Issues & Solutions

**Issue: Empty Response**
- Solution: Check if workflow is activated
- Solution: Verify node connections are correct

**Issue: 404 Error**
- Solution: Make sure webhook path matches: `/mindmap` not `/webhook/mindmap`
- Solution: Verify workflow is saved and active

**Issue: Timeout/Hanging**
- Solution: Check JavaScript code for infinite loops
- Solution: Use debug workflow first

**Issue: Wrong Data Structure**
- Solution: Use `$input.first().json.body.idea` instead of `$input.first().json.idea`

### Step 7: Manual Testing in N8N
1. In n8n, click on the Webhook node
2. Click "Test step" or "Execute Node"
3. Send a manual test request
4. Check the output of each node in sequence

### Step 8: Console Logs
Check the n8n console output for any error messages when the workflow executes.

## Quick Fix Checklist
- [ ] Workflow imported and saved
- [ ] Workflow activated (green toggle)
- [ ] All nodes connected properly
- [ ] JavaScript uses `$input.first().json.body.idea`
- [ ] Connection references correct node name "Respond to Webhook"
- [ ] Test with simple request first

## Test URL
After fixes, test with: `http://localhost:5678/webhook-test/mindmap`
