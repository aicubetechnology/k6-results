# Comparação de Desempenho entre Servidores - Bench Session 062

## Visão Geral

Este documento apresenta uma análise comparativa do desempenho entre os servidores B200 e H100 durante a sessão de benchmark 062, executada em 04/06/2025. Ambos os servidores foram submetidos a testes de stress com alta carga (até 500 VUs) usando o script `stress-memorize-apikey-env` com configurações idênticas de carga e configurações semelhantes de recursos de servidor.

## Configuração do Teste

| Parâmetro | Valor |
|-----------|-------|
| **Script** | stress-memorize-apikey-env |
| **Tipo de Teste** | stress |
| **Endpoint** | /memorize |
| **Método** | POST |
| **Virtual Users (VUs)** | Até 500 |
| **Duração Planejada** | 180 segundos |
| **Timeout por Requisição** | 15s |
| **Sleep entre Requisições** | 0.1s |

### Rampa de Carga
* 0-20s: Aumento de 1 para 100 VUs
* 20-40s: Aumento de 100 para 200 VUs
* 40-60s: Aumento de 200 para 300 VUs
* 60-80s: Aumento de 300 para 400 VUs
* 80-100s: Aumento de 400 para 500 VUs
* 100-160s: Manutenção de 500 VUs
* 160-180s: Redução de 500 para 0 VUs

### Servidor B200
* **Pool de Conexões**: 8 conexões por worker
* **Número de Workers**: 24

### Servidor H100
* **Pool de Conexões**: 8 conexões por worker
* **Número de Workers**: 24

## Resultados Comparativos

| Métrica | B200 | H100 |
|---------|------|------|
| **Duração Real do Teste** | 190 segundos | 193 segundos |
| **Requisições Completadas** | 2092 | 6309 |
| **Taxa de Requisições** | 11,01 req/s | 32,69 req/s |
| **Taxa de Erro** | 99,92% | 34,04% |
| **Tempo Médio de Resposta** | 14,86s | 9,35s |
| **Tempo Máximo de Resposta** | 15s (timeout) | 15s (timeout) |
| **P95 de Tempo de Resposta** | 14,88s | 14,79s |

## Análise da Degradação de Performance

### Servidor B200
- **Início da Degradação**: O servidor B200 mostrou degradação severa quase imediatamente, com 99,92% de falhas.
- **Comportamento sob Carga**: Apesar de completar 2092 requisições, quase todas as tentativas (3934 de 3937) resultaram em falhas.
- **Ponto Crítico**: O servidor atingiu seu ponto crítico praticamente desde o início do teste, possivelmente devido à combinação de muitos workers (24) com um pool pequeno por worker (8).

### Servidor H100
- **Início da Degradação**: O servidor H100 mostrou sinais de degradação mais gradual, com 34,04% de falhas.
- **Comportamento sob Carga**: Surpreendentemente manteve uma alta taxa de processamento (32,69 req/s) mesmo com a carga pesada.
- **Ponto Crítico**: Começou a apresentar falhas significativas provavelmente após 300-400 VUs, mas continuou processando requisições em um ritmo razoável.

## Análise de Tempos de Processamento

### Cálculo de Embeddings

O cálculo de embeddings continua sendo a operação mais intensiva no processamento de memórias:

| Métrica | B200 | H100 |
|---------|------|------|
| **Tempo Médio** | 118,24 ms | 118,24 ms |
| **Tempo Mínimo** | 70,42 ms | 70,42 ms |
| **Tempo Máximo** | 481,40 ms | 481,40 ms |

### Impacto da Configuração de Workers e Pool de Conexões

Esta sessão apresentou uma inversão notável no desempenho dos servidores:

| Configuração | B200 | H100 |
|--------------|------|------|
| **Total de Workers** | 24 | 24 |
| **Pool por Worker** | 8 | 8 |
| **Total de Conexões** | 192 | 192 |
| **Taxa de Processamento** | 11,01 req/s | 32,69 req/s |

