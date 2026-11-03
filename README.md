# HEIMDALL — AUDIOMETRIA WEB
## Manual completo de utilização, operação e solução de problemas

**Versão do manual:** 1.0  
**Idioma:** Português do Brasil  
**Tipo de aplicação:** Progressive Web App (PWA), educacional e experimental  
**Tecnologias:** HTML5, CSS3, JavaScript e Web Audio API  
**Execução:** navegador moderno; instalação opcional; funcionamento offline após o primeiro carregamento bem-sucedido e armazenamento do cache.

---

## 1. Apresentação

Heimdall — Audiometria Web é uma aplicação web que demonstra, de maneira interativa, alguns elementos de uma rotina de triagem auditiva tonal por via aérea. Ela gera tons senoidais diretamente no navegador, permite selecionar frequências e níveis relativos de saída, direcionar o som para um dos canais estéreo, registrar manualmente respostas informadas pelo participante e visualizar os registros em um audiograma simplificado.

A aplicação foi desenvolvida com tecnologias nativas da web, sem bibliotecas externas e sem arquivos de áudio pré-gravados. O som é sintetizado em tempo real pela **Web Audio API**.

### 1.1 Finalidade

O Heimdall foi concebido para:

- fins educacionais e demonstrações de conceitos de audiometria tonal;
- familiarização com seleção de frequência e controle relativo de intensidade;
- demonstração de geração de tons digitais no navegador;
- registro manual e visualização de respostas fictícias ou experimentais;
- estudo de interfaces web acessíveis, responsivas e offline-first.

### 1.2 O que o Heimdall não faz

O Heimdall **não é um audiômetro clínico**, não substitui equipamento audiológico e não realiza diagnóstico. Não deve ser usado para determinar limiares auditivos reais, identificar ou classificar perda auditiva, acompanhar condições de saúde, emitir laudos ou orientar decisões clínicas.

Os valores apresentados como dB são **níveis relativos simulados de controle digital**. Eles não são dB HL calibrados e não podem ser convertidos de forma confiável em dB SPL. A amplitude acústica efetivamente recebida depende, entre outros fatores, do computador ou celular, sistema operacional, conversor de áudio, amplificador, fones, encaixe, resposta de frequência e volume configurado.

O limite digital de amplitude implementado no código é apenas uma precaução de processamento. **Não garante um nível sonoro seguro no ouvido.** Comece com o volume do dispositivo baixo, nunca aumente o volume para tentar compensar um tom que não esteja sendo percebido e interrompa imediatamente se houver desconforto.

Uma avaliação audiológica válida requer equipamento apropriado, transdutores adequados, calibração rastreável, ambiente controlado e profissional habilitado.

---

## 2. Por que o aplicativo se chama Heimdall?

O nome **Heimdall** vem da mitologia nórdica. Heimdall é conhecido como o guardião da Bifröst, a ponte que liga o mundo dos deuses a outros mundos. Nas narrativas tradicionais, ele é associado à vigilância e a uma capacidade extraordinária de percepção, incluindo uma audição excepcional.

A escolha do nome faz referência simbólica à escuta, à atenção e à percepção sonora — temas relacionados à proposta demonstrativa do aplicativo. O nome também transmite a ideia de um guardião atento aos sinais.

Essa referência é exclusivamente conceitual e de identidade visual. Ela **não significa** que o software tenha capacidade de detectar problemas auditivos, medir a audição com precisão clínica ou oferecer proteção à saúde auditiva.

---

## 3. Requisitos para utilização

### 3.1 Dispositivo

- Computador, tablet ou smartphone com navegador atualizado.
- Saída de áudio funcional.
- Fones estéreo para demonstrar a separação entre os canais direito e esquerdo.
- Ambiente tão silencioso quanto possível para reduzir interferências durante a demonstração.

### 3.2 Navegadores

Utilize uma versão atualizada de um navegador compatível com a Web Audio API, como versões recentes de Chrome, Edge, Firefox ou Safari. O comportamento de áudio, instalação e reprodução em segundo plano pode variar entre navegadores e sistemas operacionais.

### 3.3 Conexão e modo offline

É necessária conexão à internet para o primeiro acesso ao endereço publicado e para baixar os arquivos da aplicação. Depois que a página for carregada e o Service Worker instalar o cache com sucesso, os recursos essenciais poderão ser utilizados offline.

