#!/bin/bash

# 🚀 Script Deploy Automatico MoVaRisCh
# Versione: 2.1.0
# Data: 2025-12-07

set -e  # Exit on error

echo "════════════════════════════════════════════════════"
echo "   🚀 MoVaRisCh Deploy Script v2.1.0"
echo "════════════════════════════════════════════════════"
echo ""

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funzione per stampare messaggi
print_step() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# STEP 1: Verifica .env non sia tracciato
echo "STEP 1: Verifica sicurezza .env"
if git ls-files | grep -q "server/.env"; then
    print_error "ATTENZIONE! server/.env è tracciato in Git!"
    print_error "Rimuovilo con: git rm --cached server/.env"
    exit 1
fi
print_step ".env non è tracciato (OK)"
echo ""

# STEP 2: Verifica stato Git
echo "STEP 2: Verifica modifiche"
if [[ -n $(git status -s) ]]; then
    print_warning "Ci sono modifiche non committate:"
    git status -s
    echo ""
    read -p "Vuoi continuare con il commit? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deploy annullato"
        exit 1
    fi
else
    print_step "Repository pulito"
fi
echo ""

# STEP 3: Commit
echo "STEP 3: Commit modifiche"
read -p "Messaggio commit (default: 'Update v2.1.0 - Export e Classificazione Rischio'): " COMMIT_MSG
COMMIT_MSG=${COMMIT_MSG:-"Update v2.1.0 - Export completo, Tipologia d'Uso, Tabella Classificazione"}

git add .
git commit -m "$COMMIT_MSG"
print_step "Commit creato: $COMMIT_MSG"
echo ""

# STEP 4: Push
echo "STEP 4: Push al repository"
read -p "Branch di destinazione (default: main): " BRANCH
BRANCH=${BRANCH:-main}

git push origin "$BRANCH"
print_step "Push completato su branch: $BRANCH"
echo ""

# STEP 5: Deploy su VPS (opzionale)
echo "STEP 5: Deploy su VPS"
read -p "Vuoi fare il deploy sul VPS? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Indirizzo VPS (es. user@ip): " VPS_ADDRESS
    read -p "Path progetto sul VPS (es. /home/user/movarisch): " VPS_PATH

    echo ""
    print_step "Connessione a VPS: $VPS_ADDRESS"

    ssh "$VPS_ADDRESS" << EOF
        set -e
        echo "Navigazione in $VPS_PATH"
        cd "$VPS_PATH"

        echo "Pull modifiche..."
        git pull origin "$BRANCH"

        echo "Rebuild container Docker..."
        docker-compose -f docker-compose.vps.yml down
        docker-compose -f docker-compose.vps.yml up -d --build

        echo "Verifica container..."
        docker-compose -f docker-compose.vps.yml ps

        echo ""
        echo "════════════════════════════════════════════════════"
        echo "   ✓ Deploy completato con successo!"
        echo "════════════════════════════════════════════════════"
EOF

    print_step "Deploy VPS completato!"
    echo ""
    print_warning "Ricorda di verificare l'applicazione su: http://your-vps-ip:8005"
else
    print_step "Deploy VPS saltato"
    echo ""
    echo "Per deployare manualmente sul VPS:"
    echo "  ssh user@vps-ip"
    echo "  cd /path/to/movarisch"
    echo "  git pull origin $BRANCH"
    echo "  docker-compose -f docker-compose.vps.yml down"
    echo "  docker-compose -f docker-compose.vps.yml up -d --build"
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "   ✓ Deploy locale completato!"
echo "════════════════════════════════════════════════════"
echo ""
echo "Modifiche deployate (v2.1.0):"
echo "  ✓ Tipologia d'Uso in Step 3"
echo "  ✓ Tabella Classificazione Rischio"
echo "  ✓ Export Word completo"
echo "  ✓ Validazione Luogo/Mansione obbligatoria"
echo ""
