# Resultado do Teste Smoke: smoke-retrieve-apikey (B200)

Data e hora: 26/05/2025 22:38:00

## Detalhes do Teste

* **Script:** smoke-retrieve-apikey
* **Tipo de Teste:** Smoke Test (5 usuários, 2 operações por usuário)
* **Total de Requisições Planejadas:** 10
* **Endpoint:** /retrieve
* **Método:** POST

## Configuração do Teste

* **Usuários Virtuais (VUs):** 5
* **Iterações por VU:** 2
* **Tempo Máximo de Execução:** 30 segundos
* **Timeout por Requisição:** 10 segundos
* **Sleep entre Requisições:** 0.5 segundos

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 1.2 segundos
* **Requisições Completadas:** 10 de 10 planejadas (100.00%)
* **Taxa de Requisições:** 8.55 req/s

### Checks e Validações
* **Checks Passados:** 0
* **Checks Falhos:** 10
* **Taxa de Sucesso de Checks:** 0.00%
* **Requisições com Falha:** 100.00%

### Tempos de Resposta
* **Mínimo:** 19.28 ms
* **Médio:** 75.28 ms
* **Mediana:** 73.37 ms
* **Máximo:** 96.33 ms
* **p(90):** 96.00 ms
* **p(95):** 96.17 ms
* **p(99):** N/A

### Transferência de Dados
* **Dados Recebidos:** 2.4 KB (2.0 KB/s)
* **Dados Enviados:** 3.8 KB (3.2 KB/s)
* **Tamanho Médio de Resposta:** 240 bytes

### Recursos do Sistema
* **Duração Média de Iteração:** 577.57 ms
* **Uso Máximo de VUs:** 5

## Análise de Falhas

Todas as requisições (100%) falharam durante o teste com código de status 500. O erro específico encontrado foi:

```
{"detail":"Erro ao recuperar memórias: 'VectorDB' object has no attribute 'retrieve_similar'"}
```

Este erro indica um problema de implementação no código do backend do servidor B200. O método `retrieve_similar` está ausente no objeto `VectorDB`, o que sugere uma incompatibilidade de API ou uma versão desatualizada do código.

## Status do Servidor (B200)

### Informações do Servidor Antes do Teste
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T22:38:00.178407
* **GPUs:** [] (nenhuma GPU listada)

### Informações do Servidor Após o Teste
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T22:38:01.724795
* **GPUs:** [] (nenhuma GPU listada)

## Conclusão

O teste smoke-retrieve-apikey falhou no servidor B200 (150.136.65.20). Embora o servidor esteja respondendo, há um erro interno relacionado à funcionalidade de recuperação de memórias.

Mesmo com as correções recentes nos problemas de TORCH e CUDA, o endpoint `/retrieve` ainda apresenta falhas, apesar do endpoint `/memorize` funcionar corretamente (conforme teste anterior). Isso sugere que o problema está especificamente na implementação da funcionalidade de recuperação de memórias.

### Próximos Passos Recomendados

1. **Investigar o código da classe VectorDB**: É necessário verificar a implementação da classe VectorDB no código-fonte para garantir que o método `retrieve_similar` esteja corretamente implementado.

2. **Verificar a versão do código**: Confirmar se a versão do código no servidor B200 está atualizada e sincronizada com a versão esperada.

3. **Atualizar a implementação**: Corrigir a implementação da classe VectorDB para incluir o método `retrieve_similar` ou ajustar o código que chama este método.

4. **Reexecutar o teste**: Após as correções, executar novamente o teste para verificar se o problema foi resolvido.

A falha atual é específica da funcionalidade de recuperação e não está relacionada à infraestrutura geral, pois o servidor continua saudável e o endpoint de `/memorize` funciona corretamente.