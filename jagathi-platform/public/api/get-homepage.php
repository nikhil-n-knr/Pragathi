<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Default Homepage Content Payload
$defaultContent = [
    'title' => 'JAGATHI',
    'subtitle' => 'Built for Legacies',
    'description' => 'We engineer landmark infrastructure, develop high-yield land, and design flawless, turnkey interior spaces from A to Z.',
    'scrollLabel' => 'Scroll to explore'
];

echo json_encode($defaultContent, JSON_PRETTY_PRINT);
?>
