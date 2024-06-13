from flask import render_template, request,redirect
from src.model import Board, db
from datetime import datetime



def form():
    return render_template('/write.html', post=None)

def form_id(id):
    post = Board.query.get(id)
    if post is None:
        return redirect('/boards/form')
    
    return render_template('/write.html', post=post)


def write_post():
    # POST 요청의 데이터에 접근
    data = request.get_json()

    title = data.get('title')
    content = data.get('content')
    writer = data.get('writer')
    password = data.get('password')
    img_src = data.get('img_src')

    # DB에 데이터 저장
    post = Board(title=title, content=content, writer=writer, password=password, img_src=img_src)
    db.session.add(post)
    db.session.commit()

    return {
        'id': post.id,
        'message': '글 작성이 완료되었습니다.'
    }


def modify_post(id):    
    formData = request.get_json()

    post = Board.query.get(id)
    # DB에 데이터 저장
    post.title = formData.get('title')
    post.content = formData.get('content')
    # post.password = formData.get('password')
    post.img_src = formData.get('img_src')
    post.updated_dttm = datetime.now()
    db.session.commit()

    return {
        'id': post.id,
        'message': '글 수정이 완료되었습니다.'
    }

def delete_post(id):
    post = Board.query.get(id)
    db.session.delete(post)
    db.session.commit()

    return {
        'id': id,
        'message': '글 삭제가 완료되었습니다.'
    }