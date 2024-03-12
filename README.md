
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
`GET api/subTasks/`  - Get all Sub Tasks By TaskId
`PUT api/subTasks/:subTaskId` - Update Sub Task \
`DELETE api/subTasks/:subTaskId` - Delete Sub Task (Soft Deletion) 
