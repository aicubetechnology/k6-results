# Testes de Performance com k6 para Qube Neural Memory API

Este projeto contém scripts de teste de performance usando k6 para a API Qube Neural Memory.

## Instalação do k6

Antes de executar os testes, é necessário instalar o k6. Você pode fazer isso de duas maneiras:

### Método 1: Usando o script de instalação

```bash
cd k6
curl -L https://github.com/grafana/k6/releases/download/v0.46.0/k6-v0.46.0-linux-amd64.tar.gz -o k6.tar.gz
tar xzf k6.tar.gz
mv k6-v0.46.0-linux-amd64/k6 .
rm -rf k6-v0.46.0-linux-amd64 k6.tar.gz
chmod +x k6
```

### Método 2: Instalação oficial

Siga as instruções da [documentação oficial do k6](https://k6.io/docs/get-started/installation/).

## Estrutura de Diretórios

```
k6/
├── scripts/        # Scripts de teste
│   ├── utils.js    # Funções e utilitários comuns
│   ├── smoke-*.js  # Testes de fumaça
│   ├── load-*.js   # Testes de carga
│   └── stress-*.js # Testes de stress
├── results/        # Resultados dos testes
├── run-tests.sh    # Script para executar os testes
└── README.md       # Este arquivo
```

## Tipos de Testes

### Testes de Fumaça (Smoke)

Testes simples para verificar se os endpoints estão funcionando corretamente.
Executam com poucos usuários virtuais por um curto período de tempo.

### Testes de Carga (Load)

Testes para verificar o comportamento da aplicação sob carga normal.
Executam com um número moderado de usuários virtuais por um período médio de tempo.

### Testes de Stress (Stress)

Testes para verificar os limites da aplicação sob carga alta.
Executam com um número alto de usuários virtuais para identificar pontos de ruptura.

## Execução dos Testes

Use o script `run-tests.sh` para executar os testes:

```bash
# Listar todos os testes disponíveis
./run-tests.sh list

# Executar todos os testes de fumaça
./run-tests.sh smoke

# Executar todos os testes de carga
./run-tests.sh load

# Executar todos os testes de stress
./run-tests.sh stress

# Executar um teste específico
./run-tests.sh single <tipo> <endpoint>
# Exemplo:
./run-tests.sh single smoke health
```

### Verificação Rápida de Endpoints

Para uma verificação rápida do status de todos os endpoints, use:

```bash
# Usando o script run-tests.sh
./run-tests.sh check

# Ou diretamente via k6
./k6 run scripts/check-all-endpoints.js
```

Este script faz uma única requisição para cada endpoint e reporta seu status. Útil para validar rapidamente se o serviço está operacional antes de executar testes mais detalhados.

Para ver o status atual dos endpoints, consulte o arquivo [ENDPOINTS_STATUS.md](ENDPOINTS_STATUS.md).

## Endpoints Testados

- **Health Check**: `/health`
- **Memorize**: `/memorize`
- **Memorize Batch**: `/memorize_batch`
- **Retrieve**: `/retrieve`
- **Get Memory**: `/memory/{memory_id}`
- **Delete Memory**: `/memory/{memory_id}`
- **Admin Forget**: `/admin/forget`
- **Get Tenant Stats**: `/admin/tenant/{tenant_id}/stats`

Observação: Os testes para o endpoint de criação de tenants (`/admin/tenant/register`) não foram incluídos conforme solicitado.

## Limitações dos Testes

- Os testes não fazem mais de 100 requisições por endpoint, conforme solicitado.
- A autenticação utiliza um token JWT válido com expiração de longa duração.
- Na versão atual, apenas os testes para o endpoint `/health` estão funcionando completamente.
- Os endpoints que requerem autenticação estão retornando "Erro interno do servidor", possivelmente devido a problemas de configuração ou permissões no backend.
- Os testes utilizam os IDs reais de tenant (Company ID) e agent (User ID) extraídos do token de autenticação.

## Resultados

Os resultados dos testes são salvos no diretório `results/` com a seguinte estrutura:

```
k6/results/tipo_do_teste/script_de_teste/diaMesAnoHoraMinutoSegundo/
```

Cada diretório de resultado contém os seguintes arquivos:

- **SUMMARY.md**: Contém o resultado do teste em formato Markdown, incluindo métricas de performance.
- **summary.json**: Contém os dados brutos do teste em formato JSON.
- **sample_of_failed_requests_responses.json**: Armazena até 10 exemplos de requisições que falharam durante o teste, para fins de depuração. Este arquivo contém tanto o request (método, URL, headers, body) quanto a resposta (status, headers, body) para cada falha.

## Solução de Problemas

**Problema Atual de Autenticação**:
Existe um problema conhecido com os endpoints autenticados que está documentado detalhadamente em [AUTH_PROBLEM.md](AUTH_PROBLEM.md). Este problema afeta todos os endpoints que requerem autenticação.

**Soluções Gerais**:

1. **Erro Interno do Servidor**:
   - Verifique os logs do servidor para identificar a causa raiz
   - Confirme que o tenant e agent IDs são válidos e têm permissões corretas
   - Verifique se o token de autenticação não expirou

2. **Falhas de Autenticação**:
   - O token pode ter expirado - atualize o token no arquivo `scripts/utils.js`
   - Verifique se o formato do token está correto (Bearer + token)
   - Verifique se as bibliotecas necessárias estão instaladas corretamente (ex: PyJWT)

3. **Problemas de Configuração**:
   - Certifique-se de que a URL da API está correta (atualmente http://130.61.226.26:8000)
   - Verifique se a estrutura dos payloads corresponde ao esperado pela API