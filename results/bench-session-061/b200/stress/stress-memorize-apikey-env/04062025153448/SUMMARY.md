# Resultado do Teste: stress-memorize-apikey-env (b200)

Data e hora: 04/06/2025 18:34:33

## Detalhes do Teste

* **Script:** stress-memorize-apikey-env
* **Tipo de Teste:** stress
* **Endpoint:** /memorize
* **Método:** POST
* **Servidor:** b200 (http://150.136.65.20:8000)
* **Tenant ID:** qube_assistant_tenant_b200_test_033_5_workers
* **Agent ID:** agent_test_b200_bench061maxpool_12_workers_16_vus500

## Configuração do Teste

* **Usuários Virtuais (VUs):** Até 500 VUs
* **Rampa de Carga:**
  * 0-20s: Aumento de 1 para 100 VUs
  * 20-40s: Aumento de 100 para 200 VUs
  * 40-60s: Aumento de 200 para 300 VUs
  * 60-80s: Aumento de 300 para 400 VUs
  * 80-100s: Aumento de 400 para 500 VUs
  * 100-160s: Manutenção de 500 VUs
  * 160-180s: Redução de 500 para 0 VUs
* **Duração Total:** 180 segundos (planejada), 188 segundos (real)
* **Timeout por Requisição:** 15s
* **Sleep entre Requisições:** 0.1 segundos

## Variáveis de Ambiente Utilizadas

```
SSH_AGENT_LAUNCHER=gnome-keyring
SCRIPT_NAME=stress-memorize-apikey-env
MAX_VUS=500
TEST_TYPE=stress
GPG_AGENT_INFO=/run/user/1000/gnupg/S.gpg-agent:0:1
API_KEY=*****0d5ab
BENCH_SESSION=bench-session-061
API_BASE_URL=http://150.136.65.20:8000
TENANT_ID=qube_assistant_tenant_b200_test_033_5_workers
AGENT_ID=agent_test_b200_bench061maxpool_12_workers_16_vus500
SERVER_TYPE=b200
SLEEP_BETWEEN_REQUESTS=0.1
REQUEST_TIMEOUT=15s
```

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 188 segundos
* **Requisições Completadas:** 7892
* **Taxa de Requisições:** 41,98 req/s

### Análise de Tempos de Operação

#### Cálculo de Embeddings
O cálculo de embeddings é uma operação significativamente demorada, representando o principal gargalo no processamento de memórias. A análise a seguir é baseada em medições realizadas durante o teste:

| Métrica | Valor |
|---------|-------|
| Quantidade de cálculos analisados | 16 |
| Tempo médio | 118.24 ms |
| Tempo mínimo | 70.42 ms |
| Tempo máximo | 481.40 ms |

Exemplo de logs gerados:
```
2025-06-04 05:08:28 - qube.memory_manager - INFO - EMBEDDING - calculate_embedding completed in 73.43ms [text_length=61]
2025-06-04 05:08:29 - qube.memory_manager - INFO - EMBEDDING - calculate_embedding completed in 75.73ms [text_length=61]
2025-06-04 05:08:29 - qube.memory_manager - INFO - EMBEDDING - calculate_embedding completed in 481.40ms [text_length=61]
2025-06-04 05:08:29 - qube.memory_manager - INFO - EMBEDDING - calculate_embedding completed in 152.99ms [text_length=61]
2025-06-04 05:08:30 - qube.memory_manager - INFO - EMBEDDING - calculate_embedding completed in 234.56ms [text_length=61]
```

#### Comparação com Outras Operações

Operação | Tempo Médio (ms)
---------|------------------
Validação de API key | 1.91
Inserção de memória no MongoDB | 7.80
Atualização de contador de tenant | 5.96
**Cálculo de embedding** | **118.24**

O cálculo de embedding é claramente a operação mais demorada no fluxo de processamento, consumindo aproximadamente **87%** do tempo total de processamento de uma memória.

## Verificação da Saúde do Banco de Dados

Baseado nas estatísticas do tenant, os seguintes dados foram observados:

### Antes do Teste
* **Total de memórias:** 64886
* **Tempo da memória mais antiga:** null
* **Tempo da memória mais recente:** null
* **Quantidade de agentes:** 18
* **Distribuição por agente:**
  * agent_test_b200_bench034_maxpool_20: 605
  * agent_test_b200_bench034: 671
  * agent_test_b200_bench046_maxpool_200_workers_1_vus_100: 3134
  * agent_test_b200_bench059maxpool_200_workers_1_vus100: 5512
  * agent_test_b200_bench044_maxpool_200_workers_1_vus_250: 3286
  * agent_test_b200_bench035_maxpool_20: 2262
  * agent_test_b200_bench060maxpool_25_workers_8_vus100: 3616
  * agent_test_b200_bench041_maxpool_100_workers_1_vus_250: 7271
  * agent_test_b200_bench039_maxpool_100_workers_1_vus_50: 3091
  * agent_test_b200_bench060maxpool_200_workers_1_vus100: 5443
  * agent_test_b200_bench045_maxpool_200_workers_1_vus_500: 5771
  * agent_test_b200_bench035_maxpool_10_workers_1: 3331
  * agent_test_b200_bench040_maxpool_100_workers_1_vus_150: 3315
  * agent_test_b200_bench033: 2259
  * agent_test_h100_bench009: 8
  * agent_test_b200_bench038_maxpool_100_workers_1: 3117
  * agent_test_b200_bench043_maxpool_200_workers_1_vus_500: 5872
  * agent_test_b200_bench037_maxpool_20_workers_1: 6322

### Após o Teste
* **Total de memórias:** 72778
* **Tempo da memória mais antiga:** null
* **Tempo da memória mais recente:** null
* **Quantidade de agentes:** 19
* **Distribuição por agente:**
  * agent_test_b200_bench034_maxpool_20: 605
  * agent_test_b200_bench034: 671
  * agent_test_b200_bench046_maxpool_200_workers_1_vus_100: 3134
  * agent_test_b200_bench059maxpool_200_workers_1_vus100: 5512
  * agent_test_b200_bench044_maxpool_200_workers_1_vus_250: 3286
  * agent_test_b200_bench035_maxpool_20: 2262
  * agent_test_b200_bench060maxpool_25_workers_8_vus100: 3616
  * agent_test_b200_bench041_maxpool_100_workers_1_vus_250: 7271
  * agent_test_b200_bench039_maxpool_100_workers_1_vus_50: 3091
  * agent_test_b200_bench060maxpool_200_workers_1_vus100: 5443
  * agent_test_b200_bench045_maxpool_200_workers_1_vus_500: 5771
  * agent_test_b200_bench035_maxpool_10_workers_1: 3331
  * agent_test_b200_bench040_maxpool_100_workers_1_vus_150: 3315
  * agent_test_b200_bench033: 2259
  * agent_test_h100_bench009: 8
  * agent_test_b200_bench061maxpool_12_workers_16_vus500: 7893
  * agent_test_b200_bench038_maxpool_100_workers_1: 3117
  * agent_test_b200_bench043_maxpool_200_workers_1_vus_500: 5872
  * agent_test_b200_bench037_maxpool_20_workers_1: 6322

### Memórias Criadas Durante o Teste
* **Quantidade total:** 7892
* **Taxa média de armazenamento:** 41,98 memórias/segundo

## Saída do k6

```
     data_received..................:      data_received..................: 1.3 MB 7.5 kB/s
     data_sent......................:      data_sent......................: 3.8 MB 21 kB/s
   ✗ http_req_duration..............: avg=7.42s   min=253.24ms med=4.1s     max=15s      p(90)=14.88s   p(95)=15s     
   ✗ http_req_failed................: 35.63% ✓ 2869      ✗ 5183 
     http_reqs......................: 8052   44.714239/s
     iterations.....................: 8052   44.714239/s
     vus............................: 7      min=7       max=500
     vus_max........................: 500    min=500     max=500
     http_req_waiting...............:      http_req_waiting...............: avg=7.34s   min=136.18ms med=3.97s    max=15s      p(90)=14.88s   p(95)=15s     
```

## Saúde do Servidor (b200)

### Saúde do Servidor Antes do Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-06-04T18:34:33.997602"
}
```

### Saúde do Servidor Após o Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-06-04T18:37:41.757851"
}
```

## Análise de Erros e Timeouts

```\n   ✗ http_req_failed................: 35.63% ✓ 2869      ✗ 5183 \n```

## Conclusão do Teste

Este teste de stress simulou até  usuários virtuais fazendo inserções de memórias simultâneas ao endpoint `/memorize`. Os resultados indicam o comportamento do sistema sob carga alta.

### Observações e Recomendações

1. O sistema processou 7892 requisições durante o teste com uma taxa média de 41,98 req/s.
2. Foram detectados alguns erros/timeouts, indicando possíveis limitações do sistema neste nível de carga.
3. O cálculo de embeddings representa o principal gargalo de performance, com tempo médio de 118.24 ms por operação.
4. Recomendações para melhorar a performance:
   - **Otimização de modelo**: Considerar modelos de embedding mais leves
   - **Paralelização**: Implementar processamento paralelo para cálculo de embeddings
   - **Melhorias no cache**: Expandir estratégias de cache para incluir textos similares
   - **Hardware dedicado**: Considerar GPUs para aceleração de cálculos
