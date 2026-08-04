#!/usr/bin/env node
import { Command } from 'commander';
import { registerTaskCommands } from './commands/task.js';
import { registerProjectCommands } from './commands/project.js';
import { registerQueryCommands } from './commands/query.js';

const program = new Command();

program
  .name('orbit')
  .description('🪐 Orbit CLI — Serverless, local-first markdown project management tool for Humans & AI Agents')
  .version('1.0.0');

registerTaskCommands(program);
registerProjectCommands(program);
registerQueryCommands(program);

program.parse(process.argv);
