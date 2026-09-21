# Security Policy

## Supported Scope

Security reports are relevant to the current application, build tooling, deployment configuration, dependencies, and shared infrastructure.

Historical clock implementations are part of the archive, but security issues affecting their delivery or the production application should still be reported.

## Reporting

Please do not disclose an unpatched security vulnerability in a public GitHub issue.

Use GitHub's private security reporting mechanism for this repository when available. Include:

- a concise description of the issue;
- affected file, route, dependency, or deployment behavior;
- reproduction steps;
- impact;
- any proposed mitigation.

Do not include passwords, access tokens, API keys, personal data, or other secrets in a report.

## Dependency Security

Keep production dependencies current within the project's compatibility constraints. Separate routine patch/minor maintenance from major-version migrations so unrelated changes are not coupled.

## Secrets

Never commit credentials, tokens, private keys, or other secrets. Public artwork and locally bundled media are not secrets and should remain in the established asset directories.

## Response

Security fixes should be narrowly scoped, tested, and documented as appropriate. Do not expose exploit details publicly until a fix or mitigation is available.
