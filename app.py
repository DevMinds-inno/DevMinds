from flask import Flask
import os

# src/*
from src.model import db
from src.main import home
# src/*


baseDir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)

### 데이터베이스 설정 ###
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(baseDir, 'database.db')

db.init_app(app)
with app.app_context():
    db.create_all()
### 데이터베이스 설정 ###

# main.py
app.route("/")(home)






# flask 실행 부분
if __name__ == "__main__":
    app.run(debug=True, port=3000)