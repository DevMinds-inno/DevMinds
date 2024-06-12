from flask import render_template, request, jsonify
from src.model import Board
from sqlalchemy import desc


def home():
    return render_template('index.html')

def get_post():
    sortType = request.args.get('sortType', 'recent', type=str)
    print(sortType)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    # desc(Board.likesCount)
    # desc(Board.id)
    type = (Board.id) if sortType == 'like' else (desc(Board.id))

    posts = Board.query.order_by(type).paginate(page=page, per_page=per_page, error_out=False)
 
    posts_list = []
    for post in posts.items:
        post_data = {
            "id":post.id,
            'title': post.title,
            'content': post.content,
            'writer': post.writer,
            'created_dttm': post.created_dttm.strftime('%Y-%m-%d'), 
            'updated_dttm': post.updated_dttm.strftime('%Y-%m-%d')   
        }
        posts_list.append(post_data)
    
    # #JSON 형식으로 변환하여 반환
    return jsonify(posts_list)
    # return posts_list

