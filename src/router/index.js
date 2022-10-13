import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import ItemsPage from "../views/ItemsPage.vue";
import SingleItemPage from "../views/SingleItemPage.vue";

// had an item_page route but it was breaking the other routes!
const routes = [
  { path: "/home", component: HomePage },
  { path: "/", component: HomePage },
  { path: "/profile", component: ProfilePage },
  { path: "/items", component: ItemsPage },
  { path: "/item_page/:id", name: "singleItem", component: SingleItemPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
