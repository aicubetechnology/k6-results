# Resultado do Teste: stress-memorize-apikey-env (b200)

Data e hora: 28/05/2025 19:15:50

## Detalhes do Teste

* **Script:** stress-memorize-apikey-env
* **Tipo de Teste:** stress
* **Endpoint:** /memorize
* **Método:** POST
* **Servidor:** b200 (http://150.136.65.20:8000)
* **Tenant ID:** qube_assistant_tenant_b200_test_10
* **Agent ID:** agent_test_b200_bench022

## Configuração do Teste

* **Usuários Virtuais (VUs):** Até 5000 VUs
* **Rampa de Carga:**
  * 0-30s: Aumento de 50 para 200 VUs
  * 30-60s: Aumento de 200 para 400 VUs
  * 60-90s: Aumento de 400 para 600 VUs
  * 90-120s: Aumento de 600 para 800 VUs
  * 120-150s: Aumento de 800 para 5000 VUs
  * 150-210s: Manutenção de 5000 VUs
  * 210-240s: Redução de 5000 para 0 VUs
* **Duração Total:** 240 segundos (planejada), 267 segundos (real)
* **Timeout por Requisição:** 15s
* **Sleep entre Requisições:** 0.05 segundos

## Variáveis de Ambiente Utilizadas

```
SSH_AGENT_LAUNCHER=gnome-keyring
SCRIPT_NAME=stress-memorize-apikey-env
MAX_VUS=5000
TEST_TYPE=stress
GPG_AGENT_INFO=/run/user/1000/gnupg/S.gpg-agent:0:1
API_KEY=*****0fb79
BENCH_SESSION=bench-session-022
API_BASE_URL=http://150.136.65.20:8000
TENANT_ID=qube_assistant_tenant_b200_test_10
AGENT_ID=agent_test_b200_bench022
SERVER_TYPE=b200
SLEEP_BETWEEN_REQUESTS=0.05
REQUEST_TIMEOUT=15s
```

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 267 segundos
* **Requisições Completadas:** 44430
* **Taxa de Requisições:** 166,40 req/s

## Verificação da Saúde do Banco de Dados

Baseado nas estatísticas do tenant, os seguintes dados foram observados:

### Antes do Teste
* **Total de memórias:** 283310
* **Tempo da memória mais antiga:** 2025-05-28T03:07:44.698000
* **Tempo da memória mais recente:** 2025-05-28T19:06:21.131000
* **Quantidade de agentes:** 9
* **Distribuição por agente:**
  * agent_test_b200_bench010: 123133
  * agent_test_b200_bench009: 71387
  * agent_test_b200: 44104
  * agent_test_b200_bench020: 28878
  * agent_test_b200_bench008: 15661
  * agent_test_b200_test: 79
  * agent_test_b200_test_2vu: 33
  * agent_test_b200_test_2vu2: 33
  * agent_test_h100_bench009: 2

### Após o Teste
* **Total de memórias:** 327740
* **Tempo da memória mais antiga:** 2025-05-28T03:07:44.698000
* **Tempo da memória mais recente:** 2025-05-28T19:23:44.960000
* **Quantidade de agentes:** 10
* **Distribuição por agente:**
  * agent_test_b200_bench010: 123133
  * agent_test_b200_bench009: 71387
  * agent_test_b200_bench022: 44430
  * agent_test_b200: 44104
  * agent_test_b200_bench020: 28878
  * agent_test_b200_bench008: 15661
  * agent_test_b200_test: 79
  * agent_test_b200_test_2vu2: 33
  * agent_test_b200_test_2vu: 33
  * agent_test_h100_bench009: 2

### Memórias Criadas Durante o Teste
* **Quantidade total:** 44430
* **Taxa média de armazenamento:** 166,40 memórias/segundo

## Saída do k6

```
     data_received..................:      data_received..................: 3.1 MB 13 kB/s
     data_sent......................:      data_sent......................: 19 MB  77 kB/s
   ✗ http_req_duration..............: avg=12.1s   min=0s       med=14.86s   max=15s      p(90)=14.88s   p(95)=14.88s  
   ✗ http_req_failed................: 71.67% ✓ 30570      ✗ 12081 
     http_reqs......................: 42651  170.609375/s
     iterations.....................: 42629  170.521373/s
     vus............................: 43     min=43       max=5000
     vus_max........................: 5000   min=5000     max=5000
     http_req_waiting...............:      http_req_waiting...............: avg=12.08s  min=0s       med=14.86s   max=15s      p(90)=14.88s   p(95)=14.88s  
```

## Saúde do Servidor (b200)

### Saúde do Servidor Antes do Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-28T19:15:50.255038"
}
```

### Saúde do Servidor Após o Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-28T19:20:17.166316"
}
```

## Análise de Erros e Timeouts

```\n   ✗ http_req_failed................: 71.67% ✓ 30570      ✗ 12081 \n```

## Conclusão do Teste

Este teste de stress simulou até  usuários virtuais fazendo inserções de memórias simultâneas ao endpoint `/memorize`. Os resultados indicam o comportamento do sistema sob carga extremamente alta.

### Observações e Recomendações

1. O sistema processou 44430 requisições durante o teste com uma taxa média de 166,40 req/s.
2. Foram detectados alguns erros/timeouts, indicando possíveis limitações do sistema neste nível de carga.
3. Para melhorar o desempenho sob cargas elevadas, considere otimizar o processamento de requisições ou aumentar os recursos do servidor.
4. Recomenda-se monitorar os recursos do servidor (CPU, memória, rede) durante testes futuros para identificar possíveis gargalos.
