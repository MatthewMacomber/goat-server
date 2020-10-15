const logger = require('../logger');
const goalsRouter = require('./goals-router');

const NO_ERRORS = null;

function getGoalsValidationError({ title}) {
  if (!title) {
    logger.error(`Invalid name'${title}' supplied`);
    return {
      error: {
        message: '\'goal title\' must be supplied.',
      },
    };
  }

  return NO_ERRORS;
}

module.exports = {
  getGoalsValidationError,
};
