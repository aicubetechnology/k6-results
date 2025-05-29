# Resultado do Teste: stress-memorize-apikey-env (h100)

Data e hora: 29/05/2025 15:59:55

## Detalhes do Teste

* **Script:** stress-memorize-apikey-env
* **Tipo de Teste:** stress
* **Endpoint:** /memorize
* **Método:** POST
* **Servidor:** h100 (http://130.61.226.26:8000)
* **Tenant ID:** qube_assistant_tenant_h100_test_4
* **Agent ID:** agent_test_h100_bench026

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
* **Duração Total:** 240 segundos (planejada), 250 segundos (real - interrompido)
* **Timeout por Requisição:** 15s
* **Sleep entre Requisições:** 0.05 segundos

## Variáveis de Ambiente Utilizadas

```
SSH_AGENT_LAUNCHER=gnome-keyring
SCRIPT_NAME=stress-memorize-apikey-env
MAX_VUS=25000
TEST_TYPE=stress
GPG_AGENT_INFO=/run/user/1000/gnupg/S.gpg-agent:0:1
API_KEY=qube_*****9164
BENCH_SESSION=bench-session-026
API_BASE_URL=http://130.61.226.26:8000
TENANT_ID=qube_assistant_tenant_h100_test_4
AGENT_ID=agent_test_h100_bench026
SERVER_TYPE=h100
SLEEP_BETWEEN_REQUESTS=0.05
REQUEST_TIMEOUT=15s
```

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 250 segundos (interrompido)
* **Requisições Completadas:** 127969
* **Taxa de Requisições:** 511.70 req/s
* **Iterações Completadas:** 126576
* **Iterações Interrompidas:** 8313

## Verificação da Saúde do Banco de Dados

Baseado nas estatísticas do tenant, os seguintes dados foram observados:

### Antes do Teste
* **Total de memórias:** 1430
* **Tempo da memória mais antiga:** 2025-05-29T15:31:01.807000
* **Tempo da memória mais recente:** 2025-05-29T15:58:33.797000
* **Quantidade de agentes:** 2
* **Distribuição por agente:**
  * agent_test_h100_bench026: 1428
  * agent_test_h100_bench009: 2

### Após o Teste
*Nota: O teste foi interrompido antes da coleta final de estatísticas.*

### Memórias Criadas Durante o Teste
* **Quantidade total:** 90 (requisições bem-sucedidas)
* **Taxa média de armazenamento:** 0.36 memórias/segundo

## Saída do k6

```
     ✗ Status is 200
      ↳  0% — ✓ 90 / ✗ 127344
     ✓ memory_id exists
     ✗ embedding_model exists
      ↳  0% — ✓ 0 / ✗ 90
     ✗ tenant_id is correct
      ↳  0% — ✓ 0 / ✗ 90
     ✗ agent_id is correct
      ↳  0% — ✓ 0 / ✗ 90

     checks.........................: 0.14%  ✓ 180        ✗ 127614 
     data_received..................: 23 kB  93 B/s
     data_sent......................: 16 MB  65 kB/s
     http_req_blocked...............: avg=1.35s   min=0s      med=0s     max=15.39s  p(90)=5.72s  p(95)=7.99s  
     http_req_connecting............: avg=1.34s   min=0s      med=0s     max=15.39s  p(90)=5.7s   p(95)=7.98s  
   ✗ http_req_duration..............: avg=2.87s   min=0s      med=0s     max=15.26s  p(90)=11.88s p(95)=13.94s 
       { expected_response:true }...: avg=9.12s   min=634.2ms med=9.99s  max=10.33s  p(90)=10.22s p(95)=10.33s 
   ✗ http_req_failed................: 99.92% ✓ 127879     ✗ 90     
     http_req_receiving.............: avg=3.92µs  min=0s      med=0s     max=15.34ms p(90)=0s     p(95)=0s     
     http_req_sending...............: avg=12.24ms min=0s      med=0s     max=1.22s   p(90)=9.26ms p(95)=79.59ms
     http_req_tls_handshaking.......: avg=0s      min=0s      med=0s     max=0s      p(90)=0s     p(95)=0s     
     http_req_waiting...............: avg=2.86s   min=0s      med=0s     max=15.26s  p(90)=11.82s p(95)=13.9s  
     http_reqs......................: 127969 511.700589/s
     iteration_duration.............: avg=18.61s  min=74.08ms med=18.85s max=31.87s  p(90)=25.53s p(95)=26.11s 
     iterations.....................: 126576 506.130498/s
     vus............................: 0      min=0        max=25000
     vus_max........................: 25000  min=9750     max=25000
```

## Saúde do Servidor (h100)

### Saúde do Servidor Antes do Teste
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [
    {
      "index": 0,
      "name": "NVIDIA H100 80GB HBM3",
      "total_memory_mb": 81089,
      "used_memory_mb": 1664,
      "free_memory_mb": 79425,
      "load": 0.0,
      "is_h100": true,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    },
    {
      "index": 1,
      "name": "NVIDIA H100 80GB HBM3",
      "total_memory_mb": 81089,
      "used_memory_mb": 472,
      "free_memory_mb": 80617,
      "load": 0.0,
      "is_h100": true,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    },
    {
      "index": 2,
      "name": "NVIDIA H100 80GB HBM3",
      "total_memory_mb": 81089,
      "used_memory_mb": 472,
      "free_memory_mb": 80617,
      "load": 0.0,
      "is_h100": true,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    },
    {
      "index": 3,
      "name": "NVIDIA H100 80GB HBM3",
      "total_memory_mb": 81089,
      "used_memory_mb": 472,
      "free_memory_mb": 80617,
      "load": 0.0,
      "is_h100": true,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    },
    {
      "index": 4,
      "name": "NVIDIA H100 80GB HBM3",
      "total_memory_mb": 81089,
      "used_memory_mb": 472,
      "free_memory_mb": 80617,
      "load": 0.0,
      "is_h100": true,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    },
    {
      "index": 5,
      "name": "NVIDIA H100 80GB HBM3",
      "total_memory_mb": 81089,
      "used_memory_mb": 472,
      "free_memory_mb": 80617,
      "load": 0.0,
      "is_h100": true,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    },
    {
      "index": 6,
      "name": "NVIDIA H100 80GB HBM3",
      "total_memory_mb": 81089,
      "used_memory_mb": 472,
      "free_memory_mb": 80617,
      "load": 0.0,
      "is_h100": true,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    },
    {
      "index": 7,
      "name": "NVIDIA H100 80GB HBM3",
      "total_memory_mb": 81089,
      "used_memory_mb": 472,
      "free_memory_mb": 80617,
      "load": 0.0,
      "is_h100": true,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    }
  ],
  "timestamp": "2025-05-29T15:59:55.100655"
}
```

### Saúde do Servidor Após o Teste
*Nota: O teste foi interrompido antes da coleta final de saúde do servidor.*

## Análise de Erros e Timeouts

```
OSError: [Errno 24] Too many open files
pymongo.errors.AutoReconnect: fc-ab31e95ea1e8-000.global.mongocluster.cosmos.azure.com:10260: [Errno 24] Too many open files (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)
```

## Análise do Log do Servidor

A análise do log do servidor h100 revelou um problema crítico que levou à interrupção do teste. O servidor começou a enfrentar o erro "Too many open files" logo no início do teste, o que indica que o sistema operacional atingiu o limite de descritores de arquivo abertos permitidos para o processo.

Este erro foi particularmente impactante nas conexões com o MongoDB, como evidenciado pelos erros subsequentes "pymongo.errors.AutoReconnect", onde o servidor não conseguiu estabelecer novas conexões com o banco de dados devido à mesma limitação.

Cronologicamente, podemos observar:

1. Os primeiros erros "Too many open files" apareceram aproximadamente 1 minuto após o início do teste
2. Os erros de reconexão ao MongoDB começaram a ocorrer aproximadamente 5 minutos após o início do teste
3. A taxa de falha extremamente alta (99.92%) e o número muito baixo de requisições bem-sucedidas (apenas 90 de 127969) demonstram o impacto severo desse problema

## Conclusão do Teste

Este teste de stress simulou até 25000 usuários virtuais fazendo inserções de memórias simultâneas ao endpoint `/memorize`. O teste foi interrompido prematuramente devido a erros graves no servidor.

### Observações e Recomendações

1. O sistema processou apenas 90 requisições com sucesso de um total de 127969 tentativas, resultando em uma taxa de falha de 99.92%.
2. O principal gargalo identificado foi o limite de arquivos abertos no sistema operacional, que impediu o servidor de estabelecer novas conexões tanto para clientes HTTP quanto para o banco de dados MongoDB.
3. Para melhorar o desempenho sob cargas elevadas, recomenda-se:
   - Aumentar o limite de arquivos abertos no sistema operacional (`ulimit -n`)
   - Implementar um sistema de pooling de conexões para o MongoDB
   - Considerar a implementação de estratégias de backpressure para limitar o número de requisições simultâneas
   - Otimizar o fechamento de conexões e liberação de recursos após o processamento de cada requisição
4. É aconselhável repetir este teste após a implementação das correções sugeridas, iniciando com um número menor de VUs (por exemplo, 1000) e aumentando gradativamente.
5. Monitorar recursos específicos do servidor como o número de descritores de arquivo abertos (`lsof | wc -l`) durante testes futuros para identificar este tipo de gargalo mais rapidamente.

### Comparação com Outros Testes

Em comparação com os testes realizados no servidor B200, o H100 apresentou um comportamento significativamente diferente. Enquanto o B200 conseguiu processar uma quantidade maior de requisições sem encontrar o limite de arquivos abertos, o H100 enfrentou este gargalo rapidamente, mesmo possuindo GPUs mais potentes.

Isso sugere que o gargalo não está no processamento de GPU, mas sim na camada de rede/sistema operacional e na gestão de conexões com o banco de dados.