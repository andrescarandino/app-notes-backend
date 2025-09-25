const notesRouter = require('express').Router();
const Note = require('../models/note')
const User = require('../models/user')

/* notesRouter.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
}) */

notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })
    response.json(notes)
})

notesRouter.get('/:id', async(request, response) => {
  const note = await Note.findById(request.params.id)
    if (note){
      response.json(note);
    }else{
      response.status(404).end();
    }
  })

notesRouter.delete('/:id', async(request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

notesRouter.put('/:id', async(request, response) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  }
    const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true, runValidators: true, context: 'query' })
    response.status(200).json(updatedNote);
})

notesRouter.post('/', async(request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)
  if(!user){
    return response.status(400).json({ error: "user not found" })
  }

  const note = new Note ({
    content: body.content,
    important: Boolean(body.important) || false,
    user: user.id
  })
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote.id)
    await user.save()

    response.status(201).json(savedNote)
})

module.exports = notesRouter