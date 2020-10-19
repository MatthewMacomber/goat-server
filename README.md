ENV DETAILS (May vary depending on you postgresql settings)
API_TOKEN=the-best-goat-ever
MIGRATION_DB_PORT=5432
MIGRATION_DB_NAME=goat-project
MIGRATION_DB_USER=goat
MIGRATION_DB_PASS=supergoat!1!1
DATABASE_URL=’postgresql://goat@localhost/goatful’
TEST_DATABASE_URL=’’postgresql://goat@localhost/goatful-test’
JWT_SECRET=’goat-project-jwt-secret’

# goat-api

GitHub Client: https://github.com/thinkful-ei-quail/goat-client
GitHub Server: https://github.com/thinkful-ei-quail/goat-api

Live Client: https://goat-client.vercel.app
Live Server: https://polar-springs-61352.herokuapp.com/

Trello: https://trello.com/b/z6WS8HpV/goat

Developer Team:
Madison Brown, Project Manager
Zenzi Ali, Co- Product Manager (Documentation and Planning)
Patrick, Co-Product Manager
Justin , Design Lead
Matt Macomber, QA Lead

WHAT IS GOAT?
GOAT allows you to create, track and share your personal and professional
goals!! The goal creation process allows the user to create goals on
their time frame is tailored to their needs. The user can add new goals,
update existing goals and archive goals that don't suit them anymore. Users
can also give goals a personal point value. Making progress on a goal
earns the user points for redemption in our Goat store.
Users can share mutual goals for friendly competition or support or keep
their goals private behind our secure server.

SAMPLE API CALLS AND RESPONSES
USER CREATION
Endpoint: API/User/Post
REQUEST {
password(HASHED): "**\*\***\*\*\***\*\***",
user_name: "new_user",
full_name: "Newton User",
nickname: "goal_lover_1"
}
RESPONSE
Code: 201
{
password(HASHED): "**\*\***\*\*\***\*\***",
user_name: "new_user",
full_name: "Newton User",
nickname: "goal_lover_1"
}

SECURE LOGIN(JWT-Auth)
Endpoint: API/Auth/Post
REQUEST {
password(HASHED): "**\*\***\*\*\***\*\***",
user_name: "new_user",
}
RESPONSE
Send: AuthToken

GOAL CREATION
Endpoint: API/Goals
REQUEST {
title: "Do a thing",
description: "This is a thing I will do if I try",
points: 1000,
end_date: 3/1/2021,
}
RESPONSE
CODE: 201
{
title: "Do a thing",
description: "This is a thing I will do if I try",
points: 1000,
end_date: 3/1/2021,
}
