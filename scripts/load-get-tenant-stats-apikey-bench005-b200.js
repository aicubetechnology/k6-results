import http from 'k6/http';
import { sleep } from 'k6';
import { check, group } from 'k6';
import { API_BASE_URL, getHeaders, TENANT_ID } from './utils-apikey-bench005-b200.js';

// Array para armazenar requisições com falha
let failedRequests = [];
// Array para armazenar tempos de resposta
let responseTimes = [];

export const options = {
  // Configuração do teste de carga moderada - versão reduzida para completar mais rapidamente
  stages: [
    { duration: '5s', target: 2 },  // Aumenta para 2 VUs em 5s
    { duration: '10s', target: 5 },  // Aumenta para 5 VUs em 10s
    { duration: '15s', target: 8 }, // Aumenta para 8 VUs em 15s
    { duration: '15s', target: 8 }, // Mantém 8 VUs por 15s
    { duration: '10s', target: 5 },  // Reduz para 5 VUs em 10s
    { duration: '5s', target: 2 },  // Reduz para 2 VUs em 5s
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'], // Falha HTTP deve ser menor que 5%
    http_req_duration: ['p(95)<1000'], // 95% das solicitações devem completar em menos de 1s
  },
};

export default function() {
  group('tenant_stats_endpoint', function() {
    const url = `${API_BASE_URL}/admin/tenant/${TENANT_ID}/stats`;
    
    // Registrar o tempo de início
    const startTime = new Date().getTime();
    
    const res = http.get(url, { headers: getHeaders() });
    
    // Registrar o tempo de resposta
    const endTime = new Date().getTime();
    const responseTime = endTime - startTime;
    responseTimes.push({ time: responseTime, timestamp: new Date().toISOString() });
    
    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'has total_memories': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.total_memories !== undefined;
        } catch (e) {
          return false;
        }
      },
      'has agent_count': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.agent_count !== undefined;
        } catch (e) {
          return false;
        }
      }
    });
    
    if (!success) {
      // Registrar requisições com falha
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
          headers: res.headers,
          time: responseTime
        }
      });
      
      console.error(`Request failed with status ${res.status}: ${res.body}`);
    } else {
      try {
        const body = JSON.parse(res.body);
        console.log(`Retrieved stats for tenant: ${body.total_memories} memories, ${body.agent_count} agents`);
      } catch (e) {
        console.error(`Error parsing response: ${e.message}`);
      }
    }
  });
  
  // Pequeno sleep para evitar sobrecarga
  sleep(Math.random() * 0.3 + 0.2); // Sleep entre 0.2 e 0.5 segundo (resposta rápida, não precisa de tanto sleep)
}

// Função para gerar os relatórios no final do teste
export function handleSummary(data) {
  // Diretório base para salvar os resultados
  const baseDir = 'results/bench-session-005/b200';
  
  // Tipo de teste e nome do script
  const testType = 'load';
  const scriptName = 'load-get-tenant-stats-apikey';
  
  // Obter a data atual no formato especificado
  const now = new Date();
  const datePart = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getFullYear()}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
  
  // Caminho base para os resultados
  const resultsPath = `${baseDir}/${testType}/${scriptName}/${datePart}`;
  
  // Calcular estatísticas dos tempos de resposta
  const responseStats = calculateResponseTimeStats(responseTimes);
  
  // Criar o objeto de retorno com os relatórios
  const summaryFiles = {
    // Gerar o arquivo sample_of_failed_requests_responses.json
    [`${resultsPath}/sample_of_failed_requests_responses.json`]: JSON.stringify({
      note: "Este arquivo armazena exemplos de requisições que falharam durante o teste, para fins de depuração.",
      failed_requests: failedRequests
    }, null, 2),
    
    // Gerar o arquivo response_times.json para análise detalhada
    [`${resultsPath}/response_times.json`]: JSON.stringify({
      note: "Este arquivo armazena os tempos de resposta de todas as requisições, para análise de performance.",
      response_times: responseTimes,
      stats: responseStats
    }, null, 2),
    
    // Gerar o arquivo summary.json com todas as métricas
    [`${resultsPath}/summary.json`]: JSON.stringify(data, null, 2),
    
    // Gerar o arquivo SUMMARY.md com um resumo formatado
    [`${resultsPath}/SUMMARY.md`]: generateSummaryMarkdown(data, now, responseStats)
  };
  
  return summaryFiles;
}

// Função para calcular estatísticas de tempo de resposta
function calculateResponseTimeStats(times) {
  if (times.length === 0) return { min: 0, max: 0, avg: 0, median: 0, p95: 0, p99: 0 };
  
  // Extrair apenas os valores de tempo
  const timeValues = times.map(t => t.time).sort((a, b) => a - b);
  
  const min = timeValues[0];
  const max = timeValues[timeValues.length - 1];
  const avg = timeValues.reduce((sum, t) => sum + t, 0) / timeValues.length;
  
  // Calcular mediana
  const midIndex = Math.floor(timeValues.length / 2);
  const median = timeValues.length % 2 === 0 
    ? (timeValues[midIndex - 1] + timeValues[midIndex]) / 2 
    : timeValues[midIndex];
  
  // Calcular percentis
  const p95Index = Math.ceil(timeValues.length * 0.95) - 1;
  const p99Index = Math.ceil(timeValues.length * 0.99) - 1;
  
  const p95 = timeValues[p95Index];
  const p99 = timeValues[p99Index];
  
  return { min, max, avg, median, p95, p99 };
}

