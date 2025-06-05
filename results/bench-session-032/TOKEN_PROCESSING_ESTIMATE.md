# Estimativa de Processamento de Tokens na sessão bench-session-032

## Metodologia de Estimativa

Para estimar o número de tokens processados pelos servidores B200 e H100 durante os testes da sessão bench-session-032, utilizei as seguintes informações e premissas:

1. **Dados do teste:**
   - Payload utilizado: Textos aleatórios similares aos da sessão bench-session-020
   - Número total de requisições enviadas e requisições bem-sucedidas (conforme relatório de saída do k6)

2. **Estimativa de tokens por texto:**
   - Utilizando a mesma base da sessão bench-session-020, com média de aproximadamente 32 tokens por requisição
   - Textos de exemplo utilizados, com contagem de tokens aproximada pelo método GPT (4 caracteres ≈ 1 token)
   - Estrutura JSON e metadados adicionais computados

3. **Cálculo:**
   - (Número de requisições processadas com sucesso) × (Média de tokens por requisição)

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

- **Requisições enviadas:** 344.844
- **Requisições bem-sucedidas:** 1.269 (0,37% de taxa de sucesso)
- **Estimativa de tokens por requisição:** 32
- **Total estimado de tokens processados:** 40.608 tokens

### Servidor H100

- **Requisições enviadas:** 312.567
- **Requisições bem-sucedidas:** 262 (0,09% de taxa de sucesso)
- **Estimativa de tokens por requisição:** 32
- **Total estimado de tokens processados:** 8.384 tokens

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
   - A taxa de tokens processados com sucesso foi extremamente baixa devido à alta taxa de falha das requisições:
     - B200: 99,63% de falha
     - H100: 99,91% de falha

## Taxa de Processamento de Tokens

### Servidor B200

- **Duração do teste:** 255 segundos
- **Total estimado de tokens processados:** 40.608 tokens
- **Taxa média de processamento:** 159,25 tokens/segundo

### Servidor H100

- **Duração do teste:** 254 segundos
- **Total estimado de tokens processados:** 8.384 tokens
- **Taxa média de processamento:** 33,01 tokens/segundo

## Comparação com a Sessão Anterior (bench-session-020)

### Servidor B200

- **Sessão 020:** 867.104 tokens processados (taxa de 3.310 tokens/s)
- **Sessão 032:** 40.608 tokens processados (taxa de 159,25 tokens/s)
- **Redução na capacidade de processamento:** 95,32%

### Servidor H100

- **Sessão 020:** 394.080 tokens processados (taxa de 1.292 tokens/s)
- **Sessão 032:** 8.384 tokens processados (taxa de 33,01 tokens/s)
- **Redução na capacidade de processamento:** 97,45%

## Conclusão

Com base na análise das requisições e respostas dos testes de stress da sessão bench-session-032, estimo que o servidor B200 processou aproximadamente **40.608 tokens** durante o teste, enquanto o servidor H100 processou aproximadamente **8.384 tokens**.

A diferença significativa em relação à sessão bench-session-020 demonstra que o aumento extremo na carga (de 2.000 para 25.000 VUs) causou uma degradação severa no desempenho de ambos os servidores, resultando em taxas de falha acima de 99%. No entanto, mesmo sob essas condições extremas, o servidor B200 continuou apresentando melhor desempenho que o H100, processando aproximadamente 4,8 vezes mais tokens.

É importante notar que esta é uma estimativa aproximada, pois o sistema Neural Memory não registra explicitamente a contagem de tokens. Para medições mais precisas, seria necessário implementar instrumentação específica no código.