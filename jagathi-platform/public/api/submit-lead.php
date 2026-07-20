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
    // Create htaccess to deny direct access to database file
    file_put_contents(__DIR__ . '/db/.htaccess', "Require all denied\n");
}

try {
    $db = new PDO("sqlite:$dbPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec("PRAGMA journal_mode=WAL");
    
    // Create Leads table
    $db->exec("CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        pillar TEXT NOT NULL,
        message TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        geo_error TEXT,
        ip TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Shared analytics tables (created here so admin.php always has a valid DB)
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

// 2. Parse input data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid payload.']);
    exit;
}

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$pillar = trim($input['pillar'] ?? '');
$message = trim($input['message'] ?? '');
$location = $input['location'] ?? [];
$lat = $location['latitude'] ?? null;
$lng = $location['longitude'] ?? null;
$geo_error = $location['error'] ?? null;

if (empty($name) || empty($email) || empty($phone) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

// 3. Save to database
try {
    $stmt = $db->prepare("INSERT INTO leads (name, email, phone, pillar, message, latitude, longitude, geo_error, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $phone, $pillar, $message, $lat, $lng, $geo_error, $ip, $userAgent]);
    $leadId = $db->lastInsertId();
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to save lead: ' . $e->getMessage()]);
    exit;
}

// 4. Send Emails (Admin and Client)
$adminEmail = 'info@jagathi.co';

// Helper to save HTML file copy for local testing/preview
function saveEmailCopy($to, $subject, $html) {
    $dir = __DIR__ . '/sent_emails';
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
    $filename = $dir . '/' . time() . '_' . str_replace(['@', '.'], '_', $to) . '.html';
    $content = "<!-- TO: $to -->\n<!-- SUBJECT: $subject -->\n" . $html;
    file_put_contents($filename, $content);
}

// Style configuration (Jagathi Brand Style)
$style = "
    background-color: #0d0d0d;
    color: #f1f1f1;
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 40px 20px;
";

$cardStyle = "
    max-width: 600px;
    margin: 0 auto;
    background-color: #161616;
    border: 1px solid #FFEA0A;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
";

// Render Client Email
$clientHtml = "
<div style=\"$style\">
    <div style=\"$cardStyle\">
        <div style=\"text-align: center; margin-bottom: 30px;\">
            <h1 style=\"color: #FFEA0A; font-size: 28px; margin: 0; font-family: 'Syncopate', sans-serif; letter-spacing: 2px;\">JAGATHI</h1>
            <p style=\"color: #a0a0a0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin: 5px 0 0;\">Architectural Shaping & Legacy Building</p>
        </div>
        <div style=\"border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 20px;\">
            <p style=\"font-size: 16px; line-height: 1.6;\">Dear <strong>" . htmlspecialchars($name) . "</strong>,</p>
            <p style=\"font-size: 14px; line-height: 1.6; color: #d4d4d4;\">We have successfully registered your request for pillar integration. A strategic consultant from our advisory desk is reviewing your transmission brief.</p>
        </div>
        <div style=\"margin-bottom: 20px;\">
            <h3 style=\"color: #FFEA0A; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;\">Transmission Summary</h3>
            <table style=\"width: 100%; border-collapse: collapse; font-size: 13px; color: #d4d4d4;\">
                <tr>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222; font-weight: bold; width: 30%;\">Selected Pillar</td>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222;\">" . htmlspecialchars($pillar) . "</td>
                </tr>
                <tr>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222; font-weight: bold;\">Reference ID</td>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222;\">#JAG-" . sprintf("%06d", $leadId) . "</td>
                </tr>
            </table>
        </div>
        <div style=\"background-color: #222; padding: 15px; border-left: 3px solid #FFEA0A; margin-bottom: 30px;\">
            <h4 style=\"margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; color: #fff;\">Your Brief</h4>
            <p style=\"margin: 0; font-size: 13px; line-height: 1.5; color: #a0a0a0; font-style: italic;\">\"" . nl2br(htmlspecialchars($message)) . "\"</p>
        </div>
        <div style=\"margin-top: 30px; border-top: 1px solid #333; padding-top: 20px; font-size: 13px; color: #d4d4d4;\">
            <h3 style=\"color: #FFEA0A; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px;\">Contact Reference</h3>
            <p style=\"margin: 0 0 5px 0;\"><strong>Email:</strong> info@jagathi.co</p>
            <p style=\"margin: 0; line-height: 1.5;\"><strong>Address:</strong> 3rd Floor, VK Towers, above HDFC bank, Banashankari 2nd Stage, Banashankari, Bengaluru, Karnataka 560070</p>
        </div>
        <div style=\"text-align: center; border-top: 1px solid #222; padding-top: 20px; font-size: 11px; color: #888; margin-top: 30px;\">
            <p style=\"margin: 0;\">JAGATHI &middot; &copy; 2026 All rights reserved</p>
        </div>
    </div>
</div>
";

// Render Admin Email
$adminHtml = "
<div style=\"$style\">
    <div style=\"$cardStyle\">
        <div style=\"text-align: center; margin-bottom: 30px;\">
            <h1 style=\"color: #FFEA0A; font-size: 28px; margin: 0; font-family: 'Syncopate', sans-serif; letter-spacing: 2px;\">JAGATHI ADMIN</h1>
            <p style=\"color: #a0a0a0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin: 5px 0 0;\">New Lead Transmission Alert</p>
        </div>
        <div style=\"margin-bottom: 20px;\">
            <h3 style=\"color: #FFEA0A; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;\">Lead Information</h3>
            <table style=\"width: 100%; border-collapse: collapse; font-size: 13px; color: #d4d4d4;\">
                <tr>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222; font-weight: bold; width: 35%;\">Name</td>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222;\">" . htmlspecialchars($name) . "</td>
                </tr>
                <tr>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222; font-weight: bold;\">Email</td>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222;\">" . htmlspecialchars($email) . "</td>
                </tr>
                <tr>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222; font-weight: bold;\">Phone</td>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222;\">" . htmlspecialchars($phone) . "</td>
                </tr>
                <tr>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222; font-weight: bold;\">Pillar</td>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222;\">" . htmlspecialchars($pillar) . "</td>
                </tr>
                <tr>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222; font-weight: bold;\">IP Address</td>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222;\">" . htmlspecialchars($ip) . "</td>
                </tr>
                <tr>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222; font-weight: bold;\">Location Coords</td>
                    <td style=\"padding: 8px 0; border-bottom: 1px solid #222;\">" . ($lat && $lng ? "$lat, $lng" : "Not Provided (" . htmlspecialchars($geo_error) . ")") . "</td>
                </tr>
            </table>
        </div>
        <div style=\"background-color: #222; padding: 15px; border-left: 3px solid #FFEA0A; margin-bottom: 30px;\">
            <h4 style=\"margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; color: #fff;\">Transmission Brief</h4>
            <p style=\"margin: 0; font-size: 13px; line-height: 1.5; color: #d4d4d4;\">" . nl2br(htmlspecialchars($message)) . "</p>
        </div>
        <div style=\"text-align: center; border-top: 1px solid #333; padding-top: 20px; margin-bottom: 20px;\">
            <a href=\"http://" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "/api/admin.php\" style=\"background-color: #FFEA0A; color: #000; padding: 12px 25px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; border-radius: 4px;\">Open Admin Panel</a>
        </div>
        <div style=\"text-align: center; border-top: 1px solid #222; padding-top: 20px; font-size: 11px; color: #888;\">
            <p style=\"margin: 0;\">JAGATHI &middot; &copy; 2026 All rights reserved</p>
        </div>
    </div>
</div>
";

// Send via Resend API
function sendWithResend($to, $subject, $html) {
    $apiKey = 're_gG3oZhk7_xraU2WTu5MBLgKLCe5YamTfv';
    $from = 'Jagathi Platform <jagathi@pisparrow.com>';
    
    $payload = [
        'from' => $from,
        'to' => [$to],
        'bcc' => ['nikhil.infotec@gmail.com'],
        'subject' => $subject,
        'html' => $html
    ];
    
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return $httpCode === 200 || $httpCode === 201;
}

// Send client confirmation email
$clientSent = sendWithResend($email, "Transmission Acknowledged: #JAG-" . sprintf("%06d", $leadId), $clientHtml);
saveEmailCopy($email, "Transmission Acknowledged: #JAG-" . sprintf("%06d", $leadId), $clientHtml);

// Send admin notification email
$adminSent = sendWithResend($adminEmail, "ALERT: New Pillar Integration Request (#JAG-" . sprintf("%06d", $leadId) . ")", $adminHtml);
saveEmailCopy($adminEmail, "ALERT: New Pillar Integration Request (#JAG-" . sprintf("%06d", $leadId) . ")", $adminHtml);

echo json_encode(['success' => true, 'message' => 'Lead stored and emails transmitted successfully.', 'lead_id' => $leadId, 'resend_client' => $clientSent, 'resend_admin' => $adminSent]);
