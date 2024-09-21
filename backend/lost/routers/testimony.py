from typing import Optional
from fastapi import FastAPI, Response, status, HTTPException,Depends,APIRouter

from sqlalchemy.orm import Session
from sqlalchemy import func

from lost import oauth2
from .. import models, schemas, utils
from ..database import engine, get_db

router=APIRouter(tags=['Testimonies'])

@router.get("/testimonies", response_model=list[schemas.TestimonyOut])
def get_testimonies(db: Session = Depends(get_db), user_id = Depends(oauth2.get_current_user)):
    testimony_query = db.query(models.Testimony)
    
    tastimonies = testimony_query.all()
    return tastimonies


@router.post("/testimonies", response_model=schemas.TestimonyOut)
def create_testimony(testimony:schemas.TestimonyCreate, db: Session=Depends(get_db), user_id=Depends(oauth2.get_current_user)):
    # 
    
    new_testimony=models.Testimony(owner_id=user_id, **testimony.model_dump()) 
    #new_post['owner_id']=user_id
    db.add(new_testimony)
    db.commit()
    db.refresh(new_testimony)
    return new_testimony


@router.get("/testimonies/{id}",response_model=schemas.TestimonyOut)
def get_testimony(id:int, db: Session=Depends(get_db), user_id=Depends(oauth2.get_current_user)):
    # post=find_post(id)
    print(user_id)
    test_query=db.query(models.Testimony).filter(models.Testimony.id==id)
    test=test_query.first()

    #post=db.query(models.Post).filter(models.Post.id==id).first()
    if not test:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"post with id {id} do not exist")
        
    return test
    
@router.delete("/testimonies/{id}")
def delete_testimony(id: int, db: Session=Depends(get_db), user_id=Depends(oauth2.get_current_user)):
    #print(user_id)
    test_query=db.query(models.Testimony).filter(models.Testimony.id==id)
    test=test_query.first()
    
     #cursor.execute("DELETE FROM posts WHERE id=%s  returning *", (id,))
     #post=cursor.fetchone()
     #conn.commit()
    
       
    if test is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"post with id {id} do not exist")

    if test.owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform the requested action") 
    test_query.delete(synchronize_session=False)
    db.commit()
    raise HTTPException(status_code=status.HTTP_204_NO_CONTENT,detail=f"post with id {id} was successfully deleted")
    
        
@router.put("/testimonies/{id}", response_model=schemas.Post)
def update_testimony(id:int,testimony:schemas.TestimonyCreate, db: Session=Depends(get_db), user_id=Depends(oauth2.get_current_user)):
    print(user_id)
    # cursor.execute("UPDATE posts SET title= %s, content=%s, published=%s WHERE id=%s RETURNING *", (post.title, post.content,post.published,id))
    # updated_post=cursor.fetchone()
    # conn.commit()
    test_query=db.query(models.Testimony).filter(models.Testimony.id==id)
    updated_test=test_query.first()
    if updated_test is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"post with id {id} do not exist")
    
    if updated_test.owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform the requested action") 
    test_query.update(testimony.model_dump(), synchronize_session=False)
    db.commit()
    return updated_test
