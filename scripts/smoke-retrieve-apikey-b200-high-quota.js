import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, getRetrievePayload } from './utils-apikey-b200-high-quota.js';

export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<500'], // 95% das solicitações devem completar em menos de 500ms
  },
};

// Array para armazenar requisições com falha
let failedRequests = [];

export default function() {
  const url = `${API_BASE_URL}/retrieve`;
  const payload = getRetrievePayload();
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  const success = check(res, {
    'Status is 200': (r) => r.status === 200
  });
  
  if (success) {
    const body = JSON.parse(res.body);
    check(body, {
      'has matches array': (r) => Array.isArray(r.matches),
      'has source': (r) => r.source !== undefined,
    });
    console.log(`Retrieved ${body.matches.length} matches`);
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
      
      console.error(`Request failed with status ${res.status}: ${res.body}`);
    }
  }
  
  sleep(1);
}

// Função para gerar os relatórios no final do teste
export function handleSummary(data) {
  // Diretório base para salvar os resultados
  const baseDir = 'results/b200';
  
  // Tipo de teste e nome do script
  const testType = 'smoke';
  const scriptName = 'smoke-retrieve-apikey-high-quota';
  
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
  
  // Verificar se metrics está definido e tem as propriedades necessárias
  if (!metrics || !metrics.http_reqs || !metrics.iterations) {
    return `# Teste Falhou - Erro na Execução
Data e hora: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}
Ocorreu um erro durante a execução do teste. Verifique o arquivo k6_output.txt para mais detalhes.
`;
  }
  
  return `# Resultado do Teste de Fumaça: smoke-retrieve-apikey (B200 - Alta Quota)

Data e hora: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}

## Detalhes do Teste

* **Script:** smoke-retrieve-apikey-high-quota
* **Tipo de Teste:** smoke (fumaça)
* **Total de Requisições:** ${metrics.http_reqs ? metrics.http_reqs.count : 0}
* **Endpoint:** /retrieve
* **Método:** POST

## Configuração do Teste

* **Usuários Virtuais (VUs):** 1
* **Duração:** 10s
* **Timeout por Requisição:** Padrão
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

O arquivo \`sample_of_failed_requests_responses.json\` contém detalhes das primeiras 10 requisições que falharam durante o teste (se houver).

## Status do Servidor (B200)

Informações do servidor obtidas via endpoint /health antes e depois do teste.

## Conclusão

Este teste foi executado com os mesmos parâmetros utilizados no teste do servidor H100, permitindo uma comparação direta do desempenho entre os dois servidores. Este teste utilizou um tenant com quota alta (1.000.000 requisições diárias) para evitar as limitações de quota encontradas em testes anteriores.

Se o erro 'VectorDB' object has no attribute 'retrieve_similar' persistir, isso confirma que o problema é na implementação do código e não relacionado às limitações de quota ou às correções de TORCH e CUDA.

**Observação**: Este teste foi realizado após as correções de TORCH e CUDA no servidor B200.
`;
}