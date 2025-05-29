# K6 Test Results: massive_load - smoke-memorize-apikey (B200)

## Test Execution Information
- **Date and Time**: 26/05/2025 18:31:04
- **Test Type**: smoke
- **Test Script**: smoke-memorize-apikey
- **Environment**: NVIDIA B200 GPUs

## Test Error
CUDA error when executing the test: "CUDA error: no kernel image is available for execution on the device"

This error suggests that there may be compatibility issues between the CUDA kernels and the NVIDIA B200 GPUs.

## Server Health Status
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gpus": [
    {
      "index": 0,
      "name": "NVIDIA B200",
      "total_memory_mb": 182642,
      "used_memory_mb": 720,
      "free_memory_mb": 181922,
      "load": 0.0,
      "is_h100": false,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    },
    {
      "index": 1,
      "name": "NVIDIA B200",
      "total_memory_mb": 182642,
      "used_memory_mb": 720,
      "free_memory_mb": 181922,
      "load": 0.0,
      "is_h100": false,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    },
    {
      "index": 2,
      "name": "NVIDIA B200",
      "total_memory_mb": 182642,
      "used_memory_mb": 720,
      "free_memory_mb": 181922,
      "load": 0.0,
      "is_h100": false,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    },
    {
      "index": 3,
      "name": "NVIDIA B200",
      "total_memory_mb": 182642,
      "used_memory_mb": 720,
      "free_memory_mb": 181922,
      "load": 0.0,
      "is_h100": false,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    },
    {
      "index": 4,
      "name": "NVIDIA B200",
      "total_memory_mb": 182642,
      "used_memory_mb": 720,
      "free_memory_mb": 181922,
      "load": 0.0,
      "is_h100": false,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    },
    {
      "index": 5,
      "name": "NVIDIA B200",
      "total_memory_mb": 182642,
      "used_memory_mb": 720,
      "free_memory_mb": 181922,
      "load": 0.0,
      "is_h100": false,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    },
    {
      "index": 6,
      "name": "NVIDIA B200",
      "total_memory_mb": 182642,
      "used_memory_mb": 720,
      "free_memory_mb": 181922,
      "load": 0.0,
      "is_h100": false,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    },
    {
      "index": 7,
      "name": "NVIDIA B200",
      "total_memory_mb": 182642,
      "used_memory_mb": 720,
      "free_memory_mb": 181922,
      "load": 0.0,
      "is_h100": false,
      "mig_enabled": false,
      "mig_devices": [],
      "queue_size": 0
    }
  ],
  "timestamp": "2025-05-26T18:22:46.614612"
}
```

## Conclusion
The smoke-memorize-apikey test could not be executed successfully on the B200 server due to CUDA errors. While the server appears healthy according to the health check endpoint, the test operations failed with CUDA errors: "no kernel image is available for execution on the device".

This suggests that there may be compatibility issues between the CUDA code and the NVIDIA B200 GPUs. Possible causes:

1. The CUDA kernels were compiled for a different GPU architecture (e.g., for H100 but not B200)
2. Missing or incompatible CUDA drivers
3. Misconfiguration of the GPU environment

All 8 NVIDIA B200 GPUs appear to be operational with very low memory usage (720 MB out of 182642 MB each), but the application is unable to execute CUDA operations on them.