# Polling system API

POST /poll/create - craete a poll
{
"question": "some question",
"activeDays": 10,
"options": [
{
"text":"option 1",
"vote": 0
},
{
"text":"option 1",
"vote":0
}
]
}

POST /poll/:id - increase a voting count for an option
{
"option": 0
}

GET /poll/:id - gets a specific poll based on id
{
"question": "some question",
"deadline": Date,
"options":[]
}

GET /poll - returns all polls created

[
{
"question":"question 1",
...
}
]