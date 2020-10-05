<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :width="$vuetify.breakpoint.smAndDown ? '100%' : '350'"
      app
      right
      temporary
    >
      <drawer-content :menu.sync="drawer" />
    </v-navigation-drawer>
    <v-app-bar
      :height="$vuetify.breakpoint.smAndDown ? 64 : 72"
      app
      elevate-on-scroll
      color="#ffffff"
    >
      <app-bar-content :menu.sync="drawer" />
    </v-app-bar>
    <v-main class="grey lighten-4">
      <router-view
        :install-prompt-event.sync="installPromptEvent"
        :show-install-app-item="showInstallAppItem"
        :snack-btn-text="snackBtnText"
        :snack-with-buttons.sync="snackWithButtons"
      />
      <v-snackbar
        v-model="snackWithButtons"
        bottom
        left
        timeout="-1"
      >
        {{ snackWithBtnText }}
        <template #action="{ attrs }">
          <v-btn
            text
            color="#00f500"
            v-bind="attrs"
            @click.stop="snackBtnHandler"
          >
            {{ snackBtnText }}
          </v-btn>
          <v-btn
            icon
            class="ml-4"
            @click="closeSnackWithButtons"
          >
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
    <footer-trial />
    <footer-nav />
    <chat />
  </v-app>
</template>

<script>
import format from 'date-fns/format';
import removeHover from 'remove-hover';
import { mdiClose } from '@mdi/js';
import AppBarContent from '@/components/AppBarContent';
import Chat from '@/components/Chat';
import DrawerContent from '@/components/DrawerContent';
import FooterNav from '@/components/FooterNav';
import FooterTrial from '@/components/FooterTrial';

export default {
  name: 'App',

  components: {
    AppBarContent,
    Chat,
    DrawerContent,
    FooterNav,
    FooterTrial,
  },

  data () {
    return {
      drawer: false,
      icons: { mdiClose },
      installPromptEvent: null,
      isActiveTouchDevice: false,
      refreshing: false,
      registration: null,
      snackBtnText: '',
      snackWithBtnText: '',
      snackWithButtons: false,
    };
  },

  computed: {
    isTouchDevice () {
      // Determines if app is being used on a touch-enabled device.
      // This does not necessarily mean the user is interacting in touch mode.
      // The isActiveTouchDevice data variable determines that.
      return (
        navigator.maxTouchPoints > 0
        || navigator.msMaxTouchPoints > 0
        || 'ontouchstart' in window
        || 'ontouchstart' in document.documentElement
      );
    },

    showInstallAppItem () { return !!this.installPromptEvent; },
  },

  created () {
    // Determines if user is interacting with their device using touch events.
    window.addEventListener('touchstart', () => {
      // The user touched the screen.
      this.isActiveTouchDevice = true;

      // Removes hover state css from the source code if user is interacting
      // with the app using touch events. I'm using this solution until Vuetify
      // implements a better method of fixing this generic issue which affects
      // mobile devices. Look to the prev/next buttons in kp-vue for examples.
      // https://github.com/vuetifyjs/vuetify/issues/2178 didn't help things.
      removeHover();

      // This listener only runs once per page load.
      // Touch event listeners perform better during scroll if passive.
    }, { once: true, passive: true });

    // A2HS code is only called for non-touch devices.
    if (!this.isTouchDevice) {
      // Listens for browser's permission to invite user to install the app.
      // Uses a custom event here because beforeinstallprompt fires prior to
      // Firebase setting up App.vue after change in onAuthStateChanged().
      document.addEventListener(
        'beforeInstallPrompted', this.showInstallPrompt,
      );
    }

    // Listens for sw update and displays refresh snackbar as required.
    document.addEventListener('swUpdated', this.showRefreshUI, { once: true });

    // Refreshes all open app tabs when a new service worker is installed.
    // https://developers.google.com/web/tools/workbox/guides/advanced-recipes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Ensures app doesn't forcibly reload on initial app install after the
      // first SW is installed/activated, which would be poor UX. Succeeding
      // SW installs can only reach this code with the user's permission.
      if (!localStorage.getItem('sof_hasPreviousSW')) {
        localStorage.setItem('sof_hasPreviousSW', 'true');
        return;
      }

      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    });
  },

  methods: {
    closeSnackWithButtons () {
      if (this.snackBtnText === 'Install') {
        this.installWasDeclined();
      }

      this.snackWithButtons = false;
    },

    installWasDeclined () {
      // Updates the ls vars due to user declining to install the app.
      const today = format(new Date(), 'yyyy-MM-dd');
      let lsCount = Number(localStorage.getItem('sof_appUseCount'));
      lsCount += 1;

      localStorage.setItem('sof_appUseCount', lsCount);
      localStorage.setItem('sof_appUseDate', today);
    },

    showInstallPrompt (e) {
      // Determines whether to display a snackbar which invites
      // the user to install the app.

      // Prevents Chrome 67 and earlier from automatically showing the prompt.
      e.preventDefault();

      // Stores the event (custom evt payload) so it can be triggered later.
      this.installPromptEvent = e.detail;

      // Only display the install app snackbar on first ever app load,
      // and upon the fifth use of the app. Only one app 'use' is counted per
      // day to prevent counting of page reloads. If the user dismisses the
      // snackbar both times, the only other way to install the app is via the
      // Home view's vertical dots menu entry (which, if the app is not yet
      // installed, is always available). Alternatively, on mobile, the user
      // can install the app via the browser's own 'A2HS' menu (Chrome only).

      const today = format(new Date(), 'yyyy-MM-dd');
      let lsCount = 0;
      let lsDate = '';

      if (!localStorage.getItem('sof_appUseCount')) {
        // First ever app load.
        localStorage.setItem('sof_appUseCount', lsCount);
        localStorage.setItem('sof_appUseDate', lsDate);
      } else {
        lsCount = Number(localStorage.getItem('sof_appUseCount'));
        lsDate = localStorage.getItem('sof_appUseDate');
      }

      if (today > lsDate) { lsCount += 1; }

      if ((lsCount === 1 || lsCount === 5) && today > lsDate) {
        // Notifies the user they may add the app to their home screen (A2HS).
        // Only displays the A2HS snackbar if no other snackbar is
        // currently being displayed.
        if (this.snackWithButtons === false) {
          this.snackBtnText = 'Install';
          this.snackWithBtnText = 'Install this app?';
          this.snackWithButtons = true;
        }
      }
    },

    showRefreshUI (e) {
      // Displays a snackbar inviting the user to refresh/reload the app due
      // to an app update being available.
      // The new service worker is installed, but not yet active.

      // Stores the registration object so it can be used later.
      this.registration = e.detail;

      // Ensures no other snackbar is being displayed.
      this.snackWithButtons = false;

      this.snackBtnText = 'Refresh';
      this.snackWithBtnText = 'New version available!';
      this.snackWithButtons = true;
    },

    snackBtnHandler () {
      // Hides the snackbar that shows our new app version or A2HS invite.
      this.snackWithButtons = false;

      // Handles a user tap on the snackbar's text button.
      if (this.snackBtnText === 'Refresh') {
        // Protects against missing registration.waiting
        if (!this.registration.waiting) { return; }

        this.registration.waiting.postMessage('skipWaiting');
      } else if (this.snackBtnText === 'Install') {
        // Shows the A2HS prompt.
        this.installPromptEvent.prompt();

        // Waits for the user to respond to the prompt.
        this.installPromptEvent.userChoice
          .then((choice) => {
            if (choice.outcome === 'accepted') {
              console.log('User accepted the A2HS prompt');

              // The listener is no longer needed if the user installs the app.
              window.removeEventListener(
                'beforeinstallprompt', this.showInstallPrompt,
              );

              this.installPromptEvent = null;

              // Once the app is installed, these are no longer needed.
              localStorage.removeItem('sof_appUseCount');
              localStorage.removeItem('sof_appUseDate');
            } else {
              console.log('User dismissed the A2HS prompt');

              this.installWasDeclined();
            }
          });
      }
    },
  },
};
</script>

