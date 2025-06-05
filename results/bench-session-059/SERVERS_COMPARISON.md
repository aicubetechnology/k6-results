# Comparação de Desempenho entre Servidores - Bench Session 059

## Visão Geral

Este documento apresenta uma análise comparativa do desempenho entre os servidores B200 e H100 durante a sessão de benchmark 059, executada em 04/06/2025. Ambos os servidores foram submetidos a testes de stress usando o script `stress-memorize-apikey-env` com configurações idênticas.

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

## Resultados Comparativos

| Métrica | B200 | H100 |
|---------|------|------|
| **Duração Real do Teste** | 106 segundos | 138 segundos |
| **Requisições Completadas** | 5512 | 640 |
| **Taxa de Requisições** | 52,00 req/s | 4,64 req/s |
| **Taxa de Erro** | 0% | 86,04% |
| **Tempo Médio de Resposta** | 1,4s | 13,98s |
| **Tempo Máximo de Resposta** | 2,56s | 15s (timeout) |
| **P95 de Tempo de Resposta** | 2s | 15s (timeout) |

## Análise da Degradação de Performance

### Servidor B200
- **Início da Degradação**: O servidor B200 não mostrou sinais significativos de degradação durante o teste, mantendo tempos de resposta consistentes abaixo de 2,56s mesmo com 100 VUs.
- **Comportamento sob Carga**: Manteve uma taxa estável de 52 req/s sem apresentar erros ou timeouts.
- **Ponto Crítico**: Não foi atingido um ponto crítico durante o teste com 100 VUs.

### Servidor H100
- **Início da Degradação**: O servidor H100 começou a mostrar sinais de degradação logo no início do teste, mesmo com poucos VUs.
- **Comportamento sob Carga**: Apresentou uma alta taxa de erros (86,04%) e tempos de resposta elevados (média de 13,98s).
- **Ponto Crítico**: Atingiu seu ponto crítico rapidamente, resultando em timeouts na maioria das requisições.

## Análise de Tempos de Processamento

### Cálculo de Embeddings

O cálculo de embeddings é a operação mais intensiva no processamento de memórias. Abaixo está uma comparação do tempo gasto nesta operação entre os servidores:

| Métrica | B200 | H100 |
|---------|------|------|
| **Tempo Médio** | 22,62 ms | 28,77 ms |
| **Tempo Mínimo** | 12,39 ms | 19,37 ms |
| **Tempo Máximo** | 57,33 ms | 64,20 ms |

### Tamanho dos Textos Processados

O tamanho dos textos processados afeta diretamente o tempo de cálculo dos embeddings:

| Tamanho do Texto | B200 (Tempo Médio) | H100 (Tempo Médio) |
|------------------|--------------------|--------------------|
| 34 caracteres | 12,39 ms | 64,20 ms |
| 49 caracteres | 57,33 ms | 19,66 ms |
| 58 caracteres | 13,43 ms | 19,37 ms |
| 61 caracteres | 14,65 ms | 19,53 ms |
| 65 caracteres | 15,30 ms | 21,11 ms |

## Estimativa de Processamento de Tokens

### Volume de Tokens Processados

Durante esta sessão de benchmark, estimamos o volume de tokens processados com base nas requisições bem-sucedidas:

| Servidor | Requisições Bem-sucedidas | Tamanho Médio do Texto | Tokens por Texto (est.) | Total de Tokens Processados |
|----------|---------------------------|------------------------|--------------------------|------------------------------|
| B200 | 5512 | 53,4 caracteres | ~15 tokens | ~82.680 tokens |
| H100 | 640 | 53,4 caracteres | ~15 tokens | ~9.600 tokens |

### Taxa de Processamento de Tokens

| Servidor | Taxa de Processamento de Tokens |
|----------|--------------------------------|
| B200 | ~780 tokens/segundo |
| H100 | ~70 tokens/segundo |

## Considerações sobre o Hardware

É importante notar que o servidor B200 possui 8 GPUs que foram utilizadas para processamento, embora as bibliotecas da aplicação não consigam detectar explicitamente. O servidor H100 também dispõe de hardware de GPU para aceleração de cálculos.

## Análise de Falhas

### B200
- Não foram detectadas falhas ou timeouts significativos durante o teste.
- O servidor manteve um desempenho estável e consistente durante toda a duração do teste.

### H100
- Alta taxa de falhas (86,04%), principalmente devido a timeouts.
- A duração média das requisições (13,98s) está próxima do limite de timeout configurado (15s), indicando que muitas requisições estavam atingindo o timeout.
- As falhas aumentaram significativamente quando o número de VUs se aproximou de 100.

## Conclusões

1. **Diferença de Performance**: O servidor B200 apresentou desempenho significativamente superior ao H100 neste teste específico, processando aproximadamente 11x mais requisições (5512 vs. 640) com tempo de resposta muito menor.

2. **Estabilidade sob Carga**: O B200 demonstrou excelente estabilidade sob carga, mantendo baixos tempos de resposta sem erros, enquanto o H100 degradou rapidamente com o aumento da carga.

3. **Eficiência de Processamento**: Embora os tempos médios de cálculo de embeddings sejam relativamente próximos (22,62ms vs. 28,77ms), a capacidade do B200 de processar requisições em paralelo parece ser muito superior.

4. **Escalabilidade**: O B200 demonstrou melhor escalabilidade, sugerindo uma arquitetura mais adequada para cenários de alta carga.

## Recomendações

1. **Investigação do H100**: Investigar as causas das falhas no servidor H100, que podem estar relacionadas a configurações de conexão, limitações de recursos ou problemas na aplicação.

2. **Otimização de Recursos**: Avaliar a alocação de recursos para o servidor H100, especialmente em relação ao processamento paralelo e pooling de conexões.

3. **Ajustes de Configuração**: Considerar ajustes na configuração do servidor H100 para melhorar sua capacidade de lidar com cargas maiores.

4. **Testes Adicionais**: Realizar testes adicionais com diferentes níveis de carga para determinar o ponto ótimo de operação para cada servidor.

5. **Monitoramento em Tempo Real**: Implementar monitoramento mais detalhado para identificar gargalos específicos durante a operação.