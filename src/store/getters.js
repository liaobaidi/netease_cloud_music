import user from './modules/user.js'
import app from './modules/app.js'

export default {
  userid() {
    return user.state.userId || localStorage.getItem('userId')
  },
  isal() {
    return app.state.isal
  },
  current_id() {
    return app.state.current_id
  }
}