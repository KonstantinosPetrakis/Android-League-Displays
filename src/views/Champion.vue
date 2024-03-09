<script setup>
import { watch, ref } from "vue";
import { useRoute } from 'vue-router';
import Croppr from "croppr";
import "croppr/dist/croppr.min.css"
import SkinPreview from '@/components/SkinPreview.vue';
import OffCanvas from "@/components/ui/OffCanvas.vue";
import Spinner from "@/components/ui/Spinner.vue";
import { getEstimatedScreenDims } from "@/utils";
import { getChampions } from "@/db";


const route = useRoute();
const champion = ref(getChampions().find(champ => champ.id == route.params.id));

const wallpaperType = ref("both");
const downloadingWallpaper = ref(false);
const downloadFailed = ref(false);
const configuringWallpaper = ref(false);
const settingWallpaper = ref(false);
const lastEventSkin = ref();
const imageCrop = ref(null);
const cropDims = ref({});
let cropper;


const onDownloadStart = (skin) => {
    lastEventSkin.value = skin;
    downloadingWallpaper.value = true;
}

const onConfigStart = (image) => {
    configuringWallpaper.value = true;
    
    const screenDims = getEstimatedScreenDims();
    const screenScale = image.height / screenDims.height;
    const scaledScreenDims = {
        width: Math.ceil(screenDims.width * screenScale),
        height: Math.ceil(screenDims.height * screenScale)
    }

    imageCrop.value.setAttribute("src", image.src);
    cropper = new Croppr(imageCrop.value, {
        maxSize: [scaledScreenDims.width, scaledScreenDims.height, "px"],
        minSize: [scaledScreenDims.width, scaledScreenDims.height, "px"]
    });
}

watch(configuringWallpaper, () => cropDims.value = cropper.getValue());

</script>

<style scoped>
    fieldset {
        border: 1px solid #715a32ba;
        max-width: 1500px;
        margin: 0 auto;
    }
    legend {
        text-align: center;
    }
    h2 {
        font-size: 2.5rem;
        padding: 0 2rem;
    }
    h3 {
        margin-top: -2rem;
    }
    p {
        padding: 0 2rem;
        font-size: 1.05rem;
        line-height: 1.3;
        text-align: center;
    }
    #skins {
        display: grid;
        grid-template-columns: repeat(auto-fill, min(25rem, 100%));  
        align-content: center;
        justify-content: center;
        gap: 1.5rem;
        margin: 2rem auto;
    }
</style>

<template>
    <fieldset role="region">
        <legend>
            <h2> {{ champion.name }} </h2>
        </legend>
        <h3> {{ champion.title }} </h3>
        <p> {{ champion.lore }} </p>
        <div id="skins">
            <skin-preview v-for="skin of champion.skins"
                :key="skin.id" :skin="skin"
                :wallpaper-type="wallpaperType"
                :configuring-wallpaper="configuringWallpaper"
                :crop-dims="cropDims"
                @download-start="onDownloadStart"
                @download-end="downloadingWallpaper = false"
                @config-start="onConfigStart"
                @setting-start="settingWallpaper = true"
                @setting-end="settingWallpaper = false"
                @download-failed="downloadFailed = true"
            />
        </div>
    </fieldset>

    <off-canvas :active="downloadingWallpaper" :compact="true" :exit-button="false" :exit-on-click="false">
            <template #off-canvas>
                <h3> Work in progress </h3>
                {{ lastEventSkin?.name }} is being downloaded... Please wait.
                <spinner/>
            </template>
        </off-canvas>
        <off-canvas v-model:active="configuringWallpaper" :exit-on-click="false">
            <template #off-canvas>
                <h4> Wallpaper Type </h4>
                <div>
                    <label> 
                        Both
                        <input type="radio" value="both" v-model="wallpaperType">
                    </label>
                </div>
                <div>
                    <label> 
                        Home
                        <input type="radio" value="home" v-model="wallpaperType">
                    </label>
                </div>
                <div>
                    <label> 
                        Lock
                        <input type="radio" value="lock" v-model="wallpaperType">
                    </label>
                </div>

                <h4> Area of interest </h4>
                <div id="image-crop-wrapper">
                    <img ref="imageCrop" id="imageCrop">
                </div>
            </template>
        </off-canvas>
        <off-canvas v-model:active="settingWallpaper" :compact="true" :exit-button="false" :exit-on-click="false">
            <template #off-canvas>
                <h3> Setting Wallpaper </h3>
                <p>
                    {{ lastEventSkin?.name }} is being set as wallpaper... Please wait.
                </p>
                <spinner/>
            </template>
        </off-canvas>
        <off-canvas v-model:active="downloadFailed" :compact="true" :exit-on-click="false" exit-button-text="Sad, but ok">
            <template #off-canvas>
                <h3> Failed to find and set wallpaper </h3>
                <p>
                    The {{ lastEventSkin?.name }} is unavailable on LOL Wiki. 
                    <br>
                    It might be added in the future, but for now, you can try another skin.
                </p>
            </template>
        </off-canvas>
</template>