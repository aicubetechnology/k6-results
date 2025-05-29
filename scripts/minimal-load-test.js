import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';

// Constantes da API
const API_BASE_URL = 'http://130.61.226.26:8000';
const API_KEY = 'qube_f902e70766df4267af120da27cd17ea3';
const TENANT_ID = 'gdias_tenant';

// Array para armazenar requisições com falha
let failedRequests = [];

export const options = {
  vus: 2,          // Apenas 2 usuários virtuais
  iterations: 2,   // Apenas 2 iterações no total
  thresholds: {
    http_req_failed: ['rate<0.1'],    // Taxa de falha aceitável
    http_req_duration: ['p(95)<5000'], // 95% das requisições devem completar em menos de 5s
  },
};

// Função para obter headers com API key
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  };
}

export default function() {
  const url = `${API_BASE_URL}/memorize`;
  
  // Criar payload para a requisição
  const userID = Math.floor(Math.random() * 100);
  const payload = {
    tenant_id: TENANT_ID,
    agent_id: `agent_test_${userID}`,
    text: `Teste mínimo - Usuário ${userID} - Timestamp: ${new Date().toISOString()}`,
    metadata: {
      source: 'k6_minimal_test',
      timestamp: new Date().toISOString()
    }
  };
  
  // Fazer a requisição
  const res = http.post(url, JSON.stringify(payload), { 
    headers: getHeaders(),
    timeout: '5s'
  });
  
  // Verificar resultado
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  if (success) {
    const body = JSON.parse(res.body);
    console.log(`Memory stored with ID: ${body.memory_id} for user ${userID}`);
  } else {
    // Registrar requisições com falha
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
  
  // Esperar um pouco antes da próxima requisição
  sleep(1);
}

// Função para gerar relatórios
export function handleSummary(data) {
  // Diretório base para salvar os resultados
  const baseDir = 'results';
  const testType = 'minimal_load';
  const scriptName = 'minimal-load-test';
  
  // Obter a data atual no formato especificado
  const now = new Date();
  const datePart = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getFullYear()}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
  
  // Caminho para os resultados
  const resultsPath = `${baseDir}/${testType}/${scriptName}/${datePart}`;
  
  // Gerar o markdown do relatório
  const summaryMarkdown = `# Resultado do Teste Mínimo de Carga

Data e hora: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}

## Detalhes do Teste

* **Script:** ${scriptName}
* **Tipo de Teste:** Teste Mínimo de Carga
* **VUs:** 2
* **Iterações:** 2
* **Endpoint:** /memorize

## Métricas de Performance

* **Duração Total:** ${(data.state.testRunDurationMs / 1000).toFixed(2)} segundos
* **Requisições Completadas:** ${data.metrics.iterations.count}
* **Taxa de Sucesso:** ${(data.metrics.checks.passes / data.metrics.checks.count * 100).toFixed(2)}%
* **Tempo Médio de Resposta:** ${data.metrics.http_req_duration.avg.toFixed(2)} ms

## Detalhes de Requisições Falhas

${failedRequests.length > 0 
  ? 'Foram registradas requisições com falha. Veja o arquivo sample_of_failed_requests_responses.json para mais detalhes.'
  : 'Não foram registradas requisições com falha.'}
`;

  // Retornar os arquivos a serem gerados
  return {
    [`${resultsPath}/SUMMARY.md`]: summaryMarkdown,
    [`${resultsPath}/summary.json`]: JSON.stringify(data, null, 2),
    [`${resultsPath}/sample_of_failed_requests_responses.json`]: JSON.stringify({
      note: "Este arquivo armazena até 10 exemplos de requisições que falharam durante o teste, para fins de depuração.",
      failed_requests: failedRequests
    }, null, 2)
  };
}