const output = document.getElementById('output');
const input = document.getElementById('cmd');

const commands = {
    'help': 'Доступные команды: help, github, ds, youtube, clear',
    'github': 'Открываю GitHub...',
    'ds': 'Открываю Discord...',
    'youtube': 'Открываю YouTube...'
};

input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const cmd = input.value.toLowerCase().trim();
        const line = document.createElement('div');
        line.className = 'cmd-line';
        line.innerHTML = `<span class="prompt">visitor@1solomon:~$</span> ${input.value}`;
        output.appendChild(line);

        if (commands[cmd]) {
            const res = document.createElement('div');
            res.textContent = commands[cmd];
            output.appendChild(res);
            
            // Логика перенаправления
            if(cmd === 'github') window.open('https://github.com/', '_blank');
            if(cmd === 'ds') window.open('https://discord.com/', '_blank');
            if(cmd === 'youtube') window.open('https://youtube.com/', '_blank');
        } else if (cmd === 'clear') {
            output.innerHTML = '';
        } else if (cmd !== '') {
            const err = document.createElement('div');
            err.textContent = `Команда не найдена: ${cmd}`;
            output.appendChild(err);
        }

        input.value = '';
        window.scrollTo(0, document.body.scrollHeight);
    }
});