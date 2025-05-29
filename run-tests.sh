#!/bin/bash

# Diretório base
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K6_DIR="$SCRIPT_DIR"
SCRIPTS_DIR="$K6_DIR/scripts"
RESULTS_DIR="$K6_DIR/results"

# Criar diretório de resultados
mkdir -p "$RESULTS_DIR"

# Verificar se o k6 está instalado
if [ ! -f "$K6_DIR/k6" ] && ! command -v k6 &> /dev/null; then
    echo "Erro: k6 não está instalado."
    echo "Você pode instalá-lo usando um dos seguintes métodos:"
    echo ""
    echo "Método 1: Usando o script de instalação"
    echo "cd $K6_DIR"
    echo "curl -L https://github.com/grafana/k6/releases/download/v0.46.0/k6-v0.46.0-linux-amd64.tar.gz -o k6.tar.gz"
    echo "tar xzf k6.tar.gz"
    echo "mv k6-v0.46.0-linux-amd64/k6 ."
    echo "rm -rf k6-v0.46.0-linux-amd64 k6.tar.gz"
    echo "chmod +x k6"
    echo ""
    echo "Método 2: Instalação oficial"
    echo "Siga as instruções em: https://k6.io/docs/get-started/installation/"
    echo ""
    exit 1
fi

# Definir o caminho do executável k6
if [ -f "$K6_DIR/k6" ]; then
    K6_EXECUTABLE="$K6_DIR/k6"
else
    K6_EXECUTABLE="k6"
fi

# Função para executar testes
run_test() {
    local test_type=$1
    local endpoint=$2
    local script="$SCRIPTS_DIR/${test_type}-${endpoint}.js"
    local output="$RESULTS_DIR/${test_type}-${endpoint}-$(date +%Y%m%d-%H%M%S).json"
    
    echo "Executando teste $test_type para o endpoint $endpoint..."
    cd "$K6_DIR" && $K6_EXECUTABLE run "$script" --out json="$output"
    echo "Resultado salvo em $output"
    echo "----------------------------------------"
}

# Função para executar todos os testes de um tipo
run_all_tests_type() {
    local test_type=$1
    echo "=============== INICIANDO TESTES DE $test_type ==============="
    
    for script in "$SCRIPTS_DIR/${test_type}-"*.js; do
        if [ -f "$script" ]; then
            local endpoint=$(basename "$script" | sed "s/${test_type}-\(.*\)\.js/\1/")
            run_test "$test_type" "$endpoint"
            sleep 2  # Pequena pausa entre os testes
        fi
    done
    
    echo "=============== TESTES DE $test_type CONCLUÍDOS ==============="
    echo ""
}

# Função para listar todos os testes disponíveis
list_tests() {
    echo "Testes disponíveis:"
    echo ""
    echo "Testes de fumaça (smoke):"
    ls -1 "$SCRIPTS_DIR/smoke-"*.js | sed 's/.*smoke-\(.*\)\.js/  \1/'
    echo ""
    echo "Testes de carga (load):"
    ls -1 "$SCRIPTS_DIR/load-"*.js | sed 's/.*load-\(.*\)\.js/  \1/'
    echo ""
    echo "Testes de stress (stress):"
    ls -1 "$SCRIPTS_DIR/stress-"*.js | sed 's/.*stress-\(.*\)\.js/  \1/'
    echo ""
}

# Menu principal
case "$1" in
    smoke)
        run_all_tests_type "smoke"
        ;;
    load)
        run_all_tests_type "load"
        ;;
    stress)
        run_all_tests_type "stress"
        ;;
    single)
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "Uso: $0 single <tipo> <endpoint>"
            echo "Exemplo: $0 single smoke health"
            exit 1
        fi
        run_test "$2" "$3"
        ;;
    check)
        echo "Executando verificação rápida de todos os endpoints..."
        cd "$K6_DIR" && $K6_EXECUTABLE run "$SCRIPTS_DIR/check-all-endpoints.js"
        echo "Verificação concluída!"
        ;;
    list)
        list_tests
        ;;
    *)
        echo "Uso: $0 {smoke|load|stress|single|check|list}"
        echo ""
        echo "  smoke      - Executa todos os testes de fumaça"
        echo "  load       - Executa todos os testes de carga"
        echo "  stress     - Executa todos os testes de stress"
        echo "  single <tipo> <endpoint> - Executa um teste específico"
        echo "  check      - Executa verificação rápida de todos os endpoints"
        echo "  list       - Lista todos os testes disponíveis"
        echo ""
        echo "Exemplos:"
        echo "  $0 smoke           # Executa todos os testes de fumaça"
        echo "  $0 single load health  # Executa o teste de carga para o endpoint health"
        echo "  $0 check           # Verifica o status de todos os endpoints"
        ;;
esac