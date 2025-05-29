# Análise Comparativa de Performance: Servidores B200 vs H100 (Sessão 026)

## Resumo Executivo

Este documento apresenta uma análise comparativa de performance entre os servidores B200 e H100, baseada nos testes de stress realizados com o k6 em 29/05/2025 durante a sessão bench-session-026. Ambos os servidores foram submetidos a testes de carga progressiva até 25000 usuários virtuais (VUs) simultâneos, utilizando o endpoint `/memorize` para inserção de memórias.

## Configuração dos Testes

| Parâmetro | Servidor B200 | Servidor H100 |
|-----------|--------------|--------------|
| **Endpoint** | /memorize (POST) | /memorize (POST) |
| **URL** | http://150.136.65.20:8000 | http://130.61.226.26:8000 |
| **Tenant ID** | qube_assistant_tenant_b200_test_16 | qube_assistant_tenant_h100_test_4 |
| **Agent ID** | agent_test_b200_bench026 | agent_test_h100_bench026 |
| **VUs Máximos** | 25000 | 25000 |
| **Duração Planejada** | 240 segundos | 240 segundos |
| **Duração Real** | 260 segundos | 250 segundos (interrompido) |
| **Timeout por Requisição** | 15s | 15s |
| **Sleep entre Requisições** | 0.05 segundos | 0.05 segundos |

## Métricas de Performance Comparadas

| Métrica | Servidor B200 | Servidor H100 | Diferença (%) | Observação |
|---------|---------------|--------------|---------------|------------|
| **Requisições Completadas (k6)** | 97412 | 127969 | +31.4% para H100 | H100 conseguiu processar mais requisições |
| **Memórias Armazenadas** | 49215 | 90 | +54683% para B200 | B200 armazenou significativamente mais memórias |
| **Taxa de Requisições** | 189.29 req/s | 511.70 req/s | +170.3% para H100 | H100 teve maior throughput de requisições |
| **Taxa de Falha** | 89.06% | 99.92% | +12.2% para H100 | Ambos tiveram taxas de falha extremamente altas |
| **Requisições Bem-sucedidas** | 10650 | 90 | +11733% para B200 | B200 teve muito mais requisições bem-sucedidas |

## Recursos de Hardware e Comportamento

### Servidor B200
- **Hardware**: Equipado com 8x NVIDIA B200 GPUs (não detectadas no health check)
- **Comportamento sob Carga**: Manteve-se operacional durante todo o teste, com degradação progressiva
- **Erros**: Não apresentou falhas críticas de sistema, apenas timeouts
- **Resiliência**: Continuou processando requisições até o fim do teste
- **Integridade de Dados**: Manteve integridade dos dados mesmo sob carga extrema

### Servidor H100
- **Hardware**: Equipado com 8x NVIDIA H100 80GB HBM3
- **Memória GPU Disponível**: ~80.617 MB livre por GPU (antes do teste)
- **Comportamento sob Carga**: Falha crítica "Too many open files"
- **Erros**: Problemas de conexão com MongoDB devido ao limite de descritores de arquivo
- **Resiliência**: Entrou em estado de falha que impediu processamento adequado
- **Integridade de Dados**: Processou apenas 90 memórias com sucesso

## Análise de Erros e Falhas

### Servidor B200
- **Taxa de falha**: 89.06% (86.762 falhas em 97.412 requisições)
- **Tipo de falha**: Principalmente timeouts (15s) no cliente k6
- **Comportamento do servidor**: Continuou processando requisições mesmo após os timeouts do k6
- **Eficiência real**: 50.5% das requisições foram efetivamente processadas e armazenadas

### Servidor H100
- **Taxa de falha**: 99.92% (127.879 falhas em 127.969 requisições)
- **Tipo de falha**: Erro crítico "Too many open files" e falhas de conexão com MongoDB
- **Comportamento do servidor**: Entrou em estado de falha devido ao esgotamento de recursos do sistema
- **Eficiência real**: Apenas 0.07% das requisições foram processadas e armazenadas

## Gráficos de Desempenho

