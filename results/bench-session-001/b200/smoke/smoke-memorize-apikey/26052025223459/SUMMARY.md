# Resultado do Teste Smoke: smoke-memorize-apikey (B200)

Data e hora: 26/05/2025 22:34:59

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
* **Duração Total do Teste:** 0.22 segundos
* **Requisições Completadas:** 20 de 20 planejadas (100.00%)
* **Taxa de Requisições:** 89.93 req/s

### Checks e Validações
* **Checks Passados:** 0
* **Checks Falhos:** 20
* **Taxa de Sucesso de Checks:** 0.00%
* **Requisições com Falha:** 100.00%

### Tempos de Resposta
* **Mínimo:** 2.40 ms
* **Médio:** 8.52 ms
* **Mediana:** 8.89 ms
* **Máximo:** 10.20 ms
* **p(90):** 10.09 ms
* **p(95):** 10.16 ms
* **p(99):** N/A

### Tempos de Processamento
* **Tempo Médio de Conexão:** N/A
* **Tempo Médio de TLS:** N/A
* **Tempo Médio de Envio:** N/A
* **Tempo Médio de Espera:** N/A
* **Tempo Médio de Recebimento:** N/A

### Transferência de Dados
* **Dados Recebidos:** 3.30 KB (15 KB/s)
* **Dados Enviados:** 8.70 KB (39 KB/s)
* **Tamanho Médio de Resposta:** 165.00 bytes

### Recursos do Sistema
* **Duração Média de Iteração:** 110.28 ms
* **Uso Máximo de VUs:** 10

## Análise de Falhas

Todas as requisições (100%) falharam durante o teste com código de status 401. O principal motivo das falhas foi uma API key inválida:

```
{"detail":"API key inválida"}
```

Este resultado indica que a chave de API `qube_02eee6c231d44324950be28823f9c26e` não é válida para o servidor B200 (150.136.65.20:8000). É necessário obter uma chave de API válida para este servidor específico.

## Status do Servidor (B200)

### Informações do Servidor Antes do Teste
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T22:34:59.072048
* **GPUs:** [] (nenhuma GPU listada)

### Informações do Servidor Após o Teste
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T22:34:59.611489
* **GPUs:** [] (nenhuma GPU listada)

## Conclusão

Este teste simulou 10 usuários simultâneos realizando 2 operações cada no endpoint `/memorize`, totalizando 20 requisições. Todas as requisições falharam devido a uma chave de API inválida.

O servidor B200 está saudável e respondendo rapidamente (tempo médio de resposta de 8.52 ms), mas requer uma chave de API específica para autorizar as solicitações.

### Próximos Passos Recomendados

1. **Obter uma API Key válida**: É necessário obter uma chave de API válida específica para o servidor B200.
2. **Atualizar o script de teste**: Modificar o script para usar a chave de API correta.
3. **Reexecutar o teste**: Após obter a chave de API correta, executar novamente o teste para verificar o funcionamento adequado.

A correção recente nos problemas de TORCH e CUDA não pôde ser verificada devido à falha de autenticação, mas o servidor está respondendo normalmente, o que sugere que a infraestrutura básica está funcionando.