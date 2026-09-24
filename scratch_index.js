#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const projectName = args[0] || 'my-pradyumn-app';

console.log(`\n🚀 Creating a new pradyumn app in ./${projectName}...`);

try {
  // If package.json already exists in the target dir, we are just applying the template over an existing app
  const projectPath = path.join(process.cwd(), projectName);
  const isExisting = fs.existsSync(path.join(projectPath, 'package.json'));

  if (!isExisting) {
    console.log('\n📦 Scaffolding React + Vite project...');
    execSync(`npm create vite@latest ${projectName} -- --template react-ts`, { stdio: 'inherit' });

    console.log('\n📥 Installing dependencies and pradyumn...');
    execSync(`npm install`, { cwd: projectPath, stdio: 'inherit' });
    execSync(`npm install pradyumn`, { cwd: projectPath, stdio: 'inherit' });
  }

  console.log('\n🎨 Setting up beautiful Pradyumn UI template...');

  // 1. Pradyumn SVG Logo
  const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF3366" />
      <stop offset="100%" stop-color="#FF9933" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="100" height="100" rx="20" fill="url(#grad)" />
  <path d="M30 70 L30 30 L50 30 C 65 30 65 50 50 50 L30 50" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
  <circle cx="65" cy="70" r="6" fill="white" filter="url(#glow)"/>
</svg>`;

  fs.writeFileSync(path.join(projectPath, 'public', 'pradyumn.svg'), svgLogo);
  
  // Clean up Vite stuff
  if (fs.existsSync(path.join(projectPath, 'public', 'vite.svg'))) fs.unlinkSync(path.join(projectPath, 'public', 'vite.svg'));
  if (fs.existsSync(path.join(projectPath, 'src', 'assets', 'react.svg'))) fs.unlinkSync(path.join(projectPath, 'src', 'assets', 'react.svg'));

  // 2. index.html
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/pradyumn.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pradyumn App</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  fs.writeFileSync(path.join(projectPath, 'index.html'), indexHtml);

  // 3. index.css
  const indexCss = `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: 'Outfit', sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
`;
  fs.writeFileSync(path.join(projectPath, 'src', 'index.css'), indexCss);
  fs.writeFileSync(path.join(projectPath, 'src', 'App.css'), '');

  // 4. App.tsx
  const appTsx = `import { useState } from 'react';
import { Rule, Rules, useRule, all, any, not } from 'pradyumn';

function App() {
  const [role, setRole] = useState('user');
  const [banned, setBanned] = useState(false);

  const user = { role, isBanned: banned };

  // Define Pradyumn Rules
  const isAdmin = () => user.role === 'admin';
  const isNotBanned = not(() => user.isBanned);
  const canEdit = all(isAdmin, isNotBanned);

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <div style={styles.header}>
          <img src="/pradyumn.svg" alt="Pradyumn Logo" style={styles.logo} />
          <h1 style={styles.title}>Pradyumn</h1>
        </div>
        <p style={styles.subtitle}>Declarative rules for React applications.</p>
        
        <div style={styles.controlPanel}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Current Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} style={styles.select}>
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Account Status</label>
            <button 
              onClick={() => setBanned(!banned)}
              style={{...styles.toggleBtn, background: banned ? '#ef4444' : '#22c55e'}}
            >
              {banned ? 'Banned' : 'Active'}
            </button>
          </div>
        </div>

        <div style={styles.resultContainer}>
          <Rule 
            when={canEdit} 
            fallback={
              <div style={styles.deniedBox}>
                <span style={styles.icon}>🔒</span> Access Denied. Requires Admin & Active Account.
              </div>
            }
          >
            <div style={styles.successBox}>
              <span style={styles.icon}>✨</span> Access Granted! You can edit this application.
            </div>
          </Rule>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '1200px'
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '24px',
    padding: '3rem',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    marginBottom: '1rem'
  },
  logo: {
    width: '64px',
    height: '64px',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  },
  title: {
    fontSize: '3rem',
    fontWeight: '700',
    background: 'linear-gradient(to right, #FF3366, #FF9933)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  },
  subtitle: {
    textAlign: 'center' as const,
    color: '#94a3b8',
    fontSize: '1.1rem',
    marginBottom: '3rem'
  },
  controlPanel: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '3rem',
    padding: '1.5rem',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.85rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: '#64748b',
    fontWeight: '600'
  },
  select: {
    padding: '0.75rem',
    borderRadius: '8px',
    background: '#1e293b',
    border: '1px solid #334155',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    cursor: 'pointer'
  },
  toggleBtn: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s'
  },
  resultContainer: {
    minHeight: '100px'
  },
  successBox: {
    padding: '1.5rem',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '12px',
    color: '#4ade80',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1.1rem',
    animation: 'slideUp 0.3s ease-out'
  },
  deniedBox: {
    padding: '1.5rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '12px',
    color: '#f87171',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1.1rem',
    animation: 'slideUp 0.3s ease-out'
  },
  icon: {
    fontSize: '1.5rem'
  }
}

// Add simple keyframes
const styleSheet = document.createElement("style");
styleSheet.innerText = \`
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); filter: drop-shadow(0 0 10px rgba(255,51,102,0.5)); }
  }
\`;
document.head.appendChild(styleSheet);

export default App;
`;
  fs.writeFileSync(path.join(projectPath, 'src', 'App.tsx'), appTsx);

  if (!isExisting) {
    console.log('\n✅ Success! Your app is ready.');
    console.log(`\nNext steps:`);
    console.log(`  cd ${projectName}`);
    console.log(`  npm run dev\n`);
  } else {
    console.log('\n✅ Applied Pradyumn UI successfully to existing project.');
  }
} catch (error) {
  console.error('\n❌ Failed to create project.', error.message);
  process.exit(1);
}
