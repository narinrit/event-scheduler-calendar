import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        events: [
            {
                name: 'Test',
                start: '2020-01-15 09:00',
                end: '2020-01-16 18:00',
                color: 'orange',
                repeat: null,
            },
        ],
    },
    mutations: {
        addEvent(state, event) {
            state.events.push(event);
        },
    },
    actions: {
    },
    modules: {
    },
});