Com a mesma configuração (24 workers, 8 conexões por worker), o H100 superou significativamente o B200, o que contradiz os resultados das sessões anteriores. Isso sugere que o H100 lida melhor com um número maior de workers, enquanto o B200 pode se beneficiar mais de pools maiores por worker.

## Estimativa de Processamento de Tokens

### Volume de Tokens Processados

Durante esta sessão de benchmark, estimamos o volume de tokens processados com base nas requisições bem-sucedidas:

| Servidor | Requisições Bem-sucedidas | Tamanho Médio do Texto | Tokens por Texto (est.) | Total de Tokens Processados |
|----------|---------------------------|------------------------|--------------------------|------------------------------|
| B200 | 3 (apenas 0,08% de sucesso) | 53,4 caracteres | ~15 tokens | ~45 tokens |
| H100 | 4213 | 53,4 caracteres | ~15 tokens | ~63.195 tokens |

### Taxa de Processamento de Tokens

| Servidor | Taxa de Processamento de Tokens |
|----------|--------------------------------|
| B200 | ~0,24 tokens/segundo |
| H100 | ~327 tokens/segundo |

## Considerações sobre o Hardware

Este teste revelou uma diferença fundamental entre os servidores quando configurados com muitos workers (24) e pools pequenos (8 conexões por worker):

1. **H100**: Parece lidar melhor com a fragmentação de recursos em muitos workers, mantendo um desempenho razoável mesmo com pools pequenos.

2. **B200**: Apresentou uma degradação catastrófica com esta configuração, sugerindo que ele se beneficia mais de pools maiores por worker do que de ter muitos workers.

## Análise de Falhas

### B200
- Taxa de falha extremamente alta de 99,92% (3934 falhas em 3937 requisições)
- Quase todas as requisições atingiram ou ficaram próximas do timeout (15s)
- O p95 de 14,88s indica que praticamente todas as requisições estavam demorando quase o timeout completo

### H100
- Taxa de falha de 34,04% (2175 falhas em 6388 requisições)
- Tempo médio de resposta mais baixo (9,35s) em comparação com o B200 (14,86s)
- Distribuição de tempos de resposta mais ampla, variando de 687ms a 15s

## Conclusões

1. **Configurações Ótimas Diferentes**: Este teste revela claramente que os servidores B200 e H100 têm configurações ótimas diferentes. O H100 parece lidar melhor com muitos workers, enquanto o B200 prefere pools maiores por worker.

2. **Inversão de Desempenho**: Com 24 workers e 8 conexões por worker, o H100 superou significativamente o B200, o que representa uma inversão completa em relação aos resultados anteriores. Isso destaca a importância crítica da configuração adequada para cada tipo de hardware.

3. **Escalabilidade de Workers**: O H100 parece escalar melhor com o aumento do número de workers, enquanto o B200 pode ter um limite mais baixo além do qual o desempenho degrada rapidamente.

4. **Fragmentação de Recursos**: A configuração com muitos workers e pools pequenos pode levar à fragmentação excessiva de recursos, afetando especialmente o B200.

## Recomendações

1. **Configurações Específicas por Hardware**: Adotar configurações diferentes para cada tipo de servidor:
   - Para B200: Menos workers (8-16) com pools maiores por worker (25+)
   - Para H100: Mais workers (16-24) com pools moderados por worker (12+)

2. **Monitoramento Dinâmico**: Implementar monitoramento em tempo real que possa detectar degradações e ajustar dinamicamente a configuração ou redirecionar o tráfego.

3. **Testes Adicionais**: Realizar testes adicionais com diferentes combinações de workers e tamanhos de pool para identificar o ponto ótimo para cada servidor.

4. **Otimização de Código**: Considerar otimizações específicas para cada arquitetura de servidor, aproveitando os pontos fortes de cada um.

5. **Balanceamento Inteligente de Carga**: Implementar um sistema de balanceamento de carga que leve em conta as características específicas de cada servidor e o tipo de carga atual.