import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, getRetrievePayload, TENANT_ID } from './utils-apikey-b200.js';

// Array para armazenar requisições com falha
let failedRequests = [];

export const options = {
  scenarios: {
    smoke_test: {
      executor: 'shared-iterations',
      vus: 5,          // 5 usuários virtuais
      iterations: 10,  // 2 operações por usuário (2 * 5)
      maxDuration: '30s', // Tempo máximo para completar o teste
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.1'], // Permitimos até 10% de falhas
    http_req_duration: ['p(95)<5000'], // 95% das solicitações devem completar em menos de 5s
  },
};

export default function() {
  const url = `${API_BASE_URL}/retrieve`;
  
  // Adicionar alguma variabilidade nas consultas
  const userID = Math.floor(Math.random() * 1000);
  const queries = [
    "Qual é a importância da memória para agentes de IA?",
    "Como os sistemas de memória ajudam na contextualização?",
    "Por que o armazenamento de contexto é relevante para LLMs?",
    "Quais são as vantagens da memória neural para agentes?",
    "Como funciona a recuperação de contexto em tempo real?"
  ];
  
  const randomQuery = queries[Math.floor(Math.random() * queries.length)];
  
  const customPayload = {
    tenant_id: TENANT_ID,
    query: `${randomQuery} (Usuário ${userID})`,
    top_k: 3,
    filters: {
      test_request: true,
      user_id: userID
    }
  };
  
  // Usar o payload customizado
  const res = http.post(url, JSON.stringify(customPayload), { 
    headers: getHeaders(),
    timeout: '10s'
  });
  
  // Verificar o status da resposta
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  if (success) {
    try {
      const body = JSON.parse(res.body);
      check(body, {
        'has matches array': (r) => Array.isArray(r.matches),
        'has source field': (r) => r.source !== undefined,
      });
      
      console.log(`Retrieval successful for query: "${customPayload.query.substring(0, 30)}..."`);
    } catch (e) {
      console.error(`Error parsing response: ${e.message}`);
    }
  } else {
    // Registrar requisições com falha (limitado a 10)
    if (failedRequests.length < 10) {
      failedRequests.push({
        timestamp: new Date().toISOString(),
        request: {
          method: "POST",
          url: url,
          headers: getHeaders(),
          body: customPayload
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
  
  // Pequeno intervalo entre requisições
  sleep(0.5);
}

// Função para gerar os relatórios no final do teste
export function handleSummary(data) {
  // Diretório base para salvar os resultados
  const baseDir = 'results/b200';
  
  // Tipo de teste e nome do script
  const testType = 'smoke';
  const scriptName = 'smoke-retrieve-apikey';
  
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
    [`${resultsPath}/SUMMARY.md`]: generateSummaryMarkdown(data, now),
    
    // Gerar um arquivo de configuração do teste
    [`${resultsPath}/test_config.json`]: JSON.stringify({
      test_type: testType,
      script_name: scriptName,
      execution_date: now.toISOString(),
      parameters: {
        virtual_users: 5,
        iterations_per_user: 2,
        total_iterations: 10,
        max_duration: '30s',
        timeout_per_request: '10s',
        sleep_between_requests: 0.5
      }
    }, null, 2)
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
  
  return `# Resultado do Teste Smoke: smoke-retrieve-apikey (B200)

Data e hora: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}

## Detalhes do Teste

* **Script:** smoke-retrieve-apikey
* **Tipo de Teste:** Smoke Test (5 usuários, 2 operações por usuário)
* **Total de Requisições Planejadas:** 10
* **Endpoint:** /retrieve
* **Método:** POST

## Configuração do Teste

* **Usuários Virtuais (VUs):** 5
* **Iterações por VU:** 2
* **Tempo Máximo de Execução:** 30 segundos
* **Timeout por Requisição:** 10 segundos
* **Sleep entre Requisições:** 0.5 segundos

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** ${(data.state.testRunDurationMs / 1000).toFixed(2)} segundos
* **Requisições Completadas:** ${metrics.iterations.count} de 10 planejadas (${(metrics.iterations.count/10*100).toFixed(2)}%)
* **Taxa de Requisições:** ${metrics.http_reqs.rate.toFixed(2)} req/s

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
* **p(90):** ${metrics.http_req_duration && metrics.http_req_duration['p(90)'] ? metrics.http_req_duration['p(90)'].toFixed(2) : 0} ms
* **p(95):** ${metrics.http_req_duration && metrics.http_req_duration['p(95)'] ? metrics.http_req_duration['p(95)'].toFixed(2) : 0} ms
* **p(99):** ${metrics.http_req_duration && metrics.http_req_duration['p(99)'] ? metrics.http_req_duration['p(99)'].toFixed(2) : 0} ms

### Tempos de Processamento
* **Tempo Médio de Conexão:** ${metrics.http_req_connecting ? metrics.http_req_connecting.avg.toFixed(2) : 0} ms
* **Tempo Médio de TLS:** ${metrics.http_req_tls_handshaking ? metrics.http_req_tls_handshaking.avg.toFixed(2) : 0} ms
* **Tempo Médio de Envio:** ${metrics.http_req_sending ? metrics.http_req_sending.avg.toFixed(2) : 0} ms
* **Tempo Médio de Espera:** ${metrics.http_req_waiting ? metrics.http_req_waiting.avg.toFixed(2) : 0} ms
* **Tempo Médio de Recebimento:** ${metrics.http_req_receiving ? metrics.http_req_receiving.avg.toFixed(2) : 0} ms

### Transferência de Dados
* **Dados Recebidos:** ${metrics.data_received ? (metrics.data_received.count / 1024).toFixed(2) : 0} KB (${metrics.data_received ? metrics.data_received.rate.toFixed(2) : 0} bytes/s)
* **Dados Enviados:** ${metrics.data_sent ? (metrics.data_sent.count / 1024).toFixed(2) : 0} KB (${metrics.data_sent ? metrics.data_sent.rate.toFixed(2) : 0} bytes/s)
* **Tamanho Médio de Resposta:** ${metrics.data_received && metrics.http_reqs ? (metrics.data_received.count / metrics.http_reqs.count).toFixed(2) : 0} bytes

### Recursos do Sistema
* **Duração Média de Iteração:** ${metrics.iteration_duration ? metrics.iteration_duration.avg.toFixed(2) : 0} ms
* **Uso Máximo de VUs:** ${metrics.vus_max ? metrics.vus_max.value : 5}

## Análise de Falhas

O arquivo \`sample_of_failed_requests_responses.json\` contém detalhes das primeiras 10 requisições que falharam durante o teste (se houver).

## Status do Servidor (B200)

Informações do servidor obtidas via endpoint /health antes e depois do teste.

## Conclusão

Este teste simulou 5 usuários simultâneos realizando 2 operações cada no endpoint \`/retrieve\`, totalizando 10 requisições. Os resultados acima fornecem uma visão detalhada do desempenho do sistema sob esta carga simulada.
`;
}