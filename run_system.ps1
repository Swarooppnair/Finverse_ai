# Start Backend
# Use the virtual environment's python executable
Start-Process -FilePath ".venv/Scripts/python.exe" -ArgumentList "-m uvicorn orchestrator:app --reload --port 8000" -WorkingDirectory "c:/Users/Swaroop/OneDrive/Desktop/Finverse 2.0" -NoNewWindow

# Start Frontend
# Use npm.cmd for Windows compatibility
Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "c:/Users/Swaroop/OneDrive/Desktop/Finverse 2.0/frontend" -NoNewWindow

Write-Host "Finverse 2.0 is running!"
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:5173"