O modo offline não significa que a aplicação funcione antes do primeiro carregamento. Limpar os dados do site, remover o armazenamento do navegador ou utilizar outro navegador/dispositivo elimina ou invalida o cache local.

### 3.4 HTTPS

O Service Worker e os recursos de instalação PWA exigem um contexto seguro. O GitHub Pages fornece HTTPS. Em desenvolvimento local, utilize um servidor local, como a extensão Live Server do Visual Studio Code. Abrir o arquivo `index.html` diretamente pelo explorador de arquivos (`file://`) não é uma forma adequada de testar o funcionamento offline ou a instalação PWA.

---

## 4. A interface e suas funções

### 4.1 Cabeçalho e identidade

O cabeçalho apresenta a marca Heimdall — Audiometria Web, o indicador de disponibilidade offline e o controle de tema.

### 4.2 Indicador de conexão e cache

O indicador informa o estado geral da preparação offline:

- **Offline pronto:** o registro do Service Worker foi realizado ou a aplicação está preparada para utilizar os recursos essenciais em cache. Isso não comprova que todos os recursos de áudio do dispositivo estejam funcionando.
- **Modo online:** o registro do Service Worker falhou. A aplicação pode continuar funcionando enquanto houver conexão, mas o modo offline não está garantido.
- **Use HTTPS para instalar:** a página está em um contexto no qual o Service Worker não pode ser registrado, normalmente porque foi aberta por `file://` ou por um endereço não seguro.

O indicador não mede a qualidade da conexão nem verifica os fones.

### 4.3 Aviso de uso

O aviso no painel principal reforça que a ferramenta é educacional, não diagnóstica e utiliza níveis simulados. O botão de fechar oculta o aviso visual durante a sessão atual da página. Fechá-lo não altera as limitações técnicas nem transforma o aplicativo em instrumento clínico.

### 4.4 Janela inicial de cuidados

Na primeira etapa de utilização da página, é exibida uma janela com recomendações. Para liberar o botão de início, marque a caixa confirmando que compreendeu as limitações e os cuidados.

Antes de iniciar:

1. Conecte fones estéreo corretamente.
2. Confira qual lado do fone corresponde ao ouvido direito e ao esquerdo.
3. Reduza o volume do sistema para um nível baixo e confortável.
4. Escolha um ambiente silencioso.
5. Não utilize a ferramenta para tomar decisões sobre saúde auditiva.

A confirmação é uma declaração de leitura, não uma avaliação de segurança do equipamento.

### 4.5 Seleção da orelha

Há dois controles:

- **Direita (O):** seleciona o canal direito. O símbolo de registro é um círculo `O`, apresentado em vermelho no audiograma.
- **Esquerda (X):** seleciona o canal esquerdo. O símbolo de registro é um `X`, apresentado em azul no audiograma.

A aplicação utiliza o recurso `StereoPannerNode` quando o navegador oferece suporte a ele. Nessa implementação, o canal direito é direcionado para a direita e o esquerdo para a esquerda. Se o recurso não estiver disponível, a aplicação continua com a saída de áudio sem esse direcionamento. Portanto, a separação dos lados não deve ser presumida em dispositivos sem saída estéreo funcional.

Trocar a orelha interrompe qualquer tom que esteja em reprodução.

### 4.6 Seleção de frequência

É possível selecionar uma das seis frequências disponíveis:

| Frequência | Atalho visual |
|---:|---:|
| 250 Hz | 250 |
| 500 Hz | 500 |
| 1.000 Hz | 1k |
| 2.000 Hz | 2k |
| 4.000 Hz | 4k |
| 8.000 Hz | 8k |

A seleção pode ser feita pelo menu suspenso ou pelos botões rápidos. As setas esquerda e direita do teclado também percorrem as frequências na ordem apresentada. Ao chegar ao primeiro ou último valor, a navegação permanece no limite, sem avançar além da faixa disponível.

### 4.7 Controle de atenuação simulada

O controle deslizante permite selecionar valores de **0 a 90**, em passos de **5**. Os botões `−` e `+` diminuem ou aumentam o valor em cinco unidades.

O valor escolhido é apresentado na interface como dB para facilitar a demonstração de uma escala de níveis. Entretanto, trata-se de uma escala relativa interna. Não corresponde a dB HL, não é calibrada e não deve ser comparada a resultados de audiometria clínica.

