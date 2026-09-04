<template>
    <div ref="canvas-container" class="mb-4"></div>
    <div class="text-center text-body-small my-4">在画布上拖动和滑动滚轮可以改变水印位置和大小</div>
    <div class="d-flex flex-column ga-4">
        <v-btn color="primary" block @click="selectImage">选择图片</v-btn>
        <v-switch
            v-model="imageConfig.repeat"
            label="全屏平铺"
            color="primary"
            hide-details
            density="compact"
            class="ml-2"
        ></v-switch>
        <v-label>排版预设</v-label>
        <div class="d-flex ga-2">
            <v-btn class="flex-grow-1" @click="applyPreset('center')">单个居中</v-btn>
            <v-btn class="flex-grow-1" @click="applyPreset('bottom-right')">单个右下</v-btn>
            <v-btn class="flex-grow-1" @click="applyPreset('2x2-tiled')">2×2 平铺</v-btn>
            <v-btn class="flex-grow-1" @click="applyPreset('3x3-tiled')">3×3 平铺</v-btn>
        </div>
        <v-radio-group
            label="混合模式"
            hint="浮雕水印请使用叠加或柔光"
            persistent-hint
            indent-details
            color="primary"
            inline
            v-model="imageConfig.mode"
            class="mx-n4"
        >
            <v-radio label="正常" value="source-over" class="flex-1-1-0"></v-radio>
            <v-radio label="叠加" value="overlay" class="flex-1-1-0"></v-radio>
            <v-radio label="柔光" value="soft-light" class="flex-1-1-0"></v-radio>
        </v-radio-group>
        <v-slider
            color="primary"
            v-model="imageConfig.alpha"
            label="不透明度"
            :min="0"
            :max="100"
            :step="1"
            class="align-center"
            hide-details
        >
            <template #append>
                <v-number-input
                    color="primary"
                    v-model="imageConfig.alpha"
                    :min="0"
                    :max="100"
                    :step="1"
                    suffix="%"
                    controlVariant="stacked"
                    density="compact"
                    style="width:8em"
                    hide-details
                ></v-number-input>
            </template>
        </v-slider>
        <v-slider
            color="primary"
            v-model="imageConfig.scale"
            label="水印缩放"
            :min="1"
            :max="200"
            :step="1"
            class="align-center"
            hide-details
        >
            <template #append>
                <v-number-input
                    color="primary"
                    v-model="imageConfig.scale"
                    :min="1"
                    suffix="%"
                    controlVariant="stacked"
                    density="compact"
                    style="width:8em"
                    hide-details
                ></v-number-input>
            </template>
        </v-slider>
        <v-slider
            color="primary"
            v-model="imageConfig.angle"
            label="角度　　"
            :min="-180"
            :max="180"
            :step="1"
            class="align-center"
            hide-details
        >
            <template #append>
                <v-number-input
                    color="primary"
                    v-model="imageConfig.angle"
                    :min="-180"
                    :max="180"
                    :step="1"
                    suffix="deg"
                    controlVariant="stacked"
                    density="compact"
                    style="width:8em"
                    hide-details
                ></v-number-input>
            </template>
        </v-slider>
        <v-slider
            color="primary"
            v-model="imageConfig.offset.x"
            label="水平偏移"
            :min="-50"
            :max="50"
            :step="1"
            class="align-center"
            hide-details
        >
            <template #append>
                <v-number-input
                    color="primary"
                    v-model="imageConfig.offset.x"
                    :min="-50"
                    :max="50"
                    :step="1"
                    suffix="%"
                    controlVariant="stacked"
                    density="compact"
                    style="width:8em"
                    hide-details
                ></v-number-input>
            </template>
        </v-slider>
        <v-slider
            color="primary"
            v-model="imageConfig.offset.y"
            label="垂直偏移"
            :min="-50"
            :max="50"
            :step="1"
            class="align-center"
            hide-details
        >
            <template #append>
                <v-number-input
                    color="primary"
                    v-model="imageConfig.offset.y"
                    :min="-50"
                    :max="50"
                    :step="1"
                    suffix="%"
                    controlVariant="stacked"
                    density="compact"
                    style="width:8em"
                    hide-details
                ></v-number-input>
            </template>
        </v-slider>
        <v-expand-transition>
            <div v-if="imageConfig.repeat" class="d-flex flex-column ga-4">
                <v-slider
                    color="primary"
                    v-model="imageConfig.padding.x"
                    label="水平间隔"
                    :min="-50"
                    :max="50"
                    :step="1"
                    class="align-center"
                    hide-details
                >
                    <template #append>
                        <v-number-input
                            color="primary"
                            v-model="imageConfig.padding.x"
                            :min="-50"
                            :max="50"
                            :step="1"
                            suffix="%"
                            controlVariant="stacked"
                            density="compact"
                            style="width:8em"
                            hide-details
                        ></v-number-input>
                    </template>
                </v-slider>
                <v-slider
                    color="primary"
                    v-model="imageConfig.padding.y"
                    label="垂直间隔"
                    :min="-50"
                    :max="50"
                    :step="1"
                    class="align-center"
                    hide-details
                >
                    <template #append>
                        <v-number-input
                            color="primary"
                            v-model="imageConfig.padding.y"
                            :min="-50"
                            :max="50"
                            :step="1"
                            suffix="%"
                            controlVariant="stacked"
                            density="compact"
                            style="width:8em"
                            hide-details
                        ></v-number-input>
                    </template>
                </v-slider>
            </div>
        </v-expand-transition>
    </div>

    <teleport v-if="active" defer to="#app-bar-append">
        <v-dialog max-width="360">
            <template v-slot:activator="{ props: dialogProps }">
                <v-tooltip text="保存图片">
                    <template v-slot:activator="{ props: tooltipProps }">
                        <v-btn
                            v-bind="{ ...dialogProps, ...tooltipProps }"
                            variant="text"
                            :icon="mdiContentSave"
                        ></v-btn>
                    </template>
                </v-tooltip>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card title="保存图片">
                    <v-card-text>
                        <v-radio-group
                            v-model="saveFormat"
                            label="格式"
                            color="primary"
                            hide-details
                            class="mx-n4"
                        >
                            <v-radio label="JPEG" value="image/jpeg"></v-radio>
                            <v-radio label="WebP" value="image/webp"></v-radio>
                            <v-radio label="PNG" value="image/png"></v-radio>
                        </v-radio-group>
                        <v-expand-transition>
                            <v-slider
                                v-if="saveFormat !== 'image/png'"
                                v-model="saveQuality"
                                color="primary"
                                label="质量"
                                :min="1"
                                :max="100"
                                :step="1"
                                class="align-center"
                                hide-details
                            >
                                <template #append>
                                    <v-number-input
                                        v-model="saveQuality"
                                        color="primary"
                                        :min="1"
                                        :max="100"
                                        suffix="%"
                                        controlVariant="stacked"
                                        density="compact"
                                        style="width:8em"
                                        hide-details
                                    ></v-number-input>
                                </template>
                            </v-slider>
                        </v-expand-transition>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            text="取消"
                            @click="isActive.value = false"
                        ></v-btn>
                        <v-btn
                            text="保存"
                            color="primary"
                            @click="isActive.value = false; saveImage()"
                        ></v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </teleport>
