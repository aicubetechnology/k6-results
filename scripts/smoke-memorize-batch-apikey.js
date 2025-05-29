import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, TEST_MEMORY_TEXTS, TENANT_ID, TEST_AGENT_ID, checkStatus } from './utils-apikey.js';

// Array para armazenar requisições com falha
let failedRequests = [];

export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<1000'], // 95% das solicitações devem completar em menos de 1s
  },
};

export default function() {
  const url = `${API_BASE_URL}/memorize_batch`;
  
  // Criar um payload com 3 textos aleatórios
  const texts = [];
  const metadatas = [];
  
  for (let i = 0; i < 3; i++) {
    texts.push(TEST_MEMORY_TEXTS[Math.floor(Math.random() * TEST_MEMORY_TEXTS.length)]);
    metadatas.push({
      source: 'k6_test_batch',
      timestamp: new Date().toISOString(),
      batch_item: i
    });
  }
  
  const payload = {
    tenant_id: TENANT_ID,
    agent_id: TEST_AGENT_ID,
    texts: texts,
    metadatas: metadatas
  };
  
  console.log(`Sending batch request with payload: ${JSON.stringify(payload)}`);
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  console.log(`Response status: ${res.status}`);
  console.log(`Response body: ${res.body}`);
  
  const isSuccess = checkStatus(res);
  
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    check(body, {
      'is array': (r) => Array.isArray(r),
      'has correct length': (r) => r.length === texts.length,
    });
    console.log(`Batch of ${body.length} memories stored`);
  } else {
    // Registrar requisições com falha (limitado a 10)
    if (failedRequests.length < 10) {
      failedRequests.push({
        timestamp: new Date().toISOString(),
        request: {
          method: "POST",
          url: url,
          headers: getHeaders(),
          body: payload
        },
        response: {
          status: res.status,
          body: res.body,
          headers: res.headers
        }
      });
    }
  }
  
  sleep(1);
}

// Função para gerar os relatórios no final do teste
export function handleSummary(data) {
  // Diretório base para salvar os resultados
  const baseDir = 'results';
  
  // Obter a data atual no formato especificado
  const now = new Date();
  const datePart = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getFullYear()}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
  
  // Criar o objeto de retorno com os relatórios
  return {
    // Gerar o arquivo sample_of_failed_requests_responses.json
    [`${baseDir}/smoke/smoke-memorize-batch-apikey/${datePart}/sample_of_failed_requests_responses.json`]: JSON.stringify({
      note: "Este arquivo armazena até 10 exemplos de requisições que falharam durante o teste, para fins de depuração.",
      failed_requests: failedRequests
    }, null, 2),
    
    // Gerar o arquivo summary.json com todas as métricas
    [`${baseDir}/smoke/smoke-memorize-batch-apikey/${datePart}/summary.json`]: JSON.stringify(data, null, 2),
    
    // Gerar o arquivo SUMMARY.md com um resumo formatado
    [`${baseDir}/smoke/smoke-memorize-batch-apikey/${datePart}/SUMMARY.md`]: generateSummaryMarkdown(data, now)
  };
}

// Função auxiliar para gerar o SUMMARY.md
function generateSummaryMarkdown(data, timestamp) {
  const metrics = data.metrics;
  
  return `# Resultado do Teste k6: smoke-memorize-batch-apikey

Data e hora: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}

## Detalhes do Teste

* **Script:** smoke-memorize-batch-apikey
* **Tipo de Teste:** smoke

## Métricas

### Checks
* **Passes:** ${metrics.checks ? metrics.checks.passes : 0}
* **Fails:** ${metrics.checks ? metrics.checks.fails : 0}
* **Taxa de Sucesso:** ${metrics.checks ? metrics.checks.value * 100 : 0}%

### Requests HTTP
* **Total:** ${metrics.http_reqs ? metrics.http_reqs.count : 0}
* **Taxa:** ${metrics.http_reqs ? metrics.http_reqs.rate.toFixed(2) : 0} req/s

### Duração das Requisições
* **Min:** ${metrics.http_req_duration ? metrics.http_req_duration.min.toFixed(2) : 0} ms
* **Avg:** ${metrics.http_req_duration ? metrics.http_req_duration.avg.toFixed(2) : 0} ms
* **Median:** ${metrics.http_req_duration ? metrics.http_req_duration.med.toFixed(2) : 0} ms
* **Max:** ${metrics.http_req_duration ? metrics.http_req_duration.max.toFixed(2) : 0} ms
* **p(90):** ${metrics.http_req_duration ? metrics.http_req_duration['p(90)'].toFixed(2) : 0} ms
* **p(95):** ${metrics.http_req_duration ? metrics.http_req_duration['p(95)'].toFixed(2) : 0} ms

### Outras Métricas
* **Falhas HTTP:** ${metrics.http_req_failed ? metrics.http_req_failed.value * 100 : 0}%
* **Dados Recebidos:** ${metrics.data_received ? metrics.data_received.count : 0} bytes (${metrics.data_received ? metrics.data_received.rate.toFixed(2) : 0} bytes/s)
* **Dados Enviados:** ${metrics.data_sent ? metrics.data_sent.count : 0} bytes (${metrics.data_sent ? metrics.data_sent.rate.toFixed(2) : 0} bytes/s)
* **Duração Média de Iteração:** ${metrics.iteration_duration ? metrics.iteration_duration.avg.toFixed(2) : 0} ms

## Sumário de Falhas

* **Total de Requisições com Falha:** ${failedRequests.length}
`;
}