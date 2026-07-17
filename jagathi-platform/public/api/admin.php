<?php
session_start();

// ── Configuration ────────────────────────────────────────────────────────────
$dbPath       = __DIR__ . '/db/jagathi.sqlite';
$adminPassword = 'jagathiadmin2026'; // Change before production deployment

// ── Auth: Logout ─────────────────────────────────────────────────────────────
if (isset($_GET['logout'])) {
    session_unset();
    session_destroy();
    header('Location: admin.php');
    exit;
}

// ── Auth: Login attempt ───────────────────────────────────────────────────────
if (isset($_POST['password'])) {
    if ($_POST['password'] === $adminPassword) {
        $_SESSION['jagathi_auth'] = true;
        header('Location: admin.php');
        exit;
    } else {
        $loginError = 'INVALID ACCESS KEY';
    }
}

$isAuthed = !empty($_SESSION['jagathi_auth']);

// ── Database: Connect + init all tables ──────────────────────────────────────
$db = null;
$dbReady = false;
try {
    if (!is_dir(__DIR__ . '/db')) {
        mkdir(__DIR__ . '/db', 0777, true);
        file_put_contents(__DIR__ . '/db/.htaccess', "Require all denied\n");
    }
    $db = new PDO("sqlite:$dbPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec("PRAGMA journal_mode=WAL");

    // Leads table
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

    // Page views table
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

    // Section dwell table
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

    // Projects table
    $db->exec("CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        sector TEXT NOT NULL,
        spec TEXT NOT NULL,
        year TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Feedbacks table
    $db->exec("CREATE TABLE IF NOT EXISTS feedbacks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quote TEXT NOT NULL,
        author TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Default project seed
    $pCount = $db->query("SELECT COUNT(*) FROM projects")->fetchColumn();
    if ($pCount == 0) {
        $initialProjects = [
            ['Orion Link Bridge', 'Civic Infrastructure', 'Cable-stayed steel arc', '2026'],
            ['Silicon Arc Tower', 'Commercial Office', 'Core shear wall core', '2025'],
            ['Cogen Industrial Complex', 'Industrial Plant', 'Vibration isolated vaults', '2025'],
            ['Jayanagar Hub', 'Urban Commercial', 'Reinforced concrete frame', '2024'],
            ['Calicut Estate', 'High-End Residential', 'Architectural structural frame', '2024'],
            ['Kochi Marine Terminal', 'Marine Infrastructure', 'Hydrostatic-tested piles', '2023']
        ];
        $stmt = $db->prepare("INSERT INTO projects (name, sector, spec, year) VALUES (?, ?, ?, ?)");
        foreach ($initialProjects as $ip) {
            $stmt->execute($ip);
        }
    }

    // Default feedback seed
    $fCount = $db->query("SELECT COUNT(*) FROM feedbacks")->fetchColumn();
    if ($fCount == 0) {
        $initialFeedbacks = [
            [
                'Jagathi delivered more than structural compliance. They gave our whole organization a clearer way to build for scale.',
                'Infrastructure Partner',
                'Urban Development Group'
            ]
        ];
        $stmt = $db->prepare("INSERT INTO feedbacks (quote, author, role) VALUES (?, ?, ?)");
        foreach ($initialFeedbacks as $if) {
            $stmt->execute($if);
        }
    }

    $dbReady = true;
} catch (PDOException $e) {
    $dbErr = $e->getMessage();
}

// ── CSV Export: Leads ─────────────────────────────────────────────────────────
if ($isAuthed && isset($_GET['export']) && $_GET['export'] === 'leads' && $dbReady) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=jagathi_leads_' . date('Y-m-d') . '.csv');
    $out = fopen('php://output', 'w');
    fputcsv($out, ['ID', 'Name', 'Email', 'Phone', 'Pillar', 'Message', 'Latitude', 'Longitude', 'IP', 'User Agent', 'Submitted At']);
    $stmt = $db->query("SELECT * FROM leads ORDER BY id DESC");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        fputcsv($out, [$row['id'], $row['name'], $row['email'], $row['phone'], $row['pillar'], $row['message'], $row['latitude'], $row['longitude'], $row['ip'], $row['user_agent'], $row['created_at']]);
    }
    fclose($out);
    exit;
}

// ── CSV Export: Analytics sessions ───────────────────────────────────────────
if ($isAuthed && isset($_GET['export']) && $_GET['export'] === 'analytics' && $dbReady) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=jagathi_analytics_' . date('Y-m-d') . '.csv');
    $out = fopen('php://output', 'w');
    fputcsv($out, ['Session ID', 'URL', 'Referrer', 'Screen', 'IP', 'Page Dwell (s)', 'Last Updated']);
    $stmt = $db->query("SELECT * FROM page_views ORDER BY updated_at DESC");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        fputcsv($out, [$row['session_id'], $row['url'], $row['referrer'], $row['screen_resolution'], $row['ip'], $row['page_time'], $row['updated_at']]);
    }
    fclose($out);
    exit;
}