// Função auxiliar para gerar o SUMMARY.md
function generateSummaryMarkdown(data, timestamp, responseStats) {
  const metrics = data.metrics;
  
  // Verificar se metrics está definido
  if (!metrics) {
    return `# Teste Falhou - Erro na Execução
Data e hora: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}
Ocorreu um erro durante a execução do teste. Verifique o arquivo k6_output.txt para mais detalhes.
`;
  }
  
  // Obter valores das métricas (com fallbacks para evitar erros)
  const httpReqCount = metrics.http_reqs ? metrics.http_reqs.count : 0;
  const httpReqRate = metrics.http_reqs ? metrics.http_reqs.rate : 0;
  const httpReqFailRate = metrics.http_req_failed ? metrics.http_req_failed.value * 100 : 0;
  
  const httpReqDurationAvg = metrics.http_req_duration ? metrics.http_req_duration.avg : 0;
  const httpReqDurationMin = metrics.http_req_duration ? metrics.http_req_duration.min : 0;
  const httpReqDurationMed = metrics.http_req_duration ? metrics.http_req_duration.med : 0;
  const httpReqDurationMax = metrics.http_req_duration ? metrics.http_req_duration.max : 0;
  const httpReqDurationP90 = metrics['http_req_duration'] && metrics['http_req_duration']['p(90)'] ? metrics['http_req_duration']['p(90)'] : 0;
  const httpReqDurationP95 = metrics['http_req_duration'] && metrics['http_req_duration']['p(95)'] ? metrics['http_req_duration']['p(95)'] : 0;
  const httpReqDurationP99 = metrics['http_req_duration'] && metrics['http_req_duration']['p(99)'] ? metrics['http_req_duration']['p(99)'] : 0;
  
  const dataReceived = metrics.data_received ? metrics.data_received.count / 1024 : 0;
  const dataReceivedRate = metrics.data_received ? metrics.data_received.rate : 0;
  const dataSent = metrics.data_sent ? metrics.data_sent.count / 1024 : 0;
  const dataSentRate = metrics.data_sent ? metrics.data_sent.rate : 0;
  
  const testDuration = (data.state && data.state.testRunDurationMs) ? data.state.testRunDurationMs / 1000 : 0;
  
  // Construir o relatório markdown
  return `# Resultado do Teste de Carga: load-get-tenant-stats-apikey (B200)

Data e hora: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}

## Detalhes do Teste

* **Script:** load-get-tenant-stats-apikey
* **Tipo de Teste:** load (carga)
* **Total de Requisições:** ${httpReqCount}
* **Endpoint:** /admin/tenant/{tenant_id}/stats
* **Método:** GET

## Configuração do Teste

* **Perfil de Carga:**
  * 0-10s: Aumento de 1 para 2 VUs
  * 10-30s: Aumento de 2 para 5 VUs
  * 30-60s: Aumento de 5 para 10 VUs
  * 60-90s: Manutenção de 10 VUs
  * 90-110s: Redução de 10 para 5 VUs
  * 110-120s: Redução de 5 para 2 VUs

* **Thresholds:**
  * Taxa de falha < 5%
  * 95% das requisições < 1s

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** ${testDuration.toFixed(2)} segundos
* **Requisições Completadas:** ${httpReqCount}
* **Taxa de Requisições:** ${httpReqRate.toFixed(2)} req/s
* **Taxa de Falha:** ${httpReqFailRate.toFixed(2)}%

### Tempos de Resposta (K6)
* **Mínimo:** ${httpReqDurationMin.toFixed(2)} ms
* **Médio:** ${httpReqDurationAvg.toFixed(2)} ms
* **Mediana:** ${httpReqDurationMed.toFixed(2)} ms
* **Máximo:** ${httpReqDurationMax.toFixed(2)} ms
* **p(90):** ${httpReqDurationP90.toFixed(2)} ms
* **p(95):** ${httpReqDurationP95.toFixed(2)} ms
* **p(99):** ${httpReqDurationP99.toFixed(2)} ms

### Tempos de Resposta (Calculado)
* **Mínimo:** ${responseStats.min.toFixed(2)} ms
* **Médio:** ${responseStats.avg.toFixed(2)} ms
* **Mediana:** ${responseStats.median.toFixed(2)} ms
* **Máximo:** ${responseStats.max.toFixed(2)} ms
* **p(95):** ${responseStats.p95.toFixed(2)} ms
* **p(99):** ${responseStats.p99.toFixed(2)} ms

### Transferência de Dados
* **Dados Recebidos:** ${dataReceived.toFixed(2)} KB (${dataReceivedRate.toFixed(2)} bytes/s)
* **Dados Enviados:** ${dataSent.toFixed(2)} KB (${dataSentRate.toFixed(2)} bytes/s)
* **Tamanho Médio de Resposta:** ${(httpReqCount > 0) ? (dataReceived * 1024 / httpReqCount).toFixed(2) : 0} bytes

## Análise de Falhas

O arquivo \`sample_of_failed_requests_responses.json\` contém detalhes das requisições que falharam durante o teste (se houver).

## Conclusão

Este teste de carga avalia o desempenho do endpoint \`/admin/tenant/{tenant_id}/stats\` do servidor B200 sob carga moderada. Os resultados mostram como o servidor responde ao aumento gradual de usuários virtuais, permitindo analisar a escalabilidade e estabilidade do sistema.

### Pontos de Atenção

* Verificar se os tempos de resposta aumentam significativamente durante os períodos de maior carga
* Monitorar se houve falhas durante os picos de carga
* Analisar se o servidor manteve a estabilidade durante todo o teste
`;
}