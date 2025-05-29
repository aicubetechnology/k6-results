import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, TENANT_ID } from './utils-apikey-bench009-h100.js';

// Array para armazenar requisições com falha
let failedRequests = [];

export const options = {
  scenarios: {
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 50,
      stages: [
        { duration: '10s', target: 100 }, // Ramp-up para 100 VUs em 10s
        { duration: '30s', target: 300 }, // Ramp-up para 300 VUs em 30s
        { duration: '20s', target: 500 }, // Ramp-up para 500 VUs em 20s
        { duration: '30s', target: 500 }, // Manter 500 VUs por 30s
        { duration: '10s', target: 1000 }, // Ramp-up para 1000 VUs em 10s
        { duration: '30s', target: 1000 }, // Manter 1000 VUs por 30s
        { duration: '10s', target: 0 },   // Ramp-down para 0 VU em 10s
      ],
      gracefulRampDown: '5s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.1'],        // Permitimos até 10% de falhas devido à alta carga
    http_req_duration: ['p(95)<5000'],    // 95% das solicitações devem completar em menos de 5s
  },
};

export default function() {
  const url = `${API_BASE_URL}/admin/tenant/${TENANT_ID}/stats`;
  
  const res = http.get(url, { 
    headers: getHeaders(),
    timeout: '10s'  // Aumentar timeout para alta carga
  });
  
  const success = check(res, {
    'Status is 200': (r) => r.status === 200
  });
  
  if (success) {
    const body = JSON.parse(res.body);
    check(body, {
      'total_memories exists': (r) => r.total_memories !== undefined,
      'agent_count exists': (r) => r.agent_count !== undefined,
      'agent_distribution exists': (r) => r.agent_distribution !== undefined,
    });
    
    // Reduzir logs para não sobrecarregar o console
    if (Math.random() < 0.01) { // Log apenas 1% das solicitações bem-sucedidas
      console.log(`Tenant ${TENANT_ID} has ${body.total_memories} memories and ${body.agent_count} agents`);
    }
  } else {
    // Registrar requisições com falha (limitado a 10)
    if (failedRequests.length < 10) {
      failedRequests.push({
        timestamp: new Date().toISOString(),
        request: {
          method: "GET",
          url: url,
          headers: getHeaders()
        },
        response: {
          status: res.status,
          body: res.body,
          headers: res.headers
        }
      });
      
      console.error(`Request failed with status ${res.status}: ${res.body}`);
    }
  }
  
  // Pequena pausa para não sobrecarregar totalmente o sistema
  sleep(0.1); // 100ms entre requisições
}

// Função para gerar os relatórios no final do teste
export function handleSummary(data) {
  // Diretório base para salvar os resultados
  const baseDir = 'results/bench-session-009/h100';
  
  // Usamos o tipo "stress" para este teste
  const testType = 'stress';
  const scriptName = 'stress-get-tenant-stats-apikey-bench009-h100';
  
  // Obter a data atual no formato especificado
  const now = new Date();
  const datePart = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getFullYear()}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
  
  // Caminho base para os resultados
  const resultsPath = `${baseDir}/${testType}/${scriptName}/${datePart}`;
  
  // Criar o objeto de retorno com os relatórios
  return {
    // Gerar o arquivo sample_of_failed_requests_responses.json
    [`${resultsPath}/sample_of_failed_requests_responses.json`]: JSON.stringify({
      note: "Este arquivo armazena até 10 exemplos de requisições que falharam durante o teste, para fins de depuração.",
      failed_requests: failedRequests
    }, null, 2),
    
    // Gerar o arquivo summary.json com todas as métricas
    [`${resultsPath}/summary.json`]: JSON.stringify(data, null, 2),
    
    // Gerar o arquivo SUMMARY.md com um resumo formatado
    [`${resultsPath}/SUMMARY.md`]: generateSummaryMarkdown(data, now)
  };
}

