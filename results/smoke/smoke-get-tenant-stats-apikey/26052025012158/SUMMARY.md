# Resultado do Teste de Fumaça: smoke-get-tenant-stats-apikey

Data e hora: 26/05/2025 01:21:58

## Detalhes do Teste

* **Script:** smoke-get-tenant-stats-apikey
* **Tipo de Teste:** smoke (fumaça)
* **Total de Requisições:** 7
* **Endpoint:** /admin/tenant/{tenant_id}/stats
* **Método:** GET

## Configuração do Teste

* **Usuários Virtuais (VUs):** 1
* **Duração:** 10s
* **Timeout por Requisição:** Padrão
* **Sleep entre Requisições:** 1s

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 10.1 segundos
* **Requisições Completadas:** 7
* **Taxa de Requisições:** 0.69 req/s

### Checks e Validações
* **Checks Passados:** 28
* **Checks Falhos:** 0
* **Taxa de Sucesso de Checks:** 100.00%
* **Requisições com Falha:** 0.00%

### Tempos de Resposta
* **Mínimo:** 431.12 ms
* **Médio:** 434.65 ms
* **Mediana:** 432.22 ms
* **Máximo:** 449.25 ms
* **p(90):** 439.85 ms
* **p(95):** 444.55 ms

### Tempos de Processamento
* **Tempo Médio de Conexão:** 12.83 ms
* **Tempo Médio de TLS:** 0.00 ms
* **Tempo Médio de Envio:** 0.054 ms
* **Tempo Médio de Espera:** 434.46 ms
* **Tempo Médio de Recebimento:** 0.134 ms

### Transferência de Dados
* **Dados Recebidos:** 81 kB (8.0 kB/s)
* **Dados Enviados:** 1.5 kB (144 B/s)
* **Tamanho Médio de Resposta:** 11.57 kB

### Recursos do Sistema
* **Duração Média de Iteração:** 1.44 s
* **Uso Máximo de VUs:** 1

## Análise de Dados

O endpoint `/admin/tenant/{tenant_id}/stats` retornou com sucesso estatísticas para o tenant 'gdias_tenant_2'. No entanto, os resultados mostram que não há memórias armazenadas para este tenant:

```json
{
  "total_memories": 0,
  "avg_importance": null,
  "oldest_memory": null,
  "newest_memory": null,
  "agent_count": 0,
  "agent_distribution": {},
  "average_tenant_surprise": null,
  "agents_surprise": null
}
```

Observação: O log da execução contém mensagens relacionadas ao tenant 'gdias_tenant' (o tenant original), mas as requisições efetivamente testaram o 'gdias_tenant_2' (o tenant atualizado), que ainda não possui memórias.

## Análise de Impacto no Banco de Dados

### Resumo Geral do Banco de Dados

* **Tenant ID:** gdias_tenant_2
* **Total de Memórias:** 0
* **Agentes Únicos:** 0
* **Importância Média:** N/A
* **Memória Mais Antiga:** N/A
* **Memória Mais Recente:** N/A
* **Duração Total dos Dados:** 0.00 minutos

### Análise por Fonte

Não existem fontes de dados para este tenant.

### Distribuição de Agentes

* **Total de Agentes Únicos:** 0
* **Agente com Mais Memórias:** Nenhum
* **Distribuição Típica:** N/A

## Status do Servidor

### Informações do Servidor
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T01:22:18.815932

### Status das GPUs

**GPU 0 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 1664 MB (2.05%)
* Memória Livre: 79425 MB
* Carga: 0
* Tamanho da Fila: 0

**GPU 1 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 472 MB (0.58%)
* Memória Livre: 80617 MB
* Carga: 0
* Tamanho da Fila: 0

**GPU 2 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 472 MB (0.58%)
* Memória Livre: 80617 MB
* Carga: 0
* Tamanho da Fila: 0

**GPU 3 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 472 MB (0.58%)
* Memória Livre: 80617 MB
* Carga: 0
* Tamanho da Fila: 0

**GPU 4 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 472 MB (0.58%)
* Memória Livre: 80617 MB
* Carga: 0
* Tamanho da Fila: 0

**GPU 5 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 472 MB (0.58%)
* Memória Livre: 80617 MB
* Carga: 0
* Tamanho da Fila: 0

**GPU 6 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 472 MB (0.58%)
* Memória Livre: 80617 MB
* Carga: 0
* Tamanho da Fila: 0

**GPU 7 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 472 MB (0.58%)
* Memória Livre: 80617 MB
* Carga: 0
* Tamanho da Fila: 0

## Conclusão do Teste

Este teste de fumaça para o endpoint `/admin/tenant/{tenant_id}/stats` foi bem-sucedido, com uma taxa de sucesso de checks de 100%. O endpoint respondeu adequadamente, embora não existam memórias para o tenant 'gdias_tenant_2'.

### Observações e Recomendações

1. **Tenant Vazio**: O tenant 'gdias_tenant_2' existe no sistema, mas ainda não possui memórias cadastradas. Recomenda-se executar o teste de `/memorize` para este tenant antes de tentar recuperar ou analisar suas memórias.

2. **Bom Tempo de Resposta**: Mesmo sem memórias, o endpoint respondeu em tempo aceitável (média de 434.65 ms).

3. **Próximos Passos**: Recomenda-se:
   - Executar `smoke-memorize-apikey` para adicionar memórias ao tenant
   - Em seguida, repetir este teste para verificar as estatísticas com dados reais
   - Depois, tentar novamente o teste `smoke-retrieve-apikey`

O endpoint de estatísticas do tenant está funcionando conforme esperado, indicando que o problema encontrado anteriormente com o endpoint de retrieve é específico daquela funcionalidade, e não um problema geral com a API.