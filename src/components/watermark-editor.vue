<template>
    <div ref="canvas-container" class="mb-4"></div>
    <div class="text-center text-body-small my-4"><code>{{ canvasSize.width }} × {{ canvasSize.height }}</code></div>
    <v-tabs v-model="tab" color="primary" density="compact" grow>
        <v-tab value="source" class="flex-1-1-0">水印内容</v-tab>
        <v-tab value="style" class="flex-1-1-0">样式</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab" class="overflow-auto ma-n4 pa-4">
        <v-tabs-window-item value="source" class="pt-4 d-flex flex-column ga-4">
            <v-radio-group color="primary" inline v-model="watermarkConfig.mode" hide-details>
                <v-radio label="文字" value="text" class="flex-1-1-0"></v-radio>
                <v-radio label="图片" value="image" class="flex-1-1-0"></v-radio>
            </v-radio-group>
            <template v-if="watermarkConfig.mode === 'text'">
                <v-textarea
                    color="primary"
                    label="水印文字"
                    v-model="watermarkConfig.text.content"
                    variant="solo"
                    rows="4"
                    no-resize
                    clearable
                    hide-details
                    @update:model-value="() => textTemplateSelect = null"
                ></v-textarea>
                <v-select
                    color="primary"
                    label="常用文字模板"
                    v-model="textTemplateSelect"
                    :items="textTemplates.map(e => ({ title: e.replaceAll('\n', '↵'), value: e }))"
                    item-title="title"
                    item-value="value"
                    hide-details
                    @update:model-value="e => watermarkConfig.text.content = e"
                ></v-select>
                <v-number-input
                    color="primary"
                    v-model="watermarkConfig.text.size"
                    :min="1"
                    controlVariant="stacked"
                    density="compact"
                    hide-details
                >
                    <template #prepend>
                        <v-label>字号</v-label>
                    </template>
                </v-number-input>
                <v-number-input
                    color="primary"
                    v-model="watermarkConfig.text.lineHeight"
                    :min=".1"
                    :step=".1"
                    :precision="null"
                    controlVariant="stacked"
                    density="compact"
                    hide-details
                >
                    <template #prepend>
                        <v-label>行距</v-label>
                    </template>
                </v-number-input>
                <v-input hide-details>
                    <template #prepend>
                        <v-label>样式</v-label>
                    </template>
                    <v-btn-group border divided multiple class="w-100">
                        <v-btn
                            class="flex-grow-1"
                            :icon="mdiFormatBold"
                            @click="watermarkConfig.text.bold = !watermarkConfig.text.bold"
                            :color="watermarkConfig.text.bold ? 'primary' : ''"
                        ></v-btn>
                        <v-btn
                            class="flex-grow-1"
                            :icon="mdiFormatItalic"
                            @click="watermarkConfig.text.italic = !watermarkConfig.text.italic"
                            :color="watermarkConfig.text.italic ? 'primary' : ''"
                        ></v-btn>
                        <v-btn
                            class="flex-grow-1"
                            :icon="mdiFormatTextVariantOutline"
                            @click="watermarkConfig.text.outline = !watermarkConfig.text.outline"
                            :color="watermarkConfig.text.outline ? 'primary' : ''"
                        ></v-btn>
                        <v-menu :close-on-content-click="false">
                            <template #activator="{ props }">
                                <v-btn class="flex-grow-1 v-btn--icon" v-bind="props">
                                    <div class="d-flex align-center flex-column justify-center">
                                        <v-icon :icon="mdiFormatColorText" class="mb-n1"></v-icon>
                                        <v-sheet :color="watermarkConfig.text.color" width="20" height="4" tile class="border-thin"></v-sheet>
                                    </div>
                                </v-btn>
                            </template>
                            <v-color-picker v-model="watermarkConfig.text.color" mode="hex"></v-color-picker>
                        </v-menu>
                    </v-btn-group>
                </v-input>
                <v-input hide-details>
                    <template #prepend>
                        <v-label>字体</v-label>
                    </template>
                    <v-select
                        v-model="watermarkConfig.text.font"
                        :items="Object.values(fonts)"
                        item-title="name"
                        item-value="family"
                        color="primary"
                        density="compact"
                        hide-details
                    >
                        <template #menu-header>
                            <v-text-field
                                v-model="watermarkConfig.text.font"
                                color="primary"
                                placeholder="手动输入字体名称或 font-family"
                                variant="outlined"
                                clearable
                                density="compact"
                                hide-details
                                class="pa-2 border-b"
                            ></v-text-field>
                        </template>
                        <template #item="{ props, item }">
                            <v-list-item
                                v-bind="props"
                                :subtitle="item.family"
                            >
                                <template #append>
                                    <svg
                                        v-if="item.svgPreview"
                                        xmlns="http://www.w3.org/2000/svg"
                                        :width="item.svgPreview.width"
                                        :height="item.svgPreview.height"
                                        fill="currentColor"
                                    ><path :d="item.svgPreview.path"></path></svg>
                                    <span v-else :style="{ fontFamily: `${genericFontFamilies.has(item.family) ? item.family : `\x22${item.family}\x22`},Adobe NotDef` }">测试文本 ABC123</span>
                                </template>
                            </v-list-item>
                        </template>
                    </v-select>
                </v-input>
            </template>
            <template v-if="watermarkConfig.mode === 'image'">
                <v-btn color="primary" block @click="selectImage">选择图片</v-btn>
                <div class="text-center">
                    <img
                        ref="image"
                        :src="watermarkConfig.image"
                        style="max-height:100px"
                        class="align-self-center rounded chessboard-background"
                        @load="imageWidth = image?.naturalWidth!; imageHeight = image?.naturalHeight!"
                    ></img>
                    <div class="text-body-small"><code>{{ imageWidth }} × {{ imageHeight }}</code></div>
                </div>
            </template>
        </v-tabs-window-item>
        <v-tabs-window-item value="style" class="pt-4 d-flex flex-column ga-4">
            <v-slider
                color="primary"
                v-model="watermarkConfig.style.canvas.proportion"
                label="内容占比"
                :min="20"
                :max="100"
                :step="1"
                class="align-center"
                hide-details
            >
                <template #append>
                    <v-number-input
                        color="primary"
                        v-model="watermarkConfig.style.canvas.proportion"
                        :min="20"
                        suffix="%"
                        controlVariant="stacked"
                        density="compact"
                        style="width:8em"
                        hide-details
                    ></v-number-input>
                </template>
            </v-slider>
            <v-switch
                v-model="watermarkConfig.style.canvas.square"
                label="将画布填充为矩形"
                color="primary"
                hide-details
                density="compact"
                class="ml-2"
            ></v-switch>
            <v-switch
                v-model="watermarkConfig.style.background.enabled"
                label="背景图案"
                color="primary"
                hide-details
                density="compact"
                class="ml-2"
            ></v-switch>
            <v-expand-transition>
                <div
                    v-if="watermarkConfig.style.background.enabled"
                    class="w-100 ga-2 justify-center mx-auto overflow-y-auto ma-n4 pa-4"
                    style="display:grid;grid-template-columns:repeat(auto-fill,72px);max-height:calc(3 * 72px + 2 * 8px)"
                >
                    <v-tooltip
                        text="添加自定义图案（双击可以移除）"
                        location="top"
                        open-on-click
                        transition="slide-y-reverse-transition"
                    >
                        <template #activator="{ props }">
                            <v-btn
                                @click="selectPattern"
                                :icon="mdiPlus"
                                rounded
                                size="72"
                                variant="plain"
                                class="elevation-0 border border-dashed border-opacity-75"
                                v-bind="props"
                            ></v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip
                        v-for="e, i in patterns"
                        location="top"
                        open-on-click
                        transition="slide-y-reverse-transition"
                        color="surface"
                        content-class="pa-2 elevation-1"
                    >
                        <template #activator="{ props }">
                            <v-img
                                :src="e.thumbnail"
                                rounded
                                v-ripple
                                class="noise-background cursor-pointer flex-grow-0"
                                width="72"
                                height="72"
                                v-bind="props"
                                @click="watermarkConfig.style.background.pattern = e.pattern"
                                @dblclick="!e.stock && patterns.splice(i, 1)"
                            >
                                <template #placeholder>
                                    <div class="d-flex align-center justify-center fill-height">
                                        <v-progress-circular color="grey-lighten-2" indeterminate></v-progress-circular>
                                    </div>
                                </template>
                            </v-img>
                        </template>
                        <v-img
                            :src="e.thumbnail"
                            rounded
                            class="noise-background"
                            width="150"
                            height="150"
                        ></v-img>
                    </v-tooltip>
                </div>
            </v-expand-transition>
            <v-switch
                v-model="watermarkConfig.style.emboss.enabled"
                label="浮雕化"
                color="primary"
                hide-details
                density="compact"
                class="ml-2"
            ></v-switch>
            <v-expand-transition>
                <div v-if="watermarkConfig.style.emboss.enabled" class="d-flex flex-column ga-4">
                    <div class="d-flex">
                        <v-radio-group
                            v-model="watermarkConfig.style.emboss.silhouetteMode"
                            label="剪影模式"
                            color="primary"
                            hide-details
                            class="flex-1-1-0"
                        >
                            <v-radio label="Alpha 通道" value="alpha"></v-radio>
                            <v-radio label="黑底白字" value="black-white"></v-radio>
                            <v-radio label="白底黑字" value="white-black"></v-radio>
                        </v-radio-group>
                        <v-card class="flex-1-1-0 d-flex justify-center align-center">
                            <v-card-text class="text-body-small d-flex flex-column ga-4 align-center">
                                <v-img
                                    :src="embossSilhouetteDescription[watermarkConfig.style.emboss.silhouetteMode].image"
                                    width="fit-content"
                                    max-height="120"
                                    rounded
                                ></v-img>
                                {{ embossSilhouetteDescription[watermarkConfig.style.emboss.silhouetteMode].description }}
                            </v-card-text>
                        </v-card>
                    </div>
                    <v-number-input
                        color="primary"
                        v-model="watermarkConfig.style.emboss.radius"
                        :min="1"
                        suffix="px"
                        controlVariant="stacked"
                        density="compact"
                        hide-details
                    >
                        <template #prepend>
                            <v-label>半径</v-label>
                        </template>
                    </v-number-input>
                    <v-slider
                        color="primary"
                        label="角度"
                        v-model="watermarkConfig.style.emboss.angle"
                        :min="0"
                        :max="360"
                        :step="1"
                        class="align-center"
                        hide-details
                    >
                        <template #append>
                            <v-number-input
                                color="primary"
                                v-model="watermarkConfig.style.emboss.angle"
                                :min="0"
                                :max="360"
                                suffix="deg"
                                controlVariant="stacked"
                                density="compact"
                                style="width:8em"
                                hide-details
                            ></v-number-input>
                        </template>
                    </v-slider>
                    <v-switch
                        v-model="watermarkConfig.style.emboss.grayBackground"
                        label="使用灰色背景"
                        color="primary"
                        hide-details
                        density="compact"
                        class="ml-2"
                    ></v-switch>
                </div>
            </v-expand-transition>
        </v-tabs-window-item>
    </v-tabs-window>

    <teleport v-if="active" defer to="#app-bar-append">
        <v-tooltip text="保存水印">
            <template v-slot:activator="{ props }">
                <v-btn
                    v-bind="props"
                    variant="text"
                    :icon="mdiContentSave"
                    @click="saveWatermark"
                ></v-btn>
            </template>
        </v-tooltip>
    </teleport>