Na curva de demonstração do software, valores maiores do controle produzem maior amplitude digital relativa; valores menores produzem menor amplitude digital relativa. A relação não constitui calibração acústica.

### 4.8 Emissão do tom

O botão central de emissão funciona por pressão contínua:

1. Pressione e mantenha o botão pressionado.
2. O aplicativo sintetiza um tom senoidal na frequência selecionada.
3. Solte o botão para interromper o som.

O tom também pode ser acionado mantendo a tecla **Espaço** pressionada. Ao soltar a tecla, a emissão é interrompida.

O som é criado no momento da utilização. O aplicativo não depende de arquivos WAV ou MP3. A geração utiliza um oscilador senoidal e controles de ganho para iniciar e encerrar o estímulo gradualmente, reduzindo transientes abruptos.

A reprodução de áudio depende de uma ação explícita do usuário, conforme as políticas de autoplay dos navegadores. Se o navegador bloquear o áudio, interaja novamente com a página e confira as permissões e a saída de som.

### 4.9 Audiograma

O painel Audiograma apresenta os pontos registrados em um gráfico:

- eixo horizontal: frequências disponíveis;
- eixo vertical: valores da escala relativa simulada, de 0 a 90;
- orelha direita: círculos `O` vermelhos e linha contínua;
- orelha esquerda: símbolos `X` azuis e linha tracejada;
- linha vertical destacada: frequência atualmente selecionada.

O gráfico conecta os pontos existentes de cada orelha na ordem das frequências. Se houver frequências sem registro entre dois pontos, a linha poderá atravessar esse intervalo visualmente. Isso não significa que o valor ausente tenha sido medido ou estimado.

O desenho se adapta ao tamanho do painel e à densidade de pixels da tela. Ele é uma visualização dos dados inseridos, não uma interpretação clínica.

### 4.10 Registrar resposta

O botão **Registrar resposta (M)** registra o nível atual para a combinação selecionada de orelha e frequência.

Procedimento:

1. Selecione a orelha.
2. Selecione a frequência.
3. Ajuste o nível relativo desejado.
4. Apresente o tom ao participante, mantendo o botão ou a tecla Espaço pressionados.
5. Interrompa o tom.
6. Somente se o participante informar que ouviu, acione **Registrar resposta** ou pressione `M`.

O registro é manual. O software não detecta se a pessoa ouviu o som, não recebe resposta de um botão externo e não determina automaticamente um limiar auditivo.

Se registrar novamente a mesma combinação de orelha e frequência, o novo valor **substitui o anterior**. A aplicação mantém apenas um valor por frequência e orelha.

### 4.11 Desfazer ponto

O botão **Desfazer ponto** remove o registro de maior frequência existente na orelha atualmente selecionada. Ele não desfaz necessariamente a última ação cronológica realizada.

Exemplo: se a orelha selecionada tiver registros em 250, 1.000 e 4.000 Hz, o botão remove o registro de 4.000 Hz. Se não houver pontos para a orelha selecionada, nada será removido.

Para apagar todos os registros das duas orelhas, utilize **Limpar registros**.

### 4.12 Tabela de registros

A tabela apresenta os valores registrados para cada uma das seis frequências, separando as duas orelhas. Um traço (`—`) indica que não existe registro para aquela combinação.

O contador informa quantos dos 12 pontos possíveis estão preenchidos: seis frequências para cada uma das duas orelhas.

### 4.13 Média quadritonal

O aplicativo calcula uma média aritmética simples dos valores registrados em:

- 500 Hz;
- 1.000 Hz;
- 2.000 Hz;
- 4.000 Hz.

A média é apresentada separadamente para cada orelha e só aparece quando as quatro frequências estão preenchidas. Se faltar qualquer um desses quatro registros, a interface mostra `—`.

A média é calculada sobre os valores relativos simulados registrados. Não é uma média tonal clínica e não classifica audição normal ou perda auditiva.

### 4.14 Exportar CSV

O botão **Exportar CSV** gera um arquivo chamado `heimdall-registro-audiometria.csv`.

O arquivo contém:

- orelha;
- frequência em Hz;
- nível de atenuação simulada registrado;
- linhas para as 12 combinações possíveis, mesmo quando não há valor preenchido;
- médias quadritonais, quando disponíveis;
- aviso de que os valores não são calibrados e não representam dB HL clínicos.

