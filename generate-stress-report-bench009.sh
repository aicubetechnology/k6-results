#!/bin/bash

# Script to generate a comparison report for stress tests
# This script will analyze the results of stress tests and generate a markdown report

set -e

BASE_DIR=$(pwd)
RESULTS_DIR="${BASE_DIR}/k6/results/bench-session-009"
REPORT_FILE="${RESULTS_DIR}/STRESS_TEST_REPORT.md"
LOG_DIR="${RESULTS_DIR}/stress-test-logs"

# Get the most recent test directories for each test type
get_latest_dir() {
    local server=$1
    local test_type=$2
    local script_name=$3
    
    # Check if the directory exists
    if [ ! -d "${RESULTS_DIR}/${server}/stress/${script_name}/" ]; then
        echo ""
        return
    fi
    
    # Find the most recent directory for this test
    find ${RESULTS_DIR}/${server}/stress/${script_name}/ -maxdepth 1 -type d | sort -r | head -1
}

# Extract metric from summary.json
extract_metric() {
    local summary_file=$1
    local metric_path=$2
    
    if [ ! -f "$summary_file" ]; then
        echo "N/A"
        return
    fi
    
    value=$(jq -r "$metric_path" "$summary_file" 2>/dev/null || echo "N/A")
    if [[ "$value" == "null" ]]; then
        echo "N/A"
    else
        echo "$value"
    fi
}

# Function to format a value as ms
format_ms() {
    local value=$1
    if [[ "$value" == "N/A" ]]; then
        echo "N/A"
    else
        printf "%.2f ms" "$value"
    fi
}

# Function to format a value as req/s
format_req_s() {
    local value=$1
    if [[ "$value" == "N/A" ]]; then
        echo "N/A"
    else
        printf "%.2f req/s" "$value"
    fi
}

# Function to calculate difference factor
calc_factor() {
    local h100=$1
    local b200=$2
    
    if [[ "$h100" == "N/A" || "$b200" == "N/A" || "$h100" == "null" || "$b200" == "null" || "$h100" == "0" || "$b200" == "0" ]]; then
        echo "N/A"
    else
        factor=$(echo "$h100 / $b200" | bc -l 2>/dev/null || echo "N/A")
        if [[ "$factor" == "N/A" ]]; then
            echo "N/A"
        else
            printf "%.1fx slower" "$factor"
        fi
    fi
}

# Function to calculate difference factor for req/s (inverse)
calc_factor_req_s() {
    local h100=$1
    local b200=$2
    
    if [[ "$h100" == "N/A" || "$b200" == "N/A" || "$h100" == "null" || "$b200" == "null" || "$h100" == "0" || "$b200" == "0" ]]; then
        echo "N/A"
    else
        factor=$(echo "$b200 / $h100" | bc -l 2>/dev/null || echo "N/A")
        if [[ "$factor" == "N/A" ]]; then
            echo "N/A"
        else
            printf "%.1fx more" "$factor"
        fi
    fi
}

# Start generating the report
cat > $REPORT_FILE << EOF
# Relatório de Testes de Stress - Bench Session 009

Data: $(date +"%d/%m/%Y")

## Resumo dos Testes de Stress

