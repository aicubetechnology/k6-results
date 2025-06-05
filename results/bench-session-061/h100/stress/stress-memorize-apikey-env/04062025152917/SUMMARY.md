# Resultado do Teste: stress-memorize-apikey-env (h100)

Data e hora: 04/06/2025 18:29:03

## Detalhes do Teste

* **Script:** stress-memorize-apikey-env
* **Tipo de Teste:** stress
* **Endpoint:** /memorize
* **Método:** POST
* **Servidor:** h100 (http://130.61.226.26:8000)
* **Tenant ID:** qube_assistant_tenant_h100_test_033_5_workers_3
* **Agent ID:** agent_test_h100_bench061maxpool_12_workers_16_vus500

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
* **Duração Total:** 180 segundos (planejada), 196 segundos (real)
* **Timeout por Requisição:** 15s
* **Sleep entre Requisições:** 0.1 segundos

## Variáveis de Ambiente Utilizadas

```
SSH_AGENT_LAUNCHER=gnome-keyring
SCRIPT_NAME=stress-memorize-apikey-env
MAX_VUS=500
TEST_TYPE=stress
GPG_AGENT_INFO=/run/user/1000/gnupg/S.gpg-agent:0:1
API_KEY=*****3f4e3
BENCH_SESSION=bench-session-061
API_BASE_URL=http://130.61.226.26:8000
TENANT_ID=qube_assistant_tenant_h100_test_033_5_workers_3
AGENT_ID=agent_test_h100_bench061maxpool_12_workers_16_vus500
SERVER_TYPE=h100
SLEEP_BETWEEN_REQUESTS=0.1
REQUEST_TIMEOUT=15s
```

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 196 segundos
* **Requisições Completadas:** 6366
* **Taxa de Requisições:** 32,48 req/s

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
* **Total de memórias:** 35109
* **Tempo da memória mais antiga:** null
* **Tempo da memória mais recente:** null
* **Quantidade de agentes:** 34
* **Distribuição por agente:**
  * agent_test_h100_bench039_maxpool_100_workers_1_vus_50: 362
  * agent_test_h100_bench051maxpool_200_workers_1_vus3: 60
  * agent_test_h100_bench047_maxpool_200_workers_1_vus_100: 626
  * agent_test_h100_bench059maxpool_200_workers_1_vus100: 640
  * agent_test_h100_bench041_maxpool_100_workers_1_vus_250: 1453
  * agent_test_h100_bench051maxpool_200_workers_1_vus1: 120
  * agent_test_h100_bench053maxpool_200_workers_1_vus1: 120
  * agent_test_h100_bench060maxpool_12_workers_16_vus100: 2463
  * agent_test_h100_bench054maxpool_200_workers_1_vus1: 120
  * agent_test_h100_bench043_maxpool_200_workers_1_vus_500: 352
  * agent_test_h100_bench051maxpool_200_workers_1_vus5: 125
  * agent_test_h100_bench055maxpool_200_workers_1_vus100: 644
  * agent_test_h100_bench033: 2462
  * agent_test_h100_bench052_maxpool_200_workers_1_vus_1: 120
  * agent_test_h100_bench038_maxpool_100_workers_1: 630
  * agent_test_client: 1
  * agent_test_h100_bench052maxpool_200_workers_1_vus1: 120
  * agent_test_h100_bench037_maxpool_10_workers_1: 1255
  * agent_test_h100_bench051maxpool_200_workers_1_vus100: 1795
  * agent_test_h100_bench055maxpool_200_workers_1_vus1: 120
  * agent_test_h100_bench042_maxpool_200_workers_1_vus_250: 1451
  * agent_test_h100_bench046_maxpool_200_workers_1_vus_100: 634
  * agent_test_h100_bench051_maxpool_200_workers_1_vus_1: 120
  * agent_test_h100_bench048_maxpool_200_workers_1_vus_100: 631
  * agent_test_h100_bench056maxpool_200_workers_1_vus500: 4299
  * agent_test_h100_bench044_maxpool_200_workers_1_vus_500: 1937
  * agent_test_h100_bench036_maxpool_10_workers_1: 633
  * agent_test_h100_bench009: 56
  * agent_test_curl: 1
  * agent_test_h100_bench040_maxpool_100_workers_1_vus_150: 905
  * agent_test_h100_bench051maxpool_200_workers_1_vus10: 720
  * agent_test_h100_bench034: 1554
  * agent_test_h100_bench057maxpool_200_workers_1_vus500: 4300
  * agent_test_h100_bench045_maxpool_200_workers_1_vus_500: 4280

### Após o Teste
* **Total de memórias:** 41475
* **Tempo da memória mais antiga:** null
* **Tempo da memória mais recente:** null
* **Quantidade de agentes:** 35
* **Distribuição por agente:**
  * agent_test_h100_bench039_maxpool_100_workers_1_vus_50: 362
  * agent_test_h100_bench051maxpool_200_workers_1_vus3: 60
  * agent_test_h100_bench047_maxpool_200_workers_1_vus_100: 626
  * agent_test_h100_bench059maxpool_200_workers_1_vus100: 640
  * agent_test_h100_bench041_maxpool_100_workers_1_vus_250: 1453
  * agent_test_h100_bench051maxpool_200_workers_1_vus1: 120
  * agent_test_h100_bench053maxpool_200_workers_1_vus1: 120
  * agent_test_h100_bench060maxpool_12_workers_16_vus100: 2463
  * agent_test_h100_bench054maxpool_200_workers_1_vus1: 120
  * agent_test_h100_bench043_maxpool_200_workers_1_vus_500: 352
  * agent_test_h100_bench051maxpool_200_workers_1_vus5: 125
  * agent_test_h100_bench055maxpool_200_workers_1_vus100: 644
  * agent_test_h100_bench033: 2462
  * agent_test_h100_bench052_maxpool_200_workers_1_vus_1: 120
  * agent_test_h100_bench038_maxpool_100_workers_1: 630
  * agent_test_client: 1
  * agent_test_h100_bench052maxpool_200_workers_1_vus1: 120
  * agent_test_h100_bench037_maxpool_10_workers_1: 1255
  * agent_test_h100_bench051maxpool_200_workers_1_vus100: 1795
  * agent_test_h100_bench055maxpool_200_workers_1_vus1: 120
  * agent_test_h100_bench042_maxpool_200_workers_1_vus_250: 1451
  * agent_test_h100_bench046_maxpool_200_workers_1_vus_100: 634
  * agent_test_h100_bench051_maxpool_200_workers_1_vus_1: 120
  * agent_test_h100_bench048_maxpool_200_workers_1_vus_100: 631
  * agent_test_h100_bench056maxpool_200_workers_1_vus500: 4299
  * agent_test_h100_bench061maxpool_12_workers_16_vus500: 6366
  * agent_test_h100_bench044_maxpool_200_workers_1_vus_500: 1937
  * agent_test_h100_bench036_maxpool_10_workers_1: 633
  * agent_test_h100_bench009: 56
  * agent_test_curl: 1
  * agent_test_h100_bench040_maxpool_100_workers_1_vus_150: 905
  * agent_test_h100_bench051maxpool_200_workers_1_vus10: 720
  * agent_test_h100_bench034: 1554
  * agent_test_h100_bench057maxpool_200_workers_1_vus500: 4300
  * agent_test_h100_bench045_maxpool_200_workers_1_vus_500: 4280

### Memórias Criadas Durante o Teste
* **Quantidade total:** 6366
* **Taxa média de armazenamento:** 32,48 memórias/segundo

## Saída do k6

```
     data_received..................:      data_received..................: 1.3 MB 7.0 kB/s
     data_sent......................:      data_sent......................: 3.0 MB 16 kB/s
   ✗ http_req_duration..............: avg=9.58s    min=661.9ms  med=9.98s   max=15s      p(90)=14.8s    p(95)=15s     
   ✗ http_req_failed................: 21.01% ✓ 1309      ✗ 4919 
     http_reqs......................: 6228   33.965442/s
     iterations.....................: 6225   33.949081/s
     vus............................: 1      min=1       max=500
     vus_max........................: 500    min=500     max=500
     http_req_waiting...............:      http_req_waiting...............: avg=9.37s    min=473.01ms med=9.77s   max=15s      p(90)=14.8s    p(95)=14.81s  
```

## Saúde do Servidor (h100)

### Saúde do Servidor Antes do Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-06-04T18:29:03.751616"
}
```

### Saúde do Servidor Após o Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-06-04T18:32:19.247463"
}
```

## Análise de Erros e Timeouts

```\n   ✗ http_req_failed................: 21.01% ✓ 1309      ✗ 4919 \n```

## Conclusão do Teste

Este teste de stress simulou até  usuários virtuais fazendo inserções de memórias simultâneas ao endpoint `/memorize`. Os resultados indicam o comportamento do sistema sob carga alta.

### Observações e Recomendações

1. O sistema processou 6366 requisições durante o teste com uma taxa média de 32,48 req/s.
2. Foram detectados alguns erros/timeouts, indicando possíveis limitações do sistema neste nível de carga.
3. O cálculo de embeddings representa o principal gargalo de performance, com tempo médio de 118.24 ms por operação.
4. Recomendações para melhorar a performance:
   - **Otimização de modelo**: Considerar modelos de embedding mais leves
   - **Paralelização**: Implementar processamento paralelo para cálculo de embeddings
   - **Melhorias no cache**: Expandir estratégias de cache para incluir textos similares
   - **Hardware dedicado**: Considerar GPUs para aceleração de cálculos
