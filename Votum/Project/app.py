#!/usr/bin/env python3
from flask import Flask, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL","sqlite://")
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique = True)
    email = db.Column(db.String(120), unique = True)
    password = db.Column(db.String(80), unique = False)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def __repr__(self):
        return '<User %r>' % self.username


@app.route("/")
def root():
    return "Test"

@app.route("/js/<path:path>")
def send_js(path):
    return send_from_directory('Frontend/js', path)

@app.route("/css/<path:path>")
def send_css(path):
    return send_from_directory('Frontend/css', path)


@app.route("/<path:path>")
def send_html(path):
    return send_from_directory('Frontend', path)

@app.route("/test/createdb")
def create_db():
    db.drop_all()
    db.create_all()
    db.session.commit()
    return "Alles gut"

@app.route("/test/add_test")
def seed_db():
    db.session.add(User(username = "Test", email = "Test@robocik.org", password = "test"))
    db.session.commit()
    return "Added"

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)