<template>
    <div ref="canvas-container" class="mb-4"></div>
    Image editor
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { imageCtx as _ctx, imageCanvas as canvas } from '../canvas';

const container = useTemplateRef('canvas-container');

onMounted(() => {
    container.value?.appendChild(canvas);
});
</script>