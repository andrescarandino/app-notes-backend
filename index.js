const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.static('dist'));
app.use(cors())
app.use(express.json());
const requestLogger = (request, response, next) => {
  console.log('method:', request.method);
  console.log('path:', request.path);
  console.log('body', request.body);
  console.log('------------');
  next();  
}
app.use(requestLogger)

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
})

app.get('/api/notes/', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find( note => note.id === id)
  if(note){
    response.json(note)
  }else {
    response.status(404).end();
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id)

  response.status(204).end();
})

app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(n => n.id === id)
    if(!note){
      return response.status(404).json({error: 'note not found'})
    }
    const changedNote = { ...note, important: !note.important }
    notes = notes.map(note => note.id !== id ? note : changedNote)
    response.json(changedNote)
})

app.post('/api/notes/', (request, response) => {
  const body = request.body
  if (!body.content){
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: gerateId(),
  }

  notes = notes.concat(note);

  response.json(note);
  
})



const gerateId = () => {
  const maxId = notes.length > 0 ? 
    Math.max(...notes.map(n => n.id))
    : 0;
    return maxId + 1;
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
  console.log(`server running on port ${PORT}`);
})