O CSV é codificado em UTF-8 com marcador BOM e utiliza ponto e vírgula como separador, favorecendo a abertura em programas de planilha configurados para português. Dependendo do aplicativo utilizado, talvez seja necessário escolher explicitamente a codificação UTF-8 e o delimitador `;` ao importar.

A exportação não envia o arquivo a nenhum servidor. O navegador inicia o download local.

### 4.15 Limpar registros

O botão **Limpar registros** solicita confirmação antes de apagar todos os pontos das duas orelhas. A seleção atual de orelha, frequência e nível é mantida.

Essa operação não possui função de restauração. Se desejar guardar os dados, exporte o CSV antes de limpar.

### 4.16 Novo teste

O botão **Novo teste** solicita confirmação e, após a confirmação:

- interrompe eventual emissão;
- apaga todos os registros das duas orelhas;
- seleciona a orelha direita;
- seleciona 1.000 Hz;
- retorna o nível para 40 dB simulados.

A operação não cria um histórico nem salva automaticamente o teste anterior. Exporte o CSV antes de iniciar um novo teste se precisar manter os dados.

### 4.17 Tema claro e escuro

O botão de tema alterna entre aparência clara e escura. Na primeira utilização, a interface considera a preferência de aparência do sistema operacional. Depois de uma escolha manual, a preferência é armazenada localmente no navegador.

A preferência pode não ser compartilhada entre navegadores, perfis ou dispositivos diferentes. Limpar os dados do site pode removê-la.

---

## 5. Atalhos de teclado

| Tecla | Ação |
|---|---|
| `Espaço` (manter pressionado) | Iniciar emissão do tom; soltar interrompe |
| `↑` | Aumentar o nível em 5 unidades |
| `↓` | Diminuir o nível em 5 unidades |
| `←` | Selecionar a frequência anterior |
| `→` | Selecionar a frequência seguinte |
| `R` | Selecionar orelha direita |
| `L` | Selecionar orelha esquerda |
| `M` | Registrar resposta na combinação atual |

Os atalhos de nível e frequência respeitam os limites disponíveis. A aplicação ignora boa parte dos atalhos quando o foco está em campos de formulário, seletores ou botões, para não interferir na digitação e na navegação normal. A tecla Espaço possui tratamento próprio para emissão.

---

## 6. Fluxo de utilização recomendado

Este roteiro descreve uma demonstração organizada do funcionamento do software; não é um protocolo clínico.

1. Abra o Heimdall e leia o aviso inicial.
2. Marque a confirmação de leitura e inicie a ferramenta.
3. Confira os fones, os canais e o volume baixo do sistema.
4. Escolha a orelha que deseja demonstrar.
5. Escolha uma frequência.
6. Mantenha um nível relativo baixo para a primeira demonstração.
7. Pressione e segure o botão de emissão por um intervalo breve.
8. Solte o botão para interromper o tom.
9. Se a pessoa declarar que ouviu, registre a resposta manualmente.
10. Repita a demonstração em outras frequências, se necessário.
11. Selecione a outra orelha e faça os registros demonstrativos correspondentes.
12. Confira o audiograma e a tabela.
13. Exporte o CSV caso queira guardar os dados inseridos.
14. Antes de começar outra demonstração, exporte o registro anterior e use **Novo teste**.

Não aumente o volume do sistema para tentar obter uma resposta. A ausência de percepção pode decorrer de configurações, limitações do dispositivo, fones, ambiente ou da própria pessoa. O aplicativo não consegue distinguir essas causas.

---

## 7. O que pode dar errado e como resolver

### 7.1 A página mostra erro 404 no GitHub Pages

**Causa provável:** o GitHub Pages não encontra um `index.html` no diretório publicado ou o endereço acessado não corresponde ao tipo de repositório.

**Verificações:**

1. Abra a página principal do repositório no GitHub.
2. Confirme que `index.html` está diretamente na raiz da branch publicada.
3. Se os arquivos estiverem dentro de uma pasta chamada `heimdall-audiometria-web`, mova-os para a raiz ou configure o Pages para publicar a pasta correta, se ela for uma opção disponível no fluxo utilizado.
4. Abra **Settings → Pages**.
5. Em **Build and deployment**, selecione **Deploy from a branch**, escolha `main` e `/ (root)` quando os arquivos estiverem na raiz.
6. Salve e aguarde o GitHub concluir a publicação.
7. Use o endereço exibido na própria página Settings → Pages.

