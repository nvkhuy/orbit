import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const workspaceRoot = process.cwd();
const userHome = os.homedir();

// Source skill folder inside repo (.agents/skills/orbit)
const sourceSkillDir = path.join(workspaceRoot, '.agents', 'skills', 'orbit');

if (!fs.existsSync(sourceSkillDir)) {
  console.error(`❌ Source skill directory not found at ${sourceSkillDir}`);
  process.exit(1);
}

// User machine global skill target locations
const potentialTargets = [
  { name: 'Gemini (config)', agentHome: path.join(userHome, '.gemini'), skillDir: path.join(userHome, '.gemini', 'config', 'skills', 'orbit') },
  { name: 'Gemini (home)', agentHome: path.join(userHome, '.gemini'), skillDir: path.join(userHome, '.gemini', 'skills', 'orbit') },
  { name: 'Claude', agentHome: path.join(userHome, '.claude'), skillDir: path.join(userHome, '.claude', 'skills', 'orbit') },
  { name: 'Codex', agentHome: path.join(userHome, '.codex'), skillDir: path.join(userHome, '.codex', 'skills', 'orbit') },
];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log('🤖 Syncing Orbit agent skills directly to user machine agent directories...\n');

let updatedCount = 0;

for (const target of potentialTargets) {
  if (fs.existsSync(target.agentHome)) {
    copyRecursive(sourceSkillDir, target.skillDir);
    console.log(`  ✓ Updated ${target.name} skill: ${target.skillDir}`);
    updatedCount++;
  }
}

if (updatedCount === 0) {
  for (const target of potentialTargets) {
    copyRecursive(sourceSkillDir, target.skillDir);
    console.log(`  ✓ Created ${target.name} skill: ${target.skillDir}`);
  }
}

console.log('\n✨ Orbit skills updated successfully on your machine!');
