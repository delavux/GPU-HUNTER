# Execute este arquivo na raiz do projeto GPU-HUNTER.
$ErrorActionPreference = "Stop"

$base = Get-Location
$assetsDir = Join-Path $base "mobile\src\assets\gpus"
$dataDir = Join-Path $base "mobile\src\dados"
New-Item -ItemType Directory -Force -Path $assetsDir, $dataDir | Out-Null

$images = @(
    @{ Id = 1;  File = "rx-6600.jpg";     Url = "https://www.asrock.com/Graphics-Card/photo/Radeon%20RX%206600%20Challenger%20D%208GB(M1).png" },
    @{ Id = 2;  File = "rtx-3060.png";    Url = "https://www.oficinadanet.com.br/imagens/obj_item/1209/3060-pronta.png" },
    @{ Id = 3;  File = "rtx-4060.jpg";    Url = "https://tpucdn.com/gpu-specs/images-new/c/3891-back-large.jpg" },
    @{ Id = 4;  File = "rtx-4070.png";    Url = "https://www.itcreations.com/dist/landing/i/rtx-4070/carousel/rtx-4070-1.png" },
    @{ Id = 5;  File = "rtx-5060.png";    Url = "https://static.cazasouq.com/image/cache/catalog/4718006459017-3-550x550.png" },
    @{ Id = 6;  File = "rtx-5060-ti.png"; Url = "https://www.austin.net.au/cdn/shop/files/VCG5060T8DFXPB1-O-2_1024x.png?v=1778483118" },
    @{ Id = 7;  File = "rtx-5070.jpg";    Url = "https://multimedia.bbycastatic.ca/multimedia/products/1500x1500/191/19193/19193219_2.jpg" },
    @{ Id = 8;  File = "rx-7600.jpg";     Url = "https://www.amd.com/content/dam/amd/en/images/products/graphics/2648997-amd-radeon-7600.jpg" },
    @{ Id = 9;  File = "rx-7600-xt.jpg";  Url = "https://www.amd.com/content/dam/amd/en/images/products/graphics/2648997-amd-radeon-7600xt.jpg" },
    @{ Id = 10; File = "rx-9060-xt.jpg";  Url = "https://easypc.com.ph/cdn/shop/files/asus-dual-rx9060xt-8gb-main_2048x2048.jpg?v=1762497614" },
    @{ Id = 11; File = "rx-9070-xt.jpg";  Url = "https://cdn.lesnumeriques.com/optim/product/75/75984/f359048f-radeon-rx-9070-xt_png__1200_900__overflow.jpg" }
)

$ok = @()
foreach ($item in $images) {
    $dest = Join-Path $assetsDir $item.File
    try {
        Invoke-WebRequest -Uri $item.Url -OutFile $dest -Headers @{ "User-Agent" = "Mozilla/5.0" } -TimeoutSec 30
        $bytes = (Get-Item $dest).Length
        if ($bytes -lt 5000) { throw "Arquivo muito pequeno ($bytes bytes), provável bloqueio ou página de erro." }
        $ok += $item
        Write-Host "OK  $($item.File) ($bytes bytes)" -ForegroundColor Green
    }
    catch {
        if (Test-Path $dest) { Remove-Item $dest -Force }
        Write-Host "FALHOU  $($item.File): $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Gera imports locais estáticos, que são suportados pelo React Native/Metro.
$map = @()
$map += "export const imagensGPUs = {"
foreach ($item in $ok) {
    $map += "  $($item.Id): require('../assets/gpus/$($item.File)'),"
}
$map += "};"
Set-Content -Path (Join-Path $dataDir "imagensGPUs.js") -Value ($map -join "`r`n") -Encoding UTF8

# Troca a sintaxe de imagem remota por asset local nas duas telas.
$screens = @(
    (Join-Path $base "mobile\src\screens\HomeScreen.js"),
    (Join-Path $base "mobile\src\screens\GpuDetailsScreen.js")
)
foreach ($screen in $screens) {
    if (Test-Path $screen) {
        $content = Get-Content $screen -Raw
        $content = $content.Replace('source={{ uri: imagem }}', 'source={imagem}')
        Set-Content -Path $screen -Value $content -Encoding UTF8
        Write-Host "Atualizado: $screen" -ForegroundColor Cyan
    } else {
        Write-Host "Tela não encontrada: $screen" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Concluído. Imagens baixadas: $($ok.Count) de $($images.Count)." -ForegroundColor Cyan
Write-Host "Se alguma falhou, ela não será adicionada ao mapeamento; as telas continuarão mostrando o ícone padrão."
Write-Host "Reinicie o Expo: npx expo start -c"
