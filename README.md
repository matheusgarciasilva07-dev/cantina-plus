# Cantina+ — Col. Est. Profª Lindaura Ribeiro Lucas

Site convertido para **HTML + CSS + JavaScript puro** (sem React, sem build, sem npm).
Pronto para abrir direto no VS Code.

## Estrutura de arquivos

```
cantina-plus/
├── index.html        → estrutura de todas as telas (login, verificação, cardápio, carrinho, pagamento, sucesso)
├── style.css          → todo o visual (cores, fontes, layout mobile)
├── script.js          → toda a lógica (login simulado, carrinho, checkout, QR Code)
└── assets/
    └── brasao.jpg     → brasão do colégio
```

## Como abrir no VS Code

1. Extraia este zip em uma pasta no seu computador.
2. Abra a pasta no VS Code (`Arquivo > Abrir Pasta...`).
3. Instale a extensão **Live Server** (de Ritwick Dey) pelo marketplace de extensões, se ainda não tiver.
4. Clique com o botão direito no arquivo `index.html` e escolha **"Open with Live Server"**.
   - O site abrirá no navegador, geralmente em `http://127.0.0.1:5500`.
5. Para visualizar como em um celular, reduza a janela do navegador ou use o modo de inspeção (F12 → ícone de celular).

Alternativa sem extensão: basta dar duplo clique no `index.html` para abrir direto no navegador (algumas fontes/ícones funcionam normalmente pois usam CDN).

## Como o site funciona

- **Login**: aceita qualquer e-mail terminado em `@escola.pr.gov.br` e senha com 4+ caracteres (é uma simulação, não há servidor real).
- **Verificação em 2 etapas**: gera um código de 6 dígitos exibido na tela (modo demonstração) — digite-o para entrar.
- **Cardápio**: filtra por categoria, adiciona/remove itens da sacola.
- **Carrinho → Pagamento**: escolha PIX, cartão ou dinheiro, informe o nome.
- **Confirmação**: gera um QR Code (biblioteca `qrcode.js`, carregada via CDN) com os dados do pedido para retirada na cantina.

## Personalizar

- **Itens do cardápio**: edite o array `MENU` no topo do `script.js`.
- **Cores**: edite as variáveis no topo do `style.css` (`:root { --primary: ... }`).
- **Textos/telas**: edite diretamente o `index.html`.
- **Brasão**: substitua o arquivo `assets/brasao.jpg` por outra imagem (mesmo nome).

## Observações técnicas

- As fontes "Anton" e "DM Sans" e a biblioteca de QR Code são carregadas via CDN (precisa de internet na primeira vez que abrir).
- Não há banco de dados ou backend: tudo roda no navegador, então o "login" e o "pedido" não persistem se a página for recarregada.
- Se quiser publicar online, basta subir estes mesmos arquivos em qualquer serviço de hospedagem estática (GitHub Pages, Netlify, Vercel, etc.) — não precisa de servidor Node.
