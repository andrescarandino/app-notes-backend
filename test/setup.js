const { before, after } = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user.js')

before(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const rootUser = new User({ username: 'root', passwordHash })
  await rootUser.save()
})

after(async () => {
  await mongoose.connection.close()
})
