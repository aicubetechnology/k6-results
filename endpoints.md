# Endpoints da API Qube Neural Memory

Com base na análise do código-fonte e da documentação Swagger, estes são os endpoints disponíveis para teste:

## Administração

1. **GET /health**
   - Verifica a saúde do serviço
   - Não requer autenticação
   - Resposta: `HealthResponse`

2. **POST /admin/forget**
   - Aciona manualmente o mecanismo de forget gate para um tenant
   - Requer autenticação (Bearer token)
   - Payload: `ForgetRequest`
   - Resposta: `ForgetResponse`

3. **GET /admin/tenant/{tenant_id}/stats**
   - Obtém estatísticas sobre as memórias de um tenant
   - Requer autenticação (Bearer token)
   - Resposta: `TenantStatsResponse`

4. **POST /admin/tenant/register**
   - Registra um novo tenant no sistema
   - Requer autenticação de nível admin (não implementada nos testes)
   - Payload: `TenantRegisterRequest`
   - Resposta: `TenantRegisterResponse`
   - **Obs:** Conforme solicitado, este endpoint não será incluído nos testes

## Memória

1. **POST /memorize**
   - Armazena uma nova memória no sistema
   - Requer autenticação (Bearer token)
   - Payload: `MemorizeRequest`
   - Resposta: `MemorizeResponse`

2. **POST /memorize_batch**
   - Armazena múltiplas memórias em batch
   - Requer autenticação (Bearer token)
   - Payload: `MemorizeBatchRequest`
   - Resposta: `List[MemorizeResponse]`

3. **POST /retrieve**
   - Recupera memórias relevantes com base em uma consulta
   - Requer autenticação (Bearer token)
   - Payload: `RetrieveRequest`
   - Resposta: `RetrieveResponse`

4. **GET /memory/{memory_id}**
   - Recupera detalhes de uma memória específica
   - Requer autenticação (Bearer token)
   - Resposta: `MemoryDetailResponse`

5. **DELETE /memory/{memory_id}**
   - Remove uma memória específica
   - Requer autenticação (Bearer token)
   - Resposta: JSON simples com status

## Observações sobre os testes

- Os testes serão executados contra o host 130.61.226.26 na porta 8000
- Para autenticação, usaremos um token fictício já que estamos apenas testando a performance
- Limitaremos as requisições a no máximo 100 por endpoint
- Serão criados três tipos de testes para cada endpoint:
  - Testes de fumaça (smoke): verificação básica de funcionamento
  - Testes de carga (load): verificação de comportamento sob carga normal
  - Testes de stress (stress): verificação de limites sob carga alta