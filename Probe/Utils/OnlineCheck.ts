export default class OnlineCheck {
  public static async canProbeMonitorWebsiteMonitors(): Promise<boolean> {
    return true;
  }

  public static async canProbeMonitorPingMonitors(): Promise<boolean> {
    return true;
  }

  public static async canProbeMonitorPortMonitors(): Promise<boolean> {
    return true;
  }
}
