from flask import render_template, request, redirect, url_for, flash
from src.model import db, Board

def detail_board(id):
    board = Board.query.filter_by(id=id).first()

    return render_template('detail.html', data={'board':board,})

def check_board_password():
    id_param = request.args.get("id")
    password_param = request.args.get("password")
    
    board = Board.query.filter_by(id=id_param).first()

    if board and board.password == password_param:
        return 'ok'
    else:
        return 'PasswordError'


def format_datetime(value, format='%Y-%m-%d %H:%M:%S'):
    """Format a date time to (Default): yyyy-mm-dd hh:mm:ss"""
    if value is None:
        return ""
    return value.strftime(format)