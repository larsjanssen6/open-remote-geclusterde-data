<template>
    <div class="mx-10">
        <div class="relative">
            <input
                    type="range"
                    min="1"
                    max="1440"
                    value="0"
                    v-model="range"
                    class="slider m-0"
                    id="slider">
        </div>

        <div class="flex justify-between w-full">
            <p class="text-xs" v-for="i in 24">{{ i-1 }}</p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                range: 0,
                show: false
            }
        },

        mounted() {
            let d = new Date();
            this.range = d.getHours() *60;
        },

        watch: {
            range: function() {
                Bus.$emit('reload-map', this.range);
            }
        }
    }
</script>
