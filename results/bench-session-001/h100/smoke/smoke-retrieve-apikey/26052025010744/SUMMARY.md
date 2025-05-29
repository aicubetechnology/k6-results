# Resultado do Teste de Fumaça: smoke-retrieve-apikey

Data e hora: 26/05/2025 01:07:44

## Detalhes do Teste

* **Script:** smoke-retrieve-apikey
* **Tipo de Teste:** smoke (fumaça)
* **Total de Requisições:** 10
* **Endpoint:** /retrieve
* **Método:** POST

## Configuração do Teste

* **Usuários Virtuais (VUs):** 1
* **Duração:** 10s
* **Timeout por Requisição:** Padrão
* **Sleep entre Requisições:** 1s

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 11.1 segundos
* **Requisições Completadas:** 10
* **Taxa de Requisições:** 0.90 req/s

### Checks e Validações
* **Checks Passados:** 0
* **Checks Falhos:** 10
* **Taxa de Sucesso de Checks:** 0.00%
* **Requisições com Falha:** 100.00%

### Tempos de Resposta
* **Mínimo:** 97.66 ms
* **Médio:** 98.06 ms
* **Mediana:** 97.72 ms
* **Máximo:** 100.97 ms
* **p(90):** 98.27 ms
* **p(95):** 99.62 ms

### Tempos de Processamento
* **Tempo Médio de Conexão:** 8.97 ms
* **Tempo Médio de TLS:** 0.00 ms
* **Tempo Médio de Envio:** 0.049 ms
* **Tempo Médio de Espera:** 97.93 ms
* **Tempo Médio de Recebimento:** 0.082 ms

### Transferência de Dados
* **Dados Recebidos:** 2.4 kB (216 B/s)
* **Dados Enviados:** 3.2 kB (292 B/s)
* **Tamanho Médio de Resposta:** 240 bytes

### Recursos do Sistema
* **Duração Média de Iteração:** 1.1s
* **Uso Máximo de VUs:** 1

## Análise de Falhas

Todas as requisições falharam durante o teste. A resposta do servidor indica um erro na implementação do método de recuperação:

```json
{
  "detail": "Erro ao recuperar memórias: 'VectorDB' object has no attribute 'retrieve_similar'"
}
```

Este erro sugere um problema de implementação no lado do servidor com o componente VectorDB, que não está implementando o método necessário para a recuperação de memórias.

## Análise de Impacto no Banco de Dados

### Resumo Geral do Banco de Dados

* **Tenant ID:** gdias_tenant_2
* **Total de Memórias:** A consulta não pôde ser concluída devido a um problema no acesso ao banco de dados ou o tenant ainda não possui memórias.

## Status do Servidor

### Informações do Servidor
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T01:07:44.533295

### Status das GPUs

**GPU 0 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 1664 MB (2.05%)
* Memória Livre: 79425 MB
* Carga: 0
* Tamanho da Fila: 0

**GPU 1 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 472 MB (0.58%)
* Memória Livre: 80617 MB
* Carga: 0
* Tamanho da Fila: 0

**GPU 2 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 472 MB (0.58%)
* Memória Livre: 80617 MB
* Carga: 0
* Tamanho da Fila: 0

**GPU 3 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 472 MB (0.58%)
* Memória Livre: 80617 MB
* Carga: 0
* Tamanho da Fila: 0

**GPU 4 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 472 MB (0.58%)
* Memória Livre: 80617 MB
* Carga: 0
* Tamanho da Fila: 0

**GPU 5 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 472 MB (0.58%)
* Memória Livre: 80617 MB
* Carga: 0
* Tamanho da Fila: 0

**GPU 6 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 472 MB (0.58%)
* Memória Livre: 80617 MB
* Carga: 0
* Tamanho da Fila: 0

**GPU 7 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB
* Memória Usada: 472 MB (0.58%)
* Memória Livre: 80617 MB
* Carga: 0
* Tamanho da Fila: 0

## Conclusão do Teste

Este teste de fumaça revelou um problema crítico no endpoint `/retrieve`. Todas as requisições falharam com o erro "'VectorDB' object has no attribute 'retrieve_similar'", o que indica uma falha na implementação da funcionalidade de recuperação de memórias.

### Recomendações

1. **Verificar a Implementação do VectorDB**: A classe VectorDB parece estar faltando o método `retrieve_similar`, que é essencial para o funcionamento do endpoint de recuperação.

2. **Checar o Tenant**: É possível que o tenant 'gdias_tenant_2' ainda não tenha sido criado ou configurado corretamente no banco de dados.

3. **Verificar as Memórias**: Antes de testar a recuperação, é necessário garantir que existam memórias no banco para o tenant e agente especificados.

4. **Rastreamento do Erro**: Analisar os logs do servidor para obter mais detalhes sobre o erro de implementação.

Este teste foi interrompido devido a falhas em todas as requisições. É recomendado corrigir o problema de implementação do VectorDB antes de prosseguir com testes adicionais do endpoint `/retrieve`.