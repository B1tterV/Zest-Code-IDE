#!/bin/bash
# cleanup.sh

echo -e "\e[36m--- Zest Code Branch Cleanup ---\e[0m"

read -p "Удалить все локальные и удаленные ветки feature/* и hotfix/*? (y/n): " confirm
if [[ $confirm != "y" ]]; then
    echo "Отменено."
    exit 1
fi

# 1. Локальное удаление
echo -e "\n\e[33m[1/3] Удаление локальных веток...\e[0m"
git branch | grep -E "feature/|hotfix/" | xargs -r git branch -D

# 2. Удаленное удаление
echo -e "\n\e[33m[2/3] Удаление веток из origin...\e[0m"
git branch -r | grep -E "origin/(feature|hotfix)/" | sed 's/origin\///' | xargs -I {} -r git push origin --delete {}

# 3. Синхронизация
echo -e "\n\e[33m[3/3] Синхронизация (prune)...\e[0m"
git fetch --prune

echo -e "\n\e[32mГотово! Репозиторий очищен.\e[0m"