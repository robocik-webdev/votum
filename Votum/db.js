const pg = require('pg');

(function (pg) {
  function camelCaser(snake) {
    var tokens = snake.split(/_+/).filter(function (token) {
      return token.length;
    });
    return tokens.length
      ? tokens
          .shift()
          .toLowerCase()
          .concat(
            tokens
              .map(function (token) {
                return token.charAt(0).toUpperCase().concat(token.substring(1));
              })
              .join('')
          )
      : snake;
  }

  var queryProto = pg.Query.prototype;
  var orgHandleRowDescription = queryProto.handleRowDescription;
  queryProto.handleRowDescription = function (msg) {
    msg.fields.forEach(function (field) {
      field.name = camelCaser(field.name);
    });
    return orgHandleRowDescription.call(this, msg);
  };
})(pg);

const { Pool } = pg;
require('dotenv').config();

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      host: process.env.SQL_HOST,
      port: process.env.SQL_PORT,
      database: process.env.DATABASE,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD
    });

module.exports = pool;
