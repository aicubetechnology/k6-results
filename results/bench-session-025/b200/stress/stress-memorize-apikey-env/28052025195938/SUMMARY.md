# Resultado do Teste: stress-memorize-apikey-env (b200)

Data e hora: 28/05/2025 22:59:31

## Detalhes do Teste

* **Script:** stress-memorize-apikey-env
* **Tipo de Teste:** stress
* **Endpoint:** /memorize
* **Método:** POST
* **Servidor:** b200 (http://150.136.65.20:8000)
* **Tenant ID:** qube_assistant_tenant_b200_test_15
* **Agent ID:** agent_test_b200_bench025

## Configuração do Teste

* **Usuários Virtuais (VUs):** Até 15000 VUs
* **Rampa de Carga:**
  * 0-30s: Aumento de 50 para 200 VUs
  * 30-60s: Aumento de 200 para 400 VUs
  * 60-90s: Aumento de 400 para 600 VUs
  * 90-120s: Aumento de 600 para 800 VUs
  * 120-150s: Aumento de 800 para 15000 VUs
  * 150-210s: Manutenção de 15000 VUs
  * 210-240s: Redução de 15000 para 0 VUs
* **Duração Total:** 240 segundos (planejada), 258 segundos (real)
* **Timeout por Requisição:** 15s
* **Sleep entre Requisições:** 0.05 segundos

## Variáveis de Ambiente Utilizadas

```
SSH_AGENT_LAUNCHER=gnome-keyring
SCRIPT_NAME=stress-memorize-apikey-env
MAX_VUS=15000
TEST_TYPE=stress
GPG_AGENT_INFO=/run/user/1000/gnupg/S.gpg-agent:0:1
API_KEY=*****a255e
BENCH_SESSION=bench-session-025
API_BASE_URL=http://150.136.65.20:8000
TENANT_ID=qube_assistant_tenant_b200_test_15
AGENT_ID=agent_test_b200_bench025
SERVER_TYPE=b200
SLEEP_BETWEEN_REQUESTS=0.05
REQUEST_TIMEOUT=15s
```

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 258 segundos
* **Requisições Completadas:** 56591
* **Taxa de Requisições:** 219,34 req/s

## Verificação da Saúde do Banco de Dados

Baseado nas estatísticas do tenant, os seguintes dados foram observados:

### Antes do Teste
* **Total de memórias:** 75442
* **Tempo da memória mais antiga:** 2025-05-28T21:48:41.572000
* **Tempo da memória mais recente:** 2025-05-28T22:42:19.207000
* **Quantidade de agentes:** 2
* **Distribuição por agente:**
  * agent_test_b200_bench024: 75425
  * agent_test_h100_bench009: 17

### Após o Teste
* **Total de memórias:** 132033
* **Tempo da memória mais antiga:** 2025-05-28T21:48:41.572000
* **Tempo da memória mais recente:** 2025-05-28T23:09:05.515000
* **Quantidade de agentes:** 3
* **Distribuição por agente:**
  * agent_test_b200_bench024: 75425
  * agent_test_b200_bench025: 56591
  * agent_test_h100_bench009: 17

### Memórias Criadas Durante o Teste
* **Quantidade total:** 56591
* **Taxa média de armazenamento:** 219,34 memórias/segundo

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
  "timestamp": "2025-05-28T22:59:31.668202"
}
```

### Saúde do Servidor Após o Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-28T23:03:49.857322"
}
```

## Análise de Erros e Timeouts

Nenhum erro ou timeout foi detectado durante a execução do teste.

## Conclusão do Teste

Este teste de stress simulou até  usuários virtuais fazendo inserções de memórias simultâneas ao endpoint `/memorize`. Os resultados indicam o comportamento do sistema sob carga extremamente alta.

### Observações e Recomendações

1. O sistema processou 56591 requisições durante o teste com uma taxa média de 219,34 req/s.
2. Não foram detectados erros ou timeouts, indicando estabilidade do sistema sob esta carga.
3. Para melhorar o desempenho sob cargas elevadas, considere otimizar o processamento de requisições ou aumentar os recursos do servidor.
4. Recomenda-se monitorar os recursos do servidor (CPU, memória, rede) durante testes futuros para identificar possíveis gargalos.
