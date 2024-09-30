import initGlobe from './src/globe';
import { getUrlParams } from "./src/utils";

let params = {};

if (window.document.currentScript) {
    const scriptUrl = window.document.currentScript.src;

    params = getUrlParams(scriptUrl);
}

const root = document.getElementById(params.container || 'root-globe');

if (root) {
    console.log(params);
    try {
        initGlobe(root, {
            template: params.template || "globe-label-template",
            datapoints: params.datapoints || "globe-data-json",
            zoom: parseInt(params.zoom),
            rotation: parseInt(params.rotation)
        });
    } catch (error) {
        console.log("[GLOBE]: ", error);
    }
}