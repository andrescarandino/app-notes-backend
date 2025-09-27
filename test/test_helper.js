const Note = require('../models/note')
const User = require('../models/user')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


const getRootToken = async () => {
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
  return loginResponse.body.token
}


module.exports = {
  initialNotes, nonExistingId, notesInDb, usersInDb, getRootToken
}