import pg from 'pg'

import creds from './config/db.js'

// export default {
//   host: 'localhost',
//   port: 5432,
//   database: 'database',
//   user: 'user',
//   password: 'password'
// }

export default new pg.Pool(creds)
