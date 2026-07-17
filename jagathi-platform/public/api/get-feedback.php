<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

$dbPath = __DIR__ . '/db/jagathi.sqlite';

try {
    $db = new PDO("sqlite:$dbPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $db->query("SELECT * FROM feedbacks ORDER BY id DESC");
    $feedbacks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($feedbacks);
} catch (PDOException $e) {
    echo json_encode([]);
}
