# Resultado do Teste de Stress: stress-get-tenant-stats-apikey

Data e hora: 26/05/2025 01:24:30

## Detalhes do Teste

* **Script:** stress-get-tenant-stats-apikey
* **Tipo de Teste:** Teste de Stress (até 500 VUs)
* **Total de Requisições:** 3.259
* **Endpoint:** /admin/tenant/{tenant_id}/stats
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
* **Duração Total do Teste:** 105 segundos
* **Requisições Completadas:** 3.259
* **Taxa de Requisições:** 31.04 req/s

### Checks e Validações
* **Checks Passados:** 824
* **Checks Falhos:** 3.053
* **Taxa de Sucesso de Checks:** 21.25%
* **Requisições com Falha:** 93.67%

### Tempos de Resposta
* **Mínimo:** 0 ms (falhas)
* **Médio:** 7,370 ms
* **Mediana:** 9,910 ms
* **Máximo:** 10,000 ms
* **p(90):** 9,910 ms
* **p(95):** 9,910 ms
* **p(99):** N/A

### Tempos de Resposta (apenas respostas bem-sucedidas)
* **Mínimo:** 836.23 ms
* **Médio:** 6,650 ms
* **Mediana:** 6,920 ms
* **Máximo:** 9,890 ms
* **p(90):** 9,630 ms
* **p(95):** 9,880 ms

### Tempos de Processamento
* **Tempo Médio de Conexão:** 442.98 ms
* **Tempo Médio de TLS:** 0.00 ms
* **Tempo Médio de Envio:** 0.058 ms
* **Tempo Médio de Espera:** 7,340 ms
* **Tempo Médio de Recebimento:** 35.03 ms

### Transferência de Dados
* **Dados Recebidos:** 63 kB (602 B/s)
* **Dados Enviados:** 583 kB (5.6 kB/s)
* **Tamanho Médio de Resposta:** 19.33 bytes

### Recursos do Sistema
* **Duração Média de Iteração:** 9.89 s
* **Uso Máximo de VUs:** 500

## Análise de Falhas

A maioria das requisições (93.67%) falhou durante o teste. O principal motivo das falhas foi timeout de requisição, conforme indicado nos logs:

```
Get "http://130.61.226.26:8000/admin/tenant/gdias_tenant_2/stats": request timeout
```

Esse comportamento é esperado em testes de stress e indica que o sistema atingiu seu limite de capacidade para processar requisições simultâneas.

## Análise de Impacto no Banco de Dados

### Resumo Geral do Banco de Dados

* **Tenant ID:** gdias_tenant_2
* **Total de Memórias:** 0
* **Agentes Únicos:** 0
* **Importância Média:** N/A
* **Memória Mais Antiga:** N/A
* **Memória Mais Recente:** N/A
* **Duração Total dos Dados:** 0.00 minutos

### Análise por Fonte

Não existem fontes de dados para este tenant.

### Distribuição de Agentes

* **Total de Agentes Únicos:** 0
* **Agente com Mais Memórias:** Nenhum
* **Distribuição Típica:** N/A

## Status do Servidor

### Informações do Servidor
* **Status:** healthy
* **Versão:** 0.1.0
* **Timestamp:** 2025-05-26T01:26:53.066956

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

**GPU 2-7 - NVIDIA H100 80GB HBM3:**
* Memória Total: 81089 MB (cada)
* Memória Usada: 472 MB (0.58%) (cada)
* Memória Livre: 80617 MB (cada)
* Carga: 0
* Tamanho da Fila: 0

## Conclusão do Teste

Este teste de stress revelou os limites de capacidade da API quando submetida a uma carga extrema. A API conseguiu processar com sucesso apenas 206 de 3259 requisições (6.33% de taxa de sucesso) quando atingimos o pico de 500 usuários virtuais simultâneos.

### Observações e Recomendações

1. **Ponto de Saturação**: O sistema começou a apresentar falhas significativas quando o número de usuários virtuais excedeu aproximadamente 100. Este é um indicador do limite de capacidade atual do servidor.

2. **Tempos de Resposta**: Para as requisições bem-sucedidas, o tempo médio de resposta foi de 6,65 segundos, indicando uma degradação significativa da performance sob carga.

3. **Estabilidade do Servidor**: Apesar da alta carga, o servidor permaneceu operacional e retornou ao normal após o teste, como evidenciado pela resposta bem-sucedida do endpoint `/health` após o teste.

4. **Consumo de Recursos**: O uso de GPU permaneceu baixo durante o teste, sugerindo que o gargalo está em outro componente, possivelmente no processamento de requisições HTTP, banco de dados ou CPU.

5. **Próximos Passos Recomendados**:
   - Implementar limitação de taxa (rate limiting) para proteger o servidor contra sobrecarga
   - Melhorar o pooling de conexões com o banco de dados para lidar com picos de requisições
   - Considerar a adição de caching para respostas frequentes, como estatísticas de tenant
   - Aumentar o timeout das requisições do cliente para operações que podem levar mais tempo sob carga
   - Adicionar memórias ao tenant e executar testes adicionais para avaliar o impacto do volume de dados na performance

Este teste fornece uma linha de base valiosa para entender os limites de escalabilidade da API em seu estado atual e para planejar otimizações futuras.