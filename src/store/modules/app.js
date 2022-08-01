const state = {
  isal: 0,
  current_id: 0
}

const mutations = {
  setIsal(state, isal) {
    state.isal = isal
  },
  setCurrentId(state, id) {
    state.current_id = id
    localStorage.setItem('current_id', id)
  }
}

export default {
  namespaced: true,
  state,
  mutations
}