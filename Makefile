.PHONY: run reset test build serve docker-build docker-run docker-stop

run:
	npm run dev

build:
	npm run build

serve:
	npm run preview

docker-build:
	docker build -t orbit .

docker-run:
	docker run -d -p 4321:4321 -v $(PWD)/src/content:/app/src/content --name orbit orbit

docker-stop:
	docker stop orbit && docker rm orbit

reset:
	node scripts/workspace.mjs reset

test:
	node scripts/workspace.mjs test



