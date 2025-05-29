# Resultado do Teste: stress-memorize-apikey-env (b200)

Data e hora: 28/05/2025 20:02:01

## Detalhes do Teste

* **Script:** stress-memorize-apikey-env
* **Tipo de Teste:** stress
* **Endpoint:** /memorize
* **Método:** POST
* **Servidor:** b200 (http://150.136.65.20:8000)
* **Tenant ID:** qube_assistant_tenant_b200_test_11
* **Agent ID:** agent_test_b200_bench023

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
* **Duração Total:** 240 segundos (planejada), 255 segundos (real)
* **Timeout por Requisição:** 15s
* **Sleep entre Requisições:** 0.05 segundos

## Variáveis de Ambiente Utilizadas

```
SSH_AGENT_LAUNCHER=gnome-keyring
SCRIPT_NAME=stress-memorize-apikey-env
MAX_VUS=5000
TEST_TYPE=stress
GPG_AGENT_INFO=/run/user/1000/gnupg/S.gpg-agent:0:1
API_KEY=*****fcd6b
BENCH_SESSION=bench-session-023
API_BASE_URL=http://150.136.65.20:8000
TENANT_ID=qube_assistant_tenant_b200_test_11
AGENT_ID=agent_test_b200_bench023
SERVER_TYPE=b200
SLEEP_BETWEEN_REQUESTS=0.05
REQUEST_TIMEOUT=15s
```

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 255 segundos
* **Requisições Completadas:** 46351
* **Taxa de Requisições:** 181,77 req/s

## Verificação da Saúde do Banco de Dados

Baseado nas estatísticas do tenant, os seguintes dados foram observados:

### Antes do Teste
* **Total de memórias:** 606
* **Tempo da memória mais antiga:** 2025-05-28T19:56:36.185000
* **Tempo da memória mais recente:** 2025-05-28T20:00:10.823000
* **Quantidade de agentes:** 2
* **Distribuição por agente:**
  * agent_test_b200_bench023: 605
  * agent_test_h100_bench009: 1

### Após o Teste
* **Total de memórias:** 46957
* **Tempo da memória mais antiga:** 2025-05-28T19:56:36.185000
* **Tempo da memória mais recente:** 2025-05-28T20:10:13.766000
* **Quantidade de agentes:** 2
* **Distribuição por agente:**
  * agent_test_b200_bench023: 46956
  * agent_test_h100_bench009: 1

### Memórias Criadas Durante o Teste
* **Quantidade total:** 46351
* **Taxa média de armazenamento:** 181,77 memórias/segundo

## Saída do k6

```
     data_received..................:      data_received..................: 3.7 MB 15 kB/s
     data_sent......................:      data_sent......................: 20 MB  80 kB/s
   ✗ http_req_duration..............: avg=11.57s   min=0s       med=14.86s   max=15.01s   p(90)=14.88s   p(95)=14.88s  
   ✗ http_req_failed................: 68.31% ✓ 30468      ✗ 14131 
     http_reqs......................: 44599  178.394722/s
     iterations.....................: 44579  178.314723/s
     vus............................: 37     min=37       max=5000
     vus_max........................: 5000   min=5000     max=5000
     http_req_waiting...............:      http_req_waiting...............: avg=11.55s   min=0s       med=14.86s   max=15.01s   p(90)=14.88s   p(95)=14.88s  
```

## Saúde do Servidor (b200)

### Saúde do Servidor Antes do Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-28T20:02:01.773187"
}
```

### Saúde do Servidor Após o Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-28T20:06:16.397698"
}
```

## Análise de Erros e Timeouts

```\n   ✗ http_req_failed................: 68.31% ✓ 30468      ✗ 14131 \n```

## Conclusão do Teste

Este teste de stress simulou até  usuários virtuais fazendo inserções de memórias simultâneas ao endpoint `/memorize`. Os resultados indicam o comportamento do sistema sob carga extremamente alta.

### Observações e Recomendações

1. O sistema processou 46351 requisições durante o teste com uma taxa média de 181,77 req/s.
2. Foram detectados alguns erros/timeouts, indicando possíveis limitações do sistema neste nível de carga.
3. Para melhorar o desempenho sob cargas elevadas, considere otimizar o processamento de requisições ou aumentar os recursos do servidor.
4. Recomenda-se monitorar os recursos do servidor (CPU, memória, rede) durante testes futuros para identificar possíveis gargalos.
