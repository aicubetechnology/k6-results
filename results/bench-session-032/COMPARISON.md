# Comparação de Performance - bench-session-032

## Visão Geral

Este documento apresenta uma comparação detalhada do desempenho entre os servidores B200 e H100 durante os testes de stress da sessão bench-session-032. O objetivo é analisar como cada arquitetura se comportou sob carga extrema e identificar diferenças de performance.

## Configuração dos Testes

| Parâmetro | Valor |
|-----------|-------|
| Tipo de Teste | Stress |
| Script | stress-memorize-apikey-env |
| Endpoint | /memorize (POST) |
| Usuários Virtuais | Até 25.000 VUs |
| Duração Planejada | 240 segundos |
| Timeout por Requisição | 15 segundos |
| Sleep entre Requisições | 0.05 segundos |

## Comparação de Métricas Principais

| Métrica | B200 | H100 | Diferença (%) | Melhor Desempenho |
|---------|------|------|--------------|-------------------|
| Duração Real do Teste | 255s | 254s | 0,39% | H100 |
| Total de Requisições | 344.844 | 312.567 | 10,33% | B200 |
| Taxa de Requisições | 1.380,88 req/s | 1.258,55 req/s | 9,72% | B200 |
| Requisições Bem-sucedidas | 1.269 | 262 | 384,35% | B200 |
| Taxa de Falha | 99,63% | 99,91% | -0,28% | B200 |
| Média de Tempo de Resposta | 2,09s | 2,64s | -20,83% | B200 |
| Mediana de Tempo de Resposta | 346,01ms | 1,22s | -71,64% | B200 |
| Tempo de Resposta (P90) | 6,18s | 6,93s | -10,82% | B200 |
| Tempo de Resposta (P95) | 12,59s | 14,6s | -13,77% | B200 |

## Análise de Distribuição de Tempos de Resposta

| Percentil | B200 | H100 | Diferença (%) | Melhor Desempenho |
|-----------|------|------|--------------|-------------------|
| Mediana (P50) | 346,01ms | 1,22s | -71,64% | B200 |
| P90 | 6,18s | 6,93s | -10,82% | B200 |
| P95 | 12,59s | 14,6s | -13,77% | B200 |
| Máximo | 21,88s | 21,81s | 0,32% | H100 |

## Processamento de Dados

| Métrica | B200 | H100 | Diferença (%) | Melhor Desempenho |
|---------|------|------|--------------|-------------------|
| Dados Recebidos | 47 MB | 42 MB | 11,90% | B200 |
| Taxa de Recepção | 190 kB/s | 170 kB/s | 11,76% | B200 |
| Dados Enviados | 139 MB | 125 MB | 11,20% | B200 |
| Taxa de Envio | 555 kB/s | 504 kB/s | 10,12% | B200 |

## Estimativa de Processamento de Tokens

| Métrica | B200 | H100 | Diferença (%) | Melhor Desempenho |
|---------|------|------|--------------|-------------------|
| Tokens Processados (estimativa) | 40.608 | 8.384 | 384,35% | B200 |
| Taxa de Processamento | 159,25 tokens/s | 33,01 tokens/s | 382,43% | B200 |

## Análise Comparativa da Saúde do Servidor

Ambos os servidores reportaram estarem saudáveis antes e depois dos testes, com a informação "status": "healthy". No entanto, houve uma diferença importante na informação de GPUs disponíveis: ambos os servidores retornaram "gpus": [] em suas respostas de health check, o que pode indicar uma falha na detecção das GPUs ou um problema na configuração do serviço de monitoramento durante o teste.

## Impacto da Carga Extrema

A carga de 25.000 VUs representou um estresse extremo para ambos os servidores, resultando em:

1. Taxas de falha extremamente altas (>99,6% em ambos os servidores)
2. Tempos de resposta elevados (mediana >346ms no B200 e >1,2s no H100)
3. Possível degradação na detecção de recursos (GPUs não reportadas)

## Conclusão

Sob condições de carga extrema (25.000 VUs), ambos os servidores apresentaram degradação severa, porém o servidor B200 demonstrou melhor capacidade de lidar com o estresse:

1. **Taxa de requisições mais alta:** O B200 processou cerca de 10% mais requisições por segundo.
2. **Maior número de requisições bem-sucedidas:** O B200 teve 384% mais requisições bem-sucedidas.
3. **Tempos de resposta menores:** Em todos os percentis, o B200 respondeu mais rapidamente.
4. **Processamento de tokens superior:** O B200 processou aproximadamente 4,8 vezes mais tokens.

Esses resultados sugerem que, mesmo sob condições extremas de carga, a arquitetura B200 oferece melhor resiliência e capacidade de processamento em comparação com a H100 para a aplicação Neural Memory. No entanto, é importante ressaltar que nenhum dos servidores foi capaz de manter um nível aceitável de serviço sob essa carga, o que indica a necessidade de otimizações adicionais ou limitações de carga para garantir a estabilidade do sistema em produção.

A ausência de informações sobre as GPUs nos relatórios de saúde sugere que o estresse extremo pode ter afetado a capacidade do sistema de monitoramento de recursos, o que requer investigação adicional.