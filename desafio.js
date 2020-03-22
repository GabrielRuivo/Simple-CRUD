const express = require('express');

const app = express();

app.use(express.json());

const listProjects = [];

//Middleware check if project exist
function checkIdExist (req, res, next) {

    const { id } = req.params;

    const project = listProjects.find(p => p.id == id);

    if(!project){

    return res.status(400).json({ error: 'project not found' });

  }

  return next();

}

//Middleware of log
app.use((req, res, next) => {

  console.time('request')

  console.log(`Method: ${req.method} ; URL: ${req.url}`)

  next();

  console.timeEnd('request')
  
});

//Middlware of log
function logRequests(req, res, next) {

    console.count('Número de requisições');

    return next();

}

app.use(logRequests)

app.post('/projects', (req, res) => {

  const {id,title} = req.body;

  const project = {
    id,
    title,
    tasks: []
  }

  listProjects.push(project);

  return res.json(project);

});

app.post('/projects/:id/tasks', checkIdExist ,(req, res) => {

  const {id} = req.params;

  const {title} = req.body;

  const project = listProjects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

app.get('/projects', (req, res) => {

  return res.json(listProjects)

});

app.put('/projects/:id', checkIdExist ,(req, res) => {

  const {id} = req.params;

  const {title} = req.body;

  const project = listProjects.find(p => p.id == id);

  project.title = title;

  return res.json(listProjects);

});

app.delete('/projects/:id', checkIdExist , (req, res) => {

  const {id} = req.params;

  const projectIndex = listProjects.findIndex(p => p.id == id);

  listProjects.splice(projectIndex, 1);

  return res.json(listProjects);

});

app.listen(4000);


