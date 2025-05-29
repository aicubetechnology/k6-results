# Relatório de Testes Manuais - B200 e H100

Data: 27/05/2025

## Resumo

Durante a tentativa de executar a sessão de benchmark 003, encontramos alguns problemas de conectividade e erros em endpoints específicos. Realizamos testes manuais para identificar quais endpoints estão funcionando corretamente.

## Status do Servidor H100 (130.61.226.26)

- **Status**: ❌ Inacessível
- **Detalhes**: O servidor H100 não está respondendo às requisições ou está com problemas de conectividade, mesmo com a nova API key.

## Status do Servidor B200 (150.136.65.20)

- **Status**: ✅ Operacional (parcialmente)
- **Detalhes**: O servidor B200 está acessível, mas alguns endpoints apresentam erros.

## Testes Realizados no B200

Criamos um novo tenant para os testes com as seguintes informações:
```json
{
  "tenant_id": "qube_test_tenant_1748305017",
  "name": "Qube Test Tenant for Session 3",
  "api_key": "qube_c12a6e133332489e930711acf9b70f7b",
  "quota_max_memories": 10000,
  "quota_max_requests_per_day": 1000
}
```

### Resultados dos Testes Manuais (B200)

| Endpoint | Método | Status | Comentários |
|----------|--------|--------|------------|
| `/health` | GET | ✅ OK | Servidor reporta status saudável |
| `/memorize` | POST | ✅ OK | Memorização simples funciona corretamente |
| `/memorize_batch` | POST | ❌ ERRO 500 | Erro interno do servidor ao tentar memorizar em lote |
| `/retrieve` | POST | ❌ ERRO 500 | Erro persistente: `'VectorDB' object has no attribute 'retrieve_similar'` |
| `/admin/tenant/{tenant_id}/stats` | GET | ✅ OK | Estatísticas do tenant funcionam corretamente |

## Comandos curl para Depuração

Para depuração adicional, aqui estão os comandos curl que podem ser executados:

### 1. Verificar Saúde do Servidor
```bash
curl -v "http://150.136.65.20:8000/health"
```

### 2. Memorização Simples (Funciona)
```bash
curl -v -X POST "http://150.136.65.20:8000/memorize" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer qube_c12a6e133332489e930711acf9b70f7b" \
  -d '{"tenant_id":"qube_test_tenant_1748305017","agent_id":"agent_test_curl","text":"Teste de memorização simples via curl","metadata":{"source":"curl_test"}}'
```

### 3. Memorização em Lote (Falha com Erro 500)
```bash
curl -v -X POST "http://150.136.65.20:8000/memorize_batch" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer qube_c12a6e133332489e930711acf9b70f7b" \
  -d '{"tenant_id":"qube_test_tenant_1748305017","agent_id":"agent_test_curl","texts":["Teste de memorização em lote via curl"],"metadatas":[{"source":"curl_test"}]}'
```

### 4. Recuperação (Falha com Erro VectorDB)
```bash
curl -v -X POST "http://150.136.65.20:8000/retrieve" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer qube_c12a6e133332489e930711acf9b70f7b" \
  -d '{"tenant_id":"qube_test_tenant_1748305017","query":"teste"}'
```

### 5. Estatísticas do Tenant (Funciona)
```bash
curl -v -X GET "http://150.136.65.20:8000/admin/tenant/qube_test_tenant_1748305017/stats" \
  -H "Authorization: Bearer qube_c12a6e133332489e930711acf9b70f7b"
```

## Recomendações

1. **Servidor H100**: Verificar a conectividade e status do servidor H100.

2. **Endpoint `/memorize_batch`**: Investigar o erro interno no servidor B200. Isso pode estar relacionado a uma implementação incompleta ou com erros.

3. **Endpoint `/retrieve`**: A questão do método ausente no VectorDB ainda não foi resolvida, mesmo com um novo tenant e chave de API.

4. **Testes Adicionais**: Realizar testes mais detalhados após a resolução dos problemas identificados.