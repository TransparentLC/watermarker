import { reactive } from 'vue';

const canvas = document.createElement('canvas');
canvas.classList.add('d-block', 'mx-auto', 'elevation-3', 'rounded', 'chessboard-background');
canvas.style.maxWidth = '100%';
canvas.style.maxHeight = 'max(160px,33.3333vh)';

export const watermarkCanvas = canvas.cloneNode(true) as HTMLCanvasElement;
export const imageCanvas = canvas.cloneNode(true) as HTMLCanvasElement;
// biome-ignore lint/style/noNonNullAssertion: reason
export const watermarkCtx = watermarkCanvas.getContext('2d')!;
// biome-ignore lint/style/noNonNullAssertion: reason
export const imageCtx = imageCanvas.getContext('2d')!;
export const watermarkCanvasSize = reactive({
    width: watermarkCanvas.width,
    height: watermarkCanvas.height,
});
export const imageCanvasSize = reactive({
    width: imageCanvas.width,
    height: imageCanvas.height,
});

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
            const attributeName = mutation.attributeName as 'width' | 'height';
            if (mutation.target === watermarkCanvas) {
                watermarkCanvasSize[attributeName] = watermarkCanvas[attributeName];
            } else if (mutation.target === imageCanvas) {
                imageCanvasSize[attributeName] = imageCanvas[attributeName];
            }
        }
    });
});

observer.observe(watermarkCanvas, {
    attributes: true,
    attributeFilter: ['width', 'height'],
});
observer.observe(imageCanvas, {
    attributes: true,
    attributeFilter: ['width', 'height'],
});

export const src2image = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
