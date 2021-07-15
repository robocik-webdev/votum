#!/usr/bin/env python3
import json
from flask import request
from flask.cli import FlaskGroup
from server.utils import send_file
from server import app, db, User

cli = FlaskGroup(app)


def get_user_id(token):
    user = User.query.filter_by(password=token).first()
    return user.id


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
        return {'message': f'Witaj z powrotem <b>{user.username}</b>!'}
    return {'message': 'Login failed!'}, 401


@app.route('/api/questions', methods=['GET'])
def get_remaining_questions():
    """GET request for remaining user questions"""
    username = request.json['username']
    password = request.json['password']
    user = User.query.filter_by(username=username).first()
    if user is not None:
        if user.password == password:
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


@app.post('/api/answer')
def answer_questions():
    token = request.json['token']
    answered_questions = request.json['questions']
    user = get_user_id(token)
    validity_check = True
    if user is not None:
        conn = db.engine.connect()
        query = f"SELECT q.id \
        FROM questions q \
        WHERE q.id NOT IN (SELECT uhq.questions_id FROM users_has_questions uhq WHERE users_id = {user})"
        questions_left = [r for r, in conn.execute(query)]
        if len(questions_left) == 0:
            return {"message": "No questions left for user to answer"}, 418
        for answered_question in answered_questions:
            valid = True
            if answered_question['id'] not in questions_left:
                validity_check = False
                continue
            query = f"select possible_answers from questions \
                    where id={answered_question['id']}"
            max_answers = conn.execute(query).first()['possible_answers']
            if max_answers >= len(answered_question['answers']):
                query = f"select id from answers \
                         where questions_id = {answered_question['id']}"
                possible_answers = [r for r, in conn.execute(query)]
                for answer in answered_question['answers']:
                    if answer['id'] not in possible_answers:
                        valid = False
                        validity_check = False
                if valid:
                    for answer in answered_question['answers']:
                        query = f"INSERT INTO answered_questions \
                             (id, questions_id, answers_id) VALUES\
                             (DEFAULT, {answered_question['id']}, {answer['id']})"
                        conn.execute(query)
                    query = f"INSERT INTO users_has_questions \
                            (id, users_id, questions_id) VALUES \
                            (DEFAULT, {user}, {answered_question['id']})"
                    conn.execute(query)
        if validity_check:
            return {'message': 'OK'}, 200
        else:
            return {'message': 'error'}, 418
    return {'message': 'nope'}, 401


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
    cli()
