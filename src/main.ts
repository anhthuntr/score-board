import './assets/main.css';
import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  fas,
  faPrint,
  faCircleCheck,
  faNoteSticky,
  faBars,
  faArrowRightToBracket
} from '@fortawesome/free-solid-svg-icons';
import App from './App.vue';
import router from './router';

library.add(
  ...[faCircleCheck, faPrint, faNoteSticky, faBars, faArrowRightToBracket]
);

library.add(fas);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.mount('#app');
