<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Open remote</title>

        <link href="{{ mix('css/app.css') }}" rel="stylesheet">
        <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.3.0/mapbox-gl.css' rel='stylesheet' />
        <link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.css' type='text/css' />
    </head>
    <body class="font-sans">
        <div class="flex h-screen w-full">
            <div class="flex items-center justify-center bg-gray-500 rounded text-white w-64">
                <h2 class="text-2xl">MENU</h2>
            </div>

            <div class="flex flex-col w-full px-12">
                <div class="flex justify-center items-center bg-gray-500 rounded text-white h-32 w-full">
                    <h2 class="text-2xl">MENU</h2>
                </div>

                <div class="flex w-full my-6">
                    <div class="flex items-center justify-center text-white w-1/3 rounded bg-gray-500 h-32">
                        STATISTIEK
                    </div>

                    <div class="flex items-center justify-center text-white mr-2 ml-2 rounded w-1/3 bg-gray-500 h-32">
                        STATISTIEK
                    </div>

                    <div class="flex items-center justify-center text-white w-1/3 rounded bg-gray-500 h-32">
                        STATISTIEK
                    </div>
                </div>

                <div class="flex items-center justify-center w-full rounded bg-gray-500 text-white py-2">
                    TIJDLIJN
                </div>

                <div class="h-full py-4" id="app">
                    <map-view></map-view>
                </div>
            </div>
        </div>
    </body>

    <!-- Js -->
    <script src="{{ mix('js/app.js') }}"></script>
</html>
