<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({champion: { type: Object, required: true}});

</script>

<style scoped>
    .champion {
        display: flex;
        position: relative;
        flex-direction: column;
        align-items: center;
        padding: 0;
        margin: 0;
        border: 1px solid #f0e6d214;
        transition: border .6s;
    }
    .champion:hover {
        border: 1px solid #ddbb7850;
        transition: border .6s;
    }
    .champion img {
        width: 100%;
        clip-path: inset(0% 0% 25% 0%);
        margin-bottom: -46%;
        aspect-ratio: 308 / 560; /* the aspect ratio of splash arts */
        /* 
            margin-bottom is a magic number, 25% should be the right from the clip-path but that
            won't work as intended.
        */ 
    }
    a {
        text-decoration: none;
    }
    .champion-name {
        text-align: center;
        font-size: .72rem;
        letter-spacing: .11rem;
        text-transform: uppercase;
        padding: .8rem 0;
        color: #be9f60;
    }
</style>

<template>
    <router-link :to="{name: 'champion', params: {id: champion.id} }" class="champion">
        <img loading="lazy" :src="champion.imgUrl" :alt="`image of ${champion.id}`">
        <div class="champion-name"> {{ champion.name }} </div>
    </router-link>
</template>