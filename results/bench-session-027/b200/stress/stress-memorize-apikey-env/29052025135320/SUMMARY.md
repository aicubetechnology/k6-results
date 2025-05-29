# Resultado do Teste: stress-memorize-apikey-env (b200)

Data e hora: 29/05/2025 16:53:13

## Detalhes do Teste

* **Script:** stress-memorize-apikey-env
* **Tipo de Teste:** stress
* **Endpoint:** /memorize
* **Método:** POST
* **Servidor:** b200 (http://150.136.65.20:8000)
* **Tenant ID:** qube_assistant_tenant_b200_test_16
* **Agent ID:** agent_test_b200_bench027

## Configuração do Teste

* **Usuários Virtuais (VUs):** Até 25000 VUs
* **Rampa de Carga:**
  * 0-30s: Aumento de 50 para 200 VUs
  * 30-60s: Aumento de 200 para 400 VUs
  * 60-90s: Aumento de 400 para 600 VUs
  * 90-120s: Aumento de 600 para 800 VUs
  * 120-150s: Aumento de 800 para 25000 VUs
  * 150-210s: Manutenção de 25000 VUs
  * 210-240s: Redução de 25000 para 0 VUs
* **Duração Total:** 240 segundos (planejada), 258 segundos (real)
* **Timeout por Requisição:** 15s
* **Sleep entre Requisições:** 0.05 segundos

## Variáveis de Ambiente Utilizadas

```
SSH_AGENT_LAUNCHER=gnome-keyring
SCRIPT_NAME=stress-memorize-apikey-env
MAX_VUS=25000
TEST_TYPE=stress
GPG_AGENT_INFO=/run/user/1000/gnupg/S.gpg-agent:0:1
API_KEY=qube_77414ea646db4424a014e3e119d54e80
BENCH_SESSION=bench-session-027
API_BASE_URL=http://150.136.65.20:8000
TENANT_ID=qube_assistant_tenant_b200_test_16
AGENT_ID=agent_test_b200_bench027
SERVER_TYPE=b200
SLEEP_BETWEEN_REQUESTS=0.05
REQUEST_TIMEOUT=15s
```

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 258 segundos
* **Requisições Completadas:** 50982
* **Taxa de Requisições:** 197,60 req/s

## Verificação da Saúde do Banco de Dados

Baseado nas estatísticas do tenant, os seguintes dados foram observados:

### Antes do Teste
* **Total de memórias:** 53605
* **Tempo da memória mais antiga:** 2025-05-29T13:35:31.337000
* **Tempo da memória mais recente:** 2025-05-29T16:52:48.514000
* **Quantidade de agentes:** 2
* **Distribuição por agente:**
  * agent_test_b200_bench026: 53600
  * agent_test_h100_bench009: 5

### Após o Teste
* **Total de memórias:** 104587
* **Tempo da memória mais antiga:** 2025-05-29T13:35:31.337000
* **Tempo da memória mais recente:** 2025-05-29T17:02:06.504000
* **Quantidade de agentes:** 3
* **Distribuição por agente:**
  * agent_test_b200_bench026: 53600
  * agent_test_b200_bench027: 50982
  * agent_test_h100_bench009: 5

### Memórias Criadas Durante o Teste
* **Quantidade total:** 50982
* **Taxa média de armazenamento:** 197,60 memórias/segundo

## Saída do k6

```
     data_received..................:      data_received..................: 3.0 MB 12 kB/s
     data_sent......................:      data_sent......................: 23 MB  90 kB/s
   ✗ http_req_duration..............: avg=5.33s    min=0s      med=725.9ms  max=17.2s  p(90)=14.87s  p(95)=15s     
   ✗ http_req_failed................: 87.62% ✓ 83312      ✗ 11762  
     http_reqs......................: 95074  380.255812/s
     iterations.....................: 89551  358.166147/s
     vus............................: 285    min=0        max=25000
     vus_max........................: 25000  min=8695     max=25000
     http_req_waiting...............:      http_req_waiting...............: avg=5.3s     min=0s      med=698.09ms max=17.2s  p(90)=14.87s  p(95)=15s     
```

## Saúde do Servidor (b200)

### Saúde do Servidor Antes do Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-29T16:53:13.147569"
}
```

### Saúde do Servidor Após o Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-29T16:57:31.465226"
}
```

## Análise de Erros e Timeouts

```\n   ✗ http_req_failed................: 87.62% ✓ 83312      ✗ 11762  \n```

## Conclusão do Teste

Este teste de stress simulou até  usuários virtuais fazendo inserções de memórias simultâneas ao endpoint `/memorize`. Os resultados indicam o comportamento do sistema sob carga extremamente alta.

### Observações e Recomendações

1. O sistema processou 50982 requisições durante o teste com uma taxa média de 197,60 req/s.
2. Foram detectados alguns erros/timeouts, indicando possíveis limitações do sistema neste nível de carga.
3. Para melhorar o desempenho sob cargas elevadas, considere otimizar o processamento de requisições ou aumentar os recursos do servidor.
4. Recomenda-se monitorar os recursos do servidor (CPU, memória, rede) durante testes futuros para identificar possíveis gargalos.
