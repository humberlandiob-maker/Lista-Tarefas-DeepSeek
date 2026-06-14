# Script para conectar e fazer push do repositório local ao GitHub
# Uso: .\push-to-github.ps1

$remoteUrl = "https://github.com/humberlandiob-maker/Lista-Tarefas-DeepSeek.git"

git remote add origin $remoteUrl
if ($?) {
    git branch -M main
    git push -u origin main
}
