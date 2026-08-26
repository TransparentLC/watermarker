import { createApp } from 'vue';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import app from './app.vue';

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