Em um repositório de projeto, o endereço geralmente contém o nome do repositório, por exemplo `https://usuario.github.io/nome-do-repositorio/`. O endereço raiz `https://usuario.github.io/` é reservado ao repositório especial de site de usuário/organização `usuario.github.io`.

### 7.2 A página abre, mas aparece sem estilo

**Causas prováveis:** `styles.css` ausente, caminho incorreto, nome com letras maiúsculas/minúsculas diferentes ou publicação incompleta.

**Solução:**

- confirme que `styles.css` está ao lado de `index.html`;
- confira no HTML se o nome é exatamente `styles.css`;
- aguarde a conclusão do deploy;
- recarregue a página com atualização forçada (`Ctrl + F5` no Windows);
- se houver cache antigo, limpe os dados do site ou teste em uma janela privada.

### 7.3 Botões ou controles não respondem

**Causas prováveis:** `app.js` não foi carregado, erro de JavaScript, versão antiga em cache ou arquivo publicado em caminho incorreto.

**Solução:**

- confirme que `app.js` está ao lado de `index.html`;
- verifique se o nome e a capitalização correspondem exatamente;
- recarregue a página;
- abra as ferramentas de desenvolvedor do navegador e consulte a aba Console para identificar erros;
- confirme que todos os arquivos da mesma versão foram enviados ao repositório.

### 7.4 Não sai som

**Possíveis causas e ações:**

1. **A página ainda não recebeu interação:** clique em iniciar e depois pressione o botão de emissão. Navegadores bloqueiam áudio iniciado automaticamente.
2. **Volume do sistema ou aplicativo no mudo:** confira o mixer de volume e a saída de áudio selecionada. Comece em volume baixo.
3. **Fone desconectado ou saída errada:** reconecte o fone e confira a saída selecionada no sistema operacional.
4. **Navegador sem suporte adequado:** atualize o navegador ou teste outro navegador moderno.
5. **Contexto de áudio suspenso:** interaja novamente com a página e tente emitir o tom.
6. **Dispositivo Bluetooth:** confira se o fone está conectado e selecionado como saída ativa. A troca de dispositivo pode interromper a reprodução.

Não aumente excessivamente o volume para tentar resolver o problema. Se o áudio continuar indisponível, interrompa o teste demonstrativo.

### 7.5 O tom toca, mas sai no lado errado ou nos dois lados

**Possíveis causas:** fones invertidos, fone mono, adaptador defeituoso, configuração de acessibilidade/áudio do sistema, navegador ou dispositivo sem suporte ao direcionamento estéreo.

**Solução:**

- confira as marcações L e R do fone;
- confira se o sistema não está em modo mono;
- teste com outro fone estéreo;
- confira configurações de balanço e acessibilidade do sistema;
- atualize o navegador.

O Heimdall usa panoramização estéreo quando suportada, mas não consegue corrigir hardware mono ou conexões invertidas. Não use a identificação de lado como referência clínica.

### 7.6 A emissão não para ao soltar o botão

O código interrompe o tom ao receber eventos de soltura, cancelamento de ponteiro, perda de captura, perda de foco da janela, ocultação da página ou encerramento da página.

Se o som persistir:

1. solte todas as teclas e botões;
2. mude para outra aba e retorne;
3. pressione `Esc` ou feche a aba se necessário;
4. reduza o volume físico do dispositivo ou desconecte a saída de áudio se não houver interrupção.

Não continue utilizando a aplicação se o controle de interrupção não estiver funcionando corretamente.

### 7.7 O som está muito baixo ou não é percebido

Isso não comprova alteração auditiva. Pode decorrer da escala digital relativa, do nível selecionado, do volume do sistema, da resposta dos fones, do encaixe, da saída selecionada ou de limitações do dispositivo.

Não tente compensar aumentando muito o volume. A aplicação não possui calibração e não consegue assegurar uma intensidade acústica específica.

### 7.8 O audiograma não aparece ou fica em branco

**Causas prováveis:** navegador muito antigo, erro no Canvas, painel ainda sem dimensões calculadas ou falha de JavaScript.

**Solução:**

- atualize o navegador;
- recarregue a página;
- maximize a janela ou altere o tamanho da tela;
- confirme que `app.js` e `styles.css` carregaram;
- verifique o Console do navegador.

