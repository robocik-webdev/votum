const { jwtSign } = require('../jwt/jwtAuth');
const loginSchema = require('../../schema/login');
const pool = require('../../db');
require('dotenv').config();

const login = async (token, res) => {
  const potentialLogin = await pool.query(
    `SELECT id, name, surname, token, email, admin FROM users u WHERE u.token='${[
      token
    ]}'`
  );

  if (potentialLogin.rowCount > 0) {
    jwtSign(
      {
        token: token,
        name: potentialLogin.rows[0].name,
        surname: potentialLogin.rows[0].surname,
        id: potentialLogin.rows[0].id
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )
      .then(token => {
        res.json({
          loggedIn: true,
          admin: potentialLogin.rows[0].admin,
          name: potentialLogin.rows[0].name,
          surname: potentialLogin.rows[0].surname,
          token
        });
      })
      .catch(err => {
        console.log(err);
        res.json({ loggedIn: false, status: 'uhhhh' });
      });
  } else {
    res.json({ loggedIn: false, status: 'Wrong token!' });
  }
};

const loginPost = async (req, res) => {
  login([req.body.token], res);
};

const loginGet = async (req, res) => {
  login([req.query.token], res);
};

const validateLogin = (req, res, next) => {
  const data = req.body;
  loginSchema
    .validate(data)
    .catch(() => {
      res.status(422).send();
    })
    .then(valid => {
      if (valid) {
        next();
      } else {
        res.status(422).send();
      }
    });
};

module.exports = {
  attemptLogin: loginPost,
  handleLogin: loginGet,
  validateLogin
};
