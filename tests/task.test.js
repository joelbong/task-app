const request = require('supertest')

const app = require('../src/app')
const Task = require('../src/models/task')
const {userOneId, userOneId2, userTest, userTest2, taskOne, taskTwo, taskThree, setupDatabase} = require('./db')

beforeEach(setupDatabase)

test('Should create task for use', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
    .send({
        description: 'Test task'
    })
    .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

test('Should get all task for a user', async () => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
    .expect(200)
    expect(response.body).toHaveLength(2)
})

test('User should not be able to delete other users task', async () => {
    const response = await request(app)
    .delete('tasks/' + taskOne._id)
    .set('Authorization', `Bearer ${userTest2.tokens[0].token}`)
    .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})