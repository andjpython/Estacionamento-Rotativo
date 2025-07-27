// === Funções do Modal de Login ===
function abrirModalLogin() {
  const modal = document.getElementById('modalLogin');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Previne scroll da página
}

function fecharModalLogin() {
  const modal = document.getElementById('modalLogin');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Restaura scroll da página
  // Limpar campos do formulário
  document.getElementById('matriculaFuncionario').value = '';
  document.getElementById('senhaSupervisor').value = '';
}

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
  const modal = document.getElementById('modalLogin');
  if (event.target === modal) {
    fecharModalLogin();
  }
}

// Fechar modal com tecla ESC
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    fecharModalLogin();
  }
});

// === Login Supervisor ===
const loginSupervisorForm = document.getElementById('loginSupervisorForm');
if (loginSupervisorForm) {
  loginSupervisorForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const senha = document.getElementById('senhaSupervisor').value;
    try {
      const res = await fetch('/login-supervisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha })
      });
      const dados = await res.json();
      alert(dados.mensagem);
      if (res.status === 200 && dados.redirect) {
        marcarSupervisorLogado(); // Marcar supervisor como logado
        fecharModalLogin(); // Fecha o modal após login bem-sucedido
        window.location.href = dados.redirect;
      } else {
        // Limpar campo após erro
        document.getElementById('senhaSupervisor').value = '';
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
      // Limpar campo após erro
      document.getElementById('senhaSupervisor').value = '';
    }
  });
}

// === Login Funcionário ===
const loginFuncionarioForm = document.getElementById('loginFuncionarioForm');
if (loginFuncionarioForm) {
  loginFuncionarioForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const matricula = document.getElementById('matriculaFuncionario').value.trim();
    try {
      const res = await fetch('/login-funcionario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula })
      });
      const dados = await res.json();
      alert(dados.mensagem);
      if (res.status === 200) {
        localStorage.setItem('matriculaLogada', matricula);
        atualizarFuncionariosLogados();
        verificarAcessoSistema(); // Verificar acesso ao sistema após login
        fecharModalLogin(); // Fecha o modal após login bem-sucedido
        // Limpar campo de matrícula
        document.getElementById('matriculaFuncionario').value = '';
      } else {
        // Limpar campo após erro
        document.getElementById('matriculaFuncionario').value = '';
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
      // Limpar campo após erro
      document.getElementById('matriculaFuncionario').value = '';
    }
  });
}

// === Logout Funcionário ===
async function logoutFuncionario() {
  const matricula = localStorage.getItem('matriculaLogada');
  if (!matricula) {
    alert('Nenhum funcionário logado.');
    return;
  }
  
  try {
    const res = await fetch('/logout-funcionario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matricula })
    });
    const dados = await res.json();
    alert(dados.mensagem);
    if (res.status === 200) {
      localStorage.removeItem('matriculaLogada');
      atualizarFuncionariosLogados();
      verificarAcessoSistema(); // Verificar acesso ao sistema após logout
    }
  } catch (err) {
    alert('Erro de conexão com o servidor.');
  }
}

