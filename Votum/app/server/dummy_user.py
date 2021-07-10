import argparse
import requests
from random import choice, randint


def random_user():
  repeat = lambda func,min,max: ''.join(func() for _ in range(randint(min,max)))
  vowel = lambda: choice('aeiou')
  vowels = lambda min,max: repeat(vowel,min,max)
  consonant = lambda: choice('bcdfghjklmnprstwyz')
  number = lambda: choice('1234567890')
  special = lambda: choice('!@#$%^&*()_+')
  symbol = lambda: choice([vowel(),consonant(),number(),special()])
  username = consonant()+vowels(1,2)+consonant()+vowels(1,2)+consonant()
  password = repeat(symbol,6,12)
  return { 'username': username, 'password': password }


def add_user_to_database(user):
  req = requests.post('http://localhost:5000/db/add', data=user)
  print(f'Status: {req.status_code}')
  print(f'Response: {req.text}')


parser = argparse.ArgumentParser()
parser.add_argument('-u', '--username', type=str)
parser.add_argument('-p', '--password', type=str)
args = parser.parse_args()

if args.username and args.password:
  user = {
    'username': args.username,
    'password': args.password
  }
else:
  user = random_user()

print(user)
add_user_to_database(user)

