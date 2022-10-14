import {createRouter, createWebHistory} from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import ItemsPage from '../views/ItemsPage.vue';
import UploadItemPage from "../views/UploadItemPage.vue";
import UserReviewsPage from "../views/UserReviewsPage.vue";


const routes = [
  { path: "/", component: HomePage },
  { path: "/home", component: HomePage },
  { path: "/items", component: ItemsPage },
  { path: "/profile", component: ProfilePage },
  { path: "/upload-item", component: UploadItemPage},
  { path: "/user-reviews", component: UserReviewsPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;