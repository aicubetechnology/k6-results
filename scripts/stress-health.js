import http from 'k6/http';
import { sleep } from 'k6';
import { check, fail } from 'k6';
import { API_BASE_URL, checkStatus } from './utils.js';
import { Counter, Rate, Trend } from 'k6/metrics';

/**
 * Teste de stress para o endpoint /health
 * 
 * Este teste verifica o comportamento do endpoint /health sob carga pesada,
 * simulando um número crescente de usuários para identificar os limites do sistema.
 * 
 * Perfil de carga:
 * - Rampa de subida 1: 0 a 10 usuários em 20 segundos
 * - Rampa de subida 2: 10 a 20 usuários em 20 segundos
 * - Rampa de subida 3: 20 a 30 usuários em 20 segundos
 * - Rampa de descida: 30 a 0 usuários em 30 segundos
 */

// Métricas personalizadas
const responseSuccessRate = new Rate('response_success_rate');
const responseTimeTrend = new Trend('response_time_trend');
const healthyStatusCounter = new Counter('healthy_status_counter');

export const options = {
  stages: [
    { duration: '20s', target: 10 },   // Aumentar para 10 usuários em 20s
    { duration: '20s', target: 20 },   // Aumentar para 20 usuários em 20s
    { duration: '20s', target: 30 },   // Aumentar para 30 usuários em 20s
    { duration: '30s', target: 0 },    // Reduzir para 0 usuários
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],     // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<250'],   // 95% das solicitações devem completar em menos de 250ms
    http_req_duration: ['p(99)<500'],   // 99% das solicitações devem completar em menos de 500ms
    http_req_duration: ['max<1000'],    // Tempo máximo de resposta menor que 1s
    'response_success_rate': ['rate>0.99'], // Taxa de sucesso de resposta maior que 99%
  },
};

export default function() {
  const url = `${API_BASE_URL}/health`;
  const startTime = new Date();
  
  // Adicionar tags para melhor análise
  const tags = {
    endpoint: 'health',
    test_type: 'stress'
  };
  
  const res = http.get(url, { tags });
  const duration = new Date() - startTime;
  
  // Registrar duração da resposta
  responseTimeTrend.add(duration, tags);
  
  // Verificar status HTTP
  const statusCheck = checkStatus(res);
  responseSuccessRate.add(statusCheck, tags);
  
  // Verificar estrutura e conteúdo da resposta
  if (res.status === 200) {
    try {
      const body = JSON.parse(res.body);
      
      const bodyChecks = check(body, {
        'status é healthy': (b) => b.status === 'healthy',
        'versão está presente': (b) => b.version !== undefined,
        'informações de GPUs estão presentes': (b) => Array.isArray(b.gpus),
        'timestamp está presente': (b) => b.timestamp !== undefined,
      });
      
      responseSuccessRate.add(bodyChecks, tags);
      
      if (body.status === 'healthy') {
        healthyStatusCounter.add(1, tags);
      }
      
      // Log apenas para algumas solicitações para evitar spam
      if (Math.random() < 0.05) { // 5% das requisições
        console.log(`Saúde: ${body.status}, Tempo: ${duration}ms, GPUs: ${body.gpus.length}`);
      }
    } catch (e) {
      console.error(`Erro ao processar resposta: ${e.message}`);
      fail('Falha ao analisar o corpo da resposta');
    }
  }
  
  // Tempo de espera variável para simular comportamento mais realista
  sleep(Math.random() * 0.5); // Entre 0 e 0.5 segundos
}