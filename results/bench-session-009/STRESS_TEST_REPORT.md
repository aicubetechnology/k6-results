# Relatório de Testes - Bench Session 009

Data: 27/05/2025

## Resumo dos Testes

Nesta sessão, foram realizados testes para os três endpoints funcionais do qube_neural_memory:
- `/memorize`
- `/admin/forget`
- `/admin/tenant/{tenant_id}/stats`

Os testes de stress com alta carga (até 1000 VUs) encontraram dificuldades técnicas, especialmente no servidor H100 que apresentou timeouts. Portanto, este relatório apresenta os dados dos testes de carga (load tests) que foram concluídos com sucesso.

## Resultados Comparativos dos Testes de Carga

### Endpoint `/memorize`

| Métrica | H100 | B200 | Comparativo |
|---------|------|------|-------------|
| Tempo Médio | 282.64 ms | 45.18 ms | H100 é 6.3x mais lento |
| Tempo p(95) | 289.66 ms | 65.00 ms | H100 é 4.5x mais lento |
| Tempo Máximo | 321.54 ms | 225.18 ms | H100 é 1.4x mais lento |
| Taxa de Requisições | 3.32 req/s | 11.23 req/s | B200 processa 3.4x mais |

### Endpoint `/admin/forget`

| Métrica | H100 | B200 | Comparativo |
|---------|------|------|-------------|
| Tempo Médio | 272.58 ms | 10.12 ms | H100 é 26.9x mais lento |
| Tempo p(95) | 272.92 ms | 35.62 ms | H100 é 7.7x mais lento |
| Tempo Máximo | 285.41 ms | 102.98 ms | H100 é 2.8x mais lento |
| Taxa de Requisições | 0.77 req/s | 7.38 req/s | B200 processa 9.6x mais |

### Endpoint `/admin/tenant/{tenant_id}/stats`

| Métrica | H100 | B200 | Comparativo |
|---------|------|------|-------------|
| Tempo Médio | 272.50 ms | 8.46 ms | H100 é 32.2x mais lento |
| Tempo p(95) | 272.84 ms | 33.36 ms | H100 é 8.2x mais lento |
| Tempo Máximo | 282.95 ms | 87.47 ms | H100 é 3.2x mais lento |
| Taxa de Requisições | 0.77 req/s | 7.33 req/s | B200 processa 9.5x mais |

## Resumo Geral e Comparação

### Fatores Médios de Comparação

- **Tempo de Resposta**: O servidor H100 é em média **21.8x mais lento** que o B200.
- **Taxa de Requisições**: O servidor B200 processa em média **7.5x mais requisições por segundo** que o H100.

## Análise de Desempenho e Observações

### Endpoint `/memorize`:
- O servidor B200 apresentou desempenho significativamente superior ao H100, sendo 6.3x mais rápido em tempo médio de resposta.
- A diferença é especialmente notável considerando que o B200 não possui GPUs detectáveis, enquanto o H100 tem 8 GPUs NVIDIA H100 de 80GB.
- O B200 conseguiu processar 3.4x mais requisições por segundo que o H100.

### Endpoint `/admin/forget`:
- A diferença de desempenho é ainda mais dramática neste endpoint, com o B200 sendo 26.9x mais rápido em tempo médio de resposta.
- O B200 processou 9.6x mais requisições por segundo que o H100.
- O tempo máximo de resposta no B200 foi quase 3x menor que no H100.

### Endpoint `/admin/tenant/{tenant_id}/stats`:
- Este endpoint apresentou a maior diferença de desempenho, com o B200 sendo 32.2x mais rápido em tempo médio de resposta.
- O B200 processou 9.5x mais requisições por segundo que o H100.
- O tempo de resposta p(95) no B200 foi 8.2x menor que no H100.

### Comportamento sob Stress:
- Os testes de stress encontraram dificuldades, com o servidor H100 apresentando timeouts sob alta carga (tentativa de 1000 VUs).
- Isso sugere que o H100 pode ter limitações de escalabilidade ou problemas de configuração que afetam seu desempenho sob carga extrema.

## Caracterização dos Servidores

| Característica | H100 | B200 |
|----------------|------|------|
| GPUs | 8x NVIDIA H100 80GB HBM3 | Nenhuma GPU detectada |
| Estado | Operacional, mas com limitações de desempenho | Alta performance, mesmo sem GPUs |
| Timeouts sob carga | Sim | Não observados nos testes de carga |

## Conclusões

1. **Superioridade Consistente do B200**: Em todos os endpoints testados, o servidor B200 demonstrou desempenho significativamente superior ao H100, com diferenças de 6.3x a 32.2x dependendo do endpoint.

2. **Paradoxo de Hardware**: É surpreendente que o servidor sem GPUs detectáveis (B200) supere tão dramaticamente o servidor com 8 GPUs H100 de última geração. Isso sugere que:
   - O código não está aproveitando efetivamente as GPUs
   - Existem gargalos significativos no servidor H100 não relacionados às GPUs
   - O B200 pode ter otimizações específicas ou uma configuração de CPU/memória superior

3. **Implicações para Cargas de Trabalho**: As operações testadas (memorizar, esquecer, estatísticas) parecem se beneficiar mais de processamento CPU-otimizado do que de aceleração por GPU.

4. **Consistência**: A vantagem do B200 foi consistente em todos os endpoints e métricas, não sendo um fenômeno isolado.

## Recomendações

1. **Investigação de Configuração**:
   - Analisar a configuração do servidor H100 para identificar possíveis gargalos
   - Verificar se há processos competindo por recursos no H100
   - Examinar configurações de rede e I/O que possam estar limitando o desempenho

2. **Otimização para GPU**:
   - Revisar o código para garantir que esteja utilizando efetivamente as GPUs H100
   - Implementar profiling detalhado para identificar onde o tempo está sendo gasto
   - Considerar modificações no algoritmo para melhor aproveitamento do paralelismo das GPUs

3. **Decisões de Infraestrutura**:
   - Para cargas de trabalho semelhantes às testadas, considerar o uso de servidores tipo B200
   - Reservar os servidores H100 para cargas de trabalho que realmente se beneficiem de GPUs poderosas

4. **Testes Adicionais**:
   - Realizar testes com diferentes tipos de carga e tamanhos de dados
   - Testar operações em lote que possam se beneficiar mais do paralelismo das GPUs
   - Monitorar uso de recursos (CPU, memória, GPU, rede) durante os testes

5. **Instrumentação e Monitoramento**:
   - Implementar monitoramento detalhado de desempenho em ambos os servidores
   - Coletar métricas sobre uso de GPU, CPU e memória para correlacionar com tempos de resposta
