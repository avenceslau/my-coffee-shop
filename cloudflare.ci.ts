import { CIWorkflow } from "@repo/ci";
import type { CiParams, CiRunnerStep, WorkflowEvent } from "@repo/ci";

export class CI extends CIWorkflow {
	protected async pipeline(event: WorkflowEvent<CiParams>, step: CiRunnerStep): Promise<void> {
		const p = event.payload;
		const deps = await step.cache(["package-lock.json"]).runner("install", {
			exec: "npm ci",
		});

		await Promise.all([
			deps.runner("format", {
				exec: "npm exec -- oxfmt --check .",
				capture: false,
			}),
			deps.runner("lint", {
				exec: "npm exec -- oxlint .",
				capture: false,
			}),
			deps.runner("typecheck", {
				exec: "npm run 'typecheck'",
				capture: false,
			}),
			deps.runner("build", {
				exec: "npm run 'build'",
				capture: false,
			}),
		]);

		const isBranchPush = p.trigger === "push" && !!p.branch && p.branch !== p.defaultBranch;
		if (p.trigger === "pull_request" || isBranchPush) {
			const preview = await deps
				.build({
					worker: "coffee-shop",
					wrangler: "wrangler.jsonc",
					packageManager: "npm",
				})
				.preview();
			await Promise.all([
				step.testForgeRerun({
					project: "my-coffee-shop",
					runId: "4656045c-b15a-4c85-9f73-3c9e5a4b2ce1",
					url: preview.url,
				}),
				step.delta({
					project: "coffee-shop",
					baselineBranch: p.defaultBranch,
					failOnDiff: true,
					catalog: [
						{
							id: "index",
							title: "index",
							name: "index",
							url: preview.url,
						},
					],
				}),
			]);
			return;
		}

		if (p.trigger !== "push" || p.branch !== p.defaultBranch) {
			return;
		}

		await deps
			.build({
				worker: "coffee-shop",
				wrangler: "wrangler.jsonc",
				packageManager: "npm",
			})
			.release();

		await step.delta({
			project: "coffee-shop",
			baselineBranch: p.defaultBranch,
			failOnDiff: true,
			catalog: [
				{
					id: "index",
					title: "index",
					name: "index",
					url: "https://coffee-shop.avenceslau.workers.dev",
				},
			],
		});

		await step.testForgeRerun({
			project: "my-coffee-shop",
			runId: "4656045c-b15a-4c85-9f73-3c9e5a4b2ce1",
			url: "https://coffee-shop.avenceslau.workers.dev",
		});
	}
}
