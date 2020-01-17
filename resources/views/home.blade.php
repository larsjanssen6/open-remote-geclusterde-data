<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Open remote</title>

    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.3.0/mapbox-gl.css' rel='stylesheet'/>
    <link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.css'
          type='text/css'/>
</head>
<body class="font-sans">
<div id="app">
    <div class="flex h-screen w-full">
        <!-- <div class="flex items-center justify-center bg-blue-900 text-white w-32">
            <h2 class="text-2xl">MENU</h2>
        </div> -->

        <div class="flex flex-col w-full">

            <div class="flex justify-start items-center text-white h-12 w-full">
                <filter-view></filter-view>
            </div>

            <div class="h-full">
                <map-view></map-view>
            </div>
        </div>
    </div>
</div>
</body>

<!-- Js -->
<script src="{{ mix('js/app.js') }}"></script>
</html>
