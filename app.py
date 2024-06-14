from flask import Flask
import os

# src/*
from src.model import db, Board
from src.main import home,get_Boards
from src.notFound import notFound
# from src.write import form, write_post, form_id, modify_post
from src import write
from src.detail import detail_board, check_board_password, format_datetime
# src/*


baseDir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)

app.config['SECRET_KEY'] = 'your_secret_key'

### 데이터베이스 설정 ###
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(baseDir, 'database.db')

db.init_app(app)
with app.app_context():
    db.create_all()
### 데이터베이스 설정 ###
# 데이터베이스에 데이터가 없는 경우에만 초기 데이터 생성
    if Board.query.count() == 0:
        initial_data = [
            # password : 1234
            Board(title='Title 1', content='Content 1', password='A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=', writer='Writer 1', intro='intro1', img_src='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'),
            Board(title='Title 2', content='Content 2', password='A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=', writer='Writer 2', intro='intro2', img_src='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'),
            # 추가적인 데이터를 여기에 넣을 수 있습니다.
        ]

        # 데이터베이스에 데이터 추가
        db.session.bulk_save_objects(initial_data)
        db.session.commit()


# main.py
app.route('/')(home)
app.route('/<sortType>')(home)
app.route('/<sortType>/<sortDate>')(home)
app.route('/api/boards/<sortType>/<sortDate>')(get_Boards)



# write.py
app.route("/boards/form", methods=["GET"])(write.form)
app.route("/boards/form/<id>", methods=["GET"])(write.form_id)
app.route("/api/boards", methods=["POST"])(write.write_post)
app.route("/api/boards/<id>", methods=["PUT"])(write.modify_post)
app.route("/api/boards/<id>", methods=["DELETE"])(write.delete_post)

# detail.py
app.route("/boards/<id>")(detail_board)

app.route("/api/boards/password")(check_board_password)

app.template_filter("formatdatetime")(format_datetime)


#404
app.errorhandler(404)(notFound)



# flask 실행 부분
if __name__ == "__main__":
    app.run(debug=True, port=3000)