from fastapi import FastAPI
from sqlmodel import SQLModel
from .src.server.database.Session import create_db_and_tables


app = FastAPI()


def on_startup():
    create_db_and_tables()