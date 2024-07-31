from typing import Optional
from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter, File, UploadFile, Form
import os
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func

from .. import models, schemas, oauth2, utils
from ..database import engine, get_db


router = APIRouter(tags=['Posts'])

UPLOAD_DIRECTORY = "./uploads"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)



@router.get("/posts", response_model=list[schemas.PostOut])
def get_posts(db: Session = Depends(get_db), limit: int = 10, skip: int = 0, search: Optional[str] = ""):
    posts_query = db.query(models.Post, func.count(models.Vote.post_id).label("votes")).join(
        models.Vote, models.Post.id == models.Vote.post_id, isouter=True
    ).group_by(models.Post.id).filter(
        models.Post.title.contains(search) | models.Post.description.contains(search) | models.Post.location.contains(search)
    ).order_by((models.Post.created_at).desc).limit(limit).offset(skip)
    
    posts = posts_query.all()
    return posts

@router.get("/posts/by-owner", response_model=list[schemas.PostOut])
def get_posts(db: Session = Depends(get_db), user_id = Depends(oauth2.get_current_user)):
    posts_query = db.query(models.Post, func.count(models.Vote.post_id).label("votes")).join(
        models.Vote, models.Post.id == models.Vote.post_id, isouter=True
    ).group_by(models.Post.id).filter(models.Post.owner_id==user_id).order_by((models.Post.created_at).desc)
    
    posts = posts_query.all()
    return posts


@router.post("/posts", response_model=schemas.Post)
async def create_post(
    title: str = Form(...),
    location: str = Form(...),
    phone_number: str = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id = Depends(oauth2.get_current_user)
):
    file_location = f"{UPLOAD_DIRECTORY}/{file.filename}"
    with open(file_location, "wb") as buffer:
        buffer.write(await file.read())
    
    image_url = f"/uploads/{file.filename}"  # Adjust this based on your server setup

    new_post = models.Post(
        title=title,
        image_url=image_url,
        location=location,
        phone_number=phone_number,
        description=description,
        owner_id=user_id
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post


@router.get("/posts/{id}", response_model=schemas.PostOut)
def get_post(id: int, db: Session = Depends(get_db), user_id = Depends(oauth2.get_current_user)):
    posts_query = db.query(models.Post, func.count(models.Vote.post_id).label("votes")).join(
        models.Vote, models.Post.id == models.Vote.post_id, isouter=True
    ).group_by(models.Post.id).filter(models.Post.id == id)
    post = posts_query.first()

    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id {id} does not exist")
        
    return post
    
@router.delete("/posts/{id}")
def delete_post(id: int, db: Session = Depends(get_db), user_id = Depends(oauth2.get_current_user)):
    post_query = db.query(models.Post).filter(models.Post.id == id)
    post = post_query.first()
    
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id {id} does not exist")

    if post.owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform the requested action") 
    post_query.delete(synchronize_session=False)
    db.commit()
    raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail=f"post with id {id} was successfully deleted")
    
        
@router.put("/posts/{id}", response_model=schemas.Post)
async def update_post(
    id: int,
    title: str = Form(...),
    location: str = Form(...),
    phone_number: str = Form(...),
    description: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user_id = Depends(oauth2.get_current_user)
):
    post_query = db.query(models.Post).filter(models.Post.id == id)
    updated_post = post_query.first()
    if updated_post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id {id} does not exist")

    if updated_post.owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform the requested action")

    if file:
        file_location = f"{UPLOAD_DIRECTORY}/{file.filename}"
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())
        image_url = f"/uploads/{file.filename}"  # Adjust this based on your server setup
    else:
        image_url = updated_post.image_url

    updated_post_data = {
        "title": title,
        "location": location,
        "phone_number": phone_number,
        "description": description,
        "image_url": image_url
    }

    post_query.update(updated_post_data, synchronize_session=False)
    db.commit()
    return updated_post
