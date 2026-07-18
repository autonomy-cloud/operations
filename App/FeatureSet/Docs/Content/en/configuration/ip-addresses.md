# IP Address Whitelist for Cast Operations.com

If you are using Cast Operations.com and want to whitelist our IP's for security reasons, you can do so by following the instructions below.

Please whitelist the following IP's in your firewall to allow visca.ai to reach your resources.

{{IP_WHITELIST}}

These IP's can change, we will let you know in advance if this happens.

## Fetch IP Addresses Programmatically

You can also fetch the list of probe egress IP addresses programmatically via the following API endpoint:

```
GET https://visca.ai/ip-whitelist
```

This returns a JSON response:

```json
{
  "ipWhitelist": ["<list of IPs>"]
}
```

You can use this endpoint to keep your firewall whitelist updated automatically.
