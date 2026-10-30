# LightOS Platform - Complete Setup Script
# Run this in PowerShell to create the entire project

Write-Host "Setting up LightOS Platform..." -ForegroundColor Cyan

# Create project directory
$projectPath = "$env:USERPROFILE\lightos-platform"
if (Test-Path $projectPath) {
    Write-Host "Removing existing directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $projectPath
}

New-Item -ItemType Directory -Path $projectPath -Force | Out-Null
Set-Location $projectPath

# Create folder structure
New-Item -ItemType Directory -Path "src\components" -Force | Out-Null
New-Item -ItemType Directory -Path "src\data" -Force | Out-Null
New-Item -ItemType Directory -Path "src\store" -Force | Out-Null
New-Item -ItemType Directory -Path "src\types" -Force | Out-Null

Write-Host "Creating configuration files..." -ForegroundColor Cyan

# package.json
@'
{
  "name": "lightos-platform",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.5.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.294.0",
    "recharts": "^2.10.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
'@ | Out-File -FilePath "package.json" -Encoding UTF8

# vite.config.ts
@'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
'@ | Out-File -FilePath "vite.config.ts" -Encoding UTF8

# tsconfig.json
@'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
'@ | Out-File -FilePath "tsconfig.json" -Encoding UTF8

# tsconfig.node.json
@'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
'@ | Out-File -FilePath "tsconfig.node.json" -Encoding UTF8

# tailwind.config.js
@'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#fafafa',
        'muted-foreground': '#737373',
        lightrail: '#06b6d4',
        'lightrail-foreground': '#0a0a0a',
        primary: '#06b6d4',
        'primary-foreground': '#0a0a0a',
        card: '#171717',
        'card-foreground': '#fafafa',
        border: '#262626',
        accent: '#262626',
        'accent-foreground': '#fafafa',
        'glow-secondary': '#8b5cf6',
      },
    },
  },
  plugins: [],
}
'@ | Out-File -FilePath "tailwind.config.js" -Encoding UTF8

# postcss.config.js
@'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@ | Out-File -FilePath "postcss.config.js" -Encoding UTF8

# index.html
@'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LightOS — AI Compute Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
'@ | Out-File -FilePath "index.html" -Encoding UTF8

Write-Host "Configuration files created!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run these commands:" -ForegroundColor Yellow
Write-Host "  cd $projectPath" -ForegroundColor White
Write-Host "  npm install" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "After npm install completes, I'll provide the source code files." -ForegroundColor Cyan
