/**
 * Keeps an environment variable equal to the id of the current conversation.
 *
 * Any model can reference that variable from `headers`, so a provider receives
 * the live session id without a hardcoded value:
 *
 *   headers:
 *     <header-name>: OMP_SESSION_ID
 *
 * The same variable is usable by any other config value resolved from the
 * environment.
 */
import type { ExtensionAPI, ExtensionContext } from "@oh-my-pi/pi-coding-agent";

const ENV_NAME = "OMP_SESSION_ID";

export default function (pi: ExtensionAPI): void {
	// A valid id for requests that precede the first session event.
	process.env[ENV_NAME] ??= crypto.randomUUID();

	const sync = (_event: unknown, ctx: ExtensionContext): void => {
		// Subagents share this process; never let their ids replace the main one.
		if (ctx.agent.kind !== "main") return;
		const sessionId = ctx.sessionManager.getSessionId();
		if (sessionId) process.env[ENV_NAME] = sessionId;
	};

	pi.on("session_start", sync);
	pi.on("session_switch", sync);
	pi.on("session_branch", sync);
	pi.on("turn_start", sync);
}
