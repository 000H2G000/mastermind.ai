from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models import Item, User, MindMap, MindMapNode, BusinessSession
from app.schemas import (
    ItemCreate, ItemUpdate, UserCreate, UserUpdate,
    MindMapCreate, MindMapNodeCreate, BusinessSessionCreate,
    N8NMindMapResponse
)

# Item CRUD operations
def get_item(db: Session, item_id: int) -> Optional[Item]:
    return db.query(Item).filter(Item.id == item_id).first()

def get_items(db: Session, skip: int = 0, limit: int = 100) -> List[Item]:
    return db.query(Item).offset(skip).limit(limit).all()

def create_item(db: Session, item: ItemCreate) -> Item:
    db_item = Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(db: Session, item_id: int, item_update: ItemUpdate) -> Optional[Item]:
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item:
        update_data = item_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_item, field, value)
        db.commit()
        db.refresh(db_item)
    return db_item

def delete_item(db: Session, item_id: int) -> bool:
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False

# User CRUD operations
def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate) -> User:
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        update_data = user_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int) -> bool:
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

# Mind Map CRUD operations
def create_mindmap(db: Session, mindmap_data: MindMapCreate) -> MindMap:
    """Create a new mind map from n8n response data"""
    db_mindmap = MindMap(**mindmap_data.dict())
    db.add(db_mindmap)
    db.commit()
    db.refresh(db_mindmap)
    return db_mindmap

def get_mindmap(db: Session, mindmap_id: int) -> Optional[MindMap]:
    """Get a mind map by ID with all its nodes"""
    return db.query(MindMap).filter(MindMap.id == mindmap_id).first()

def get_mindmaps_by_session(db: Session, session_id: str, skip: int = 0, limit: int = 100) -> List[MindMap]:
    """Get all mind maps for a specific session"""
    return db.query(MindMap).filter(MindMap.session_id == session_id).offset(skip).limit(limit).all()

def get_recent_mindmaps(db: Session, skip: int = 0, limit: int = 20) -> List[MindMap]:
    """Get recently created mind maps"""
    return db.query(MindMap).order_by(MindMap.created_at.desc()).offset(skip).limit(limit).all()

def create_mindmap_from_n8n_response(db: Session, n8n_response: N8NMindMapResponse, session_id: Optional[str] = None) -> MindMap:
    """Process n8n response and create mind map with nodes"""
    
    # Create the main mind map record
    mindmap_create = MindMapCreate(
        idea=n8n_response.idea,
        session_id=session_id,
        raw_data=n8n_response.dict()
    )
    db_mindmap = create_mindmap(db, mindmap_create)
    
    # Process and create nodes recursively
    def create_nodes_recursive(nodes: List, parent_id: Optional[int] = None, level: int = 0):
        for index, node in enumerate(nodes):
            # Create the node
            db_node = MindMapNode(
                node_id=node.id,
                title=node.title,
                parent_id=parent_id,
                mindmap_id=db_mindmap.id,
                level=level,
                order_index=index
            )
            db.add(db_node)
            db.commit()
            db.refresh(db_node)
            
            # Recursively create children
            if node.children:
                create_nodes_recursive(node.children, db_node.id, level + 1)
    
    # Create all nodes
    create_nodes_recursive(n8n_response.nodes)
    
    # Refresh to get all related data
    db.refresh(db_mindmap)
    return db_mindmap

# Mind Map Node CRUD operations
def get_mindmap_nodes(db: Session, mindmap_id: int) -> List[MindMapNode]:
    """Get all nodes for a specific mind map, ordered by level and order_index"""
    return db.query(MindMapNode).filter(
        MindMapNode.mindmap_id == mindmap_id
    ).order_by(MindMapNode.level, MindMapNode.order_index).all()

def get_mindmap_root_nodes(db: Session, mindmap_id: int) -> List[MindMapNode]:
    """Get root level nodes for a mind map"""
    return db.query(MindMapNode).filter(
        MindMapNode.mindmap_id == mindmap_id,
        MindMapNode.parent_id.is_(None)
    ).order_by(MindMapNode.order_index).all()

# Business Session CRUD operations
def get_or_create_session(db: Session, session_id: str, user_ip: Optional[str] = None, user_agent: Optional[str] = None) -> BusinessSession:
    """Get existing session or create a new one"""
    db_session = db.query(BusinessSession).filter(BusinessSession.session_id == session_id).first()
    
    if not db_session:
        session_create = BusinessSessionCreate(
            session_id=session_id,
            user_ip=user_ip,
            user_agent=user_agent
        )
        db_session = BusinessSession(**session_create.dict())
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
    else:
        # Update last activity
        db_session.last_activity = datetime.utcnow()
        db.commit()
        db.refresh(db_session)
    
    return db_session

def increment_session_queries(db: Session, session_id: str) -> BusinessSession:
    """Increment the query count for a session"""
    db_session = db.query(BusinessSession).filter(BusinessSession.session_id == session_id).first()
    if db_session:
        db_session.total_queries += 1
        db_session.last_activity = datetime.utcnow()
        db.commit()
        db.refresh(db_session)
    return db_session

def get_session_stats(db: Session, session_id: str) -> Dict[str, Any]:
    """Get statistics for a specific session"""
    db_session = db.query(BusinessSession).filter(BusinessSession.session_id == session_id).first()
    if not db_session:
        return {}
    
    mindmap_count = db.query(MindMap).filter(MindMap.session_id == session_id).count()
    
    return {
        "session_id": session_id,
        "total_queries": db_session.total_queries,
        "mindmap_count": mindmap_count,
        "created_at": db_session.created_at,
        "last_activity": db_session.last_activity
    }

# Analytics and reporting
def get_mindmap_analytics(db: Session) -> Dict[str, Any]:
    """Get overall analytics for mind map usage"""
    total_mindmaps = db.query(MindMap).count()
    total_sessions = db.query(BusinessSession).count()
    total_nodes = db.query(MindMapNode).count()
    
    # Get most common idea keywords
    mindmaps = db.query(MindMap).all()
    idea_keywords = {}
    for mindmap in mindmaps:
        words = mindmap.idea.lower().split()
        for word in words:
            if len(word) > 3:  # Only count words longer than 3 characters
                idea_keywords[word] = idea_keywords.get(word, 0) + 1
    
    top_keywords = sorted(idea_keywords.items(), key=lambda x: x[1], reverse=True)[:10]
    
    return {
        "total_mindmaps": total_mindmaps,
        "total_sessions": total_sessions,
        "total_nodes": total_nodes,
        "average_nodes_per_mindmap": total_nodes / total_mindmaps if total_mindmaps > 0 else 0,
        "top_idea_keywords": top_keywords
    }
