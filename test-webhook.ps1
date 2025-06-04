# Test script for n8n webhook
Write-        $response = Invoke-RestMethod -Uri "http://localhost:5678/webhook-test/mindmap" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 5ost "Testing n8n Mastermind AI Webhook..." -ForegroundColor Green

# Test cases
$testCases = @(
    @{
        name = "AI/ML Business Idea"
        idea = "AI-powered customer service chatbot for e-commerce"
    },
    @{
        name = "E-commerce Business Idea"
        idea = "Online marketplace for handmade crafts with social features"
    },
    @{
        name = "SaaS Business Idea"
        idea = "Project management platform with team collaboration tools"
    },
    @{
        name = "Mobile App Business Idea"
        idea = "Fitness tracking app with social challenges and rewards"
    },
    @{
        name = "Generic Business Idea"
        idea = "Local food delivery service with eco-friendly packaging"
    }
)

foreach ($test in $testCases) {
    Write-Host "`n--- Testing: $($test.name) ---" -ForegroundColor Yellow
    
    $body = @{
        idea = $test.idea
    } | ConvertTo-Json
    
    try {        Write-Host "Sending request to: http://localhost:5678/webhook-test/mindmap"
        Write-Host "Request body: $body"
        
        $response = Invoke-RestMethod -Uri "http://localhost:5678/webhook-test/mindmap" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 10
        
        if ($response) {
            Write-Host "✅ SUCCESS: Received response" -ForegroundColor Green
            Write-Host "Response:" -ForegroundColor Cyan
            $response | ConvertTo-Json -Depth 10 | Write-Host
            
            # Validate response structure
            if ($response.idea -and $response.nodes) {
                Write-Host "✅ Response has correct structure (idea + nodes)" -ForegroundColor Green
                Write-Host "   - Idea: $($response.idea)"
                Write-Host "   - Number of nodes: $($response.nodes.Count)"
            } else {
                Write-Host "❌ Response structure is invalid" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Empty response received" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Message -like "*404*") {
            Write-Host "   → Webhook endpoint not found. Make sure workflow is imported and active." -ForegroundColor Yellow
        } elseif ($_.Exception.Message -like "*connection*") {
            Write-Host "   → Cannot connect to n8n. Make sure n8n is running on port 5678." -ForegroundColor Yellow
        }
    }
    
    Start-Sleep -Seconds 2
}

Write-Host "`n--- Test Summary ---" -ForegroundColor Green
Write-Host "If you see 404 errors, you need to:"
Write-Host "1. Open n8n at http://localhost:5678"
Write-Host "2. Import the workflow from mastermind-workflow.json"
Write-Host "3. Activate the workflow"
Write-Host "4. Run this test script again"