<style>
/**
 * By default, vuetify turns on the html scrollbar; this turns it off. I use
 * !important below due to an observed css bundling order cascade issue. The
 * ruleset doesn't seem to work without it for vuetify v2.0 builds.
 *
 * Prevents pull-to-refresh and overscroll glow on Chrome Android.
 * Not yet supported on iOS to prevent rubberbanding (bounce) effect.
 */
html {
  overflow-y: auto !important;
  overscroll-behavior-y: none;
}

/**
 * Prevents text-selectable cursor from appearing when
 * mousing over various app text yet ensures text-type
 * inputs are available for user input on Safari and iOS.
 */
*:not(input):not(textarea),
*:focus:not(input):not(textarea) {
  -webkit-touch-callout: none;
  user-select: none;
}

/* Hide html5 number input spinner buttons in Chrome and Firefox. */
input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Use sentence case for contained buttons as allowed by md2 spec. */
/* .v-btn--contained {
  text-transform: none;
} */

/**
 * Ensures text field prefix/suffix text only displays when the input
 * is-dirty or is-focused. This more closely matches the md2 spec.
 *
 * TODO: Remove this ruleset if vuetify incorporates it.
 */
.v-text-field__prefix,
.v-text-field__suffix {
  opacity: 0;
}

.v-input--is-dirty .v-text-field__prefix,
.v-input--is-focused .v-text-field__prefix,
.v-input--is-dirty .v-text-field__suffix,
.v-input--is-focused .v-text-field__suffix {
  opacity: 1;
}

/**
 * Fixes md2 spec spacing in vuetify. Only text buttons in v-card-actions
 * sections should have L/R padding of 8px. Anything with a hard edge needs
 * L/R padding of 16px.
 */
.v-card__actions .v-btn.v-btn--contained,
.v-card__actions .v-btn.v-btn--depressed {
  padding: 0 16px;
}

/**
 * Fixes vuetify bug where z-index doesn't get applied to .v-toolbar in
 * some cases, such as when used in fullscreen dialogs. Needed with
 * Help component, in particular, when used with scrolling expansion panel.
 */
.v-toolbar:not(.v-toolbar--flat) {
  z-index: 5;
}

/* Matches normal text color to newer md2 spec. */
.theme--light.v-card > .v-card__text {
  color: #00000099;
}

/* clustered-cloud custom typography style */
.subtitle-3 {
  font-size: 1.125rem !important;
  font-weight: 500;
  line-height: 1.75rem;
}

/* clustered-cloud custom page section style */
.page-section {
  padding-top: 48px;
  padding-bottom: 48px;
}

@media only screen and (min-width: 960px) {
  .page-section {
    padding-top: 72px;
    padding-bottom: 72px;
  }
}

/* clustered-cloud custom container style */

@media (min-width: 960px) {
  .container {
    max-width: 900px;
  }
}

@media (min-width: 1264px) {
  .container {
    max-width: 1185px;
  }
}

@media (min-width: 1904px) {
  .container:not(.container--fluid) {
    max-width: 1264px !important;
  }
}
</style>

<style scoped>

</style>
