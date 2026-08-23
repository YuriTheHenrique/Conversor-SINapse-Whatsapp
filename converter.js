(() => {

    const t = e =>
        (e?.textContent || '')
            .replace(/\s+/g, ' ')
            .trim();

    const vis = e => {
        if (!e) return false;

        const r = e.getBoundingClientRect();
        const s = getComputedStyle(e);

        return (
            r.width > 0 &&
            r.height > 0 &&
            s.display !== 'none' &&
            s.visibility !== 'hidden'
        );
    };

    const copiar = async e => {
        try {
            await navigator.clipboard.writeText(e);
            return true;
        } catch (t) {
            try {
                const r = document.createElement('textarea');

                r.value = e;
                r.style.position = 'fixed';
                r.style.left = '-9999px';
                r.style.top = '0';
                r.style.opacity = '0';

                document.body.appendChild(r);

                r.focus();
                r.select();
                r.setSelectionRange(0, r.value.length);

                e = document.execCommand('copy');

                r.remove();

                return e;

            } catch (e) {
                return false;
            }
        }
    };

    const aviso = (e, t = false) => {

        const r = document.createElement('div');

        r.textContent = e;

        Object.assign(r.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '2147483647',
            background: t ? '#8B0000' : '#08314A',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '6px',
            font: '14px Arial',
            boxShadow: '0 4px 15px rgba(0,0,0,.3)'
        });

        document.body.appendChild(r);

        setTimeout(() => r.remove(), 2500);
    };

    const pedir = e =>
        new Promise(t => {

            const r = document.createElement('div');
            const o = document.createElement('div');
            const n = document.createElement('div');
            const a = document.createElement('input');
            const i = document.createElement('div');

            n.textContent = e;
            i.textContent = 'Digite o valor e pressione Enter';

            a.type = 'text';
            a.inputMode = 'decimal';
            a.autocomplete = 'off';

            Object.assign(r.style, {
                position: 'fixed',
                inset: '0',
                zIndex: '2147483646',
                background: 'rgba(0,0,0,.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            });

            Object.assign(o.style, {
                background: '#fff',
                padding: '24px',
                borderRadius: '8px',
                width: '320px',
                boxShadow: '0 8px 30px rgba(0,0,0,.35)',
                fontFamily: 'Arial'
            });

            Object.assign(n.style, {
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#08314A'
            });

            Object.assign(a.style, {
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px',
                fontSize: '18px',
                border: '1px solid #aaa',
                borderRadius: '5px',
                outline: 'none'
            });

            Object.assign(i.style, {
                fontSize: '12px',
                color: '#666',
                marginTop: '8px'
            });

            o.append(n, a, i);
            r.appendChild(o);
            document.body.appendChild(r);

            a.focus();

            a.addEventListener('keydown', e => {

                if (e.key === 'Enter') {

                    e.preventDefault();

                    e = a.value.trim();

                    if (e) {
                        t(e.replace(',', '.'));
                        r.remove();
                    } else {
                        a.focus();
                        a.style.borderColor = '#8B0000';
                    }
                }
            });
        });


    const headers = [
        ...document.querySelectorAll('#detalhe_solicitacao__modal')
    ].filter(vis);


    if (!headers.length) {
        return aviso(
            'Nenhuma solicitação aberta foi encontrada.',
            true
        );
    }


    const header = headers[headers.length - 1];

    const detalhe = header.closest('.detalhe');

    if (!detalhe) {
        return aviso(
            'Encontrei o cabeçalho, mas não encontrei o bloco .detalhe.',
            true
        );
    }


    const componente = header.parentElement;

    const mensagemEl =
        componente.querySelector('[id$="__mensagem"]') ||
        componente.querySelector('.mensagem-items span');

    const motivoEl =
        componente.querySelector('[id$="__motivo"]');

    const infoEl =
        componente.querySelector('[id$="__adicional"]');


    const mensagem = t(mensagemEl);
    const motivo = t(motivoEl);
    const informacao = t(infoEl);


    if (!mensagem) {
        return aviso(
            'Não encontrei a mensagem da solicitação.',
            true
        );
    }


    let usina =
        (mensagem.split('|')[0] || '')
            .trim()
            .replace(/^Conj\.\s*/i, '')
            .trim()
            .toUpperCase();


    const removerUsina = [
        'MALHADINHA 1',
        'MAURITI',
        'IRECÊ 138 KV',
        'BRÍGIDA',
        'QUINTA 138 KV',
        'CACIMBAS',
        'SOL DO CERRADO'
    ];


    if (usina === 'VISTA ALEGRE - JANAÚBA') {
        usina = 'VISTA ALEGRE';
    }


    const cacimbas = usina === 'CACIMBAS';
    const solCerrado = usina === 'SOL DO CERRADO';

    const mostrarUsina =
        !removerUsina.includes(usina);


    const liberacao =
        /^Malhadinha\s*1\s*\|\s*Liberação Total de Geração Eólica$/i
            .test(mensagem);


    const absorcaoReativa =
        /Maximizar Absorção de Potência Reativa,\s*Mantendo o Modo de Controle\./i
            .test(mensagem);


    const anterior =
        mensagem.match(
            /Ponto de Partida\s*:\s*(\d+(?:[.,]\d+)?)\s*MW/i
        )?.[1]
            ?.replace(',', '.');


    const restricao =
        mensagem.match(
            /Limitar em\s*(\d+(?:[.,]\d+)?)\s*MW/i
        )?.[1]
            ?.replace(',', '.');


    const container = detalhe.parentElement;


    const chat =
        container?.querySelector(
            '#chat_solicitacao__modal__card'
        ) ||
        container?.querySelector(
            'app-ons-chat-solicitacao'
        );


    if (!chat) {
        return aviso(
            'Encontrei a solicitação, mas não encontrei o chat.',
            true
        );
    }


    const criada = [
        ...chat.querySelectorAll('.message-item')
    ].find(
        e =>
            'solicitação criada' ===
            t(e.querySelector('.content')).toLowerCase()
    );


    if (!criada) {
        return aviso(
            'Não encontrei "Solicitação criada".',
            true
        );
    }


    const sender =
        t(criada.querySelector('.sender'));


    const sm =
        sender.match(
            /^(.+?)\s+-\s+(.+?)\s+(?:hoje\s+)?(\d{1,2}:\d{2})/i
        );


    if (!sm) {
        return aviso(
            'Não consegui interpretar o remetente.',
            true
        );
    }


    const nome =
        sm[1]
            .trim()
            .split(/\s+/)[0];


    const centro =
        sm[2].trim();


    const hora =
        sm[3].replace(':', 'h') + 'min';


    (async () => {

        let resultado = '';


        if (liberacao) {

            resultado =
                `Às ${hora} ${centro} (${nome}) solicita o *FIM* da restrição de potência ativa.`;

        }

        else if (absorcaoReativa) {

            if (mostrarUsina) {
                resultado += `*${usina}*\n`;
            }

            resultado +=
                `Às ${hora} ${centro} (${nome}) solicita máxima absorção de potência reativa.`;

        }

        else {

            if (!anterior || !restricao) {
                return aviso(
                    'Não consegui interpretar a mensagem.',
                    true
                );
            }


            if (solCerrado) {

                const gerAnterior =
                    await pedir('Geração anterior');

                const gerAtual =
                    await pedir('Geração atual');


                resultado =
                    `Às ${hora} ${centro} (${nome}) solicita restrição de potência ativa para UFV Sol do Cerrado:
 - Restringir a potência em: ${restricao} MW
 - Valor de Geração: ${gerAtual} MW
Informações antes da Restrição:
 - Set Point anterior: ${anterior} MW
 - Valor de Geração: ${gerAnterior} MW
Motivo: ${motivo || 'Não informado'}`;

            }

            else if (cacimbas) {

                const vento =
                    await pedir('Velocidade do vento');


                if (mostrarUsina) {
                    resultado += `*${usina}*\n`;
                }


                resultado +=
                    `Às ${hora} ${centro} (${nome}) solicita restrição de potência em ${restricao} MW
Geração anterior: ${anterior} MW
Velocidade do vento: ${vento.replace('.', ',')} m/s
Motivo: ${motivo || 'Não informado'}`;

            }

            else {

                if (mostrarUsina) {
                    resultado += `*${usina}*\n`;
                }


                resultado +=
                    `Às ${hora} ${centro} (${nome}) solicita restrição de potência em ${restricao} MW
Geração anterior: ${anterior} MW
Motivo: ${motivo || 'Não informado'}`;


                if (informacao) {
                    resultado +=
                        `\nInformação: ${informacao}`;
                }
            }
        }


        if (
            informacao &&
            !liberacao &&
            solCerrado
        ) {
            resultado +=
                `\nInformação: ${informacao}`;
        }


        const ok =
            await copiar(resultado);


        aviso(
            ok
                ? '✓ Convertido → copiado'
                : 'O navegador bloqueou a cópia automática.',
            !ok
        );

    })();

})();