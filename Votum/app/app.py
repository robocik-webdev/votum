#!/usr/bin/env python3
import os
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from server.utils import send_file


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 'postgresql://')
db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    voted = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'


@app.route('/<path:path>')
def static_file(path):
    return send_file(path)


@app.route('/')
def root():
    return send_file('index.html')


@app.route("/db/create")
def db_create():
    db.drop_all()
    db.create_all()
    db.session.commit()
    return 'Created the database'


@app.post('/db/add')
def db_add():
    try:
        data = request.form
        user = User(**data, voted=False)
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


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
