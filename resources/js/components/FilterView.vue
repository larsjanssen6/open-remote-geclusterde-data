<template>
    <div class="z-10">
        <dropdown button-text="Color Levels" class="z-0">
            <div class="right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl cursor-pointer">
                <a v-for="color in colors" class="block px-4 py-2 text-gray-800 hover:text-white" :style="background-color: {{color}}">
                    {{color}}
                </a>
            </div>
        </dropdown>
    </div>
</template>

<script>
    import { mapGetters, mapState } from 'vuex'

    export default {
        computed: {
            ...mapState({
                colors: state => state.colors
            }),
            ...mapGetters('colors', {
                colors: 'colors'
            })
        }
    }
</script>

<style scoped>
</style>
