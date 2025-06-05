# Comparação de Desempenho entre Servidores - Bench Session 060

## Visão Geral

Este documento apresenta uma análise comparativa do desempenho entre os servidores B200 e H100 durante a sessão de benchmark 060, executada em 04/06/2025. Ambos os servidores foram submetidos a testes de stress usando o script `stress-memorize-apikey-env` com configurações idênticas de carga, mas com configurações diferentes de recursos do servidor.

## Configuração do Teste

| Parâmetro | Valor |
|-----------|-------|
| **Script** | stress-memorize-apikey-env |
| **Tipo de Teste** | stress |
| **Endpoint** | /memorize |
| **Método** | POST |
| **Virtual Users (VUs)** | Até 100 |
| **Duração Planejada** | 100 segundos |
| **Timeout por Requisição** | 15s |
| **Sleep entre Requisições** | 0.1s |

### Rampa de Carga
* 0-10s: Aumento de 1 para 50 VUs
* 10-30s: Aumento de 50 para 100 VUs
* 30-90s: Manutenção de 100 VUs
* 90-100s: Redução de 100 para 0 VUs

### Servidor B200
* **Pool de Conexões**: 25 conexões por worker
* **Número de Workers**: 8

### Servidor H100
* **Pool de Conexões**: 25 conexões por worker
* **Número de Workers**: 8
* **Observação**: Configuração real do servidor, apesar do AGENT_ID indicar incorretamente 16 workers e 12 conexões

## Resultados Comparativos

| Métrica | B200 | H100 |
|---------|------|------|
| **Duração Real do Teste** | 106 segundos | 117 segundos |
| **Requisições Completadas** | 3616 | 2460 |
| **Taxa de Requisições** | 34,11 req/s | 21,03 req/s |
| **Taxa de Erro** | 6,96% | 0% |
| **Tempo Médio de Resposta** | 2,19s | 3,29s |
| **Tempo Máximo de Resposta** | 15s (timeout) | 11,91s |
| **P95 de Tempo de Resposta** | 14,87s | 10,73s |

## Análise da Degradação de Performance

### Servidor B200
- **Início da Degradação**: O servidor B200 mostrou sinais de degradação com o aumento da carga, resultando em uma taxa de erro de 6,96%.
- **Comportamento sob Carga**: Manteve uma taxa relativamente alta de 34,11 req/s, mas com alguns timeouts (252 falhas em 3616 requisições).
- **Ponto Crítico**: A degradação parece ter ocorrido gradualmente, com tempos de resposta variando significativamente (de 247ms a 15s).

### Servidor H100
- **Início da Degradação**: O servidor H100 mostrou um comportamento mais estável com tempos de resposta mais consistentes, embora mais lentos em média.
- **Comportamento sob Carga**: Processou menos requisições (2460) a uma taxa menor (21,03 req/s), mas sem falhas.
- **Ponto Crítico**: Não atingiu um ponto crítico que resultasse em falhas, mas operou a uma taxa mais baixa.

## Análise de Tempos de Processamento

### Cálculo de Embeddings

O cálculo de embeddings é a operação mais intensiva no processamento de memórias. Ambos os servidores apresentaram tempos similares:

| Métrica | B200 | H100 |
|---------|------|------|
| **Tempo Médio** | 118,24 ms | 118,24 ms |
| **Tempo Mínimo** | 70,42 ms | 70,42 ms |
| **Tempo Máximo** | 481,40 ms | 481,40 ms |

### Impacto da Configuração de Workers e Pool de Conexões

A diferença na configuração dos servidores conforme indicado pelo AGENT_ID parece ter impactado o desempenho:

| Configuração | B200 | H100 (conforme AGENT_ID) |
|--------------|------|------|
| **Total de Workers** | 8 | 16 |
| **Pool por Worker** | 25 | 12 |
| **Total de Conexões** | 200 | 192 |
| **Taxa de Processamento** | 34,11 req/s | 21,03 req/s |

