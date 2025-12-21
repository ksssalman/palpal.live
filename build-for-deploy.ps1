# Build and prepare all projects for Firebase deployment

Write-Host "Building Work Tracker..." -ForegroundColor Cyan

$workTrackerPath = "../../../../Side Projects/Work Tracker"

# Build Work Tracker
Push-Location $workTrackerPath
npm run build
Pop-Location

# Copy dist to projects/work-tracker
$sourceDir = "$workTrackerPath/dist"
$targetDir = "projects/work-tracker"

if (Test-Path $targetDir) {
    Remove-Item $targetDir -Recurse -Force
}

Copy-Item -Path $sourceDir -Destination $targetDir -Recurse

Write-Host "Work Tracker built and copied to projects/work-tracker" -ForegroundColor Green
Write-Host "Ready to deploy with: firebase deploy --only hosting" -ForegroundColor Green
