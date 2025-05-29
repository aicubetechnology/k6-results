import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, getMemorizePayload } from './utils-apikey-b200.js';

// Array para armazenar requisições com falha
let failedRequests = [];

export const options = {
  scenarios: {
    massive_load: {
      executor: 'shared-iterations',
      vus: 10,         // 10 usuários virtuais (ajustado para demonstração)
      iterations: 20,  // 2 operações por usuário (2 * 10)
      maxDuration: '30s', // Tempo máximo para completar o teste
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.1'], // Permitimos até 10% de falhas devido à alta carga
    http_req_duration: ['p(95)<5000'], // 95% das solicitações devem completar em menos de 5s
  },
};

export default function() {
  const url = `${API_BASE_URL}/memorize`;
  
  // Adicionar alguma variabilidade nos payloads para simular diferentes usuários
  const userID = Math.floor(Math.random() * 1000);
  const customPayload = {
    tenant_id: 'qube_test_tenant_1748298966',
    agent_id: `agent_test_${userID}`,
    text: `Teste de carga massiva - Usuário ${userID} - Timestamp: ${new Date().toISOString()}`,
    metadata: {
      source: 'k6_massive_load_test',
      timestamp: new Date().toISOString(),
      user_id: userID
    }
  };
  
  // Usar o payload customizado em vez do padrão para maior variabilidade
  const res = http.post(url, JSON.stringify(customPayload), { 
    headers: getHeaders(),
    timeout: '10s'  // Aumentar o timeout devido à alta carga
  });
  
  // Verificar o status da resposta
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  if (success) {
    try {
      const body = JSON.parse(res.body);
      check(body, {
        'has memory_id': (r) => r.memory_id !== undefined,
        'status is success': (r) => r.status === 'success',
      });
      
      // Reduzir a quantidade de logs para não sobrecarregar o console
      if (Math.random() < 0.01) { // Apenas 1% das operações bem-sucedidas gerará logs
        console.log(`Memory stored with ID: ${body.memory_id} for user ${userID}`);
      }
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
      
      // Log de erros para monitoramento
      console.error(`Request failed with status ${res.status} for user ${userID}: ${res.body}`);
    }
  }
  
  // Reduzir o sleep para aumentar a taxa de requisições
  // Com 1000 VUs, mesmo um sleep pequeno pode ser suficiente para espaçar as requisições
  sleep(0.1);
}

// Função para gerar os relatórios no final do teste
export function handleSummary(data) {
  // Diretório base para salvar os resultados
  const baseDir = 'results/b200';
  
  // Usamos o tipo "massive_load" em vez de "smoke" para este teste específico
  const testType = 'massive_load';
  const scriptName = 'smoke-memorize-apikey-compare';
  
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
        virtual_users: 10,
        iterations_per_user: 2,
        total_iterations: 20,
        max_duration: '30s',
        timeout_per_request: '10s',
        sleep_between_requests: 0.1
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
  
  return `# Resultado do Teste de Carga Massiva: smoke-memorize-apikey-compare (B200)

Data e hora: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}

## Detalhes do Teste

* **Script:** smoke-memorize-apikey-compare
* **Tipo de Teste:** Carga Massiva (10 usuários, 2 operações por usuário)
* **Total de Requisições Planejadas:** 20
* **Endpoint:** /memorize
* **Método:** POST

## Configuração do Teste

* **Usuários Virtuais (VUs):** 10
* **Iterações por VU:** 2
* **Tempo Máximo de Execução:** 30 segundos
* **Timeout por Requisição:** 10 segundos
* **Sleep entre Requisições:** 0.1 segundos

## Métricas de Performance

### Resumo Geral
* **Duração Total do Teste:** ${(data.state.testRunDurationMs / 1000).toFixed(2)} segundos
* **Requisições Completadas:** ${metrics.iterations.count} de 20 planejadas (${(metrics.iterations.count/20*100).toFixed(2)}%)
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
* **p(90):** ${metrics['http_req_duration'] && metrics['http_req_duration']['p(90)'] ? metrics['http_req_duration']['p(90)'].toFixed(2) : 0} ms
* **p(95):** ${metrics['http_req_duration'] && metrics['http_req_duration']['p(95)'] ? metrics['http_req_duration']['p(95)'].toFixed(2) : 0} ms
* **p(99):** ${metrics['http_req_duration'] && metrics['http_req_duration']['p(99)'] ? metrics['http_req_duration']['p(99)'].toFixed(2) : 0} ms

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
* **Uso Máximo de VUs:** ${metrics.vus_max ? metrics.vus_max.value : 10}

## Análise de Falhas

O arquivo \`sample_of_failed_requests_responses.json\` contém detalhes das primeiras 10 requisições que falharam durante o teste (se houver).

## Status do Servidor (B200)

Informações do servidor obtidas via endpoint /health antes e depois do teste.

## Conclusão

Este teste simulou 10 usuários simultâneos realizando 2 operações cada no endpoint \`/memorize\`, totalizando 20 requisições, com os mesmos parâmetros utilizados no teste do servidor H100. Isso permite uma comparação direta do desempenho entre os dois servidores.

**Observação**: Este teste foi realizado após as correções de TORCH e CUDA no servidor B200.
`;
}