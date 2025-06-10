const pontoForm = document.getElementById('pontoForm');
const nomeInput = document.getElementById('nome');
const dataInput = document.getElementById('data');
const entradaInput = document.getElementById('entrada');
const saidaAlmocoInput = document.getElementById('saidaAlmoco');
const entradaAlmocoInput = document.getElementById('entradaAlmoco');
const saidaInput = document.getElementById('saida');
const folgaInput = document.getElementById('folga');
const feriasInput = document.getElementById('ferias');
const descansoInput = document.getElementById('descanso');
const faltaInput = document.getElementById('falta');
const funcaoInput = document.getElementById('funcao');
const funcaoCheck = document.getElementById('funcaoCheck');
const funcaoTexto = document.getElementById('funcaoTexto');
const tabelaPonto = document.getElementById('tabelaPonto').getElementsByTagName('tbody')[0];
const exportarCSV = document.getElementById('exportarCSV');
const exportarPDF = document.getElementById('exportarPDF');
const enviarEmail = document.getElementById('enviarEmail');

let registros = JSON.parse(localStorage.getItem('registrosPonto') || '[]');

// Exibe o campo de texto da função apenas se o checkbox estiver marcado
funcaoCheck.addEventListener('change', function() {
    funcaoTexto.style.display = funcaoCheck.checked ? 'block' : 'none';
    if (!funcaoCheck.checked) funcaoTexto.value = '';
});

function renderTabela() {
    tabelaPonto.innerHTML = '';
    registros.forEach((reg, idx) => {
        const row = tabelaPonto.insertRow();
        row.insertCell(0).textContent = reg.nome;
        row.insertCell(1).textContent = reg.data;
        if (reg.ferias) {
            const feriasCell = row.insertCell(2);
            feriasCell.colSpan = 4;
            feriasCell.textContent = 'FÉRIAS';
            feriasCell.style.color = '#00b894';
            feriasCell.style.fontWeight = 'bold';
            row.insertCell(3);
            row.insertCell(4);
        } else if (reg.folga) {
            const folgaCell = row.insertCell(2);
            folgaCell.colSpan = 4;
            folgaCell.textContent = 'FOLGA';
            folgaCell.style.color = '#e17055';
            folgaCell.style.fontWeight = 'bold';
            row.insertCell(3);
            row.insertCell(4);
        } else if (reg.descanso) {
            const descansoCell = row.insertCell(2);
            descansoCell.colSpan = 4;
            descansoCell.textContent = 'DESCANSO';
            descansoCell.style.color = '#0984e3';
            descansoCell.style.fontWeight = 'bold';
            row.insertCell(3);
            row.insertCell(4);
        } else if (reg.falta) {
            const faltaCell = row.insertCell(2);
            faltaCell.colSpan = 4;
            faltaCell.textContent = 'FALTA';
            faltaCell.style.color = '#d63031';
            faltaCell.style.fontWeight = 'bold';
            row.insertCell(3);
            row.insertCell(4);
        } else if (reg.funcao) {
            const funcaoCell = row.insertCell(2);
            funcaoCell.colSpan = 4;
            funcaoCell.textContent = 'FUNÇÃO: ' + (reg.funcaoTexto || '');
            funcaoCell.style.color = '#6c5ce7';
            funcaoCell.style.fontWeight = 'bold';
            row.insertCell(3);
            row.insertCell(4);
        } else {
            row.insertCell(2).textContent = reg.entrada || '';
            row.insertCell(3).textContent = reg.saidaAlmoco || '';
            row.insertCell(4).textContent = reg.entradaAlmoco || '';
            row.insertCell(5).textContent = reg.saida || '';
        }
        // Botão Editar
        const editCell = row.insertCell(-1);
        const btn = document.createElement('button');
        btn.textContent = 'Editar';
        btn.style.background = '#fdcb6e';
        btn.style.color = '#222';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.padding = '4px 10px';
        btn.style.cursor = 'pointer';
        btn.onclick = function() { editarRegistro(idx); };
        editCell.appendChild(btn);
        // Botão Excluir
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Excluir';
        delBtn.style.background = '#d63031';
        delBtn.style.color = '#fff';
        delBtn.style.border = 'none';
        delBtn.style.borderRadius = '4px';
        delBtn.style.padding = '4px 10px';
        delBtn.style.cursor = 'pointer';
        delBtn.style.marginLeft = '6px';
        delBtn.onclick = function() { excluirRegistro(idx); };
        editCell.appendChild(delBtn);
    });
}

