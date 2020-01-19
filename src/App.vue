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
                    @click="$store.dispatch('openNewEventDialog')"
                >
                    <v-icon class="mr-2">
                        mdi-plus
                    </v-icon>
                    Add Event
                </v-btn>
            </v-app-bar>

            <v-calendar
                ref="calendar"
                v-model="calendarDate"
                :type="type"
                :events="$store.getters.events"
                :event-color="getEventColor"
                @click:event="openEvent"
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
        openEvent({ event }: any) {
            if (event && event.id) {
                this.$store.dispatch('openEventDialogById', event.id);
            }
        },
    },
});
</script>