O gráfico é desenhado em Canvas e não é um arquivo de imagem separado.

### 7.9 Os pontos parecem ligados mesmo com frequências sem registro

Esse comportamento é esperado: o gráfico conecta os pontos existentes na ordem das frequências. A linha é uma conexão visual entre registros, não uma estimativa dos valores ausentes. Consulte a tabela para identificar exatamente quais frequências foram registradas.

### 7.10 A média quadritonal aparece como traço

A média só é calculada quando há registros em todas as quatro frequências: 500, 1.000, 2.000 e 4.000 Hz, para a mesma orelha. Registre as frequências ausentes para que a média aritmética simulada seja exibida.

### 7.11 Um registro anterior foi substituído

Cada orelha possui apenas um valor por frequência. Ao registrar novamente a mesma frequência na mesma orelha, o valor anterior é substituído. Não há histórico de tentativas nem botão de desfazer cronológico.

Se precisar manter o valor anterior, exporte o CSV antes de registrar novamente.

### 7.12 O botão Desfazer ponto removeu um ponto diferente do esperado

O botão remove o ponto da maior frequência registrada na orelha atualmente selecionada; ele não identifica a última ação cronológica. Confira qual orelha está selecionada e registre novamente os dados necessários.

### 7.13 O arquivo CSV não abre corretamente no Excel ou em outro programa

Ao importar o arquivo, selecione:

- codificação UTF-8;
- delimitador ponto e vírgula (`;`).

Se o programa abrir todos os dados em uma única coluna, utilize o assistente de importação de texto/CSV e escolha o delimitador `;`.

### 7.14 Não consigo instalar o aplicativo

**Verificações:**

- acesse o site por HTTPS;
- utilize um navegador compatível com instalação de PWA;
- confirme que `manifest.json` está na raiz e que seus caminhos de ícones estão corretos;
- confirme que os arquivos PNG existem em `assets/icons/`;
- confirme que o Service Worker foi registrado sem erros;
- procure a opção de instalação no menu do navegador ou na barra de endereço.

A disponibilidade da instalação varia por navegador, sistema operacional e dispositivo. Nem todo navegador apresenta o mesmo botão ou menu.

### 7.15 O aplicativo não funciona offline

**Causas prováveis:** primeiro acesso ainda não foi concluído, Service Worker não foi registrado, cache não foi instalado, site aberto em HTTP inseguro, cache removido ou atualização incompleta.

**Solução:**

1. conecte-se à internet;
2. abra o endereço HTTPS do Heimdall;
3. aguarde a página carregar completamente;
4. recarregue uma vez e confira se o indicador informa `Offline pronto`;
5. teste novamente após desconectar a internet.

Se persistir, abra as ferramentas de desenvolvedor → Application/Aplicativo → Service Workers e confira o estado do registro. Também é possível remover o registro e os dados do site e repetir o primeiro acesso online. Os nomes dos menus variam conforme o navegador.

### 7.16 A versão antiga continua aparecendo depois de uma atualização

O Service Worker utiliza cache para disponibilizar recursos offline. Após uma publicação, o navegador pode continuar exibindo arquivos armazenados anteriormente até concluir a atualização do cache.

**Solução:**

- aguarde alguns instantes e recarregue a página;
- faça uma atualização forçada (`Ctrl + F5`);
- se necessário, limpe os dados do site e recarregue com conexão;
- confirme que todos os arquivos atualizados foram enviados para a branch publicada.

Se uma atualização futura alterar os nomes ou a estrutura dos arquivos essenciais, o nome/versão do cache no `sw.js` deverá ser atualizado pelo responsável técnico.

### 7.17 O tema volta ao padrão

A preferência de tema é armazenada no armazenamento local do navegador. Limpar dados do site, usar outro perfil ou trocar de navegador pode apagar ou não compartilhar essa preferência. Se isso ocorrer, selecione novamente o tema desejado.

---

## 8. Dados, privacidade e armazenamento

- Os pontos registrados permanecem na memória da página enquanto ela está aberta.
- O aplicativo não salva automaticamente os resultados em banco de dados ou `localStorage`.
- Atualizar, fechar ou reiniciar a página pode apagar os pontos não exportados.
- O arquivo CSV é gerado localmente pelo navegador quando o usuário solicita a exportação.
- A preferência de tema é armazenada localmente quando o navegador permite.
- O Service Worker armazena em cache os recursos essenciais da aplicação para uso offline.
- O aplicativo não possui conta de usuário, sincronização, servidor de resultados ou envio automático de registros.