function editarRegistro(idx) {
    const reg = registros[idx];
    nomeInput.value = reg.nome;
    dataInput.value = reg.data ? reg.data.split('/').reverse().join('-') : '';
    entradaInput.value = reg.entrada || '';
    saidaAlmocoInput.value = reg.saidaAlmoco || '';
    entradaAlmocoInput.value = reg.entradaAlmoco || '';
    saidaInput.value = reg.saida || '';
    folgaInput.checked = !!reg.folga;
    feriasInput.checked = !!reg.ferias;
    descansoInput.checked = !!reg.descanso;
    faltaInput.checked = !!reg.falta;
    funcaoCheck.checked = !!reg.funcao;
    funcaoTexto.style.display = reg.funcao ? 'block' : 'none';
    funcaoTexto.value = reg.funcaoTexto || '';
    pontoForm.setAttribute('data-edit', idx);
}

function excluirRegistro(idx) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        registros.splice(idx, 1);
        localStorage.setItem('registrosPonto', JSON.stringify(registros));
        renderTabela();
    }
}

pontoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = nomeInput.value.trim();
    const data = dataInput.value ? dataInput.value.split('-').reverse().join('/') : '';
    if (!nome || !data) return;
    let idx = pontoForm.getAttribute('data-edit');
    let registro;
    if (idx !== null) {
        registro = registros[idx];
        registro.nome = nome;
        registro.data = data;
    } else {
        registro = registros.find(r => r.nome === nome && r.data === data);
        if (!registro) {
            registro = { nome, data };
            registros.push(registro);
        }
    }
    if (feriasInput.checked) {
        registro.ferias = true;
        registro.folga = false;
        registro.descanso = false;
        registro.falta = false;
        registro.funcao = false;
        registro.funcaoTexto = '';
        registro.entrada = '';
        registro.saidaAlmoco = '';
        registro.entradaAlmoco = '';
        registro.saida = '';
    } else if (folgaInput.checked) {
        registro.folga = true;
        registro.ferias = false;
        registro.descanso = false;
        registro.falta = false;
        registro.funcao = false;
        registro.funcaoTexto = '';
        registro.entrada = '';
        registro.saidaAlmoco = '';
        registro.entradaAlmoco = '';
        registro.saida = '';
    } else if (descansoInput.checked) {
        registro.descanso = true;
        registro.ferias = false;
        registro.folga = false;
        registro.falta = false;
        registro.funcao = false;
        registro.funcaoTexto = '';
        registro.entrada = '';
        registro.saidaAlmoco = '';
        registro.entradaAlmoco = '';
        registro.saida = '';
    } else if (faltaInput.checked) {
        registro.falta = true;
        registro.ferias = false;
        registro.folga = false;
        registro.descanso = false;
        registro.funcao = false;
        registro.funcaoTexto = '';
        registro.entrada = '';
        registro.saidaAlmoco = '';
        registro.entradaAlmoco = '';
        registro.saida = '';
    } else if (funcaoCheck.checked) {
        registro.funcao = true;
        registro.funcaoTexto = funcaoTexto.value.trim();
        registro.ferias = false;
        registro.folga = false;
        registro.descanso = false;
        registro.falta = false;
        registro.entrada = '';
        registro.saidaAlmoco = '';
        registro.entradaAlmoco = '';
        registro.saida = '';
    } else {
        registro.folga = false;
        registro.ferias = false;
        registro.descanso = false;
        registro.falta = false;
        registro.funcao = false;
        registro.funcaoTexto = '';
        if (entradaInput.value) registro.entrada = entradaInput.value;
        if (saidaAlmocoInput.value) registro.saidaAlmoco = saidaAlmocoInput.value;
        if (entradaAlmocoInput.value) registro.entradaAlmoco = entradaAlmocoInput.value;
        if (saidaInput.value) registro.saida = saidaInput.value;
    }
    localStorage.setItem('registrosPonto', JSON.stringify(registros));
    renderTabela();
    nomeInput.value = '';
    dataInput.value = '';
    entradaInput.value = '';
    saidaAlmocoInput.value = '';
    entradaAlmocoInput.value = '';
    saidaInput.value = '';
    folgaInput.checked = false;
    feriasInput.checked = false;
    descansoInput.checked = false;
    faltaInput.checked = false;
    funcaoCheck.checked = false;
    funcaoTexto.value = '';
    funcaoTexto.style.display = 'none';
    pontoForm.removeAttribute('data-edit');
});

