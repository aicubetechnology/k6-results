# Resultado do Teste: stress-memorize-apikey-env (h100)

Data e hora: 30/05/2025 23:42:42

## Detalhes do Teste

* **Script:** stress-memorize-apikey-env
* **Tipo de Teste:** stress
* **Endpoint:** /memorize
* **Método:** POST
* **Servidor:** h100 (http://130.61.226.26:8000)
* **Tenant ID:** qube_assistant_tenant_h100_test_032_5_workers
* **Agent ID:** agent_test_h100_bench032

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
* **Duração Total:** 240 segundos (planejada), 254 segundos (real)
* **Timeout por Requisição:** 15s
* **Sleep entre Requisições:** 0.05 segundos

## Variáveis de Ambiente Utilizadas

```
SSH_AGENT_LAUNCHER=gnome-keyring
SCRIPT_NAME=stress-memorize-apikey-env
MAX_VUS=25000
TEST_TYPE=stress
GPG_AGENT_INFO=/run/user/1000/gnupg/S.gpg-agent:0:1
API_KEY=*****076f1
BENCH_SESSION=bench-session-032
API_BASE_URL=http://130.61.226.26:8000
TENANT_ID=qube_assistant_tenant_h100_test_032_5_workers
AGENT_ID=agent_test_h100_bench032
SERVER_TYPE=h100
SLEEP_BETWEEN_REQUESTS=0.05
REQUEST_TIMEOUT=15s
```

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 254 segundos
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
     data_received..................:      data_received..................: 42 MB  170 kB/s
     data_sent......................:      data_sent......................: 125 MB 504 kB/s
   ✗ http_req_duration..............: avg=2.64s    min=0s      med=1.22s    max=21.81s p(90)=6.93s    p(95)=14.6s  
   ✗ http_req_failed................: 99.91% ✓ 312305      ✗ 262    
     http_reqs......................: 312567 1258.550344/s
     iterations.....................: 311143 1252.816611/s
     vus............................: 2      min=0         max=25000
     vus_max........................: 25000  min=9223      max=25000
     http_req_waiting...............:      http_req_waiting...............: avg=2.04s    min=0s      med=704.09ms max=21.79s p(90)=5.16s    p(95)=12.3s  
```

## Saúde do Servidor (h100)

### Saúde do Servidor Antes do Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-30T23:42:42.055075"
}
```

### Saúde do Servidor Após o Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-30T23:46:56.820655"
}
```

## Análise de Erros e Timeouts

```\n   ✗ http_req_failed................: 99.91% ✓ 312305      ✗ 262    \n```

## Conclusão do Teste

Este teste de stress simulou até  usuários virtuais fazendo inserções de memórias simultâneas ao endpoint `/memorize`. Os resultados indicam o comportamento do sistema sob carga extremamente alta.

### Observações e Recomendações

1. O sistema processou 0 requisições durante o teste com uma taxa média de 0,00 req/s.
2. Foram detectados alguns erros/timeouts, indicando possíveis limitações do sistema neste nível de carga.
3. Para melhorar o desempenho sob cargas elevadas, considere otimizar o processamento de requisições ou aumentar os recursos do servidor.
4. Recomenda-se monitorar os recursos do servidor (CPU, memória, rede) durante testes futuros para identificar possíveis gargalos.
