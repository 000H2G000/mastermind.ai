from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, create_engine, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from app.config.config import DATABASE_URL

Base = declarative_base()

# Example model - you can modify this based on your needs
class Item(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Another example model - User
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Mind Map models for storing n8n API responses
class MindMap(Base):
    __tablename__ = "mindmaps"
    
    id = Column(Integer, primary_key=True, index=True)
    idea = Column(String(500), nullable=False, index=True)
    session_id = Column(String(100), nullable=True, index=True)  # For grouping related queries
    raw_data = Column(JSON, nullable=False)  # Store the complete n8n response
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship to nodes
    nodes = relationship("MindMapNode", back_populates="mindmap", cascade="all, delete-orphan")

class MindMapNode(Base):
    __tablename__ = "mindmap_nodes"
    
    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(Integer, nullable=False)  # The ID from n8n response
    title = Column(String(255), nullable=False)
    parent_id = Column(Integer, ForeignKey("mindmap_nodes.id"), nullable=True)
    mindmap_id = Column(Integer, ForeignKey("mindmaps.id"), nullable=False)
    level = Column(Integer, default=0)  # 0 = root, 1 = first level, etc.
    order_index = Column(Integer, default=0)  # Order within the same level
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    mindmap = relationship("MindMap", back_populates="nodes")
    parent = relationship("MindMapNode", remote_side=[id], back_populates="children")
    children = relationship("MindMapNode", back_populates="parent", cascade="all, delete-orphan")

# Business Idea Session model to track user sessions
class BusinessSession(Base):
    __tablename__ = "business_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), unique=True, nullable=False, index=True)
    user_ip = Column(String(45), nullable=True)  # IPv4/IPv6 support
    user_agent = Column(Text, nullable=True)
    total_queries = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)

# Database setup
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
