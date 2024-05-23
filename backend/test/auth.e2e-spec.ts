import { spec } from 'pactum'

describe('Auth e2e', () => {
  const AUTH_URL = '/auth'
  const REGISTER_URL = `${AUTH_URL}/register`
  const LOGIN_URL = `${AUTH_URL}/login`

  const validDto = { username: 'testuser', password: 'pass' }
  const emptyDto = {}
  const noPassDto = { username: 'testuser' }
  const noUserDto = { password: 'pass' }
  const userIsNumberDto = { username: 123, password: 'pass' }
  const passIsNumberDto = { username: 'testuser', password: 123 }
  const invalidPassDto = { username: 'testuser', password: 'wrongpass' }
  const invalidUserDto = { username: 'wronguser', password: 'pass' }

  describe(`POST ${REGISTER_URL}`, () => {
    it('valid, should return 201', async () => {
      return spec().post(REGISTER_URL).withBody(validDto).expectStatus(201)
    })
    it('duplicate user, should return 409', async () => {
      return spec().post(REGISTER_URL).withBody(validDto).expectStatus(409)
    })
    it('no body, should return 400', async () => {
      return spec().post(REGISTER_URL).withBody(emptyDto).expectStatus(400)
    })
    it('no pass, should return 400', async () => {
      return spec().post(REGISTER_URL).withBody(noPassDto).expectStatus(400)
    })
    it('no user, should return 400', async () => {
      return spec().post(REGISTER_URL).withBody(noUserDto).expectStatus(400)
    })
    it('user is number, should return 400', async () => {
      return spec()
        .post(REGISTER_URL)
        .withBody(userIsNumberDto)
        .expectStatus(400)
    })
    it('pass is number, should return 400', async () => {
      return spec()
        .post(REGISTER_URL)
        .withBody(passIsNumberDto)
        .expectStatus(400)
    })
  })

  describe(`POST ${LOGIN_URL}`, () => {
    it('valid, return 200', async () => {
      return spec().post(LOGIN_URL).withBody(validDto).expectStatus(200)
    })
    it('no body, should return 400', async () => {
      return spec().post(LOGIN_URL).withBody(emptyDto).expectStatus(400)
    })
    it('no pass, should return 400', async () => {
      return spec().post(LOGIN_URL).withBody(noPassDto).expectStatus(400)
    })
    it('no user, should return 400', async () => {
      return spec().post(LOGIN_URL).withBody(noUserDto).expectStatus(400)
    })
    it('user is number, should return 400', async () => {
      return spec().post(LOGIN_URL).withBody(userIsNumberDto).expectStatus(400)
    })
    it('pass is number, should return 400', async () => {
      return spec().post(LOGIN_URL).withBody(passIsNumberDto).expectStatus(400)
    })
    it('invalid password, should return 401', async () => {
      return spec().post(LOGIN_URL).withBody(invalidPassDto).expectStatus(401)
    })
    it('invalid user, should return 404', async () => {
      return spec().post(LOGIN_URL).withBody(invalidUserDto).expectStatus(404)
    })
  })
})
