from fastapi import FastAPI, Response, status, HTTPException,Depends

from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from .config import settings

from lost import auth
from . import models, schemas, utils
from .database import engine, get_db
from .routers import post, user,vote, testimony, upload
from fastapi.middleware.cors import CORSMiddleware


models.Base.metadata.create_all(bind=engine)
#Hashing user password

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL for better security
    allow_credentials=True,
    allow_methods=["*"],  # Ensure all necessary HTTP methods are allowed
    allow_headers=["Content-Type", "Authorization", "ngrok-skip-browser-warning"],  # Include other necessary headers
)




app.include_router(user.router)
app.include_router(post.router)
app.include_router(testimony.router)
app.include_router(vote.router)
app.include_router(auth.router)
app.include_router(upload.router)

@app.get("/")
def root():
    return{"message":"Welcome to my API for social media web app for lost properties"}







# try:
#         conn= psycopg2.connect("host='localhost' dbname='fastapi' user='postgres' password='#botiz'", cursor_factory=RealDictCursor )
#         cursor=conn.cursor()
#         print("Database was connected successfully!")
# except Exception as error:
#         print("Database connection failed")
#         print(error)
  



# def find_post(id):
#     cursor.execute("SELECT * FROM posts WHERE id= %s", (id,))
#     post=cursor.fetchone()
#     return post 

    
           
       
# def find_post_index(id):
#     for i, post in enumerate(my_posts):
#         if post['id']== id:
#             return i
#         else:
#             print("Post not found with ID:", id)
    
      





     



    
        


