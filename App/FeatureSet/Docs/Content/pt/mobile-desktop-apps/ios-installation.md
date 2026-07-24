# Guia de Instalação para iOS

Instale o aplicativo nativo **Cast Operations On-Call** para iOS a partir da Apple App Store no seu iPhone ou iPad.

## Requisitos

- iPhone ou iPad com **iOS 15.0 ou posterior**
- Uma conta Cast Operations ativa (ou o URL da sua instância auto-hospedada do Cast Operations)
- Conexão com a internet para fazer login e receber notificações push

## Instalar pela App Store

1. **Abra a App Store** no seu iPhone ou iPad.
2. Toque na aba **Buscar** e pesquise por **"Cast Operations On-Call"**, ou abra este link no seu dispositivo:
   [https://github.com/autonomy-cloud/operations/releases](https://github.com/autonomy-cloud/operations/releases)
3. Toque em **Obter** e autentique-se com Face ID, Touch ID ou a senha do seu Apple ID.
4. Após a instalação, toque em **Abrir** ou inicie o **Cast Operations On-Call** pela tela inicial.

## Primeira Execução e Login

1. **URL do Servidor**
   - Se você usa o Cast Operations Cloud, mantenha o padrão `https://latticeruntime.com`.
   - Se você é auto-hospedado, insira o URL da sua instância do Cast Operations (ex.: `https://operations.example.com`).
   - O aplicativo verifica se o servidor está acessível antes de prosseguir.
2. **Entrar**
   - Insira o e-mail e a senha da sua conta Cast Operations.
   - Opcionalmente, habilite o **Face ID** ou **Touch ID** para desbloqueios mais rápidos em execuções posteriores.
3. **Permitir Notificações**
   - Quando solicitado, toque em **Permitir** para que o aplicativo possa entregar chamados de plantão, alertas de incidentes e confirmações.

## Notificações Push

As notificações push são entregues através do serviço Apple Push Notification (APNs) via Expo Push. Para garantir que os chamados cheguem até você de forma confiável:

1. Vá em **Ajustes → Notificações → Cast Operations On-Call**.
2. Habilite **Permitir Notificações**, **Sons**, **Selos** e a entrega em **Tela Bloqueada / Banner / Central de Notificações**.
3. Defina o **Agrupamento de Notificações** como **Automático**.
4. Se você estiver de plantão, desative o **Modo de Pouca Energia** durante seu turno e evite encerrar o aplicativo forçadamente — o iOS pode atrasar a entrega em segundo plano se o aplicativo for fechado à força.
5. Adicione o **Cast Operations On-Call** a quaisquer modos de **Foco** nos quais você ainda queira receber chamados.

## Atualizações

O aplicativo é atualizado pela App Store:

- Abra a **App Store**, toque na sua foto de perfil, role até **Cast Operations On-Call** e toque em **Atualizar**.
- Ou habilite **Ajustes → App Store → Atualizações de App** para instalar atualizações automaticamente.

## Desinstalação

1. **Mantenha pressionado** o ícone do **Cast Operations On-Call** na sua tela inicial.
2. Toque em **Remover App → Apagar App**.
3. Confirme tocando em **Apagar**.

Sua conta do Cast Operations e as escalas de plantão são armazenadas no servidor e não são removidas ao desinstalar o aplicativo.

## Solução de Problemas

**A App Store informa que o aplicativo "Não Está Disponível na Sua Região":**

- O aplicativo é publicado na App Store global. Se ele não aparecer na sua região, entre em contato com o [suporte](mailto:support@latticeruntime.com).

**"Erro de Rede" ao fazer login:**

- Verifique se o **URL do Servidor** está correto e acessível a partir do seu dispositivo.
- Se você está em uma rede corporativa ou VPN, certifique-se de que a instância do Cast Operations está acessível.
- Confirme que o servidor é servido via HTTPS com um certificado válido.

**Não está recebendo notificações push:**

- Abra **Ajustes → Notificações → Cast Operations On-Call** e confirme que as notificações estão permitidas.
- Desative o **Do Not Disturb** (Não perturbar) ou adicione o Cast Operations On-Call à lista de permissões do seu modo de Foco ativo.
- Saia da conta e entre novamente para atualizar o token de push registrado no servidor.
- Usuários auto-hospedados: confirme que as notificações push estão configuradas na sua instância do Cast Operations (consulte o guia de [Notificações Push](/docs/self-hosted/push-notifications) para auto-hospedagem).

**Face ID / Touch ID não funcionam:**

- Certifique-se de que a biometria está cadastrada em **Ajustes → Face ID e Código** ou **Ajustes → Touch ID e Código**.
- Reabilite o desbloqueio biométrico pela tela de **Configurações** dentro do aplicativo Cast Operations On-Call.

**O aplicativo trava ao iniciar:**

- Atualize para a versão mais recente pela App Store.
- Reinicie seu dispositivo.
- Se o problema persistir, exclua e reinstale o aplicativo, depois faça login novamente.

## Suporte

Se você ainda precisar de ajuda, entre em contato através do seu painel do Cast Operations ou abra uma issue no nosso [repositório do GitHub](https://github.com/autonomy-cloud/operations).
