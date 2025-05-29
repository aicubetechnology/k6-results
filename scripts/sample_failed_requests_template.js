// Trecho para adicionar aos scripts de teste para registrar requisições falhas
// em um arquivo sample_of_failed_requests_responses.json

// No início do script, após importar os módulos necessários:
let failedRequests = [];

// Dentro da função principal, após fazer a requisição:
if (res.status !== 200) {
    // Registrar a requisição que falhou (limitado a 10)
    if (failedRequests.length < 10) {
        failedRequests.push({
            timestamp: new Date().toISOString(),
            request: {
                method: "POST", // Ajuste conforme o método usado
                url: url,
                headers: getHeaders(),
                body: payload // Ajuste para o payload da requisição
            },
            response: {
                status: res.status,
                body: res.body,
                headers: res.headers
            }
        });
    }
}

// No final do script, na função handleSummary (se disponível) ou como parte da exportação:
function handleSummary(data) {
    // Cria o relatório padrão
    let report = {};
    
    // Adiciona o sample_of_failed_requests_responses.json
    report["sample_of_failed_requests_responses.json"] = JSON.stringify({
        note: "Este arquivo armazena até 10 exemplos de requisições que falharam durante o teste, para fins de depuração.",
        failed_requests: failedRequests
    }, null, 2);
    
    return report;
}