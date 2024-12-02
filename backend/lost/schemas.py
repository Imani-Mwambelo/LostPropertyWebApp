from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    username: str
    email: EmailStr
    password: str


    

class UserCreate(UserBase):
    pass

class User(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PostBase(BaseModel):
    title: str
    owner_name: str 
    location: str  # Location where the item was found
    phone_number: str  # Phone number for contact
    description: Optional[str] = None

    class Config:
        from_attributes = True
  

class PostCreate(PostBase):  
    pass

class Post(PostBase):
    id: int
    created_at: datetime
    owner_id: int
    owner: User

    class Config:
        from_attributes = True

class PostOut(BaseModel):
    Post: Post
    votes: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[int] = None

class Vote(BaseModel):
    post_id: int
    dir: int = Field(..., ge=0, le=1)

class TestimonyCreate(BaseModel):
    
    testimony: str

class TestimonyOut(TestimonyCreate):
    id:int
    owner_id: int
    owner: User


    class Config:
        from_attributes = True
   