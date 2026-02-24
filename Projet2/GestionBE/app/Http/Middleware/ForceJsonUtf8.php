<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceJsonUtf8
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        $contentType = $response->headers->get('Content-Type');

        if ($contentType && str_contains($contentType, 'application/json') && !str_contains(strtolower($contentType), 'charset')) {
            $response->headers->set('Content-Type', 'application/json; charset=UTF-8');
        }

        return $response;
    }
}