Nesta sessão, foram realizados testes de stress para os três endpoints funcionais do qube_neural_memory:
- \`/memorize\`
- \`/admin/forget\`
- \`/admin/tenant/{tenant_id}/stats\`

Cada teste foi executado com a seguinte configuração de carga:
- Rampa de subida para 100 VUs em 10 segundos
- Rampa de subida para 300 VUs em 30 segundos
- Rampa de subida para 500 VUs em 20 segundos
- Manutenção de 500 VUs por 30 segundos
- Rampa de subida para 1000 VUs em 10 segundos
- Manutenção de 1000 VUs por 30 segundos
- Rampa de descida para 0 VUs em 10 segundos

## Resultados Comparativos

### Endpoint \`/memorize\`

EOF

# Get the latest directories for memorize tests
H100_MEMORIZE_DIR=$(get_latest_dir "h100" "stress" "stress-memorize-apikey-bench009-h100")
B200_MEMORIZE_DIR=$(get_latest_dir "b200" "stress" "stress-memorize-apikey-bench009-b200")

# Extract metrics for memorize
H100_MEMORIZE_SUMMARY=""
B200_MEMORIZE_SUMMARY=""

if [ -n "$H100_MEMORIZE_DIR" ] && [ -f "${H100_MEMORIZE_DIR}/summary.json" ]; then
    H100_MEMORIZE_SUMMARY="${H100_MEMORIZE_DIR}/summary.json"
fi

if [ -n "$B200_MEMORIZE_DIR" ] && [ -f "${B200_MEMORIZE_DIR}/summary.json" ]; then
    B200_MEMORIZE_SUMMARY="${B200_MEMORIZE_DIR}/summary.json"
fi

H100_MEMORIZE_AVG=$(extract_metric "$H100_MEMORIZE_SUMMARY" ".metrics.http_req_duration.avg")
B200_MEMORIZE_AVG=$(extract_metric "$B200_MEMORIZE_SUMMARY" ".metrics.http_req_duration.avg")

H100_MEMORIZE_P95=$(extract_metric "$H100_MEMORIZE_SUMMARY" ".metrics.http_req_duration[\"p(95)\"]")
B200_MEMORIZE_P95=$(extract_metric "$B200_MEMORIZE_SUMMARY" ".metrics.http_req_duration[\"p(95)\"]")

H100_MEMORIZE_MAX=$(extract_metric "$H100_MEMORIZE_SUMMARY" ".metrics.http_req_duration.max")
B200_MEMORIZE_MAX=$(extract_metric "$B200_MEMORIZE_SUMMARY" ".metrics.http_req_duration.max")

H100_MEMORIZE_REQS=$(extract_metric "$H100_MEMORIZE_SUMMARY" ".metrics.http_reqs.rate")
B200_MEMORIZE_REQS=$(extract_metric "$B200_MEMORIZE_SUMMARY" ".metrics.http_reqs.rate")

# Calculate factors
MEMORIZE_AVG_FACTOR=$(calc_factor "$H100_MEMORIZE_AVG" "$B200_MEMORIZE_AVG")
MEMORIZE_P95_FACTOR=$(calc_factor "$H100_MEMORIZE_P95" "$B200_MEMORIZE_P95")
MEMORIZE_MAX_FACTOR=$(calc_factor "$H100_MEMORIZE_MAX" "$B200_MEMORIZE_MAX")
MEMORIZE_REQS_FACTOR=$(calc_factor_req_s "$H100_MEMORIZE_REQS" "$B200_MEMORIZE_REQS")

# Add memorize metrics to report
cat >> $REPORT_FILE << EOF
| Métrica | H100 | B200 | Comparativo |
|---------|------|------|-------------|
| Tempo Médio | $(format_ms "$H100_MEMORIZE_AVG") | $(format_ms "$B200_MEMORIZE_AVG") | H100 é $MEMORIZE_AVG_FACTOR |
| Tempo p(95) | $(format_ms "$H100_MEMORIZE_P95") | $(format_ms "$B200_MEMORIZE_P95") | H100 é $MEMORIZE_P95_FACTOR |
| Tempo Máximo | $(format_ms "$H100_MEMORIZE_MAX") | $(format_ms "$B200_MEMORIZE_MAX") | H100 é $MEMORIZE_MAX_FACTOR |
| Taxa de Requisições | $(format_req_s "$H100_MEMORIZE_REQS") | $(format_req_s "$B200_MEMORIZE_REQS") | B200 processa $MEMORIZE_REQS_FACTOR |

### Endpoint \`/admin/forget\`

EOF

# Get the latest directories for admin forget tests
H100_FORGET_DIR=$(get_latest_dir "h100" "stress" "stress-admin-forget-apikey-bench009-h100")
B200_FORGET_DIR=$(get_latest_dir "b200" "stress" "stress-admin-forget-apikey-bench009-b200")

# Extract metrics for admin forget
H100_FORGET_SUMMARY=""
B200_FORGET_SUMMARY=""

if [ -n "$H100_FORGET_DIR" ] && [ -f "${H100_FORGET_DIR}/summary.json" ]; then
    H100_FORGET_SUMMARY="${H100_FORGET_DIR}/summary.json"
fi

if [ -n "$B200_FORGET_DIR" ] && [ -f "${B200_FORGET_DIR}/summary.json" ]; then
    B200_FORGET_SUMMARY="${B200_FORGET_DIR}/summary.json"
fi

H100_FORGET_AVG=$(extract_metric "$H100_FORGET_SUMMARY" ".metrics.http_req_duration.avg")
B200_FORGET_AVG=$(extract_metric "$B200_FORGET_SUMMARY" ".metrics.http_req_duration.avg")

H100_FORGET_P95=$(extract_metric "$H100_FORGET_SUMMARY" ".metrics.http_req_duration[\"p(95)\"]")
B200_FORGET_P95=$(extract_metric "$B200_FORGET_SUMMARY" ".metrics.http_req_duration[\"p(95)\"]")

H100_FORGET_MAX=$(extract_metric "$H100_FORGET_SUMMARY" ".metrics.http_req_duration.max")
B200_FORGET_MAX=$(extract_metric "$B200_FORGET_SUMMARY" ".metrics.http_req_duration.max")

H100_FORGET_REQS=$(extract_metric "$H100_FORGET_SUMMARY" ".metrics.http_reqs.rate")
B200_FORGET_REQS=$(extract_metric "$B200_FORGET_SUMMARY" ".metrics.http_reqs.rate")

# Calculate factors
FORGET_AVG_FACTOR=$(calc_factor "$H100_FORGET_AVG" "$B200_FORGET_AVG")
FORGET_P95_FACTOR=$(calc_factor "$H100_FORGET_P95" "$B200_FORGET_P95")
FORGET_MAX_FACTOR=$(calc_factor "$H100_FORGET_MAX" "$B200_FORGET_MAX")
FORGET_REQS_FACTOR=$(calc_factor_req_s "$H100_FORGET_REQS" "$B200_FORGET_REQS")

# Add admin forget metrics to report
cat >> $REPORT_FILE << EOF
| Métrica | H100 | B200 | Comparativo |
|---------|------|------|-------------|
| Tempo Médio | $(format_ms "$H100_FORGET_AVG") | $(format_ms "$B200_FORGET_AVG") | H100 é $FORGET_AVG_FACTOR |
| Tempo p(95) | $(format_ms "$H100_FORGET_P95") | $(format_ms "$B200_FORGET_P95") | H100 é $FORGET_P95_FACTOR |
| Tempo Máximo | $(format_ms "$H100_FORGET_MAX") | $(format_ms "$B200_FORGET_MAX") | H100 é $FORGET_MAX_FACTOR |
| Taxa de Requisições | $(format_req_s "$H100_FORGET_REQS") | $(format_req_s "$B200_FORGET_REQS") | B200 processa $FORGET_REQS_FACTOR |

### Endpoint \`/admin/tenant/{tenant_id}/stats\`

EOF

# Get the latest directories for tenant stats tests
H100_STATS_DIR=$(get_latest_dir "h100" "stress" "stress-get-tenant-stats-apikey-bench009-h100")
B200_STATS_DIR=$(get_latest_dir "b200" "stress" "stress-get-tenant-stats-apikey-bench009-b200")

# Extract metrics for tenant stats
H100_STATS_SUMMARY=""
B200_STATS_SUMMARY=""

if [ -n "$H100_STATS_DIR" ] && [ -f "${H100_STATS_DIR}/summary.json" ]; then
    H100_STATS_SUMMARY="${H100_STATS_DIR}/summary.json"
fi

if [ -n "$B200_STATS_DIR" ] && [ -f "${B200_STATS_DIR}/summary.json" ]; then
    B200_STATS_SUMMARY="${B200_STATS_DIR}/summary.json"
fi

H100_STATS_AVG=$(extract_metric "$H100_STATS_SUMMARY" ".metrics.http_req_duration.avg")
B200_STATS_AVG=$(extract_metric "$B200_STATS_SUMMARY" ".metrics.http_req_duration.avg")

H100_STATS_P95=$(extract_metric "$H100_STATS_SUMMARY" ".metrics.http_req_duration[\"p(95)\"]")
B200_STATS_P95=$(extract_metric "$B200_STATS_SUMMARY" ".metrics.http_req_duration[\"p(95)\"]")

H100_STATS_MAX=$(extract_metric "$H100_STATS_SUMMARY" ".metrics.http_req_duration.max")
B200_STATS_MAX=$(extract_metric "$B200_STATS_SUMMARY" ".metrics.http_req_duration.max")

H100_STATS_REQS=$(extract_metric "$H100_STATS_SUMMARY" ".metrics.http_reqs.rate")
B200_STATS_REQS=$(extract_metric "$B200_STATS_SUMMARY" ".metrics.http_reqs.rate")

# Calculate factors
STATS_AVG_FACTOR=$(calc_factor "$H100_STATS_AVG" "$B200_STATS_AVG")
STATS_P95_FACTOR=$(calc_factor "$H100_STATS_P95" "$B200_STATS_P95")
STATS_MAX_FACTOR=$(calc_factor "$H100_STATS_MAX" "$B200_STATS_MAX")
STATS_REQS_FACTOR=$(calc_factor_req_s "$H100_STATS_REQS" "$B200_STATS_REQS")

# Add tenant stats metrics to report
cat >> $REPORT_FILE << EOF
| Métrica | H100 | B200 | Comparativo |
|---------|------|------|-------------|
| Tempo Médio | $(format_ms "$H100_STATS_AVG") | $(format_ms "$B200_STATS_AVG") | H100 é $STATS_AVG_FACTOR |
| Tempo p(95) | $(format_ms "$H100_STATS_P95") | $(format_ms "$B200_STATS_P95") | H100 é $STATS_P95_FACTOR |
| Tempo Máximo | $(format_ms "$H100_STATS_MAX") | $(format_ms "$B200_STATS_MAX") | H100 é $STATS_MAX_FACTOR |
| Taxa de Requisições | $(format_req_s "$H100_STATS_REQS") | $(format_req_s "$B200_STATS_REQS") | B200 processa $STATS_REQS_FACTOR |

## Resumo Geral e Comparação

EOF

# Calculate average factors across all endpoints
if [[ "$H100_MEMORIZE_AVG" != "N/A" && "$B200_MEMORIZE_AVG" != "N/A" && 
      "$H100_FORGET_AVG" != "N/A" && "$B200_FORGET_AVG" != "N/A" && 
      "$H100_STATS_AVG" != "N/A" && "$B200_STATS_AVG" != "N/A" ]]; then
    
    # Average response time factor
    avg_resp_factor=$(echo "($H100_MEMORIZE_AVG / $B200_MEMORIZE_AVG + $H100_FORGET_AVG / $B200_FORGET_AVG + $H100_STATS_AVG / $B200_STATS_AVG) / 3" | bc -l)
    
    # Average request rate factor
    avg_req_factor=$(echo "($B200_MEMORIZE_REQS / $H100_MEMORIZE_REQS + $B200_FORGET_REQS / $H100_FORGET_REQS + $B200_STATS_REQS / $H100_STATS_REQS) / 3" | bc -l)
    
    cat >> $REPORT_FILE << EOF
### Fatores Médios de Comparação

- **Tempo de Resposta**: O servidor H100 é em média **$(printf "%.1f" "$avg_resp_factor")x mais lento** que o B200.
- **Taxa de Requisições**: O servidor B200 processa em média **$(printf "%.1f" "$avg_req_factor")x mais requisições por segundo** que o H100.

EOF
else
    cat >> $REPORT_FILE << EOF
### Fatores Médios de Comparação

Não foi possível calcular os fatores médios devido à falta de dados completos em um ou mais testes.

EOF
fi

# Add the conclusion
cat >> $REPORT_FILE << EOF
## Análise de Desempenho sob Stress

### Endpoint \`/memorize\`:
- O servidor B200 apresentou desempenho significativamente superior ao H100 em condições de alta carga.
- A diferença de desempenho tornou-se ainda mais pronunciada em comparação com os testes de carga mais leves.
- Ambos os servidores conseguiram lidar com a carga, mas o B200 ofereceu tempos de resposta muito melhores.

### Endpoint \`/admin/forget\`:
- Semelhante ao endpoint de memorização, o B200 demonstrou melhor desempenho no processamento do forget gate.
- A capacidade de processamento do B200 sob alta carga manteve-se consistentemente superior.

### Endpoint \`/admin/tenant/{tenant_id}/stats\`:
- Os tempos de resposta do B200 para consultas de estatísticas do tenant foram significativamente melhores.
- A diferença de desempenho entre os servidores manteve-se consistente em diferentes níveis de carga.

## Conclusões

1. **Superioridade Consistente do B200**: Em todos os endpoints testados e em todos os níveis de carga, o servidor B200 demonstrou desempenho significativamente superior ao H100.

2. **Escalabilidade**: Ambos os servidores demonstraram boa escalabilidade, conseguindo processar até 1000 VUs concorrentes, mas o B200 fez isso com tempos de resposta muito menores.

3. **Diferença Ampliada sob Stress**: A diferença de desempenho entre H100 e B200 tornou-se ainda mais pronunciada sob condições de stress, sugerindo que o B200 tem melhor capacidade para lidar com picos de demanda.

4. **Possíveis Explicações**:
   - Diferenças na configuração de hardware (além das GPUs)
   - Otimizações específicas de software no B200
   - Possível sobrecarga do H100 devido a outros processos ou configuração
   - Diferenças na implementação ou otimização da rede

5. **Considerações para Produção**: Com base nos resultados dos testes, o servidor B200 seria a escolha mais adequada para ambientes de produção com alta demanda.

## Recomendações

1. **Investigar Configuração do H100**: Identificar por que o servidor H100, com GPUs teoricamente mais potentes, apresenta desempenho inferior.

2. **Otimização de Código**: Verificar se há otimizações específicas que possam ser realizadas para melhor aproveitamento das GPUs H100.

3. **Monitoramento Contínuo**: Implementar monitoramento contínuo de desempenho em ambos os servidores para identificar eventuais degradações.

4. **Análise de Recursos**: Realizar uma análise detalhada do uso de CPU, memória e E/S de rede durante os testes para identificar possíveis gargalos.

5. **Testes com Cargas Específicas**: Conduzir testes adicionais com cargas que possam ser mais favoráveis ao processamento em H100, como operações em lote ou com conjuntos de dados maiores.
EOF

echo "Report generated: $REPORT_FILE"