const state = {
  isal: 0
}

const mutations = {
  setIsal(state, isal) {
    state.isal = isal
  }
}

export default {
  namespaced: true,
  state,
  mutations
}