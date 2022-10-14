import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import ItemsPage from "../views/ItemsPage.vue";
import SingleItemPage from "../views/SingleItemPage.vue";

const routes = [
  { path: "/home", name: "home", component: HomePage },
  { path: "/", component: HomePage },
  { path: "/profile", name: "profile", component: ProfilePage },
  { path: "/items", name: "itemsList", component: ItemsPage },
  { path: "/item_page/:id", name: "singleItem", component: SingleItemPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
