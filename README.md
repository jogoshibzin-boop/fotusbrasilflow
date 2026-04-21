# Fotus Brasil Flow — Calculadora Premium de Pedágios

Site com identidade **Dark Corporativa Premium** (preto + dourado), redesign completo feito do zero.

## Mudanças visuais em relação à versão anterior

- **Paleta:** preto absoluto (#0A0A0B) + dourado metálico (#D4AF37) em vez do azul corporativo
- **Tipografia:** Playfair Display (serif italiana, estilo editorial) + Space Grotesk + JetBrains Mono — completamente diferente das fontes anteriores
- **Layout:** editorial/magazine premium com grids assimétricos, bordas dourado-fino, numeração monospace, split screens
- **Componentes:** logo com losango dourado rotacionado, cards numerados com numeral gigante em itálico, resultado da calculadora com estilo de relatório financeiro
- **Detalhes:** textura de grão sobre o fundo, grid decorativo no hero, frames dourados nas imagens, linhas douradas finas como separadores

## Dados da empresa

- **Marca:** Fotus Brasil Flow
- **Razão Social:** Fotus Energia Solar LTDA
- **CNPJ:** 07.117.654/0002-20
- **Domínio:** fotusbrasilflow.com.br
- **E-mail de contato:** contato@fotusbrasilflow.com.br
- **E-mail DPO (LGPD):** dpo@fotusbrasilflow.com.br

## Estrutura

```
fotus-brasil-flow/
├── index.html                  # Página principal
├── robots.txt
├── sitemap.xml
├── README.md
├── assets/
│   ├── styles.css             # Design system dark premium
│   ├── script.js              # Calculadora + cookies + termos
│   └── img/                   # 3 imagens de pedágio
└── pages/
    ├── sobre.html
    ├── contato.html
    ├── termos.html
    ├── privacidade.html
    ├── cookies.html
    └── lgpd.html
```

## Compliance Google Ads (mantido)

- ✓ Termos de Uso completos
- ✓ Política de Privacidade com LGPD
- ✓ Política de Cookies
- ✓ Página de Sobre Nós e Contato
- ✓ CNPJ e razão social no rodapé de todas páginas
- ✓ Modal de aceite de termos no 1º acesso
- ✓ Banner de cookies
- ✓ Meta tags SEO, Open Graph, Schema.org
- ✓ Robots.txt e Sitemap.xml
- ✓ Disclaimer legal em todas as páginas

## Deploy

1. **Netlify / Vercel / GitHub Pages** (grátis): arraste a pasta no painel
2. **Hospedagem tradicional** (cPanel, Hostinger): upload para `public_html`
3. **Domínio próprio com SSL** — requisito para aprovação do Google Ads

## Notas

- Os valores de pedágio são estimativos (8 rotas principais cadastradas)
- Formulário de contato apenas simula envio — integre com Formspree, EmailJS ou backend próprio
- Aguarde pelo menos 7 dias de idade do site antes de submeter ao Google Ads
- Cadastre o sitemap.xml no Google Search Console
