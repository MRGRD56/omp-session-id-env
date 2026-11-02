# omp-session-id-env

OMP extension that keeps the id of the current conversation in the
`OMP_SESSION_ID` environment variable.

Some gateways and providers require a session identifier in request headers.
OMP only adds such headers for a few built-in providers. Config values are
resolved from the environment on every request, so a model can reference
`OMP_SESSION_ID` in `headers` and always send the live conversation id.

## Install

```sh
omp plugin install github:MRGRD56/omp-session-id-env
```

Restart OMP after installing.

## Usage

In `models.yml`, reference the variable from any model header:

```yaml
providers:
  my-provider:
    baseUrl: https://example.com/v1
    api: openai-completions
    apiKey: sk-...
    models:
      - id: some-model
        name: Some Model
        api: openai-completions
        input: [text]
        contextWindow: 128000
        maxTokens: 8192
        headers:
          x-session-id: OMP_SESSION_ID
```

The header is sent with the id of the active conversation, not with the
literal string `OMP_SESSION_ID`.

## Behavior

- The variable is updated on session start, session switch, session branch,
  and at the start of every turn.
- Subagents share the process but never replace the main conversation id.
- Before the first session event the variable holds a random UUID, so early
  requests still carry a valid-looking value.
- No runtime dependencies; the host-provided types are imported as types only.

## Uninstall

```sh
omp plugin uninstall omp-session-id-env
```

## License

MIT
