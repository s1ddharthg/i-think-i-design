# Bakes public/Travel/* down into public/images/travel/<slug>/N.jpg.
#
# One-time (re-runnable) asset step, not part of the build. The originals are
# 3-4k px phone shots, four of them HEIC, which no browser will render. This
# decodes via WIC (Windows ships the HEIF codec), applies the EXIF orientation
# the WPF decoder does not apply on its own, resamples the long edge to 1600,
# and writes JPEG q82.
#
# 1600/q82 is chosen so next/image has nothing left to do: the polaroids are
# served `unoptimized`, straight off the CDN, which keeps 20 photos x N
# breakpoints of image-transformation quota off the Vercel bill.
#
#   powershell -ExecutionPolicy Bypass -File scripts/travel-photos.ps1

Add-Type -AssemblyName PresentationCore, WindowsBase

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$src  = Join-Path $root 'public\Travel'
$dst  = Join-Path $root 'public\images\travel'

$MaxEdge = 1600
$Quality = 82

# Source filename -> "<slug>/<n>". Order within a city is the order the two
# frames are laid out on the map, front card first.
$MAP = [ordered]@{
    'Ahmedabad.HEIC'     = 'ahmedabad/1'
    'Ahmedabad1.jpg'     = 'ahmedabad/2'
    'Allepey.jpg'        = 'alleppey/1'
    'Allepey1.jpg'       = 'alleppey/2'
    'Bengaluru.jpeg'     = 'bengaluru/1'
    'Japan.jpeg'         = 'tokyo/1'
    'Japan1.jpeg'        = 'tokyo/2'
    'Kanyakumari.jpeg'   = 'kanyakumari/1'
    'Kochi.HEIC'         = 'kochi/1'
    'Kodaikanal.jpeg'    = 'kodaikanal/1'
    'Mahabalipuram.jpg'  = 'mahabalipuram/1'
    'Munnar.jpeg'        = 'munnar/1'
    'Munnar1.jpeg'       = 'munnar/2'
    'Pondy.heic'         = 'pondicherry/1'
    'Pondy1.heic'        = 'pondicherry/2'
    'Trivandrum.jpeg'    = 'trivandrum/1'
    'Vagamon1.jpg'       = 'vagamon/1'
    'Wayanad.jpeg'       = 'wayanad/1'
    'Yelagiri.jpeg'      = 'yelagiri/1'
    'Yercaud.jpeg'       = 'yercaud/1'
}

# EXIF tag 274. WPF's decoders hand back the sensor's pixels untouched, so a
# phone shot held upright arrives on its side unless this is read and applied.
function Get-ExifRotation($frame) {
    try {
        $meta = $frame.Metadata
        if ($null -eq $meta) { return 0 }
        $o = $meta.GetQuery('/app1/ifd/{ushort=274}')
        switch ([int]$o) {
            3 { 180 } 6 { 90 } 8 { 270 } default { 0 }
        }
    } catch { 0 }
}

$done = 0
foreach ($name in $MAP.Keys) {
    $inPath = Join-Path $src $name
    if (-not (Test-Path $inPath)) {
        Write-Warning "missing: $name"
        continue
    }

    $parts   = $MAP[$name] -split '/'
    $outDir  = Join-Path $dst $parts[0]
    $outPath = Join-Path $outDir "$($parts[1]).jpg"
    if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

    $stream = [System.IO.File]::OpenRead($inPath)
    try {
        $decoder = [System.Windows.Media.Imaging.BitmapDecoder]::Create(
            $stream, 'PreservePixelFormat', 'OnLoad')
        $frame = $decoder.Frames[0]

        $rot = Get-ExifRotation $frame
        $img = if ($rot -ne 0) {
            [System.Windows.Media.Imaging.TransformedBitmap]::new(
                $frame, [System.Windows.Media.RotateTransform]::new($rot))
        } else { $frame }

        # Scale is solved on the post-rotation dimensions, or a portrait shot
        # tagged 90 gets sized as if it were landscape.
        $scale = $MaxEdge / [Math]::Max($img.PixelWidth, $img.PixelHeight)
        if ($scale -lt 1) {
            $img = [System.Windows.Media.Imaging.TransformedBitmap]::new(
                $img, [System.Windows.Media.ScaleTransform]::new($scale, $scale))
        }

        $enc = [System.Windows.Media.Imaging.JpegBitmapEncoder]::new()
        $enc.QualityLevel = $Quality
        $enc.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($img))

        $out = [System.IO.File]::Create($outPath)
        try { $enc.Save($out) } finally { $out.Dispose() }
    } finally {
        $stream.Dispose()
    }

    $kb = [int]((Get-Item $outPath).Length / 1KB)
    Write-Host ("{0,-20} -> {1}  {2}x{3}  {4}KB" -f $name, $MAP[$name], $img.PixelWidth, $img.PixelHeight, $kb)
    $done++
}

Write-Host "`n$done/$($MAP.Count) written to public/images/travel/"