</template>

<script setup lang="ts">
import {
    mdiContentSave,
    mdiFormatBold,
    mdiFormatColorText,
    mdiFormatItalic,
    mdiFormatTextVariantOutline,
    mdiPlus,
} from '@mdi/js';
import selectFiles from 'select-files';
import { onMounted, reactive, ref, useTemplateRef, watch } from 'vue';
import { watermarkCanvas as canvas, watermarkCanvasSize as canvasSize, watermarkCtx as ctx } from '../canvas';
import { asyncAtATime, blobDownload, src2image } from '../common';
import webfonts from '../webfont.json';

defineProps<{ active: boolean }>();

const container = useTemplateRef('canvas-container');
onMounted(() => {
    container.value?.appendChild(canvas);
});

const tab = ref<'source' | 'style'>('source');

const textTemplates = ['仅用于实名认证\n其他用途无效', 'SAMPLE', '仅供展示', '禁止盗用', '版权所有，翻版必究'];
const textTemplateSelect = ref<string | null>(null);

const patterns = ref(
    Array(12)
        .fill(0)
        .map((_, i) => ({
            pattern: `stock-patterns/${i}.webp`,
            // vips thumbnail input.webp output.webp[Q=50,alpha_q=50,preset=icon,smart_subsample,smart_deblock,effort=6] 200
            thumbnail: `stock-patterns/${i}.thumb.webp`,
            stock: true,
        })),
);

