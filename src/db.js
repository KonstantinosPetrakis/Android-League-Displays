import { getChampionNames, getChampion, getLeagueVersion } from "./network";

export async function checkForAndApplyUpdates() {
    const version = await getLeagueVersion();
    if (localStorage.getItem("version") == version) return;

    const promises = [];
    const championNames = await getChampionNames();
    for (const [championId, championName] of Object.entries(championNames))
        promises.push(getChampion(championId, championName));
    const champions = await Promise.all(promises);

    localStorage.setItem("champions", JSON.stringify(champions));
    localStorage.setItem("version", version);
    localStorage.setItem("champion_count", champions.length);
    localStorage.setItem("skin_count", champions.reduce((acc, champ) => acc + champ.skins.length, 0));
}


export const getChampions = () => JSON.parse(localStorage.getItem("champions"));
export const getVersion = () => localStorage.getItem("version");
export const getChampionCount = () => localStorage.getItem("champion_count");
export const getSkinCount = () => localStorage.getItem("skin_count");
