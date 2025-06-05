# Visualização de Performance - Sessão bench-session-046

Este documento apresenta visualizações e análises detalhadas do desempenho dos servidores B200 e H100 durante os testes de estresse realizados na sessão bench-session-046.

## Evolução do Tempo de Resposta

### Comparação entre H100 e B200 (primeiras 100 requisições, média a cada 10)

```
Req    | B200 (ms)            | H100 (ms)                
-------+----------------------+--------------------------
10     | 264.14 ######        | 2095.26 ###              
20     | 165.72 ####          | 3312.41 ####             
30     | 166.20 ####          | 4976.84 #####            
40     | 234.95 #####         | 5803.24 ######           
50     | 248.09 #####         | 9951.85 ##########       
60     | 266.62 ######        | 9952.39 ##########       
70     | 275.48 ######        | 11561.50 ############    
80     | 309.91 #######       | 12554.07 #############   
90     | 305.53 #######       | 9052.46 ##########       
100    | 341.54 #######       | 17171.80 ##################
```

### Progressão ao Longo do Teste (ms)

```
                   B200                                        H100
Início:  153ms → 276ms → 276ms → 276ms                657ms → 658ms → 1858ms → 1858ms
         ↓                                             ↓ 
Meio:    276ms → 309ms → 305ms → 341ms                9952ms → 11561ms → 12554ms → 9052ms
         ↓                                             ↓
Final:   ~3000ms (carga máxima)                        ~15000ms (timeouts)
```

## Distribuição do Tempo de Resposta

### B200
```
< 1000ms:      ██████ (18%)
1000-2000ms:   ██████████ (32%)
2000-5000ms:   ███████████████ (48%)
5000-10000ms:  (0%)
> 10000ms:     (0%)
```

### H100
```
< 1000ms:      (0%)
1000-2000ms:   (0%)
2000-5000ms:   █ (3%)
5000-10000ms:  ██ (6%)
> 10000ms:     ████████████████████████████ (88%)
```

## Métricas Principais

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

### Taxa de Erros
```
B200: 0%
H100: ████████████████████████████ 86,74%
```

## Análise de Processamento de Tokens

### Total de Tokens Processados
```
B200: ████████████████████████████████████████████████████████ (100.288 tokens)
H100: ██████████ (20.288 tokens)
```

### Taxa de Processamento (tokens/s)
```
B200: ████████████████████████████████████████████████████████ (955,12 tokens/s)
H100: ███████ (137,08 tokens/s)
```

### Tempo Médio por Token
```
B200: █ (1,05 ms/token)
H100: ███████ (7,3 ms/token)
```

## Degradação de Performance

### Ponto de Degradação (VUs)
```
B200: Mantém estabilidade até 100 VUs
H100: Degradação significativa a partir de ~20 VUs
```

### Padrão de Degradação (tempo de resposta ao longo do teste)
```
B200: ▁▁▁▁▁▁▁▁▂▂▃▃▄▄▅▅▆▆
H100: ▂▃▅▆▇▇█████████████
```

## Conclusão Visual

```
Performance Relativa B200:H100
Requisições/s:      ██████:█
Tempo de Resposta:  █:██████
Sucesso:            ██████:█
Tokens/s:           ███████:█
```

Este documento complementa a análise detalhada em SERVERS_COMPARISON.md e TOKEN_PROCESSING_ESTIMATE.md com representações visuais para facilitar a compreensão das diferenças de desempenho entre os servidores B200 e H100.