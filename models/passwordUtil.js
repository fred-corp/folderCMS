const bcrypt = require('bcryptjs')


class passwordUtil {
  constructor (config) {
    this.saltRounds = config.saltRounds
  }

  // hashPassword(password) hash, salt & pepper password with bcrypt
  hashPassword (password) {
    const salt = bcrypt.genSaltSync(this.saltRounds)
    return bcrypt.hashSync(password, salt)
  }

  // comparePassword(password, hash) password with bcrypt
  comparePassword (password, hash) {
    return bcrypt.compareSync(password, hash)
  }


}

module.exports = passwordUtil