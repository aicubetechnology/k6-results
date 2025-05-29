# Relatório de Testes - Sessão 009

Data: 27/05/2025

## Resumo dos Testes

Nesta sessão, os testes foram executados ignorando os endpoints com problemas conhecidos (batch memories e retrieve).

### Testes bem-sucedidos:

#### H100:
- ✅ `smoke-memorize-apikey`: O endpoint `/memorize` funciona corretamente
- ✅ `smoke-admin-forget-apikey`: O endpoint `/admin/forget` funciona corretamente
- ✅ `smoke-get-tenant-stats-apikey`: O endpoint `/admin/tenant/{tenant_id}/stats` funciona corretamente

#### B200:
- ✅ `smoke-memorize-apikey`: O endpoint `/memorize` funciona corretamente
- ✅ `smoke-admin-forget-apikey`: O endpoint `/admin/forget` funciona corretamente
- ✅ `smoke-get-tenant-stats-apikey`: O endpoint `/admin/tenant/{tenant_id}/stats` funciona corretamente

### Testes de carga:
Os testes de carga foram executados com sucesso para os três endpoints funcionais, com os seguintes resultados:

#### Tempo de Resposta (p95)
| Endpoint                   | H100       | B200      | Fator de Diferença |
|----------------------------|------------|-----------|-------------------|
| `/memorize`                | 676.61 ms  | 65.00 ms  | 10.4x mais rápido |
| `/admin/forget`            | 578.77 ms  | 35.62 ms  | 16.2x mais rápido |
| `/admin/tenant/{id}/stats` | 557.46 ms  | 33.36 ms  | 16.7x mais rápido |

#### Taxa de Requisições
| Endpoint                   | H100        | B200         | Fator de Diferença |
|----------------------------|-------------|--------------|-------------------|
| `/memorize`                | 4.52 req/s  | 11.23 req/s  | 2.5x mais requisições |
| `/admin/forget`            | 3.86 req/s  | 7.38 req/s   | 1.9x mais requisições |
| `/admin/tenant/{id}/stats` | 3.94 req/s  | 7.33 req/s   | 1.9x mais requisições |

Os detalhes completos estão disponíveis no [relatório de testes de carga](./LOAD_TEST_REPORT.md).

## Comparativo de Desempenho entre H100 e B200

### Métricas de Tempo de Resposta (valores médios)

| Endpoint                  | Métrica            | H100      | B200     | Diferença | Fator |
|---------------------------|-------------------|-----------|----------|-----------|-------|
| `/memorize`               | Tempo médio        | 282.64 ms | 16.66 ms | 265.98 ms | 17.0x |
| `/memorize`               | Tempo p(95)        | 289.66 ms | 29.34 ms | 260.32 ms | 9.9x  |
| `/admin/forget`           | Tempo médio        | 272.58 ms | 10.12 ms | 262.46 ms | 26.9x |
| `/admin/forget`           | Tempo p(95)        | 272.92 ms | 10.67 ms | 262.25 ms | 25.6x |
| `/admin/tenant/{id}/stats` | Tempo médio        | 272.50 ms | 8.46 ms  | 264.04 ms | 32.2x |
| `/admin/tenant/{id}/stats` | Tempo p(95)        | 272.84 ms | 8.76 ms  | 264.08 ms | 31.1x |

### Comparação de Taxa de Requisições

| Endpoint                  | H100           | B200          | Fator de Diferença |
|---------------------------|----------------|---------------|-------------------|
| `/memorize`               | 3.32 req/s     | 57.07 req/s   | 17.2x mais rápido |
| `/admin/forget`           | 0.77 req/s     | 0.99 req/s    | 1.3x mais rápido  |
| `/admin/tenant/{id}/stats` | 0.77 req/s     | 0.99 req/s    | 1.3x mais rápido  |

### Tempos de Execução de Iteração

