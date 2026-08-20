// Wrapper to launch hvigor with a correctly-formatted PATH (forward slashes)
// so that `spawn("java")` resolves the JBR java.exe on Windows.
const { spawn } = require('child_process');

const JAVA_HOME = 'D:/DevEcoJBR'; // junction -> E:/DevEcoStudio/DevEco Studio/jbr
process.env.JAVA_HOME = JAVA_HOME;
process.env.DEVECO_SDK_HOME = 'E:/DevEcoStudio/DevEco Studio/sdk';
// Prepend java bin dir using forward slashes (node resolves this correctly on Windows).
process.env.PATH = JAVA_HOME + '/bin;' + process.env.PATH;

const hvigorw = 'E:/DevEcoStudio/DevEco Studio/tools/hvigor/bin/hvigorw.js';
const args = process.argv.slice(2);
if (args.length === 0) {
  args.push('assembleHap', '--no-daemon', '-p', 'product=default');
}

console.log('[build-electron] JAVA_HOME=' + process.env.JAVA_HOME);
console.log('[build-electron] DEVECO_SDK_HOME=' + process.env.DEVECO_SDK_HOME);
console.log('[build-electron] launching hvigor with args:', args.join(' '));

const child = spawn(process.execPath, [hvigorw, ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 1));
child.on('error', (err) => { console.error('[build-electron] spawn error:', err); process.exit(1); });
