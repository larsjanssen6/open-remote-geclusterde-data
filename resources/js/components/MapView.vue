 <template>
    <div class="relative w-full h-full">
        <div class="absolute w-full h-full">
            <div class="rounded w-full h-full" id="map"></div>
        </div>

        <div class="text-white absolute top-0 left-0 mt-32 ml-8 p-4 rounded"
             v-if="timeInFuture"
             style="background: #F6E835;">
            Let op dit is voorspelde data
        </div>

        <div class="absolute mt-4 w-full mx-0">
            <time-line></time-line>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import mapboxgl from 'mapbox-gl';
    import Supercluster from 'supercluster';

    export default {
        data() {
            return {
                timeInFuture: false,
                map: null,
                locations: [],
                allLocations: {features: [], type: "FeatureCollection"},
                clusters: [],
                markers: [],
                clustersGeojson: {},
                clusterIndex: null,
                pastColors: [
                    '#ffb3b3',
                    '#ff4d4d',
                    '#ff0000',
                    '#b30000',
                    '#660000'
                ],
                futureColors: [
                    '#F6E835',
                    '#F4E409',
                    '#C8BB08',
                    '#9C9206',
                    '#6F6805'
                ]
            };
        },

        sockets: {
           connect: function () {
            console.log('socket connected')
            
            },
            newData: function (data) {
                let newPoint = {
                   type: "Feature",
                   geometry: {
                       type: "Point",
                       coordinates: [
                           data.longitude,
                           data.latitude
                       ]
                   },
                   properties: {
                        aangemaakt: new Date(),
                        nummer: "990545905",
                        onderwerp:"6.1 Illegale stort",
                        gebied: "1-Centrum",
                        geo_point_2d:[
                            data.longitude,
                           data.latitude
                        ],
                        buurt: "BU07721112",
                        gewijzigd: "2019-01-29T11:27:00+01:00",
                        locatie: "Grote Berg 33",
                        locatie_ter_hoogte_van: "Grote Berg 33"
                   }
                }
                this.locations.features.push(newPoint);
                this.addMarkers()
            } 
        },

        mounted() {
            mapboxgl.accessToken =
                'pk.eyJ1Ijoic3RlZmFuZ2llcyIsImEiOiJjazBlemc3MmkwZTNkM25tcHIwZW9nOGJvIn0.TuLSLNJrtb247NH3MXWVJA';

            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/stefangies/ck1gcr5ek012w1clg21fznkc5',
                zoom: 16,
                center: [5.469722, 51.441643],
            });

            this.addControls();

            this.map.on('load', () => {
                this.addMarkers();
            });

            Bus.$on('reload-map', (range) => {
                this.reloadMap(range);
            });
        },

        created() {
            axios.get('/map').then(({data}) => {
                this.locations = data;
                this.allLocations = this.locations;
            });
        },

        methods: {
            reloadMap(range) {
                if(range > moment().hours()) {
                    this.timeInFuture = true;
                }

                else {
                    this.timeInFuture = false;
                }

                this.allLocations = {features: [], type: "FeatureCollection"};

                if(this.locations.features) {
                    this.locations.features.forEach((f) => {
                        let time = moment(f.properties.aangemaakt).hours();

                        if (time == range) {
                            this.allLocations.features.push(f);
                        }
                    });

                    this.addMarkers();
                }
            },

            addMarkers() {
                this.clusterIndex = new Supercluster({
                    radius: 100,
                    maxZoom: 16
                });

                this.clusterIndex.load(this.allLocations.features);

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
                    this.clusters.forEach(function (cluster) {
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
                    this.markers.forEach(function (marker) {
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
                            'flex items-center justify-center w-16 h-16 rounded-full relative overflow-hidden text-center text-lg text-white font-bold bg-cover cursor-pointer bg-center';
                        $feature.style.backgroundImage = `url(${leaf.properties.image})`;

                        var $innerBackground = document.createElement('div');
                        $innerBackground.className = 'absolute w-full h-full';
                        const color = this.bindColor((feature.properties.point_count / this.allLocations.features.length).toFixed(2))
                        if (color === undefined) {
                            $innerBackground.style.backgroundColor = this.pastColors[4];
                        } else {
                            $innerBackground.style.backgroundColor = color;
                        }


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
                            'flex items-center justify-center w-10 h-10 rounded-full text-center text-lg text-white font-bold bg-cover cursor-pointer bg-center';
                        // // $feature.style.backgroundImage = `url(person.svg)`;
                        $feature.style.backgroundImage = `url(arrow.svg)`;
                        $feature.style.transform = `rotate(50deg)`;
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

                    new mapboxgl.Popup({offset: 30})
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
                    <h1>Long: ${feature.geometry.coordinates[0]}</h1>
                    <h1>Lat: ${feature.geometry.coordinates[0]}</h1>

                    <a  href="${profileRoute}"
                        target="_blank"
                        class="rounded font-bold bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 mt-4">
                        Meer info
                    </a>
                </div>
            `;
            },

            bindClusterClickEvent(el, feature) {
                el.addEventListener('click', e => {
                    e.stopPropagation();
                    var bounds = new mapboxgl.LngLatBounds();

                    var features = this.clusterIndex.getLeaves(feature.properties.cluster_id, 100);

                    features.forEach(function (feature) {
                        bounds.extend(feature.geometry.coordinates);
                    });

                    this.map.fitBounds(bounds, {padding: 100});
                });
            },

            bindColor(index) {
                if(this.timeInFuture) {
                    switch (true) {
                        case (index < 0.2):
                            return this.futureColors[0];
                        case (index < 0.4):
                            return this.futureColors[1];
                        case (index < 0.6):
                            return this.futureColors[2];
                        case (index < 0.8):
                            return this.futureColors[3];
                        case (index < 1.0):
                            return this.futureColors[4];
                    }
                }

                else {
                    switch (true) {
                        case (index < 0.2):
                            return this.pastColors[0];
                        case (index < 0.4):
                            return this.pastColors[1];
                        case (index < 0.6):
                            return this.pastColors[2];
                        case (index < 0.8):
                            return this.pastColors[3];
                        case (index < 1.0):
                            return this.pastColors[4];
                    }
                }
            }
        }
    };
</script>
