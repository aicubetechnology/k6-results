# Resultado do Teste: stress-memorize-apikey-env (b200)

Data e hora: 03/06/2025 06:00:46

## Detalhes do Teste

* **Script:** stress-memorize-apikey-env
* **Tipo de Teste:** stress
* **Endpoint:** /memorize
* **Método:** POST
* **Servidor:** b200 (http://150.136.65.20:8000)
* **Tenant ID:** qube_assistant_tenant_b200_test_033_5_workers
* **Agent ID:** agent_test_b200_bench046_maxpool_200_workers_1_vus_100

## Configuração do Teste

* **Usuários Virtuais (VUs):** Até 100 VUs
* **Rampa de Carga:**
  * 0-10s: Aumento de 1 para 50 VUs
  * 10-30s: Aumento de 50 para 100 VUs
  * 30-90s: Manutenção de 100 VUs
  * 90-100s: Redução de 100 para 0 VUs
* **Duração Total:** 100 segundos (planejada), 105 segundos (real)
* **Timeout por Requisição:** 15s
* **Sleep entre Requisições:** 0.05 segundos

## Variáveis de Ambiente Utilizadas

```
SSH_AGENT_LAUNCHER=gnome-keyring
SCRIPT_NAME=stress-memorize-apikey-env
MAX_VUS=100
TEST_TYPE=stress
GPG_AGENT_INFO=/run/user/1000/gnupg/S.gpg-agent:0:1
API_KEY=*****0d5ab
BENCH_SESSION=bench-session-046
API_BASE_URL=http://150.136.65.20:8000
TENANT_ID=qube_assistant_tenant_b200_test_033_5_workers
AGENT_ID=agent_test_b200_bench046_maxpool_200_workers_1_vus_100
SERVER_TYPE=b200
SLEEP_BETWEEN_REQUESTS=0.05
REQUEST_TIMEOUT=15s
```

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 105 segundos
* **Requisições Completadas:** 0
* **Taxa de Requisições:** 0,00 req/s

## Verificação da Saúde do Banco de Dados

Baseado nas estatísticas do tenant, os seguintes dados foram observados:

### Antes do Teste
* **Total de memórias:** null
* **Tempo da memória mais antiga:** null
* **Tempo da memória mais recente:** null
* **Quantidade de agentes:** null
* **Distribuição por agente:**


### Após o Teste
* **Total de memórias:** null
* **Tempo da memória mais antiga:** null
* **Tempo da memória mais recente:** null
* **Quantidade de agentes:** null
* **Distribuição por agente:**


### Memórias Criadas Durante o Teste
* **Quantidade total:** 0
* **Taxa média de armazenamento:** 0,00 memórias/segundo

## Saída do k6

```
     data_received..................:      data_received..................: 812 kB 8.1 kB/s
     data_sent......................:      data_sent......................: 1.5 MB 15 kB/s
   ✗ http_req_duration..............: avg=2.62s   min=148.54ms med=3.01s  max=5.23s    p(90)=3.36s   p(95)=3.46s   
   ✓ http_req_failed................: 0.00%  ✓ 0         ✗ 3134 
     http_reqs......................: 3134   31.339156/s
     iterations.....................: 3134   31.339156/s
     vus............................: 1      min=1       max=100
     vus_max........................: 100    min=100     max=100
     http_req_waiting...............:      http_req_waiting...............: avg=2.61s   min=148.31ms med=3s     max=5.22s    p(90)=3.35s   p(95)=3.45s   
```

## Saúde do Servidor (b200)

### Saúde do Servidor Antes do Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-06-03T06:00:46.007165"
}
```

### Saúde do Servidor Após o Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-06-03T06:02:31.283931"
}
```

## Análise de Erros e Timeouts

```\n   ✓ http_req_failed................: 0.00%  ✓ 0         ✗ 3134 \n```

## Conclusão do Teste

Este teste de stress simulou até  usuários virtuais fazendo inserções de memórias simultâneas ao endpoint `/memorize`. Os resultados indicam o comportamento do sistema sob carga moderada.

### Observações e Recomendações

1. O sistema processou 0 requisições durante o teste com uma taxa média de 0,00 req/s.
2. Foram detectados alguns erros/timeouts, indicando possíveis limitações do sistema neste nível de carga.
3. O sistema demonstrou bom desempenho para este nível de carga.
4. Recomenda-se monitorar os recursos do servidor (CPU, memória, rede) durante testes futuros para identificar possíveis gargalos.
