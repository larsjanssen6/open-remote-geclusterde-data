const state = {
    colors: [
        '#ffb3b3',
        '#ff4d4d',
        '#ff0000',
        '#b30000',
        '#660000'
    ]
};

const getters = {
    colors: (state) => {
        return state.colors
    }
};

const mutations = {
    SET_COLOR: (state, oldValue, newValue) => {
        this.state.filter(x => {

        })
    }
};

const actions = {
    changeColor: ({commit}, oldValue, newValue) => {
        commit('SET_COLOR', oldValue, newValue)
        return state.colors;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
