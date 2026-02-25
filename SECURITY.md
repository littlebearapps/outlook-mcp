# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities
2. Email [hello@littlebearapps.com](mailto:hello@littlebearapps.com) with details of the vulnerability
3. Include steps to reproduce if possible
4. Allow reasonable time for a fix before public disclosure

## Security Considerations

### Token Storage

- OAuth tokens are stored locally at `~/.outlook-mcp-tokens.json`
- Ensure this file has appropriate permissions (readable only by owner): `chmod 600 ~/.outlook-mcp-tokens.json`
- Never commit token files to version control

### Environment Variables

- Store `OUTLOOK_CLIENT_ID` and `OUTLOOK_CLIENT_SECRET` securely
- Use `.env` files locally (never commit to git)
- Use secure secret management in production

### API Permissions

This server requests the following Microsoft Graph delegated permissions:

- `offline_access` — Token refresh
- `User.Read` — Basic profile
- `Mail.Read`, `Mail.ReadWrite`, `Mail.Send` — Email access
- `Mail.Read.Shared` — Shared mailbox access
- `Calendars.Read`, `Calendars.ReadWrite` — Calendar management
- `Contacts.Read`, `Contacts.ReadWrite` — Contact management
- `MailboxSettings.Read`, `MailboxSettings.ReadWrite` — Settings access
- `People.Read` — People search
- `Place.Read.All` — Meeting room search

Only grant permissions that are necessary for your use case.

## Best Practices

1. Regularly rotate your Azure AD client secret
2. Monitor your Azure AD app for suspicious activity
3. Use the principle of least privilege for permissions
4. Keep dependencies updated (`npm audit`)
5. Review the OAuth scopes and remove any you don't need
