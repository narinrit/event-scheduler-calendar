<template>
    <v-dialog
        v-model="open"
        max-width="600"
    >
        <v-card>
            <v-card-title>
                {{ title }}
            </v-card-title>
            <v-card-text>
                <v-form
                    v-if="form"
                    ref="form"
                    v-model="valid"
                >
                    <v-text-field
                        v-model="form.name"
                        label="Name"
                        autofocus
                        prepend-icon="mdi-card-text"
                        required
                    />

                    <v-row>
                        <v-col cols="6">
                            <v-menu
                                v-model="menus[0]"
                                :close-on-content-click="false"
                                :nudge-right="33"
                                :nudge-top="20"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="startDate"
                                        label="Start date"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        :rules="[
                                            v => !!v || 'This field is required.',
                                        ]"
                                        v-on="on"
                                    />
                                </template>
                                <v-date-picker
                                    v-model="startDate"
                                    @input="menus[0] = false"
                                />
                            </v-menu>
                        </v-col>

                        <v-col cols="6">
                            <v-menu
                                ref="menu1"
                                v-model="menus[1]"
                                :close-on-content-click="false"
                                :return-value.sync="startTime"
                                :nudge-right="33"
                                :nudge-top="20"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="startTime"
                                        label="Start time"
                                        prepend-icon="mdi-clock"
                                        readonly
                                        :rules="[
                                            v => !!v || 'This field is required.',
                                        ]"
                                        v-on="on"
                                    />
                                </template>
                                <v-time-picker
                                    v-model="startTime"
                                    format="24hr"
                                    @click:minute="() => {
                                        $refs.menu1.save(startTime);
                                        menus[1] = false
                                    }"
                                />
                            </v-menu>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="6">
                            <v-menu
                                v-model="menus[2]"
                                :close-on-content-click="false"
                                :nudge-right="33"
                                :nudge-top="20"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="endDate"
                                        label="Start date"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        :rules="endDateRules"
                                        v-on="on"
                                    />
                                </template>
                                <v-date-picker
                                    v-model="endDate"
                                    @input="menus[2] = false"
                                />
                            </v-menu>
                        </v-col>

                        <v-col cols="6">
                            <v-menu
                                ref="menu3"
                                v-model="menus[3]"
                                :close-on-content-click="false"
                                :nudge-right="33"
                                :nudge-top="20"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="endTime"
                                        label="Start time"
                                        prepend-icon="mdi-clock"
                                        readonly
                                        :rules="endDateRules"
                                        v-on="on"
                                    />
                                </template>
                                <v-time-picker
                                    v-model="endTime"
                                    format="24hr"
                                    @click:minute="() => {
                                        $refs.menu3.save(startTime);
                                        menus[3] = false
                                    }"
                                />
                            </v-menu>
                        </v-col>
                    </v-row>

                    <v-select
                        v-model="form.repeat"
                        :items="repeats"
                        label="Repeat"
                        prepend-icon="mdi-repeat"
                    />
                    <v-textarea
                        v-model="form.note"
                        label="Note"
                        prepend-icon="mdi-text"
                        rows="3"
                        filled
                    />

                    <div class="text-center">
                        <v-btn-toggle
                            v-model="form.color"
                            mandatory
                        >
                            <v-btn
                                v-for="color in colors"
                                :key="color"
                                :color="color"
                                :value="color"
                            />
                        </v-btn-toggle>
                    </div>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="blue darken-1"
                    text
                    @click="$store.commit('closeDialog')"
                >
                    Close
                </v-btn>
                <v-btn
                    color="primary"
                    depressed
                    @click="submit"
                >
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';

export default Vue.extend({
    name: 'EventDialog',
    data: () => ({
        valid: false,
        menus: [],
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
        colors: ['blue', 'green', 'red', 'orange', 'yellow'],
    }),
    computed: {
        open: {
            get() {
                return this.$store.state.dialog.open;
            },
            set(open) {
                return this.$store.commit('setDialogOpen', open);
            },
        },
        form: {
            get() {
                return this.$store.state.dialog.data;
            },
            set(data) {
                return this.$store.commit('setDialogData', data);
            },
        },
        startDate: {
            get(): string {
                return moment(this.form.start).format('YYYY-MM-DD');
            },
            set(val: string) {
                const newMoment = moment(val);
                this.form.start = moment(this.form.start)
                    .year(newMoment.year())
                    .month(newMoment.month())
                    .date(newMoment.date())
                    .format('YYYY-MM-DD HH:mm');
            },
        },
        startTime: {
            get(): string {
                return moment(this.form.start).format('HH:mm');
            },
            set(val: string) {
                const newMoment = moment(`2000-01-01 ${val}`);
                this.form.start = moment(this.form.start)
                    .hour(newMoment.hour())
                    .minute(newMoment.minute())
                    .format('YYYY-MM-DD HH:mm');
            },
        },
        endDate: {
            get(): string {
                return moment(this.form.end).format('YYYY-MM-DD');
            },
            set(val: string) {
                const newMoment = moment(val);
                this.form.end = moment(this.form.end)
                    .year(newMoment.year())
                    .month(newMoment.month())
                    .date(newMoment.date())
                    .format('YYYY-MM-DD HH:mm');
            },
        },
        endTime: {
            get(): string {
                return moment(this.form.end).format('HH:mm');
            },
            set(val: string) {
                const newMoment = moment(`2000-01-01 ${val}`);
                this.form.end = moment(this.form.end)
                    .hour(newMoment.hour())
                    .minute(newMoment.minute())
                    .format('YYYY-MM-DD HH:mm');
            },
        },
        title() {
            if (this.form && this.form.id) {
                return 'Edit Event';
            }
            return 'Add Event';
        },
        endDateRules(): any {
            return [
                (v: any) => !!v || 'This field is required.',
                () => moment(this.form.end).isAfter(this.form.start)
                    || 'End date should not before start date',
            ];
        },
    },
    methods: {
        submit() {
            // @ts-ignore
            if (!this.$refs.form.validate()) {
                return;
            }

            this.$store.dispatch('saveEvent', this.form);
            this.$store.commit('closeDialog');
        },
    },
});
</script>

<style scoped>

</style>
