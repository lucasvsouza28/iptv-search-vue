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
        prepend-inner-icon="search"
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
        <template>          
          <v-list-item @click="showDialogBox">
            <v-list-item-action>
              <v-icon>settings_applications</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">Configurar url</v-list-item-title>
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
          <SearchResult :data="searchResult" :loading="loading"></SearchResult>
        </v-row>
      </v-container>
    </v-content>
    <v-alert v-if="errorMessage" type="error">
      {{errorMessage}}
    </v-alert>

    <v-row justify="center">
      <v-dialog v-model="showDialog" max-width="600px">
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
        this.loading = true;

        const url = localStorage.getItem(this.M3U_URL_KEY)
        const response = await axios.post('/api/search', { query: this.query || 'turbo', url: url });

        this.searchResult = response.data;
        this.errorMessage = '';        
      } catch (error) {
        this.errorMessage = 'Ocorreu um erro ao pesquisar: '  + error.message;
      } finally {
        this.loading = false;
      }
    },
    setUrl: function () {
      localStorage.setItem(this.M3U_URL_KEY, this.dialogUrl);
      this.showDialog = false;
    },
    showDialogBox: function() {
      this.showDialog = true;
      this.dialogUrl = localStorage.getItem(this.M3U_URL_KEY) || '';
    }
  },
  data: () => ({
    M3U_URL_KEY: 'url_m3u',
    query: '',
    dialogUrl: '',
    searchResult: null,
    errorMessage: '',
    showDialog: false,
    loading: false,
    drawer: false,      
  }),
});
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none
}
</style>
