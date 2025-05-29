# Resultado do Teste: stress-memorize-apikey-env (b200)

Data e hora: 28/05/2025 15:36:28

## Detalhes do Teste

* **Script:** stress-memorize-apikey-env
* **Tipo de Teste:** stress
* **Endpoint:** /memorize
* **Método:** POST
* **Servidor:** b200 (http://150.136.65.20:8000)
* **Tenant ID:** qube_assistant_tenant_b200_test_10
* **Agent ID:** agent_test_b200_bench020

## Configuração do Teste

* **Usuários Virtuais (VUs):** Até 2000 VUs
* **Rampa de Carga:**
  * 0-30s: Aumento de 50 para 200 VUs
  * 30-60s: Aumento de 200 para 400 VUs
  * 60-90s: Aumento de 400 para 600 VUs
  * 90-120s: Aumento de 600 para 800 VUs
  * 120-150s: Aumento de 800 para 2000 VUs
  * 150-210s: Manutenção de 2000 VUs
  * 210-240s: Redução de 2000 para 0 VUs
* **Duração Total:** 240 segundos (planejada), 262 segundos (real)
* **Timeout por Requisição:** 15s
* **Sleep entre Requisições:** 0.05 segundos

## Variáveis de Ambiente Utilizadas

```
SSH_AGENT_LAUNCHER=gnome-keyring
SCRIPT_NAME=stress-memorize-apikey-env
MAX_VUS=2000
TEST_TYPE=stress
GPG_AGENT_INFO=/run/user/1000/gnupg/S.gpg-agent:0:1
API_KEY=*****0fb79
BENCH_SESSION=bench-session-020
API_BASE_URL=http://150.136.65.20:8000
TENANT_ID=qube_assistant_tenant_b200_test_10
AGENT_ID=agent_test_b200_bench020
SERVER_TYPE=b200
SLEEP_BETWEEN_REQUESTS=0.05
REQUEST_TIMEOUT=15s
```

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 262 segundos
* **Requisições Completadas:** 27097
* **Taxa de Requisições:** 103,42 req/s

## Verificação da Saúde do Banco de Dados

Baseado nas estatísticas do tenant, os seguintes dados foram observados:

### Antes do Teste
* **Total de memórias:** 254432
* **Tempo da memória mais antiga:** 2025-05-28T03:07:44.698000
* **Tempo da memória mais recente:** 2025-05-28T15:28:29.189000
* **Quantidade de agentes:** 8
* **Distribuição por agente:**
  * agent_test_b200_bench010: 123133
  * agent_test_b200_bench009: 71387
  * agent_test_b200: 44104
  * agent_test_b200_bench008: 15661
  * agent_test_b200_test: 79
  * agent_test_b200_test_2vu2: 33
  * agent_test_b200_test_2vu: 33
  * agent_test_h100_bench009: 2

### Após o Teste
* **Total de memórias:** 281529
* **Tempo da memória mais antiga:** 2025-05-28T03:07:44.698000
* **Tempo da memória mais recente:** 2025-05-28T15:41:09.119000
* **Quantidade de agentes:** 9
* **Distribuição por agente:**
  * agent_test_b200_bench010: 123133
  * agent_test_b200_bench009: 71387
  * agent_test_b200: 44104
  * agent_test_b200_bench020: 27097
  * agent_test_b200_bench008: 15661
  * agent_test_b200_test: 79
  * agent_test_b200_test_2vu: 33
  * agent_test_b200_test_2vu2: 33
  * agent_test_h100_bench009: 2

### Memórias Criadas Durante o Teste
* **Quantidade total:** 27097
* **Taxa média de armazenamento:** 103,42 memórias/segundo

## Saída do k6

```
     data_received..................:      data_received..................: 3.9 MB 16 kB/s
     data_sent......................:      data_sent......................: 12 MB  47 kB/s
   ✗ http_req_duration..............: avg=9.19s   min=130.51ms med=8.66s  max=15.01s   p(90)=14.88s   p(95)=15s     
   ✗ http_req_failed................: 42.58% ✓ 11268      ✗ 15195 
     http_reqs......................: 26463  105.851073/s
     iterations.....................: 26456  105.823073/s
     vus............................: 6      min=6        max=2000
     vus_max........................: 2000   min=2000     max=2000
     http_req_waiting...............:      http_req_waiting...............: avg=9.16s   min=128.84ms med=8.64s  max=15.01s   p(90)=14.88s   p(95)=15s     
```

## Saúde do Servidor (b200)

### Saúde do Servidor Antes do Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-28T15:36:28.168209"
}
```

### Saúde do Servidor Após o Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [],
  "timestamp": "2025-05-28T15:40:50.270884"
}
```

## Análise de Erros e Timeouts

```\n   ✗ http_req_failed................: 42.58% ✓ 11268      ✗ 15195 \n```

## Conclusão do Teste

Este teste de stress simulou até  usuários virtuais fazendo inserções de memórias simultâneas ao endpoint `/memorize`. Os resultados indicam o comportamento do sistema sob carga extremamente alta.

### Observações e Recomendações

1. O sistema processou 27097 requisições durante o teste com uma taxa média de 103,42 req/s.
2. Foram detectados alguns erros/timeouts, indicando possíveis limitações do sistema neste nível de carga.
3. Para melhorar o desempenho sob cargas elevadas, considere otimizar o processamento de requisições ou aumentar os recursos do servidor.
4. Recomenda-se monitorar os recursos do servidor (CPU, memória, rede) durante testes futuros para identificar possíveis gargalos.
5. Apesar dos timeouts, foi verificado nos logs do servidor que muitas insercoes de memoria foram realizadas com sucesso, o que pode ser confirmado na sessao 'Verificação da Saúde do Banco de Dados'. Foram verificadas linhas como essa `2025-05-28 15:41:26 - qube.api - INFO - Request e0c942ac-59c9-4deb-8519-c77a79fa5015 - POST /memorize - Status: 200 - Tempo: 50267.39ms` indicando que uma memoria levou 50267ms para ser registrada com sucesso, o que confirma uma degradação da aplicação.
6. A requisição com maior tempo de resposta foi, segundo o comando abaixo, foi de 50658ms:
  ```
    sudo docker logs 1467c07565bc | grep Tempo | cut -d':' -f5 | cut -d'.' -f1 | sort -n | tail
      49881
      49881
      50267
      50267
      50267
      50657
      50657
      50658
      50658
      50658
  ```