```
Memórias Armazenadas com Sucesso
─────────────────────────────────────────────────────────
B200 │████████████████████████████████████████████ 49215
H100 │ 90
─────────────────────────────────────────────────────────

Taxa de Falha (%)
─────────────────────────────────────────────────────────
B200 │████████████████████████████████████████ 89.06%
H100 │████████████████████████████████████████████ 99.92%
─────────────────────────────────────────────────────────

Taxa de Requisições (req/s)
─────────────────────────────────────────────────────────
B200 │████████████████████ 189.29
H100 │████████████████████████████████████████████ 511.70
─────────────────────────────────────────────────────────
```

## Análise Detalhada de Gargalos

### Servidor B200
- **Gargalo principal**: Capacidade de processamento sob carga
- **Comportamento**: Degradação progressiva de performance, com tempos de resposta aumentando de dezenas de ms para mais de 5 minutos
- **Limitação**: Sem aceleração de GPU detectada, processamento possivelmente limitado à CPU
- **Resiliência**: Sistema resiliente, priorizando integridade de dados sobre latência

### Servidor H100
- **Gargalo principal**: Limite de arquivos abertos do sistema operacional ("Too many open files")
- **Comportamento**: Falha catastrófica quando o limite de descritores de arquivo foi atingido
- **Limitação**: Configuração inadequada de limites do sistema operacional (ulimit)
- **Resiliência**: Sistema frágil sob carga extrema, incapaz de se recuperar da falha

## Conclusões

1. **Surpreendente superioridade do B200**: Novamente, o servidor B200 superou significativamente o H100 em termos de memórias efetivamente armazenadas, mesmo sob carga extrema de 25000 VUs.

2. **Diferença de falhas**: Ambos os servidores apresentaram falhas sob carga extrema, mas de natureza fundamentalmente diferente:
   - O B200 apresentou degradação progressiva de performance, mas continuou processando requisições
   - O H100 encontrou um limite sistêmico (descritores de arquivo) que impediu seu funcionamento adequado

3. **Eficiência de processamento**: Mesmo com ambos os servidores reportando altas taxas de falha pelo k6, o B200 demonstrou maior eficiência real:
   - B200: 50.5% das requisições efetivamente processadas e armazenadas
   - H100: Apenas 0.07% das requisições efetivamente processadas e armazenadas

4. **Integridade de dados**: O B200 manteve integridade de dados mesmo sob carga extrema, priorizando a consistência sobre latência.

5. **Limites sistêmicos vs. performance**: O teste revelou que os limites do sistema operacional podem ser mais críticos que a capacidade de hardware:
   - O H100, com hardware superior, foi limitado por configuração inadequada do SO
   - O B200, mesmo sem detecção de GPUs, conseguiu processar requisições de forma mais confiável

## Recomendações

1. **Ajustes no servidor H100**:
   - Aumentar o limite de arquivos abertos no sistema operacional (`ulimit -n`)
   - Implementar pooling de conexões para o MongoDB
   - Adicionar estratégias de backpressure para gerenciar o número de conexões simultâneas

2. **Otimizações para o B200**:
   - Investigar por que as GPUs não estão sendo detectadas
   - Implementar processamento paralelo mais eficiente
   - Adicionar mecanismos de throttling controlado para evitar degradação extrema

3. **Melhorias gerais**:
   - Implementar um sistema de enfileiramento explícito com feedback para o cliente
   - Considerar escalamento horizontal para distribuir a carga
   - Adicionar monitoramento detalhado de recursos (descritores de arquivo, conexões, memória, CPU)

4. **Estratégia de testes**:
   - Após implementar as correções no H100, repetir o teste com cargas progressivas
   - Monitorar especificamente os limites do sistema operacional durante os testes
   - Comparar a eficiência real (não apenas os números do k6) para avaliar melhorias

## Observações Finais

Os resultados desta sessão de benchmark revelam que, para cargas extremas, os limites do sistema operacional e a configuração do servidor podem ser mais determinantes que o hardware subjacente. O servidor B200, mesmo sem aceleração de GPU detectada, demonstrou maior resiliência e capacidade de processamento efetivo que o H100 com suas GPUs avançadas. Isto sugere que otimizações de sistema e configuração adequada podem ter impacto maior que upgrades de hardware em determinados cenários de carga.