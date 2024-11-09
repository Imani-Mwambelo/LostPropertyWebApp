# backend/lost/routers/upload.py
from datetime import timedelta
from fastapi import APIRouter, HTTPException, UploadFile, File, status
from fastapi.responses import JSONResponse
from ..config import settings
import os

# import firebase_admin
# from firebase_admin import credentials, storage

router = APIRouter(tags=['Upload'])

# Commented out Firebase implementation

# cred = credentials.Certificate("./upload-570d7-firebase-adminsdk-mvzo7-dcc50a7136.json")
# firebase_admin.initialize_app(cred,{"storageBucket":"upload-570d7.appspot.com"})


# @router.post("/api/upload")
# async def handleUpload(file:UploadFile=File(...)):
#     if not file.filename.endswith(('.jpg', '.jpeg', '.png')):
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only images are allowed")
#     bucket=storage.bucket()
#     blob=bucket.blob(file.filename)
#     blob.upload_from_string(await file.read(), content_type=file.content_type)

#     url=blob.generate_signed_url(expiration=timedelta(hours=1))
    
#     return {"image_url":url}



router = APIRouter(tags=['Upload'])
UPLOAD_FOLDER = './lost/uploads/'
print(UPLOAD_FOLDER)

# Ensure the directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/api/upload")
async def handleUpload(file: UploadFile = File(...)):
    if not file.filename.endswith(('.jpg', '.jpeg', '.png')):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only images are allowed")

    file_path = os.path.join('/lost/uploads/', file.filename)
    
    # Write the file to the local uploads directory
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return {"image_url": file_path}
