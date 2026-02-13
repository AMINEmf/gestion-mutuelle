<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$doc = \App\Models\MutuelleDocument::latest()->first();
if ($doc) {
    echo "ID: " . $doc->id . "\n";
    echo "Path: " . $doc->file_path . "\n";
    echo "URL attribute: " . $doc->url . "\n";
} else {
    echo "No documents found.\n";
}
