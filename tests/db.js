const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const User = require('../src/models/user')
const Task = require('../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userTest = {
    _id: userOneId,
    name: 'congo',
    email: 'congosuperstart@hotmail.com',
    password: 'Udemy1324',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userOneId2 = new mongoose.Types.ObjectId()
const userTest2 = {
    _id: userOneId2,
    name: 'nya',
    email: 'nya@hotmail.com',
    password: 'Udemy1324',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userTest._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userTest._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: false,
    owner: userTest2._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userTest).save()
    await new User(userTest2).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOneId2,
    userTest,
    userTest2,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}