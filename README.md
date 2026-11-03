# Heimdall — Audiometria Web

PWA offline-first para demonstração educacional de uma rotina de triagem tonal por via aérea. Feita com HTML, CSS e JavaScript puros, sem bibliotecas externas.

## Aviso essencial: não é um audiômetro clínico

A aplicação sintetiza tons senoidais com a Web Audio API e oferece um controle relativo de amplitude. **Os valores exibidos em dB são atenuações simuladas e não dB HL calibrados.** A saída acústica real varia conforme aparelho, sistema operacional, volume, conversor de áudio, fones e encaixe. Não use o app para diagnóstico, acompanhamento clínico ou decisões de saúde. Uma audiometria válida exige equipamento apropriado, transdutores e calibração rastreável, além de profissional habilitado.

O limitador de amplitude do código é uma precaução digital, não uma garantia de nível seguro em dB SPL. Comece com o volume do dispositivo baixo. Interrompa se houver desconforto.

## Estrutura

```text
heimdall-audiometria-web/
├── index.html
├── styles.css
├── app.js
├── sw.js
├── manifest.json
├── favicon.svg
├── generate-icons.js
├── README.md
└── assets/
    └── icons/
        ├── logo.svg
        ├── icon-192x192.png
        ├── icon-512x512.png
        └── splash.png
```

## Gerar os ícones

Requer Node.js instalado. Na pasta do projeto, execute:

```bash
node generate-icons.js
```

O script usa somente módulos nativos do Node.js e grava os PNGs em `assets/icons/`. O arquivo `favicon.svg` já está pronto e não depende da geração.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos e preserve a estrutura das pastas.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/ (root)` e salve.
6. Aguarde a publicação e abra o endereço fornecido pelo GitHub Pages.

O Service Worker e a instalação PWA exigem HTTPS (o GitHub Pages já fornece HTTPS). Para testar localmente, use um servidor local, por exemplo a extensão Live Server do VS Code ou `npx serve .`.

## Uso

- Confirme o aviso inicial.
- Escolha o lado, frequência e nível relativo.
- Pressione e segure o botão para emitir o tom; solte para interromper.
- Use `Espaço` para emitir enquanto pressionado.
- Use setas para ajustar nível e frequência; `R` / `L` selecionam o lado; `M` registra a resposta informada pelo participante.
- Exporte os registros em CSV.

## Observações técnicas

- O áudio só é inicializado após interação do usuário, conforme as políticas de autoplay dos navegadores.
- O canal estéreo usa `StereoPannerNode` quando disponível.
- O Service Worker faz cache dos arquivos essenciais para navegação offline.
- Nenhum dado de respostas é enviado a servidores ou persistido automaticamente.
- A média quadritonal só aparece quando existem registros nas quatro frequências requeridas em cada orelha.
- A aplicação não implementa mascaramento, condução óssea, calibração, controle de ruído ambiente ou validação de respostas.

## Licença

Uso educacional e experimental. Adicione uma licença explícita ao repositório caso deseje distribuir o projeto sob termos específicos.
