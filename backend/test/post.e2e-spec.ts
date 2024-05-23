import { spec } from 'pactum'

describe('Post e2e', () => {
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

  describe('Posts', () => {
    describe('GET /posts', () => {
      it('should return 200', async () => {
        return spec()
          .get('/posts')
          .withBearerToken('$S{user1_token}')
          .expectStatus(200)
          .expectBody([])
      })
      it('no token, should return 200', async () => {
        return spec().get('/posts').withBearerToken('').expectStatus(200)
      })
    })
    describe('POST /posts', () => {
      it('create post, should return 201', async () => {
        return spec()
          .post('/posts')
          .withBearerToken('$S{user1_token}')
          .withBody({ content: 'test post' })
          .expectStatus(201)
          .expectBodyContains('test post')
          .stores('postId', 'id')
      })
      it('check new post exists, should return 200', async () => {
        return spec()
          .get('/posts')
          .withBearerToken('$S{user1_token}')
          .expectStatus(200)
          .expectBodyContains('test post')
      })
    })
    describe('PATCH /posts', () => {
      it('edit post content, should return 200', async () => {
        return spec()
          .patch('/posts/{postId}')
          .withPathParams({ postId: '$S{postId}' })
          .withBearerToken('$S{user1_token}')
          .withBody({ content: 'edited content' })
          .expectStatus(200)
          .expectBodyContains('edited content')
      })
      it('check post content changed, should return 200', async () => {
        return spec()
          .get('/posts')
          .withBearerToken('$S{user1_token}')
          .expectStatus(200)
          .expectBodyContains('edited content')
      })
    })
  })
})
