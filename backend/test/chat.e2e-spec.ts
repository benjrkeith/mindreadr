import { spec } from 'pactum'

describe('Chat e2e', () => {
  describe('POST /auth/register', () => {
    const dtos = [
      { username: 'user1', password: 'pass' },
      { username: 'user2', password: 'pass' },
      { username: 'user3', password: 'pass' },
    ]

    for (const dto of dtos) {
      it(`store token for ${dto.username}`, async () => {
        return spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(201)
          .stores(`${dto.username}_token`, `token`)
      })
      it(`store id for ${dto.username}`, async () => {
        return spec()
          .get('/users')
          .withBearerToken(`$S{${dto.username}_token}`)
          .expectStatus(200)
          .stores(`${dto.username}_id`, `id`)
      })
    }
  })

  describe('POST /chats', () => {
    const usersValues = [
      { users: 1, msg: 'users must contain at least 1 element' },
      { users: [], msg: 'users must contain at least 1 element' },
      { users: null, msg: 'users should not be empty' },
      {
        users: ['$S{user1_id}'],
        msg: 'Cannot create a chat without other users',
      },
    ]
    const nameValues = [
      { name: 123, msg: 'name must be a string' },
      { name: null, msg: 'name should not be empty' },
      { name: '', msg: 'name should not be empty' },
    ]

    for (const users of usersValues) {
      it(`${users.msg}, should return 400`, async () => {
        return spec()
          .post('/chats')
          .withBody({ name: 'chat', users: users.users })
          .withBearerToken('$S{user1_token}')
          .expectStatus(400)
          .expectBodyContains(users.msg)
      })
    }
    for (const name of nameValues) {
      it(`${name.msg}, should return 400`, async () => {
        return spec()
          .post('/chats')
          .withBody({ name: name.name, users: [1, 2] })
          .withBearerToken('$S{user1_token}')
          .expectStatus(400)
          .expectBodyContains(name.msg)
      })
    }

    it('valid, create user1user2 should return 201', async () => {
      return spec()
        .post('/chats')
        .withBody({
          name: 'user1user2',
          users: ['$S{user1_id}', '$S{user2_id}'],
        })
        .withBearerToken('$S{user1_token}')
        .expectStatus(201)
        .expectBodyContains('user1user2')
        .stores('chat1_id', 'id')
    })
    it('valid, create user2user3 should return 201', async () => {
      return spec()
        .post('/chats')
        .withBody({
          name: 'user2user3',
          users: ['$S{user2_id}', '$S{user3_id}'],
        })
        .withBearerToken('$S{user2_token}')
        .expectStatus(201)
        .expectBodyContains('user2user3')
        .stores('chat2_id', 'id')
    })
  })

  describe('GET /chats', () => {
    it('no token, should return 401', async () => {
      return spec().get('/chats').expectStatus(401)
    })
    it('invalid token, should return 401', async () => {
      return spec()
        .get('/chats')
        .withBearerToken('invalid_token')
        .expectStatus(401)
    })
    it('user1 can see user1user2', async () => {
      return spec()
        .get('/chats')
        .withBearerToken('$S{user1_token}')
        .expectStatus(200)
        .expectBodyContains('user1user2')
    })
    it('user3 can see user2user3', async () => {
      return spec()
        .get('/chats')
        .withBearerToken('$S{user3_token}')
        .expectStatus(200)
        .expectBodyContains('user2user3')
    })
    it('user2 can see 2 created chats', async () => {
      return spec()
        .get('/chats')
        .withBearerToken('$S{user2_token}')
        .expectStatus(200)
        .expectJsonLength(2)
    })
    it('user3 can only see 1 created chat', async () => {
      return spec()
        .get('/chats')
        .withBearerToken('$S{user3_token}')
        .expectStatus(200)
        .expectJsonLength(1)
    })
  })

  describe('GET /chats/:id', () => {
    it('chat doesnt exist, should return 404', async () => {
      return spec()
        .get('/chats/99999999')
        .withBearerToken('$S{user3_token}')
        .expectStatus(404)
    })
    it('chat id is string, should return 400', async () => {
      return spec()
        .get('/chats/hello')
        .withBearerToken('$S{user3_token}')
        .expectStatus(400)
        .expectBodyContains('id must be a number')
    })
    it('user not in chat, should return 403', async () => {
      return spec()
        .get('/chats/$S{chat2_id}')
        .withBearerToken('$S{user1_token}')
        .expectStatus(403)
    })
    it('user in chat, should return 200', async () => {
      return spec()
        .get('/chats/$S{chat1_id}')
        .withBearerToken('$S{user2_token}')
        .expectStatus(200)
        .expectBodyContains('user1user2')
    })
  })

  describe('PATCH /chats/:id', () => {
    it('no body provided, should return 400', async () => {
      return spec()
        .patch('/chats/$S{chat1_id}')
        .withBearerToken('$S{user1_token}')
        .expectStatus(400)
        .expectBodyContains('At least one field must be provided')
    })
    it('chat doesnt exist, should return 404', async () => {
      return spec()
        .patch('/chats/999999')
        .withBearerToken('$S{user1_token}')
        .expectStatus(404)
        .expectBodyContains('Chat not found')
    })
    it('no permission to edit chat, should return 403', async () => {
      return spec()
        .patch('/chats/$S{chat2_id}')
        .withBearerToken('$S{user1_token}')
        .expectStatus(403)
        .expectBodyContains('Forbidden')
    })
    it('new name is not string, should return 400', async () => {
      return spec()
        .patch('/chats/$S{chat1_id}')
        .withBearerToken('$S{user1_token}')
        .withBody({ name: 123 })
        .expectStatus(400)
        .expectBodyContains('name must be a string')
    })
    it('addUsers is not a list, should return 400', async () => {
      return spec()
        .patch('/chats/$S{chat1_id}')
        .withBearerToken('$S{user1_token}')
        .withBody({ addUsers: 1 })
        .expectStatus(400)
        .expectBodyContains('addUsers must be an array')
    })
    it('removeUsers is am empty list, should return 400', async () => {
      return spec()
        .patch('/chats/$S{chat1_id}')
        .withBearerToken('$S{user1_token}')
        .withBody({ removeUsers: [] })
        .expectStatus(400)
        .expectBodyContains('At least one field must be provided')
    })
    it('user3 cant access chat, should return 403', async () => {
      return spec()
        .get('/chats/$S{chat1_id}')
        .withBearerToken('$S{user3_token}')
        .expectStatus(403)
    })
    it('add user3 to user1user2 chat', async () => {
      return spec()
        .patch('/chats/$S{chat1_id}')
        .withBearerToken('$S{user1_token}')
        .withBody({ addUsers: ['$S{user3_id}'] })
        .expectStatus(200)
        .expectBodyContains('$S{user3_id}')
    })
    it('user3 can now access chat, should return 200', async () => {
      return spec()
        .get('/chats/$S{chat1_id}')
        .withBearerToken('$S{user3_token}')
        .expectStatus(200)
        .expectBodyContains('user1user2')
    })
    it('remove user3 from user1user2 chat', async () => {
      return spec()
        .patch('/chats/$S{chat1_id}')
        .withBearerToken('$S{user1_token}')
        .withBody({ removeUsers: ['$S{user3_id}'] })
        .expectStatus(200)
    })
    it('user3 cant access chat, should return 403', async () => {
      return spec()
        .get('/chats/$S{chat1_id}')
        .withBearerToken('$S{user3_token}')
        .expectStatus(403)
    })
    it('change name of chat1, should return 200', async () => {
      return spec()
        .patch('/chats/$S{chat1_id}')
        .withBearerToken('$S{user1_token}')
        .withBody({ name: 'new name' })
        .expectStatus(200)
    })
    it('check new chat name, should return 200', async () => {
      return spec()
        .get('/chats/$S{chat1_id}')
        .withBearerToken('$S{user2_token}')
        .expectStatus(200)
        .expectBodyContains('new name')
    })
  })
  describe('DELETE /chats/:id', () => {
    it('no permission to edit chat, should return 403', async () => {
      return spec()
        .patch('/chats/$S{chat2_id}')
        .withBearerToken('$S{user1_token}')
        .expectStatus(403)
        .expectBodyContains('Forbidden')
    })
    it('delete chat should return 204', async () => {
      return spec()
        .delete('/chats/$S{chat2_id}')
        .withBearerToken('$S{user2_token}')
        .expectStatus(204)
    })
    it('chat doesnt exist, should return 404', async () => {
      return spec()
        .get('/chats/$S{chat2_id}')
        .withBearerToken('$S{user2_token}')
        .expectStatus(404)
    })
  })
})
