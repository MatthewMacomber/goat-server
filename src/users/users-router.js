const express = require('express');
const path = require('path');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const parseBody = express.json();

usersRouter
  .post('/', parseBody, (req, res, next) => {
    const {password, username, name} = req.body;

    for (const field of ['name', 'username', 'password']) {
      if (!req.body[field]) {
        return res.status(400).json({error: `Missing '${field}' in request body`});
      }
    }
    
    if (username.startsWith(' ') || username.endsWith(' ')) {
      return res.status(400).json({error: 'Username cannot start or end with spaces'});
    }

    const passwordError = UsersService.validatePassword(password);
    if (passwordError !== null) {
      return res.status(400).json({error: passwordError});
    }

    UsersService.hasUserWithUsername(req.app.get('db'), username)
      .then(hasUserWithUsername => {
        if (hasUserWithUsername === true) {
          return res.status(400).json({error: 'Username already taken'});
        } else {
          return UsersService.hashPassword(password)
            .then(hashedPassword => {
              const newUser = {
                username,
                password: hashedPassword,
                name,
              };
              return UsersService.insertUser(req.app.get('db'), newUser)
                .then(user => {
                  res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                    .json(UsersService.serializeUser(user));
                });
            });
        }
      })
      .catch(next);
  });

usersRouter
  .get('/:user_id', (req, res, next) => {
    const user_id = req.params.user_id;
    UsersService.getUsername(req.app.get('db'), user_id)
      .then(user => {
        if (!user) {
          return res.status(400).json({error: 'User not found'});
        }
        return res.status(200).json(user.user_name);
      })
      .catch(next);
  });



module.exports = usersRouter;
