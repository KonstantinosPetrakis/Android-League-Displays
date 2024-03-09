<script setup>
import { watch, reactive } from "vue";
import OffCanvas from "./ui/OffCanvas.vue";
import SettingIcon from "./svgs/SettingIcon.vue";
import { getChampionCount, getSkinCount, getVersion } from "@/db";
import { getEstimatedScreenDims, setScreenDims } from "@/utils";

const screenDims = reactive(getEstimatedScreenDims());
 
watch(screenDims, (oldDims, newDims) => setScreenDims(newDims));
</script>

<style scoped>
table {
    text-align: left;
    border: 1px solid;
    border-collapse: collapse;
}
th, td {
    border: 1px solid;
    padding: .5rem;
}
h4 {
    margin: 1rem 0 0 0;
}
#cache-manager {
    margin: 0;
    padding: 0;
}
#cache-manager button {
    padding: .25rem;
    margin: 0 .25rem;
}
</style>

<template>
    <off-canvas>
        <setting-icon> </setting-icon>
        <template #off-canvas>
            <h2> Settings </h2>
            <table>
                <tr> 
                    <th> LOL Version </th>
                    <td> {{  getVersion() }} </td>
                </tr>
                <tr>
                    <th> Champions count </th>
                    <td> {{ getChampionCount() }} </td>
                </tr>
                <tr>
                    <th> Skins count </th>
                    <td> {{ getSkinCount() }} </td>
                </tr>
                <tr>
                    <th> Screen width </th>
                    <td>
                        <input type="number" v-model="screenDims.width">
                    </td>
                </tr>
                <tr>
                    <th> Screen height </th>
                    <td>
                        <input type="number" v-model="screenDims.height">
                    </td>
                </tr>
            </table>
        </template>
    </off-canvas>
</template>