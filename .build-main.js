// Wrapper to launch hvigor with a correctly-formatted PATH (forward slashes + semicolons)
// so that `spawn("java")` resolves the JBR java.exe on Windows.
const { spawn } = require('child_process');

const JAVA_HOME = 'D:/DevEcoJBR';
process.env.JAVA_HOME = JAVA_HOME;
process.env.DEVECO_SDK_HOME = 'E:/DevEcoStudio/DevEco Studio/sdk';
process.env.PATH = JAVA_HOME + '/bin;' + process.env.PATH;

const hvigorw = 'E:/DevEcoStudio/DevEco Studio/tools/hvigor/bin/hvigorw.js';
const args = process.argv.slice(2);
if (args.length === 0) {
  args.push('assembleHap', '--no-daemon', '-p', 'product=default');
}

console.log('[build-main] JAVA_HOME=' + process.env.JAVA_HOME);
console.log('[build-main] launching hvigor with args:', args.join(' '));

const child = spawn(process.execPath, [hvigorw, ...args], { stdio: 'inherit', cwd: 'D:/HuaWeiProgram/kugouMusic' });
child.on('exit', (code) => process.exit(code ?? 1));
child.on('error', (err) => { console.error('[build-main] spawn error:', err); process.exit(1); });
