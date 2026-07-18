# Perguntas Frequentes e Solução de Problemas

Perguntas frequentes e soluções para os aplicativos mobile e desktop do Cast Operations.

## Como o Cast Operations distribui seus aplicativos?

- **Mobile (iOS e Android):** O Cast Operations disponibiliza um aplicativo nativo chamado **Cast Operations On-Call**. Ele é publicado na [Apple App Store](https://github.com/autonomy-cloud/operations/releases) e no [Google Play](https://github.com/autonomy-cloud/operations/releases). Um [download de APK](https://github.com/autonomy-cloud/operations/releases/latest/download/cast-operations-on-call-android-app.apk) assinado também está disponível para dispositivos Android sem Google Play.
- **Desktop (Windows, macOS, Linux):** O painel web do Cast Operations é um Progressive Web App (PWA). Você pode instalá-lo como um aplicativo desktop diretamente a partir de um navegador baseado em Chromium ou do Safari — sem necessidade de conta em loja.

## Perguntas Frequentes sobre o Aplicativo Mobile

### Quais dispositivos são compatíveis?

- **iOS:** iPhone ou iPad com iOS 15.0 ou posterior.
- **Android:** Celulares e tablets com Android 8.0 (Oreo) ou posterior.

### O aplicativo é gratuito?

Sim. O aplicativo Cast Operations On-Call é gratuito para instalar. Você faz login com sua conta Cast Operations existente.

### Posso usar o aplicativo com uma instância auto-hospedada do Cast Operations?

Sim. Na primeira execução, o aplicativo pede um **URL do Servidor**. Insira o URL da sua instância auto-hospedada (por exemplo, `https://operations.example.com`). O aplicativo valida que o servidor está acessível antes de permitir que você faça login.

Para notificações push em instâncias auto-hospedadas, siga o guia de [Notificações Push](/docs/self-hosted/push-notifications).

### Como as atualizações são entregues?

- **iOS:** Através da App Store. Habilite as atualizações automáticas em **Ajustes → App Store**, ou atualize manualmente pelo seu perfil na App Store.
- **Android (Google Play):** As atualizações automáticas estão habilitadas por padrão.
- **Android (sideload do APK):** Baixe e instale o APK mais recente a partir do link do GitHub Releases acima.

### Por que não recebo notificações push?

O push mobile usa APNs (iOS) e FCM (Android) via Expo Push. Verifique o seguinte:

1. As notificações estão habilitadas no nível do sistema operacional para o **Cast Operations On-Call**.
2. A otimização de bateria está desativada e a atividade em segundo plano é permitida (Android).
3. Os modos Do Not Disturb ou Foco estão desativados, ou o aplicativo está na lista de exceções.
4. Você está logado — o token de push é registrado no servidor somente após você fazer login.
5. **Apenas para auto-hospedados:** As notificações push estão configuradas na sua instância do Cast Operations. Consulte o guia de [Notificações Push](/docs/self-hosted/push-notifications).

### Os dados no meu celular estão seguros?

- Todo o tráfego da API usa HTTPS.
- Os tokens de acesso e atualização são armazenados no keystore seguro do dispositivo (Keychain no iOS, Keystore no Android).
- Você pode exigir desbloqueio por Face ID / Touch ID / impressão digital pela tela de **Configurações** dentro do aplicativo.

### Posso instalar o aplicativo em vários dispositivos?

Sim. Faça login com a mesma conta Cast Operations em quantos dispositivos precisar. Cada dispositivo recebe suas próprias notificações push.

### Como faço para desinstalar?

- **iOS:** Mantenha o ícone pressionado → **Remover App** → **Apagar App**.
- **Android:** Mantenha o ícone pressionado → **Desinstalar**, ou **Configurações → Apps → Cast Operations On-Call → Desinstalar**.

Sua conta e dados do Cast Operations são armazenados no servidor e não são removidos ao desinstalar o aplicativo.

## Perguntas Frequentes sobre o Aplicativo Desktop (PWA)

### O que é um Progressive Web App (PWA)?

Um Progressive Web App é uma aplicação web que pode ser instalada como um aplicativo desktop nativo. Uma vez instalado, ele é executado em sua própria janela, tem seu próprio ícone no iniciador e pode entregar notificações de desktop — sem passar pela Windows Store, Mac App Store ou qualquer outro canal de distribuição.

### Por que o aplicativo desktop usa tecnologia PWA?

- **Atualizações instantâneas** — o aplicativo permanece sincronizado com sua instância do Cast Operations no momento em que você faz o deploy.
- **Sem necessidade de conta em loja** — instale diretamente a partir de qualquer navegador moderno.
- **Base de código única** — o mesmo painel é executado no Windows, macOS e Linux.

### Por que o botão "Instalar" não aparece?

1. Use um navegador baseado em Chromium (Chrome, Edge, Brave, Arc) ou o Safari (macOS Sonoma+).
2. Confirme que sua instância do Cast Operations é servida via HTTPS com um certificado válido.
3. Limpe o cache do navegador e recarregue.
4. O aplicativo pode já estar instalado — verifique em Aplicativos / Menu Iniciar.

### Como atualizo o aplicativo desktop?

O PWA é atualizado automaticamente sempre que você o abre estando online. Para forçar uma atualização, recarregue a janela com **Ctrl+R** (Windows/Linux) ou **Cmd+R** (macOS).

### Como faço para desinstalar o PWA desktop?

- **Windows:** **Configurações → Aplicativos → Cast Operations → Desinstalar**, ou clique com o botão direito na entrada do Menu Iniciar.
- **macOS:** Arraste o aplicativo de **Aplicativos** para o Lixo, ou clique com o botão direito no ícone do Dock e escolha **Remover**.
- **Linux:** Use a opção de desinstalação do iniciador de aplicativos, ou remova o arquivo `.desktop` correspondente.

## Solução de Problemas

### Problemas no Aplicativo Mobile

**O aplicativo não faz login / "Erro de Rede":**

- Confirme que o **URL do Servidor** está correto e acessível a partir do seu celular.
- Verifique se o seu celular está conectado à internet.
- Para instâncias auto-hospedadas atrás de uma VPN, certifique-se de que a VPN está ativa.

**Notificações push atrasadas ou ausentes (Android):**

- Desative a otimização de bateria: **Configurações → Apps → Cast Operations On-Call → Bateria → Sem restrições**.
- Desative o Economia de Dados para o aplicativo.
- Em dispositivos Samsung, desative **Cuidado com o dispositivo → Bateria → Limites de uso em segundo plano** para o Cast Operations On-Call.

**Notificações push atrasadas ou ausentes (iOS):**

- Evite encerrar o aplicativo forçadamente — o iOS pode pausar a entrega em segundo plano.
- Desative o Modo de Pouca Energia enquanto estiver de plantão.
- Adicione o Cast Operations On-Call à lista de permissões de qualquer modo de Foco ativo.

**Face ID / Touch ID / impressão digital não funcionam:**

- Certifique-se de que a biometria está cadastrada nas configurações do seu sistema operacional.
- Reabilite o desbloqueio biométrico pela tela de **Configurações** dentro do aplicativo Cast Operations On-Call.

### Problemas no Aplicativo Desktop (PWA)

**Botão de instalar ausente:**

- Use um navegador compatível (baseado em Chromium ou Safari no macOS Sonoma+).
- Garanta que a instância do Cast Operations é servida via HTTPS.
- Aguarde a página terminar de carregar e verifique a barra de endereço pelo ícone de instalação.

**Notificações desktop não aparecem:**

- Permita as notificações quando o navegador solicitar.
- Verifique as configurações de notificação do sistema operacional (Assistente de Foco no Windows, Notificações no macOS, daemon de notificações no Linux).
- Para instâncias auto-hospedadas, garanta que a configuração de [Notificações Push](/docs/self-hosted/push-notifications) esteja completa.

**O aplicativo não mostra os dados mais recentes:**

- Recarregue com **Ctrl+R** / **Cmd+R**.
- Feche e reabra a janela.
- Verifique sua conexão de rede.

## Suporte

Se você ainda precisar de ajuda:

- Mobile: consulte os guias de instalação do [iOS](./ios-installation.md) ou do [Android](./android-installation.md).
- Desktop: consulte os guias de instalação do [Windows](./windows-installation.md), [macOS](./macos-installation.md) ou [Linux](./linux-installation.md).
- Abra uma issue no [repositório do Cast Operations no GitHub](https://github.com/autonomy-cloud/operations).
- Entre em contato com o suporte através do seu painel do Cast Operations.
