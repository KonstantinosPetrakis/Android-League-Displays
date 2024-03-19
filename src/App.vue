<script setup>
import { RouterView } from "vue-router";
import NavBar from './components/NavBar.vue';
import Footer from './components/AppFooter.vue';

</script>

<style scoped>
    #main-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: rgb(9,20,40);
        background: linear-gradient(45deg, rgba(9,20,40,1) 0%, rgba(0,0,0,1) 100%);
    }
    main {
        padding: 1.5rem;
        overflow-y: auto;
        margin-bottom: auto;
    }
    h3 {
        margin: 0;
    }
    #progress-bar-wrapper {
        width: 50%;
    }

</style>

<template>
    <div id="main-container">
        <nav>
            <nav-bar> </nav-bar>
        </nav>
        <main>
            <router-view> </router-view>
        </main>
        <footer>
            <Footer> </Footer>
        </footer>
    </div>
</template>