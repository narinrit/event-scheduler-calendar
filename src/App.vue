<template>
    <v-app>
        <v-content>
            <v-app-bar elevation="0">
                <v-toolbar-title class="mr-2">
                    {{ title }}
                </v-toolbar-title>

                <v-select
                    v-model="type"
                    :items="types"
                    dense
                    outlined
                    hide-details
                    class="mx-2"
                    label="Type"
                    style="max-width: 200px"
                />

                <v-btn
                    icon
                    @click="$refs.calendar.prev()"
                >
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>

                <v-btn
                    icon
                    @click="$refs.calendar.next()"
                >
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>

                <v-spacer />

                <search-form />

                <v-btn
                    color="pink"
                    dark
                    rounded
                    @click="openDialog"
                >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-app-bar>

            <v-calendar
                ref="calendar"
                v-model="calendarDate"
                :type="type"
                :events="$store.getters.events"
                :event-color="getEventColor"
                @click:event="openDialog"
            />

            <event-dialog />
        </v-content>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
import EventDialog from './components/EventDialog.vue';
import SearchForm from './components/SearchForm.vue';

export default Vue.extend({
    name: 'App',
    components: {
        EventDialog,
        SearchForm,
    },
    data: () => ({
        value: '',
        types: [
            {
                value: 'day',
                text: 'Day',
            },
            {
                value: 'week',
                text: 'Week',
            },
            {
                value: 'month',
                text: 'Month',
            },
        ],
        type: 'month',
    }),
    computed: {
        title() {
            const currentMoment = moment(this.$store.state.calendarDate || undefined);
            return `${currentMoment.format('MMMM')} ${currentMoment.format('YYYY')}`;
        },
        calendarDate: {
            get() {
                return this.$store.state.calendarDate;
            },
            set(data) {
                return this.$store.commit('setCalendarDate', data);
            },
        },
    },
    methods: {
        getEventColor(event: any) {
            return event.color;
        },
        openDialog({ event }: any) {
            if (event && event.id) {
                const existsEvent = this.$store.getters.events
                    .find((item: any) => item.id === event.id);

                if (existsEvent) {
                    this.$store.commit('openDialog');
                    this.$store.commit('setDialogData', existsEvent);
                }
            } else {
                this.$store.commit('openDialog');
                this.$store.commit('setDialogData', {
                    id: null,
                    name: '',
                    start: moment().hour(9).minute(0).format('YYYY-MM-DD HH:ss'),
                    end: moment().hour(10).minute(0).format('YYYY-MM-DD HH:ss'),
                    color: 'primary',
                    repeat: null,
                    note: '',
                });
            }
        },
    },
});
</script>
