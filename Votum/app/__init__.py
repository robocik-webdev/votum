from flask import Flask, jsonify
import sqlalchemy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.sql import text



app = Flask(__name__)

app.config.from_object("config.Config")

db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(200), default=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'
'''
    Creates database by running
    flask createdb
'''
@app.cli.command("createdb")
def db_create():
    engine = db.engine
    with engine.connect() as con:
        sql_file = open('server/schema.sql', 'r')
        escaped_sql = sqlalchemy.text(sql_file.read())
        con.execute(escaped_sql)