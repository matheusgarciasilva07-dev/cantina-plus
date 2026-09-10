const http=require('http');
const fs=require('fs');
const port=3000;

JavaScript
const http = require('http');
const fs = require('fs');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Configuração de cabeçalhos CORS (permite que o
    // frontend faça chamadas sem ser bloqueado)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Tratamento de requisições prévias do navegador (Preflight CORS)
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Rota para receber e salvar os dados
    if (req.method === 'POST' && req.url === '/salvar') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const registro = `[${new Date().toLocaleString()}] Dado Recebido: ${body}\n`;

            // Grava (ou acrescenta) os dados em um arquivo dentro do Ubuntu Server
            fs.appendFile('dados_servidor.txt', registro, (err) => {
                if (err) {
                    console.error('Erro ao salvar no arquivo:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'erro', mensagem: 'Falha no servidor' }));
                } else {
                    console.log('Dado salvo com sucesso no servidor:', body);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'sucesso', mensagem: 'Dado gravado no servidor Ubuntu!' }));
                }
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Rota nao encontrada');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor backend rodando em http://192.168.56.105:${PORT}`);
});