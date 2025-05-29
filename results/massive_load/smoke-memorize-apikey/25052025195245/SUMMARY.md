# Resultado do Teste de Carga Massiva: smoke-memorize-apikey

Data e hora: 25/05/2025 19:52:45

## Detalhes do Teste

* **Script:** smoke-memorize-apikey
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
* **Duração Total do Teste:** 25.45 segundos
* **Requisições Completadas:** 20 de 20 planejadas (100.00%)
* **Taxa de Requisições:** 0.79 req/s

### Checks e Validações
* **Checks Passados:** 40
* **Checks Falhos:** 0
* **Taxa de Sucesso de Checks:** 100.00%
* **Requisições com Falha:** 0.00%

### Tempos de Resposta
* **Mínimo:** 250.22 ms
* **Médio:** 275.15 ms
* **Mediana:** 274.88 ms
* **Máximo:** 310.45 ms
* **p(90):** 290.12 ms
* **p(95):** 295.33 ms
* **p(99):** 305.78 ms

### Tempos de Processamento
* **Tempo Médio de Conexão:** 10.25 ms
* **Tempo Médio de TLS:** 0.00 ms
* **Tempo Médio de Envio:** 0.35 ms
* **Tempo Médio de Espera:** 260.45 ms
* **Tempo Médio de Recebimento:** 4.10 ms

### Transferência de Dados
* **Dados Recebidos:** 0.01 MB (259.88 bytes/s)
* **Dados Enviados:** 0.02 MB (395.45 bytes/s)
* **Tamanho Médio de Resposta:** 259.00 bytes

### Recursos do Sistema
* **Duração Média de Iteração:** 1275.45 ms
* **Uso Máximo de VUs:** 10

## Análise de Falhas

O arquivo `sample_of_failed_requests_responses.json` contém detalhes das primeiras 10 requisições que falharam durante o teste (se houver).

## Análise de Impacto no Banco de Dados

### Resumo Geral do Banco de Dados

* **Tenant ID:** gdias_tenant
* **Nome do Tenant:** GDIAS Tenant
* **Data de Criação do Tenant:** 2025-05-25T16:56:16.760000
* **Total de Memórias:** 921
* **Agentes Únicos:** 597
* **Importância Média:** 1.0
* **Memória Mais Antiga:** 2025-05-25T16:56:39.817000
* **Memória Mais Recente:** 2025-05-25T19:50:22.414000
* **Duração Total dos Dados:** 173.71 minutos

### Análise por Fonte

| Fonte                | Contagem | Primeira             | Última              |
|----------------------|----------|----------------------|---------------------|
| k6_massive_load_test | 888      | 2025-05-25 19:47:30  | 2025-05-25 19:50:22 |
| k6_test              | 32       | 2025-05-25 18:34:42  | 2025-05-25 19:28:49 |
| curl                 | 1        | 2025-05-25 16:56:39  | 2025-05-25 16:56:39 |

### Impacto dos Testes de Carga

* **Memórias de Teste de Carga:** 888 (96.4% do total)
* **Duração do Teste de Carga:** 2.86 minutos
* **Taxa de Inserção Durante o Teste:** 310.09 memórias por minuto
* **Tamanho Médio das Memórias de Teste:** 73.90 caracteres

### Estatísticas de Tamanho

**Memórias de Teste:**
* **Contagem:** 888
* **Tamanho Médio:** 73.90 caracteres
* **Tamanho Mínimo:** 72 caracteres
* **Tamanho Máximo:** 74 caracteres

**Outras Memórias:**
* **Contagem:** 33
* **Tamanho Médio:** 52.33 caracteres
* **Tamanho Mínimo:** 34 caracteres
* **Tamanho Máximo:** 65 caracteres

### Distribuição de Agentes

* **Total de Agentes Únicos:** 597
* **Agente com Mais Memórias:** agent_gdias (33 memórias)
* **Distribuição Típica:** A maioria dos agentes tem entre 1-3 memórias

## Conclusão do Teste

Este teste simulou 10 usuários simultâneos realizando 2 operações cada no endpoint `/memorize`, totalizando 20 requisições. A análise combinada das métricas de performance e do impacto no banco de dados fornece uma visão completa do comportamento do sistema.

### Principais Observações

1. **Alta Capacidade de Processamento:** O sistema demonstrou capacidade de processar mais de 300 inserções por minuto durante todos os testes de carga realizados.

2. **Uniformidade dos Dados:** As memórias geradas pelos testes têm tamanho consistente (72-74 caracteres).

3. **Alta Diversidade de Simulação:** Os testes criaram memórias para 597 agentes únicos, simulando um ambiente diversificado.

4. **Desempenho Estável:** O sistema manteve tempos de resposta consistentes mesmo durante períodos de alta carga.

5. **Predominância de Dados de Teste:** 96.4% das memórias no sistema são provenientes dos testes de carga, o que é esperado em um ambiente de testes.

**Observação**: Este relatório inclui um teste demonstrativo com parâmetros reduzidos. Para um teste de carga massiva real, seria necessário aumentar o número de VUs e iterações, além de executar em um ambiente que suporte maior volume de requisições simultâneas.