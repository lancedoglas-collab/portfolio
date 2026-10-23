# Minimal static file server for the portfolio.
# Usage: powershell -ExecutionPolicy Bypass -File serve.ps1 [-Root <path>] [-Port 8000]
param(
  [string]$Root = (Get-Location).Path,
  [int]$Port = 8000
)

$Root = (Resolve-Path $Root).Path

$types = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.webp' = 'image/webp'
  '.ico'  = 'image/x-icon'
  '.pdf'  = 'application/pdf'
  '.woff2'= 'font/woff2'
  # Without a real video type the browser refuses to play the file.
  '.mp4'  = 'video/mp4'
  '.webm' = 'video/webm'
  '.ogv'  = 'video/ogg'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

Write-Host ""
Write-Host "  Portfolio serving at  http://localhost:$Port" -ForegroundColor Green
Write-Host "  Root: $Root"
Write-Host "  Press Ctrl+C to stop."
Write-Host ""

try {
  while ($listener.IsListening) {
    $context  = $listener.GetContext()
    $request  = $context.Request
    $response = $context.Response

    # One malformed or aborted request must never take the server down.
    try {

    # Strip the query string, decode %20 etc.
    $rel = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath).TrimStart('/')
    if ($rel -eq '') { $rel = 'index.html' }

    $path = Join-Path $Root $rel

    # cleanUrls: /about -> about.html, matching the Vercel config.
    if (-not (Test-Path $path -PathType Leaf) -and (Test-Path "$path.html" -PathType Leaf)) {
      $path = "$path.html"
    }
    if (Test-Path $path -PathType Container) {
      $path = Join-Path $path 'index.html'
    }

    # Never serve outside the root.
    $full = [System.IO.Path]::GetFullPath($path)
    if (-not $full.StartsWith($Root, [StringComparison]::OrdinalIgnoreCase)) {
      $response.StatusCode = 403
      $response.Close()
      continue
    }

    # A HEAD gets the headers and no body — the site uses one to read the
    # CV's size. Writing bytes here is a protocol violation.
    $isHead = $request.HttpMethod -eq 'HEAD'

    if (Test-Path $full -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($full).ToLower()
      $response.ContentType = $(if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' })
      $bytes = [System.IO.File]::ReadAllBytes($full)
      $response.ContentLength64 = $bytes.Length
      if (-not $isHead) { $response.OutputStream.Write($bytes, 0, $bytes.Length) }
      Write-Host ("  200  {0,-4} /{1}" -f $request.HttpMethod, $rel)
    } else {
      $response.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
      $response.ContentType = 'text/plain; charset=utf-8'
      $response.ContentLength64 = $bytes.Length
      if (-not $isHead) { $response.OutputStream.Write($bytes, 0, $bytes.Length) }
      Write-Host ("  404  {0,-4} /{1}" -f $request.HttpMethod, $rel) -ForegroundColor Yellow
    }
    }
    catch {
      Write-Host ("  ERR  /{0}  {1}" -f $rel, $_.Exception.Message) -ForegroundColor Red
    }
    finally {
      try { $response.Close() } catch {}
    }
  }
}
finally {
  $listener.Stop()
  $listener.Dispose()
}
