# Windows Installation Guide

Install Cast Operations as a desktop application on Windows for comprehensive monitoring and incident management.

## Installation Methods

### Method 1: Microsoft Edge (Recommended)

Edge provides the best Windows PWA integration with native features.

1. **Open Cast Operations in Edge**

   - Launch Microsoft Edge browser
   - Navigate to your Cast Operations instance URL
   - Sign in to your Cast Operations account
   - Wait for complete page loading

2. **Install App**

   - Look for the **install icon** (⊞) in the address bar
   - Click the **"Install Cast Operations"** button
   - Or click the **three-dot menu** → **Apps** → **Install this site as an app**

3. **Customize Installation**

   - **App Name**: Modify if desired (default: Cast Operations)
   - **Start Menu**: Choose whether to add to Start Menu
   - **Taskbar**: Option to pin to taskbar
   - **Desktop**: Create desktop shortcut

4. **Complete Installation**
   - Click **"Install"** to finish
   - Cast Operations will open in its own window
   - Find it in Start Menu under installed apps

### Method 2: Google Chrome

Chrome offers excellent PWA support with rich desktop integration.

1. **Open Cast Operations in Chrome**

   - Launch Google Chrome
   - Go to your Cast Operations instance
   - Ensure you're signed in
   - Allow complete page load

2. **Install via Address Bar**

   - Look for **install icon** (⊞) in address bar
   - Click **"Install Cast Operations"**
   - Or use menu: **three dots** → **More tools** → **Create shortcut**

3. **Installation Options**

   - Check **"Open as window"** for app-like experience
   - Customize app name if desired
   - Click **"Install"** or **"Create"**

4. **Launch App**
   - Find Cast Operations in Windows Start Menu
   - Or launch from desktop shortcut
   - App opens in dedicated window

### Method 3: Firefox

Firefox supports PWA installation with basic desktop integration.

1. **Open Cast Operations in Firefox**

   - Launch Firefox browser
   - Navigate to Cast Operations URL
   - Complete sign-in process

2. **Install PWA**
   - Look for **installation prompt** or banner
   - Or click **menu** → **Install**
   - If available, click **"Add to Home Screen"** equivalent

### Startup Configuration

1. **Auto-Start**: Configure Cast Operations to start with Windows
   - Right-click taskbar → Task Manager → Startup
   - Enable Cast Operations if desired
2. **Default Size**: Set preferred window size and position

### Notification Settings

1. **Windows Notifications**

   - Settings → System → Notifications & actions
   - Find Cast Operations and configure alert preferences
   - Enable banner notifications for incidents

2. **Focus Assist**
   - Configure Do Not Disturb settings
   - Allow Cast Operations critical notifications
   - Set priority levels for different alert types

## Advanced Installation Options

## Troubleshooting

### Installation Issues

**Install button not appearing:**

```
Solutions:
1. Ensure you're using Edge or Chrome (recommended browsers)
2. Verify HTTPS connection to Cast Operations instance
3. Clear browser cache and cookies
4. Update browser to latest version
5. Check if PWA requirements are met on server
6. Disable browser extensions temporarily
```

**Installation fails or crashes:**

```
Solutions:
1. Run browser as administrator
2. Check Windows User Account Control (UAC) settings
3. Ensure sufficient disk space (minimum 100MB)
4. Temporarily disable antivirus software
5. Clear browser data completely
6. Restart Windows and try again
```

**App doesn't appear in Start Menu:**

```
Solutions:
1. Search for "Cast Operations" in Windows search
2. Check if installed under different name
3. Look in "Recently added" apps section
4. Reinstall and ensure "Add to Start Menu" is checked
5. Manually create shortcut if necessary
```

### Notification Problems

**Windows notifications not working:**

```
Solutions:
1. Windows Settings → System → Notifications & actions
2. Enable notifications for Cast Operations
3. Check Focus Assist settings
4. Ensure notification permissions in Cast Operations
5. Test with simple notification first
```

## Uninstallation

### Complete Removal

1. **Windows Settings Method**

   - Settings → Apps → Apps & features
   - Search for "Cast Operations"
   - Click and select "Uninstall"

2. **Browser Method**

   - Open Edge/Chrome
   - Go to edge://apps/ or chrome://apps/
   - Find Cast Operations
   - Click options → Uninstall

3. **Start Menu Method**
   - Right-click Cast Operations in Start Menu
   - Select "Uninstall"
   - Confirm removal

## Updates and Maintenance

### Automatic Updates

- Cast Operations PWA updates automatically when online
- No manual intervention required
- Updates apply immediately upon restart
- Critical patches deployed instantly
