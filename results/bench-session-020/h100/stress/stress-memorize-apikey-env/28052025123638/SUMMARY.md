# Resultado do Teste: stress-memorize-apikey-env (h100)

Data e hora: 28/05/2025 15:36:32

## Detalhes do Teste

* **Script:** stress-memorize-apikey-env
* **Tipo de Teste:** stress
* **Endpoint:** /memorize
* **Método:** POST
* **Servidor:** h100 (http://130.61.226.26:8000)
* **Tenant ID:** qube_assistant_tenant_h100_test_3
* **Agent ID:** agent_test_h100_bench020

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
* **Duração Total:** 240 segundos (planejada), 305 segundos (real)
* **Timeout por Requisição:** 15s
* **Sleep entre Requisições:** 0.05 segundos

## Variáveis de Ambiente Utilizadas

```
SSH_AGENT_LAUNCHER=gnome-keyring
SCRIPT_NAME=stress-memorize-apikey-env
MAX_VUS=2000
TEST_TYPE=stress
GPG_AGENT_INFO=/run/user/1000/gnupg/S.gpg-agent:0:1
API_KEY=*****50d97
BENCH_SESSION=bench-session-020
API_BASE_URL=http://130.61.226.26:8000
TENANT_ID=qube_assistant_tenant_h100_test_3
AGENT_ID=agent_test_h100_bench020
SERVER_TYPE=h100
SLEEP_BETWEEN_REQUESTS=0.05
REQUEST_TIMEOUT=15s
```

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 305 segundos
* **Requisições Completadas:** 12315
* **Taxa de Requisições:** 40,38 req/s

## Verificação da Saúde do Banco de Dados

Baseado nas estatísticas do tenant, os seguintes dados foram observados:

### Antes do Teste
* **Total de memórias:** 766
* **Tempo da memória mais antiga:** 2025-05-28T14:49:54.169000
* **Tempo da memória mais recente:** 2025-05-28T15:12:37.801000
* **Quantidade de agentes:** 1
* **Distribuição por agente:**
  * agent_test_b200_bench021: 766

### Após o Teste
* **Total de memórias:** 13081
* **Tempo da memória mais antiga:** 2025-05-28T14:49:54.169000
* **Tempo da memória mais recente:** 2025-05-28T16:16:10.191000
* **Quantidade de agentes:** 2
* **Distribuição por agente:**
  * agent_test_h100_bench020: 12315
  * agent_test_b200_bench021: 766

### Memórias Criadas Durante o Teste
* **Quantidade total:** 12315
* **Taxa média de armazenamento:** 40,38 memórias/segundo

## Saída do k6

```
     data_received..................:      data_received..................: 24 kB  96 B/s
     data_sent......................:      data_sent......................: 5.5 MB 22 kB/s
   ✗ http_req_duration..............: avg=9.92s   min=0s       med=13.74s   max=15s    p(90)=14.8s    p(95)=14.8s   
   ✗ http_req_failed................: 99.43% ✓ 16248     ✗ 93    
     http_reqs......................: 16341  65.370895/s
     iterations.....................: 16336  65.350893/s
     vus............................: 6      min=6       max=2000
     vus_max........................: 2000   min=2000    max=2000
     http_req_waiting...............:      http_req_waiting...............: avg=9.92s   min=0s       med=13.74s   max=15s    p(90)=14.8s    p(95)=14.8s   
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
      "load": 0,
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
      "load": 0,
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
      "load": 0,
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
      "load": 0,
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
      "load": 0,
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
      "load": 0,
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
      "load": 0,
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
      "load": 0,
      "is_h100": true,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    }
  ],
  "timestamp": "2025-05-28T15:36:32.098650"
}
```

### Saúde do Servidor Após o Teste
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
      "load": 0,
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
      "load": 0,
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
      "load": 0,
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
      "load": 0,
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
      "load": 0,
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
      "load": 0,
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
      "load": 0,
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
      "load": 0,
      "is_h100": true,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    }
  ],
  "timestamp": "2025-05-28T15:41:37.951871"
}
```

## Análise de Erros e Timeouts

```\n   ✗ http_req_failed................: 99.43% ✓ 16248     ✗ 93    \n```

## Conclusão do Teste

Este teste de stress simulou até  usuários virtuais fazendo inserções de memórias simultâneas ao endpoint `/memorize`. Os resultados indicam o comportamento do sistema sob carga extremamente alta.

### Observações e Recomendações

1. O sistema processou 12315 requisições durante o teste com uma taxa média de 40,38 req/s.
2. Foram detectados alguns erros/timeouts, indicando possíveis limitações do sistema neste nível de carga.
3. Para melhorar o desempenho sob cargas elevadas, considere otimizar o processamento de requisições ou aumentar os recursos do servidor.
4. Recomenda-se monitorar os recursos do servidor (CPU, memória, rede) durante testes futuros para identificar possíveis gargalos.
5. Apesar dos timeouts, foi verificado nos logs do servidor que muitas insercoes de memoria foram realizadas com sucesso, o que pode ser confirmado na sessao 'Verificação da Saúde do Banco de Dados'. Foram verificadas linhas como essa `May 28 16:16:11 ubuntu-cuda-custom-image python[892414]: 2025-05-28 16:16:11 - qube.api - INFO - Request b9cfda47-1d09-4020-a052-b35d04da7b7b - POST /memorize - Status: 200 - Tempo: 2074602.02ms` indicando que uma memoria levou 2074602ms para ser registrada com sucesso, o que confirma uma degradação da aplicação.
6. A requisição com maior tempo de resposta, segundo o comando abaixo, levou 7057981ms para processar:
  ```
    sudo journalctl -u qube --no-pager |  grep Tempo  | cut -d':' -f8 | cut -d'.' -f1 | sort -n | tail
    7057981
    7057981
    7057981
    7057981
    7057981
    7057981
    7057981
    7057981
    7057981
    7057981
  ```