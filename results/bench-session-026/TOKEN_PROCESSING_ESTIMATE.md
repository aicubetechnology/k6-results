# Estimativa de Processamento de Tokens na sessão bench-session-026

## Metodologia de Estimativa

Para estimar o número de tokens processados pelos servidores B200 e H100 durante os testes da sessão bench-session-026, utilizei as seguintes informações e premissas:

1. **Dados do teste:**
   - Payload utilizado: Textos aleatórios de uma lista predefinida no arquivo `utils-common.js`
   - Número total de memórias efetivamente armazenadas por cada servidor (conforme relatório de estatísticas do tenant)

2. **Estimativa de tokens por texto:**
   - Analisei os textos de exemplo utilizados nos testes
   - Utilizei a métrica aproximada de tokens do modelo GPT (aproximadamente 4 caracteres = 1 token)
   - Adicionei margem para metadados e estrutura JSON

3. **Cálculo:**
   - (Número de memórias processadas) × (Média de tokens por requisição)

## Textos de Teste Utilizados

Os testes utilizaram textos aleatórios desta lista:

```javascript
export const TEST_MEMORY_TEXTS = [
  'O céu é azul quando não há nuvens.',
  'A água ferve a 100 graus Celsius ao nível do mar.',
  'Paris é a capital da França e conhecida como a cidade luz.',
  'O sistema solar tem oito planetas principais orbitando o sol.',
  'A Torre Eiffel foi construída para a Exposição Universal de 1889.'
];
```

## Estimativa de Tokens por Requisição

### Análise de Tokens nos Textos

| Texto | Caracteres | Tokens (estimado) |
|-------|------------|-------------------|
| O céu é azul quando não há nuvens. | 37 | 9-10 |
| A água ferve a 100 graus Celsius ao nível do mar. | 56 | 14-15 |
| Paris é a capital da França e conhecida como a cidade luz. | 63 | 16-17 |
| O sistema solar tem oito planetas principais orbitando o sol. | 65 | 16-17 |
| A Torre Eiffel foi construída para a Exposição Universal de 1889. | 74 | 18-20 |

**Média de tokens por texto:** aproximadamente 15-16 tokens

### Tokens Adicionais

Cada requisição também inclui:
- Estrutura JSON para o payload (~5-7 tokens)
- Metadados (source, timestamp) (~5-7 tokens)
- Tenant ID e Agent ID (~4-6 tokens)

**Total de tokens adicionais por requisição:** aproximadamente 14-20 tokens

### Total por Requisição

**Estimativa total de tokens por requisição:** 29-36 tokens (utilizaremos uma média de 32 tokens)

## Estimativa de Tokens Processados por Servidor

### Servidor B200

- **Memórias armazenadas durante o teste:** 49.215
- **Estimativa de tokens por requisição:** 32
- **Total estimado de tokens processados:** 1.574.880 tokens

### Servidor H100

- **Memórias armazenadas durante o teste:** 90
- **Estimativa de tokens por requisição:** 32
- **Total estimado de tokens processados:** 2.880 tokens

## Observações Sobre o Processamento de Tokens

1. **Processamento de Embeddings:**
   - Cada texto é processado pelo modelo de embeddings (all-mpnet-base-v2)
   - O tokenizador específico do modelo pode ter uma contagem ligeiramente diferente da estimativa

2. **Fluxo de Processamento:**
   - Tokenização inicial pelo modelo de embeddings
   - Processamento pelo modelo neural para gerar o vetor de embedding
   - Cálculo de similaridade com memórias existentes (para score de surpresa)
   - Armazenamento no banco de dados

3. **Fator de Eficiência:**
   - A taxa de tokens processados com sucesso deve considerar a taxa de falha das requisições:
     - B200: 89.06% de falha no k6, mas 50.5% de processamento efetivo
     - H100: 99.92% de falha, com apenas 0.07% de processamento efetivo

4. **Impacto do Erro "Too Many Open Files" no H100:**
   - O erro no servidor H100 impediu o processamento da grande maioria das requisições
   - Isso resultou em um número extremamente baixo de tokens processados, apesar do alto volume de requisições enviadas

## Taxa de Processamento de Tokens

### Servidor B200

- **Duração do teste:** 260 segundos
- **Total estimado de tokens processados:** 1.574.880 tokens
- **Taxa média de processamento:** 6.057,2 tokens/segundo

### Servidor H100

- **Duração do teste:** 250 segundos (interrompido)
- **Total estimado de tokens processados:** 2.880 tokens
- **Taxa média de processamento:** 11,52 tokens/segundo

## Comparação com a Sessão Anterior (bench-session-020)

| Métrica | B200 (Sessão 020) | B200 (Sessão 026) | H100 (Sessão 020) | H100 (Sessão 026) |
|---------|-------------------|-------------------|-------------------|-------------------|
| **Tokens processados** | 867.104 | 1.574.880 | 394.080 | 2.880 |
| **Duração do teste** | 262s | 260s | 305s | 250s |
| **Taxa de processamento** | 3.310 tokens/s | 6.057,2 tokens/s | 1.292 tokens/s | 11,52 tokens/s |
| **Melhoria/Degradação** | Referência | +83% | Referência | -99,1% |

## Análise da Eficiência de Processamento de Tokens

### Servidor B200

O servidor B200 demonstrou uma **melhoria significativa de 83%** na taxa de processamento de tokens em comparação com a sessão anterior. Isto sugere:

1. **Otimizações possíveis implementadas:** O servidor pode ter recebido otimizações entre as sessões de teste
2. **Comportamento consistente:** Mesmo sob carga extrema (25.000 VUs vs. 2.000 VUs na sessão anterior), o servidor manteve alto throughput
3. **Escalabilidade:** O B200 demonstrou capacidade de escalar seu processamento proporcional à carga imposta
4. **Eficiência de recursos:** Mesmo sem detecção de GPUs, o servidor conseguiu processar tokens em alta taxa

### Servidor H100

O servidor H100 sofreu uma **degradação catastrófica de 99,1%** na taxa de processamento de tokens. Isto evidencia:

1. **Impacto do erro sistêmico:** O erro "Too many open files" praticamente paralisou o processamento de tokens
2. **Fragilidade sob carga extrema:** O servidor não foi capaz de manter suas capacidades de processamento
3. **Gargalo de sistema:** O limite de descritores de arquivo se tornou o principal limitador, independente da capacidade de processamento das GPUs
4. **Necessidade de ajustes:** Configurações de sistema operacional precisam ser ajustadas para permitir que o hardware realize seu potencial

## Conclusão

Com base na análise das requisições e respostas dos testes de stress da sessão bench-session-026, estimo que o servidor B200 processou aproximadamente **1.574.880 tokens** durante o teste, enquanto o servidor H100 processou apenas aproximadamente **2.880 tokens**.

A diferença extraordinária (547 vezes mais tokens no B200) demonstra claramente como limitações de sistema operacional podem anular completamente as vantagens de hardware superior. Enquanto o B200 melhorou significativamente sua performance em relação à sessão anterior, o H100 sofreu degradação quase total devido ao erro "Too many open files".

É importante destacar que o potencial teórico de processamento do H100 é provavelmente muito superior ao demonstrado neste teste, mas limitações na configuração do sistema impediram que esse potencial fosse realizado. As recomendações técnicas feitas no relatório SERVERS_COMPARISON.md são essenciais para permitir que o H100 demonstre sua verdadeira capacidade em testes futuros.