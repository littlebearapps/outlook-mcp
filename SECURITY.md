# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities
2. Email the maintainers directly with details of the vulnerability
3. Include steps to reproduce if possible
4. Allow reasonable time for a fix before public disclosure

## Security Considerations

### Token Storage

- OAuth tokens are stored locally at `~/.outlook-mcp-tokens.json`
- Ensure this file has appropriate permissions (readable only by owner)
- Never commit token files to version control

### Environment Variables

- Store `MS_CLIENT_ID` and `MS_CLIENT_SECRET` securely
- Use `.env` files locally (never commit to git)
- Use secure secret management in production

### API Permissions

This server requests the following Microsoft Graph permissions:
- `Mail.ReadWrite` - Read and send emails
- `Calendars.ReadWrite` - Manage calendar events
- `Contacts.ReadWrite` - Manage contacts
- `MailboxSettings.ReadWrite` - Manage mailbox settings

Only grant permissions that are necessary for your use case.

## Best Practices

1. Regularly rotate your Azure AD client secret
2. Monitor your Azure AD app for suspicious activity
3. Use the principle of least privilege for permissions
4. Keep dependencies updated (`npm audit`)
