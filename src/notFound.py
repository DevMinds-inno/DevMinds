from flask import render_template 

def notFound(e):
    return render_template('notFound.html'), 404