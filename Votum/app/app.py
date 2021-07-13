#!/usr/bin/env python3
import os
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask.cli import FlaskGroup
from server.utils import send_file
from __init__ import app, db, User

cli = FlaskGroup(app)


@app.route('/<path:path>')
def static_file(path):
    return send_file(path)


@app.route('/')
def root():
    return send_file('index.html')


@app.post('/db/add')
def db_add():
    try:
        data = request.form
        user = User(**data)
        db.session.add(user)
        db.session.commit()
        return f'User {user} added to the database'
    except Exception as e:
        return f'Something went wrong while adding a user to the database\n{e}'


@app.post('/login')
def login():
    username = request.json['username']
    password = request.json['password']
    user = User.query.filter_by(username=username).first()
    if user.password == password:
        return {
            'message':
                f'Witaj z powrotem <b>{user.username}</b>!'
                f'<br>Głosowano: <b>{user.voted}</b>'
        }
    return {'message': 'Login failed!'}


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
    cli()
