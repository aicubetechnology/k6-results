# Resultado do Teste de Stress: stress-get-tenant-stats-apikey (B200)

Data e hora: 26/05/2025 22:52:46

## Detalhes do Teste

* **Script:** stress-get-tenant-stats-apikey
* **Tipo de Teste:** Teste de Stress (até 500 VUs)
* **Total de Requisições:** 112.638
* **Endpoint:** /admin/tenant/qube_test_tenant_1748298966/stats
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
* **Requisições Completadas:** 112.638
* **Taxa de Requisições:** 1.125,36 req/s

### Checks e Validações
* **Checks Passados:** 3.760
* **Checks Falhos:** 111.698
* **Taxa de Sucesso de Checks:** 3,25%
* **Requisições com Falha:** 99,16%

### Tempos de Resposta
* **Mínimo:** 1,90 ms
* **Médio:** 185,88 ms
* **Mediana:** 183,65 ms
* **Máximo:** 581,64 ms
* **p(90):** 354,56 ms
* **p(95):** 366,67 ms

### Tempos de Processamento (apenas respostas bem-sucedidas)
* **Mínimo:** 66,55 ms
* **Médio:** 222,23 ms
* **Mediana:** 208,23 ms
* **Máximo:** 560,19 ms
* **p(90):** 270,28 ms
* **p(95):** 421,73 ms

### Recursos do Sistema
* **Duração Média de Iteração:** 286,58 ms
* **Uso Máximo de VUs:** 500

## Análise de Falhas

A maioria das requisições (99,16%) falhou durante o teste. O principal motivo das falhas foi a quota diária de requisições excedida:

```
{"detail":"Quota diária de requisições excedida"}
```

Este erro ocorreu após aproximadamente 940 requisições bem-sucedidas, indicando que o limite de quota para o tenant de teste foi atingido.

## Status do Servidor (B200)

### Informações do Servidor
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T22:52:46.403389
* **GPUs:** [] (nenhuma GPU listada)

## Conclusão do Teste

Este teste de stress simulou até 500 usuários virtuais fazendo consultas simultâneas ao endpoint `/admin/tenant/qube_test_tenant_1748298966/stats` no servidor B200.

O teste revelou que o servidor B200 implementa um limite estrito de quota diária de requisições (aproximadamente 1000 requisições). Após atingir este limite, todas as requisições subsequentes falharam com código 429.

Para as requisições bem-sucedidas, o servidor demonstrou um bom desempenho, com tempo médio de resposta de 222,23 ms.

### Observações e Recomendações

1. **Limitação de Quota**: O limite de quota diária impede a realização de testes de stress completos. Recomenda-se aumentar temporariamente este limite para testes ou criar um tenant específico para testes sem limites.

2. **Tempos de Resposta**: Para as requisições bem-sucedidas, o tempo de resposta foi aceitável, indicando que o servidor B200 tem capacidade de processar requisições com eficiência.

3. **Comparação com H100**: Este teste foi executado com os mesmos parâmetros do teste no servidor H100, permitindo uma comparação direta de desempenho.

4. **Próximos Passos**: Resolver a limitação de quota para permitir testes mais completos e determinar os verdadeiros limites de capacidade do servidor B200.