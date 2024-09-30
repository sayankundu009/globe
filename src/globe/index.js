import Globe from 'globe.gl';
import { adjustCoordinates, randomFromArray, renderTemplate } from '../utils';

let GLOBE = null;
let ROOT = null;
let HOVER_CARD = null;
let STATE = {
    mouseX: 0,
    mouseY: 0,
};

let camera = null;
let renderer = null;

// Arc
function onArcHoverStart(arc) {
    HOVER_CARD.show(STATE.mouseX, STATE.mouseY, { data: arc.data.data });

    GLOBE.controls().autoRotate = false;

    document.body.style.cursor = 'pointer';
}

function onArcHoverLeave() {
    HOVER_CARD.hide();

    GLOBE.controls().autoRotate = true;

    document.body.style.cursor = 'auto';
}

function onArcHover(arc) {
    if (!arc) {
        onArcHoverLeave();

        return;
    }

    onArcHoverStart(arc);
}

// Template
function createHoverCard(container, labelTemplateId = null) {
    const element = document.createElement('div');

    let template = ``;

    if (labelTemplateId) {
        const templateElement = document.getElementById(labelTemplateId);

        template = templateElement.innerHTML;
    }

    function renderLabelTemplate(data = {}) {
        const renderedTemplate = renderTemplate(template, { data });

        element.innerHTML = renderedTemplate;
    }

    element.style.cssText = `
      visibility: hidden;
      position: fixed;
      width: max-content;
      height: max-content;
      transition:  opacity 0.4s;
    `;

    container.appendChild(element);

    return {
        show(positionX, positionY, options) {
            const { data } = options;

            renderLabelTemplate(data);

            const rect = element.getBoundingClientRect();

            const { x, y } = adjustCoordinates(positionX, positionY + 25, rect.width, rect.height);

            element.style.top = `${y}px`;
            element.style.left = `${x}px`;
            element.style.visibility = "visible";
            element.style.opacity = "1";
        },
        hide() {
            element.style.visibility = "hidden";
            element.style.opacity = "0";
        }
    }
}

// Renderer
function resizeRenderer(container) {
    const width = container.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || window.innerHeight;

    GLOBE.width(width);
    GLOBE.height(height);
}

function initResizeListener(container, camera, renderer) {
    window.addEventListener('resize', () => {
        resizeRenderer(container, camera, renderer);
    }, false);
}

export default function initGlobe(root, options) {
    const { template, datapoints: datapointsId, zoom, rotation } = options;

    let datapoints = [];

    if (datapointsId) {
        const templateElement = document.getElementById(datapointsId);

        const json = JSON.parse(templateElement.innerHTML);

        datapoints = json;
    }

    const arcsData = datapoints.map((data) => {
        const [
            startLat,
            startLng,
            endLat,
            endLng,
        ] = data.coordinates

        return {
            startLat,
            startLng,
            endLat,
            endLng,
            color: randomFromArray(["#67e8f9", "#a1d3da"]),
            data,
        }
    });

    const ringsData = arcsData.reduce((acc, arc) => {
        const ring = {
            maxR: 5,
            propagationSpeed: 1,
            repeatPeriod: 800,
            color: "#f5f5f5"
        };

        acc.push({
            ...ring,
            lat: arc.startLat,
            lng: arc.startLng,
        });

        acc.push({
            ...ring,
            lat: arc.endLat,
            lng: arc.endLng,
        });

        return acc;
    }, []);

    const globe = Globe();

    GLOBE = globe;
    ROOT = root;

    globe(root)
        .globeImageUrl("https://cdn.jsdelivr.net/gh/sayankundu009/globe/dist/earth-texture.jpg")
        .backgroundColor("#ffffff00")
        .pointOfView({
            lat: 27,
            lng: 81,
        });

    renderer = globe.renderer();
    camera = globe.camera();

    // Arcs
    globe.arcsData(arcsData)
        .arcStroke(1)
        .arcColor('color')
        .arcDashLength(() => 1)
        .arcDashGap(() => 0.5)
        .arcDashAnimateTime(() => randomFromArray([3000, 4000, 5000]))
        .onArcHover(onArcHover)

    // Rings
    globe.ringsData(ringsData)
        .ringColor('color')
        .ringPropagationSpeed('propagationSpeed')
        .ringRepeatPeriod('repeatPeriod')

    // Configs
    globe.controls().enableZoom = false;
    globe.pointOfView({ altitude: zoom || 2 });
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = rotation || 0.2;

    // Hover card
    HOVER_CARD = createHoverCard(root, template);

    root.addEventListener('mousemove', (event) => {
        STATE.mouseX = event.clientX;
        STATE.mouseY = event.clientY;
    });

    // Resize
    initResizeListener(root, camera, renderer);

    setTimeout(() => {
        resizeRenderer(root, camera, renderer);
    }, 100);

    return globe;
}