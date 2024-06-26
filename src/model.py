from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()

class Board(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.String, nullable=False)
    intro= db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    writer = db.Column(db.String(20), nullable=False)
    img_src = db.Column(db.String, nullable=True)
    created_dttm = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_dttm = db.Column(db.DateTime, default=datetime.now, nullable=False)