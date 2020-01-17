<template>
    <v-app>
        <v-content>
            <v-app-bar elevation="0">
                <v-toolbar-title class="mr-2">
                    Event Scheduler Calendar
                </v-toolbar-title>

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

                <v-select
                    v-model="type"
                    :items="types"
                    dense
                    outlined
                    hide-details
                    class="mx-2"
                    label="Type"
                />

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
                v-model="value"
                :type="type"
                :events="$store.state.events"
                :event-color="getEventColor"
                @click:event="openDialog"
            />

            <v-dialog
                v-model="dialogOpen"
                max-width="600"
            >
                <v-card>
                    <v-card-title>
                        Add Event
                    </v-card-title>
                    <v-card-text>
                        <v-form v-if="dialogData">
                            <v-text-field
                                v-model="dialogData.name"
                                label="Name"
                                autofocus
                                prepend-icon="mdi-card-text"
                                required
                            />

                            <v-menu
                                v-model="menu1"
                                :close-on-content-click="false"
                                :nudge-right="33"
                                :nudge-top="20"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="dialogData.start"
                                        label="Start"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-on="on"
                                    />
                                </template>
                                <v-date-picker
                                    v-model="dialogData.start"
                                    @input="menu1 = false"
                                />
                            </v-menu>

                            <v-menu
                                v-model="menu2"
                                :close-on-content-click="false"
                                :nudge-right="33"
                                :nudge-top="20"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="dialogData.end"
                                        label="End"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-on="on"
                                    />
                                </template>
                                <v-date-picker
                                    v-model="dialogData.end"
                                    @input="menu2 = false"
                                />
                            </v-menu>

                            <v-select
                                v-model="dialogData.repeat"
                                :items="repeats"
                                label="Repeat"
                                prepend-icon="mdi-repeat"
                            />

                            <v-textarea
                                v-model="dialogData.name"
                                label="Note"
                                prepend-icon="mdi-text"
                                rows="3"
                                filled
                                hide-details
                            />
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="closeDialog"
                        >
                            Close
                        </v-btn>
                        <v-btn
                            color="primary"
                            depressed
                            @click="dialogSubmit"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'App',
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
        repeats: [
            {
                value: null,
                text: 'None',
            },
            {
                value: 'day',
                text: 'Daily',
            },
            {
                value: 'week',
                text: 'Weekly',
            },
            {
                value: 'month',
                text: 'Monthly',
            },
            {
                value: 'year',
                text: 'Yearly',
            },
        ],
        dialogOpen: false,
        dialogData: null as any,
        menu1: false,
        menu2: false,
    }),
    methods: {
        getEventColor(event: any) {
            return event.color;
        },
        openDialog({ event }: any) {
            this.dialogOpen = true;
            this.dialogData = {
                name: '',
                start: '2020-01-15 09:00',
                end: '2020-01-16 18:00',
                color: 'orange',
                repeat: null,
                ...event,
            };
        },
        closeDialog() {
            this.dialogOpen = false;
        },
        dialogSubmit() {
            this.$store.commit('addEvent', this.dialogData);
            this.dialogOpen = false;
        },
    },
});
</script>
