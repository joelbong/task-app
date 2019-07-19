const request = require('supertest')

const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userTest, setupDatabase} = require('./db')

beforeEach(setupDatabase)

test('Should signup a new user' , async() => {
    const response = await request(app)
    .post('/users').send({
        name: 'Jo',
        email: 'joelbon@hotmail.com',
        password: 'Udemy1324'
    })
    .expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assert about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Jo',
            email: 'joelbon@hotmail.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Udemy1324')
})

test('should login exisiting user', async() => {
    const response = await request(app)
    .post('/users/login').send({
        email: userTest.email,
        password: userTest.password
    })
    .expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login non exisiting user', async() => {
    await request(app).post('/users/login')
    .send({
        email: 'cono@hotmail.com'   ,
        password: userTest.password
    })
    .expect(400)
})

test('Should get profile for user', async() => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile unauthenticated user', async() => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async() => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
    .send()
    .expect(200)
    // Assert that the database was changed correctly
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async() => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async() => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/2pac.png')
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async() => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
    .send({
        'name': 'Andre Bong'
    })
    .expect(200)
    // Assert that the database was changed correctly
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Andre Bong')
})

test('Should not update invalid user fields', async() => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
    .send({
        'location': 'Leuven'
    })
    .expect(400)
})