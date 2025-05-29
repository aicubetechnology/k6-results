import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, getMemorizePayload } from './utils-apikey-bench005-b200.js';

// Array para armazenar requisições com falha
let failedRequests = [];
// Memória atual para teste
let currentMemoryId = null;

export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<2000'], // 95% das solicitações devem completar em menos de 2s
  },
};

export default function() {
  // Etapa 1: Criar uma memória para o teste
  const memorizeUrl = `${API_BASE_URL}/memorize`;
  const memorizePayload = getMemorizePayload(`Memória de teste para deleção - ${new Date().toISOString()}`);
  
  const memorizeRes = http.post(memorizeUrl, JSON.stringify(memorizePayload), { headers: getHeaders() });
  
  let memoryId = null;
  
  if (memorizeRes.status === 200) {
    try {
      const body = JSON.parse(memorizeRes.body);
      memoryId = body.memory_id;
      currentMemoryId = memoryId; // Salvar para log no final
      console.log(`Memory created for deletion test: ${memoryId}`);
    } catch (e) {
      console.error(`Error parsing memorize response: ${e.message}`);
      // Se não conseguiu criar memória, encerra esta iteração
      return;
    }
  } else {
    console.error(`Failed to create memory: ${memorizeRes.status} - ${memorizeRes.body}`);
    // Se não conseguiu criar memória, encerra esta iteração
    return;
  }
  
  // Etapa 2: Verificar se a memória foi criada
  const getUrl = `${API_BASE_URL}/memory/${memoryId}`;
  const getRes = http.get(getUrl, { headers: getHeaders() });
  
  if (getRes.status !== 200) {
    console.error(`Memory verification failed: ${getRes.status} - ${getRes.body}`);
    // Se não conseguiu verificar a memória, encerra esta iteração
    return;
  }
  
  // Etapa 3: Deletar a memória
  const deleteUrl = `${API_BASE_URL}/memory/${memoryId}`;
  const deleteRes = http.del(deleteUrl, null, { headers: getHeaders() });
  
  const success = check(deleteRes, {
    'status is 200': (r) => r.status === 200,
  });
  
  if (success) {
    try {
      const body = JSON.parse(deleteRes.body);
      check(body, {
        'has status success': (r) => r.status === 'success',
        'has memory_id': (r) => r.memory_id === memoryId,
      });
      
      console.log(`Memory deleted successfully: ${memoryId}`);
    } catch (e) {
      console.error(`Error parsing delete response: ${e.message}`);
    }
  } else {
    // Registrar requisições com falha
    failedRequests.push({
      timestamp: new Date().toISOString(),
      request: {
        method: "DELETE",
        url: deleteUrl,
        headers: getHeaders()
      },
      response: {
        status: deleteRes.status,
        body: deleteRes.body,
        headers: deleteRes.headers
      }
    });
    
    console.error(`Delete request failed with status ${deleteRes.status}: ${deleteRes.body}`);
  }
  
  // Etapa 4: Verificar se a memória foi realmente deletada
  const verifyDeleteRes = http.get(getUrl, { headers: getHeaders() });
  
  check(verifyDeleteRes, {
    'memory no longer exists': (r) => r.status === 404 || r.status === 400,
  });
  
  sleep(1);
}

// Função para gerar os relatórios no final do teste
export function handleSummary(data) {
  // Diretório base para salvar os resultados
  const baseDir = 'results/bench-session-005/b200';
  
  // Tipo de teste e nome do script
  const testType = 'smoke';
  const scriptName = 'smoke-delete-memory-apikey';
  
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
    
    // Gerar o arquivo last_memory_id.json para referência
    [`${resultsPath}/last_memory_id.json`]: JSON.stringify({
      note: "Este arquivo armazena o ID da última memória usada neste teste.",
      memory_id: currentMemoryId
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
  
  return `# Resultado do Teste de Fumaça: smoke-delete-memory-apikey (B200)

Data e hora: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}

## Detalhes do Teste

* **Script:** smoke-delete-memory-apikey
* **Tipo de Teste:** smoke (fumaça)
* **Total de Requisições:** ${metrics.http_reqs ? metrics.http_reqs.count : 0}
* **Endpoint:** /memory/{memory_id}
* **Método:** DELETE

## Configuração do Teste

* **Usuários Virtuais (VUs):** 1
* **Duração:** 10s
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

## Status do Servidor (B200)

Informações do servidor obtidas via endpoint /health antes e depois do teste.

## Conclusão

Este teste verifica a funcionalidade básica do endpoint \`/memory/{memory_id}\` com método DELETE, que permite excluir uma memória específica.

Os resultados mostram o desempenho e a confiabilidade do servidor B200 ao processar requisições de exclusão de memórias.
`;
}