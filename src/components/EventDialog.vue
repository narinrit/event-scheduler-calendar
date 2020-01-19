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
                <v-form v-if="form">
                    <v-text-field
                        v-model="form.name"
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
                                v-model="form.start"
                                label="Start"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-on="on"
                            />
                        </template>
                        <v-date-picker
                            v-model="form.start"
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
                                v-model="form.end"
                                label="End"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-on="on"
                            />
                        </template>
                        <v-date-picker
                            v-model="form.end"
                            @input="menu2 = false"
                        />
                    </v-menu>

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
                        <v-btn-toggle v-model="form.color">
                            <v-btn
                                color="blue"
                                value="blue"
                            />
                            <v-btn
                                color="green"
                                value="green"
                            />
                            <v-btn
                                color="red"
                                value="red"
                            />
                            <v-btn
                                color="orange"
                                value="orange"
                            />
                            <v-btn
                                color="yellow"
                                value="yellow"
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
                    @click="dialogSubmit"
                >
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'EventDialog',
    data: () => ({
        menu1: false,
        menu2: false,
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
        title() {
            if (this.form && this.form.id) {
                return 'Edit Event';
            }
            return 'Add Event';
        },
    },
    methods: {
        dialogSubmit() {
            this.$store.dispatch('saveEvent', this.form);
            this.$store.commit('closeDialog');
        },
    },
});
</script>

<style scoped>

</style>
