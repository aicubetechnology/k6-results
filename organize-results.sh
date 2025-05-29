#!/bin/bash

# Script para organizar os resultados dos testes K6 na estrutura de diretórios solicitada
# e obter estatísticas do banco de dados após cada teste.

# Diretório base
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K6_DIR="$SCRIPT_DIR"
SCRIPTS_DIR="$K6_DIR/scripts"
RESULTS_DIR="$K6_DIR/results"

# Função para executar teste e organizar resultados
run_test() {
    local test_type=$1
    local test_script=$2
    
    # Verificar se o script existe
    local script_path="$SCRIPTS_DIR/${test_script}.js"
    if [ ! -f "$script_path" ]; then
        echo "Erro: Script $script_path não encontrado."
        return 1
    fi
    
    # Obter timestamp no formato solicitado
    local timestamp=$(date +%d%m%Y%H%M%S)
    
    # Criar diretório para resultados
    local result_dir="$RESULTS_DIR/${test_type}/${test_script}/${timestamp}"
    mkdir -p "$result_dir"
    
    echo "==================================================="
    echo "Executando teste: ${test_type}/${test_script}"
    echo "Resultados serão salvos em: ${result_dir}"
    echo "==================================================="
    
    # Verificar se o endpoint está acessível antes de executar o teste
    echo "Verificando se o endpoint está acessível..."
    local health_check=$(curl -s --connect-timeout 20 --max-time 30 http://130.61.226.26:8000/health)
    if [ -z "$health_check" ]; then
        echo "Aviso: Endpoint de saúde não está acessível, mas continuaremos com o teste."
        echo "Pode haver problemas de latência ou o endpoint de saúde pode estar indisponível temporariamente."
        echo "# Aviso - Endpoint de Saúde Inacessível" > "${result_dir}/health_warning.md"
        echo "Data e hora: $(date '+%d/%m/%Y %H:%M:%S')" >> "${result_dir}/health_warning.md"
        echo "O endpoint de saúde não estava acessível, mas o teste foi executado mesmo assim." >> "${result_dir}/health_warning.md"
    else
        echo "Endpoint de saúde está acessível. Salvando estado inicial..."
        echo "$health_check" > "${result_dir}/health_before_test.json"
    fi
    
    # O estado de saúde inicial já foi obtido ou notificado acima
    
    # Executar o teste K6
    echo "Executando o teste K6..."
    cd "$K6_DIR" && k6 run "$script_path" --summary-export="${result_dir}/summary.json" > "${result_dir}/k6_output.txt"
    
    # Verificar se o teste foi executado com sucesso
    if [ $? -ne 0 ]; then
        echo "Erro durante a execução do teste."
        echo "# Teste Falhou - Erro na Execução" > "${result_dir}/SUMMARY.md"
        echo "Data e hora: $(date '+%d/%m/%Y %H:%M:%S')" >> "${result_dir}/SUMMARY.md"
        echo "Ocorreu um erro durante a execução do teste. Verifique o arquivo k6_output.txt para mais detalhes." >> "${result_dir}/SUMMARY.md"
        return 1
    fi
    
    # Obter estatísticas do banco de dados após o teste
    echo "Obtendo estatísticas do banco de dados..."
    # Aqui usaremos o MongoDB para obter estatísticas do banco
    get_database_stats > "${result_dir}/db_stats.json"
    
    # Obter estado de saúde após o teste
    echo "Obtendo estado de saúde final..."
    local health_after=$(curl -s --connect-timeout 20 --max-time 30 http://130.61.226.26:8000/health)
    if [ -z "$health_after" ]; then
        echo "Aviso: Não foi possível obter o estado de saúde após o teste."
        echo "# Aviso - Estado de Saúde Final Inacessível" > "${result_dir}/health_after_warning.md"
        echo "Data e hora: $(date '+%d/%m/%Y %H:%M:%S')" >> "${result_dir}/health_after_warning.md"
        echo "Não foi possível obter o estado de saúde após o teste." >> "${result_dir}/health_after_warning.md"
    else
        echo "$health_after" > "${result_dir}/health_after_test.json"
    fi
    
    # Gerar o arquivo SUMMARY.md
    echo "Gerando SUMMARY.md..."
    generate_summary_md "$test_type" "$test_script" "$timestamp" "$result_dir"
    
    echo "==================================================="
    echo "Teste concluído. Resultados salvos em: ${result_dir}"
    echo "==================================================="
    
    return 0
}

# Função para obter estatísticas do banco de dados
get_database_stats() {
    # Conexão com o MongoDB
    local db_uri="mongodb+srv://memorymaster:Aygx56Qx23rbos@qubeneuralmemory.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"
    local db_name="qubeneuralmemoryDB"
    
    # Comando para obter estatísticas do banco
    mongosh "$db_uri" --quiet --eval "
        use $db_name;
        let stats = db.stats();
        let collectionsStats = {};
        
        db.getCollectionNames().forEach(function(collName) {
            collectionsStats[collName] = db[collName].stats();
            
            // Adicionar contagem por fonte se for a coleção memories
            if (collName === 'memories') {
                let sources = db[collName].aggregate([
                    { \$match: { 'metadata.source': { \$exists: true } } },
                    { \$group: { _id: '\$metadata.source', count: { \$sum: 1 },
                      first: { \$min: '\$created_at' }, 
                      last: { \$max: '\$created_at' } } },
                    { \$sort: { count: -1 } }
                ]).toArray();
                
                collectionsStats[collName].sources = sources;
                
                // Obter estatísticas de agentes
                let agents = db[collName].aggregate([
                    { \$group: { _id: '\$agent_id', count: { \$sum: 1 } } },
                    { \$sort: { count: -1 } },
                    { \$limit: 10 }
                ]).toArray();
                
                collectionsStats[collName].top_agents = agents;
                collectionsStats[collName].unique_agents = db[collName].distinct('agent_id').length;
                
                // Obter estatísticas de tamanho
                let sizesTestData = db[collName].aggregate([
                    { \$match: { 'metadata.source': 'k6_test' } },
                    { \$project: { textLength: { \$strLenCP: '\$text' } } },
                    { \$group: { 
                        _id: null, 
                        avgSize: { \$avg: '\$textLength' },
                        minSize: { \$min: '\$textLength' },
                        maxSize: { \$max: '\$textLength' },
                        count: { \$sum: 1 }
                    }}
                ]).toArray()[0] || { avgSize: 0, minSize: 0, maxSize: 0, count: 0 };
                
                collectionsStats[collName].sizes_test_data = sizesTestData;
                
                // Obter estatísticas de tamanho para dados não de teste
                let sizesOtherData = db[collName].aggregate([
                    { \$match: { 'metadata.source': { \$ne: 'k6_test' } } },
                    { \$project: { textLength: { \$strLenCP: '\$text' } } },
                    { \$group: { 
                        _id: null, 
                        avgSize: { \$avg: '\$textLength' },
                        minSize: { \$min: '\$textLength' },
                        maxSize: { \$max: '\$textLength' },
                        count: { \$sum: 1 }
                    }}
                ]).toArray()[0] || { avgSize: 0, minSize: 0, maxSize: 0, count: 0 };
                
                collectionsStats[collName].sizes_other_data = sizesOtherData;
            }
        });
        
        // Resultado final
        let result = {
            dbStats: stats,
            collectionsStats: collectionsStats,
            timestamp: new Date()
        };
        
        JSON.stringify(result, null, 2);
    "
}

# Função para gerar o arquivo SUMMARY.md
generate_summary_md() {
    local test_type=$1
    local test_script=$2
    local timestamp=$3
    local result_dir=$4
    
    # Formatação da data para exibição
    local formatted_date=$(date -d "${timestamp:0:2}/${timestamp:2:2}/${timestamp:4:4} ${timestamp:8:2}:${timestamp:10:2}:${timestamp:12:2}" '+%d/%m/%Y %H:%M:%S')
    
    # Extrair informações do arquivo summary.json
    local summary_json="${result_dir}/summary.json"
    local k6_output="${result_dir}/k6_output.txt"
    local db_stats="${result_dir}/db_stats.json"
    local health_after="${result_dir}/health_after_test.json"
    
    # Início do arquivo SUMMARY.md
    cat > "${result_dir}/SUMMARY.md" << EOF
# K6 Test Results: ${test_type} - ${test_script}

## Test Execution Information
- **Date and Time**: ${formatted_date}
- **Test Type**: ${test_type}
- **Test Script**: ${test_script}

## K6 Output Summary
\`\`\`
$(grep -A 30 "running" ${k6_output} || echo "K6 output not available")
\`\`\`

## HTTP Request Metrics
\`\`\`
$(grep -A 15 "http_req_duration" ${k6_output} || echo "HTTP metrics not available")
\`\`\`

## Checks
\`\`\`
$(grep -A 5 "checks" ${k6_output} || echo "Checks not available")
\`\`\`

## Database Statistics
\`\`\`json
$(cat ${db_stats} 2>/dev/null || echo "Database statistics not available")
\`\`\`

## Server Health Status
\`\`\`json
$(if [ -f "${health_after}" ]; then cat "${health_after}"; else echo "Server health status not available"; fi)
\`\`\`

## Conclusion
This test was executed on ${formatted_date} against the endpoint corresponding to the ${test_script} script.
For detailed information, please review the full output in the summary.json file.
EOF

    echo "SUMMARY.md criado com sucesso em ${result_dir}/SUMMARY.md"
}

# Função para listar os testes disponíveis
list_available_tests() {
    echo "Testes disponíveis:"
    echo ""
    echo "Testes de fumaça (smoke):"
    ls -1 "$SCRIPTS_DIR/smoke-"*.js 2>/dev/null | sed 's/.*\/\(smoke-.*\)\.js/  \1/' || echo "  Nenhum teste de fumaça disponível"
    echo ""
    echo "Testes de carga (load):"
    ls -1 "$SCRIPTS_DIR/load-"*.js 2>/dev/null | sed 's/.*\/\(load-.*\)\.js/  \1/' || echo "  Nenhum teste de carga disponível"
    echo ""
    echo "Testes de stress (stress):"
    ls -1 "$SCRIPTS_DIR/stress-"*.js 2>/dev/null | sed 's/.*\/\(stress-.*\)\.js/  \1/' || echo "  Nenhum teste de stress disponível"
    echo ""
}

# Verifica se o mongosh está instalado
check_dependencies() {
    if ! command -v mongosh &> /dev/null; then
        echo "Erro: mongosh não está instalado."
        echo "Instalando mongosh..."
        
        # Instalar mongosh
        curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
            sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor
        
        echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg] http://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | \
            sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
        
        sudo apt-get update
        sudo apt-get install -y mongodb-mongosh
    fi
}

# Menu principal
case "$1" in
    run)
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "Uso: $0 run <tipo_do_teste> <script_de_teste>"
            echo "Exemplo: $0 run smoke smoke-memorize-apikey"
            exit 1
        fi
        check_dependencies
        run_test "$2" "$3"
        ;;
    list)
        list_available_tests
        ;;
    *)
        echo "Uso: $0 {run|list}"
        echo ""
        echo "  run <tipo_do_teste> <script_de_teste> - Executa um teste específico"
        echo "  list - Lista todos os testes disponíveis"
        echo ""
        echo "Exemplos:"
        echo "  $0 run smoke smoke-memorize-apikey"
        echo "  $0 list"
        ;;
esac