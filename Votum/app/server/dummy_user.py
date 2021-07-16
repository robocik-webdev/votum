import argparse
import requests
from random import choice, randint


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


def add_user_to_database(user):
    req = requests.post('http://localhost:5000/db/add', data=user)
    print(f'Status: {req.status_code}')
    print(f'Response: {req.text}')


parser = argparse.ArgumentParser()
parser.add_argument('-u', '--username', type=str)
parser.add_argument('-t', '--token', type=str)
args = parser.parse_args()

if args.username and args.token:
    user = {
        'username': args.username,
        'token': args.token
    }
else:
    user = random_user()

print(user)
add_user_to_database(user)
