<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class HomeController
{
    /**
     * @return View
     */
    public function index()
    {
        return view('home');
    }

    /**
     * @return false|string
     */
    public function show()
    {
        return file_get_contents(storage_path('app/public/map.json'));
    }
}
