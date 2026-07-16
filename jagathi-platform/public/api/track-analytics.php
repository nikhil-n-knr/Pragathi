<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 1. Establish Database Connection & Initialize
$dbPath = __DIR__ . '/db/jagathi.sqlite';
if (!is_dir(__DIR__ . '/db')) {
    mkdir(__DIR__ . '/db', 0777, true);
    file_put_contents(__DIR__ . '/db/.htaccess', "Require all denied\n");
}

try {
    $db = new PDO("sqlite:$dbPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create page_views table
    $db->exec("CREATE TABLE IF NOT EXISTS page_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        url TEXT NOT NULL,
        referrer TEXT,
        screen_resolution TEXT,
        ip TEXT,
        user_agent TEXT,
        page_time REAL DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Create section_dwell table
    $db->exec("CREATE TABLE IF NOT EXISTS section_dwell (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        url TEXT NOT NULL,
        section_name TEXT NOT NULL,
        duration REAL DEFAULT 0,
        ip TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(session_id, url, section_name)
    )");
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    exit;
}

// 2. Parse input payload
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    // If browser sent request using URLencoded fallback or form
    $input = $_POST;
}

if (!$input || empty($input['session_id'])) {
    echo json_encode(['success' => false, 'message' => 'No tracking data received.']);
    exit;
}

$sessionId = $input['session_id'];
$url = $input['url'] ?? '/';
$referrer = $input['referrer'] ?? 'Direct';
$screenResolution = $input['screen_resolution'] ?? '';
$userAgent = $input['user_agent'] ?? $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
$pageTime = floatval($input['page_time'] ?? 0);
$sections = $input['sections'] ?? [];

$ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

try {
    // 3. Insert or Update page_views
    $checkView = $db->prepare("SELECT id FROM page_views WHERE session_id = ? AND url = ?");
    $checkView->execute([$sessionId, $url]);
    $view = $checkView->fetch(PDO::FETCH_ASSOC);

    if ($view) {
        // Update existing view time
        $updateView = $db->prepare("UPDATE page_views SET page_time = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $updateView->execute([$pageTime, $view['id']]);
    } else {
        // Insert new view
        $insertView = $db->prepare("INSERT INTO page_views (session_id, url, referrer, screen_resolution, ip, user_agent, page_time) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $insertView->execute([$sessionId, $url, $referrer, $screenResolution, $ip, $userAgent, $pageTime]);
    }

    // 4. Insert or Update section_dwell times
    if (is_array($sections)) {
        foreach ($sections as $sec) {
            $secName = $sec['name'] ?? '';
            $duration = floatval($sec['duration'] ?? 0);

            if (empty($secName)) continue;

            // Using SQLite INSERT OR REPLACE for unique constraint
            $upsertDwell = $db->prepare("INSERT INTO section_dwell (session_id, url, section_name, duration, ip, updated_at) 
                VALUES (:sid, :url, :sec, :dur, :ip, CURRENT_TIMESTAMP)
                ON CONFLICT(session_id, url, section_name) 
                DO UPDATE SET duration = :dur, updated_at = CURRENT_TIMESTAMP");
            
            $upsertDwell->execute([
                ':sid' => $sessionId,
                ':url' => $url,
                ':sec' => $secName,
                ':dur' => $duration,
                ':ip' => $ip
            ]);
        }
    }

    echo json_encode(['success' => true, 'message' => 'Telemetry logged successfully.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Failed logging telemetry: ' . $e->getMessage()]);
}
