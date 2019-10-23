<template>
    <div>
        <map-view></map-view>
    </div>
</template>

<script>
    import QueryParamHelper from '../QueryParamHelper';

    export default {
        mixins: [QueryParamHelper],

        data() {
            return {
                activeStyle: ''
            }
        },

        created() {
            // if(this.getParameterByName('map') === 'satellite') {
            //     this.activeStyle = 'satellite';
            // }
        }
    }
</script>