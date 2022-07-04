import { setToken, removeToken } from '@/utils/cookie.js'
import { loginUser, logoutUser } from '@/api/user.js'
const initState = () => {
  return {
    token: '',
    avatar: {},
    userId: 0
  }
}

const state = initState()

const mutations = {
  SET_TOKEN(state, token) {
    state.token = 'Bear' + token
  },
  SET_INFO(state, info) {
    state.userId = info.userId
    state.avatar.url = info.avatarUrl
    localStorage.setItem('userId', info.userId)
  },
  REMOVE_TOKEN(state) {
    state.token = ''
  }
}

const actions = {
  login({ commit }, { phone, captcha }) {
    return new Promise((resolve, reject) => {
      loginUser({ phone, captcha })
        .then((res) => {
          // console.log(res, 'login')
          if (+res.code === 200) {
            commit('SET_TOKEN', res.token)
            commit('SET_INFO', res.profile)
            setToken(res.token)
            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logoutUser()
        .then((res) => {
          if (res.code === 200) {
            removeToken()
            commit('REMOVE_TOKEN')
            resolve(res)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
