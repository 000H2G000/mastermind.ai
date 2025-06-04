# Test script for n8n workflow
# This script tests the n8n webhook endpoint

Write-Host "Testing n8n workflow endpoint..." -ForegroundColor Green

# Test data
$testIdeas = @(
    "AI-powered e-commerce platform",
    "Mobile app for food delivery", 
    "SaaS project management tool",
    "Default business idea"
)

foreach ($idea in $testIdeas) {
    Write-Host "`nTesting idea: $idea" -ForegroundColor Yellow
    
    $body = @{
        idea = $idea
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5678/webhook-test/mindmap" -Method POST -Body $body -ContentType "application/json"
        
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor Cyan
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host
        
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $errorResponse = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorResponse)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error Body: $errorBody" -ForegroundColor Red
        }
    }
    
    Start-Sleep -Seconds 1
}

Write-Host "`nTest completed!" -ForegroundColor Green
