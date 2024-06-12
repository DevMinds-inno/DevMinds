from flask import render_template, request
from src.model import Board, db

def write():
    return render_template('/write.html')


def write_post():
    # POST 요청의 데이터에 접근
    data = request.get_json()

    title = data.get('title')
    content = data.get('content')
    writer = data.get('writer')
    password = data.get('password')

    # DB에 데이터 저장
    post = Board(title=title, content=content, writer=writer, password=password)
    db.session.add(post)
    db.session.commit()

    return {
        'post_id': post.id,
        'message': '글 작성이 완료되었습니다.'
    }