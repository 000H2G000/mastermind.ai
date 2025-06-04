from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import httpx
from datetime import datetime

from app.models import get_db
from app.schemas import (
    N8NMindMapResponse, MindMapResponse, GenerateMindMapRequest,
    MindMapSummaryResponse, BusinessSessionResponse
)
from app.crud import (
    create_mindmap_from_n8n_response, get_mindmap, get_mindmaps_by_session,
    get_recent_mindmaps, get_or_create_session, increment_session_queries,
    get_session_stats, get_mindmap_analytics
)

router = APIRouter()

# N8N API Configuration
N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/mindmap"
REQUEST_TIMEOUT = 30  # seconds

@router.post("/generate", response_model=MindMapResponse)
async def generate_mindmap(
    request: GenerateMindMapRequest,
    http_request: Request,
    db: Session = Depends(get_db)
):
    """
    Generate a mind map by calling the n8n API and store the result
    """
    try:
        # Generate or use provided session ID
        session_id = request.session_id or str(uuid.uuid4())
        
        # Get client info
        client_ip = http_request.client.host if http_request.client else None
        user_agent = http_request.headers.get("user-agent")
        
        # Get or create session
        session = get_or_create_session(db, session_id, client_ip, user_agent)
        
        # Call n8n API
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            n8n_response = await client.post(
                N8N_WEBHOOK_URL,
                json={"idea": request.idea},
                headers={"Content-Type": "application/json"}
            )
            
            if n8n_response.status_code != 200:
                raise HTTPException(
                    status_code=500,
                    detail=f"N8N API error: {n8n_response.status_code} - {n8n_response.text}"
                )
            
            # Parse n8n response
            n8n_data = n8n_response.json()
            
            # Validate response structure
            if not isinstance(n8n_data, dict) or "idea" not in n8n_data or "nodes" not in n8n_data:
                raise HTTPException(
                    status_code=500,
                    detail="Invalid response format from N8N API"
                )
            
            # Create validated response object
            validated_response = N8NMindMapResponse(**n8n_data)
            
            # Store in database
            db_mindmap = create_mindmap_from_n8n_response(db, validated_response, session_id)
            
            # Increment session query count
            increment_session_queries(db, session_id)
            
            return MindMapResponse.from_orm(db_mindmap)
            
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=408,
            detail="Request to N8N API timed out. Please try again."
        )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Failed to connect to N8N API: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/mindmap/{mindmap_id}", response_model=MindMapResponse)
async def get_mindmap_by_id(mindmap_id: int, db: Session = Depends(get_db)):
    """
    Get a specific mind map by ID
    """
    mindmap = get_mindmap(db, mindmap_id)
    if not mindmap:
        raise HTTPException(status_code=404, detail="Mind map not found")
    return MindMapResponse.from_orm(mindmap)

@router.get("/session/{session_id}/mindmaps", response_model=List[MindMapSummaryResponse])
async def get_session_mindmaps(
    session_id: str,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Get all mind maps for a specific session
    """
    mindmaps = get_mindmaps_by_session(db, session_id, skip, limit)
    
    # Convert to summary response
    summaries = []
    for mindmap in mindmaps:
        summaries.append(MindMapSummaryResponse(
            id=mindmap.id,
            idea=mindmap.idea,
            created_at=mindmap.created_at,
            node_count=len(mindmap.nodes),
            session_id=mindmap.session_id
        ))
    
    return summaries

@router.get("/recent", response_model=List[MindMapSummaryResponse])
async def get_recent_mindmaps_endpoint(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Get recently created mind maps
    """
    mindmaps = get_recent_mindmaps(db, skip, limit)
    
    summaries = []
    for mindmap in mindmaps:
        summaries.append(MindMapSummaryResponse(
            id=mindmap.id,
            idea=mindmap.idea,
            created_at=mindmap.created_at,
            node_count=len(mindmap.nodes),
            session_id=mindmap.session_id
        ))
    
    return summaries

@router.get("/session/{session_id}/stats")
async def get_session_statistics(session_id: str, db: Session = Depends(get_db)):
    """
    Get statistics for a specific session
    """
    stats = get_session_stats(db, session_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Session not found")
    return stats

@router.get("/analytics")
async def get_analytics(db: Session = Depends(get_db)):
    """
    Get overall analytics for mind map usage
    """
    return get_mindmap_analytics(db)

@router.post("/test-n8n")
async def test_n8n_connection():
    """
    Test the connection to n8n API
    """
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                N8N_WEBHOOK_URL,
                json={"idea": "Test connection"},
                headers={"Content-Type": "application/json"}
            )
            
            return {
                "status": "success",
                "n8n_status_code": response.status_code,
                "n8n_response_preview": str(response.text)[:200] + "..." if len(response.text) > 200 else response.text,
                "timestamp": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

# Health check endpoint
@router.get("/health")
async def health_check():
    """
    Simple health check endpoint
    """
    return {
        "status": "healthy",
        "service": "mindmap-api"
    }
