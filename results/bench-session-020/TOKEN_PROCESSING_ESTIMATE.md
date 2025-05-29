# Estimativa de Processamento de Tokens na sessão bench-session-020

## Metodologia de Estimativa

Para estimar o número de tokens processados pelos servidores B200 e H100 durante os testes da sessão bench-session-020, utilizei as seguintes informações e premissas:

1. **Dados do teste:**
   - Payload utilizado: Textos aleatórios de uma lista predefinida no arquivo `utils-common.js`
   - Número total de memórias armazenadas por cada servidor (conforme relatório de estatísticas do tenant)

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

- **Memórias armazenadas durante o teste:** 27.097
- **Estimativa de tokens por requisição:** 32
- **Total estimado de tokens processados:** 867.104 tokens

### Servidor H100

- **Memórias armazenadas durante o teste:** 12.315
- **Estimativa de tokens por requisição:** 32
- **Total estimado de tokens processados:** 394.080 tokens

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
     - B200: 42.58% de falha
     - H100: 99.43% de falha

## Taxa de Processamento de Tokens

### Servidor B200

- **Duração do teste:** 262 segundos
- **Total estimado de tokens processados:** 867.104 tokens
- **Taxa média de processamento:** 3.310 tokens/segundo

### Servidor H100

- **Duração do teste:** 305 segundos
- **Total estimado de tokens processados:** 394.080 tokens
- **Taxa média de processamento:** 1.292 tokens/segundo

## Conclusão

Com base na análise das requisições e respostas dos testes de stress da sessão bench-session-020, estimo que o servidor B200 processou aproximadamente **867.104 tokens** durante o teste, enquanto o servidor H100 processou aproximadamente **394.080 tokens**.

Essa estimativa considera o processamento completo de cada requisição, incluindo a tokenização do texto, geração de embeddings e operações associadas. A diferença significativa no número de tokens processados reflete o melhor desempenho do servidor B200 em termos de taxa de requisições e taxa de falha.

É importante notar que esta é uma estimativa aproximada, pois o sistema Neural Memory não registra explicitamente a contagem de tokens. Para medições mais precisas, seria necessário implementar instrumentação específica no código conforme sugerido na análise anterior.