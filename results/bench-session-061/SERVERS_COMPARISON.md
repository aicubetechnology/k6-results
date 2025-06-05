# Comparação de Desempenho entre Servidores - Bench Session 061

## Visão Geral

Este documento apresenta uma análise comparativa do desempenho entre os servidores B200 e H100 durante a sessão de benchmark 061, executada em 04/06/2025. Ambos os servidores foram submetidos a testes de stress com alta carga (até 500 VUs) usando o script `stress-memorize-apikey-env` com configurações idênticas de carga e configurações semelhantes de recursos de servidor.

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
* **Pool de Conexões**: 12 conexões por worker
* **Número de Workers**: 16

### Servidor H100
* **Pool de Conexões**: 12 conexões por worker
* **Número de Workers**: 16

## Resultados Comparativos

| Métrica | B200 | H100 |
|---------|------|------|
| **Duração Real do Teste** | 188 segundos | 196 segundos |
| **Requisições Completadas** | 7892 | 6366 |
| **Taxa de Requisições** | 44,71 req/s | 32,48 req/s |
| **Taxa de Erro** | 35,63% | 21,01% |
| **Tempo Médio de Resposta** | 7,42s | 9,58s |
| **Tempo Máximo de Resposta** | 15s (timeout) | 15s (timeout) |
| **P95 de Tempo de Resposta** | 15s | 15s |

## Análise da Degradação de Performance

### Servidor B200
- **Início da Degradação**: O servidor B200 começou a mostrar sinais de degradação significativa provavelmente após 200-300 VUs, com base na taxa de erro observada.
- **Comportamento sob Carga**: Manteve uma taxa impressionante de 44,71 req/s, mas com uma taxa de erro significativa de 35,63%.
- **Ponto Crítico**: Atingiu seu ponto crítico quando a carga ultrapassou 400 VUs, resultando em um aumento significativo de timeouts.

### Servidor H100
- **Início da Degradação**: O servidor H100 começou a mostrar sinais de degradação após cerca de 100-200 VUs.
- **Comportamento sob Carga**: Surpreendentemente, manteve uma alta taxa de 32,48 req/s, mas com uma taxa de erro significativa de 21,01%.
- **Ponto Crítico**: Atingiu seu ponto crítico quando a carga ultrapassou ~300 VUs, resultando em um aumento significativo de timeouts.

## Análise de Tempos de Processamento

### Cálculo de Embeddings

O cálculo de embeddings continua sendo a operação mais intensiva no processamento de memórias:

| Métrica | B200 | H100 |
|---------|------|------|
| **Tempo Médio** | 118,24 ms | 118,24 ms |
| **Tempo Mínimo** | 70,42 ms | 70,42 ms |
| **Tempo Máximo** | 481,40 ms | 481,40 ms |

### Impacto da Configuração Idêntica de Workers e Pool de Conexões

Neste teste, ambos os servidores tinham a mesma configuração (16 workers, 12 conexões por worker), o que permite uma comparação mais direta do hardware:

| Configuração | B200 | H100 |
|--------------|------|------|
| **Total de Workers** | 16 | 16 |
| **Pool por Worker** | 12 | 12 |
| **Total de Conexões** | 192 | 192 |
| **Taxa de Processamento** | 44,71 req/s | 32,48 req/s |

Com a mesma configuração, o B200 conseguiu uma taxa de processamento significativamente superior à do H100 (44,71 req/s vs 32,48 req/s), embora também tenha apresentado uma taxa de erro mais alta (35,63% vs 21,01%).

## Estimativa de Processamento de Tokens

### Volume de Tokens Processados

Durante esta sessão de benchmark, estimamos o volume de tokens processados com base nas requisições bem-sucedidas:

| Servidor | Requisições Bem-sucedidas | Tamanho Médio do Texto | Tokens por Texto (est.) | Total de Tokens Processados |
|----------|---------------------------|------------------------|--------------------------|------------------------------|
| B200 | 5183 (8052 total - 35,63% falhas) | 53,4 caracteres | ~15 tokens | ~77.745 tokens |
| H100 | 4919 | 53,4 caracteres | ~15 tokens | ~73.785 tokens |

### Taxa de Processamento de Tokens

| Servidor | Taxa de Processamento de Tokens |
|----------|--------------------------------|
| B200 | ~413 tokens/segundo |
| H100 | ~376 tokens/segundo |

## Considerações sobre o Hardware

Com configurações idênticas de workers e pool de conexões, este teste oferece uma comparação mais direta do hardware subjacente. O H100 apresentou um desempenho surpreendentemente bom, considerando seus resultados anteriores, sugerindo que a configuração otimizada de workers e pool de conexões pode ser crucial para seu desempenho.

## Análise de Falhas

### B200
- Taxa de falha de 35,63% (2869 falhas em 8052 requisições)
- Tempo médio de resposta de 7,42s, com p95 de 15s, indicando que muitas requisições atingiram o timeout
- O sistema demonstrou capacidade de processar um grande volume de requisições (44,71 req/s), mas com uma taxa significativa de falhas
- Os tempos de resposta variaram consideravelmente, desde 253ms até o timeout de 15s

### H100
- Taxa de falha de 21,01% (1309 falhas em 6228 requisições)
- A maioria das falhas foram timeouts, com tempo de resposta de 15s
- O p95 de 15s indica que pelo menos 5% das requisições atingiram o timeout máximo

## Conclusões

1. **Diferença de Desempenho com Configuração Idêntica**: Com a mesma configuração (16 workers, 12 conexões por worker), o B200 superou o H100 em termos de taxa de processamento (44,71 req/s vs 32,48 req/s), confirmando que há diferenças de desempenho intrínsecas ao hardware.

2. **Trade-off entre Taxa de Processamento e Erros**: Ambos os servidores demonstraram um trade-off entre taxa de processamento e taxa de erro. O B200 teve uma taxa de processamento 37% maior, mas também uma taxa de erro 70% maior.

3. **Escalabilidade sob Alta Carga**: Ambos os servidores mostraram limitações de escalabilidade sob carga muito alta (500 VUs), com taxas de erro significativas, sendo 35,63% para B200 e 21,01% para H100.

4. **Importância da Configuração de Workers e Pool**: Este teste confirma a importância crítica da configuração adequada de workers e pool de conexões para o desempenho ótimo dos servidores, embora ainda haja diferenças de desempenho inerentes ao hardware.

## Recomendações

1. **Ajuste Fino de Configuração**: Continuar o processo de ajuste fino da configuração de workers e pool de conexões para encontrar o ponto ótimo para cada servidor.

2. **Limitação de Carga**: Implementar mecanismos de limitação de carga (throttling) para evitar sobrecarga dos servidores. Com base nos resultados, um limite de ~300 VUs parece apropriado.

3. **Balanceamento entre Servidores**: Considerar direcionar tipos específicos de cargas para servidores específicos, aproveitando os pontos fortes de cada um.

4. **Otimização de Cálculo de Embeddings**: Continuar a otimização do cálculo de embeddings, possivelmente através de técnicas como quantização ou modelos mais leves.

5. **Implementação de Cache Distribuído**: Considerar a implementação de um sistema de cache distribuído para reduzir a necessidade de recalcular embeddings frequentemente.