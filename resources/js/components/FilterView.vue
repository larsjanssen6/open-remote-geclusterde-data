<template>
    <div class="z-10 ml-2">
        <dropdown button-text="Color Levels" class="z-0">
            <div class="right-0 mt-1 bg-black w-48 shadow-xl cursor-pointer">
                <a @click="showColorPicker(color)" v-for="(color, index) in colors" class="block px-2 py-2 text-white hover:opacity-75" :style="{'background-color': color}">
                    Kleur {{(index + 1)}}: {{color}}

                    <input :ref="color" type="color" class="hidden" :value="color" />
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
        },
        methods: {
            showColorPicker(color) {
                const elem = this.$refs[color]
                elem[0].click();
            }
        }
    }
</script>

<style scoped>
</style>