</template>

<script setup lang="ts">
import { mdiContentSave } from '@mdi/js';
import selectFiles from 'select-files';
import { nextTick, onMounted, reactive, ref, useTemplateRef, watch } from 'vue';
import { imageCanvas as canvas, imageCtx as ctx, watermarkCanvas } from '../canvas';
import { asyncAtATime, blobDownload, src2image } from '../common';

const props = defineProps<{ active: boolean }>();

const container = useTemplateRef('canvas-container');
onMounted(() => {
    container.value?.appendChild(canvas);
});

const saveFormat = ref<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
const saveQuality = ref(90);
const saveImage = async () => {
    const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(blob => (blob ? resolve(blob) : reject()), saveFormat.value, saveQuality.value / 100),
    );
    blobDownload(blob, `image-${Date.now()}`);
};

const imageConfig = reactive({
    image: 'assets/image-sample.avif',
    repeat: true,
    mode: 'source-over' as 'source-over' | 'overlay' | 'soft-light',
    scale: 100,
    alpha: 100,
    angle: 0,
    padding: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0,
    },
});

const watermarkTransformCanvas = new OffscreenCanvas(0, 0);
// biome-ignore lint/style/noNonNullAssertion: reason
const watermarkTransformCtx = watermarkTransformCanvas.getContext('2d')!;

