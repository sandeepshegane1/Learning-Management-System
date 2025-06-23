#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting SkillHub LMS deployment build...\n');

try {
  // Check if client directory exists
  if (!fs.existsSync('client')) {
    throw new Error('Client directory not found');
  }

  // Check if server directory exists
  if (!fs.existsSync('server')) {
    throw new Error('Server directory not found');
  }

  console.log('📦 Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });

  console.log('📦 Installing server dependencies...');
  execSync('cd server && npm install', { stdio: 'inherit' });

  console.log('🏗️  Building React application...');
  execSync('cd client && npm run build', { stdio: 'inherit' });

  // Check if build was successful
  if (!fs.existsSync('client/dist')) {
    throw new Error('Client build failed - dist directory not found');
  }

  console.log('✅ Build completed successfully!');
  console.log('📁 React app built to: client/dist');
  console.log('🌐 Ready for deployment to Vercel');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
