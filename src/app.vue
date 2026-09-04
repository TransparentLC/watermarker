<template>
    <v-app>
        <v-app-bar color="primary">
            <v-app-bar-title>水印姬</v-app-bar-title>
            <template v-slot:append>
                <div id="app-bar-append">
                </div>
                <v-btn
                    variant="text"
                    href="https://github.com/TransparentLC/watermarker"
                    target="_blank"
                    :icon="githubIcon"
                ></v-btn>
            </template>
        </v-app-bar>

        <v-main>
            <v-container class="pa-0">
                <v-tabs-window v-model="tab">
                    <v-tabs-window-item value="watermark-editor" class="pa-4">
                        <watermark-editor :active="tab === 'watermark-editor'"></watermark-editor>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="image-editor" class="pa-4">
                        <image-editor :active="tab === 'image-editor'"></image-editor>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="about" class="pa-4">
                        <p>快速为证件照、小样图、版权图等敏感照片添加全屏水印。</p>
                        <p>这个小工具有很多模仿开源的 Android APP <a href="https://github.com/rosuH/EasyWatermark" rel="noopener noreferrer" target="_blank" class="text-primary">“简单水印”</a>的地方，但是我觉得有一个可以跨平台使用的版本会更好 (｡•̀ᴗ-)✧</p>
                        <p>新版本使用 Vue 3 + Vuetify 完全重写，界面更美观，功能更丰富！</p>
                        <p><del>名字是随便取的，图标是随便做的，不要在意……</del></p>
                        <p><a href="https://github.com/TransparentLC/watermarker" rel="noopener noreferrer" target="_blank" class="text-primary">查看 GitHub 上的源代码</a></p>
                        <p><a href="https://i.akarin.dev/donate/" rel="noopener noreferrer" target="_blank" class="text-primary">请小透明喝一瓶肥宅快乐水～(*´∀`)</a></p>
                        <h4 class="text-title-large">特性</h4>
                        <ul>
                            <li>代码完全开源，你可以随意根据自己的需要对代码进行自行部署和修改。</li>
                            <li>除加载页面静态资源以外，不会发送包括统计埋点在内的任何网络请求，当然也不可能悄悄将图片上传到别处从而使你的隐私被泄露。</li>
                            <ul>
                                <li>对这一点有怀疑的话，你可以随意检查源代码。</li>
                                <li>由于这个小工具是使用 GitHub Pages 部署的，GitHub 可能会从访客处收集包括 IP 地址日志在内的用户个人信息（参见 <a href="https://docs.github.com/cn/site-policy/privacy-policies/github-privacy-statement#github-%E9%A1%B5%E9%9D%A2" rel="noopener noreferrer" target="_blank" class="text-primary">GitHub 的隐私声明</a>），但是并不会影响这个工具的安全性。</li>
                            </ul>
                            <li>支持 PWA 技术。如果你的浏览器支持，可以通过安装 PWA 应用的方式离线使用，获得更好的体验。</li>
                            <li>支持使用文字或图片作为水印内容，任意调节文字样式、旋转角度、不透明度和水印间隔等属性。</li>
                            <li>支持制作浮雕水印，并使用叠加/柔光添加到图片上。</li>
                            <li>可以将水印图片单独保存。</li>
                            <li>可以设定保存加水印后的图片时使用的格式及压缩质量。</li>
                        </ul>
                        <h4 class="text-title-large">常见问题</h4>
                        <ul>
                            <li>
                                <p><strong>快速使用</strong></p>
                                <p>在“编辑水印”中输入水印文本或选择水印图片，然后在“加水印”中选择要加水印的图片，设定各种参数后点击右上角的保存图标就可以了。</p>
                                <p>（有空的话就回来探索一下其他的功能吧！）</p>
                            </li>
                            <li>
                                <p><strong>编辑文字水印时，如何使用其他系统上已经安装的字体？</strong></p>
                                <p>在“字体”的选择框中输入字体的完整名称（例如“微软雅黑”或“Microsoft YaHei”）即可。</p>
                                <p>由于浏览器限制，这里不能读取系统上已安装的字体列表，所以需要手动输入名称。</p>
                            </li>
                            <li>
                                <p><strong>水印样式的“内容占比”</strong></p>
                                <p>如果使用了背景图案，可以写字的地方一般来说只有图案中间的一小部分，这时将“内容占比”调低一些就可以让文字以合适的大小出现在中间。</p>
                            </li>
                            <li>
                                <p><strong>关于浮雕水印</strong></p>
                                <p>可以在“样式”中使用“浮雕化”将文字或准备好的单色水印图片做成浮雕水印的样式，在加水印的时候选择“叠加”的混合选项就可以有浮雕效果。</p>
                                <p>可以把制作好的浮雕水印保存，下次选择图片就可以直接使用，不需要再启用“浮雕化”。保存的水印也可以在 Photoshop 等图像编辑软件中使用。</p>
                                <p>如果分享水印的平台不支持上传透明图片，可以启用“使用灰色背景”，在使用“叠加”混合选项添加水印时不会有额外影响。</p>
                            </li>
                            <li>
                                <p><strong>是否可以制作○○样式的水印/以○○方式加水印？</strong></p>
                                <p>如果方便实现的话：会考虑的！</p>
                                <p>如果实现很麻烦或配置很复杂的话：还是直接用 Photoshop 等图像编辑软件吧……</p>
                            </li>
                            <li>
                                <p><strong>能不能添加暗水印？</strong></p>
                                <p>不能。</p>
                            </li>
                        </ul>
                        <h4 class="text-title-large">借物表</h4>
                        <p>Webfont：<a href="https://chinese-font.netlify.app/" rel="noopener noreferrer" target="_blank" class="text-primary">中文网字计划</a></p>
                        <p>示例用图片水印：<a href="https://booth.pm/ja/items/8665012" rel="noopener noreferrer" target="_blank" class="text-primary">BOOTH @tenori-tei</a></p>
                        <p>背景图案：<a href="https://rouzao.com/user/copyright" rel="noopener noreferrer" target="_blank" class="text-primary">柔造（“版权保护”设置页面）</a></p>
                    </v-tabs-window-item>
                </v-tabs-window>
                <div class="text-center text-medium-emphasis text-body-small mb-4">© 2026 ✨小透明・宸✨</div>
            </v-container>
        </v-main>

        <v-sheet class="position-fixed left-0 right-0 bottom-0 elevation-1" style="z-index:1">
            <v-tabs
                v-model="tab"
                color="primary"
                align-tabs="center"
                density="compact"
                stacked
                grow
                class="mx-auto"
                style="max-width:720px"
            >
                <v-tab value="watermark-editor" class="flex-1-1-0">
                    <v-icon :icon="mdiOctagramEditOutline"></v-icon><span class="text-label-medium">编辑水印</span>
                </v-tab>
                <v-tab value="image-editor" class="flex-1-1-0">
                    <v-icon :icon="mdiStamper"></v-icon><span class="text-label-medium">加水印</span>
                </v-tab>
                <v-tab value="about" class="flex-1-1-0">
                    <v-icon :icon="mdiInformationOutline"></v-icon><span class="text-label-medium">关于</span>
                </v-tab>
            </v-tabs>
        </v-sheet>
    </v-app>
</template>

<script setup lang="ts">
import { mdiInformationOutline, mdiOctagramEditOutline, mdiStamper } from '@mdi/js';
import { ref } from 'vue';
import imageEditor from './components/image-editor.vue';
import watermarkEditor from './components/watermark-editor.vue';

const tab = ref<'watermark-editor' | 'image-editor' | 'about'>('watermark-editor');
const githubIcon =
    'M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z';

// 预加载示例水印和图片
['assets/watermark-sample.avif', 'assets/image-sample.avif'].map(e => (document.createElement('img').src = e));
</script>