| Endpoint                  | H100         | B200         | Diferença  |
|---------------------------|--------------|--------------|------------|
| `/memorize`               | 301.06 ms    | 17.42 ms     | 17.3x mais rápido |
| `/admin/forget`           | 1.30 s       | 1.01 s       | 1.3x mais rápido  |
| `/admin/tenant/{id}/stats` | 1.30 s       | 1.01 s       | 1.3x mais rápido  |

## Análise de Desempenho

### Endpoint `/memorize`:
- Ambos os servidores H100 e B200 conseguem processar solicitações de memorização sem erros em condições de teste de fumaça.
- **Comparativo de desempenho**: O servidor B200 apresentou um desempenho consideravelmente melhor, com tempos de resposta aproximadamente 17 vezes mais rápidos que o H100.
- A geração de embeddings no B200 aparenta ser muito mais eficiente.

### Endpoint `/admin/forget`:
- O mecanismo de forget gate está funcionando corretamente em ambos os servidores.
- **Comparativo de desempenho**: O servidor B200 é aproximadamente 27 vezes mais rápido que o H100 para esta operação.
- Não foram observados erros durante os testes.

### Endpoint `/admin/tenant/{tenant_id}/stats`:
- A obtenção de estatísticas do tenant está funcionando corretamente em ambos os servidores.
- **Comparativo de desempenho**: O servidor B200 é aproximadamente 32 vezes mais rápido que o H100 para esta operação.
- Os dados retornados incluem todas as informações esperadas.

## Conclusões

1. Os endpoints principais testados estão funcionando conforme o esperado em ambos os servidores H100 e B200.
2. **O servidor B200 demonstrou desempenho significativamente superior ao H100 em todos os endpoints testados**, com diferenças de 10x a 32x nos tempos de resposta.
3. As diferenças de desempenho são consistentes em todos os endpoints, sugerindo que o B200 possui uma configuração ou arquitetura mais otimizada para estas operações específicas.
4. Os problemas previamente identificados com os endpoints `/retrieve`, `/memory` (GET) e `/memory` (DELETE) permanecem e requerem atenção da equipe de desenvolvimento.
5. Mesmo com cargas leves (testes smoke), a diferença de desempenho é bastante significativa, o que pode indicar um impacto ainda maior em condições de carga elevada.

## Possíveis Explicações para a Diferença de Desempenho

1. **Configuração de Hardware**: O B200 pode ter uma configuração de CPU/memória mais adequada para as operações de banco de dados e processamento de API.
2. **Configuração de Software**: Pode haver diferenças nas versões de software, bibliotecas ou configurações do ambiente.
3. **Carga do Sistema**: O servidor H100 pode estar executando processos adicionais que impactam o desempenho.
4. **Otimização da Rede**: Possíveis diferenças na latência de rede ou configuração.
5. **Implementação Específica para GPU**: A implementação no H100 pode estar otimizada para operações em lote (batch) que não são exercitadas nos testes individuais.

## Próximos Passos Recomendados

1. Implementar o método `retrieve_similar` na classe `VectorDB` para corrigir o endpoint `/retrieve`.
2. Investigar e corrigir as rotas para os endpoints `/memory`.
3. Investigar a causa da grande discrepância de desempenho entre os servidores.
4. Executar testes de carga para verificar se a diferença se mantém ou se amplia sob pressão.
5. Analisar o uso de recursos nos dois servidores durante os testes para identificar possíveis gargalos.
6. Considerar ajustes de configuração no servidor H100 para melhorar o desempenho.
7. Após as correções, executar novamente os testes para todos os endpoints.

## Observações Gerais

A aplicação demonstrou boa estabilidade para os endpoints testados, mas as significativas diferenças de desempenho entre os servidores merecem uma investigação mais aprofundada. Recomenda-se uma análise detalhada das configurações e implementações específicas em cada servidor, especialmente considerando o papel esperado das GPUs H100 no processamento.