O B200 conseguiu processar mais requisições a uma taxa mais alta. Isso pode sugerir que a configuração de 8 workers com pool maior por worker é mais eficiente que a configuração com mais workers e pools menores, embora também possa haver outros fatores de hardware ou arquitetura influenciando esses resultados.

## Estimativa de Processamento de Tokens

### Volume de Tokens Processados

Durante esta sessão de benchmark, estimamos o volume de tokens processados com base nas requisições bem-sucedidas:

| Servidor | Requisições Bem-sucedidas | Tamanho Médio do Texto | Tokens por Texto (est.) | Total de Tokens Processados |
|----------|---------------------------|------------------------|--------------------------|------------------------------|
| B200 | 3364 | 53,4 caracteres | ~15 tokens | ~50.460 tokens |
| H100 | 2460 | 53,4 caracteres | ~15 tokens | ~36.900 tokens |

### Taxa de Processamento de Tokens

| Servidor | Taxa de Processamento de Tokens |
|----------|--------------------------------|
| B200 | ~476 tokens/segundo |
| H100 | ~315 tokens/segundo |

## Considerações sobre o Hardware

O servidor B200 possui 8 GPUs que foram utilizadas para processamento, embora as bibliotecas da aplicação não consigam detectar explicitamente. O servidor H100 também dispõe de hardware de GPU para aceleração de cálculos. A configuração registrada no AGENT_ID do H100 (16 workers com 12 conexões por worker) pode não refletir a configuração real durante o teste, ou pode haver outros fatores influenciando o desempenho além da configuração de workers/pools.

## Análise de Falhas

### B200
- Taxa de falha de 6,96% (252 falhas em 3616 requisições)
- As falhas foram principalmente timeouts, com tempo máximo de resposta chegando a 15s
- A distribuição do p95 (14,87s) sugere que as falhas ocorreram principalmente nos momentos de pico de carga

### H100
- Não foram detectadas falhas durante o teste
- O tempo máximo de resposta (11,91s) ficou abaixo do limite de timeout (15s)
- Embora não tenha apresentado falhas, a taxa de processamento foi significativamente menor

## Conclusões

1. **Diferenças de Desempenho**: O B200 conseguiu processar mais requisições (34,11 req/s) que o H100 (21,03 req/s), sugerindo diferenças na eficiência do hardware ou configuração.

2. **Taxa de Processamento vs. Estabilidade**: O B200 priorizou uma taxa de processamento mais alta à custa de algumas falhas (6,96%), enquanto o H100 priorizou a estabilidade (0% de falhas) à custa de uma taxa menor.

3. **Configuração Ótima**: Os resultados sugerem que, independentemente da configuração real do H100, o B200 com 8 workers e 25 conexões por worker apresentou um bom equilíbrio entre taxa de processamento e estabilidade.

4. **Fatores Além da Configuração**: Há possivelmente outros fatores além da configuração de workers e pools que influenciam o desempenho, como a arquitetura específica de cada servidor, capacidade de processamento de hardware, e otimizações no nível do sistema.

## Recomendações

1. **Verificação e Validação de Configuração**: Verificar se a configuração indicada no AGENT_ID reflete a configuração real de runtime, e estabelecer um processo mais confiável para registrar a configuração efetivamente utilizada durante os testes.

2. **Distribuição de Carga**: Implementar um mecanismo de balanceamento de carga mais eficiente que considere a capacidade real de processamento de cada servidor.

3. **Monitoramento de Recursos**: Implementar um monitoramento mais detalhado dos recursos de hardware (CPU, memória, I/O) para identificar possíveis gargalos.

4. **Ajustes de Timeout**: Considerar ajustes dinâmicos de timeout baseados na carga atual do sistema para reduzir a taxa de falhas no B200.

5. **Cache de Embeddings**: Melhorar o mecanismo de cache para reduzir a necessidade de cálculos repetidos de embeddings, que representam o principal gargalo no processamento.