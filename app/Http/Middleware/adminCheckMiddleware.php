<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class adminCheckMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        //dd(Auth::user()->role);

        //dd(Auth::user());
        if (Auth::check() && Auth::user()->role == 'admin'){
             return $next($request); 
        }
        return redirect()->route('login')->with('error', 'You are not auttorized to accessthis page');
    }
}
