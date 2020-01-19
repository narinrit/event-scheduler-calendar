import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        calendarDate: '',
        events: [
            {
                id: 1,
                name: 'Test',
                start: '2020-01-15 09:00',
                end: '2020-01-15 10:00',
                color: 'orange',
                repeat: null,
                note: '',
            },
            {
                id: 2,
                name: 'Repeat Day',
                start: '2019-12-02 09:00',
                end: '2019-12-02 10:00',
                color: 'green',
                repeat: 'day',
                note: '',
            },
            {
                id: 3,
                name: 'Repeat Month',
                start: '2019-12-03 09:00',
                end: '2019-12-03 10:00',
                color: 'yellow',
                repeat: 'month',
                note: '',
            },
            {
                id: 4,
                name: 'Repeat Year',
                start: '2019-01-04 09:00',
                end: '2019-01-04 10:00',
                color: 'blue',
                repeat: 'year',
                note: '',
            },
            {
                id: 5,
                name: 'Repeat Week',
                start: '2019-12-16 09:00',
                end: '2019-12-16 10:00',
                color: 'red',
                repeat: 'week',
                note: '',
            },
        ],
        dialog: {
            open: false,
            data: null as any,
        },
    },
    getters: {
        events(state) {
            const currentMoment = moment(state.calendarDate || undefined).startOf('month');

            // In this day
            let events: any[] = [];

            for (let i = 1; i <= currentMoment.daysInMonth(); i += 1) {
                currentMoment.date(i);

                // eslint-disable-next-line max-len
                const eventsThisDay = state.events.filter((event) => moment(event.start).isSame(currentMoment, 'day'));

                const allRepeatedEvents = state.events.filter((event) => !!event.repeat
                    && moment(event.start).startOf('day').isSameOrBefore(currentMoment)
                    && !eventsThisDay.includes(event));

                const mapRepeatedEventFn = (item: any) => {
                    const newStart = moment(item.start)
                        .date(currentMoment.date())
                        .month(currentMoment.month())
                        .year(currentMoment.year());
                    return {
                        ...item,
                        start: newStart.format('YYYY-MM-DD HH:mm'),
                        end: moment(item.end).subtract(moment(item.start).diff(newStart)).format('YYYY-MM-DD HH:mm'),
                    };
                };

                const repeatedEvents = [
                    // Repeat daily
                    ...allRepeatedEvents.filter((event) => event.repeat === 'day')
                        .map(mapRepeatedEventFn),

                    // Repeat week
                    ...allRepeatedEvents.filter((event) => event.repeat === 'week'
                        && moment(event.start).weekday() === currentMoment.weekday())
                        .map(mapRepeatedEventFn),

                    // Repeat month
                    ...allRepeatedEvents.filter((event) => event.repeat === 'month'
                        && moment(event.start).date() === currentMoment.date())
                        .map(mapRepeatedEventFn),

                    // Repeat year
                    ...allRepeatedEvents.filter((event) => event.repeat === 'year'
                        && moment(event.start).date() === currentMoment.date()
                        && moment(event.start).month() === currentMoment.month())
                        .map(mapRepeatedEventFn),
                ];

                events = [
                    ...events,

                    // In this day
                    ...eventsThisDay,

                    // Repeated events
                    ...repeatedEvents,
                ];
            }

            return events;
        },
    },
    mutations: {
        setCalendarDate(state, data) {
            state.calendarDate = data;
        },
        addEvent(state, event) {
            state.events.push({
                ...event,
                id: Math.random(),
            });
        },
        updateEvent(state, event) {
            const index = state.events.findIndex((item) => item.id === event.id);
            state.events[index] = event;
            state.events = [...state.events];
        },
        openDialog(state) {
            state.dialog.open = true;
        },
        closeDialog(state) {
            state.dialog.open = false;
        },
        setDialogOpen(state, open) {
            state.dialog.open = open;
        },
        setDialogData(state, data) {
            state.dialog.data = { ...data };
        },
        openNewEventDialog(state) {
            state.dialog.open = true;
            state.dialog.data = {
                id: null,
                name: '',
                start: moment().hour(9).minute(0).format('YYYY-MM-DD HH:mm'),
                end: moment().hour(10).minute(0).format('YYYY-MM-DD HH:mm'),
                color: 'primary',
                repeat: null,
                note: '',
            };
        },
    },
    actions: {
        openNewEventDialog({ commit }) {
            commit('openNewEventDialog');
            commit('setDialogData', {
                id: null,
                name: '',
                start: moment().hour(9).minute(0).format('YYYY-MM-DD HH:mm'),
                end: moment().hour(10).minute(0).format('YYYY-MM-DD HH:mm'),
                color: 'primary',
                repeat: null,
                note: '',
            });
        },
        openEventDialogById({ commit, getters }, id) {
            const existsEvent = getters.events.find((item: any) => item.id === id);
            if (existsEvent) {
                commit('openDialog');
                commit('setDialogData', existsEvent);
            }
        },
        saveEvent({ state, commit }, event) {
            if (event.id) {
                commit('updateEvent', event);
            } else {
                commit('addEvent', event);
            }
        },
    },
    modules: {
        //
    },
});