// ── Admin Action: Projects ───────────────────────────────────────────────────
if ($isAuthed && isset($_POST['action']) && $_POST['action'] === 'add_project' && $dbReady) {
    $name = $_POST['name'] ?? '';
    $sector = $_POST['sector'] ?? '';
    $spec = $_POST['spec'] ?? '';
    $year = $_POST['year'] ?? '';
    if ($name && $sector && $spec && $year) {
        $stmt = $db->prepare("INSERT INTO projects (name, sector, spec, year) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $sector, $spec, $year]);
    }
    header('Location: admin.php');
    exit;
}

if ($isAuthed && isset($_GET['delete_project']) && $dbReady) {
    $id = (int) $_GET['delete_project'];
    $stmt = $db->prepare("DELETE FROM projects WHERE id = ?");
    $stmt->execute([$id]);
    header('Location: admin.php');
    exit;
}

// ── Admin Action: Feedback ───────────────────────────────────────────────────
if ($isAuthed && isset($_POST['action']) && $_POST['action'] === 'add_feedback' && $dbReady) {
    $quote = $_POST['quote'] ?? '';
    $author = $_POST['author'] ?? '';
    $role = $_POST['role'] ?? '';
    if ($quote && $author && $role) {
        $stmt = $db->prepare("INSERT INTO feedbacks (quote, author, role) VALUES (?, ?, ?)");
        $stmt->execute([$quote, $author, $role]);
    }
    header('Location: admin.php');
    exit;
}

if ($isAuthed && isset($_GET['delete_feedback']) && $dbReady) {
    $id = (int) $_GET['delete_feedback'];
    $stmt = $db->prepare("DELETE FROM feedbacks WHERE id = ?");
    $stmt->execute([$id]);
    header('Location: admin.php');
    exit;
}

// ── Fetch dashboard stats ─────────────────────────────────────────────────────
$stats = ['leads' => 0, 'sessions' => 0, 'pageViews' => 0, 'avgDwell' => 0, 'topSection' => '–'];
if ($isAuthed && $dbReady) {
    $stats['leads']      = (int) $db->query("SELECT COUNT(*) FROM leads")->fetchColumn();
    $stats['sessions']   = (int) $db->query("SELECT COUNT(DISTINCT session_id) FROM page_views")->fetchColumn();
    $stats['pageViews']  = (int) $db->query("SELECT COUNT(*) FROM page_views")->fetchColumn();
    $avg = $db->query("SELECT AVG(page_time) FROM page_views")->fetchColumn();
    $stats['avgDwell']   = round((float)$avg, 1);
    $top = $db->query("SELECT section_name FROM section_dwell GROUP BY section_name ORDER BY AVG(duration) DESC LIMIT 1")->fetchColumn();
    $stats['topSection'] = $top ?: '–';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JAGATHI | Intelligence & Control Center</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&family=Syncopate:wght@700&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --yellow: #FFEA0A;
            --yellow-dim: #e5d200;
            --bg: #0a0a0a;
            --surface: #131313;
            --surface2: #1a1a1a;
            --border: #242424;
            --text: #f0f0f0;
            --muted: #888;
            --green: #22c55e;
            --red: #ef4444;
        }

        body {
            background: var(--bg);
            color: var(--text);
            font-family: 'Outfit', sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
        }

        .brand { font-family: 'Syncopate', sans-serif; text-transform: uppercase; letter-spacing: .1em; }

        /* ──── LOGIN ──── */
        .login-wrap {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: radial-gradient(ellipse at 60% 40%, rgba(255,234,10,.04) 0%, transparent 60%);
        }

        .login-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-top: 3px solid var(--yellow);
            padding: 48px 40px;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 30px 80px rgba(0,0,0,.6);
        }

        .login-logo { color: var(--yellow); font-size: 22px; margin-bottom: 6px; }
        .login-sub  { font-size: 10px; text-transform: uppercase; letter-spacing: 2.5px; color: var(--muted); margin-bottom: 36px; }

        .login-input {
            width: 100%;
            background: var(--surface2);
            border: 1px solid var(--border);
            color: #fff;
            padding: 16px 20px;
            font-size: 14px;
            letter-spacing: .15em;
            outline: none;
            margin-bottom: 16px;
            transition: border-color .2s;
            font-family: 'Outfit', sans-serif;
        }
        .login-input:focus { border-color: var(--yellow); }

        .login-btn {
            width: 100%;
            background: var(--yellow);
            color: #000;
            border: none;
            padding: 16px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 12px;
            cursor: pointer;
            transition: background .2s;
            font-family: 'Syncopate', sans-serif;
        }
        .login-btn:hover { background: var(--yellow-dim); }
        .login-error { color: var(--red); font-size: 11px; letter-spacing: 1px; margin-bottom: 16px; text-transform: uppercase; }

        /* ──── ADMIN LAYOUT ──── */
        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px 32px;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .admin-header-logo { color: var(--yellow); font-size: 16px; }
        .admin-header-logo span { color: var(--muted); font-size: 11px; font-family: 'Outfit', sans-serif; font-weight: 300; margin-left: 10px; }

        .logout-btn {
            color: var(--muted);
            text-decoration: none;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            border: 1px solid var(--border);
            padding: 8px 16px;
            border-radius: 3px;
            transition: all .2s;
        }
        .logout-btn:hover { border-color: var(--yellow); color: #fff; }

        .admin-body { display: flex; min-height: calc(100vh - 61px); }

        /* ──── SIDEBAR ──── */
        .sidebar {
            width: 220px;
            background: var(--surface);
            border-right: 1px solid var(--border);
            padding: 24px 12px;
            flex-shrink: 0;
        }

        .nav-btn {
            display: block;
            width: 100%;
            background: none;
            border: none;
            color: var(--muted);
            text-align: left;
            padding: 12px 16px;
            margin-bottom: 4px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            cursor: pointer;
            transition: all .2s;
            border-radius: 4px;
            font-family: 'Syncopate', sans-serif;
        }
        .nav-btn:hover { background: var(--surface2); color: #fff; }
        .nav-btn.active { background: var(--surface2); color: var(--yellow); border-left: 3px solid var(--yellow); padding-left: 13px; }

        /* ──── WORKSPACE ──── */
        .workspace { flex: 1; padding: 36px 40px; overflow-y: auto; max-width: 1400px; }

        .panel { display: none; }
        .panel.active { display: block; }

        .panel-title {
            font-size: 15px;
            margin-bottom: 28px;
            padding-left: 14px;
            border-left: 3px solid var(--yellow);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'Syncopate', sans-serif;
            text-transform: uppercase;
            letter-spacing: .08em;
        }

        /* ──── STATS GRID ──── */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 18px;
            margin-bottom: 40px;
        }

        .stat-card {
            background: var(--surface);
            border: 1px solid var(--border);
            padding: 24px;
            border-radius: 6px;
            position: relative;
            overflow: hidden;
        }
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 2px;
            background: var(--yellow);
        }
        .stat-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); margin-bottom: 10px; }
        .stat-value { font-size: 34px; font-weight: 900; color: #fff; line-height: 1; }
        .stat-sub   { font-size: 10px; color: var(--muted); margin-top: 6px; }

        /* ──── TABLES ──── */
        .table-wrap {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 6px;
            overflow-x: auto;
            margin-bottom: 28px;
        }

        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th {
            background: var(--surface2);
            color: var(--yellow);
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 14px 20px;
            border-bottom: 1px solid var(--border);
            white-space: nowrap;
            font-family: 'Syncopate', sans-serif;
        }
        td { padding: 14px 20px; border-bottom: 1px solid var(--border); color: #ccc; vertical-align: top; line-height: 1.5; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,234,10,.015); color: #fff; }

        .pill {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 30px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .5px;
        }
        .pill-green { background: rgba(34,197,94,.12); color: var(--green); }
        .pill-yellow { background: rgba(255,234,10,.1); color: var(--yellow); }
        .pill-red   { background: rgba(239,68,68,.12); color: var(--red); }
        .pill-gray  { background: rgba(136,136,136,.12); color: var(--muted); }

        .map-link {
            display: inline-block;
            background: rgba(255,234,10,.1);
            color: var(--yellow);
            text-decoration: none;
            padding: 4px 10px;
            font-size: 10px;
            font-weight: 700;
            border-radius: 3px;
            text-transform: uppercase;
            letter-spacing: .5px;
            white-space: nowrap;
        }
        .map-link:hover { background: var(--yellow); color: #000; }

        /* ──── BUTTONS ──── */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: var(--yellow);
            color: #000;
            padding: 10px 20px;
            border: none;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            transition: background .2s;
            font-family: 'Syncopate', sans-serif;
        }
        .btn:hover { background: var(--yellow-dim); }
        .btn-outline {
            background: transparent;
            color: var(--yellow);
            border: 1px solid var(--yellow);
            margin-left: 10px;
        }
        .btn-outline:hover { background: rgba(255,234,10,.08); }

        /* ──── SECTION BAR CHART ──── */
        .bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .bar-label { font-size: 11px; color: var(--muted); width: 200px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .bar-track { flex: 1; height: 8px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
        .bar-fill  { height: 100%; background: var(--yellow); border-radius: 4px; transition: width .6s ease; }
        .bar-val   { font-size: 11px; color: #fff; font-weight: 600; width: 50px; text-align: right; flex-shrink: 0; }

        /* ──── ALGO CARDS ──── */
        .algo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 4px; }
        .algo-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-top: 3px solid var(--yellow);
            padding: 24px;
            border-radius: 6px;
        }
        .algo-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--yellow); margin-bottom: 8px; font-family: 'Syncopate', sans-serif; }
        .algo-desc  { font-size: 12px; color: var(--muted); line-height: 1.7; margin-bottom: 16px; }
        .algo-output {
            background: #000;
            border: 1px solid var(--border);
            padding: 14px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #a8e6a3;
            line-height: 1.8;
            max-height: 220px;
            overflow-y: auto;
        }
        .algo-output .dim  { color: var(--muted); }
        .algo-output .warn { color: #fbbf24; }
        .algo-output .err  { color: var(--red); }

        /* ──── IP GEO ROWS ──── */
        .geo-status { font-size: 11px; color: var(--muted); font-style: italic; }

        /* ──── EMPTY STATE ──── */
        .empty-state { text-align: center; padding: 60px 20px; color: var(--muted); font-size: 13px; }
        .empty-state strong { display: block; font-size: 28px; margin-bottom: 8px; color: var(--border); }

        @media (max-width: 900px) {
            .algo-grid { grid-template-columns: 1fr; }
            .admin-body { flex-direction: column; }
            .sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 4px; padding: 12px; }
            .nav-btn { width: auto; flex-shrink: 0; }
        }
    </style>
</head>
<body>

<?php if (!$isAuthed): ?>
<!-- ═══════════════ LOGIN PAGE ═══════════════ -->
<div class="login-wrap">
    <div class="login-card">
        <div class="brand login-logo">JAGATHI</div>
        <div class="login-sub">Intelligence & Control Center</div>

        <?php if (!empty($loginError)): ?>
            <div class="login-error"><?= htmlspecialchars($loginError) ?></div>
        <?php endif; ?>

        <form method="POST" action="admin.php">
            <input
                type="password"
                name="password"
                class="login-input"
                placeholder="ACCESS KEY"
                required
                autocomplete="current-password"
            >
            <button type="submit" class="login-btn">Authenticate</button>
        </form>
    </div>
</div>

<?php else: ?>
<!-- ═══════════════ ADMIN DASHBOARD ═══════════════ -->

<header class="admin-header">
    <div class="brand admin-header-logo">
        JAGATHI<span>// Analytics Desk</span>
    </div>
    <a href="admin.php?logout=1" class="logout-btn">Secure Logout</a>
</header>

<div class="admin-body">
    <aside class="sidebar">
        <button class="nav-btn active" onclick="showPanel(event,'dashboard')">Dashboard</button>
        <button class="nav-btn" onclick="showPanel(event,'leads')">Leads Desk</button>
        <button class="nav-btn" onclick="showPanel(event,'sessions')">User Sessions</button>
        <button class="nav-btn" onclick="showPanel(event,'sections')">Section Dwell</button>
        <button class="nav-btn" onclick="showPanel(event,'ips')">IP Analysis</button>
        <button class="nav-btn" onclick="showPanel(event,'predictions')">Predictions</button>
        <button class="nav-btn" onclick="showPanel(event,'projects')">Projects Desk</button>
        <button class="nav-btn" onclick="showPanel(event,'feedback')">Feedback Desk</button>
    </aside>

    <div class="workspace">

        <?php if (!$dbReady): ?>
            <div class="empty-state">
                <strong>⚠</strong>
                Database connection failed.<br>
                <?= htmlspecialchars($dbErr ?? 'Unknown error') ?>
            </div>
        <?php else: ?>

        <!-- ══════ PANEL: DASHBOARD ══════ -->
        <div id="dashboard" class="panel active">
            <div class="panel-title">System Overview</div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Leads</div>
                    <div class="stat-value"><?= $stats['leads'] ?></div>
                    <div class="stat-sub">Contact form submissions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Unique Visitors</div>
                    <div class="stat-value"><?= $stats['sessions'] ?></div>
                    <div class="stat-sub">Distinct session identifiers</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Page Telemetries</div>
                    <div class="stat-value"><?= $stats['pageViews'] ?></div>
                    <div class="stat-sub">Tracked page-url pairs</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Avg Dwell</div>
                    <div class="stat-value"><?= $stats['avgDwell'] ?>s</div>
                    <div class="stat-sub">Mean time on any page</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Top Section</div>
                    <div class="stat-value" style="font-size:18px; word-break: break-all;"><?= htmlspecialchars($stats['topSection']) ?></div>
                    <div class="stat-sub">Highest average attention dwell</div>
                </div>
            </div>

            <!-- Section bar chart -->
            <div class="panel-title" style="margin-bottom:20px; font-size:12px;">Section Attention Leaderboard</div>
            <?php
            $sections = $db->query("SELECT section_name, ROUND(AVG(duration),1) as avg_d, COUNT(*) as cnt FROM section_dwell GROUP BY section_name ORDER BY avg_d DESC LIMIT 10")->fetchAll(PDO::FETCH_ASSOC);
            $maxD = !empty($sections) ? max(array_column($sections,'avg_d')) : 1;
            if (empty($sections)): ?>
                <div class="empty-state"><strong>–</strong>No section attention data yet. Browse the site to generate tracking data.</div>
            <?php else: foreach ($sections as $s): $pct = $maxD > 0 ? ($s['avg_d'] / $maxD) * 100 : 0; ?>
                <div class="bar-row">
                    <span class="bar-label"><?= htmlspecialchars($s['section_name']) ?></span>
                    <div class="bar-track"><div class="bar-fill" style="width:<?= $pct ?>%"></div></div>
                    <span class="bar-val"><?= $s['avg_d'] ?>s</span>
                </div>
            <?php endforeach; endif; ?>
        </div>

        <!-- ══════ PANEL: LEADS ══════ -->
        <div id="leads" class="panel">
            <div class="panel-title">
                Transmitted Leads
                <a href="admin.php?export=leads" class="btn">⬇ Export CSV</a>
            </div>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Ref</th>
                            <th>Client</th>
                            <th>Contact</th>
                            <th>Pillar</th>
                            <th>Brief</th>
                            <th>Geolocation</th>
                            <th>IP</th>
                            <th>Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                    $leads = $db->query("SELECT * FROM leads ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
                    if (empty($leads)): ?>
                        <tr><td colspan="8" class="empty-state"><strong>–</strong>No leads submitted yet.</td></tr>
                    <?php else: foreach ($leads as $l): ?>
                        <tr>
                            <td><span class="pill pill-yellow">#JAG-<?= sprintf('%06d', $l['id']) ?></span></td>
                            <td><strong><?= htmlspecialchars($l['name']) ?></strong></td>
                            <td><?= htmlspecialchars($l['email']) ?><br><span style="color:var(--muted);font-size:11px"><?= htmlspecialchars($l['phone']) ?></span></td>
                            <td><span class="pill pill-gray"><?= htmlspecialchars($l['pillar']) ?></span></td>
                            <td style="max-width:260px; font-size:12px; font-style:italic; color:#aaa;">"<?= htmlspecialchars(mb_strimwidth($l['message'], 0, 100, '…')) ?>"</td>
                            <td>
                                <?php if ($l['latitude'] && $l['longitude']): ?>
                                    <a class="map-link" href="https://maps.google.com/?q=<?= $l['latitude'] ?>,<?= $l['longitude'] ?>" target="_blank">
                                        📍 Map (<?= round($l['latitude'],3) ?>, <?= round($l['longitude'],3) ?>)
                                    </a>
                                <?php else: ?>
                                    <span style="color:var(--muted); font-size:11px;">No consent (<?= htmlspecialchars($l['geo_error'] ?? '—') ?>)</span>
                                <?php endif; ?>
                            </td>
                            <td style="font-size:11px; font-family:monospace;"><?= htmlspecialchars($l['ip']) ?></td>
                            <td style="font-size:11px; white-space:nowrap;"><?= htmlspecialchars($l['created_at']) ?></td>
                        </tr>
                    <?php endforeach; endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ══════ PANEL: SESSIONS ══════ -->
        <div id="sessions" class="panel">
            <div class="panel-title">
                User Sessions & Page Dwell
                <a href="admin.php?export=analytics" class="btn">⬇ Export CSV</a>
            </div>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Session ID</th>
                            <th>Page URL</th>
                            <th>Dwell (s)</th>
                            <th>Referrer</th>
                            <th>Screen</th>
                            <th>IP</th>
                            <th>Last Seen</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                    $views = $db->query("SELECT * FROM page_views ORDER BY updated_at DESC LIMIT 100")->fetchAll(PDO::FETCH_ASSOC);
                    if (empty($views)): ?>
                        <tr><td colspan="7" class="empty-state"><strong>–</strong>No session data. Browse the site to trigger tracking.</td></tr>
                    <?php else: foreach ($views as $v):
                        $dwellColor = $v['page_time'] >= 30 ? 'var(--green)' : ($v['page_time'] >= 10 ? 'var(--yellow)' : 'var(--red)');
                    ?>
                        <tr>
                            <td style="font-family:monospace; font-size:10px; color:var(--muted);"><?= htmlspecialchars(substr($v['session_id'], 0, 22)) ?>…</td>
                            <td style="font-size:11px;"><?= htmlspecialchars($v['url']) ?></td>
                            <td><strong style="color:<?= $dwellColor ?>;"><?= $v['page_time'] ?>s</strong></td>
                            <td style="font-size:11px; color:var(--muted);"><?= htmlspecialchars($v['referrer'] ?: '—') ?></td>
                            <td style="font-size:11px;"><?= htmlspecialchars($v['screen_resolution'] ?: '—') ?></td>
                            <td style="font-family:monospace; font-size:11px;"><?= htmlspecialchars($v['ip']) ?></td>
                            <td style="font-size:11px; white-space:nowrap;"><?= htmlspecialchars($v['updated_at']) ?></td>
                        </tr>
                    <?php endforeach; endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ══════ PANEL: SECTION DWELL ══════ -->
        <div id="sections" class="panel">
            <div class="panel-title">Section-Level Attention Tracking</div>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Section Name</th>
                            <th>Page URL</th>
                            <th>Session (short)</th>
                            <th>Attention Dwell</th>
                            <th>IP</th>
                            <th>Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                    $dwells = $db->query("SELECT * FROM section_dwell ORDER BY duration DESC LIMIT 200")->fetchAll(PDO::FETCH_ASSOC);
                    if (empty($dwells)): ?>
                        <tr><td colspan="6" class="empty-state"><strong>–</strong>No section dwell data yet. Sections are tracked as users scroll the site.</td></tr>
                    <?php else: foreach ($dwells as $d):
                        $dwColor = $d['duration'] >= 15 ? 'var(--green)' : ($d['duration'] >= 5 ? 'var(--yellow)' : 'var(--muted)');
                    ?>
                        <tr>
                            <td><strong style="font-size:12px;"><?= htmlspecialchars($d['section_name']) ?></strong></td>
                            <td style="font-size:11px;"><?= htmlspecialchars($d['url']) ?></td>
                            <td style="font-size:10px; font-family:monospace; color:var(--muted);"><?= htmlspecialchars(substr($d['session_id'], 0, 16)) ?>…</td>
                            <td><strong style="color:<?= $dwColor ?>;"><?= $d['duration'] ?>s</strong></td>
                            <td style="font-family:monospace; font-size:11px;"><?= htmlspecialchars($d['ip']) ?></td>
                            <td style="font-size:11px; white-space:nowrap;"><?= htmlspecialchars($d['updated_at']) ?></td>
                        </tr>
                    <?php endforeach; endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ══════ PANEL: IP ANALYSIS ══════ -->
        <div id="ips" class="panel">
            <div class="panel-title">IP Grouping & Visitor Intelligence</div>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>IP Address</th>
                            <th>Total Visits</th>
                            <th>Unique Pages</th>
                            <th>Leads Submitted</th>
                            <th>Avg Dwell</th>
                            <th>Geolocation</th>
                            <th>Designation</th>
                        </tr>
                    </thead>
                    <tbody id="ip-table-body">
                    <?php
                    $ips = $db->query("
                        SELECT
                            pv.ip,
                            COUNT(pv.id) AS visits,
                            COUNT(DISTINCT pv.url) AS unique_urls,
                            ROUND(AVG(pv.page_time),1) AS avg_dwell,
                            (SELECT COUNT(*) FROM leads l WHERE l.ip = pv.ip) AS lead_count
                        FROM page_views pv
                        GROUP BY pv.ip
                        ORDER BY visits DESC
                    ")->fetchAll(PDO::FETCH_ASSOC);

                    if (empty($ips)): ?>
                        <tr><td colspan="7" class="empty-state"><strong>–</strong>No visitor IP data yet.</td></tr>
                    <?php else: foreach ($ips as $ip):
                        $designation = $ip['lead_count'] > 0 ? '<span class="pill pill-green">Strategic Lead</span>' : '<span class="pill pill-gray">Explorer</span>';
                        if ($ip['visits'] >= 5) $designation = '<span class="pill pill-yellow">Returning</span>' . ($ip['lead_count'] ? ' ' . $designation : '');
                        $safeIpId = str_replace(['.', ':'], '_', $ip['ip']);
                    ?>
                        <tr>
                            <td style="font-family:monospace; font-weight:700;"><?= htmlspecialchars($ip['ip']) ?></td>
                            <td><?= $ip['visits'] ?></td>
                            <td><?= $ip['unique_urls'] ?></td>
                            <td><?= $ip['lead_count'] ?></td>
                            <td style="color:<?= $ip['avg_dwell'] >= 15 ? 'var(--green)' : ($ip['avg_dwell'] >= 5 ? 'var(--yellow)' : 'var(--muted)') ?>;"><?= $ip['avg_dwell'] ?>s</td>
                            <td><span class="geo-status" id="geo-<?= $safeIpId ?>">Resolving…</span></td>
                            <td><?= $designation ?></td>
                        </tr>
                    <?php endforeach; endif; ?>
                    </tbody>
                </table>
            </div>

            <script>
            // Client-side IP geo lookup (free tier, 1000/day)
            document.addEventListener('DOMContentLoaded', () => {
                const ips = [
                    <?php
                    foreach ($ips as $ip) {
                        $raw = $ip['ip'];
                        if ($raw && $raw !== 'Unknown') {
                            echo json_encode($raw) . ',';
                        }
                    }
                    ?>
                ];

                const isPrivate = ip => /^(127\.|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.|::1$|localhost)/.test(ip);

                ips.forEach(ip => {
                    const id = 'geo-' + ip.replace(/[.:]/g, '_');
                    const el = document.getElementById(id);
                    if (!el) return;

                    if (isPrivate(ip)) {
                        el.textContent = '💻 Local / Private Network';
                        return;
                    }

                    fetch('https://ipapi.co/' + ip + '/json/')
                        .then(r => r.json())
                        .then(d => {
                            if (d.city) {
                                el.innerHTML = '📍 ' + d.city + ', ' + d.country_name + ' · ' + (d.org || '—');
                            } else if (d.error) {
                                el.textContent = '⚠ ' + d.reason;
                            } else {
                                el.textContent = '⚠ Unknown';
                            }
                        })
                        .catch(() => { el.textContent = '⚠ API unavailable'; });
                });
            });
            </script>
        </div>

        <!-- ══════ PANEL: PREDICTIONS ══════ -->
        <div id="predictions" class="panel">
            <div class="panel-title">Predictive Analytics Engine</div>

            <div class="algo-grid">

                <!-- Algo 1: Markov Chain Page Transitions -->
                <div class="algo-card">
                    <div class="algo-title">Markov Chain — Page Transition Matrix</div>
                    <div class="algo-desc">
                        Computes P(Next Page | Current Page) = transitions(A→B) / total_exits(A).
                        Predicts where visitors go after each page.
                    </div>
                    <div class="algo-output">
<?php
$views_data = $db->query("SELECT session_id, url, updated_at FROM page_views ORDER BY session_id, updated_at ASC")->fetchAll(PDO::FETCH_ASSOC);
$transitions = [];
$totals = [];
$prev_sid = null;
$prev_url = null;

foreach ($views_data as $row) {
    $sid = $row['session_id'];
    $url = $row['url'];
    if ($sid === $prev_sid && $url !== $prev_url) {
        $transitions[$prev_url][$url] = ($transitions[$prev_url][$url] ?? 0) + 1;
        $totals[$prev_url] = ($totals[$prev_url] ?? 0) + 1;
    }
    $prev_sid = $sid;
    $prev_url = $url;
}

if (empty($transitions)) {
    echo '<span class="dim">// No multi-page session data yet.</span>';
} else {
    foreach ($transitions as $from => $tos) {
        arsort($tos);
        foreach ($tos as $to => $count) {
            $prob = round(($count / $totals[$from]) * 100, 1);
            $color = $prob >= 60 ? '#22c55e' : ($prob >= 30 ? '#FFEA0A' : '#888');
            echo htmlspecialchars($from) . " ──▶ " . htmlspecialchars($to) . " ";
            echo "<span style='color:$color;'>p=" . $prob . "%</span>";
            echo " <span class='dim'>(N=" . $count . ")</span>\n";
        }
        echo "\n";
    }
}
?>
                    </div>
                </div>

                <!-- Algo 2: Drop-off Churn Prediction -->
                <div class="algo-card">
                    <div class="algo-title">Drop-off Churn Risk Per Section</div>
                    <div class="algo-desc">
                        Risk = users spending &lt;5s / total users on that section.
                        High risk sections need UX improvements or stronger content hooks.
                    </div>
                    <div class="algo-output">
<?php
$churn_data = $db->query("
    SELECT
        section_name,
        COUNT(CASE WHEN duration < 5 THEN 1 END) AS low_dwell,
        COUNT(*) AS total,
        ROUND(AVG(duration),1) AS avg_dwell
    FROM section_dwell
    GROUP BY section_name
    ORDER BY (CAST(COUNT(CASE WHEN duration < 5 THEN 1 END) AS REAL) / COUNT(*)) DESC
")->fetchAll(PDO::FETCH_ASSOC);

if (empty($churn_data)) {
    echo '<span class="dim">// No section data yet.</span>';
} else {
    foreach ($churn_data as $c) {
        $rate = $c['total'] > 0 ? round(($c['low_dwell'] / $c['total']) * 100, 1) : 0;
        $risk = $rate >= 60 ? 'CRITICAL' : ($rate >= 35 ? 'MODERATE' : 'STABLE');
        $rcolor = $rate >= 60 ? '#ef4444' : ($rate >= 35 ? '#fbbf24' : '#22c55e');
        echo htmlspecialchars($c['section_name']) . "\n";
        echo "  Churn Risk: <span style='color:$rcolor;'>$rate% [$risk]</span>  Avg: " . $c['avg_dwell'] . "s  Samples: " . $c['total'] . "\n\n";
    }
}
?>
                    </div>
                </div>

                <!-- Algo 3: Layout Recommendations -->
                <div class="algo-card">
                    <div class="algo-title">Layout Recommendation Engine</div>
                    <div class="algo-desc">
                        Scores each section using a weighted formula:
                        Score = (avg_dwell × 0.6) + (impression_count × 0.4).
                        Sections with low scores should be re-positioned or enriched.
                    </div>
                    <div class="algo-output">
<?php
$layout_data = $db->query("
    SELECT
        section_name,
        ROUND(AVG(duration),2) AS avg_d,
        COUNT(*) AS impressions
    FROM section_dwell
    GROUP BY section_name
")->fetchAll(PDO::FETCH_ASSOC);

if (empty($layout_data)) {
    echo '<span class="dim">// Awaiting section telemetry data.</span>';
} else {
    $scored = array_map(function($s) {
        $score = ($s['avg_d'] * 0.6) + ($s['impressions'] * 0.4);
        return array_merge($s, ['score' => round($score, 2)]);
    }, $layout_data);
    usort($scored, fn($a, $b) => $b['score'] <=> $a['score']);

    echo "<span class='dim'>// Sections ranked by engagement score (higher = better):\n</span>";
    foreach ($scored as $s) {
        $scolor = $s['score'] >= 15 ? '#22c55e' : ($s['score'] >= 5 ? '#FFEA0A' : '#ef4444');
        echo "#" . str_pad(htmlspecialchars($s['section_name']), 32) . " score=<span style='color:$scolor;'>" . $s['score'] . "</span>\n";
    }
    echo "\n<span class='dim'>// Recommendation:\n</span>";
    foreach ($scored as $s) {
        if ($s['avg_d'] < 5 && $s['score'] < 5) {
            echo "<span class='warn'>⚠ Move/improve: " . htmlspecialchars($s['section_name']) . " — low engagement\n</span>";
        } elseif ($s['avg_d'] > 20) {
            echo "<span style='color:#22c55e;'>✓ Inject CTA in: " . htmlspecialchars($s['section_name']) . " — high dwell captured\n</span>";
        }
    }
}
?>
                    </div>
                </div>

                <!-- Algo 4: Visit Frequency & Return Rate -->
                <div class="algo-card">
                    <div class="algo-title">Return Visitor & Engagement Frequency</div>
                    <div class="algo-desc">
                        Identifies visitors who return multiple times and correlates with lead conversion.
                        Visitors with ≥3 visits not converting are high-priority follow-ups.
                    </div>
                    <div class="algo-output">
<?php
$freq_data = $db->query("
    SELECT
        ip,
        COUNT(DISTINCT session_id) AS sessions,
        COUNT(*) AS page_hits,
        ROUND(AVG(page_time),1) AS avg_dwell,
        (SELECT COUNT(*) FROM leads l WHERE l.ip = pv.ip) AS lead_count
    FROM page_views pv
    GROUP BY ip
    ORDER BY sessions DESC
    LIMIT 20
")->fetchAll(PDO::FETCH_ASSOC);

if (empty($freq_data)) {
    echo '<span class="dim">// No frequency data yet.</span>';
} else {
    foreach ($freq_data as $f) {
        $sessions = $f['sessions'];
        $converted = $f['lead_count'] > 0;
        $hot = $sessions >= 3 && !$converted;
        $tag = $converted ? "<span style='color:#22c55e;'>[LEAD CONVERTED]</span>" : ($hot ? "<span class='warn'>[HIGH PRIORITY — NOT CONVERTED]</span>" : "<span class='dim'>[EXPLORATORY]</span>");
        echo htmlspecialchars($f['ip']) . "  sessions=" . $sessions . "  pages=" . $f['page_hits'] . "  avg=" . $f['avg_dwell'] . "s\n";
        echo "  " . $tag . "\n\n";
    }
}
?>
                    </div>
                </div>

            </div><!-- /.algo-grid -->
        </div>

        <!-- ══════ PANEL: PROJECTS ══════ -->
        <div id="projects" class="panel">
            <div class="panel-title">
                Construction Projects Index
            </div>

            <!-- Add project form -->
            <div style="background: var(--surface); border: 1px solid var(--border); padding: 24px; border-radius: 6px; margin-bottom: 28px;">
                <h3 style="color: var(--yellow); font-size: 12px; font-family: 'Syncopate', sans-serif; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">Add New Project</h3>
                <form method="POST" action="admin.php" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <input type="hidden" name="action" value="add_project">
                    <div>
                        <label style="display: block; font-size: 10px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; letter-spacing: 1px;">Project Name</label>
                        <input type="text" name="name" class="login-input" style="margin-bottom:0;" required placeholder="e.g. Orion Link Bridge">
                    </div>
                    <div>
                        <label style="display: block; font-size: 10px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; letter-spacing: 1px;">Sector / Category</label>
                        <input type="text" name="sector" class="login-input" style="margin-bottom:0;" required placeholder="e.g. Civic Infrastructure">
                    </div>
                    <div>
                        <label style="display: block; font-size: 10px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; letter-spacing: 1px;">Technical Specifications</label>
                        <input type="text" name="spec" class="login-input" style="margin-bottom:0;" required placeholder="e.g. Cable-stayed steel arc">
                    </div>
                    <div>
                        <label style="display: block; font-size: 10px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; letter-spacing: 1px;">Completion Year</label>
                        <input type="text" name="year" class="login-input" style="margin-bottom:0;" required placeholder="e.g. 2026">
                    </div>
                    <div style="grid-column: span 2; text-align: right; margin-top: 8px;">
                        <button type="submit" class="btn">Add Project Record</button>
                    </div>
                </form>
            </div>

            <!-- List projects -->
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Project Name</th>
                            <th>Sector</th>
                            <th>Technical Specifications</th>
                            <th>Year</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                    $projectsList = $db->query("SELECT * FROM projects ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
                    if (empty($projectsList)): ?>
                        <tr><td colspan="6" class="empty-state"><strong>–</strong>No projects added yet.</td></tr>
                    <?php else: foreach ($projectsList as $p): ?>
                        <tr>
                            <td>#PRJ-<?= $p['id'] ?></td>
                            <td><strong><?= htmlspecialchars($p['name']) ?></strong></td>
                            <td><?= htmlspecialchars($p['sector']) ?></td>
                            <td><?= htmlspecialchars($p['spec']) ?></td>
                            <td><?= htmlspecialchars($p['year']) ?></td>
                            <td>
                                <a href="admin.php?delete_project=<?= $p['id'] ?>" class="map-link" style="background: rgba(239,68,68,.1); color: var(--red);" onclick="return confirm('Are you sure you want to delete this project?');">
                                    Delete
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ══════ PANEL: FEEDBACK ══════ -->
        <div id="feedback" class="panel">
            <div class="panel-title">
                Client Feedback Desk
            </div>

            <!-- Add feedback form -->
            <div style="background: var(--surface); border: 1px solid var(--border); padding: 24px; border-radius: 6px; margin-bottom: 28px;">
                <h3 style="color: var(--yellow); font-size: 12px; font-family: 'Syncopate', sans-serif; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">Add New Client Feedback</h3>
                <form method="POST" action="admin.php" style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
                    <input type="hidden" name="action" value="add_feedback">
                    <div style="width: 100%;">
                        <label style="display: block; font-size: 10px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; letter-spacing: 1px;">Quote / Testimonial</label>
                        <textarea name="quote" class="login-input" style="width: 100%; min-height: 100px; font-family: sans-serif; resize: vertical;" required placeholder="e.g. Jagathi delivered more than structural compliance..."></textarea>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%;">
                        <div>
                            <label style="display: block; font-size: 10px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; letter-spacing: 1px;">Author Designation</label>
                            <input type="text" name="author" class="login-input" style="margin-bottom:0;" required placeholder="e.g. Infrastructure Partner">
                        </div>
                        <div>
                            <label style="display: block; font-size: 10px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; letter-spacing: 1px;">Company / Group Name</label>
                            <input type="text" name="role" class="login-input" style="margin-bottom:0;" required placeholder="e.g. Urban Development Group">
                        </div>
                    </div>
                    <div style="width: 100%; text-align: right; margin-top: 8px;">
                        <button type="submit" class="btn">Add Feedback Entry</button>
                    </div>
                </form>
            </div>

            <!-- List feedbacks -->
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Quote</th>
                            <th>Author</th>
                            <th>Role / Company</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                    $feedbacksList = $db->query("SELECT * FROM feedbacks ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
                    if (empty($feedbacksList)): ?>
                        <tr><td colspan="5" class="empty-state"><strong>–</strong>No feedback added yet.</td></tr>
                    <?php else: foreach ($feedbacksList as $f): ?>
                        <tr>
                            <td>#FDB-<?= $f['id'] ?></td>
                            <td style="max-width: 400px; font-style: italic;">"<?= htmlspecialchars($f['quote']) ?>"</td>
                            <td><strong><?= htmlspecialchars($f['author']) ?></strong></td>
                            <td><?= htmlspecialchars($f['role']) ?></td>
                            <td>
                                <a href="admin.php?delete_feedback=<?= $f['id'] ?>" class="map-link" style="background: rgba(239,68,68,.1); color: var(--red);" onclick="return confirm('Are you sure you want to delete this feedback?');">
                                    Delete
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <?php endif; // $dbReady ?>
    </div><!-- /.workspace -->
</div><!-- /.admin-body -->

<script>
function showPanel(evt, id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    evt.currentTarget.classList.add('active');
}
</script>

<?php endif; // $isAuthed ?>
</body>
</html>
