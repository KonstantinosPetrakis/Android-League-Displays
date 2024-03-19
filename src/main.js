import { App as CapacitorApp } from '@capacitor/app';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import Champions from "./views/Champions.vue";
import Favorites from './views/Favorites.vue';
import Information from "./views/Information.vue";
import Champion from "./views/Champion.vue";
import App from './App.vue';
import { checkForAndApplyUpdates } from "./db";


const router = createRouter({
    history: createWebHashHistory(),
    routes: [   
        { path: '/', component: Champions, name: "index"},
        { path: '/favorites', component: Favorites, name: "favorites"},
        { path: '/information', component: Information, name: "information"},
        { path: '/champion/:id', component: Champion, name: "champion"},
    ],
    scrollBehavior () { document.querySelector("#app main").scrollTo(0, 0) }
});

checkForAndApplyUpdates().then(() => createApp(App).use(router).mount('#app'));


CapacitorApp.addListener('backButton', ({canGoBack}) => {
    if(!canGoBack) CapacitorApp.exitApp()
    else window.history.back();
});