const watermarkTransform = async () => {
    const angleRad = (imageConfig.angle * Math.PI) / 180;
    const scale = imageConfig.scale / 100;
    const { width, height } = watermarkCanvas;
    watermarkTransformCanvas.width =
        (width * Math.abs(Math.cos(angleRad)) + height * Math.abs(Math.sin(angleRad))) * scale;
    watermarkTransformCanvas.height =
        (width * Math.abs(Math.sin(angleRad)) + height * Math.abs(Math.cos(angleRad))) * scale;
    watermarkTransformCtx.clearRect(0, 0, watermarkTransformCanvas.width, watermarkTransformCanvas.height);
    watermarkTransformCtx.save();
    watermarkTransformCtx.translate(watermarkTransformCanvas.width / 2, watermarkTransformCanvas.height / 2);
    watermarkTransformCtx.rotate(angleRad);
    watermarkTransformCtx.drawImage(
        watermarkCanvas,
        (-width / 2) * scale,
        (-height / 2) * scale,
        width * scale,
        height * scale,
    );
    // watermarkTransformCtx.strokeStyle = 'red';
    // watermarkTransformCtx.strokeRect((-width / 2) * scale, (-height / 2) * scale, width * scale, height * scale);
    watermarkTransformCtx.restore();
};

const imageDraw = asyncAtATime(async () => {
    try {
        await watermarkTransform();
        const image = await src2image(imageConfig.image);
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);

        ctx.save();
        ctx.globalCompositeOperation = imageConfig.mode;
        ctx.globalAlpha = imageConfig.alpha / 100;
        // 有一个水印在图片正中间，计算这个水印的位置
        let offsetX = canvas.width / 2 - watermarkTransformCanvas.width / 2;
        let offsetY = canvas.height / 2 - watermarkTransformCanvas.height / 2;
        if (imageConfig.repeat) {
            // imageConfig.offset.{x,y} 是水印的大小
            offsetX += watermarkTransformCanvas.width * (imageConfig.offset.x / 100);
            offsetY += watermarkTransformCanvas.height * (imageConfig.offset.y / 100);
            // 计算额外间隔后水印的尺寸
            const width = watermarkTransformCanvas.width * (1 + imageConfig.padding.x / 100);
            const height = watermarkTransformCanvas.height * (1 + imageConfig.padding.y / 100);
            // 从中间的水印开始，往左上右下画 x 个水印
            const repeatXFrom = -Math.ceil(offsetX / width);
            const repeatXTo = Math.ceil((canvas.width - offsetX) / width);
            const repeatYFrom = -Math.ceil(offsetY / height);
            const repeatYTo = Math.ceil((canvas.height - offsetY) / height);
            for (let x = repeatXFrom; x <= repeatXTo; x++) {
                for (let y = repeatYFrom; y <= repeatYTo; y++) {
                    ctx.drawImage(watermarkTransformCanvas, offsetX + x * width, offsetY + y * height);
                }
            }
        } else {
            // imageConfig.offset.{x,y} 是画布的大小
            offsetX += canvas.width * (imageConfig.offset.x / 100);
            offsetY += canvas.height * (imageConfig.offset.y / 100);
            ctx.drawImage(watermarkTransformCanvas, offsetX, offsetY);
        }
        ctx.restore();
    } catch (err) {
        alert(err);
    }
});

onMounted(imageDraw);
watch([imageConfig, () => props.active], imageDraw);

