# Resultado do Teste de Carga Massiva: smoke-memorize-apikey-compare (B200)

Data e hora: 26/05/2025 22:54:32

## Detalhes do Teste

* **Script:** smoke-memorize-apikey-compare
* **Tipo de Teste:** Carga Massiva (10 usuários, 2 operações por usuário)
* **Total de Requisições Planejadas:** 20
* **Endpoint:** /memorize
* **Método:** POST

## Configuração do Teste

* **Usuários Virtuais (VUs):** 10
* **Iterações por VU:** 2
* **Tempo Máximo de Execução:** 30 segundos
* **Timeout por Requisição:** 10 segundos
* **Sleep entre Requisições:** 0.1 segundos

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 0.22 segundos
* **Requisições Completadas:** 20 de 20 planejadas (100.00%)
* **Taxa de Requisições:** 89.12 req/s

### Checks e Validações
* **Checks Passados:** 0
* **Checks Falhos:** 20
* **Taxa de Sucesso de Checks:** 0.00%
* **Requisições com Falha:** 100.00%

### Tempos de Resposta
* **Mínimo:** 2.72 ms
* **Médio:** 9.34 ms
* **Mediana:** 8.79 ms
* **Máximo:** 11.86 ms
* **p(90):** 11.75 ms
* **p(95):** 11.82 ms

### Transferência de Dados
* **Dados Recebidos:** 3.8 KB (17 KB/s)
* **Dados Enviados:** 9.0 KB (40 KB/s)

### Recursos do Sistema
* **Duração Média de Iteração:** 111.15 ms
* **Uso Máximo de VUs:** 10

## Análise de Falhas

Todas as requisições (100%) falharam durante o teste com código de status 429. O principal motivo das falhas foi a quota diária de requisições excedida:

```
{"detail":"Quota diária de requisições excedida"}
```

Este erro ocorreu porque o limite de quota para o tenant de teste já havia sido atingido no teste de stress anterior.

## Status do Servidor (B200)

### Informações do Servidor
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T22:54:32.403389
* **GPUs:** [] (nenhuma GPU listada)

## Conclusão

Este teste tentou simular 10 usuários simultâneos realizando 2 operações cada no endpoint `/memorize`, totalizando 20 requisições. No entanto, devido ao limite de quota diária já atingido no teste anterior, todas as requisições falharam com erro 429.

Apesar das falhas, o servidor respondeu muito rapidamente (tempo médio de 9.34 ms), indicando que, quando não limitado pela quota, o endpoint de memorização no B200 tem potencial para bom desempenho.

### Observações e Recomendações

1. **Limitação de Quota**: O limite de quota diária impede a realização de múltiplos testes sequenciais. Para uma avaliação completa, seria necessário aumentar este limite ou criar um novo tenant para cada conjunto de testes.

2. **Tempos de Resposta**: Apesar das falhas, os tempos de resposta foram extremamente baixos, sugerindo que o servidor B200 processa requisições rapidamente, mesmo quando rejeitando-as por quota.

3. **Comparação com H100**: Este teste foi executado com os mesmos parâmetros do teste no servidor H100, mas os resultados não são diretamente comparáveis devido às falhas por quota.

4. **Próximos Passos**: Resolver a limitação de quota e executar novamente o teste para avaliar o verdadeiro desempenho do endpoint de memorização no B200.