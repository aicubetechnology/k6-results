# Análise Comparativa de Performance: Servidores B200 vs H100

## Resumo Executivo

Este documento apresenta uma análise comparativa de performance entre os servidores B200 e H100, baseada nos testes de stress realizados com o k6 em 28/05/2025. Ambos os servidores foram submetidos a testes idênticos de carga progressiva até 2000 usuários virtuais (VUs) simultâneos, utilizando o endpoint `/memorize` para inserção de memórias.

## Configuração dos Testes

| Parâmetro | Servidor B200 | Servidor H100 |
|-----------|--------------|--------------|
| **Endpoint** | /memorize (POST) | /memorize (POST) |
| **URL** | http://150.136.65.20:8000 | http://130.61.226.26:8000 |
| **Tenant ID** | qube_assistant_tenant_b200_test_10 | qube_assistant_tenant_h100_test_3 |
| **Agent ID** | agent_test_b200_bench020 | agent_test_h100_bench020 |
| **VUs Máximos** | 2000 | 2000 |
| **Duração Planejada** | 240 segundos | 240 segundos |
| **Duração Real** | 262 segundos | 305 segundos |
| **Timeout por Requisição** | 15s | 15s |
| **Sleep entre Requisições** | 0.05 segundos | 0.05 segundos |

## Métricas de Performance Comparadas

| Métrica | Servidor B200 | Servidor H100 | Diferença (%) | Observação |
|---------|---------------|--------------|---------------|------------|
| **Requisições Completadas** | 27.097 | 12.315 | +120% para B200 | B200 processou mais que o dobro de requisições |
| **Taxa de Requisições** | 103,42 req/s | 40,38 req/s | +156% para B200 | B200 demonstrou maior throughput |
| **Tempo Médio de Resposta** | 9,19s | 9,92s | +7,9% para H100 | H100 foi ligeiramente mais lento |
| **Taxa de Falha** | 42,58% | 99,43% | +133% para H100 | H100 apresentou taxa de falha muito superior |
| **Tempo Máximo de Resposta** | 50.658ms (~51s) | 7.057.981ms (~117min) | +13.834% para H100 | H100 apresentou tempos extremos de processamento |

## Recursos de Hardware e Comportamento

### Servidor B200
- **Hardware**: Equipado com 8x NVIDIA B200 GPUs
- **Memória GPU Disponível**: ~182.643 MiB livre por GPU
- **Comportamento sob Carga**: Manteve-se operacional durante todo o teste
- **Tempo Máximo de Processamento**: ~51 segundos (50.658ms)

### Servidor H100
- **Hardware**: Equipado com 8x NVIDIA H100 80GB HBM3
- **Memória GPU Disponível**: ~80.617 MB livre por GPU
- **Comportamento sob Carga**: Apresentou degradação severa sob carga máxima
- **Tempo Máximo de Processamento**: ~117 minutos (7.057.981ms)

## Análise de Erros e Falhas

### Servidor B200
- Taxa de falha: 42,58% (11.268 falhas em 26.463 requisições)
- A maioria das falhas ocorreu provavelmente devido a timeouts (configurados para 15s)
- Apesar das falhas, o servidor conseguiu processar 27.097 memórias

### Servidor H100
- Taxa de falha: 99,43% (16.248 falhas em 16.341 requisições)
- Praticamente todas as requisições resultaram em falha segundo o k6
- Mesmo com alta taxa de falha, o servidor ainda processou 12.315 memórias
- Tempos de processamento extremamente altos (até 117 minutos) indicam severa degradação

## Gráficos de Desempenho

```
Taxa de Requisições (req/s)
─────────────────────────────────────────────
B200 │█████████████████████████████████████ 103,42
H100 │█████████████████ 40,38
─────────────────────────────────────────────

Taxa de Falha (%)
─────────────────────────────────────────────
B200 │██████████████████████ 42,58%
H100 │████████████████████████████████████████████████████ 99,43%
─────────────────────────────────────────────

Tempo Máximo de Resposta (log10 ms)
─────────────────────────────────────────────
B200 │███ 50.658 (~51s)
H100 │█████████████████████████ 7.057.981 (~117min)
─────────────────────────────────────────────
```

## Conclusões

1. **Desempenho Superior do B200**: Surpreendentemente, o servidor B200 (com 8 GPUs NVIDIA B200) superou significativamente o servidor H100 (com 8 GPUs NVIDIA H100) em quase todas as métricas de performance avaliadas.

2. **Throughput**: O B200 conseguiu processar mais que o dobro de requisições (27.097 vs 12.315) e com uma taxa de requisições 156% maior (103,42 req/s vs 40,38 req/s).

3. **Estabilidade**: O B200 apresentou uma taxa de falha muito menor (42,58% vs 99,43%), indicando maior estabilidade sob carga.

4. **Escalabilidade**: O B200 demonstrou melhor escalabilidade, conseguindo lidar com o aumento progressivo de usuários virtuais de forma mais eficiente.

5. **Tempos de Resposta**: O tempo máximo de resposta no H100 foi aproximadamente 139 vezes maior que no B200, indicando uma degradação de performance muito mais severa.

6. **Utilização de Recursos**: Ambos os servidores possuem 8 GPUs (B200 vs H100), mas o servidor H100 não conseguiu aproveitar seus recursos de hardware superior para melhorar a performance no processamento de memórias.

## Recomendações

1. **Investigação Aprofundada**: Conduzir uma investigação detalhada para entender por que o H100, apesar de seu hardware superior, apresentou desempenho significativamente inferior.

2. **Otimização do H100**: Revisar a configuração e implementação do servidor H100, especialmente em relação ao aproveitamento eficiente das GPUs disponíveis.

3. **Análise de Gargalos**: Investigar possíveis gargalos no H100, como processamento de I/O, conexões de banco de dados ou configurações de rede.

4. **Monitoramento de Recursos**: Implementar monitoramento detalhado de recursos (CPU, memória, uso de GPU, I/O de disco, rede) durante os testes para identificar com precisão os gargalos.

5. **Ajustes de Configuração**: Experimentar diferentes configurações para o H100, como ajustes de threads, conexões de banco de dados e parâmetros de runtime para melhorar seu desempenho.

6. **Considerações de Custo-Benefício**: Avaliar se o investimento em hardware de GPU avançado (H100) é justificável considerando a superioridade demonstrada pelo B200 em cargas de trabalho semelhantes.

## Observações Finais

A disparidade significativa de desempenho entre os servidores indica que provavelmente há problemas de implementação, configuração ou otimização no servidor H100 que estão impedindo o aproveitamento adequado dos recursos de hardware avançados. A análise sugere que, para o caso de uso atual de processamento de memórias, o servidor B200 representa uma opção mais eficiente e estável.