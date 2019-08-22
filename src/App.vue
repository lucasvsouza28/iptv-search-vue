<template>
  <v-app id="keep">
    <v-app-bar
      app
      clipped-left
      color="blue"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <span class="title ml-3 mr-5">IPTV&nbsp;<span class="font-weight-light">Search</span></span>
      <v-text-field        
        flat
        hide-details
        v-model="query"
        v-on:keyup.enter="doSearch"
      ></v-text-field>
      <div class="flex-grow-1"></div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      color="grey lighten-4"
      open=false
    >
      <v-list
        dense
        class="grey lighten-4"
      >
        <template v-for="(item, i) in items">
          <v-row
            v-if="item.heading"
            :key="i"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-right"
            >
              <v-btn
                small
                text
              >edit</v-btn>
            </v-col>
          </v-row>
          <v-divider
            v-else-if="item.divider"
            :key="i"
            dark
            class="my-4"
          ></v-divider>
          <v-list-item
            v-else
            :key="i"
            @click=""
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container
        fluid
        class="grey lighten-4 fill-height"
      >
        <v-row
          justify="center"
          align="center"
        >


        

        <div v-if="!searchResult || (searchResult && !searchResult.groups)">Nenhum item encontrado</div>
        <div v-else>
          <v-flex v-for="(group, index) in searchResult.groups" :key="`group-${index}`">
            <v-subheader>{{ group.groupName }}</v-subheader>
            <v-card
                class="mx-auto"
                :outlined="true"
                :raised="true"
                v-for="(item, index_i) in group.Items" :key="`item-${index_i}`"
                width="22%"
              >
                <v-img
                  v-if="item.imgUrl"
                  class="white--text"
                  height="200px"
                  src="item.imgUrl.trim()"
                >
                  <v-card-title class="align-end fill-height">{{ item.title }} - {{ item.imgUrl }}</v-card-title>
                </v-img>            
              </v-card>
              <v-divider />
          </v-flex>          
        </div>
        

        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
const axios = require('axios');
import HelloWorld from './components/HelloWorld.vue';

export default Vue.extend({
  name: 'App',
  components: {
    HelloWorld,
  },
  async mounted() {
    
  },
  methods: {
    doSearch: async function() {
      const response = await axios.post('http://localhost:3000/api/search', { query: this.query || 'turbo', url: this.url });

      this.searchResult = response.data;
    }
  },
  data: () => ({
    query: 'turbo',
    url: 'http://clubsrv.me/get.php?username=1drM3Cdf3&password=fireurl.co&output=ts&type=m3u_plus',
    searchResult: null,

    drawer: null,
      items: [        
      ],
  }),
});
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none
}
</style>