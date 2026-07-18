# Aplicaciones móviles y de escritorio de Cast Operations

Cast Operations ofrece dos maneras de utilizar la plataforma fuera del navegador:

- **Aplicaciones móviles nativas** para iOS y Android, publicadas en la **Apple App Store** y en **Google Play**. Estas entregan avisos de guardia, alertas de incidentes y acciones de confirmación directamente a su teléfono.
- **Aplicaciones de escritorio instalables** para Windows, macOS y Linux, distribuidas como una Progressive Web App (PWA) que se instala directamente desde su navegador. Estas le proporcionan al panel de Cast Operations su propia ventana, icono y superficie de notificaciones en su computadora.

## Móvil (Aplicaciones nativas)

La aplicación **Cast Operations On-Call** es una aplicación nativa creada con React Native. Se distribuye a través de las tiendas oficiales, por lo que obtiene actualizaciones automáticas, notificaciones push y desbloqueo biométrico.

- **iOS** — [Descargar en el App Store](https://github.com/autonomy-cloud/operations/releases). Requiere iOS 15.0 o posterior. Consulte la [Guía de instalación para iOS](./ios-installation.md).
- **Android** — [Consíguelo en Google Play](https://github.com/autonomy-cloud/operations/releases). Requiere Android 8.0 o posterior. También está disponible una [descarga directa del APK](https://github.com/autonomy-cloud/operations/releases/latest/download/cast-operations-on-call-android-app.apk) para dispositivos sin Google Play. Consulte la [Guía de instalación para Android](./android-installation.md).

## Escritorio (Progressive Web App)

El panel web de Cast Operations es una Progressive Web App, por lo que puede instalarlo como una aplicación de escritorio desde cualquier navegador moderno sin pasar por ninguna tienda.

- [Instalación en Windows](./windows-installation.md)
- [Instalación en macOS](./macos-installation.md)
- [Instalación en Linux](./linux-installation.md)

### Primeros pasos en escritorio

1. Abra su instancia de Cast Operations en un navegador basado en Chromium (Chrome, Edge) o en Safari.
2. Busque el botón **Instalar** en la barra de direcciones o en **Archivo → Añadir al Dock / Apps → Instalar este sitio como aplicación**.
3. Inicie la aplicación instalada desde el menú Inicio, el Launchpad o el lanzador de aplicaciones.

### Solución de problemas en escritorio

**No aparece la opción de instalación:**

- Asegúrese de estar utilizando un navegador compatible.
- Confirme que su instancia de Cast Operations se sirve mediante HTTPS.
- Actualice la página o borre la caché de su navegador.

**Las notificaciones push no funcionan:**

- Conceda permisos de notificación cuando el navegador se lo solicite.
- Revise la configuración de notificaciones del navegador en su sistema operativo.
- Usuarios autoalojados: confirme que las notificaciones push estén configuradas en su instancia de Cast Operations.

## Soporte

- Problemas específicos de móvil: consulte las guías de instalación para [iOS](./ios-installation.md) o [Android](./android-installation.md).
- Problemas específicos de escritorio: consulte las guías de instalación para [Windows](./windows-installation.md), [macOS](./macos-installation.md) o [Linux](./linux-installation.md).
- Preguntas generales: consulte la página de [Preguntas frecuentes y solución de problemas](./faq-troubleshooting.md).
- Reporte errores o solicite nuevas funciones en nuestro [repositorio de GitHub](https://github.com/autonomy-cloud/operations).
