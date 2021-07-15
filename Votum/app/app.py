#!/usr/bin/env python3
import json
from flask import request
from flask.cli import FlaskGroup
from server.utils import send_file
from server import app, db, User

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


@app.post('/api/login')
def login():
    """POST request for authentication"""
    token = request.json['token']
    user = User.query.filter_by(password=token).first()
    if user is not None and user.password == token:
        return {
            'username': user.username,
            'message': f'Witaj z powrotem <b>{user.username}</b>!'
        }
    return {'message': 'Login failed!'}, 401


@app.post('/api/questions')
def get_remaining_questions():
    """GET request for remaining user questions"""
    token = request.json['token']
    user = User.query.filter_by(password=token).first()
    if user is not None and user.password == token:
        conn = db.engine.connect()
        query = f'SELECT q.id, q.context, q.possible_answers \
                FROM questions q WHERE q.id NOT IN \
                (SELECT uhq.questions_id FROM users_has_questions uhq \
                WHERE users_id = {user.id})'
        resultQuestions = conn.execute(query)
        result = []
        for row in resultQuestions:
            answers = []
            query = f'SELECT id, context FROM answers a \
                    WHERE a.questions_id = {row[0]}'
            resultAnswers = conn.execute(query)
            for ans_row in resultAnswers:
                answer = {
                    'id': ans_row[0],
                    'content': ans_row[1]
                }
                answers.append(answer)
                question = {
                    'id': row[0],
                    'content': row[1],
                    'possible_answers': row[2],
                    'answers': answers
                }
            result.append(question)
        return json.dumps(result)

    return {'message': 'nope'}, 401


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
    cli()
