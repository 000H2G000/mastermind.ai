# 🚀 Postman Testing Guide for n8n Mastermind Workflow

## 📋 Prerequisites

1. **n8n is running** on `http://localhost:5678`
2. **Workflow is imported and activated** in n8n
3. **Postman is installed** and ready

## 🎯 Test Setup

### **Request Configuration**

**Method:** `POST`
**URL:** `http://localhost:5678/webhook/mindmap`

### **Headers**
```
Content-Type: application/json
```

### **Body (raw JSON)**
```json
{
  "idea": "AI-powered fitness coach app"
}
```

## 🧪 Test Cases

### **Test 1: AI/ML Business Idea**
```json
{
  "idea": "AI-powered fitness coach app that uses machine learning to create personalized workout plans"
}
```

**Expected Response:**
```json
{
  "idea": "AI-powered fitness coach app that uses machine learning to create personalized workout plans",
  "nodes": [
    {
      "id": 1,
      "title": "Technology Stack",
      "children": [
        {"id": 2, "title": "Machine Learning", "children": []},
        {"id": 3, "title": "Cloud Infrastructure", "children": []},
        {"id": 4, "title": "API Development", "children": []},
        {"id": 5, "title": "Data Processing", "children": []}
      ]
    },
    {
      "id": 6,
      "title": "Target Market",
      "children": [
        {"id": 7, "title": "Enterprise Clients", "children": []},
        {"id": 8, "title": "Individual Users", "children": []},
        {"id": 9, "title": "Developers", "children": []},
        {"id": 10, "title": "Small Businesses", "children": []}
      ]
    }
    // ... more categories
  ]
}
```

### **Test 2: E-commerce Business Idea**
```json
{
  "idea": "Online marketplace for handmade crafts and artisan products"
}
```

### **Test 3: SaaS Business Idea**
```json
{
  "idea": "SaaS platform for project management and team collaboration"
}
```

### **Test 4: Mobile App Business Idea**
```json
{
  "idea": "Mobile app for food delivery and restaurant ordering"
}
```

### **Test 5: Default Template Test**
```json
{
  "idea": "Organic farm-to-table restaurant chain"
}
```

## ✅ Validation Checklist

For each test, verify:

- [ ] **Status Code**: 200 OK
- [ ] **Content-Type**: application/json
- [ ] **Response Structure**: Contains `idea` and `nodes` fields
- [ ] **Node Structure**: Each node has `id`, `title`, and `children`
- [ ] **Correct Template**: Appropriate categories based on business type
- [ ] **CORS Headers**: Present for browser compatibility

## 🔧 Troubleshooting

### **Common Issues:**

**1. Connection Refused**
- Ensure n8n is running: `n8n start`
- Check URL: `http://localhost:5678/webhook/mindmap`

**2. 404 Not Found**
- Verify workflow is activated in n8n
- Check webhook path is set to "mindmap"

**3. 500 Internal Server Error**
- Check n8n workflow logs
- Verify JavaScript code in the workflow

**4. CORS Issues (for browser)**
- Response headers should include CORS settings
- Check "Access-Control-Allow-Origin: *" header

### **Response Headers to Verify:**
```
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## 📊 Expected Performance

- **Response Time**: < 2 seconds
- **Response Size**: ~2-5KB depending on idea complexity
- **Success Rate**: 100% for valid JSON input

## 🎯 Integration Test

Once Postman tests pass, test the full integration:

1. **Start your React app**: `npm run dev`
2. **Navigate to**: `http://localhost:5173`
3. **Enter a business idea** on the landing page
4. **Verify**: Mind map generates with real n8n data

## 💡 Pro Tips

1. **Save requests** in Postman for easy re-testing
2. **Use environments** to switch between development/production URLs
3. **Set up automated tests** using Postman's test scripts
4. **Monitor response times** to ensure good user experience

---

Happy testing! 🚀 Your n8n workflow should now generate intelligent mind maps for any business idea.
