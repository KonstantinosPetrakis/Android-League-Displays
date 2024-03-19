<script setup>
import { ref } from "vue";
import { Wallpaper } from "wallpaper";
import OffCanvas from "@/components/ui/OffCanvas.vue";
import { fetchImageAsBase64, base64AsImage, cropImage, sleep } from "@/utils";


const props = defineProps({
    skin: {type: Object, required: true},
    wallpaperType: {type: String, required: true},
    configuringWallpaper: {type: Boolean, required: true},
    cropDims: {type: Object, required: true}
});
const emit = defineEmits(["downloadStart", "downloadEnd", "downloadFailed", "configStart", "configEnd", "settingStart", "settingEnd"]);
const isFavorite = ref(_isFavorite());
const configEnded = async () => {do await sleep(50); while(props.configuringWallpaper)};


async function setWallpaper() {
    let base64;
    try {
        emit("downloadStart", props.skin);
        base64 = await fetchImageAsBase64(props.skin.highResUrl);
        emit("downloadEnd");
    }
    catch(error) { 
        emit("downloadFailed");
        emit("downloadEnd");
        return;
    }
    
    const image = await base64AsImage(base64);
 
    emit("configStart", image);
    await configEnded();

    emit("settingStart");
    await Wallpaper.setWallpaper({base64: cropImage(image, props.cropDims), type: props.wallpaperType});
    emit("settingEnd");
}

function addToFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(props.skin);
    localStorage.setItem('favorites', JSON.stringify([...favorites]));
    isFavorite.value = true;
}

function removeFromFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(fav => fav.id === props.skin.id);
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify([...favorites]));
    isFavorite.value = false;
}

function _isFavorite() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.id === props.skin.id);
}

</script>

<style>
    .skin-preview {
        display: flex;
        flex-direction: column;
        border: 1px solid #f0e6d214;
        transition: border .6s;
    }
    .skin-preview:hover {
        border: 1px solid #ddbb7850;
        transition: border .6s;
    }
    .skin-preview h4 {
        color: #b7b0a3;
        text-transform: none; 
        margin: .3rem;
        display: -webkit-box; /* Set the display property to a box layout */
        -webkit-line-clamp: 1; /* Limit the text to one line */
        -webkit-box-orient: vertical; /* Set the box orientation to vertical */
       
        text-overflow: ellipsis; /* Add the ellipsis at the end of the visible text */
    }
    .skin-preview img {
        width: 100% ;
        aspect-ratio: 1215 / 717;
    }
    .skin-preview .buttons {
        display: flex;
        background-color: #010407;
        z-index: 1;
    }
    .buttons button:first-child {
        border-right: none;
    }
    .skin-preview button {
        all: unset;
        width: 50%;
        padding: .5rem;
        text-align: center;
        text-transform: uppercase;
        font-size: .71rem;
        letter-spacing: .08rem;
        color: #5B5A56;
        border: 1px solid #313135ca;
        transition: color .3s;
    }
    .skin-preview button:hover {
        cursor: pointer;
        color: #c3beb2;
        transition: color .3s;
    }
</style>

<template>
    <div class="skin-preview">
        <off-canvas :compact="true" :exit-button="false" :exit-on-click="true">
            <h4> {{ skin.name }} </h4>
            <img loading="lazy" :src="skin.lowResUrl" :alt="`Image of ${skin.name}`">
            <template #off-canvas>
                <img loading="lazy" :src="skin.lowResUrl" :alt="`Image of ${skin.name}`">
            </template>
        </off-canvas>
        <div class="buttons">
            <button @click="setWallpaper"> Wallpaper </button>
            <button @click="removeFromFavorites" v-if="isFavorite"> Remove from favorites </button>
            <button @click="addToFavorites" v-else> Add to favorites </button>
        </div>
    </div>
</template>