#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🧹 Nettoyage des instructions de débogage...');

// Fonction pour nettoyer récursivement un dossier
function cleanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      cleanDirectory(filePath);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'))) {
      cleanFile(filePath);
    }
  });
}

// Fonction pour nettoyer un fichier
function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Supprimer les console.log simples (garder les console.error et console.warn pour les logs importants)
    const originalContent = content;
    
    // Supprimer les console.log mais garder les console.error et console.warn
    content = content.replace(/^\s*console\.log\([^;]*\);\s*$/gm, '');
    content = content.replace(/\s*console\.log\([^;]*\);/g, '');
    
    // Supprimer les debugger statements
    content = content.replace(/^\s*debugger;\s*$/gm, '');
    content = content.replace(/\s*debugger;/g, '');
    
    // Supprimer les lignes vides excessives
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Nettoyé: ${filePath}`);
      modified = true;
    }
    
    return modified;
  } catch (error) {
    console.error(`❌ Erreur lors du nettoyage de ${filePath}:`, error.message);
    return false;
  }
}

// Commencer le nettoyage
try {
  console.log('🔍 Recherche des fichiers à nettoyer...');
  
  // Nettoyer le dossier src
  if (fs.existsSync('src')) {
    cleanDirectory('src');
  }
  
  console.log('✨ Nettoyage terminé !');
  
  // Vérifier s'il reste des console.log
  try {
    const result = execSync('find src/ -name "*.ts" -o -name "*.tsx" | xargs grep -l "console\\.log" | wc -l', { encoding: 'utf8' });
    const remaining = parseInt(result.trim());
    console.log(`📊 Fichiers avec console.log restants: ${remaining}`);
  } catch (e) {
    console.log('📊 Aucun console.log restant trouvé');
  }
  
} catch (error) {
  console.error('❌ Erreur lors du nettoyage:', error.message);
  process.exit(1);
}