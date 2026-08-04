.PHONY: run reset test

run:
	npm run dev

reset:
	node scripts/workspace.mjs reset

test:
	node scripts/workspace.mjs test
