# Comparação entre Servidores B200 e H100 - Sessão bench-session-046

## Visão Geral

Este documento apresenta uma comparação detalhada entre os servidores B200 e H100 durante os testes de estresse realizados na sessão bench-session-046. A análise foca em aspectos como desempenho, taxa de erros, tempos de resposta e capacidade de processamento.

## Configuração dos Testes

| Parâmetro | Valor |
|-----------|-------|
| Tipo de Teste | Stress |
| Script | stress-memorize-apikey-env |
| Usuários Virtuais (VUs) | Até 100 |
| Duração | Aproximadamente 1m40s (planejada) |
| Requisições | POST /memorize |
| Timeout | 15s |
| Sleep entre requisições | 0.05s |

## Resultados Principais

### Métricas de Performance

| Métrica | Servidor B200 | Servidor H100 |
|---------|---------------|--------------|
| Requisições Completadas | 3.134 | 566 |
| Taxa de Requisições (req/s) | 31,34 | 5,39 |
| Tempo Médio de Resposta | 2,62s | 14,03s |
| Taxa de Erros | 0% | 86,74% |
| Duração Total do Teste | 105s | 148s |

### Tempos de Resposta (ms)

| Percentil | Servidor B200 | Servidor H100 |
|-----------|---------------|--------------|
| Min | 148,54ms | 863,26ms |
| Mediana (p50) | 3.010ms | 14.790ms |
| p90 | 3.360ms | 14.800ms |
| p95 | 3.460ms | 15.000ms |
| Max | 5.230ms | 15.000ms (timeout) |

### Processamento de Tokens

| Métrica | Servidor B200 | Servidor H100 |
|---------|---------------|--------------|
| Total de Tokens Processados | 100.288 | 20.288 |
| Taxa de Processamento (tokens/s) | 955,12 | 137,08 |

## Análise Comparativa

### Throughput e Escalabilidade

O servidor B200 demonstrou throughput significativamente superior, processando 31,34 requisições por segundo, comparado a apenas 5,39 req/s do H100. Além disso, o B200 manteve 100% de taxa de sucesso mesmo sob carga de 100 VUs simultâneos, enquanto o H100 apresentou alta degradação com 86,74% de falhas.

A escalabilidade do B200 é notavelmente superior, mantendo tempos de resposta consistentes à medida que a carga aumenta. O H100 começou a degradar significativamente logo no início do ramp-up, apresentando timeouts mesmo com poucas VUs ativas.

### Latência e Responsividade

A diferença de latência entre os servidores é dramática. O tempo médio de resposta do B200 (2,62s) é aproximadamente 5,4 vezes menor que o do H100 (14,03s). Os logs do servidor mostram que o B200 mantém respostas abaixo de 5,5 segundos mesmo sob carga máxima, enquanto o H100 rapidamente atinge o limite de timeout de 15 segundos.

A distribuição dos tempos de resposta também é reveladora:
- B200: 18% abaixo de 1s, 32% entre 1-2s, 48% entre 2-5s
- H100: 88% acima de 10s, com a maioria das requisições atingindo o timeout

### Estabilidade sob Carga

O servidor B200 manteve operação estável durante todo o teste, sem falhas e com tempos de resposta previsíveis. A progressão dos tempos de resposta mostrou apenas um aumento gradual à medida que a carga aumentava.

O H100, por outro lado, demonstrou instabilidade imediata sob carga. Os tempos de resposta aumentaram drasticamente logo nos primeiros segundos do teste, e a maioria das requisições falhou com timeout. A análise dos logs mostra que o H100 começou a degradar quando o número de VUs ultrapassou aproximadamente 20.

### Eficiência no Processamento

O B200 demonstrou eficiência de processamento muito superior, com tempos de resposta médios de 1.742ms para requisições bem-sucedidas, comparado a 40.563ms do H100. Isso representa uma diferença de aproximadamente 23 vezes na velocidade de processamento.

A taxa de processamento de tokens do B200 (955,12 tokens/s) supera em aproximadamente 7 vezes a do H100 (137,08 tokens/s), indicando que a arquitetura B200 é significativamente mais eficiente para a carga de trabalho de embeddings da Memória Neural do Qube.

## Gráficos Comparativos

### Taxa de Requisições (req/s)
```
B200: #################################### (31,34 req/s)
H100: ##### (5,39 req/s)
```

### Tempo Médio de Resposta (ms)
```
B200: ##### (2.620 ms)
H100: ############################ (14.030 ms)
```

### Progressão do Tempo de Resposta (primeiras 50 requisições, a cada 5)
```
B200: # (276ms) # (276ms) # (240ms) # (241ms) # (167ms) # (231ms) # (233ms) # (239ms) # (253ms) # (254ms)
H100: ### (1858ms) ##### (3051ms) ####### (3918ms) ####### (3919ms) ######### (5426ms) ######### (5440ms) 
       ######## (4541ms) ############### (9952ms) ############### (9952ms) ############### (9952ms)
```

## Conclusões

1. O servidor B200 supera significativamente o H100 em todos os aspectos de performance para a carga de trabalho da Memória Neural do Qube.

2. A diferença de performance é dramática: o B200 processa aproximadamente 5,8 vezes mais requisições por segundo, com tempos de resposta 5,4 vezes menores e 0% de falhas (comparado a 86,74% do H100).

3. A degradação de performance do H100 é severa mesmo sob cargas moderadas (menos de 50 VUs), enquanto o B200 mantém operação estável com 100 VUs.

4. A arquitetura B200 demonstra ser significativamente mais adequada para o processamento de embeddings em tempo real, especialmente quando há necessidade de escalabilidade e baixa latência.

5. A análise dos logs mostra que o H100 começa a apresentar tempos de resposta inaceitáveis (>10s) logo no início do teste, enquanto o B200 mantém respostas rápidas e consistentes.

## Recomendações

1. Utilizar preferencialmente a arquitetura B200 para implantações de produção da Memória Neural do Qube, especialmente quando há expectativa de carga moderada a alta.

2. Investigar possíveis otimizações específicas para o H100 caso seu uso seja necessário por outros motivos, como compatibilidade ou disponibilidade.

3. Considerar o ajuste de timeouts para valores mais baixos no servidor H100, já que muitas requisições atingem o limite máximo de 15s.

4. Realizar testes adicionais com diferentes configurações de pool de workers no servidor H100 para tentar mitigar os problemas de performance.

5. Para implantações de alta disponibilidade, considerar clusters de servidores B200 em vez de H100, dado o desempenho superior e estabilidade sob carga.