$StageDir = "IQAC-Complete-Project"
$ZipFile = "IQAC-Management-System.zip"

Write-Host "Creating standalone project folder..."

if (Test-Path $StageDir) {
    Remove-Item -Recurse -Force $StageDir
}

New-Item -ItemType Directory -Path "$StageDir/frontend" -Force | Out-Null

Copy-Item -Recurse -Path "frontend/src" -Destination "$StageDir/frontend/src"
Copy-Item -Recurse -Path "frontend/public" -Destination "$StageDir/frontend/public"
Copy-Item -Path "frontend/index.html" -Destination "$StageDir/frontend/index.html"
Copy-Item -Path "frontend/package.json" -Destination "$StageDir/frontend/package.json"
Copy-Item -Path "frontend/vite.config.js" -Destination "$StageDir/frontend/vite.config.js"
Copy-Item -Path "frontend/eslint.config.js" -Destination "$StageDir/frontend/eslint.config.js"
Copy-Item -Path "frontend/.gitignore" -Destination "$StageDir/frontend/.gitignore"
Copy-Item -Path "frontend/README.md" -Destination "$StageDir/frontend/README.md"

Copy-Item -Path "start-project.bat" -Destination "$StageDir/start-project.bat"
Copy-Item -Path "start-project.sh" -Destination "$StageDir/start-project.sh"
Copy-Item -Path "README.md" -Destination "$StageDir/README.md"

Write-Host "Compressing into $ZipFile..."

if (Test-Path $ZipFile) {
    Remove-Item -Force $ZipFile
}

Compress-Archive -Path $StageDir -DestinationPath $ZipFile -Force

Write-Host "PROJECT PACKAGED SUCCESSFULLY!"
Write-Host "Standalone Folder: $StageDir"
Write-Host "Downloadable Archive: $ZipFile"
