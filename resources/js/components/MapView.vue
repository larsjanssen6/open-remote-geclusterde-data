<template>
    <div class="rounded w-full h-full" id="map"></div>
</template>

<script>
    import mapboxgl from 'mapbox-gl';
    import Supercluster from 'supercluster';
    import MapboxDraw from '@mapbox/mapbox-gl-draw';

    export default {
        data() {
            return {
                map: null,
                locations: [],
                clusters: [],
                markers: [],
                clustersGeojson: {},
                clusterIndex: null,
            };
        },

        mounted() {
            mapboxgl.accessToken =
                'pk.eyJ1IjoibGFyc2phbnNzZW4iLCJhIjoiY2pleXNmajIwMWdhbzJ6bnZjajZmeWYxeiJ9.tJqNmSSzbmhwPIO3qEkaGg';

            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/larsjanssen/ck04xvspq00gu1cpjwul2g8sr',
                zoom: 16,
                center: [5.469722, 51.441643],
            });

            this.addControls();

            this.map.on('load', () => {
                this.addMarkers();
            });
        },

        created() {
            axios.get('/map').then(({ data }) => {
                this.locations = data;
            });

            var draw = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true
                }
            });

            this.map.addControl(draw);
        },

        methods: {
            toggle() {
                alert('df');
            },

            addMarkers() {
                this.clusterIndex = new Supercluster({
                    radius: 120,
                    maxZoom: 16
                });

                this.clusterIndex.load(this.locations.features);
                this.map.on('moveend', () => {
                    this.moveEnd();
                });

                this.updateClusters();
            },

            updateClusters() {
                var bounds = this.map.getBounds(),
                    zoom = this.map.getZoom();

                this.clustersGeojson = this.clusterIndex.getClusters(
                    [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
                    Math.floor(zoom)
                );

                if (Object.keys(this.clusters).length) {
                    this.clusters.forEach(function(cluster) {
                        cluster.remove();
                    });
                }

                this.displayFeatures(this.clustersGeojson);
            },

            addControls() {
                this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
                this.map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

                this.map.addControl(
                    new mapboxgl.GeolocateControl({
                        positionOptions: {
                            enableHighAccuracy: true,
                        },
                        trackUserLocation: true,
                    }),
                    'bottom-right'
                );
            },

            moveEnd() {
                this.updateClusters();
            },

            displayFeatures(features) {
                if (this.markers.length) {
                    this.markers.forEach(function(marker) {
                        marker.remove();
                    });
                }

                features.forEach(feature => {
                    var isCluster = !!feature.properties.cluster ? true : false,
                        $feature;

                    if (isCluster) {
                        var leaf = this.clusterIndex.getLeaves(feature.properties.cluster_id)[0];
                        $feature = document.createElement('div');
                        $feature.className =
                            'flex items-center justify-center w-16 h-16 rounded-full relative overflow-hidden shadow text-center text-lg text-white font-bold bg-cover cursor-pointer bg-center';
                        $feature.style.backgroundImage = `url(${leaf.properties.image})`;

                        var $innerBackground = document.createElement('div');
                        $innerBackground.className = 'absolute bg-black opacity-25 w-full h-full';

                        var $innerText = document.createElement('div');
                        $innerText.className = 'absolute';
                        $innerText.innerHTML = feature.properties.point_count_abbreviated;

                        $feature.appendChild($innerBackground);
                        $feature.appendChild($innerText);
                        this.bindClusterClickEvent($feature, feature);

                        this.clusters[feature.properties.cluster_id] = new mapboxgl.Marker($feature)
                            .setLngLat(feature.geometry.coordinates)
                            .addTo(this.map);
                    } else {
                        $feature = document.createElement('div');
                        $feature.className =
                            'flex items-center justify-center w-16 h-16 rounded-full text-center text-lg text-white font-bold shadow-lg bg-cover cursor-pointer bg-center';
                        $feature.style.backgroundImage = `url(${feature.properties.image})`;
                        this.bindClickEvent($feature, feature);

                        this.markers.push(
                            new mapboxgl.Marker($feature).setLngLat(feature.geometry.coordinates).addTo(this.map)
                        );
                    }
                });
            },

            bindClickEvent(el, feature) {
                el.addEventListener('click', e => {
                    e.stopPropagation();
                    const html = this.popupHTML(feature);

                    new mapboxgl.Popup({ offset: 30 })
                        .setLngLat(feature.geometry.coordinates)
                        .setHTML(html)
                        .addTo(this.map);
                });
            },

            popupHTML(feature) {
                let profileRoute = '/';
                let chatRoute = '/';

                return `
                <div class="flex items-center flex-col bg-white p-6">
                    <h1>${feature.properties.name}</h1>
                    <h3 class="font-semibold text-center mt-2">📍${feature.properties.place}</h3>

                    <a  href="${profileRoute}"
                        target="_blank"
                        class="rounded font-bold bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 mt-4">
                        Bekijk profiel
                    </a>

                    <a  href="${chatRoute}"
                        target="_blank"
                        class="text-primary underline mt-4">
                        Chat met baasje
                    </a>
                </div>
            `;
            },

            bindClusterClickEvent(el, feature) {
                el.addEventListener('click', e => {
                    e.stopPropagation();
                    var bounds = new mapboxgl.LngLatBounds();

                    var features = this.clusterIndex.getLeaves(feature.properties.cluster_id, 100);

                    features.forEach(function(feature) {
                        bounds.extend(feature.geometry.coordinates);
                    });

                    this.map.fitBounds(bounds, { padding: 100 });
                });
            },
        },
    };
</script>
