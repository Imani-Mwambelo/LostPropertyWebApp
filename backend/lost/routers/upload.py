# backend/lost/routers/upload.py
from datetime import timedelta
from fastapi import APIRouter, HTTPException, UploadFile, File, status
from fastapi.responses import JSONResponse
from ..config import settings
import firebase_admin
from firebase_admin import credentials, storage

router = APIRouter(tags=['Upload'])



cred = credentials.Certificate(f"{settings.file_upload_key}")
firebase_admin.initialize_app(cred,{"storageBucket":"fileupload-158bb.appspot.com"})


@router.post("/api/upload")
async def handleUpload(file:UploadFile=File(...)):
    if not file.filename.endswith(('.jpg', '.jpeg', '.png')):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only images are allowed")
    bucket=storage.bucket()
    blob=bucket.blob(file.filename)
    blob.upload_from_string(await file.read(), content_type=file.content_type)

    url=blob.generate_signed_url(expiration=timedelta(hours=1))
    
    return {"image_url":url}