.PHONY: help install dev start build preview cli summary test

# Default target
help:
	@echo "🪐 Orbit — Project Management Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make dev         Start Astro local dev server"
	@echo "  make install     Install npm dependencies"
	@echo "  make build       Build production bundle"
	@echo "  make preview     Preview built production app"
	@echo "  make summary     Print workspace summary JSON (CLI)"
	@echo "  make cli         Run Orbit CLI (e.g. make cli ARGS='task list')"
	@echo "  make test        Test build & CLI execution"
	@echo ""

install:
	npm install

dev:
	npm run dev

start: dev

build:
	npm run build

preview:
	npm run preview

summary:
	@node cli/index.js summary

cli:
	@node cli/index.js $(ARGS)

test:
	@echo "Testing CLI..."
	@node cli/index.js summary > /dev/null
	@echo "Building Astro site..."
	npm run build
	@echo "✅ All tests passed!"
