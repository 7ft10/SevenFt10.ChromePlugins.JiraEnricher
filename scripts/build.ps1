Param(
    [Parameter(Mandatory = $true)]
    [bool]$IsReleaseBuild
)
function Show-Completed {
    param(
        [double]$Percentage,
        [string]$Title = "",
        [string]$Status = "Processing"
    )
    Write-Progress -Activity $Title -Status $Status -percentComplete $Percentage
    Write-Host "`r$([math]::floor($Percentage).ToString().PadLeft(3, " "))% Completed" -NoNewline
}

$manifest = Get-Content -Raw -Path './src/manifest.json' | ConvertFrom-Json

Write-Host "Building " -NoNewline
Write-Host "$($manifest.name) $($manifest.version) " -ForegroundColor "Green" -NoNewline
Write-Host "($(if ($IsReleaseBuild) { "Release" } else { "Debug" }))" -ForegroundColor "DarkMagenta"

Show-Completed -Percentage 1 -Title "Build" -Status "Creating Folders"

if (!(Test-Path -Path './obj/')) {
    New-Item -ItemType directory -Path './obj/'
}
if (!(Test-Path -Path './obj/release')) {
    New-Item -ItemType directory -Path './obj/release'
}
if (!(Test-Path -Path './obj/debug')) {
    New-Item -ItemType directory -Path './obj/debug'
}

if ($IsReleaseBuild) {
    Show-Completed -Percentage 5 -Title "Cleaning"
    Get-ChildItem -Path './obj/release' -Include * -File -Recurse | ForEach-Object { $_.Delete() }

    Show-Completed -Percentage 10 -Title "Copying"
    Copy-Item -Path './src/*' -Destination './obj/release/' -Force -Recurse

    $i = 0; $files = Get-ChildItem './obj/release/' -Recurse -Force -Include *.css
    $files | ForEach-Object {
        & "./scripts/Minify-CSS.ps1" -file $_
        Show-Completed -Percentage (10 + (($i++ / ($files.Count) * 100) * 0.4)) -Title "Minifying" -Status "Minifying $($_.BaseName).$($_.Extension)"
    }

    $i = 0;  $files = Get-ChildItem './obj/release/' -Recurse -Force -Include *.js
    $files | ForEach-Object {
        & "./scripts/Minify-Javascript.ps1" -file $_
        Show-Completed -Percentage (50 + (($i++ / ($files.Count) * 100) * 0.4)) -Title "Minifying" -Status "Minifying $($_.BaseName).$($_.Extension)"
    }

    Show-Completed -Percentage 90 -Title "Archiving"
    Compress-Archive -Path "./obj/release/*" -DestinationPath "./obj/release/$($manifest.name).zip" -Force

    Show-Completed -Percentage 95 -Title "Cleaning"
    Remove-Item "./obj/release/*" -Exclude "$($manifest.name).zip" -Force -Recurse
}
else {
    Show-Completed -Percentage 33 -Title "Cleaning"
    Get-ChildItem -Path './obj/debug' -Include * -File -Recurse | ForEach-Object { $_.Delete() }

    Show-Completed -Percentage 66 -Title "Copying"
    Copy-Item -Path './src/*' -Destination './obj/debug/' -Force -Recurse
}

Show-Completed -Percentage 100 -Title "Build" -Status "Completed"