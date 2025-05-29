# Resultado do Teste: stress-memorize-apikey-env (b200)

Data e hora: 28/05/2025 22:34:19

## Detalhes do Teste

* **Script:** stress-memorize-apikey-env
* **Tipo de Teste:** stress
* **Endpoint:** /memorize
* **Método:** POST
* **Servidor:** b200 (http://150.136.65.20:8000)
* **Tenant ID:** qube_assistant_tenant_b200_test_15
* **Agent ID:** agent_test_b200_bench024

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
* **Duração Total:** 240 segundos (planejada), 256 segundos (real)
* **Timeout por Requisição:** 15s
* **Sleep entre Requisições:** 0.05 segundos

## Variáveis de Ambiente Utilizadas

```
SSH_AGENT_LAUNCHER=gnome-keyring
SCRIPT_NAME=stress-memorize-apikey-env
MAX_VUS=5000
TEST_TYPE=stress
GPG_AGENT_INFO=/run/user/1000/gnupg/S.gpg-agent:0:1
API_KEY=*****a255e
BENCH_SESSION=bench-session-024
API_BASE_URL=http://150.136.65.20:8000
TENANT_ID=qube_assistant_tenant_b200_test_15
AGENT_ID=agent_test_b200_bench024
SERVER_TYPE=b200
SLEEP_BETWEEN_REQUESTS=0.05
REQUEST_TIMEOUT=15s
```

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 256 segundos
* **Requisições Completadas:** 44331
* **Taxa de Requisições:** 173,17 req/s

## Verificação da Saúde do Banco de Dados

Baseado nas estatísticas do tenant, os seguintes dados foram observados:

### Antes do Teste
* **Total de memórias:** 31110
* **Tempo da memória mais antiga:** 2025-05-28T21:48:41.572000
* **Tempo da memória mais recente:** 2025-05-28T22:32:11.785000
* **Quantidade de agentes:** 2
* **Distribuição por agente:**
  * agent_test_b200_bench024: 31093
  * agent_test_h100_bench009: 17

### Após o Teste
* **Total de memórias:** 75441
* **Tempo da memória mais antiga:** 2025-05-28T21:48:41.572000
* **Tempo da memória mais recente:** 2025-05-28T22:42:16.612000
* **Quantidade de agentes:** 2
* **Distribuição por agente:**
  * agent_test_b200_bench024: 75424
  * agent_test_h100_bench009: 17

### Memórias Criadas Durante o Teste
* **Quantidade total:** 44331
* **Taxa média de armazenamento:** 173,17 memórias/segundo

## Saída do k6

```
     data_received..................:      data_received..................: 2.9 MB 11 kB/s
     data_sent......................:      data_sent......................: 19 MB  77 kB/s
   ✗ http_req_duration..............: avg=12.14s  min=0s       med=14.86s   max=15s      p(90)=14.88s   p(95)=14.88s  
   ✗ http_req_failed................: 74.10% ✓ 31535      ✗ 11018 
     http_reqs......................: 42553  170.215549/s
     iterations.....................: 42535  170.143547/s
     vus............................: 37     min=37       max=5000
     vus_max........................: 5000   min=5000     max=5000
     http_req_waiting...............:      http_req_waiting...............: avg=12.14s  min=0s       med=14.86s   max=15s      p(90)=14.88s   p(95)=14.88s  
```

## Saúde do Servidor (b200)

### Saúde do Servidor Antes do Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-28T22:34:19.956003"
}
```

### Saúde do Servidor Após o Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-28T22:38:35.416550"
}
```

## Análise de Erros e Timeouts

```\n   ✗ http_req_failed................: 74.10% ✓ 31535      ✗ 11018 \n```

## Conclusão do Teste

Este teste de stress simulou até  usuários virtuais fazendo inserções de memórias simultâneas ao endpoint `/memorize`. Os resultados indicam o comportamento do sistema sob carga extremamente alta.

### Observações e Recomendações

1. O sistema processou 44331 requisições durante o teste com uma taxa média de 173,17 req/s.
2. Foram detectados alguns erros/timeouts, indicando possíveis limitações do sistema neste nível de carga.
3. Para melhorar o desempenho sob cargas elevadas, considere otimizar o processamento de requisições ou aumentar os recursos do servidor.
4. Recomenda-se monitorar os recursos do servidor (CPU, memória, rede) durante testes futuros para identificar possíveis gargalos.
