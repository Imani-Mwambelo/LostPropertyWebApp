from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    database_hostname:str
    database_port:str
    database_name:str
    database_username:str
    database_password:str
    secret_key:str
    algorithm:str
    access_token_expire_minutes:int
    blob_read_write_token:str
    file_upload_key:dict

    class Config:
        env_file= ".env"

settings= Settings()





