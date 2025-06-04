from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

# Item schemas
class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_active: bool = True

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class Item(ItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# User schemas
class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

# Mind Map schemas
class MindMapNodeBase(BaseModel):
    node_id: int
    title: str
    level: int = 0
    order_index: int = 0

class MindMapNodeCreate(MindMapNodeBase):
    parent_id: Optional[int] = None

class MindMapNodeResponse(MindMapNodeBase):
    id: int
    parent_id: Optional[int] = None
    mindmap_id: int
    created_at: datetime
    children: List['MindMapNodeResponse'] = []
    
    class Config:
        orm_mode = True

class MindMapBase(BaseModel):
    idea: str
    session_id: Optional[str] = None

class MindMapCreate(MindMapBase):
    raw_data: Dict[str, Any]

class MindMapResponse(MindMapBase):
    id: int
    raw_data: Dict[str, Any]
    created_at: datetime
    updated_at: Optional[datetime] = None
    nodes: List[MindMapNodeResponse] = []
    
    class Config:
        orm_mode = True

# N8N API Response schemas (for processing incoming data)
class N8NNode(BaseModel):
    id: int
    title: str
    children: List['N8NNode'] = []

class N8NMindMapResponse(BaseModel):
    idea: str
    nodes: List[N8NNode]

# Business Session schemas
class BusinessSessionBase(BaseModel):
    session_id: str
    user_ip: Optional[str] = None
    user_agent: Optional[str] = None

class BusinessSessionCreate(BusinessSessionBase):
    pass

class BusinessSessionResponse(BusinessSessionBase):
    id: int
    total_queries: int
    created_at: datetime
    last_activity: datetime
    
    class Config:
        orm_mode = True

# Request/Response schemas for API endpoints
class GenerateMindMapRequest(BaseModel):
    idea: str
    session_id: Optional[str] = None

class MindMapSummaryResponse(BaseModel):
    id: int
    idea: str
    created_at: datetime
    node_count: int
    session_id: Optional[str] = None

# Update forward references
MindMapNodeResponse.update_forward_refs()
N8NNode.update_forward_refs()
