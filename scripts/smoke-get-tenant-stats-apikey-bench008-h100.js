import http from 'k6/http';
import { sleep, check } from 'k6';
import { getHeaders, API_BASE_URL, TENANT_ID } from './utils-apikey-bench008-h100.js';

// Configuração do teste
export const options = {
  vus: 1,
  iterations: 3,
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% das requisições devem completar em menos de 1s
    http_req_failed: ['rate<0.01'],    // Menos de 1% das requisições podem falhar
  },
};

export default function () {
  // Construir a URL
  const url = `${API_BASE_URL}/admin/tenant/${TENANT_ID}/stats`;
  
  // Fazer a requisição GET
  const res = http.get(url, { headers: getHeaders() });
  
  // Verificar se a resposta foi bem-sucedida
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has total_memories': (r) => {
      try {
        const body = r.json();
        return typeof body.total_memories === 'number';
      } catch (e) {
        console.error(`Error parsing response: ${e.message}`);
        return false;
      }
    },
    'response has agent_count': (r) => {
      try {
        const body = r.json();
        return typeof body.agent_count === 'number';
      } catch (e) {
        console.error(`Error parsing response: ${e.message}`);
        return false;
      }
    },
    'response has agent_distribution': (r) => {
      try {
        const body = r.json();
        return typeof body.agent_distribution === 'object';
      } catch (e) {
        console.error(`Error parsing response: ${e.message}`);
        return false;
      }
    }
  });
  
  // Verificar detalhes adicionais da resposta
  if (res.status === 200) {
    try {
      const body = r.json();
      
      console.log(`Tenant stats retrieved successfully for ${TENANT_ID}:`);
      console.log(`- Total memories: ${body.total_memories}`);
      console.log(`- Agent count: ${body.agent_count}`);
      console.log(`- Oldest memory: ${body.oldest_memory || 'N/A'}`);
      console.log(`- Newest memory: ${body.newest_memory || 'N/A'}`);
      
      if (body.avg_importance !== null) {
        check(res, {
          'avg_importance is a number': (r) => typeof body.avg_importance === 'number',
        });
      }
      
      if (body.average_tenant_surprise !== null) {
        check(res, {
          'average_tenant_surprise is a number': (r) => typeof body.average_tenant_surprise === 'number',
        });
      }
    } catch (e) {
      console.error(`Error validating response: ${e.message}`);
    }
  } else {
    console.error(`Failed to get tenant stats: ${res.status} ${res.body}`);
  }
  
  sleep(1);
}