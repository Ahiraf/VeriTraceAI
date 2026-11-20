#!/usr/bin/env node
const { execSync } = require('child_process');

const port = process.env.PORT || 3000;

function freePort(targetPort) {
  try {
    // 1. Try fuser -k
    try {
      execSync(`fuser -k ${targetPort}/tcp 2>/dev/null`, { stdio: 'ignore' });
    } catch {}

    // 2. Try lsof + kill
    try {
      execSync(`lsof -ti :${targetPort} | xargs -r kill -9 2>/dev/null`, { stdio: 'ignore' });
    } catch {}

    // 3. Brief socket release grace period (200ms)
    const start = Date.now();
    while (Date.now() - start < 200) {}
  } catch {
    // Silently continue if permissions or commands unavailable
  }
}

freePort(port);
