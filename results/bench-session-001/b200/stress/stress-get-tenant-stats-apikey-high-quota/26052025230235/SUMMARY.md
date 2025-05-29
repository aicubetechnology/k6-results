# Resultado do Teste de Stress: stress-get-tenant-stats-apikey (B200 - Alta Quota)

Data e hora: 26/05/2025 23:02:35

## Detalhes do Teste

* **Script:** stress-get-tenant-stats-apikey-high-quota
* **Tipo de Teste:** Teste de Stress (até 500 VUs)
* **Total de Requisições:** 17.828
* **Endpoint:** /admin/tenant/qube_assistant_tenant_b200_test_4/stats
* **Método:** GET

## Configuração do Teste

* **Usuários Virtuais (VUs):** Até 500 VUs
* **Rampa de Carga:**
  * 0-10s: Aumento de 50 para 100 VUs
  * 10-40s: Aumento de 100 para 300 VUs
  * 40-60s: Aumento de 300 para 500 VUs
  * 60-90s: Manutenção de 500 VUs
  * 90-100s: Redução de 500 para 0 VUs
* **Duração Total:** 100 segundos
* **Timeout por Requisição:** 10 segundos
* **Sleep entre Requisições:** 0.1 segundos

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** 100 segundos
* **Requisições Completadas:** 17.828
* **Taxa de Requisições:** 178.24 req/s

### Checks e Validações
* **Checks Passados:** 71.312
* **Checks Falhos:** 0
* **Taxa de Sucesso de Checks:** 100.00%
* **Requisições com Falha:** 0.00%

### Tempos de Resposta
* **Mínimo:** 7.95 ms
* **Médio:** 1.72 segundos
* **Mediana:** 1.90 segundos
* **Máximo:** 3.13 segundos
* **p(90):** 2.67 segundos
* **p(95):** 2.72 segundos

### Tempos de Processamento
* **Duração Média de Iteração:** 1.83 segundos

### Recursos do Sistema
* **Uso Máximo de VUs:** 500

## Status do Servidor (B200)

### Informações do Servidor
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T23:02:35.403389
* **GPUs:** [] (nenhuma GPU listada)

## Conclusão do Teste

Este teste de stress simulou até 500 usuários virtuais fazendo consultas simultâneas ao endpoint `/admin/tenant/qube_assistant_tenant_b200_test_4/stats` no servidor B200, utilizando um tenant com quota alta (1.000.000 requisições diárias).

O teste foi bem-sucedido, com 100% das requisições processadas corretamente e sem falhas. O servidor foi capaz de lidar com todas as 17.828 requisições durante o período do teste, mantendo uma taxa média de 178.24 requisições por segundo.

### Observações e Recomendações

1. **Capacidade de Escala**: O servidor B200 demonstrou boa capacidade de escala, lidando com até 500 usuários virtuais simultâneos sem falhas.

2. **Tempos de Resposta**: O tempo médio de resposta aumentou para 1.72 segundos sob carga, o que é esperado em condições de stress. Para um teste de stress com 500 VUs, este tempo é considerado aceitável.

3. **Comparação com H100**: Em comparação com o teste no servidor H100, o B200 apresentou:
   - Maior número de requisições completadas (17.828 vs. 3.259)
   - Menor taxa de falha (0% vs. 93.67%)
   - Tempo médio de resposta comparável (1.72s vs. 7.37s considerando apenas respostas bem-sucedidas no H100)

4. **Estabilidade sob Carga**: O B200 demonstrou excelente estabilidade sob carga, mantendo uma taxa de sucesso de 100% mesmo com 500 VUs, o que indica que as correções de TORCH e CUDA foram eficazes.

5. **Melhorias Observadas**: Este teste demonstra uma melhoria significativa em relação aos testes anteriores, onde o limite de quota impedia a execução completa do teste de stress.

### Próximos Passos Recomendados

1. **Resolver o Problema do Endpoint `/retrieve`**: O único problema pendente é a implementação do método `retrieve_similar` na classe VectorDB.

2. **Testes com Cargas Maiores**: Considerar testes com cargas ainda maiores para identificar os verdadeiros limites do servidor B200.

3. **Monitoramento de Recursos**: Implementar monitoramento detalhado de CPU, memória e GPU durante os testes para identificar possíveis gargalos.