const genericFontFamilies = new Set(['serif', 'sans-serif', 'system-ui', 'cursive', 'fantasy', 'math', 'monospace']);

const fonts: Record<
    string,
    {
        name: string;
        family: string;
        css?: string;
        svgPreview?: {
            width: number;
            height: number;
            path: string;
        };
    }
> = Object.fromEntries(
    [
        { name: '无衬线体', family: 'sans-serif' },
        { name: '衬线体', family: 'serif' },
        { name: '等宽字体', family: 'monospace' },
        // biome-ignore lint/suspicious/noExplicitAny: reason
        ...(webfonts as any[]).sort((a, b) => a.name.localeCompare(b.name)),
    ].map(e => [e.family, e]),
);
const loadedFontCSS = new Set<string>();

const embossSilhouetteDescription = {
    alpha: {
        image: 'silhouette-alpha.avif',
        description: '将不透明部分当成水印图案',
    },
    'black-white': {
        image: 'silhouette-black-white.avif',
        description: '将黑色背景的图片上的白色部分当成水印图案',
    },
    'white-black': {
        image: 'silhouette-white-black.avif',
        description: '将白色背景的图片上的黑色部分当成水印图案',
    },
};

const watermarkConfig = reactive({
    mode: 'text' as 'text' | 'image',
    text: {
        content: textTemplates[Math.floor(Math.random() * textTemplates.length)],
        size: 72,
        lineHeight: 1,
        font: 'sans-serif',
        color: '#fff',
        bold: false,
        italic: false,
        outline: false,
    },
    image: 'watermark-sample.webp',
    style: {
        canvas: {
            proportion: 100,
            square: true,
        },
        background: {
            enabled: false,
            pattern: patterns.value[0].pattern,
        },
        emboss: {
            enabled: false,
            silhouetteMode: 'alpha' as 'alpha' | 'black-white' | 'white-black',
            radius: 2,
            angle: 30,
            grayBackground: false,
        },
    },
});

