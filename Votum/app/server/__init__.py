import click
import sqlalchemy
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from random import choice, randint

app = Flask(__name__)
app.config.from_object('server.config.Config')
db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), unique=True, nullable=False)
    token = db.Column(db.String(200), unique=True, default=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'


def execute_sql_file(filename):
    engine = db.engine
    with engine.connect() as con:
        sql_file = open(f'server/{filename}.sql', 'r')
        escaped_sql = sqlalchemy.text(sql_file.read())
        con.execute(escaped_sql)


@app.cli.command('seeddb')
def seed_db():
    """Seeds database with testing questions by running `flask seeddb`"""
    execute_sql_file('seed')


@app.cli.command('createdb')
def create_db():
    """Creates database by running `flask createdb`"""
    execute_sql_file('schema')
    print()

def random_user():
    def repeat(func, min, max): return ''.join(
        func() for _ in range(randint(min, max)))

    def vowel(): return choice('aeiou')
    def vowels(min, max): return repeat(vowel, min, max)
    def consonant(): return choice('bcdfghjklmnprstwyz')
    def number(): return choice('1234567890')
    def symbol(): return choice([vowel(), consonant(), number()])
    username = consonant()+vowels(1, 2)+consonant()+vowels(1, 2)+consonant()
    token = repeat(symbol, 8, 12)
    return {'username': username.capitalize(), 'token': token}


@app.cli.command('adduser')
@click.argument('count', default = 1)
def add_random_user(count = 1):
    for i in range(count):
        user = User(**random_user())
        db.session.add(user)
        db.session.commit()
        print("test")