const selectImage = async () => {
    const file = await selectFiles({ accept: 'image/*' }).then(files => files?.[0]);
    if (!file) return;
    URL.revokeObjectURL(imageConfig.image);
    imageConfig.image = URL.createObjectURL(file);
};

const applyPreset = (mode: string) => {
    switch (mode) {
        case 'center':
            imageConfig.repeat = false;
            imageConfig.angle = 0;
            imageConfig.scale =
                (Math.min(canvas.width / watermarkCanvas.width, canvas.height / watermarkCanvas.height) / 3) * 100;
            imageConfig.offset.x = imageConfig.offset.y = 0;
            break;
        case 'bottom-right':
            imageConfig.repeat = false;
            imageConfig.angle = 0;
            imageConfig.scale =
                (Math.min(canvas.width / watermarkCanvas.width, canvas.height / watermarkCanvas.height) / 3) * 100;
            nextTick(() => {
                imageConfig.offset.x = (1 - watermarkTransformCanvas.width / canvas.width) * 50;
                imageConfig.offset.y = (1 - watermarkTransformCanvas.height / canvas.height) * 50;
            });
            break;
        case '2x2-tiled':
            imageConfig.repeat = true;
            imageConfig.angle = 0;
            imageConfig.scale =
                (Math.min(canvas.width / watermarkCanvas.width, canvas.height / watermarkCanvas.height) / 2) * 100;
            imageConfig.offset.x = imageConfig.offset.y = -50;
            break;
        case '3x3-tiled':
            imageConfig.repeat = true;
            imageConfig.angle = 0;
            imageConfig.scale =
                (Math.min(canvas.width / watermarkCanvas.width, canvas.height / watermarkCanvas.height) / 3) * 100;
            imageConfig.offset.x = imageConfig.offset.y = 0;
            break;
    }
};

canvas.addEventListener('wheel', e => {
    e.preventDefault();
    imageConfig.scale = Math.max(imageConfig.scale + Math.round(e.deltaY / -10), 1);
});
let lastClickX: number | null = null;
let lastClickY: number | null = null;
const leftClickHandler = (e: PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!lastClickX || !lastClickY) {
        lastClickX = e.screenX;
        lastClickY = e.screenY;
        return;
    }
    const deltaX = e.screenX - lastClickX;
    const deltaY = e.screenY - lastClickY;
    lastClickX = e.screenX;
    lastClickY = e.screenY;
    const boundingClientRect = canvas.getBoundingClientRect();
    imageConfig.offset.x +=
        ((deltaX * (canvas.width / boundingClientRect.width)) /
            (imageConfig.repeat ? watermarkTransformCanvas.width : canvas.width)) *
        100;
    imageConfig.offset.y +=
        ((deltaY * (canvas.height / boundingClientRect.height)) /
            (imageConfig.repeat ? watermarkTransformCanvas.height : canvas.height)) *
        100;
    if (imageConfig.offset.x < -50) imageConfig.offset.x += 100;
    if (imageConfig.offset.x > 50) imageConfig.offset.x -= 100;
    if (imageConfig.offset.y < -50) imageConfig.offset.y += 100;
    if (imageConfig.offset.y > 50) imageConfig.offset.y -= 100;
};
addEventListener('pointerdown', e => {
    if (e.target !== canvas || e.button !== 0) return;
    addEventListener('pointermove', leftClickHandler);
});
addEventListener('pointerup', e => {
    if (e.button !== 0) return;
    removeEventListener('pointermove', leftClickHandler);
    lastClickX = lastClickY = null;
});

addEventListener('dragover', e => {
    if (!props.active) return;
    e.preventDefault();
});
addEventListener('drop', e => {
    if (!props.active) return;
    e.preventDefault();
    e.stopPropagation();
    const file = Array.from(e.dataTransfer!.files).find(e => e.type.startsWith('image/'));
    if (file) {
        URL.revokeObjectURL(imageConfig.image);
        imageConfig.image = URL.createObjectURL(file);
    }
});
</script>