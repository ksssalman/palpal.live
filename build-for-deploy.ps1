# Build and prepare all projects for Firebase deployment

Write-Host "Building Work Tracker..." -ForegroundColor Cyan

$workTrackerPath = "./projects/work-tracker"

# Check if directory exists
if (-not (Test-Path $workTrackerPath)) {
    Write-Error "Work Tracker directory not found at $workTrackerPath"
    exit 1
}

# Build Work Tracker
Push-Location $workTrackerPath

Write-Host "Installing dependencies..."
npm install

Write-Host "Building project..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
    Pop-Location
    exit 1
}

Pop-Location

Write-Host "Work Tracker built successfully." -ForegroundColor Green
Write-Host "Ready to deploy with: firebase deploy --only hosting" -ForegroundColor Green
