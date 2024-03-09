import { CapacitorHttp } from "@capacitor/core";


export async function sleep(ms) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
}


export async function corsJson(url) {
    const response = await CapacitorHttp.get({url, responseType: "json"});
    return response.data;
}


export async function fetchImageAsBase64(url) {
    const response = await CapacitorHttp.get({url, responseType: "blob"});

    try {
        window.atob(response.data); // throws error if no base64
        return response.data;
    }
    catch (error) { throw new Error("Image not found.") }

}


export async function base64AsImage(base64) {
    const image = new Image();
    image.setAttribute("src", `data:image/jpg;base64,${base64}`);
    return new Promise((resolve, reject) => image.onload = () => resolve(image));
} 


export function cropImage(image, crop) {
    const canvas = document.createElement("canvas");
    canvas.width = crop.width;
    canvas.height = crop.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
    return canvas.toDataURL("image/jpeg").split(';base64,')[1];   
}


export function setScreenDims(screenDims) {
    localStorage.setItem("screenDims", JSON.stringify(screenDims));
}

export function getEstimatedScreenDims() {
    if (!localStorage.getItem("screenDims")) 
        setScreenDims({
            width: Math.floor(window.screen.width * window.devicePixelRatio),
            height: Math.floor(window.screen.height * window.devicePixelRatio)
        });
    
    return JSON.parse(localStorage.getItem("screenDims"));
}
