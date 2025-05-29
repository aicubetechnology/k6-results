# Resultado do Teste Smoke: smoke-get-tenant-stats-apikey (B200)

Data e hora: 26/05/2025 22:46:08

## Detalhes do Teste

* **Script:** smoke-get-tenant-stats-apikey
* **Tipo de Teste:** Smoke Test (5 usuários, 2 operações por usuário)
* **Total de Requisições Planejadas:** 10
* **Endpoint:** /admin/tenant/qube_test_tenant_1748298966/stats
* **Método:** GET

## Configuração do Teste

* **Usuários Virtuais (VUs):** 5
* **Iterações por VU:** 2
* **Tempo Máximo de Execução:** 30 segundos
* **Timeout por Requisição:** 10 segundos
* **Sleep entre Requisições:** 0.5 segundos

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 1.1 segundos
* **Requisições Completadas:** 10 de 10 planejadas (100.00%)
* **Taxa de Requisições:** 9.29 req/s

### Checks e Validações
* **Checks Passados:** 40
* **Checks Falhos:** 0
* **Taxa de Sucesso de Checks:** 100.00%
* **Requisições com Falha:** 0.00%

### Tempos de Resposta
* **Mínimo:** 9.38 ms
* **Médio:** 31.93 ms
* **Mediana:** 27.02 ms
* **Máximo:** 45.23 ms
* **p(90):** 45.18 ms
* **p(95):** 45.21 ms
* **p(99):** N/A

### Transferência de Dados
* **Dados Recebidos:** 7.3 KB (6.8 KB/s)
* **Dados Enviados:** 2.1 KB (2.0 KB/s)
* **Tamanho Médio de Resposta:** 730 bytes

### Recursos do Sistema
* **Duração Média de Iteração:** 533.95 ms
* **Uso Máximo de VUs:** 5

## Análise dos Resultados

O teste do endpoint de estatísticas de tenant foi bem-sucedido. Todas as 10 requisições foram processadas corretamente com tempos de resposta excelentes (média de 31.93 ms).

As estatísticas mostraram que o tenant `qube_test_tenant_1748298966` tem 20 memórias armazenadas, o que corresponde ao número de memórias criadas durante o teste anterior de `smoke-memorize-apikey`.

## Status do Servidor (B200)

### Informações do Servidor Antes do Teste
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T22:46:08.403389
* **GPUs:** [] (nenhuma GPU listada)

### Informações do Servidor Após o Teste
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T22:46:09.543273
* **GPUs:** [] (nenhuma GPU listada)

## Conclusão

O teste smoke-get-tenant-stats-apikey foi executado com sucesso no servidor B200 (150.136.65.20). Todas as 10 requisições foram processadas corretamente, com tempos de resposta extremamente baixos, indicando um excelente desempenho para esta funcionalidade.

Este resultado, combinado com o sucesso do teste anterior de memorização, indica que as correções de TORCH e CUDA foram eficazes para as funcionalidades de armazenamento e consulta de estatísticas. No entanto, ainda persiste o problema no endpoint de recuperação (/retrieve).

### Observações

1. Os tempos de resposta para este endpoint são notavelmente mais rápidos que os do endpoint de memorização (média de 31.93 ms vs. 200.16 ms), o que é esperado, já que a operação de estatísticas é menos intensiva em computação.

2. O servidor B200 está armazenando e gerenciando memórias corretamente, com 20 memórias armazenadas para o tenant de teste.

3. A API key e o tenant ID estão funcionando corretamente para as operações de memorização e estatísticas.

4. Este teste confirma que a infraestrutura básica do servidor está funcionando bem, com o problema de recuperação provavelmente limitado à implementação específica do método `retrieve_similar` no componente VectorDB.