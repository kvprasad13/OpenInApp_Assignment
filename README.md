
## Environment Variables

The environment variables can be found and modified in the `.env` file.

```bash


# URL of the Mongo DB
CONNECTION_STRING = "YOUR_CONNECTION STRING"

# JWT
ACCESS_TOKEN_SECRET = # YOUR_TOKEN_SECRET

# TWILIO

ACCOUNT_SID = "YOUR_ACCOUNT_SID"
AUTH_TOKEN = "YOUR_AUTH_TOKEN"
MY_TWILIO_PHONE_NUMBER = "YOUR_TWILIO_PHONE_NUMBER"

```


### API Endpoints

List of available routes:

**Auth routes**:\
`POST api/users/register` - Signup\
`POST api/users/login` - Signin\
`GET api/users/current` - Current User

**Task routes**:\
`POST api/tasks` - Create a Task\
`GET api/tasks/priority/:priority/?page=page&limit=limit` - Get all tasks of the current user by Priority by proper pagination \
`GET api/tasks/due_date/?due_date=due_date&page=page&limit=limit `- Get all tasks of the current user by due_date by proper pagination \
`PUT api/tasks/:taskId` - Update Task \
`DELETE api/tasks/:taskId` - Delete Task (Soft Deletion) 


**Sub Task routes**:\
`POST api/subTasks/` - Create a Sub Task\
`GET api/subTasks/`  - Get all Sub Tasks By TaskId\
`PUT api/subTasks/:subTaskId` - Update Sub Task \
`DELETE api/subTasks/:subTaskId` - Delete Sub Task (Soft Deletion) 
