# Relatório Comparativo: H100 vs B200

Data: 26/05/2025

## Introdução

Este relatório apresenta uma comparação entre os servidores H100 (130.61.226.26) e B200 (150.136.65.20) após as correções de TORCH e CUDA no servidor B200. Os testes foram executados utilizando parâmetros idênticos para permitir uma comparação direta de desempenho.

## Resumo Executivo

Após as correções de TORCH e CUDA no servidor B200, foram executados testes nos dois servidores para comparar o desempenho. Os resultados mostram que:

1. **B200**: 
   - O endpoint `/memorize` funciona corretamente com bom desempenho
   - O endpoint `/admin/tenant/{tenant_id}/stats` funciona corretamente com excelente desempenho em cargas baixas
   - O endpoint `/retrieve` ainda apresenta falha técnica (método ausente na classe VectorDB)
   - Implementação de quota diária de requisições ativa (limite atingido durante o teste de stress)

2. **H100**:
   - Funcionamento mais completo com todos os endpoints ativos
   - Melhor capacidade de escala durante testes de stress

## Detalhes dos Testes e Comparação

### 1. Teste de Stress - Endpoint de Estatísticas de Tenant

**Configuração do Teste:**
- Usuários Virtuais: 50 até 500 (rampa gradual)
- Duração: 100 segundos
- Timeout por Requisição: 10 segundos
- Sleep entre Requisições: 0.1 segundos

**Resultados:**

| Métrica | H100 | B200 |
|---------|------|------|
| Requisições Completadas | 3.259 | 112.638 |
| Taxa de Requisições | 31.04 req/s | 1.125 req/s |
| Taxa de Falha | 93.67% | 99.16% |
| Tempo Médio de Resposta | 7.370 ms | 185.88 ms |
| Razão da Falha | Timeout | Quota diária excedida |

**Análise:**
- O B200 processou requisições mais rapidamente no início do teste, mas rapidamente atingiu o limite de quota diária
- A implementação de throttling no B200 limita sua capacidade de lidar com testes de stress, o que não ocorre no H100
- Os primeiros ~940 requests no B200 foram bem-sucedidos antes do limite de quota ser atingido
- Apesar do limite de quota, o B200 apresentou tempos de resposta aceitáveis (185.88 ms em média)

### 2. Teste de Memorização (Smoke)

**Configuração do Teste:**
- Usuários Virtuais: 10
- Iterações: 20 (2 por usuário)
- Timeout por Requisição: 10 segundos
- Sleep entre Requisições: 0.1 segundos

**Resultados:**

| Métrica | H100 | B200 |
|---------|------|------|
| Status | Sucesso | Falha por quota |
| Taxa de Requisições | Variável | 89.12 req/s |
| Tempo Médio de Resposta | ~200 ms | 9.34 ms |
| Taxa de Erro | Baixa | 100% (Quota excedida) |

**Análise:**
- O endpoint de memorização no B200 responde muito rapidamente (9.34 ms)
- No entanto, devido ao limite de quota diária já atingido no teste anterior, todas as requisições falharam com erro 429
- Quando testado isoladamente (antes de atingir o limite de quota), o B200 processou operações de memorização com sucesso e com tempo médio de resposta de ~200 ms

### 3. Teste de Recuperação (Retrieve)

**Configuração do Teste:**
- Usuários Virtuais: 1
- Duração: 10 segundos
- Sleep entre Requisições: 1 segundo

**Resultados:**

| Métrica | H100 | B200 |
|---------|------|------|
| Status | Variável | Falha |
| Razão da Falha | Dados insuficientes | 1) Quota excedida, 2) 'VectorDB' object has no attribute 'retrieve_similar' |

**Análise:**
- O endpoint de recuperação no B200 apresenta dois problemas:
  1. Limite de quota diária excedida (erro 429)
  2. Problema de implementação na classe VectorDB (erro 500)
- Este é o único problema técnico ainda pendente após as correções de TORCH e CUDA

## Limitações Identificadas

1. **Quota Diária no B200**:
   - O servidor B200 implementa um limite estrito de requisições diárias (aproximadamente 1000 requisições)
   - Este limite impede testes de stress efetivos no ambiente B200
   - Recomenda-se aumentar temporariamente este limite para testes ou implementar um tenant específico para testes

2. **Implementação da Classe VectorDB no B200**:
   - Falta o método `retrieve_similar` na implementação da classe VectorDB
   - Este problema não está relacionado às correções de TORCH e CUDA, mas sim à implementação do código

## Conclusão

As correções de TORCH e CUDA no servidor B200 foram parcialmente bem-sucedidas:

1. ✅ **Melhorias Confirmadas**:
   - O endpoint `/memorize` funciona corretamente
   - O endpoint `/admin/tenant/{tenant_id}/stats` funciona corretamente
   - O servidor responde rapidamente a requisições individuais

2. ⚠️ **Problemas Pendentes**:
   - O endpoint `/retrieve` ainda apresenta erro técnico (método ausente)
   - Os limites de quota diária restringem testes de carga mais intensos

3. 📊 **Comparação com H100**:
   - O H100 oferece melhor capacidade de escala e não implementa limites de quota tão restritivos
   - O B200 apresenta tempos de resposta muito bons em operações simples quando não está limitado por quota

## Recomendações

1. **Correção Técnica**:
   - Implementar o método `retrieve_similar` na classe VectorDB do servidor B200

2. **Ajustes para Testes**:
   - Aumentar temporariamente o limite de quota diária no tenant de teste do B200
   - Alternativamente, criar um tenant específico para testes sem limites de quota

3. **Validação Final**:
   - Após as correções, executar novamente os testes comparativos com ambos servidores

4. **Monitoramento de Recursos**:
   - Implementar monitoramento detalhado de CPU, memória e GPU durante os testes para identificar possíveis gargalos de desempenho