// === Logout Supervisor ===
async function logoutSupervisor() {
  try {
    const res = await fetch('/logout-supervisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const dados = await res.json();
    alert(dados.mensagem);
    if (res.status === 200) {
      marcarSupervisorDeslogado(); // Marcar supervisor como deslogado
      // Redirecionar para página inicial se estiver na área do supervisor
      if (window.location.pathname.includes('supervisor')) {
        window.location.href = '/';
      }
    }
  } catch (err) {
    alert('Erro de conexão com o servidor.');
  }
}

// === Atualizar Funcionários Logados ===
async function atualizarFuncionariosLogados() {
  const lista = document.getElementById('listaFuncionariosLogados');
  const logoutSection = document.getElementById('logoutSection');
  
  if (!lista) return;
  
  lista.innerHTML = '';
  const matricula = localStorage.getItem('matriculaLogada');
  
  if (matricula) {
    const li = document.createElement('li');
    li.textContent = `Matrícula logada: ${matricula}`;
    lista.appendChild(li);
    
    // Mostrar botão de logout
    if (logoutSection) {
      logoutSection.style.display = 'block';
    }
  } else {
    const li = document.createElement('li');
    li.textContent = 'Nenhum funcionário logado.';
    lista.appendChild(li);
    
    // Esconder botão de logout
    if (logoutSection) {
      logoutSection.style.display = 'none';
    }
  }
}
// === Controle de Acesso ao Sistema ===
let supervisorLogado = false;

function verificarAcessoSistema() {
  const matricula = localStorage.getItem('matriculaLogada');
  const sistemaNaoLogado = document.getElementById('sistemaNaoLogado');
  const sistemaLogado = document.getElementById('sistemaLogado');
  
  if (!sistemaNaoLogado || !sistemaLogado) return;
  
  // Verificar se há funcionário logado ou supervisor logado
  if (matricula || supervisorLogado) {
    sistemaNaoLogado.style.display = 'none';
    sistemaLogado.style.display = 'block';
  } else {
    sistemaNaoLogado.style.display = 'block';
    sistemaLogado.style.display = 'none';
  }
}

// Função para marcar supervisor como logado
function marcarSupervisorLogado() {
  supervisorLogado = true;
  verificarAcessoSistema();
}

// Função para marcar supervisor como deslogado
function marcarSupervisorDeslogado() {
  supervisorLogado = false;
  verificarAcessoSistema();
}

// Inicializar estado dos funcionários logados
if (document.getElementById('listaFuncionariosLogados')) {
  atualizarFuncionariosLogados();
}

// === Função para Voltar à Página Anterior ===
function voltarPaginaAnterior() {
  console.log('Função voltarPaginaAnterior() chamada');
  console.log('URL atual:', window.location.href);
  console.log('Referrer:', document.referrer);
  console.log('Histórico length:', window.history.length);
  
  // Verificar se estamos na página /sistema
  if (window.location.pathname === '/sistema') {
    console.log('Estamos em /sistema - indo para página inicial');
    window.location.href = '/';
    return;
  }
  
  // Para outras páginas, usar a lógica original
  // Estratégia 1: Tentar usar window.history.back() se há histórico
  if (window.history.length > 1) {
    console.log('Estratégia 1: Usando window.history.back()');
    window.history.back();
    return;
  }
  
  // Estratégia 2: Se não há histórico, verificar referrer
  if (document.referrer && document.referrer !== window.location.href) {
    console.log('Estratégia 2: Redirecionando para referrer');
    window.location.href = document.referrer;
    return;
  }
  
  // Estratégia 3: Se nada funcionar, ir para página inicial
  console.log('Estratégia 3: Redirecionando para página inicial');
  window.location.href = '/';
}

// === Painel de Horário de Brasília ===
function atualizarHorarioBrasilia() {
  const agora = new Date();
  const utc = agora.getTime() + (agora.getTimezoneOffset() * 60000);
  const brasilia = new Date(utc - (3 * 60 * 60 * 1000));
  const horas = String(brasilia.getHours()).padStart(2, '0');
  const minutos = String(brasilia.getMinutes()).padStart(2, '0');
  const segundos = String(brasilia.getSeconds()).padStart(2, '0');
  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const diaSemana = dias[brasilia.getDay()];
  const dia = brasilia.getDate();
  const mes = meses[brasilia.getMonth()];
  const ano = brasilia.getFullYear();
  const horaDiv = document.getElementById('horaBrasilia');
  const dataDiv = document.getElementById('dataBrasilia');
  if (horaDiv) horaDiv.textContent = `${horas}:${minutos}:${segundos}`;
  if (dataDiv) dataDiv.textContent = `${diaSemana}, ${dia} de ${mes} de ${ano}`;
}
setInterval(atualizarHorarioBrasilia, 1000);
atualizarHorarioBrasilia();

// === Frases Motivacionais ===
(function() {
  const frasesMotivacionais = [
    "🚗 Na vida, assim como no estacionamento rotativo, não dá pra ficar parado por muito tempo. O movimento é necessário.",
    "🚗 Vagas são temporárias, oportunidades também. Aproveite enquanto é sua vez.",
    "🚗 Cada carro tem seu tempo na vaga — respeite o seu, mas esteja pronto pra seguir viagem.",
    "🚗 Se não encontrar uma vaga agora, não desanime. Dê mais uma volta. O que é seu tá reservado.",
    "🚗 Não pare onde não é permitido. Na vida, há lugares que só parecem bons — mas podem te multar de evolução.",
    "🚗 Rode o suficiente pra entender que o melhor lugar nem sempre está logo à frente.",
    "🚗 A vida é um giro contínuo, como no estacionamento rotativo — quem para demais perde o ritmo.",
    "🚗 Vaga fácil pode ter preço alto. Escolha onde parar com sabedoria.",
    "🚗 Hora marcada, tempo contado — valorize o presente antes que expire.",
    "🚗 Estacionar bem exige atenção. Assim como na vida: alinhe, respire e confie.",
    "🚗 Na dúvida, sinalize. Comunicação evita batidas – no trânsito e nas relações.",
    "🚗 Não existe vaga impossível. Existe insistência que vira conquista.",
    "🚗 A zona azul da vida ensina: tudo é passageiro, menos o aprendizado.",
    "🚗 Não encoste no freio só por medo. Às vezes é preciso acelerar com coragem.",
    "🚗 Dê seta para os seus sonhos. O universo entende direção.",
    "🚗 Mesmo com a vaga apertada, um bom condutor sempre se encaixa.",
    "🚗 Rotatividade é sinal de fluxo. Onde há troca, há renovação.",
    "🚗 Respeite o tempo do outro na vaga. Sua hora vai chegar.",
    "🚗 A vaga mais difícil às vezes é a mais segura. Enfrente com técnica e fé.",
    "🚗 Na pressa de estacionar, muitos esquecem de olhar os retrovisores da consciência.",
    "🚗 Quem roda sem parar se perde. Pare. Recalcule. Recomece.",
    "🚗 Assim como num estacionamento lotado, às vezes você precisa ter paciência pra achar o lugar certo.",
    "🚗 Às vezes é melhor dar uma volta a mais do que parar onde não cabe você.",
    "🚗 A vida é como um pátio rotativo: quem respeita o tempo e o espaço cresce com mais leveza.",
    "🚗 Mantenha os faróis ligados. Tem gente se inspirando no seu caminho.",
    "🚗 Estacionamento controlado, vida organizada. Tenha método e clareza em tudo.",
    "🚗 A placa pode dizer 'rotativo', mas sua essência é permanente: nunca pare de tentar.",
    "🚗 Se a vaga parece longe, lembre-se: às vezes é só mais uma curva até o destino ideal.",
    "🚗 Nem todo recuo é derrota. Em algumas manobras, é o único jeito de entrar certo.",
    "🚗 Ao sair da vaga, deixe um bom exemplo pra quem vai ocupar seu lugar."
  ];
  let indiceFraseAtual = 0;
  function trocarFraseMotivacional() {
    const elementoFrase = document.getElementById('fraseAtual');
    if (elementoFrase) {
      elementoFrase.style.opacity = '0';
      setTimeout(() => {
        elementoFrase.textContent = frasesMotivacionais[indiceFraseAtual];
        elementoFrase.style.opacity = '1';
        indiceFraseAtual = (indiceFraseAtual + 1) % frasesMotivacionais.length;
      }, 500);
    }
  }
  document.addEventListener('DOMContentLoaded', function() {
    const elementoFrase = document.getElementById('fraseAtual');
    if (elementoFrase) {
      elementoFrase.textContent = frasesMotivacionais[0];
      elementoFrase.style.opacity = '1';
    }
    setInterval(trocarFraseMotivacional, 10000);
  });
})();

// === Imagens Flutuantes ===
(function() {
  const imagens = [
    'tenda.jpg', 'tenda1.jpg', 'folha.png',
  ];
  const caminhos = imagens.map(img => `/static/imagens/${img}`);
  const animacoes = [
    'flutuar-horizontal', 'flutuar-vertical', 'flutuar-diagonal1', 'flutuar-diagonal2'
  ];
  const container = document.getElementById('imagens-flutuantes');
  function criarImagemFlutuante() {
    const img = document.createElement('img');
    img.src = caminhos[Math.floor(Math.random() * caminhos.length)];
    img.className = 'imagem-flutuante';
    const size = Math.random() * 120 + 60;
    img.style.width = `${size}px`;
    img.style.height = `${size * (Math.random() * 0.4 + 0.8)}px`;
    img.style.top = `${Math.random() * 80}vh`;
    img.style.left = `${Math.random() * 80}vw`;
    const anim = animacoes[Math.floor(Math.random() * animacoes.length)];
    const dur = Math.random() * 12 + 10;
    img.style.animation = `${anim} ${dur}s linear infinite`;
    img.style.zIndex = 0;
    container.appendChild(img);
    setTimeout(() => { if (img.parentNode) img.parentNode.removeChild(img); }, dur * 1000);
  }
  for (let i = 0; i < 7; i++) criarImagemFlutuante();
  setInterval(criarImagemFlutuante, 3000);
})();

// === Animações CSS para imagens flutuantes ===
const style = document.createElement('style');
style.innerHTML = `
@keyframes flutuar-horizontal {
  0% { left: -20vw; }
  100% { left: 110vw; }
}
@keyframes flutuar-vertical {
  0% { top: -20vh; }
  100% { top: 110vh; }
}
@keyframes flutuar-diagonal1 {
  0% { left: -15vw; top: 100vh; }
  100% { left: 110vw; top: -15vh; }
}
@keyframes flutuar-diagonal2 {
  0% { left: 100vw; top: 110vh; }
  100% { left: -15vw; top: -15vh; }
}

/* Animação de borda cintilante com cores do logotipo */
@keyframes borda-cintilante {
  0% { 
    left: -100%; 
    background: linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.4), transparent);
  }
  25% {
    background: linear-gradient(90deg, transparent, rgba(247, 147, 30, 0.4), transparent);
  }
  50% { 
    left: 100%; 
    background: linear-gradient(90deg, transparent, rgba(255, 210, 63, 0.4), transparent);
  }
  75% {
    background: linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.4), transparent);
  }
  100% { 
    left: 100%; 
    background: linear-gradient(90deg, transparent, rgba(247, 147, 30, 0.4), transparent);
  }
}

/* Efeito de brilho nos containers */
#painel-horario, #funcionariosLogadosBox {
  transition: all 0.3s ease;
}

#painel-horario:hover, #funcionariosLogadosBox:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.2);
}
`;
document.head.appendChild(style);

/* ===== GALERIA DE FOTOS PROFISSIONAL ===== */

// Configuração da galeria
const galeriaConfig = {
  imagens: [
    {
      src: '/static/imagens/entrada.avif',
      titulo: 'Entrada Principal',
      descricao: 'Portaria moderna do Recanto das Flores I'
    },
    {
      src: '/static/imagens/entradas.jpg',
      titulo: 'Área de Acesso',
      descricao: 'Vista geral das entradas do condomínio'
    },
    {
      src: '/static/imagens/predio.jpg',
      titulo: 'Torre Residencial',
      descricao: 'Edifício principal com arquitetura contemporânea'
    },
    {
      src: '/static/imagens/predios.png',
      titulo: 'Conjunto Arquitetônico',
      descricao: 'Vista panorâmica dos edifícios'
    },
    {
      src: '/static/imagens/jardim3.webp',
      titulo: 'Área Verde',
      descricao: 'Jardins paisagísticos do empreendimento'
    },
    {
      src: '/static/imagens/quartos.jpg',
      titulo: 'Área Residencial',
      descricao: 'Ambiente interno dos apartamentos'
    },
    {
      src: '/static/imagens/tenda1.jpg',
      titulo: 'Área de Lazer',
      descricao: 'Espaço coberto para eventos e recreação'
    }
  ],
  indiceAtual: 0,
  intervaloPrincipal: null,
  velocidadeAparecer: 4000, // 4 segundos entre cada foto
  velocidadeMovimento: 12000, // 12 segundos para atravessar a tela
  fotosNaTela: []
};

// Inicializar galeria
function iniciarGaleria() {
  const galeriaTrack = document.getElementById('galeriaTrack');
  if (!galeriaTrack) return;

  // Embaralhar imagens para ordem aleatória
  embaralharArray(galeriaConfig.imagens);
  
  // Começar a animação
  galeriaConfig.intervaloPrincipal = setInterval(adicionarNovaFoto, galeriaConfig.velocidadeAparecer);
  
  // Adicionar primeira foto imediatamente
  setTimeout(adicionarNovaFoto, 1000);
}

// Embaralhar array (algoritmo Fisher-Yates)
function embaralharArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Adicionar nova foto à galeria
function adicionarNovaFoto() {
  const galeriaTrack = document.getElementById('galeriaTrack');
  if (!galeriaTrack) return;

  const imagemData = galeriaConfig.imagens[galeriaConfig.indiceAtual];
  
  // Criar elemento da foto
  const fotoDiv = document.createElement('div');
  fotoDiv.className = 'galeria-foto';
  fotoDiv.style.top = Math.random() * 80 + 'px'; // Posição vertical aleatória
  fotoDiv.style.left = '-300px'; // Começar fora da tela
  
  // Criar imagem
  const img = document.createElement('img');
  img.src = imagemData.src;
  img.alt = imagemData.titulo;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  img.style.borderRadius = '12px';
  
  // Criar overlay com informações
  const overlay = document.createElement('div');
  overlay.className = 'galeria-foto-overlay';
  
  const titulo = document.createElement('div');
  titulo.className = 'foto-titulo';
  titulo.textContent = imagemData.titulo;
  
  const descricao = document.createElement('div');
  descricao.className = 'foto-descricao';
  descricao.textContent = imagemData.descricao;
  
  overlay.appendChild(titulo);
  overlay.appendChild(descricao);
  
  fotoDiv.appendChild(img);
  fotoDiv.appendChild(overlay);
  galeriaTrack.appendChild(fotoDiv);
  
  // Armazenar referência
  galeriaConfig.fotosNaTela.push(fotoDiv);
  
  // Animar entrada da foto
  setTimeout(() => {
    fotoDiv.classList.add('ativa');
    animarMovimentoFoto(fotoDiv);
  }, 100);
  
  // Avançar para próxima imagem
  galeriaConfig.indiceAtual = (galeriaConfig.indiceAtual + 1) % galeriaConfig.imagens.length;
  
  // Re-embaralhar quando completar o ciclo
  if (galeriaConfig.indiceAtual === 0) {
    embaralharArray(galeriaConfig.imagens);
  }
}

// Animar movimento da foto da esquerda para direita
function animarMovimentoFoto(fotoElement) {
  const larguraContainer = fotoElement.parentElement.offsetWidth;
  const larguraFoto = fotoElement.offsetWidth;
  const distanciaTotal = larguraContainer + larguraFoto + 200; // Extra para fade out
  
  let posicaoAtual = -300;
  const incremento = distanciaTotal / (galeriaConfig.velocidadeMovimento / 50); // 50ms de intervalo
  
  const intervalMovimento = setInterval(() => {
    posicaoAtual += incremento;
    fotoElement.style.left = posicaoAtual + 'px';
    
    // Fade out quando estiver chegando na direita
    const progresso = posicaoAtual / distanciaTotal;
    if (progresso > 0.7) {
      const opacidade = Math.max(0, 1 - ((progresso - 0.7) / 0.3));
      fotoElement.style.opacity = opacidade;
    }
    
    // Remover quando sair completamente da tela
    if (posicaoAtual >= distanciaTotal) {
      clearInterval(intervalMovimento);
      fotoElement.remove();
      
      // Remover da lista de fotos na tela
      const index = galeriaConfig.fotosNaTela.indexOf(fotoElement);
      if (index > -1) {
        galeriaConfig.fotosNaTela.splice(index, 1);
      }
    }
  }, 50);
}

// Pausar galeria quando não estiver visível
function observarGaleria() {
  const galeriaSection = document.getElementById('galeria');
  if (!galeriaSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!galeriaConfig.intervaloPrincipal) {
          iniciarGaleria();
        }
      } else {
        if (galeriaConfig.intervaloPrincipal) {
          clearInterval(galeriaConfig.intervaloPrincipal);
          galeriaConfig.intervaloPrincipal = null;
        }
      }
    });
  }, { threshold: 0.1 });

  observer.observe(galeriaSection);
}

// Iniciar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  // Aguardar um pouco para garantir que todos elementos estejam carregados
  setTimeout(() => {
    observarGaleria();
    iniciarGaleria();
  }, 2000);
});

// Limpar intervalos quando sair da página
window.addEventListener('beforeunload', function() {
  if (galeriaConfig.intervaloPrincipal) {
    clearInterval(galeriaConfig.intervaloPrincipal);
  }
});