const image = useTemplateRef('image');
const imageWidth = ref(0);
const imageHeight = ref(0);
const selectImage = async () => {
    const file = await selectFiles({ accept: 'image/*' }).then(files => files?.[0]);
    if (!file) return;
    URL.revokeObjectURL(watermarkConfig.image);
    watermarkConfig.image = URL.createObjectURL(file);
};
const selectPattern = async () => {
    const file = await selectFiles({ accept: 'image/*' }).then(files => files?.[0]);
    if (!file) return;
    const url = URL.createObjectURL(file);
    patterns.value.unshift({ pattern: url, thumbnail: url, stock: false });
    watermarkConfig.style.background.pattern = url;
};

const canvasPrepareSize = async (width: number, height: number) => {
    const embossPaddingWidth = watermarkConfig.style.emboss.enabled
        ? Math.abs(Math.cos((watermarkConfig.style.emboss.angle / 180) * Math.PI)) * watermarkConfig.style.emboss.radius
        : 0;
    const embossPaddingHeight = watermarkConfig.style.emboss.enabled
        ? Math.abs(Math.sin((watermarkConfig.style.emboss.angle / 180) * Math.PI)) * watermarkConfig.style.emboss.radius
        : 0;
    canvas.width = (width * 100) / watermarkConfig.style.canvas.proportion + embossPaddingWidth * 2;
    canvas.height = (height * 100) / watermarkConfig.style.canvas.proportion + embossPaddingHeight * 2;
    if (watermarkConfig.style.canvas.square) {
        canvas.width = canvas.height = Math.max(canvas.width, canvas.height);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (watermarkConfig.style.background.enabled) {
        const pattern = await src2image(watermarkConfig.style.background.pattern);
        const scale = Math.min(
            (canvas.width - embossPaddingWidth * 2) / pattern.width,
            (canvas.height - embossPaddingHeight * 2) / pattern.height,
        );
        ctx.drawImage(
            pattern,
            (canvas.width - pattern.width * scale) / 2,
            (canvas.height - pattern.height * scale) / 2,
            pattern.width * scale,
            pattern.height * scale,
        );
    }
};

const watermarkDraw = asyncAtATime(async () => {
    try {
        switch (watermarkConfig.mode) {
            case 'text': {
                // 根据字体获取文字部分大小，然后设置画布大小
                const font = `${watermarkConfig.text.italic ? 'italic' : ''} ${watermarkConfig.text.bold ? 'bold' : ''} ${watermarkConfig.text.size}px ${genericFontFamilies.has(watermarkConfig.text.font) ? watermarkConfig.text.font : `"${watermarkConfig.text.font}"`},Adobe NotDef`;
                if (
                    fonts[watermarkConfig.text.font]?.css &&
                    // biome-ignore lint/style/noNonNullAssertion: reason
                    !loadedFontCSS.has(fonts[watermarkConfig.text.font].css!)
                ) {
                    // biome-ignore lint/style/noNonNullAssertion: reason
                    const css = fonts[watermarkConfig.text.font].css!;
                    await new Promise((resolve, reject) => {
                        const el = document.createElement('link');
                        el.setAttribute('rel', 'stylesheet');
                        el.setAttribute('href', css);
                        el.onload = resolve;
                        el.onerror = reject;
                        document.head.appendChild(el);
                    });
                    loadedFontCSS.add(css);
                }
                await document.fonts.load(font, watermarkConfig.text.content);
                const lineHeightPadding = (watermarkConfig.text.lineHeight - 1) * watermarkConfig.text.size;
                ctx.font = font;
                const lines = watermarkConfig.text.content.split('\n');
                const lineCount = lines.length;
                const lineWidths: number[] = [];
                const lineHeights: number[] = [];
                const lineY: number[] = [];
                lines.forEach((line, i) => {
                    const textMetrics = ctx.measureText(line);
                    lineWidths.push(textMetrics.width);
                    lineHeights.push(
                        textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent + lineHeightPadding * 2,
                    );
                    lineY.push((i ? lineY[i - 1] + lineHeights[i] : lineHeights[i]) - lineHeightPadding);
                });
                const textWidth = Math.max(...lineWidths);
                const textHeight = lineY[lineCount - 1];
                await canvasPrepareSize(textWidth, textHeight);
                // 修改画布大小后 ctx 的状态需要重新设置
                ctx.font = font;
                ctx.fillStyle = ctx.strokeStyle = watermarkConfig.text.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                lines.forEach((line, i) => {
                    (watermarkConfig.text.outline ? ctx.strokeText : ctx.fillText).call(
                        ctx,
                        line,
                        canvas.width / 2,
                        (canvas.height - lineY[lineCount - 1] - lineHeightPadding) / 2 + lineY[i],
                    );
                });
                break;
            }
            case 'image': {
                const image = await src2image(watermarkConfig.image);
                await canvasPrepareSize(image.width, image.height);
                ctx.drawImage(image, (canvas.width - image.width) / 2, (canvas.height - image.height) / 2);
                break;
            }
        }
        if (watermarkConfig.style.emboss.enabled) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            switch (watermarkConfig.style.emboss.silhouetteMode) {
                case 'alpha':
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] = data[i + 1] = data[i + 2] = 255;
                    }
                    break;
                case 'black-white':
                    for (let i = 0; i < data.length; i += 4) {
                        data[i + 3] =
                            (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) * (data[i + 3] / 255);
                        data[i] = data[i + 1] = data[i + 2] = 255;
                    }
                    break;
                case 'white-black':
                    for (let i = 0; i < data.length; i += 4) {
                        data[i + 3] =
                            (255 - (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])) * (data[i + 3] / 255);
                        data[i] = data[i + 1] = data[i + 2] = 255;
                    }
                    break;
            }
            ctx.putImageData(imageData, 0, 0);
            const embossPaddingWidth =
                Math.cos((watermarkConfig.style.emboss.angle / 180) * Math.PI) * watermarkConfig.style.emboss.radius;
            const embossPaddingHeight =
                Math.sin((watermarkConfig.style.emboss.angle / 180) * Math.PI) * watermarkConfig.style.emboss.radius;
            const embossOriginalImage = await createImageBitmap(canvas);
            ctx.save();
            // 黑色部分
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(embossOriginalImage, -embossPaddingWidth, embossPaddingHeight);
            // 白色部分
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(embossOriginalImage, embossPaddingWidth, -embossPaddingHeight);
            // 去除中间的原始图案部分
            ctx.globalCompositeOperation = 'destination-out';
            ctx.drawImage(embossOriginalImage, 0, 0);
            // 灰色背景
            if (watermarkConfig.style.emboss.grayBackground) {
                ctx.fillStyle = '#808080';
                ctx.globalCompositeOperation = 'hard-light';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            embossOriginalImage.close();
            ctx.restore();
        }
    } catch (err) {
        alert(err);
    }
});

onMounted(watermarkDraw);
watch(watermarkConfig, watermarkDraw);

const saveWatermark = async () => {
    await watermarkDraw();
    const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(blob => (blob ? resolve(blob) : reject()), 'image/png'),
    );
    blobDownload(blob, `watermark-${Date.now()}`);
};
</script>