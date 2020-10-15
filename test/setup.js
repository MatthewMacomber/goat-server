<<<<<<< HEAD
process.env.TZ = "UCT";
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_EXPIRY = "3m";

require("dotenv").config();

process.env.TEST_DB_URL =
  process.env.TEST_DB_URL ||
  "postgresql://zenziali@localhost/goat-project-test"

const { expect } = require("chai");
const supertest = require("supertest");

global.expect = expect;
global.supertest = supertest;
=======
const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;
>>>>>>> 6d5a0fab8c8e45c100c21e45f6fbc3731b129f9f
