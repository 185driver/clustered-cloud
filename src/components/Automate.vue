<template>
  <v-sheet
    class="page-section"
    tile
    tag="section"
  >
    <v-container>
      <v-row class="align-center justify-space-between">
        <v-col
          cols="12"
          md="5"
        >
          <v-timeline>
            <v-timeline-item
              v-intersect.once.quiet="onIntersect"
              fill-dot
              large
              class="mb-12"
              color="#ffffff"
            >
              <template #icon>
                <v-avatar
                  tile
                  size="36"
                >
                  <img :src="imgInUse">
                </v-avatar>
              </template>
              <template #opposite>
                <span class="title text--secondary">New project</span>
              </template>
              <v-card>
                <v-card-text class="body-1">
                  Select your application stack to provision the required
                  infrastructure
                </v-card-text>
              </v-card>
            </v-timeline-item>
            <v-timeline-item
              ref="step2"
              fill-dot
              large
              class="mb-12 process-step"
              color="#ffffff"
            >
              <template #icon>
                <v-icon size="36">
                  {{ icons.mdiGit }}
                </v-icon>
              </template>
              <template #opposite>
                <span class="title text--secondary">Push code</span>
              </template>
              <v-card>
                <v-card-text class="body-1">
                  Push code to the Git repository to trigger a new build
                </v-card-text>
              </v-card>
            </v-timeline-item>
            <v-timeline-item
              ref="step3"
              fill-dot
              large
              class="process-step"
              color="#ffffff"
            >
              <template #icon>
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  color="primary"
                />
                <v-icon
                  v-else
                  color="accent"
                  size="36"
                >
                  {{ icons.mdiCheck }}
                </v-icon>
              </template>
              <template #opposite>
                <span class="title text--secondary">Deploy</span>
              </template>
              <v-card>
                <v-card-text class="body-1">
                  CI/CD pipeline automatically builds new image and updates
                  containers
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <div class="text-center text-md-left">
            <h5 class="body-1 mb-4 font-weight-light">
              Automate your workflow
            </h5>
            <h3
              :class="$vuetify.breakpoint.mdAndUp
                ? 'display-1'
                : 'headline'
              "
              class="font-weight-medium mb-6"
            >
              Ship code faster and more reliably
            </h3>
            <p
              :class="$vuetify.breakpoint.mdAndUp
                ? 'title'
                : 'subtitle-3'
              "
              class="font-weight-regular mb-6"
            >
              The old way of deploying software is <strong>slow</strong>
              and <strong>brittle</strong>.
              Clustered empowers your development workflow with DevOps
              automation, built-in CI/CD and zero-downtime deployments.
            </p>
          </div>
          <ul class="simple-list">
            <li
              v-for="(item, i) in items"
              :key="i"
            >
              <v-icon class="accent--text">
                {{ icons.mdiCheckCircle }}
              </v-icon>
              <div>
                {{ item.content }}
              </div>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import { mdiCheck, mdiCheckCircle, mdiGit } from '@mdi/js';
import HTML5 from '../../public/img/svg/html5.svg';
import GOLANG from '../../public/img/svg/golang.svg';
import JAVASCRIPT from '../../public/img/svg/javascript.svg';
import LARAVEL from '../../public/img/svg/laravel.svg';
import MAGENTO from '../../public/img/svg/magento.svg';
import NODEJS from '../../public/img/svg/nodejs.svg';
import PHP from '../../public/img/svg/php.svg';
import PYTHON from '../../public/img/svg/python.svg';
import VUEJS from '../../public/img/svg/vuejs.svg';
import WORDPRESS from '../../public/img/svg/wordpress.svg';

export default {
  data () {
    return {
      icons: { mdiCheck, mdiCheckCircle, mdiGit },
      imgInUse: null,
      index: 0,
      items: [
        {
          content: `
            Create applications from pre-configured One Click templates
            or import existing code
          `,
        },
        {
          content: `
            Go from code to production in seconds with Git-push style
            deploys – rollback a bad release just as easily
          `,
        },
        {
          content: `
            Build anything from simple websites to polyglot microservices
            using a modular component architecture
          `,
        },
        {
          content: `
            Take advantage of containerization without having to deal
            with Docker builds or complex configurations
          `,
        },
        {
          content: `
            Add managed databases, search services, caching and other
            backend services with one click
          `,
        },
      ],
      loading: false,
      svgs: [
        GOLANG,
        HTML5,
        JAVASCRIPT,
        LARAVEL,
        MAGENTO,
        NODEJS,
        PHP,
        PYTHON,
        VUEJS,
        WORDPRESS,
      ],
    };
  },

  mounted () {
    this.imgInUse = this.svgs[this.index];

    setInterval(() => {
      this.index = this.index === this.svgs.length - 1 ? 0 : this.index += 1;
      this.imgInUse = this.svgs[this.index];
    }, 5000);
  },

  methods: {
    onIntersect () {
      this.loading = true;

      setTimeout(() => {
        this.$refs.step2.$el.classList.add('process-step--visible');
      }, 1000);

      setTimeout(() => {
        this.$refs.step3.$el.classList.add('process-step--visible');
      }, 2000);

      setTimeout(() => { this.loading = false; }, 5000);
    },
  },
};
</script>

<style scoped>
.simple-list {
  list-style: none;
  margin-top: 32px;
}

.simple-list li {
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
}

.simple-list li:not(:last-child) {
  padding-bottom: 16px;
}

.simple-list li > :first-child {
  -webkit-box-flex: 0;
  -ms-flex-positive: 0;
  flex-grow: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  margin-right: 24px;
}

@media only screen and (max-width: 599px) {
  .simple-list {
    padding-left: 0 !important;
  }
}

.process-step {
  opacity: 0;
  transition: opacity 0.25s ease;
}

.process-step--visible {
  opacity: 1;
}
</style>
