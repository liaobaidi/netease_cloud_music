import user from './modules/user.js'

export default {
  userid() {
    return user.state.userId || localStorage.getItem('userId')
  }
}