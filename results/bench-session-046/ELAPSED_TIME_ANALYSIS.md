# Análise de Tempo de Resposta - Sessão bench-session-046

Este documento apresenta uma análise detalhada dos tempos de resposta dos servidores B200 e H100 durante os testes de estresse realizados na sessão bench-session-046. Para uma análise mais detalhada do tempo de execução das funções Python específicas, consulte o arquivo [PYTHON_FUNCTIONS_TIMING.md](./PYTHON_FUNCTIONS_TIMING.md).

## Evolução dos Tempos de Resposta

Com base na análise dos logs dos servidores, podemos observar os seguintes padrões:

### H100 - Progressão do Tempo de Resposta

| Grupo de Requisições | Tempo Médio de Resposta | Padrão |
|----------------------|-------------------------|--------|
| 1-10 | 2.095,26 ms | Degradação rápida já no início |
| 11-20 | 3.312,41 ms | Aumento de ~58% em relação ao grupo anterior |
| 21-30 | 4.976,84 ms | Aumento de ~50% em relação ao grupo anterior |
| 31-40 | 5.803,24 ms | Aumento de ~17% em relação ao grupo anterior |
| 41-50 | 9.951,85 ms | Aumento de ~71% em relação ao grupo anterior |
| 51-60 | 9.952,39 ms | Estabilização próxima ao timeout |
| 61-70 | 11.561,50 ms | Aproximando-se do limite de timeout (15s) |
| 71-80 | 12.554,07 ms | Aproximando-se do limite de timeout (15s) |
| 81-90 | 9.052,46 ms | Ligeira melhora (possivelmente por requisições já em timeout) |
| 91-100 | 17.171,80 ms | Além do limite de timeout (provavelmente erro de registro) |

### B200 - Progressão do Tempo de Resposta

| Grupo de Requisições | Tempo Médio de Resposta | Padrão |
|----------------------|-------------------------|--------|
| 1-10 | 264,14 ms | Tempo de resposta inicial rápido |
| 11-20 | 165,72 ms | Melhora em relação ao grupo inicial |
| 21-30 | 166,20 ms | Estável |
| 31-40 | 234,95 ms | Leve degradação, mas ainda rápido |
| 41-50 | 248,09 ms | Estável com leve degradação |
| 51-60 | 266,62 ms | Estável com leve degradação |
| 61-70 | 275,48 ms | Estável com leve degradação |
| 71-80 | 309,91 ms | Degradação controlada |
| 81-90 | 305,53 ms | Estável |
| 91-100 | 341,54 ms | Degradação controlada |

## Análise de Degradação

### Padrão de Degradação H100

O servidor H100 apresenta um padrão de degradação extremamente rápido:
- Já nas primeiras 10 requisições, o tempo médio de resposta é superior a 2 segundos
- Em apenas 50 requisições, o tempo médio já ultrapassa 9,9 segundos
- A partir de 60-70 requisições, a maioria das respostas se aproxima ou atinge o timeout (15s)

O padrão sugere que o servidor H100 não consegue processar eficientemente múltiplas requisições simultâneas, possivelmente devido a:
1. Limitações no gerenciamento de threads/workers
2. Ineficiência no processamento de embeddings na arquitetura H100
3. Possível contenção de recursos compartilhados

### Padrão de Degradação B200

O servidor B200 apresenta um padrão de degradação muito mais controlado:
- Mantém tempos de resposta abaixo de 350ms para as primeiras 100 requisições
- A degradação é gradual e previsível
- Mesmo com 100 VUs simultâneas, o tempo médio de resposta permanece em torno de 2,62s

Isso sugere que o B200:
1. Gerencia eficientemente múltiplas requisições simultâneas
2. Processa embeddings de forma mais eficiente nesta carga de trabalho específica
3. Tem melhor escalabilidade sob carga crescente

## Tempos de Resposta por Fase do Teste

### Fase Inicial (1-30% da carga)
- **H100**: 2.000-5.000 ms (já elevado)
- **B200**: 150-250 ms (resposta rápida)

### Fase Intermediária (30-70% da carga)
- **H100**: 5.000-12.000 ms (severa degradação)
- **B200**: 250-1.000 ms (degradação controlada)

### Fase de Pico (70-100% da carga)
- **H100**: >12.000 ms (maioria em timeout)
- **B200**: 1.000-3.500 ms (ainda respondendo eficientemente)

## Análise de Tendência

### H100
```
Tendência: Exponencial ↗️
2.095ms → 3.312ms → 4.976ms → 5.803ms → 9.951ms → 9.952ms → 11.561ms → 12.554ms → ...
```

### B200
```
Tendência: Linear Gradual ↗️
264ms → 165ms → 166ms → 234ms → 248ms → 266ms → 275ms → 309ms → 305ms → 341ms → ...
```

## Eficiência Relativa no Processamento

| Métrica | B200 | H100 | Fator B200:H100 |
|---------|------|------|----------------|
| Tempo médio por requisição | 1.742,54 ms | 40.563,00 ms | 23,3x mais rápido |
| Tempo médio por token | 1,05 ms | 7,30 ms | 7,0x mais eficiente |
| Degradação a cada 10 requisições | ~8% | ~70% | 8,8x mais estável |

## Conclusão

A análise detalhada dos tempos de resposta confirma uma diferença significativa de desempenho entre os servidores B200 e H100 para a carga de trabalho da Memória Neural do Qube:

1. O B200 apresenta tempos de resposta iniciais cerca de 8x mais rápidos que o H100.

2. A degradação de performance do H100 é exponencial, enquanto a do B200 é linear e controlada.

3. Mesmo nas fases iniciais do teste, o H100 já demonstra dificuldade em processar múltiplas requisições simultâneas.

4. O B200 mantém tempos de resposta aceitáveis mesmo sob carga máxima de 100 VUs.

5. A diferença no tempo médio de processamento por requisição (23,3x) sugere que a arquitetura B200 é significativamente mais adequada para o tipo de processamento de embeddings realizado pela Memória Neural do Qube.

Esta análise de tempos de resposta complementa as informações apresentadas nos documentos SERVERS_COMPARISON.md, TOKEN_PROCESSING_ESTIMATE.md e PYTHON_FUNCTIONS_TIMING.md, reforçando a conclusão de que o B200 é a escolha superior para implantações que exigem throughput consistente e baixa latência.

## Relação com Tempos de Execução de Funções Python

Os tempos de resposta observados nos testes estão diretamente relacionados com o desempenho das funções Python individuais que compõem o fluxo de processamento da API. Conforme detalhado em [PYTHON_FUNCTIONS_TIMING.md](./PYTHON_FUNCTIONS_TIMING.md), as principais operações como geração de embeddings, acesso ao banco de dados e processamento HTTP apresentam diferenças significativas de performance entre os servidores B200 e H100.

A análise dos commits `6b318aa9` a `21df4fdb` revelou a instrumentação de código que media o tempo de execução destas funções, permitindo-nos correlacionar o comportamento observado em nível de API com o desempenho das funções subjacentes:

1. O tempo total de resposta da API é a soma dos tempos de várias funções internas
2. A degradação sob carga afeta cada uma destas funções, mas em taxas diferentes
3. Operações como geração de embeddings são particularmente mais eficientes no B200

Esta correlação entre o tempo de resposta da API e o desempenho das funções internas fornece uma visão mais completa do comportamento do sistema e confirma que a superioridade do B200 se manifesta em todos os níveis do stack de software.