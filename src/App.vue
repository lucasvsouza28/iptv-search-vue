<template>
  <v-app id="keep">
    <v-app-bar
      app
      clipped-left
      color="indigo"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <span class="title ml-3 mr-5 white--text">IPTV&nbsp;<span class="font-weight-light">Search</span></span>
      <v-text-field        
        solo
        hide-details
        class="white--text"
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
            @click="this.showDialog = true"
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
        class="grey lighten-4"
      >
        <v-row align="center">
          <SearchResult :data="searchResult"></SearchResult>
        </v-row>
      </v-container>
    </v-content>
    <v-alert v-if="errorMessage" type="error">
      I'm an error alert.
    </v-alert>

    <v-row justify="center">
      <v-dialog v-model="showDialog" persistent max-width="600px">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-text-field v-model="dialogUrl" label="Url da lista*" required></v-text-field>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>            
            <v-btn color="blue darken-1" @click="setUrl">Salvar</v-btn>
          </v-card-actions>

        </v-card>
      </v-dialog>
    </v-row>

  </v-app>
</template>

<script lang="ts">
const axios = require('axios');
import Vue from 'vue';
import SearchResult from './components/SearchResult.vue';

export default Vue.extend({
  name: 'App',
  components: {
    SearchResult
  },
  async mounted() {
    this.showDialog = !window.localStorage.getItem(this.M3U_URL_KEY);
  },
  methods: {
    doSearch: async function() {
      try {
        const url = localStorage.getItem(this.M3U_URL_KEY)
        const response = await axios.post('http://localhost:3000/api/search', { query: this.query || 'turbo', url: url });

        this.searchResult = response.data;
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'Ocorreu um erro ao pesquisar: '  + error.message;
      }
    },
    setUrl: function () {
      localStorage.setItem(this.M3U_URL_KEY, this.dialogUrl);
      this.showDialog = false;
    }
  },
  data: () => ({
    M3U_URL_KEY: 'url_m3u',
    query: '',
    dialogUrl: '',
    //url: 'http://clubsrv.me/get.php?username=1drM3Cdf3&password=fireurl.co&output=ts&type=m3u_plus',
    searchResult: null,
    errorMessage: '',
    showDialog: false,

    drawer: false,
      items: [
        { text: 'Configurar url', icon: 'mdi-settings' }
      ],
  }),
});
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none
}
</style>