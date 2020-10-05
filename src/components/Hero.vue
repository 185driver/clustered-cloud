<template>
  <v-sheet
    class="hero"
    tile
    tag="section"
  >
    <v-container>
      <v-row class="align-center justify-space-between">
        <v-col cols="12">
          <v-banner
            :tile="false"
            dark
            single-line
            color="secondary"
            elevation="5"
            style="display: none;"
          >
            <v-avatar
              slot="icon"
              size="40"
            >
              <v-img :src="require('../../public/img/svg/producthunt.svg')" />
            </v-avatar>
            Thank you for supporting us on Product Hunt!
            Sign up to claim your special deal 😊
            <template #actions>
              <v-btn
                outlined
                to="/signup/trial"
              >
                Sign up
              </v-btn>
            </template>
          </v-banner>
        </v-col>
        <v-col
          class="text-center text-md-left"
          cols="12"
          md="6"
        >
          <h1
            :class="$vuetify.breakpoint.lgAndUp
              ? 'display-3 pr-0'
              : $vuetify.breakpoint.smAndUp
                ? 'display-2'
                : 'display-1'
            "
            class="font-weight-bold mb-6"
          >
            Write
            <span class="primary--text">code</span>, forget about the rest
          </h1>
          <p
            :class="$vuetify.breakpoint.mdAndUp
              ? 'title'
              : 'subtitle-3'
            "
            class="font-weight-regular mb-6"
          >
            Deploy and scale modern apps and microservices without
            the complexities of DevOps and infrastructure management.
          </p>
          <v-row class="align-center justify-center justify-md-start">
            <v-col
              cols="12"
              sm="auto"
            >
              <v-btn
                :block="$vuetify.breakpoint.xs"
                x-large
                to="/signup/trial"
                class="nudge-icon"
                color="primary"
              >
                Try for free
                <v-icon right>
                  {{ icons.mdiArrowRight }}
                </v-icon>
              </v-btn>
            </v-col>
            <v-col
              cols="12"
              sm="auto"
            >
              <div>
                <v-btn
                  :block="$vuetify.breakpoint.xs"
                  depressed
                  outlined
                  text
                  x-large
                  class="white-bg"
                  color="primary"
                >
                  Request a demo
                </v-btn>
                <v-overlay
                  :value="overlay"
                  dark
                  opacity="0"
                  style="transition: none 0s ease 0s;"
                  z-index="5"
                />
              </div>
            </v-col>
            <v-col cols="12">
              <div class="body-1 text--secondary">
                Free 14-day trial. No credit card required.
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          class="offset-md-1"
          cols="12"
          md="5"
        >
          <v-card class="box-shadow">
            <v-img :src="require('../../public/img/wistia.png')" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import { mdiArrowRight } from '@mdi/js';

export default {
  data () {
    return {
      icons: { mdiArrowRight },
      overlay: false,
    };
  },
};
</script>

<style scoped>
.hero {
  padding: 16px 0 48px;
  background: linear-gradient(90deg,#ffffff 20px,#00000000 1%) 50%,
    linear-gradient(#ffffff 20px, #00000000 1%) 50%, #e8e8e8;
  background-size: 22px 22px;
}

@media only screen and (min-width: 960px) {
  .hero {
    padding: 72px 0;
  }
}

.nudge-icon:hover .v-icon {
  transform: translateX(4px);
}

.white-bg {
  background-color: #ffffff;
}

.box-shadow {
  box-shadow: 0 10px 30px 0 rgba(0,0,0,0.12);
}
</style>
