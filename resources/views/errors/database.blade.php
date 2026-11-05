<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Database unavailable | What The Crust</title>
    <style>
        :root { color-scheme: dark; font-family: Arial, sans-serif; }
        * { box-sizing: border-box; }
        body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #101010; color: #f5f5f5; }
        main { width: min(100%, 620px); padding: 36px; border: 1px solid #343434; border-top: 4px solid #e32626; border-radius: 8px; background: #191919; }
        p:first-child { margin: 0 0 12px; color: #f1a83a; font-size: 13px; font-weight: 800; text-transform: uppercase; }
        h1 { margin: 0 0 16px; font-size: clamp(32px, 7vw, 58px); line-height: .98; }
        p { color: #c7c7c7; line-height: 1.65; }
        ol { padding-left: 22px; line-height: 1.8; }
        code { color: #fff; background: #272727; padding: 2px 6px; border-radius: 4px; }
        button { margin-top: 12px; border: 0; border-radius: 5px; padding: 12px 18px; background: #e32626; color: #fff; font: inherit; font-weight: 800; cursor: pointer; }
    </style>
</head>
<body>
<main>
    <p>What The Crust setup</p>
    <h1>The database is not running.</h1>
    <p>Laravel could not reach MySQL. Your project files are safe. Start the database and try again.</p>
    <ol>
        <li>Open the XAMPP Control Panel.</li>
        <li>Click <strong>Start</strong> beside MySQL.</li>
        <li>Check that the database named in <code>DB_DATABASE</code> exists in phpMyAdmin.</li>
    </ol>
    <button type="button" onclick="window.location.reload()">Try again</button>
</main>
</body>
</html>
