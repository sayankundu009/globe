export function getUrlParams(url) {
    const params = {};

    try {
        const urlObj = new URL(url);

        for (const [key, value] of urlObj.searchParams.entries()) {
            params[key] = value;
        }
    } catch (error) {
        console.error("Error parsing URL:", error);
        return params;
    }

    return params;
}

export function renderTemplate(template, data) {
    const regex = /\{\{([^{}]+)\}\}/g;

    const renderedTemplate = template.replace(regex, (match, key) => {
        const keys = key.trim().split('.');

        let value = data;

        for (const k of keys) {
            value = value[k];
        }

        return value;
    });

    return renderedTemplate;
}

export function adjustCoordinates(x, y, width, height) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (x + width > viewportWidth) {
        x = viewportWidth - width;
    }

    if (y + height > viewportHeight) {
        y = viewportHeight - height;
    }

    x = Math.max(0, x);
    y = Math.max(0, y);

    return { x, y };
}

export function randomFromArray(array) {
    const randomIndex = Math.floor(Math.random() * array.length);

    return array[randomIndex];
}