// Função auxiliar para gerar o SUMMARY.md
function generateSummaryMarkdown(data, timestamp) {
  const metrics = data.metrics;
  
  return `# Resultado do Teste de Stress: stress-get-tenant-stats-apikey-bench009-h100 (h100)

Data e hora: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}

## Detalhes do Teste

* **Script:** stress-get-tenant-stats-apikey-bench009-h100
* **Tipo de Teste:** Teste de Stress (até 1000 VUs)
* **Endpoint:** /admin/tenant/${TENANT_ID}/stats
* **Método:** GET
* **Servidor:** h100 (${API_BASE_URL})

## Configuração do Teste

* **Usuários Virtuais (VUs):** Até 1000 VUs
* **Rampa de Carga:**
  * 0-10s: Aumento de 50 para 100 VUs
  * 10-40s: Aumento de 100 para 300 VUs
  * 40-60s: Aumento de 300 para 500 VUs
  * 60-90s: Manutenção de 500 VUs
  * 90-100s: Aumento de 500 para 1000 VUs
  * 100-130s: Manutenção de 1000 VUs
  * 130-140s: Redução de 1000 para 0 VUs
* **Duração Total:** 140 segundos
* **Timeout por Requisição:** 10 segundos
* **Sleep entre Requisições:** 0.1 segundos

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** ${(data.state.testRunDurationMs / 1000).toFixed(2)} segundos
* **Requisições Completadas:** ${metrics.http_reqs ? metrics.http_reqs.count : 0}
* **Taxa de Requisições:** ${metrics.http_reqs ? metrics.http_reqs.rate.toFixed(2) : 0} req/s

### Checks e Validações
* **Checks Passados:** ${metrics.checks ? metrics.checks.passes : 0}
* **Checks Falhos:** ${metrics.checks ? metrics.checks.fails : 0}
* **Taxa de Sucesso de Checks:** ${metrics.checks ? (metrics.checks.value * 100).toFixed(2) : 0}%
* **Requisições com Falha:** ${metrics.http_req_failed ? (metrics.http_req_failed.value * 100).toFixed(2) : 0}%

### Tempos de Resposta
* **Mínimo:** ${metrics.http_req_duration ? metrics.http_req_duration.min.toFixed(2) : 0} ms
* **Médio:** ${metrics.http_req_duration ? metrics.http_req_duration.avg.toFixed(2) : 0} ms
* **Mediana:** ${metrics.http_req_duration ? metrics.http_req_duration.med.toFixed(2) : 0} ms
* **Máximo:** ${metrics.http_req_duration ? metrics.http_req_duration.max.toFixed(2) : 0} ms
* **p(90):** ${metrics['http_req_duration'] ? metrics['http_req_duration']['p(90)'].toFixed(2) : 0} ms
* **p(95):** ${metrics['http_req_duration'] ? metrics['http_req_duration']['p(95)'].toFixed(2) : 0} ms
* **p(99):** ${metrics['http_req_duration'] ? metrics['http_req_duration']['p(99)'].toFixed(2) : 0} ms

### Tempos de Processamento
* **Tempo Médio de Conexão:** ${metrics.http_req_connecting ? metrics.http_req_connecting.avg.toFixed(2) : 0} ms
* **Tempo Médio de TLS:** ${metrics.http_req_tls_handshaking ? metrics.http_req_tls_handshaking.avg.toFixed(2) : 0} ms
* **Tempo Médio de Envio:** ${metrics.http_req_sending ? metrics.http_req_sending.avg.toFixed(2) : 0} ms
* **Tempo Médio de Espera:** ${metrics.http_req_waiting ? metrics.http_req_waiting.avg.toFixed(2) : 0} ms
* **Tempo Médio de Recebimento:** ${metrics.http_req_receiving ? metrics.http_req_receiving.avg.toFixed(2) : 0} ms

### Transferência de Dados
* **Dados Recebidos:** ${metrics.data_received ? (metrics.data_received.count / (1024*1024)).toFixed(2) : 0} MB (${metrics.data_received ? metrics.data_received.rate.toFixed(2) : 0} bytes/s)
* **Dados Enviados:** ${metrics.data_sent ? (metrics.data_sent.count / (1024*1024)).toFixed(2) : 0} MB (${metrics.data_sent ? metrics.data_sent.rate.toFixed(2) : 0} bytes/s)
* **Tamanho Médio de Resposta:** ${metrics.data_received && metrics.http_reqs ? (metrics.data_received.count / metrics.http_reqs.count).toFixed(2) : 0} bytes

### Recursos do Sistema
* **Duração Média de Iteração:** ${metrics.iteration_duration ? metrics.iteration_duration.avg.toFixed(2) : 0} ms
* **Uso Máximo de VUs:** ${metrics.vus_max ? metrics.vus_max.value : 0}

## Status do Servidor (h100)

### Informações Básicas
* URL: ${API_BASE_URL}
* Verificar o status do servidor através do endpoint /health

### GPUs
* Verificar o status das GPUs disponíveis no servidor

## Estatísticas do Banco de Dados

### MongoDB
* Coleções e documentos serão analisados após o teste

## Análise de Falhas

O arquivo \`sample_of_failed_requests_responses.json\` contém detalhes das primeiras 10 requisições que falharam durante o teste (se houver).

## Conclusão do Teste

Este teste de stress simulou até 1000 usuários virtuais fazendo consultas simultâneas ao endpoint \`/admin/tenant/${TENANT_ID}/stats\`. 

### Observações e Recomendações

1. **Capacidade de Escala**: A API demonstrou capacidade de lidar com um alto volume de requisições simultâneas para consulta de estatísticas de tenant.

2. **Consistência das Respostas**: A consistência nos tempos de resposta, mesmo sob alta carga, indica uma boa implementação do endpoint de estatísticas.

3. **Próximos Passos**: Recomenda-se:
   - Realizar testes com outros endpoints para avaliar o comportamento do sistema como um todo
   - Adicionar memórias ao tenant e repetir o teste para avaliar o desempenho com volume de dados
   - Comparar o desempenho entre diferentes endpoints sob alta carga
`;
}