**Recomendação:** exporte o CSV antes de fechar a página, recarregar, limpar os dados ou iniciar outro teste.

---

## 9. Acessibilidade e usabilidade

A interface inclui:

- estrutura semântica com regiões identificadas;
- link para pular diretamente ao conteúdo principal;
- rótulos associados aos controles;
- nomes acessíveis para botões de ícone;
- indicação textual de estados relevantes;
- operação por teclado para as principais ações;
- contraste e temas claro/escuro;
- layout responsivo para diferentes larguras de tela.

A experiência pode variar conforme navegador, leitor de tela, sistema operacional e dispositivo de entrada. Para uma operação acessível, utilize também os recursos de ampliação, contraste e navegação do próprio sistema.

---

## 10. Instalação e publicação no GitHub Pages

### 10.1 Estrutura esperada do repositório

Os arquivos principais devem ficar juntos na raiz publicada:

```text
repositorio/
├── assets/
│   └── icons/
│       ├── icon-192x192.png
│       ├── icon-512x512.png
│       ├── logo.svg
│       └── splash.png
├── MANUAL.md
├── app.js
├── favicon.svg
├── generate-icons.js
├── index.html
├── manifest.json
├── styles.css
└── sw.js
```

O arquivo `index.html` não deve ficar escondido dentro de uma subpasta se o GitHub Pages estiver configurado para publicar a raiz (`/`). O manual pode estar na raiz sem afetar a execução.

### 10.2 Configuração do GitHub Pages

1. Abra o repositório no GitHub.
2. Entre em **Settings**.
3. Abra **Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Escolha a branch `main`.
6. Escolha a pasta `/ (root)`.
7. Clique em **Save**.
8. Aguarde o processo de publicação e abra o endereço apresentado pelo GitHub.

Se o repositório for um repositório de projeto, o endereço geralmente terá o formato `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`. Para um site de usuário/organização, o repositório especial segue o padrão `SEU-USUARIO.github.io`.

### 10.3 Teste local

Com Node.js instalado, uma alternativa simples é iniciar um servidor local na pasta do projeto:

```bash
npx serve .
```

Também é possível utilizar a extensão Live Server no Visual Studio Code. Acesse o endereço local informado pelo servidor, em vez de abrir o HTML diretamente como arquivo.

### 10.4 Gerar ícones

O projeto inclui `generate-icons.js`, um script opcional para gerar os ícones PNG. Com Node.js instalado, execute na pasta do projeto:

```bash
node generate-icons.js
```

O script utiliza módulos nativos do Node.js, sem dependências externas. A geração dos ícones não é necessária para abrir a página se os PNGs fornecidos já estiverem presentes.

---

## 11. Visão técnica resumida

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Estrutura da interface, controles, tabela, gráfico e janela inicial |
| `styles.css` | Layout responsivo, temas, cores, tipografia e estados visuais |
| `app.js` | Estado da aplicação, geração de áudio, atalhos, registros, gráfico, CSV e interações |
| `sw.js` | Registro de cache e atendimento de recursos essenciais offline |
| `manifest.json` | Metadados de instalação da PWA, nome, escopo, ícones e aparência |
| `favicon.svg` | Ícone exibido na aba do navegador |
| `assets/icons/logo.svg` | Símbolo vetorial da identidade Heimdall |
| `assets/icons/icon-192x192.png` | Ícone PWA de 192 × 192 pixels |
| `assets/icons/icon-512x512.png` | Ícone PWA de 512 × 512 pixels |
| `assets/icons/splash.png` | Imagem auxiliar de abertura |
| `generate-icons.js` | Geração local dos ícones PNG com Node.js |
| `MANUAL.md` | Documentação de uso, limitações e solução de problemas |

### 11.1 Como o áudio é produzido

O JavaScript cria um `AudioContext`, um oscilador configurado como seno (`OscillatorNode`) e nós de ganho (`GainNode`). A frequência do oscilador é definida conforme a seleção. A amplitude digital é ajustada por uma curva interna relativa e limitada por uma constante de segurança de processamento. O `StereoPannerNode` é utilizado quando disponível.

O tom é iniciado e encerrado com rampas/alterações graduais de ganho para reduzir estalos. Isso não equivale a uma calibração de transdutor ou de pressão sonora.

