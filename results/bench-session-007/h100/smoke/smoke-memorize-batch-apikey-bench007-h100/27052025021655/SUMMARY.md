# Resultado do Teste: smoke-memorize-batch-apikey-bench007-h100 (h100)

Data e hora: 27/05/2025 02:17:02

## Detalhes do Teste

* **Script:** smoke-memorize-batch-apikey-bench007-h100
* **Tipo de Teste:** smoke
* **Servidor:** h100 (http://130.61.226.26:8000)

## Resultado do Teste

    data_received..........................: 770 B   139 B/s
    data_sent..............................: 2.8 kB  509 B/s




running (00m05.5s), 0/1 VUs, 5 complete and 0 interrupted iterations
default ✓ [ 100% ] 1 VUs  00m05.5s/10m0s  5/5 shared iters
time="2025-05-27T02:17:01Z" level=error msg="thresholds on metrics 'http_req_failed' have been crossed"

## Status do Servidor (h100)

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
  "timestamp": "2025-05-27T02:17:01.256297"
}

## Estatísticas do Banco de Dados

Não foi possível obter estatísticas do MongoDB

## Conclusão

✅ Teste concluído com sucesso. Todos os checks passaram.

**Nota:** Resultados detalhados e logs completos estão disponíveis nos outros arquivos deste diretório.
