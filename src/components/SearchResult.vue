<template>
    <v-row align="center" justify="center" v-if="!data || (data && !data.groups.length)">
        <v-icon>sentiment_dissatisfied</v-icon> Nenhum item encontrado
    </v-row>
    <div style="width: 100%;" v-else>
        <v-row v-for="(group, i) in data.groups" :key="`group-${i}`">
        <v-subheader class="headline">{{ group.groupName }}</v-subheader>
        <v-container fluid>
            <v-row>

                <v-card
                    class="d-inline-flex pa-2 ml-4"
                    v-for="(item, j) in group.Items" :key="`item-${j}`"
                    width="200px"
                    tile
                >
                    <v-img
                    v-if="item.imgUrl"
                    class="white--text"
                    gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
                    height="100px"
                    v-bind:src="item.imgUrl"
                    >
                    <v-card-title class="align-end fill-height">{{ item.title }}</v-card-title>
                    </v-img>                    
                </v-card>

            </v-row>
            <v-divider style="margin-top: 20px"></v-divider>
            </v-container>
        </v-row>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'SearchResult',
    props: ["data"],
    methods: {        
    }
})
</script>

<style>

</style>