exportarCSV.addEventListener('click', function() {
    let csv = 'Nome,Data,Entrada,Saída Almoço,Entrada Almoço,Saída,Folga,Férias,Descanso,Falta\n';
    registros.forEach(reg => {
        csv += `${reg.nome},${reg.data},${reg.entrada || ''},${reg.saidaAlmoco || ''},${reg.entradaAlmoco || ''},${reg.saida || ''},${reg.folga ? 'Sim' : ''},${reg.ferias ? 'Sim' : ''},${reg.descanso ? 'Sim' : ''},${reg.falta ? 'Sim' : ''}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registros_ponto.csv';
    a.click();
    URL.revokeObjectURL(url);
});

exportarPDF.addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Registros de Ponto', 14, 16);
    let y = 28;
    doc.setFontSize(11);
    doc.text('Nome', 14, y);
    doc.text('Data', 44, y);
    doc.text('Entrada', 74, y);
    doc.text('Saída Almoço', 94, y);
    doc.text('Entrada Almoço', 124, y);
    doc.text('Saída', 164, y);
    doc.text('Folga', 184, y);
    doc.text('Férias', 204, y);
    doc.text('Descanso', 224, y);
    doc.text('Falta', 244, y);
    y += 6;
    registros.forEach(reg => {
        doc.text(reg.nome, 14, y);
        doc.text(reg.data, 44, y);
        if (reg.ferias) {
            doc.text('FÉRIAS', 74, y);
        } else if (reg.folga) {
            doc.text('FOLGA', 74, y);
        } else if (reg.descanso) {
            doc.text('DESCANSO', 74, y);
        } else if (reg.falta) {
            doc.text('FALTA', 74, y);
        } else {
            doc.text(reg.entrada || '', 74, y);
            doc.text(reg.saidaAlmoco || '', 94, y);
            doc.text(reg.entradaAlmoco || '', 124, y);
            doc.text(reg.saida || '', 164, y);
        }
        doc.text(reg.folga ? 'Sim' : '', 184, y);
        doc.text(reg.ferias ? 'Sim' : '', 204, y);
        doc.text(reg.descanso ? 'Sim' : '', 224, y);
        doc.text(reg.falta ? 'Sim' : '', 244, y);
        y += 6;
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
    });
    doc.save('registros_ponto.pdf');
});

enviarEmail.addEventListener('click', function() {
    let csv = 'Nome,Data,Entrada,Saída Almoço,Entrada Almoço,Saída,Folga,Férias,Descanso,Falta,Função\n';
    registros.forEach(reg => {
        csv += `${reg.nome},${reg.data},${reg.entrada || ''},${reg.saidaAlmoco || ''},${reg.entradaAlmoco || ''},${reg.saida || ''},${reg.folga ? 'Sim' : ''},${reg.ferias ? 'Sim' : ''},${reg.descanso ? 'Sim' : ''},${reg.falta ? 'Sim' : ''},${reg.funcao ? (reg.funcaoTexto || 'Sim') : ''}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registros_ponto.csv';
    a.click();
    URL.revokeObjectURL(url);
    const subject = encodeURIComponent('Registros de Ponto');
    const body = encodeURIComponent('Segue em anexo o arquivo de registros de ponto.\n\nObs: O arquivo CSV foi baixado automaticamente. Anexe-o manualmente ao e-mail no Gmail.');
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`,'_blank');
});

renderTabela();
