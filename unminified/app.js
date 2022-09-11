(async () => {

navigator.serviceWorker &&
navigator.serviceWorker.register('sw.js').then(r => r.addEventListener(
    'updatefound',
    () => mdui.snackbar('检测到更新，刷新以应用更改', {
        buttonText: '刷新',
        onButtonClick: () => location.reload(),
    }),
));

let isTinyAndPretty = false;
document.addEventListener('WeixinJSBridgeReady', () => isTinyAndPretty = true);

/**
 * @param {String} src
 * @returns {Promise<HTMLImageElement>}
 */
const src2image = src => new Promise((resolve, reject) => {
    const img = new Image;
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
});

/**
 * @param {File} file
 * @returns {Promise<HTMLImageElement>}
 */
const file2image = file => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onload = e => src2image(URL.createObjectURL(new Blob([e.target.result]))).then(resolve).catch(reject);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
});

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<HTMLImageElement>}
 */
const canvas2image = canvas => new Promise((resolve, reject) => {
    const img = new Image;
    let blobUrl;
    img.onload = () => {
        resolve(img);
        URL.revokeObjectURL(blobUrl);
    };
    img.onerror = reject;
    canvas.toBlob(blob => img.src = blobUrl = URL.createObjectURL(blob));
});

const rotateCanvas = document.createElement('canvas');
const rotateCanvasCtx = rotateCanvas.getContext('2d');
/**
 * @param {HTMLImageElement} img
 * @param {Number} angle
 * @returns {Promise<HTMLImageElement>}
 */
const rotateImage = (img, angle) => {
    rotateCanvas.width = img.width * Math.abs(Math.cos(angle)) + img.height * Math.abs(Math.sin(angle));
    rotateCanvas.height = img.width * Math.abs(Math.sin(angle)) + img.height * Math.abs(Math.cos(angle));
    rotateCanvasCtx.clearRect(0, 0, rotateCanvas.width, rotateCanvas.height);
    rotateCanvasCtx.save();
    rotateCanvasCtx.translate(rotateCanvas.width / 2, rotateCanvas.height / 2);
    rotateCanvasCtx.rotate(angle);
    rotateCanvasCtx.drawImage(img, -img.width / 2, -img.height / 2);
    rotateCanvasCtx.restore();
    return canvas2image(rotateCanvas);
};

const textCanvas = document.createElement('canvas');
const textCanvasCtx = textCanvas.getContext('2d');
/**
 * @param {String} text
 * @param {String} font
 * @param {Number} size
 * @param {String} color
 * @param {Number} shadowSize
 * @param {String} shadowColor
 * @param {Boolean} center
 * @param {Boolean} stroke
 * @param {String} fontAttributes
 * @returns {Promise<HTMLImageElement>}
 */
const generateTextImage = (text, font, size, color, shadowSize, shadowColor, center = false, stroke = false, fontAttributes = '') => {
    textCanvasCtx.font = `${fontAttributes} ${size}pt "${font}"`;
    const lines = text.split('\n');
    const lineWidths = lines.map(e => textCanvasCtx.measureText(e).width);
    textCanvas.width = Math.max(...lineWidths) + shadowSize * 1.5;
    textCanvas.height = (lines.length + .25) * size * 1.5 + shadowSize * 1.5;
    textCanvasCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    textCanvasCtx.font = `${fontAttributes} ${size}pt "${font}"`;
    textCanvasCtx.fillStyle = color;
    textCanvasCtx.strokeStyle = color;
    textCanvasCtx.shadowColor = shadowColor;
    textCanvasCtx.shadowBlur = shadowSize;
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < (shadowSize ? (stroke ? 4 : 2) : 1); j++) {
            (stroke ? textCanvasCtx.strokeText : textCanvasCtx.fillText).call(
                textCanvasCtx,
                lines[i], center ? (textCanvas.width - lineWidths[i]) / 2 : shadowSize * .75, (i + 1) * size * 1.5 + shadowSize * .75,
            );
        }
    }
    return canvas2image(textCanvas);
};

/** @type {HTMLCanvasElement} */
const watermarkCanvas = document.getElementById('wm-canvas');
const watermarkCanvasCtx = watermarkCanvas.getContext('2d');
/**
 * @param {HTMLImageElement} background
 * @param {HTMLImageElement} watermark
 * @param {Number} opacity
 * @param {Number} angle
 * @param {Number} offsetX
 * @param {Number} offsetY
 * @param {Number} paddingX
 * @param {Number} paddingY
 * @param {Number} scale
 * @returns {Promise<HTMLImageElement>}
 */
