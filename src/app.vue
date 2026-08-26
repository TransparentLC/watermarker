<template>
    <v-app>
        <v-app-bar color="primary">
            <v-app-bar-title>水印姬</v-app-bar-title>
        </v-app-bar>

        <v-main>
            <v-container>

            </v-container>
        </v-main>

        <v-footer class="text-body-small text-grey">© 2026 ✨小透明・宸✨</v-footer>
    </v-app>
</template>

<style>
    .v-toolbar__content, .v-container, .v-footer {
        max-width: 720px;
        margin-left: auto;
        margin-right: auto;
    }

    .chessboard-background {
        animation: 3s linear infinite chessboard-background-move;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cdefs%3E%3Cpattern id='a' width='24' height='24' patternUnits='userSpaceOnUse'%3E%3Crect width='12' height='12' fill='%23ccccccff' rx='0'/%3E%3Crect width='12' height='12' x='12' fill='%23ffffffff' rx='0'/%3E%3Crect width='12' height='12' x='12' y='12' fill='%23ccccccff' rx='0'/%3E%3Crect width='12' height='12' y='12' fill='%23ffffffff' rx='0'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23a)'/%3E%3C/svg%3E");
    }

    @media (prefers-color-scheme:dark) {
        .chessboard-background {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cdefs%3E%3Cpattern id='a' width='24' height='24' patternUnits='userSpaceOnUse'%3E%3Crect width='12' height='12' fill='%23666666ff' rx='0'/%3E%3Crect width='12' height='12' x='12' fill='%23333333ff' rx='0'/%3E%3Crect width='12' height='12' x='12' y='12' fill='%23666666ff' rx='0'/%3E%3Crect width='12' height='12' y='12' fill='%23333333ff' rx='0'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23a)'/%3E%3C/svg%3E");
        }
    }

    @keyframes chessboard-background-move {
        from {
            background-position: 0 0;
        }
        to {
            background-position: 24px 24px;
        }
    }
</style>

<script setup lang="ts">
</script>
