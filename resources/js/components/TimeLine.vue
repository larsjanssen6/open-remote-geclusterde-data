<template>
    <div class="mx-10">
        <apexchart width="100%" height="125" type="bar" :options="chartOptions" :series="series"></apexchart>
        <div class="relative">
            <input
                    type="range"
                    min="1"
                    max="24"
                    value="0"
                    v-model="range"
                    class="slider m-0"
                    id="slider">
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                range: 0,
                show: false,
                chartOptions: {
                    chart: {
                        id: 'vuechart-example',
                        toolbar: {
                            show: false
                        },
                        sparkline: {
                            enabled: true
                        }
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
                    data: [30, 40, 35, 50, 49, 60, 70, 91, 31, 53, 68, 18, 48, 129, 38, 38, 102, 31, 38, 82, 84, 12, 90, 89]
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
        }
    }
</script>
