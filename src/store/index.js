import Vuex from 'vuex'
import getters from './getters.js'
import user from './modules/user.js'

export default new Vuex.Store({
  modules: {
    user
  },
  getters
})