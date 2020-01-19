import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import { IEvent } from '@/types/IEvent';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        calendarDate: '',
        events: [
            {
                id: 1,
                name: 'New Year',
                start: '2020-01-01 00:00',
                end: '2020-01-01 23:59',
                color: 'orange',
                repeat: 'year',
                note: 'Repeat Yearly',
            },
            {
                id: 2,
                name: 'Thai Tech Pro Submit Project Deadline',
                start: '2020-01-20 08:00',
                end: '2020-01-20 09:00',
                color: 'blue',
                repeat: null,
                note: '',
            },
            {
                id: 3,
                name: 'Receive salary',
                start: '2019-12-28 15:00',
                end: '2019-12-28 15:30',
                color: 'red',
                repeat: 'month',
                note: 'Repeat Monthly',
            },
            {
                id: 4,
                name: 'Running at lumpini park',
                start: '2019-12-20 18:00',
                end: '2019-12-20 19:00',
                color: 'green',
                repeat: 'week',
                note: 'Repeat weekly',
            },
        ] as IEvent[],
        dialog: {
            open: false,
            data: null as any,
        },
    },
    getters: {
        events(state) {
            const currentMoment = moment(state.calendarDate || undefined).startOf('month');

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
        deleteEventById(state, id) {
            const index = state.events.findIndex((item: any) => item.id === id);
            state.events.splice(index, 1);
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
    },
    actions: {
        openNewEventDialog({ commit }) {
            commit('openDialog');
            commit('setDialogData', {
                id: null,
                name: '',
                start: moment().hour(9).minute(0).format('YYYY-MM-DD HH:mm'),
                end: moment().hour(10).minute(0).format('YYYY-MM-DD HH:mm'),
                color: 'primary',
                repeat: null,
                note: '',
            } as IEvent);
        },
        openEventDialogById({ commit, state }, id) {
            const existsEvent = state.events.find((item: any) => item.id === id);
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
