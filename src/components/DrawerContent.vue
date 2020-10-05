<template>
  <v-row
    no-gutters
    class="flex-column fill-height"
  >
    <v-col cols="auto">
      <v-toolbar
        flat
        height="64"
      >
        <router-link to="/">
          <v-img
            :src="require('../../public/img/svg/clustered-mini.svg')"
            class="ml-1 mb-2"
          />
        </router-link>
        <v-spacer />
        <v-btn
          v-model="drawer"
          icon
          x-large
          class="mr-0"
          @click="drawer = !drawer"
        >
          <v-icon size="32">
            {{ icons.mdiClose }}
          </v-icon>
        </v-btn>
      </v-toolbar>
    </v-col>
    <v-col class="overflow-y-auto">
      <v-list>
        <template v-for="(entry, i) in entries">
          <v-list-group
            :key="i"
            append-icon=""
          >
            <template #activator>
              <v-list-item
                :to="entry.to"
                class="subtitle-3 pl-0"
                color="primary"
              >
                {{ entry.title }}
              </v-list-item>
            </template>
            <template v-for="(item, j) in entry.items">
              <template v-if="item.header">
                <v-subheader
                  v-if="item.header"
                  :key="j"
                >
                  {{ item.header }}
                </v-subheader>
                <v-list-item
                  v-for="link in item.links"
                  :key="link.title"
                  :to="link.to"
                >
                  {{ link.title }}
                </v-list-item>
              </template>
              <template v-else>
                <v-list-item
                  :key="j"
                >
                  {{ item.title }}
                </v-list-item>
              </template>
            </template>
          </v-list-group>
        </template>
      </v-list>
    </v-col>
    <v-divider />
    <v-list>
      <v-list-item class="subtitle-3">
        Go to console
      </v-list-item>
      <v-list-item
        to="/signup/trial"
        class="subtitle-3"
      >
        Sign up
      </v-list-item>
    </v-list>
  </v-row>
</template>

<script>
import { mdiClose } from '@mdi/js';

export default {
  props: {
    menu: {
      type: Boolean,
      required: true,
    },
  },

  data () {
    return {
      drawer: false,
      entries: [
        {
          title: 'Platform',
          items: [
            {
              header: 'Clustered Cloud',
              links: [
                { title: 'How it works', to: '/platform' },
                { title: 'Supported stacks', to: '/stacks' },
                { title: 'Addons', to: '/platform#services' },
              ],
            },
            {
              header: 'Languages',
              links: [
                { title: 'Node.js', to: '/stacks/nodejs' },
                { title: 'PHP', to: '/stacks/php' },
                { title: 'Python', to: '/stacks/python' },
                { title: 'Go', to: '/stacks/go' },
                { title: 'HTML/CSS/JS', to: '/stacks/html' },
              ],
            },
            {
              header: 'Apps and frameworks',
              links: [
                { title: 'Magento', to: '/stacks/magento' },
                { title: 'Wordpress', to: '/stacks/wordpress' },
                { title: 'Vue.js', to: '/stacks/vuejs' },
                { title: 'Laravel', to: '/stacks/laravel' },
              ],
            },
          ],
        },
        {
          title: 'Solutions',
          items: [
            { title: 'Developers', to: '/solutions/for-developers' },
            { title: 'SaaS and startups', to: '/solutions/saas' },
            { title: 'Agencies', to: '/solutions/for-agencies' },
            { title: 'Enterprise', to: '/solutions/enterprise' },
          ],
        },
        { title: 'Pricing', to: '/pricing' },
        {
          title: 'Resources',
          items: [
            { title: 'Documentation', to: '/docs' },
            { title: 'Help Center', to: '/help' },
            { title: 'Webinars', to: '/webinars' },
            { title: 'Blog', to: '/blog' },
          ],
        },
      ],
      icons: { mdiClose },
    };
  },

  watch: {
    drawer (newVal) { this.$emit('update:menu', newVal); },

    menu (newVal) { this.drawer = newVal; },
  },
};
</script>

<style scoped>
/**
 * TODO: Try to figure this out. I don't know why these are needed,
 * but without them, the button stays focused while the drawer is open.
 */
div >>> .v-btn::before {
  background-color: #ffffff;
}

div >>> .v-btn:hover::before {
  background-color: rgba(0, 0, 0, 0.54);
}

/**
 * TODO: Try to figure this out.
 * I don't know why this is needed, but without it, the list-item text
 * won't change to the primary color when the sub-group items are expanded.
 */
.v-list-item--active.v-list-item--link .subtitle-3 {
  color: var(--v-primary-base) !important;
}
</style>
