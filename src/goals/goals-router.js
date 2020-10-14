const express = require("express");
const path = require("path");
const uuid = require("uuid");
const logger = require("../logger");
const GoalsService = require("./goals-service");
const { requireAuth } = require("../middleware/jwt-auth");
const UserService = require("../user/user-service");