### 11.2 Como o modo offline funciona

O Service Worker registra os arquivos essenciais e os armazena no Cache Storage. Em solicitações posteriores, tenta entregar primeiro o recurso em cache; quando não existe uma cópia, tenta buscar pela rede. Se a navegação falhar offline, tenta apresentar o `index.html` armazenado.

O cache não é um sistema de backup dos registros do usuário. Os resultados não são gravados nele.

---

## 12. Limitações funcionais conhecidas

A versão atual possui as seguintes limitações intencionais:

- não possui calibração acústica nem equivalência dB HL;
- não mede dB SPL;
- não mede ruído ambiente;
- não possui condução óssea;
- não implementa mascaramento;
- não possui protocolo automático de apresentação de estímulos;
- não detecta respostas do participante;
- não determina limiares auditivos automaticamente;
- não produz laudo ou classificação clínica;
- não armazena histórico de sessões;
- não sincroniza registros entre dispositivos;
- não possui contas ou banco de dados;
- mantém somente um valor por frequência e orelha;
- não mantém histórico cronológico de alterações;
- a função Desfazer ponto remove o registro da maior frequência da orelha selecionada, e não a última alteração cronológica;
- a média quadritonal é apenas aritmética e calculada com os valores simulados registrados.

Essas limitações devem ser consideradas antes de qualquer demonstração. Não interprete resultados como evidência de saúde ou doença auditiva.

---

## 13. Lista de verificação antes de uma demonstração

- [ ] A página abre sem erro.
- [ ] O endereço utiliza HTTPS.
- [ ] O CSS e os ícones aparecem corretamente.
- [ ] A janela de cuidados pode ser confirmada.
- [ ] Os fones estão conectados e identificados corretamente.
- [ ] O volume do sistema está baixo.
- [ ] O botão de emissão inicia e interrompe o tom corretamente.
- [ ] O som não continua após soltar o botão ou a tecla Espaço.
- [ ] A seleção de orelha e frequência funciona.
- [ ] O registro manual aparece na tabela e no gráfico.
- [ ] A média só aparece quando os quatro valores necessários existem.
- [ ] O CSV é baixado e abre corretamente.
- [ ] Os dados importantes foram exportados antes de fechar a página.
- [ ] A aplicação não está sendo utilizada para diagnóstico ou decisão clínica.

---

## 14. Glossário

**Audiometria tonal:** procedimento que utiliza tons em diferentes frequências para avaliar respostas auditivas, realizado clinicamente com equipamentos e condições apropriados.

**Via aérea:** apresentação de estímulos sonoros por meio de fones ou transdutores posicionados nas orelhas.

**Frequência (Hz):** número de ciclos de uma onda por segundo. Está relacionada à percepção de sons mais graves ou mais agudos.

**Onda senoidal:** forma de onda periódica simples, utilizada pelo Heimdall para sintetizar tons puros.

**dB HL:** escala de nível auditivo utilizada em audiometria clínica, que depende de referências e calibração específicas.

**dB SPL:** medida física do nível de pressão sonora. Não pode ser inferida com precisão a partir do valor relativo mostrado pelo Heimdall.

**Web Audio API:** conjunto de interfaces do navegador para criar, processar e reproduzir áudio.

**PWA:** Progressive Web App, aplicação web que pode oferecer instalação e recursos offline por meio de tecnologias do navegador.

**Service Worker:** script executado pelo navegador em segundo plano, utilizado aqui para armazenar e disponibilizar recursos essenciais em cache.

**CSV:** formato de texto tabular que pode ser aberto ou importado em programas de planilha.

---

## 15. Considerações finais

O Heimdall foi criado para demonstrar a geração de tons, a seleção de frequências, a separação estéreo e a visualização de registros em uma interface web independente. Sua simplicidade de instalação e capacidade offline tornam-no útil para estudo e demonstração de tecnologias web.

A precisão clínica, contudo, não é uma característica deste software. Os níveis são simulados, a saída sonora não é calibrada e as respostas são inseridas manualmente. Para qualquer preocupação relacionada à audição, procure avaliação de um fonoaudiólogo ou serviço de saúde qualificado.

**HEIMDALL — AUDIOMETRIA WEB**  
*Uma ferramenta educacional de escuta e demonstração. Não é um dispositivo médico.*
