<template>
    <div class="mx-10">
        <apexchart width="100%" height="40" type="bar" :options="chartOptions" :series="series"></apexchart>

        <div class="relative px-12">
            <vue-slider :min="1" :max="24" :interval="1" :adsorb="true" :marks="true" v-model="range">
                <template v-slot:label="{ active, value }">
                    <div :class="['vue-slider-mark-label', 'custom-label', { active }]">{{getTimelineLabel(value)}}</div>
                </template>
            </vue-slider>
        </div>
    </div>
</template>

<script>
    import VueSlider from 'vue-slider-component'
    import 'vue-slider-component/theme/antd.css'
    import moment from 'moment'

    export default {
        components: {
            VueSlider
        },

        data() {
            return {
                range: 0,
                show: false,
                chartOptions: {
                    colors: ['#5E0073', '#f6e835'],
                    chart: {
                        id: 'vuechart-example',
                        sparkline: {
                            enabled: true
                        },
                        events: {
                            dataPointSelection: function(event, chartContext, config) {
                                console.log(config.dataPointIndex);
                            }
                        },
                        stacked: true
                    },
                    xaxis: {
                        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
                    },
                    yaxis: {
                        labels: {
                            show: false
                        },
                    },
                    grid: {
                        show: false,
                        padding: {
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        },
                        margin: {
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                series: [{
                    name: 'series-1',
                    data: this.generateArrayOfItems(new Date().getHours(), 20).concat(this.generateArrayOfItems(24 - new Date().getHours(), 0))
                }, 
                {
                    name: 'series-2',
                    data: this.generateArrayOfItems(new Date().getHours(), 0).concat(this.generateArrayOfItems(24 - new Date().getHours(), 60))
                }]

            }
        },

        mounted() {
            let d = new Date();
            this.range = d.getHours();
        },

        watch: {
            range: function() {
                Bus.$emit('reload-map', this.range);
            }
        },

        methods: {
            generateArrayOfItems(len, itm) {
                var arr1 = [itm],
                    arr2 = [];
                while (len > 0) {
                    if (len & 1) arr2 = arr2.concat(arr1);
                    arr1 = arr1.concat(arr1);
                    len >>>= 1;
                }
                return arr2;
            },
            
            getTimelineLabel(value) {
                return value;
            }
        }
    }
</script>
