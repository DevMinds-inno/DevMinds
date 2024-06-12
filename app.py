from flask import Flask
import os

# src/*
from src.model import db, Board
from src.main import home
from src.write import write, write_post
# src/*


baseDir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)

### 데이터베이스 설정 ###
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(baseDir, 'database.db')

db.init_app(app)
with app.app_context():
    db.create_all()

    # 데이터베이스에 데이터가 없는 경우에만 초기 데이터 생성
    if Board.query.count() == 0:
        initial_data = [
            Board(title='Title 1', content='Content 1', password='password1', writer='Writer 1'),
            Board(title='Title 2', content='Content 2', password='password2', writer='Writer 2'),
            # 추가적인 데이터를 여기에 넣을 수 있습니다.
        ]

        # 데이터베이스에 데이터 추가
        db.session.bulk_save_objects(initial_data)
        db.session.commit()
### 데이터베이스 설정 ###



# main.py
app.route("/")(home)


# write.py
app.route("/boards/write", methods=["GET"])(write)
# app.route("/boards/write/<id>", methods=["GET"])(write_id)
app.route("/api/boards", methods=["POST"])(write_post)






# flask 실행 부분
if __name__ == "__main__":
    app.run(debug=True, port=3000)