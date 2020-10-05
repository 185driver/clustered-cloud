<template>
  <v-container
    :class="{'px-0': $vuetify.breakpoint.smAndDown}"
    fluid
    class="d-flex align-center py-0"
  >
    <router-link to="/">
      <div class="d-flex flex-shrink-0 mb-1">
        <img :src="require('../../public/img/svg/clustered.svg')">
      </div>
    </router-link>
    <div class="ml-12 hidden-sm-and-down">
      <v-menu
        open-on-hover
        bottom
        offset-y
      >
        <template #activator="{ on }">
          <v-btn
            text
            to="/platform"
            v-on="on"
          >
            Platform
          </v-btn>
        </template>
        <platform-menu />
      </v-menu>
      <v-menu
        open-on-hover
        bottom
        offset-y
      >
        <template #activator="{ on }">
          <v-btn
            text
            v-on="on"
          >
            Solutions
          </v-btn>
        </template>
        <v-list nav>
          <v-list-item
            v-for="(solution, index) in solutions"
            :key="index"
            :to="solution.to"
          >
            <v-list-item-title>
              {{ solution.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        text
        to="/pricing"
      >
        Pricing
      </v-btn>
      <v-menu
        open-on-hover
        bottom
        offset-y
      >
        <template #activator="{ on }">
          <v-btn
            text
            v-on="on"
          >
            Resources
          </v-btn>
        </template>
        <v-list nav>
          <v-list-item
            v-for="(resource, index) in resources"
            :key="index"
            :to="resource.to"
          >
            <v-list-item-title>
              {{ resource.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <v-spacer />
    <div>
      <v-btn
        v-if="$vuetify.breakpoint.mdAndUp"
        text
        class="mr-4"
      >
        Go to console
      </v-btn>
      <v-btn
        v-if="$vuetify.breakpoint.mdAndUp"
        outlined
        color="primary"
        to="/signup/trial"
      >
        Free Trial
      </v-btn>
    </div>
    <v-btn
      v-if="$vuetify.breakpoint.smAndDown"
      icon
      x-large
      class="mr-n1"
      @click="drawer = !drawer"
    >
      <v-icon size="32">
        {{ icons.mdiMenu }}
      </v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { mdiMenu } from '@mdi/js';
import PlatformMenu from '@/components/PlatformMenu';

export default {

  components: { PlatformMenu },

  props: {
    menu: {
      type: Boolean,
      required: true,
    },
  },

  data () {
    return {
      drawer: false,
      icons: { mdiMenu },
      resources: [
        { title: 'Documentation', to: '/docs' },
        { title: 'Help Center', to: '/help' },
        { title: 'Webinars', to: '/webinars' },
        { title: 'Blog', to: '/blog' },
      ],
      solutions: [
        { title: 'Developers', to: '/solutions/for-developers' },
        { title: 'SaaS and startups', to: '/solutions/saas' },
        { title: 'Agencies', to: '/solutions/for-agencies' },
        { title: 'Enterprise', to: '/solutions/enterprise' },
      ],
    };
  },

  watch: {
    drawer (newVal) { this.$emit('update:menu', newVal); },

    menu (newVal) { this.drawer = newVal; },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: none;
}

/* Override placed here because App.vue @media rules fight with vuetify. */
.container--fluid {
  max-width: 100% !important;
}
</style>
