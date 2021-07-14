#!/usr/bin/env python3
import os
import json
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask.cli import FlaskGroup
from json import dumps
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


"""
    POST request for authentication
"""


@app.post('/login')
def login():
    username = request.json['username']
    password = request.json['password']
    user = User.query.filter_by(username=username).first()
    if user is not None:
        if user.password == password:
            return {
                'message':
                    f'Witaj z powrotem <b>{username}</b>!'
            }
    return {'message': 'Login failed!'}, 401


"""
    GET request for remaining user questions
"""


@app.route('/questions', methods=['GET'])
def getQuestionsLeft():
    username = request.json['username']
    password = request.json['password']
    user = User.query.filter_by(username=username).first()
    if user is not None:
        if user.password == password:
            conn = db.engine.connect()
            s = f'SELECT q.id, q.context FROM questions q WHERE q.id NOT IN (SELECT uhq.questions_id FROM users_has_questions uhq WHERE users_id = {user.id})'
            resultQuestions = conn.execute(s)
            result = []
            for row in resultQuestions:
                answers = []
                s = f'select id, context from answers a where a.id_question = {row[0]}'
                resultAnswers = conn.execute(s)
                for ans_row in resultAnswers:
                    answer = {
                        'id': ans_row[0],
                        'content': ans_row[1]
                    }
                    answers.append(answer)
                    question = {
                        'id': row[0],
                        'content': row[1],
                        'answers': answers
                    }
                result.append(question)
            return json.dumps(result)

    return {'message': 'nope'}, 401


@app.errorhandler(404)
def unauthorized():
    response = jsonify({'message': 'Nothing to see here 🐧'})
    return response, 404


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
    cli()
