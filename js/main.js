const fs = {
    'home': {
        'solomon': {
            'readme.md': 'Привет! Я Solomon. Я разработчик. Ищи пароль в /etc/security',
            'links': { 'github': 'https://github.com/Arseniy1002', 'youtube': 'https://youtube.com/@гэндай', 'discord': 'geyday10007' },
            'Downloads': {},
            'Documents': {},
            'Music': {}
        }
    },
    'etc': { 'security': { 'password.txt': 'mysecretpassword123' }, 'issue': 'Welcome to SolomonOS 1.0' },
    'bin': {},
    'var': { 'log': {} },
    'usr': { 'local': {} }
};

let currentPath = ['home', 'solomon'];
let isBanned = localStorage.getItem('bannedUntil');

const output = document.getElementById('output');
const input = document.getElementById('cmd');

function resolvePath(pathArray) {
    let curr = fs;
    for (let part of pathArray) {
        if (curr[part]) curr = curr[part];
        else return null;
    }
    return curr;
}

function print(text) {
    const div = document.createElement('div');
    div.textContent = text;
    output.appendChild(div);
}

function showFastfetch() {
    const art = `
    ███████╗  Solomon@SolomonOS
    ██╔════╝  OS: SolomonLinux 1.0
    ███████╗  Host: Web Browser
    ╚════██║  Shell: qwen-terminal
    ███████╔  Discord: geyday10007
    ╚══════╝  YouTube: @гэндай
    `;
    print(art);
}

function showMyFastfetch() {
    const art = `
 ██████████████████  ████████    arseniy @arseniy-katana17b12ucr
 ██████████████████  ████████    ------------------------------
 ██████████████████  ████████    OS: Manjaro Linux x86_64
 ██████████████████  ████████    Kernel: Linux 6.18.26-1-MANJARO
 ████████            ████████    DE: KDE Plasma 6.6.4
 ████████  ████████  ████████    WM: KWin (Wayland)
 ████████  ████████  ████████    CPU: 12th Gen Intel i5-12450H
 ████████  ████████  ████████    GPU: NVIDIA RTX 3050 Mobile
 ████████  ████████  ████████    Discord: geyday10007
 ████████  ████████  ████████    YouTube: @гэндай
    `;
    print(art);
}

window.onload = () => {
    print("Welcome to SolomonOS v1.0");
    print("Type 'help' to see available commands.");
    input.focus();
};

input.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const val = input.value;
        const parts = val.split(' ');
        const cmd = parts[0];
        const currentPart = parts[parts.length - 1];
        
        const dir = resolvePath(currentPath);
        if (dir) {
            const matches = Object.keys(dir).filter(key => key.startsWith(currentPart));
            if (matches.length === 1) {
                parts[parts.length - 1] = matches[0];
                input.value = parts.join(' ');
            }
        }
    }

    if (e.key === 'Enter') {
        const fullCmd = input.value.trim();
        const parts = fullCmd.split(' ');
        const cmd = parts[0];
        
        if (cmd === 'unban') {
            if (parts[1] === 'secretcode') {
                localStorage.removeItem('bannedUntil');
                isBanned = null;
                print('Access restored.');
            } else print('Invalid secret code.');
            input.value = '';
            return;
        }

        if (isBanned && new Date().getTime() < parseInt(isBanned)) {
            print('Access denied: System corrupted.');
            return;
        }
        
        print(`visitor@1solomon:/${currentPath.join('/')}$ ${fullCmd}`);

        if (cmd === 'ls') {
            const dir = resolvePath(currentPath);
            print(Object.keys(dir || {}).join('  '));
        } else if (cmd === 'cd') {
            if (parts[1] === '..') { if (currentPath.length > 0) currentPath.pop(); }
            else if (parts[1] && resolvePath([...currentPath, parts[1]])) currentPath.push(parts[1]);
            else print('cd: no such directory');
        } else if (cmd === 'cat') {
            const file = resolvePath([...currentPath, parts[1]]);
            if (typeof file === 'string') {
                print(file);
            } else if (file && file.url) {
                print(`Opening ${parts[1]}...`);
                window.open(file.url, '_blank');
            } else if (file && typeof file === 'object') {
                print(`cat: ${parts[1]}: Is a directory`);
            } else {
                print(`cat: ${parts[1]}: No such file or directory`);
            }
        } else if (cmd === 'fastfetch') {
            showFastfetch();
        } else if (cmd === 'myfastfetch') {
            showMyFastfetch();
        } else if (cmd === 'rm') {
            const dir = resolvePath(currentPath);
            if (parts[1] && dir[parts[1]] && typeof dir[parts[1]] === 'string') {
                delete dir[parts[1]];
                print(`Deleted: ${parts[1]}`);
            } else print('rm: cannot remove: No such file');
        } else if (cmd === 'sudo' && parts[1] === 'rm' && parts[2] === '-rf' && parts[3] === '/*') {
            localStorage.setItem('bannedUntil', new Date().getTime() + 600000);
            isBanned = localStorage.getItem('bannedUntil');
            print('CRITICAL: System files deleted. Ban for 10 minutes.');
        } else if (cmd === 'help') {
            print('Available: ls, cd, cat, rm, fastfetch, myfastfetch, unban, help, clear');
        } else if (cmd === 'clear') {
            output.innerHTML = '';
        } else if (cmd !== '') {
            print(`Command not found: ${cmd}`);
        }

        input.value = '';
        window.scrollTo(0, document.body.scrollHeight);
    }
});