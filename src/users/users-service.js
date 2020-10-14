const bcrypt = require('bcryptjs');
const xss = require('xss');
const { NIL } = require('uuid');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const REGEX_EMAIL_VALIDATE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/;
const user_table = 'table_users'; // TODO Update with actual users table name.

const UsersService = {
  hasUserWithUsername(db, user_name) {
    return db(user_table)
      .where({user_name})
      .first()
      .then(user => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into(user_table)
      .returning('*')
      .then(([user]) => user);
  },
  getUsername(db, user_id) {
    return db(user_table)
      .where({'id': user_id})
      .first();
  },
  validatePassword(password) {
    if (password.length <= 8) {
      return 'Password must be longer than 8 characters.';
    }
    if (password.length >= 72) {
      return 'Password must be less than 72 characters.';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces.';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain at least one upper case, lower case, number and special character.';
    }
    return NIL;
  },
  validateEmail(email) {
    if (email.startsWith(' ') || email.endsWith(' ')) {
      return 'Email must not start or end with empty spaces.';
    }
    if (!REGEX_EMAIL_VALIDATE.test(email)) {
      return 'Email must be a valid email string.';
    }
    return NIL;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      full_name: xss(user.full_name),
      user_name: xss(user.user_name),
      email: xss(user.email),
      date_created: new Date(user.date_created)
    };
  }
};

module.exports = UsersService;