import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, TEST_MEMORY_TEXTS, TENANT_ID, TEST_AGENT_ID } from './utils-apikey-bench002-h100.js';

// Array para armazenar requisições com falha
let failedRequests = [];
// Array para armazenar IDs de memórias criadas (para testes subsequentes)
let createdMemoryIds = [];

export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<2000'], // 95% das solicitações devem completar em menos de 2s
  },
};

export default function() {
  const url = `${API_BASE_URL}/memorize_batch`;
  
  // Criar um lote de textos para memorizar
  const batchSize = 5;
  const texts = [];
  for (let i = 0; i < batchSize; i++) {
    texts.push(TEST_MEMORY_TEXTS[i % TEST_MEMORY_TEXTS.length] + ` (Item ${i+1} do lote)`);
  }
  
  const payload = {
    tenant_id: TENANT_ID,
    agent_id: TEST_AGENT_ID,
    texts: texts,
    metadatas: Array(batchSize).fill().map((_, i) => ({
      source: 'k6_batch_test',
      batch_index: i,
      timestamp: new Date().toISOString()
    }))
  };
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  if (success) {
    try {
      const body = JSON.parse(res.body);
      check(body, {
        'is array': (r) => Array.isArray(r),
        'has correct length': (r) => r.length === batchSize,
        'all items have memory_id': (r) => r.every(item => item.memory_id !== undefined),
        'all items have success status': (r) => r.every(item => item.status === 'success'),
      });
      
      // Armazenar IDs para testes subsequentes
      createdMemoryIds = body.map(item => item.memory_id);
      console.log(`Batch memorized with ${body.length} items. First memory ID: ${body[0].memory_id}`);
    } catch (e) {
      console.error(`Error parsing response: ${e.message}`);
    }
  } else {
    // Registrar requisições com falha
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
    
    console.error(`Request failed with status ${res.status}: ${res.body}`);
  }
  
  sleep(1);
}

// Função para gerar os relatórios no final do teste
export function handleSummary(data) {
  // Diretório base para salvar os resultados
  const baseDir = 'results/bench-session-002/h100';
  
  // Tipo de teste e nome do script
  const testType = 'smoke';
  const scriptName = 'smoke-memorize-batch-apikey';
  
  // Obter a data atual no formato especificado
  const now = new Date();
  const datePart = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getFullYear()}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
  
  // Caminho base para os resultados
  const resultsPath = `${baseDir}/${testType}/${scriptName}/${datePart}`;
  
  // Criar o objeto de retorno com os relatórios
  const summaryFiles = {
    // Gerar o arquivo sample_of_failed_requests_responses.json
    [`${resultsPath}/sample_of_failed_requests_responses.json`]: JSON.stringify({
      note: "Este arquivo armazena exemplos de requisições que falharam durante o teste, para fins de depuração.",
      failed_requests: failedRequests
    }, null, 2),
    
    // Gerar o arquivo created_memory_ids.json para uso em outros testes
    [`${resultsPath}/created_memory_ids.json`]: JSON.stringify({
      note: "Este arquivo armazena os IDs das memórias criadas durante o teste, para uso em testes subsequentes.",
      memory_ids: createdMemoryIds
    }, null, 2),
    
    // Gerar o arquivo summary.json com todas as métricas
    [`${resultsPath}/summary.json`]: JSON.stringify(data, null, 2),
    
    // Gerar o arquivo SUMMARY.md com um resumo formatado
    [`${resultsPath}/SUMMARY.md`]: generateSummaryMarkdown(data, now)
  };
  
  return summaryFiles;
}

// Função auxiliar para gerar o SUMMARY.md
function generateSummaryMarkdown(data, timestamp) {
  const metrics = data.metrics;
  
  // Verificar se metrics está definido e tem as propriedades necessárias
  if (!metrics || !metrics.http_reqs || !metrics.iterations) {
    return `# Teste Falhou - Erro na Execução
Data e hora: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}
Ocorreu um erro durante a execução do teste. Verifique o arquivo k6_output.txt para mais detalhes.
`;
  }
  
  return `# Resultado do Teste de Fumaça: smoke-memorize-batch-apikey (H100)

Data e hora: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}

## Detalhes do Teste

* **Script:** smoke-memorize-batch-apikey
* **Tipo de Teste:** smoke (fumaça)
* **Total de Requisições:** ${metrics.http_reqs ? metrics.http_reqs.count : 0}
* **Endpoint:** /memorize_batch
* **Método:** POST

## Configuração do Teste

* **Usuários Virtuais (VUs):** 1
* **Duração:** 10s
* **Tamanho do Lote:** 5 itens por requisição
* **Sleep entre Requisições:** 1s

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
* **p(90):** ${metrics['http_req_duration'] && metrics['http_req_duration']['p(90)'] ? metrics['http_req_duration']['p(90)'].toFixed(2) : 0} ms
* **p(95):** ${metrics['http_req_duration'] && metrics['http_req_duration']['p(95)'] ? metrics['http_req_duration']['p(95)'].toFixed(2) : 0} ms
* **p(99):** ${metrics['http_req_duration'] && metrics['http_req_duration']['p(99)'] ? metrics['http_req_duration']['p(99)'].toFixed(2) : 0} ms

### Transferência de Dados
* **Dados Recebidos:** ${metrics.data_received ? (metrics.data_received.count / 1024).toFixed(2) : 0} KB (${metrics.data_received ? metrics.data_received.rate.toFixed(2) : 0} bytes/s)
* **Dados Enviados:** ${metrics.data_sent ? (metrics.data_sent.count / 1024).toFixed(2) : 0} KB (${metrics.data_sent ? metrics.data_sent.rate.toFixed(2) : 0} bytes/s)
* **Tamanho Médio de Resposta:** ${metrics.data_received && metrics.http_reqs ? (metrics.data_received.count / metrics.http_reqs.count).toFixed(2) : 0} bytes

## Análise de Falhas

O arquivo \`sample_of_failed_requests_responses.json\` contém detalhes das requisições que falharam durante o teste (se houver).

## Memórias Criadas

O teste criou ${createdMemoryIds.length} memórias no sistema. Os IDs dessas memórias foram salvos no arquivo \`created_memory_ids.json\` para uso em testes subsequentes.

## Status do Servidor (H100)

Informações do servidor obtidas via endpoint /health antes e depois do teste.

## Conclusão

Este teste verifica a funcionalidade básica do endpoint \`/memorize_batch\`, que permite memorizar vários textos em uma única requisição. O endpoint foi testado com lotes de 5 itens por requisição.

Os resultados mostram o desempenho e a confiabilidade do servidor H100 ao processar requisições de memorização em lote.
`;
}