const addWatermark = async (background, watermark, opacity, angle, offsetX, offsetY, paddingX, paddingY, scale) => {
    watermarkCanvas.width = background.width;
    watermarkCanvas.height = background.height;
    watermarkCanvasCtx.drawImage(background, 0, 0);
    watermarkCanvasCtx.globalAlpha = opacity;
    if (angle) {
        watermark = await rotateImage(watermark, angle);
    }
    for (let x = watermark.width * offsetX; x < watermarkCanvas.width; x += watermark.width * (scale + paddingX)) {
        for (let y = watermark.height * offsetY; y < watermarkCanvas.height; y += watermark.height * (scale + paddingY)) {
            watermarkCanvasCtx.drawImage(watermark, x, y, watermark.width * scale, watermark.height * scale);
        }
    }
};

PetiteVue.createApp({
    mode: 'text',
    bgImage: await src2image('sample.avif').catch(() => src2image('sample.webp')),
    wmImage: await src2image('watermark.webp'),
    wmText: '仅用于演示水印功能\n其他用途无效\n' + (() => {
        const d = new Date;
        const ps20 = e => `${e}`.padStart(2, 0);
        return `${d.getFullYear()}-${ps20(d.getMonth() + 1)}-${ps20(d.getDate())} ${ps20(d.getHours())}:${ps20(d.getMinutes())}:${ps20(d.getSeconds())}`;
    })(),
    wmTextColor: '#ffffff',
    wmTextShadowColor: '#000000',
    fontSize: 24,
    fontWeight: 500,
    useStroke: false,
    useItalic: false,
    useShadow: false,
    useCenter: true,
    opacity: 75,
    angle: 30,
    scale: 100,
    offsetX: Math.round(Math.random() * 100),
    offsetY: Math.round(Math.random() * 100),
    paddingX: 0,
    paddingY: 0,
    saveFormat: 'image/jpeg|.jpg',
    saveQuality: 80,

    bgFileElement: document.getElementById('bg-file'),
    wmFileElement: document.getElementById('wm-file'),
    wmTextColorElement: document.getElementById('wm-textcolor'),
    wmTextShadowColorElement: document.getElementById('wm-textshadowcolor'),

    mounted() {
        mdui.updateSliders();
        this.render();
    },

    wmTextChange() {
        mdui.prompt(
            '',
            '水印文字',
            e => {
                this.wmText = e;
                if (this.mode === 'text') this.render();
            },
            () => {},
            {
                type: 'textarea',
                defaultValue: this.wmText,
            },
        );
    },
    async bgFileChange(e) {
        this.bgImage = await file2image(e.target.files[0]);
        this.render();
    },
    async wmFileChange(e) {
        this.wmImage = await file2image(e.target.files[0]);
        if (this.mode === 'image') this.render();
    },
    async render() {
        addWatermark(
            this.bgImage,
            this.mode === 'text'
                ? await generateTextImage(
                    this.wmText,
                    'sans-serif',
                    this.fontSize,
                    this.wmTextColor,
                    this.useShadow && (this.fontSize / 1.5),
                    this.wmTextShadowColor,
                    this.useCenter,
                    this.useStroke,
                    [
                        this.useItalic ? 'italic' : '',
                        this.fontWeight,
                    ].join(' '),
                )
                : this.wmImage,
            this.opacity / 100,
            this.angle * Math.PI / 180,
            -this.offsetX / 100, -this.offsetY / 100,
            this.paddingX / 100, this.paddingY / 100,
            this.scale / 100,
        );
    },
    saveResult() {
        const [format, extension] = this.saveFormat.split('|');
        if (isTinyAndPretty) {
            const s = watermarkCanvas.toDataURL(format, this.saveQuality / 100);
            src2image(s).then(() => mdui.alert(`<img src="${s}" class="mdui-center mdui-img-fluid mdui-img-rounded"><div class="mdui-typo-caption-opacity mdui-m-t-2 mdui-text-center">请长按图片进行另存为操作</div>`, '保存图片'));
        } else {
            watermarkCanvas.toBlob(
                blob => {
                    const s = URL.createObjectURL(blob);
                    const e = document.createElement('a');
                    e.href = s;
                    e.download = Array(16).fill().map(() => '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 62)]).join('') + extension;
                    document.body.appendChild(e);
                    e.click();
                    document.body.removeChild(e);
                    URL.revokeObjectURL(s);
                },
                format, this.saveQuality / 100,
            );
        }
    },
}).mount();

})()