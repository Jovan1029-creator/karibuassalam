# Convert the supplied October campus photos without modifying the originals.
# Requires FFmpeg and FFprobe on PATH. HEIF tile grids are assembled in full;
# selecting the first video stream alone would export only one 512px tile.
$ErrorActionPreference = 'Stop'
$projectPath = Split-Path $PSScriptRoot -Parent
$sourcePath = Join-Path $projectPath 'pics/new'
$outputPath = Join-Path $projectPath 'pics/site-marketing/campus-2026'
New-Item -ItemType Directory -Path $outputPath -Force | Out-Null

Get-ChildItem -LiteralPath $sourcePath -File | Where-Object { $_.Name -match '^\d{2}-.*\.(jpg|heif)$' } | ForEach-Object {
    $photo = $_
    $stem = $photo.BaseName -replace '-unverified$', ''
    $gridFilter = $null
    if ($photo.Extension -eq '.heif') {
        $metadata = ffprobe -v error -show_stream_groups -of json $photo.FullName | ConvertFrom-Json
        if ($LASTEXITCODE -ne 0) { throw "Cannot inspect $($photo.Name)" }
        $grid = $metadata.stream_groups[0].components[0]
        if (!$grid.nb_tiles) { throw "No HEIF tile grid in $($photo.Name)" }
        $inputs = ($grid.subcomponents | ForEach-Object { '[0:' + $_.stream_index + ']' }) -join ''
        $layout = ($grid.subcomponents | ForEach-Object { $_.tile_horizontal_offset.ToString() + '_' + $_.tile_vertical_offset }) -join '|'
        $gridFilter = $inputs + 'xstack=inputs=' + $grid.nb_tiles + ':layout=' + $layout + ',crop=' + $grid.width + ':' + $grid.height + ':' + $grid.horizontal_offset + ':' + $grid.vertical_offset
    }

    foreach ($size in @(1600, 640)) {
        $suffix = if ($size -eq 640) { '-thumb' } else { '' }
        $destination = Join-Path $outputPath ($stem + $suffix + '.webp')
        $scale = "scale=w='min($size,iw)':h='min($size,ih)':force_original_aspect_ratio=decrease:flags=lanczos,setsar=1"
        # The supplied 09 HEIF pixels are sideways after tile reconstruction.
        $orientation = if ($stem -eq '09-school-mother-language-day') { 'transpose=clock,' } else { '' }
        $filterArgs = if ($gridFilter) { @('-filter_complex', ($gridFilter + ',' + $orientation + $scale)) } else { @('-vf', $scale) }
        & ffmpeg -hide_banner -loglevel error -y -threads 1 -i $photo.FullName -filter_complex_threads 1 @filterArgs -frames:v 1 -c:v libwebp -quality 82 -compression_level 6 -map_metadata -1 $destination
        if ($LASTEXITCODE -ne 0) { throw "Cannot convert $($photo.Name)" }
    }
    Write-Output "Prepared $stem"
}
