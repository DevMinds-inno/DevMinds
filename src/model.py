from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# TODO [POST] 모델 설계

# class Song(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(100), nullable=False)
#     artist = db.Column(db.String(100), nullable=False)
#     img_src = db.Column(db.String(100), nullable=False)
#     username = db.Column(db.String(100), nullable=False)

#     def __repr__(self):
#         return f"{self.title} ${self.artist} by {self.username}"