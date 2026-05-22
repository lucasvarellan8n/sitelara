$ErrorActionPreference = 'SilentlyContinue'

Write-Host "Criando diretorios locais..."
New-Item -ItemType Directory -Force -Path ".agents\skills" | Out-Null

$homePath = [Environment]::GetFolderPath('UserProfile')
Write-Host "Home path: $homePath"

New-Item -ItemType Directory -Force -Path "$homePath\.antigravity\skills" | Out-Null
New-Item -ItemType Directory -Force -Path "$homePath\.gemini\skills" | Out-Null

function Clone-Or-Pull {
    param([string]$repo, [string]$path)
    Write-Host "Processando $path..."
    if (Test-Path "$path\.git") {
        Push-Location $path
        Write-Host "  Atualizando (git pull)..."
        git pull
        Pop-Location
    } elseif (Test-Path $path) {
        $count = (Get-ChildItem $path -Force | Measure-Object).Count
        if ($count -eq 0) {
            Write-Host "  Clonando..."
            git clone $repo $path
        } else {
            Write-Host "  ALERTA: O caminho $path ja existe mas nao e um repositorio git."
        }
    } else {
        Write-Host "  Clonando..."
        git clone $repo $path
    }
}

Clone-Or-Pull "https://github.com/guanyang/antigravity-skills.git" ".agents\skills\antigravity-skills"
Clone-Or-Pull "https://github.com/guanyang/antigravity-skills.git" "$homePath\.antigravity\skills\antigravity-skills"

Clone-Or-Pull "https://github.com/Ilm-Alan/frontend-design.git" ".agents\skills\frontend-design"
Clone-Or-Pull "https://github.com/Ilm-Alan/frontend-design.git" "$homePath\.gemini\skills\frontend-design"
Clone-Or-Pull "https://github.com/Ilm-Alan/frontend-design.git" "$homePath\.antigravity\skills\frontend-design"

Clone-Or-Pull "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git" ".agents\skills\ui-ux-pro-max-skill"
Clone-Or-Pull "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git" "$homePath\.antigravity\skills\ui-ux-pro-max-skill"

Clone-Or-Pull "https://github.com/am-will/codex-skills.git" ".agents\skills\codex-skills"

Clone-Or-Pull "https://github.com/openai/skills.git" ".agents\skills\openai-skills"

Write-Host "Copiando ui-ux-pro-max..."
New-Item -ItemType Directory -Force -Path ".agents\skills\ui-ux-pro-max" | Out-Null
if (Test-Path ".agents\skills\ui-ux-pro-max-skill\.claude\skills\ui-ux-pro-max") {
    Copy-Item -Path ".agents\skills\ui-ux-pro-max-skill\.claude\skills\ui-ux-pro-max\*" -Destination ".agents\skills\ui-ux-pro-max\" -Recurse -Force
}

New-Item -ItemType Directory -Force -Path "$homePath\.antigravity\skills\ui-ux-pro-max" | Out-Null
if (Test-Path "$homePath\.antigravity\skills\ui-ux-pro-max-skill\.claude\skills\ui-ux-pro-max") {
    Copy-Item -Path "$homePath\.antigravity\skills\ui-ux-pro-max-skill\.claude\skills\ui-ux-pro-max\*" -Destination "$homePath\.antigravity\skills\ui-ux-pro-max\" -Recurse -Force
}

Write-Host "Configurando Gemini skills..."
$settingsFile = "$homePath\.gemini\settings.json"
if (Test-Path $settingsFile) {
    try {
        $content = Get-Content $settingsFile -Raw | ConvertFrom-Json
        if ($null -eq $content.experimental) {
            $content | Add-Member -MemberType NoteProperty -Name "experimental" -Value @{ skills = $true }
        } else {
            $content.experimental | Add-Member -MemberType NoteProperty -Name "skills" -Value $true -Force
        }
        $content | ConvertTo-Json -Depth 10 | Set-Content $settingsFile
        Write-Host "settings.json atualizado."
    } catch {
        Write-Host "Erro ao atualizar settings.json"
    }
} else {
    $newConfig = @{ experimental = @{ skills = $true } }
    $newConfig | ConvertTo-Json -Depth 10 | Set-Content $settingsFile
    Write-Host "settings.json criado."
}

Write-Host "Instalacao de Skills Concluida!"
