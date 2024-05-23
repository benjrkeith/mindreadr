import { spec } from 'pactum'

describe('Users e2e', () => {
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

  describe('GET /users', () => {
    it('valid, should return 200', async () => {
      return spec()
        .get('/users')
        .withBearerToken('$S{user1_token}')
        .expectStatus(200)
    })
    it('invalid token, should return 401', async () => {
      return spec().get('/users').withBearerToken('invalid').expectStatus(401)
    })
    it('empty token, should return 401', async () => {
      return spec().get('/users').withBearerToken('').expectStatus(401)
    })
    it('no token, should return 401', async () => {
      return spec().get('/users').expectStatus(401)
    })
  })

  describe('PATCH /users', () => {
    it('check initial username, should return 200', async () => {
      return spec()
        .get('/users')
        .withBearerToken('$S{user1_token}')
        .expectBodyContains('user1')
        .expectStatus(200)
    })
    it('edit username, should return 200', async () => {
      return spec()
        .patch('/users')
        .withBearerToken('$S{user1_token}')
        .withBody({ username: 'changed' })
        .expectBodyContains('changed')
        .expectStatus(200)
    })
    it('check name after change, should return 200', async () => {
      return spec()
        .get('/users')
        .withBearerToken('$S{user1_token}')
        .expectBodyContains('changed')
        .expectStatus(200)
    })
  })
})
