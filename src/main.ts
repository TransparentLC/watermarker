import { createApp } from 'vue';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import app from './app.vue';

const consoleBadge = (label: string, content: string, color: string) =>
    console.log(
        `%c ${label} %c ${content} `,
        'color:#fff;background-color:#555;border-radius:3px 0 0 3px',
        `color:#fff;background-color:${color};border-radius:0 3px 3px 0`,
    );

consoleBadge('Project', 'watermarker', '#07c');
consoleBadge('Author', 'TransparentLC', '#f84');
// @ts-expect-error
consoleBadge('Commit', `${__COMMIT_HASH__} ${__COMMIT_TIME__}`, '#f48');
// @ts-expect-error
consoleBadge('Build With', `${__VUE_VERSION__} + ${__VITE_VERSION__}`, '#4b8');
// @ts-expect-error
consoleBadge('Build With', __VUETIFY_VERSION__, '#16b');
consoleBadge('Source', 'https://github.com/TransparentLC/watermarker', '#000');

createApp(app)
    .use(
        createVuetify({
            icons: {
                defaultSet: 'mdi',
                aliases,
                sets: { mdi },
            },
            theme: {
                variations: {
                    colors: ['primary', 'secondary'],
                    lighten: 2,
                    darken: 2,
                },
                themes: {
                    light: {
                        colors: {
                            primary: '#0288d1',
                            secondary: '#00b0ff',
                        },
                    },
                    dark: {
                        dark: true,
                        colors: {
                            background: '#0f0f0f',
                            primary: '#0288d1',
                            secondary: '#00b0ff',
                        },
                    },
                },
            },
        }),
    )
    .mount('#app');
