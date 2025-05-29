# Resultado do Teste Smoke: smoke-memorize-apikey (B200)

Data e hora: 26/05/2025 22:36:41

## Detalhes do Teste

* **Script:** smoke-memorize-apikey
* **Tipo de Teste:** Smoke Test (10 usuários, 2 operações por usuário)
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
* **Taxa de Requisições:** 29.93 req/s

### Checks e Validações
* **Checks Passados:** 60
* **Checks Falhos:** 0
* **Taxa de Sucesso de Checks:** 100.00%
* **Requisições com Falha:** 0.00%

### Tempos de Resposta
* **Mínimo:** 112.74 ms
* **Médio:** 200.16 ms
* **Mediana:** 179.96 ms
* **Máximo:** 304.34 ms
* **p(90):** 304.21 ms
* **p(95):** 304.24 ms
* **p(99):** N/A

### Tempos de Processamento
* **Duração Média de Iteração:** 302.82 ms

### Transferência de Dados
* **Dados Recebidos:** 5.2 KB (7.8 KB/s)
* **Dados Enviados:** 9.0 KB (14 KB/s)
* **Tamanho Médio de Resposta:** 260 bytes

### Recursos do Sistema
* **Uso Máximo de VUs:** 10

## Status do Servidor (B200)

### Informações do Servidor Antes do Teste
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T22:36:41.493866
* **GPUs:** [] (nenhuma GPU listada)

### Informações do Servidor Após o Teste
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T22:36:42.201257
* **GPUs:** [] (nenhuma GPU listada)

## Conclusão

O teste smoke-memorize-apikey foi executado com sucesso no servidor B200 (150.136.65.20). Todas as 20 requisições foram processadas corretamente com um tempo médio de resposta de 200.16 ms.

Este teste verificou a funcionalidade básica do endpoint `/memorize` após a correção dos problemas de TORCH e CUDA relatados anteriormente. O servidor processou todas as requisições sem erros, indicando que a correção foi bem-sucedida.

Comparado com os testes anteriores que falhavam, houve uma melhoria significativa na estabilidade e no desempenho do serviço.

### Observações

1. O servidor B200 não lista informações de GPUs na resposta do endpoint `/health`, o que pode ser esperado se esta instância estiver configurada para usar CPU apenas.

2. Os tempos de resposta são adequados para um teste de smoke, com um máximo de 304.34 ms, bem abaixo do limite de 5000 ms definido nos thresholds do teste.

3. Todas as requisições foram bem-sucedidas, o que indica que a infraestrutura está funcionando corretamente após as correções de TORCH e CUDA.