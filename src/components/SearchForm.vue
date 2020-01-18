<template>
    <div>
        <v-menu
            offset-y
        >
            <template v-slot:activator="{ on }">
                <v-text-field
                    v-model="value"
                    class="mr-2"
                    label="Search"
                    dense
                    outlined
                    hide-details
                    v-on="on"
                    @blur="onBlur"
                />
            </template>
            <v-list>
                <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                    three-line
                    @click="openDialog(item)"
                >
                    <v-list-item-avatar>
                        <v-icon>mdi-calendar</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle>
                            Start {{ item.end }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                            End {{ item.start }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                    v-if="!items.length && value"
                    disabled
                >
                    <v-list-item-title>No result</v-list-item-title>
                </v-list-item>
                <v-list-item
                    v-if="!items.length && !value"
                    disabled
                >
                    <v-list-item-title>Search</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'EventDialog',
    data: () => ({
        value: '',
    }),
    computed: {
        items() {
            if (!this.value) return [];
            return this.$store.state.events.filter(
                (event: any) => event.name.toLowerCase().includes(this.value.toLowerCase())
                    || event.note.toLowerCase().includes(this.value.toLowerCase())
                    || event.start.toLowerCase().includes(this.value.toLowerCase())
                    || event.end.toLowerCase().includes(this.value.toLowerCase()),
            );
        },
    },
    methods: {
        onBlur() {
            setTimeout(() => {
                this.value = '';
            }, 500);
        },
        openDialog(item: any) {
            this.$store.commit('openDialog');
            this.$store.commit('setDialogData', item);
        },
    },
});
</script>

<style scoped>

</style>
