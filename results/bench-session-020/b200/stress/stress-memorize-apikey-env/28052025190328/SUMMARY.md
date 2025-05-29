# Resultado do Teste: stress-memorize-apikey-env (b200)

Data e hora: 28/05/2025 19:03:28

## Detalhes do Teste

* **Script:** stress-memorize-apikey-env
* **Tipo de Teste:** stress
* **Endpoint:** /memorize
* **Método:** POST
* **Servidor:** b200 (http://150.136.65.20:8000)
* **Tenant ID:** qube_assistant_tenant_b200_test_10
* **Agent ID:** agent_test_b200_bench020

## Configuração do Teste

* **Usuários Virtuais (VUs):** Até 1 VUs
* **Duração Total:** 19 segundos (real)
* **Timeout por Requisição:** 15s
* **Sleep entre Requisições:** 0.05 segundos

## Variáveis de Ambiente Utilizadas

```
QUBE_API_SERVICE_PORT_9000_TCP=tcp://172.16.226.89:9000
SCRIPT_NAME=stress-memorize-apikey-env
MAX_VUS=1
TEST_TYPE=stress
QUBE_API_SERVICE_PORT_9000_TCP_PORT=9000
QUBE_API_BASE_URL=https://auth.qube.aicube.ca
API_KEY=*****0fb79
QUBE_API_SERVICE_PORT_9000_TCP_PROTO=tcp
BENCH_SESSION=bench-session-020
API_BASE_URL=http://150.136.65.20:8000
STREAMLIT_SERVER_PORT=8501
QUBE_API_SERVICE_PORT_9000_TCP_ADDR=172.16.226.89
TENANT_ID=qube_assistant_tenant_b200_test_10
QUBE_API_SERVICE_SERVICE_HOST=172.16.226.89
AGENT_ID=agent_test_b200_bench020
QUBE_API_SERVICE_SERVICE_PORT_HTTP=9000
QUBE_API_SERVICE_PORT=tcp://172.16.226.89:9000
API_PROVIDER=anthropic
QUBE_API_KEY=*****pp3QAA
MAPBOX_API_KEY=
SERVER_TYPE=b200
SLEEP_BETWEEN_REQUESTS=0.05
REQUEST_TIMEOUT=15s
QUBE_API_SERVICE_SERVICE_PORT=9000
```

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 19 segundos
* **Requisições Completadas:** 0
* **Taxa de Requisições:** 0.00 req/s

## Verificação da Saúde do Banco de Dados

Baseado nas estatísticas do tenant, os seguintes dados foram observados:

### Antes do Teste
* **Total de memórias:** 281536
* **Tempo da memória mais antiga:** 2025-05-28T03:07:44.698000
* **Tempo da memória mais recente:** 2025-05-28T15:41:26.962000
* **Quantidade de agentes:** 9
* **Distribuição por agente:**
  * agent_test_b200_bench010: 123133
  * agent_test_b200_bench009: 71387
  * agent_test_b200: 44104
  * agent_test_b200_bench020: 27104
  * agent_test_b200_bench008: 15661
  * agent_test_b200_test: 79
  * agent_test_b200_test_2vu: 33
  * agent_test_b200_test_2vu2: 33
  * agent_test_h100_bench009: 2

### Após o Teste
* **Total de memórias:** 281536
* **Tempo da memória mais antiga:** 2025-05-28T03:07:44.698000
* **Tempo da memória mais recente:** 2025-05-28T15:41:26.962000
* **Quantidade de agentes:** 9
* **Distribuição por agente:**
  * agent_test_b200_bench010: 123133
  * agent_test_b200_bench009: 71387
  * agent_test_b200: 44104
  * agent_test_b200_bench020: 27104
  * agent_test_b200_bench008: 15661
  * agent_test_b200_test: 79
  * agent_test_b200_test_2vu: 33
  * agent_test_b200_test_2vu2: 33
  * agent_test_h100_bench009: 2

### Memórias Criadas Durante o Teste
* **Quantidade total:** 0
* **Taxa média de armazenamento:** 0.00 memórias/segundo

## Saída do k6

```
     data_received..................: 
     data_sent......................: 


     http_req_waiting...............: 
```

## Saúde do Servidor (b200)

### Saúde do Servidor Antes do Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-28T19:03:28.702446"
}
```

### Saúde do Servidor Após o Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-28T19:03:47.789216"
}
```

## Análise de Erros e Timeouts

Nenhum erro ou timeout foi detectado durante a execução do teste.

## Conclusão do Teste

Este teste de stress simulou até  usuários virtuais fazendo inserções de memórias simultâneas ao endpoint `/memorize`. Os resultados indicam o comportamento do sistema sob carga leve.

### Observações e Recomendações

1. O sistema processou 0 requisições durante o teste com uma taxa média de 0.00 req/s.
2. Não foram detectados erros ou timeouts, indicando estabilidade do sistema sob esta carga.
3. O sistema demonstrou bom desempenho para este nível de carga.
4. Recomenda-se monitorar os recursos do servidor (CPU, memória, rede) durante testes futuros para identificar possíveis gargalos.
