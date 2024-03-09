import md5 from "md5";
import { corsJson } from "@/utils";

let cachedLeagueVersion;


async function fetchLeagueResource(resource) {
    const version = await getLeagueVersion();
    return await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/${resource}`);
}


export async function getLeagueVersion() {
    if (cachedLeagueVersion != undefined) return cachedLeagueVersion;
    const version = (await corsJson("https://ddragon.leagueoflegends.com/api/versions.json"))[0];
    cachedLeagueVersion = version;
    return version;
}


export async function getChampionNames() {
    const response = await fetchLeagueResource("champion.json");
    const data = await response.json();
    const names = {};
    for (const id of Object.keys(data.data)) names[id] = data.data[id].name;
    return names;
}


export async function getChampion(championId, championName) {
    const response = await fetchLeagueResource(`champion/${championId}.json`);
    const data = (await response.json()).data[championId];
    for (let i=0; i<data.skins.length; i++) {
        const skin = data.skins[i];
        const skinName = skin.name.replace(championName, "").replace("default", "Original").replace("/", "").replace(":", "").replace(/\s/g, ""); // '/' is for KD/A skin
        const fileName = `${championName.replace(" ", "_")}_${skinName}Skin_HD.jpg`;
        const hash = md5(fileName);

        data.skins[i] = {
            num: skin.num,
            name: skin.name.replace("default", `Original ${championName}`),
            lowResUrl: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_${skin.num}.jpg`,
            highResUrl: `https://static.wikia.nocookie.net/leagueoflegends/images/${hash[0]}/${hash.substring(0, 2)}/${fileName}/revision/latest`
        }
    }
    const {id, name, title, lore, skins } = data;
    return {id, name, title, lore, skins, imgUrl: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_0.jpg`}
}
