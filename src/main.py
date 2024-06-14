from flask import render_template, request, jsonify,abort  
from src.model import Board
from sqlalchemy import desc
from datetime import datetime, timedelta, timezone


def home(sortType='recent', sortDate='week'):
    if sortType not in ["recent", "like"] or sortDate not in ["today", "week", "month", "year"]:
        abort(404)

    return render_template('index.html')

def get_Boards(sortType = 'recent', sortDate = 'week'):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    type = (Board.id) if sortType == 'like' else (desc(Board.id))

   # 오늘 날짜 기준으로 필터링
    if sortDate == 'today':
        start_date = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date + timedelta(days=1)
    elif sortDate == 'week':
        start_date = datetime.now(timezone.utc) - timedelta(days= datetime.now(timezone.utc).weekday())
        end_date = start_date + timedelta(days=7)
    elif sortDate == 'month':
        start_date = datetime.now(timezone.utc).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        next_month = start_date.replace(month=start_date.month % 12 + 1, day=1)
        end_date = next_month
    elif sortDate == 'year':
        start_date = datetime.now(timezone.utc).replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date.replace(year=start_date.year + 1)
    else:
        start_date = None
        end_date = None

    # \을 사용하여 줄바꿈
    posts = Board.query.filter(Board.updated_dttm >= start_date, Board.updated_dttm < end_date) \
                       .order_by(type) \
                       .paginate(page=page, per_page=per_page, error_out=False)
 
    posts_list = []
    for post in posts.items:
        post_data = {
            "id":post.id,
            'title': post.title,
            'intro': post.intro,
            'writer': post.writer,
            'img_src': post.img_src,
            'created_dttm': post.created_dttm.strftime('%Y-%m-%d'), 
            'updated_dttm': changeDate(post.updated_dttm.strftime('%Y-%m-%d') )  
        }
        posts_list.append(post_data)

    # #JSON 형식으로 변환하여 반환
    return jsonify(posts_list)


#  날짜 변경 함수 
def changeDate(date):
    dateArray = date.split("-")
    return f"{dateArray[0]}년 {dateArray[1]}월 {dateArray[2]}일"

