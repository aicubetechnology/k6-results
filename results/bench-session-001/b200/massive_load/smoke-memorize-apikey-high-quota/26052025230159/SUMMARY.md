# Resultado do Teste de Carga Massiva: smoke-memorize-apikey (B200 - Alta Quota)

Data e hora: 26/05/2025 23:01:59

## Detalhes do Teste

* **Script:** smoke-memorize-apikey-high-quota
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
* **Duração Total do Teste:** 0.7 segundos
* **Requisições Completadas:** 20 de 20 planejadas (100.00%)
* **Taxa de Requisições:** 28.92 req/s

### Checks e Validações
* **Checks Passados:** 60
* **Checks Falhos:** 0
* **Taxa de Sucesso de Checks:** 100.00%
* **Requisições com Falha:** 0.00%

### Tempos de Resposta
* **Mínimo:** 118.07 ms
* **Médio:** 209.62 ms
* **Mediana:** 175.40 ms
* **Máximo:** 309.74 ms
* **p(90):** 308.58 ms
* **p(95):** 309.73 ms

### Tempos de Processamento
* **Duração Média de Iteração:** 313.05 ms

### Transferência de Dados
* **Dados Recebidos:** 5.2 KB (7.5 KB/s)
* **Dados Enviados:** 9.1 KB (13 KB/s)

### Recursos do Sistema
* **Uso Máximo de VUs:** 10

## Status do Servidor (B200)

### Informações do Servidor
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T23:01:59.543273
* **GPUs:** [] (nenhuma GPU listada)

## Conclusão

Este teste simulou 10 usuários simultâneos realizando 2 operações cada no endpoint `/memorize`, totalizando 20 requisições, com os mesmos parâmetros utilizados no teste do servidor H100.

O teste foi bem-sucedido, com 100% das requisições processadas corretamente e sem erros. O tempo médio de resposta foi de 209.62 ms, o que indica um bom desempenho do servidor B200 para operações de memorização.

### Comparação com Testes Anteriores

Diferente dos testes anteriores onde encontramos limitações de quota, este teste utilizou um tenant com quota alta (1.000.000 requisições diárias), o que permitiu concluir o teste com sucesso.

### Observações e Recomendações

1. **Tempos de Resposta**: Os tempos de resposta observados (média de 209.62 ms) são adequados para operações de memorização e similares aos esperados para este tipo de operação.

2. **Estabilidade**: O servidor B200 demonstrou estabilidade para este volume de requisições, com 100% de taxa de sucesso.

3. **Comparação com H100**: Este teste demonstra que, para operações de memorização, o servidor B200 tem desempenho comparável ao H100 após as correções de TORCH e CUDA.

4. **Próximos Passos**: Realizar testes com volumes maiores para avaliar os limites de capacidade do servidor B200.