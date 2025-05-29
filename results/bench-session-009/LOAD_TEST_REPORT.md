# Relatório de Testes de Carga - Sessão 009

Data: 27/05/2025

## Resumo dos Testes de Carga

Nesta sessão, foram realizados testes de carga para os três endpoints funcionais do qube_neural_memory:
- `/memorize`
- `/admin/forget`
- `/admin/tenant/{tenant_id}/stats`

Cada teste foi executado com a seguinte configuração de carga:
- Rampa de subida para 5 VUs em 10 segundos
- Manutenção de 5 VUs por 20 segundos
- Rampa de descida para 0 VUs em 10 segundos

## Resultados Comparativos

### Tempo de Resposta (p95)

| Endpoint                   | H100       | B200      | Fator de Diferença |
|----------------------------|------------|-----------|-------------------|
| `/memorize`                | 676.61 ms  | 65.00 ms  | 10.4x mais rápido |
| `/admin/forget`            | 578.77 ms  | 35.62 ms  | 16.2x mais rápido |
| `/admin/tenant/{id}/stats` | 557.46 ms  | 33.36 ms  | 16.7x mais rápido |

### Taxa de Requisições

| Endpoint                   | H100        | B200         | Fator de Diferença |
|----------------------------|-------------|--------------|-------------------|
| `/memorize`                | 4.52 req/s  | 11.23 req/s  | 2.5x mais requisições |
| `/admin/forget`            | 3.86 req/s  | 7.38 req/s   | 1.9x mais requisições |
| `/admin/tenant/{id}/stats` | 3.94 req/s  | 7.33 req/s   | 1.9x mais requisições |

### Taxa de Sucesso

Ambos os servidores H100 e B200 processaram todas as requisições com **100% de sucesso** para todos os endpoints testados.

## Análise de Desempenho sob Carga

### Endpoint `/memorize`:
- O servidor B200 processou este endpoint aproximadamente 10.4 vezes mais rápido que o H100.
- A taxa de requisições no B200 foi 2.5 vezes maior que no H100.
- Ambos os servidores mantiveram 100% de sucesso nas requisições, demonstrando boa estabilidade.

### Endpoint `/admin/forget`:
- O servidor B200 processou este endpoint aproximadamente 16.2 vezes mais rápido que o H100.
- A taxa de requisições no B200 foi 1.9 vezes maior que no H100.
- Ambos os servidores mantiveram 100% de sucesso nas requisições, demonstrando boa estabilidade.

### Endpoint `/admin/tenant/{tenant_id}/stats`:
- O servidor B200 processou este endpoint aproximadamente 16.7 vezes mais rápido que o H100.
- A taxa de requisições no B200 foi 1.9 vezes maior que no H100.
- Ambos os servidores mantiveram 100% de sucesso nas requisições, demonstrando boa estabilidade.

## Comparação com Testes Smoke

Ao comparar os resultados dos testes de carga com os testes smoke anteriores, observamos:

1. **Degradação de Desempenho sob Carga**:
   - No H100, o tempo de resposta para `/memorize` aumentou de 282.64 ms para 676.61 ms (2.4x)
   - No B200, o tempo de resposta para `/memorize` aumentou de 16.66 ms para 65.00 ms (3.9x)

2. **Consistência nas Diferenças entre Servidores**:
   - A vantagem de desempenho do B200 sobre o H100 permaneceu significativa nos testes de carga
   - O fator de diferença diminuiu ligeiramente de 17.0x para 10.4x para o endpoint `/memorize`
   - Para os outros endpoints, a diferença permaneceu em torno de 16x

3. **Estabilidade**:
   - Ambos os servidores mantiveram 100% de taxa de sucesso em todas as requisições, mesmo sob carga
   - Não foram observados timeouts ou erros nas respostas

## Conclusões

1. **Desempenho Superior do B200**:
   - O servidor B200 continua demonstrando desempenho significativamente superior ao H100 sob condições de carga.
   - A diferença de desempenho é consistente em todos os endpoints testados.

2. **Escalabilidade**:
   - Ambos os servidores demonstraram boa escalabilidade, mantendo 100% de sucesso nas requisições mesmo com 5 VUs concorrentes.
   - O tempo de resposta aumentou de forma previsível em ambos os servidores quando submetidos a carga.

3. **Diferença na Degradação de Desempenho**:
   - O servidor H100 sofreu uma degradação de 2.4x no tempo de resposta sob carga para o endpoint `/memorize`.
   - O servidor B200 sofreu uma degradação um pouco maior (3.9x) para o mesmo endpoint, mas ainda manteve tempos absolutos muito melhores.

4. **Consistência**:
   - Os resultados dos testes de carga são consistentes com os testes smoke, confirmando que o B200 tem melhor desempenho para estes endpoints.

## Recomendações

1. **Investigar Otimizações para H100**:
   - Considerando que as GPUs H100 são mais potentes que as B200, a grande diferença de desempenho sugere que pode haver otimizações a serem realizadas na configuração ou implementação específica para o H100.

2. **Testes de Stress**:
   - Executar testes de stress com cargas ainda maiores para identificar os limites de cada servidor.

3. **Investigar Configuração de Rede e Sistema**:
   - Verificar se existem diferenças na configuração de rede, sistema operacional ou outras condições que possam influenciar o desempenho.

4. **Profiling Detalhado**:
   - Realizar profiling detalhado da aplicação em ambos os servidores para identificar gargalos específicos.

5. **Análise de Recursos**:
   - Monitorar o uso de CPU, memória e GPU durante os testes para correlacionar com os tempos de resposta.

## Observações Finais

Os testes de carga confirmam que, para os endpoints testados, o servidor B200 oferece desempenho significativamente melhor que o H100, mesmo sob carga. Esta diferença consistente de desempenho merece uma investigação mais aprofundada, especialmente considerando que as GPUs H100 são teoricamente mais poderosas que as B200.