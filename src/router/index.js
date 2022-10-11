import {createRouter, createWebHistory} from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import ItemsPage from '../views/ItemsPage.vue';

const routes = [{path: '/home', component: HomePage}, {path: '/profile', component: ProfilePage}, {path: '/items', component: ItemsPage}];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;