// Seleciona os elementos do formulário
const form = document.getElementById('formContato');
const motivo = document.getElementById('motivo');
const assunto = document.getElementById('assunto');
const mensagem = document.getElementById('mensagem');
const contador = document.createElement('span');
const limiteMensagem = 500; // Define o limite máximo de caracteres para a mensagem

// Adiciona o contador visualmente no local desejado
document.addEventListener('DOMContentLoaded', function () {
  // Estiliza o contador para ficar posicionado corretamente
  contador.style.position = 'relative';
  contador.style.display = 'block';
  contador.style.textAlign = 'right';
  contador.style.marginTop = '10px';
  contador.style.color = '#D5C06B';
  contador.style.fontSize = '14px';

  // Adiciona o contador dentro do formulário
  const formWrapper = mensagem.parentNode;
  formWrapper.appendChild(contador);

  // Inicializa o contador com o valor inicial
  contador.textContent = `(${limiteMensagem} caracteres restantes)`;

  // Atualiza o contador dinamicamente conforme o usuário digita
  mensagem.addEventListener('input', () => {
    const restante = limiteMensagem - mensagem.value.length;
    contador.textContent = `(${restante} caracteres restantes)`;
  });
});

// Adiciona um evento ao formulário para impedir envio padrão e realizar validações
form.addEventListener('submit', async function (e) {
  e.preventDefault(); // Impede o envio padrão do formulário

  // Valida se os campos obrigatórios estão preenchidos
  if (!motivo.value) {
    alert('Por favor, selecione o motivo do contato.');
    return;
  }

  if (!assunto.value.trim()) {
    alert('Por favor, preencha o assunto.');
    return;
  }

  if (!mensagem.value.trim()) {
    alert('Por favor, preencha a mensagem.');
    return;
  }

  if (mensagem.value.length > limiteMensagem) {
    alert(`Sua mensagem não pode exceder ${limiteMensagem} caracteres.`);
    return;
  }

  // Cria o objeto com os dados do formulário
  const novaMensagem = {
    motivo: motivo.value,
    assunto: assunto.value,
    mensagem: mensagem.value,
    data: new Date().toISOString(),
  };

  try {
    // Envia a mensagem para a API
    const response = await fetch('https://json-server-mensagens.onrender.com/mensagens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novaMensagem),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Mensagem salva:', data);
      alert('Mensagem enviada com sucesso!');
      form.reset(); // Limpa o formulário após envio
      contador.textContent = `(${limiteMensagem} caracteres restantes)`; // Reseta o contador
    } else {
      const errorText = await response.text();
      console.error('Erro na resposta:', errorText);
      alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
  }
});
