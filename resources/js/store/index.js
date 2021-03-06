import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger';
import colors from './modules/colors'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        colors
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
