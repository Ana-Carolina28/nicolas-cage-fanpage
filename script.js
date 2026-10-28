/**
 * ==============================================================================
 * THE CAGEVERSE - SCRIPT PRINCIPAL
 * Design Inovador, Interatividade & Método Shamanic
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================================
  // 1. MOTOR DE ÁUDIO SINTETIZADO (Web Audio API - Zero Dependências Externas)
  // ============================================================================
  class SoundEngine {
    constructor() {
      this.enabled = localStorage.getItem('cage_sound') !== 'false';
      this.audioCtx = null;
    }

    init() {
      if (!this.audioCtx && typeof window.AudioContext !== 'undefined' || typeof window.webkitAudioContext !== 'undefined') {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    playTone(frequency, type = 'sine', duration = 0.15, gainVal = 0.1) {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

        gainNode.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch (e) {
        // Ignora silenciosamente se o áudio do navegador estiver bloqueado
      }
    }

    playClick() {
      this.playTone(587.33, 'triangle', 0.08, 0.06); // Nota D5 sutil
    }

    playThemeSwitch() {
      this.playTone(440, 'sine', 0.1, 0.08);
      setTimeout(() => this.playTone(880, 'sine', 0.2, 0.08), 90);
    }

    playLevelUp() {
      this.playTone(523.25, 'triangle', 0.1, 0.08);
      setTimeout(() => this.playTone(659.25, 'triangle', 0.12, 0.08), 80);
      setTimeout(() => this.playTone(783.99, 'sine', 0.25, 0.1), 160);
    }

    playRageScream() {
      if (!this.enabled) return;
      this.init();
      if (!this.audioCtx) return;
      // Sintetizador dramático de Cage Rage
      try {
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.3);
        osc.frequency.linearRampToValueAtTime(330, this.audioCtx.currentTime + 0.6);

        gainNode.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.65);

        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.65);
      } catch (e) {}
    }

    playCoin() {
      this.playTone(987.77, 'sine', 0.08, 0.09);
      setTimeout(() => this.playTone(1318.51, 'sine', 0.2, 0.12), 60);
    }

    playBeeHit() {
      this.playTone(140, 'sawtooth', 0.25, 0.15);
    }
  }

  const sound = new SoundEngine();

  // Controle de Som na Navbar
  const soundToggleBtn = document.getElementById('sound-toggle');
  const updateSoundUI = () => {
    if (!soundToggleBtn) return;
    if (sound.enabled) {
      soundToggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
      soundToggleBtn.title = "Som ativado (clique para silenciar)";
    } else {
      soundToggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      `;
      soundToggleBtn.title = "Som mudo (clique para ativar)";
    }
  };
  updateSoundUI();

  soundToggleBtn.addEventListener('click', () => {
    sound.enabled = !sound.enabled;
    localStorage.setItem('cage_sound', sound.enabled ? 'true' : 'false');
    updateSoundUI();
    if (sound.enabled) sound.playClick();
  });


  // ============================================================================
  // 2. ALTERNÂNCIA DE MODO DIURNO E NOTURNO COM PERSISTÊNCIA
  // ============================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Carrega preferência do usuário ou padrão dark
  const savedTheme = localStorage.getItem('cage_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
      // Exibe sol para mudar para o dia
      themeToggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      themeToggleBtn.title = "Mudar para Modo Diurno (National Treasure)";
    } else {
      // Exibe lua para mudar para a noite
      themeToggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      themeToggleBtn.title = "Mudar para Modo Noturno (Wild at Heart)";
    }
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlRoot.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlRoot.setAttribute('data-theme', newTheme);
    localStorage.setItem('cage_theme', newTheme);
    updateThemeIcon(newTheme);
    sound.playThemeSwitch();
  });


  // ============================================================================
  // 3. HEADER SCROLL & MENU MOBILE
  // ============================================================================
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    sound.playClick();
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      sound.playClick();
    });
  });


  // ============================================================================
  // 4. O GAGEÔMETRO DE INTENSIDADE CAGE (INTERAÇÃO AVANÇADA)
  // ============================================================================
  const slider = document.getElementById('cage-slider');
  const meterCard = document.getElementById('meter-card');
  const meterTag = document.getElementById('meter-level-tag');
  const meterTitle = document.getElementById('meter-level-title');
  const meterEmoji = document.getElementById('meter-emoji');
  const meterArchetype = document.getElementById('meter-archetype');
  const meterDesc = document.getElementById('meter-desc');
  const meterQuote = document.getElementById('meter-quote');
  const ticks = document.querySelectorAll('.tick-label');
  const btnSoundRage = document.getElementById('btn-sound-rage');
  const aura1 = document.getElementById('ambient-aura-1');

  const cageLevels = {
    1: {
      name: "Zen & Melancolia Poética",
      emoji: "🐖",
      archetype: "O Filósofo Contemplativo (Era Pig & Despedida)",
      desc: "Voz suave, olhar distante e uma profundidade emocional avassaladora que arranca lágrimas silenciosas.",
      quote: '"Não precisamos de muitas coisas para viver. Mas precisamos de amor."',
      color: "#06b6d4"
    },
    2: {
      name: "Charme Excêntrico & Comédia",
      emoji: "🌵",
      archetype: "O Sonhador Imprevisível (Era Arizona Nunca Mais)",
      desc: "Bigode estiloso, raciocínio ilógico e um carisma magnético que transforma absurdos em pura simpatia.",
      quote: '"Às vezes, a vida é difícil. Mas a esperança nunca me abandona."',
      color: "#10b981"
    },
    3: {
      name: "Herói Destemido & Tesouro",
      emoji: "📜",
      archetype: "O Salvador Obstinado (Era National Treasure)",
      desc: "Focado, elegante e determinado a decifrar qualquer enigma milenar antes dos vilões com classe impecável.",
      quote: '"Vou roubar a Declaração de Independência."',
      color: "#f59e0b"
    },
    4: {
      name: "Fúria Hipnótica & Vingança",
      emoji: "💀",
      archetype: "O Motoqueiro Vingador (Era Ghost Rider & Mandy)",
      desc: "Olhos arregalados, jaqueta de couro e uma chama interior que consome inimigos sem piedade.",
      quote: '"Olhe nos meus olhos! Sinta a queimação da sua alma!"',
      color: "#f97316"
    },
    5: {
      name: "CAGE RAGE TOTAL: NOT THE BEES!",
      emoji: "🐝🔥",
      archetype: "O Shaman Cósmico Desencadeado (Era O Homem de Palha)",
      desc: "Distorção temporal! A tela treme, a adrenalina explode e a energia Nouveau Shamanic toma conta da realidade!",
      quote: '"NÃO AS ABELHAS! NÃO AS ABELHAS! AAAAAARGHHH!"',
      color: "#ef4444"
    }
  };

  function updateCageMeter(level) {
    const data = cageLevels[level];
    meterTag.textContent = `NÍVEL ${level} DE 5`;
    meterTitle.textContent = data.name;
    meterEmoji.textContent = data.emoji;
    meterArchetype.textContent = data.archetype;
    meterDesc.textContent = data.desc;
    meterQuote.textContent = data.quote;

    ticks.forEach(tick => {
      if (parseInt(tick.getAttribute('data-level')) === parseInt(level)) {
        tick.classList.add('active');
      } else {
        tick.classList.remove('active');
      }
    });

    if (level === 5) {
      meterCard.classList.add('rage-level-5');
      if (aura1) aura1.style.background = 'radial-gradient(circle, rgba(239, 68, 68, 0.75) 0%, rgba(0,0,0,0) 70%)';
    } else {
      meterCard.classList.remove('rage-level-5');
      if (aura1) aura1.style.background = `radial-gradient(circle, ${data.color}44 0%, rgba(0,0,0,0) 70%)`;
    }
  }

  if (slider) {
    slider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      updateCageMeter(val);
      if (val === 5) {
        sound.playRageScream();
      } else {
        sound.playTone(280 + val * 90, 'sine', 0.1, 0.08);
      }
    });

    ticks.forEach(tick => {
      tick.addEventListener('click', () => {
        const lvl = parseInt(tick.getAttribute('data-level'));
        slider.value = lvl;
        updateCageMeter(lvl);
        sound.playClick();
      });
    });

    btnSoundRage.addEventListener('click', () => {
      slider.value = 5;
      updateCageMeter(5);
      sound.playRageScream();
    });
  }


  // ============================================================================
  // 5. CINETECA CURADA (FILMOGRAFIA COM DADOS RICOS & MODAL)
  // ============================================================================
  const filmsData = [
    {
      id: "leaving-las-vegas",
      title: "Despedida em Las Vegas",
      originalTitle: "Leaving Las Vegas",
      year: 1995,
      director: "Mike Figgis",
      category: "oscar",
      rageLevel: 4,
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Nicolas_Cage_Deauville_2013.jpg",
      artIcon: "🏆",
      tag: "Vencedor do Oscar",
      quote: '"Não sei se comecei a beber porque minha esposa me deixou, ou se ela me deixou porque comecei a beber."',
      synopsis: "Um roteirista de Hollywood decadente viaja para Las Vegas disposto a beber até a morte, mas encontra consolo e conexão pura com uma mulher chamada Sera.",
      trivia: "Cage levou o Oscar de Melhor Ator por essa performance lendária. Para se preparar, ele passou semanas gravando a si mesmo embriagado para estudar a fala arrastada e visitou alcoólatras hospitalizados."
    },
    {
      id: "face-off",
      title: "A Outra Face",
      originalTitle: "Face/Off",
      year: 1997,
      director: "John Woo",
      category: "action",
      rageLevel: 5,
      image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Nicolas_Cage_Comic-Con_2011.jpg",
      artIcon: "🎭",
      tag: "Obra-Prima da Ação",
      quote: '"Eu poderia comer um pêssego por horas... Eu tirei o rosto dele... fora!"',
      synopsis: "Para frustrar um atentado terrorista, um agente do FBI (John Travolta) aceita passar por um transplante facial e assumir a identidade do criminoso psicopata Castor Troy (Nicolas Cage).",
      trivia: "A química entre Cage e John Woo transformou o filme em um marco estético dos anos 90, com balés de tiros, pombas brancas voando e expressões faciais que viraram memes eternos."
    },
    {
      id: "national-treasure",
      title: "A Lenda do Tesouro Perdido",
      originalTitle: "National Treasure",
      year: 2004,
      director: "Jon Turteltaub",
      category: "action",
      rageLevel: 3,
      image: "https://upload.wikimedia.org/wikipedia/commons/7/72/Nicolas_Cage_2010.jpg",
      artIcon: "📜",
      tag: "Clássico Aventura",
      quote: '"Vou roubar a Declaração de Independência."',
      synopsis: "O historiador e criptologista Benjamin Franklin Gates busca um tesouro mítico ocultado pelos Pais Fundadores dos Estados Unidos, seguindo pistas escondidas em monumentos e documentos históricos.",
      trivia: "A frase onde ele anuncia com a maior naturalidade do mundo que vai roubar o documento mais protegido dos EUA é uma das mais icônicas da história do cinema moderno."
    },
    {
      id: "mandy",
      title: "Mandy",
      originalTitle: "Mandy",
      year: 2018,
      director: "Panos Cosmatos",
      category: "cult",
      rageLevel: 5,
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Nicolas_Cage_Deauville_2013.jpg",
      artIcon: "🪓",
      tag: "Psicodelia Brutal",
      quote: '"Você partiu minha camisa favorita! Agora eu vou queimar todo o seu mundo."',
      synopsis: "Nas sombras das montanhas de Shadow Mountain em 1983, a vida pacífica de Red Miller e sua amada Mandy é destruída por um culto sinistro e motoqueiros demoníacos, desencadeando uma vingança psicodélica.",
      trivia: "Contém o famoso duelo de motosserras e a cena inesquecível no banheiro onde Cage, vestindo uma camisa de beisebol ensanguentada, toma vodka direto do gargalo enquanto grita em puro transe emocional."
    },
    {
      id: "pig",
      title: "Pig: A Vingança",
      originalTitle: "Pig",
      year: 2021,
      director: "Michael Sarnoski",
      category: "oscar",
      rageLevel: 1,
      image: "https://upload.wikimedia.org/wikipedia/commons/7/72/Nicolas_Cage_2010.jpg",
      artIcon: "🍄",
      tag: "Aclamação Crítica",
      quote: '"Nós não precisamos de quase nada. Nós nos importamos porque escolhemos nos importar."',
      synopsis: "Um caçador de trufas solitário que vive nas florestas selvagens do Oregon precisa retornar ao passado culinário de Portland após sua amada porca de trufas ser sequestrada.",
      trivia: "Considerada por muitos críticos a atuação mais comovente e sutil de toda a carreira de Nicolas Cage, provando que sua genialidade vai do silêncio contemplativo ao ápice explosivo."
    },
    {
      id: "the-rock",
      title: "A Rocha",
      originalTitle: "The Rock",
      year: 1996,
      director: "Michael Bay",
      category: "action",
      rageLevel: 4,
      image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Nicolas_Cage_Comic-Con_2011.jpg",
      artIcon: "🚀",
      tag: "Blockbuster 90s",
      quote: '"Como é que eu fui parar no meio disso tudo?! Eu sou um químico do FBI, não o Rambo!"',
      synopsis: "Um especialista em armas químicas do FBI relutante une forças com o único prisioneiro que já escapou de Alcatraz (Sean Connery) para deter um general renegado com foguetes letais.",
      trivia: "Cage insistiu para seu personagem Stanley Goodspeed ter uma fixação por colecionar discos de vinil clássicos dos Beatles para humanizar a ação bombástica de Michael Bay."
    },
    {
      id: "wicker-man",
      title: "O Homem de Palha",
      originalTitle: "The Wicker Man",
      year: 2006,
      director: "Neil LaBute",
      category: "cult",
      rageLevel: 5,
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Nicolas_Cage_Deauville_2013.jpg",
      artIcon: "🐝",
      tag: "Meme Supremo",
      quote: '"NÃO AS ABELHAS! NÃO AS ABELHAS! AHHHH! ELAS ESTÃO NOS MEUS OLHOS!"',
      synopsis: "Um xerife viaja a uma ilha remota para investigar o desaparecimento de uma jovem, deparando-se com uma comunidade neopagã com segredos aterrorizantes.",
      trivia: "A cena do capacete com abelhas e Cage vestido com uma fantasia de urso socando habitantes da ilha transformou o filme no maior fenômeno cult da internet nos primórdios do YouTube."
    },
    {
      id: "massive-talent",
      title: "O Peso do Talento",
      originalTitle: "The Unbearable Weight of Massive Talent",
      year: 2022,
      director: "Tom Gormican",
      category: "meta",
      rageLevel: 4,
      image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Nicolas_Cage_Comic-Con_2011.jpg",
      artIcon: "🕶️",
      tag: "Meta-Cinema Ouro",
      quote: '"Nick Cage é um cara legal. Mas NICK F***ING CAGE é um estilo de vida!"',
      synopsis: "Nicolas Cage aceita uma oferta de US$ 1 milhão para comparecer à festa de aniversário de um superfã bilionário (Pedro Pascal), mas é recrutado pela CIA quando o fã se revela um chefe de cartel.",
      trivia: "Cage interpreta a si mesmo e também uma versão mais jovem e alucinada de sua própria consciência nos anos 90 ('Nicky'). A química cômica com Pedro Pascal explodiu no TikTok."
    },
    {
      id: "vampires-kiss",
      title: "O Beijo do Vampiro",
      originalTitle: "Vampire's Kiss",
      year: 1988,
      director: "Robert Bierman",
      category: "cult",
      rageLevel: 5,
      image: "https://upload.wikimedia.org/wikipedia/commons/7/72/Nicolas_Cage_2010.jpg",
      artIcon: "🧛",
      tag: "Origem do Meme",
      quote: '"Eu sou um vampiro! Eu sou um vampiro! Eu sou um vampiro!"',
      synopsis: "Um agente literário arrogante de Nova York começa a acreditar piamente que foi mordido por uma vampira e está se transformando em uma criatura das trevas.",
      trivia: "Foi deste filme que nasceu o clássico meme 'You Don't Say!'. Cage comeu uma barata viva real no set para demonstrar o colapso psíquico do personagem."
    },
    {
      id: "con-air",
      title: "Con Air: A Rota da Fuga",
      originalTitle: "Con Air",
      year: 1997,
      director: "Simon West",
      category: "action",
      rageLevel: 4,
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Nicolas_Cage_Deauville_2013.jpg",
      artIcon: "✈️",
      tag: "Ação Pura",
      quote: '"Coloque o coelhinho de volta na caixa."',
      synopsis: "Cameron Poe, um ex-guarda florestal do exército preso injustamente por defender sua esposa, ganha liberdade condicional e pega carona em um avião que transporta os prisioneiros mais perigosos do país.",
      trivia: "Os cabelos longos balançando ao vento e a fala mansa sulista de Cameron Poe tornaram Con Air um dos filmes mais divertidos e rentáveis de 1997."
    },
    {
      id: "adaptation",
      title: "Adaptação",
      originalTitle: "Adaptation",
      year: 2002,
      director: "Spike Jonze",
      category: "oscar",
      rageLevel: 3,
      image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Nicolas_Cage_Comic-Con_2011.jpg",
      artIcon: "🌿",
      tag: "Indicação ao Oscar",
      quote: '"Você é o que você ama, não o que ama você."',
      synopsis: "Um roteirista neurótico e inseguro (Charlie Kaufman) sofre um bloqueio criativo severo ao tentar adaptar o livro 'O Ladrão de Orquídeas', enquanto seu irmão gêmeo descuidado consegue sucesso imediato.",
      trivia: "Nicolas Cage interpretou ambos os irmãos gêmeos Charlie e Donald Kaufman, recebendo sua segunda indicação ao Oscar de Melhor Ator por uma aula de sutileza e neuroticismo."
    },
    {
      id: "ghost-rider",
      title: "Motoqueiro Fantasma",
      originalTitle: "Ghost Rider",
      year: 2007,
      director: "Mark Steven Johnson",
      category: "cult",
      rageLevel: 4,
      image: "https://upload.wikimedia.org/wikipedia/commons/7/72/Nicolas_Cage_2010.jpg",
      artIcon: "🔥",
      tag: "Anti-Herói Marvel",
      quote: '"Você não pode viver no medo. Não quando você tem fogo correndo nas suas veias."',
      synopsis: "Para salvar a vida de seu pai adotivo, o dublê motociclista Johnny Blaze vende sua alma ao demônio Mefisto e é transformado no vingador sobrenatural que pilota uma moto em chamas.",
      trivia: "Nicolas Cage é tão fã do personagem que ele tem uma tatuagem do Motoqueiro Fantasma no braço, que precisou ser coberta com maquiagem durante as filmagens!"
    }
  ];

  const filmsGrid = document.getElementById('films-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filmModal = document.getElementById('film-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');

  function renderFilms(filter = 'all') {
    if (!filmsGrid) return;
    filmsGrid.innerHTML = '';

    const filtered = filter === 'all' 
      ? filmsData 
      : filmsData.filter(f => f.category === filter);

    filtered.forEach(film => {
      const card = document.createElement('div');
      card.className = 'film-card';

      // Estrelas de Rage
      const rageFlames = '🔥'.repeat(film.rageLevel);

      card.innerHTML = `
        <div class="film-poster-wrap">
          <div class="film-tag-badge">${film.tag}</div>
          <div class="film-rage-score">${rageFlames}</div>
          
          <img 
            src="${film.image}" 
            alt="${film.title}" 
            class="film-poster"
            loading="lazy"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          >
          <div class="film-poster-art" style="display: none; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);">
            <span class="art-icon">${film.artIcon}</span>
            <span class="art-title">${film.title}</span>
          </div>
        </div>
        <div class="film-content">
          <div class="film-meta">
            <span>📅 ${film.year}</span>
            <span>•</span>
            <span>🎬 ${film.director}</span>
          </div>
          <h4 class="film-title">${film.title}</h4>
          <p class="film-synopsis">${film.synopsis}</p>
          <div class="film-quote-preview">${film.quote}</div>
          <button class="btn-card-details" data-id="${film.id}">
            <span>Ver Ficha Completa</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      `;

      filmsGrid.appendChild(card);
    });

    // Eventos nos botões de detalhes
    document.querySelectorAll('.btn-card-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openFilmModal(id);
        sound.playClick();
      });
    });
  }

  function openFilmModal(id) {
    const film = filmsData.find(f => f.id === id);
    if (!film) return;

    modalBody.innerHTML = `
      <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
        <div style="font-size: 3rem;">${film.artIcon}</div>
        <div>
          <span class="section-tag" style="margin: 0;">${film.tag} • ${film.year}</span>
          <h2 style="font-size: 2rem; color: var(--text-primary); margin: 4px 0;">${film.title}</h2>
          <div style="color: var(--text-muted); font-size: 0.9rem;">Título Original: <em>${film.originalTitle}</em> | Direção: <strong>${film.director}</strong></div>
        </div>
      </div>

      <div style="padding: 16px; border-radius: 12px; background: var(--bg-tertiary); border-left: 4px solid var(--cage-gold); margin-bottom: 24px; font-style: italic; font-size: 1.05rem;">
        ${film.quote}
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="color: var(--cage-gold-bright); font-family: var(--font-display); margin-bottom: 8px;">Sinopse</h4>
        <p style="color: var(--text-secondary); line-height: 1.6;">${film.synopsis}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="color: var(--cage-gold-bright); font-family: var(--font-display); margin-bottom: 8px;">Curiosidade dos Bastidores & Método Cage</h4>
        <p style="color: var(--text-secondary); line-height: 1.6;">${film.trivia}</p>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
        <span style="font-size: 0.9rem; font-weight: 700; color: var(--text-muted);">Índice Cage Rage:</span>
        <span style="font-size: 1.2rem;">${'🔥'.repeat(film.rageLevel)} (${film.rageLevel}/5)</span>
      </div>
    `;

    filmModal.classList.add('open');
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      filmModal.classList.remove('open');
      sound.playClick();
    });
  }

  if (filmModal) {
    filmModal.addEventListener('click', (e) => {
      if (e.target === filmModal) {
        filmModal.classList.remove('open');
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderFilms(filter);
      sound.playClick();
    });
  });

  // Render inicial dos filmes
  renderFilms('all');


  // ============================================================================
  // 6. O ORÁCULO DE NICOLAS CAGE (CITAÇÕES CÓSMICAS & WEB SPEECH API)
  // ============================================================================
  const oracleQuotes = [
    {
      text: "Vou roubar a Declaração de Independência.",
      character: "Benjamin Franklin Gates",
      movie: "A Lenda do Tesouro Perdido (2004)"
    },
    {
      text: "NÃO AS ABELHAS! NÃO AS ABELHAS! AHHHHH! ELAS ESTÃO NOS MEUS OLHOS!",
      character: "Edward Malus",
      movie: "O Homem de Palha (2006)"
    },
    {
      text: "Coloque o coelhinho de volta na caixa.",
      character: "Cameron Poe",
      movie: "Con Air: A Rota da Fuga (1997)"
    },
    {
      text: "Eu sou um vampiro! Eu sou um vampiro! Eu sou um vampiro!",
      character: "Peter Loew",
      movie: "O Beijo do Vampiro (1988)"
    },
    {
      text: "Eu tirei o rosto dele... fora!",
      character: "Castor Troy",
      movie: "A Outra Face (1997)"
    },
    {
      text: "Esta jaqueta de pele de cobra é um símbolo da minha individualidade e da minha crença na liberdade pessoal.",
      character: "Sailor Ripley",
      movie: "Coração Selvagem (1990)"
    },
    {
      text: "Para mim, atuar é Nouveau Shamanic. É entrar em um transe sagrado onde tudo que estava reprimido ganha vida.",
      character: "Nicolas Cage",
      movie: "Entrevista Filosófica Real"
    },
    {
      text: "Nós não precisamos de quase nada. Nós nos importamos porque escolhemos nos importar.",
      character: "Robin Feld",
      movie: "Pig (2021)"
    },
    {
      text: "Nick Cage é um cara legal. Mas NICK F***ING CAGE é um estilo de vida inegociável!",
      character: "Nicky / Nicolas Cage",
      movie: "O Peso do Talento (2022)"
    },
    {
      text: "Eu nunca perco o controle. Eu simplesmente convido o caos para jantar comigo.",
      character: "Johnny Blaze",
      movie: "Motoqueiro Fantasma (2007)"
    }
  ];

  let currentQuoteIndex = 0;
  const oracleQuoteText = document.getElementById('oracle-quote-text');
  const oracleCharacter = document.getElementById('oracle-character');
  const oracleMovie = document.getElementById('oracle-movie');
  const btnOracleNext = document.getElementById('btn-oracle-next');
  const btnOracleSpeak = document.getElementById('btn-oracle-speak');
  const btnOracleCopy = document.getElementById('btn-oracle-copy');

  function displayOracleQuote(idx) {
    const q = oracleQuotes[idx];
    oracleQuoteText.style.opacity = '0';
    oracleQuoteText.style.transform = 'translateY(8px)';

    setTimeout(() => {
      oracleQuoteText.textContent = `"${q.text}"`;
      oracleCharacter.textContent = q.character;
      oracleMovie.textContent = q.movie;
      oracleQuoteText.style.opacity = '1';
      oracleQuoteText.style.transform = 'translateY(0)';
    }, 200);
  }

  btnOracleNext.addEventListener('click', () => {
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * oracleQuotes.length);
    } while (nextIdx === currentQuoteIndex);
    currentQuoteIndex = nextIdx;
    displayOracleQuote(currentQuoteIndex);
    sound.playLevelUp();
  });

  // Fala via Web Speech API
  btnOracleSpeak.addEventListener('click', () => {
    sound.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = oracleQuotes[currentQuoteIndex].text;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05;
      utterance.pitch = 1.1; // Tom enérgico e dramático
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Seu navegador não suporta síntese de voz nativa.");
    }
  });

  // Copiar Citação
  btnOracleCopy.addEventListener('click', () => {
    sound.playClick();
    const fullText = `"${oracleQuotes[currentQuoteIndex].text}" — ${oracleQuotes[currentQuoteIndex].character} (${oracleQuotes[currentQuoteIndex].movie})`;
    navigator.clipboard.writeText(fullText).then(() => {
      const origText = btnOracleCopy.textContent;
      btnOracleCopy.textContent = "✅ Copiado!";
      setTimeout(() => {
        btnOracleCopy.textContent = origText;
      }, 2000);
    });
  });


  // ============================================================================
  // 7. QUIZ INTERATIVO: QUAL NICOLAS CAGE HABITA EM VOCÊ?
  // ============================================================================
  const quizQuestions = [
    {
      question: "Qual é a sua primeira atitude quando uma situação sai totalmente do controle?",
      options: [
        { text: "Respiro fundo, analiso os enigmas escondidos e traço um plano impossível para salvar o dia.", type: "treasure" },
        { text: "Forjo um machado místico de metal fundido e parto com fúria cega para resolver as pendências.", type: "rage" },
        { text: "Me retiro para uma cabana silenciosa na floresta com meus ingredientes e minhas memórias.", type: "zen" },
        { text: "Abro um sorriso maníaco, coloco uma jaqueta chamativa e danço no olho do furacão.", type: "chaos" }
      ]
    },
    {
      question: "Se você pudesse adquirir um item extravagante em um leilão secreto, o que escolheria?",
      options: [
        { text: "Um mapa em pergaminho medieval que aponta para um tesouro esquecido pela civilização.", type: "treasure" },
        { text: "Uma motosserra customizada com acabamento cromado e motor de alto torque.", type: "rage" },
        { text: "Um porco trufeiro fiel com faro infalível para as iguarias mais raras da Terra.", type: "zen" },
        { text: "Um crânio autêntico de T-Rex de 67 milhões de anos para colocar no centro da sala.", type: "chaos" }
      ]
    },
    {
      question: "Qual o seu estilo definitivo de jaqueta para enfrentar o destino?",
      options: [
        { text: "Terno sob medida impecável com luvas finas de arquivista histórico.", type: "treasure" },
        { text: "Jaqueta de beisebol com manchas de guerra e cicatrizes de glória cósmica.", type: "rage" },
        { text: "Casaco de lã rústico, desgastado pela chuva e pelo vento do outono.", type: "zen" },
        { text: "Jaqueta de pele de cobra como símbolo vivo da minha individualidade rebelde.", type: "chaos" }
      ]
    },
    {
      question: "Como você resume a sua própria filosofia de vida em uma frase?",
      options: [
        { text: "A verdade e a história nos libertarão se tivermos coragem de procurá-las.", type: "treasure" },
        { text: "Não há paz sem confronto. Eu sou a tempestade.", type: "rage" },
        { text: "As coisas simples são as únicas que realmente permanecem no coração.", type: "zen" },
        { text: "A vida é uma performance de palco sagrada e eu sou o protagonista supremo.", type: "chaos" }
      ]
    }
  ];

  const quizArchetypes = {
    treasure: {
      icon: "📜🗝️",
      title: "O Guardião do Tesouro (Benjamin Gates)",
      desc: "Você é meticuloso, apaixonado por história, códigos e desafios intelectuais. Para você, não existe cofre inviolável ou mistério sem resposta. Quando diz que vai roubar a Declaração de Independência, ninguém duvida!",
      motto: 'Lema: "As maiores riquezas estão escondidas à vista de todos."'
    },
    rage: {
      icon: "🪓🔥",
      title: "O Vingador Cósmico (Era Mandy & Ghost Rider)",
      desc: "Quando cruzam seu caminho, nada no universo pode contê-lo. Você canaliza uma energia vulcânica de superação absoluta, transformando qualquer dor em chamas e triunfo implacável.",
      motto: 'Lema: "Eu sou o fogo que queima a escuridão."'
    },
    zen: {
      icon: "🍄🐖",
      title: "O Poeta das Sombras (Era Pig & Despedida)",
      desc: "Sua alma é profunda, sensível e introspectiva. Você não se importa com a bajulação do mundo exterior; o que move seu coração são conexões verdadeiras, arte autêntica e paz espiritual.",
      motto: 'Lema: "Nós nos importamos porque escolhemos nos importar."'
    },
    chaos: {
      icon: "🎭⚡",
      title: "O Rockstar do Caos (Castor Troy & Sailor Ripley)",
      desc: "Você nasceu para brilhar sem filtros! Irreverente, carismático e dono de uma presença inesquecível, você transforma qualquer momento comum em um espetáculo inesquecível de Nouveau Shamanic.",
      motto: 'Lema: "Minha vida é meu manifesto de liberdade."'
    }
  };

  let currentQuizStep = 0;
  let quizScores = { treasure: 0, rage: 0, zen: 0, chaos: 0 };

  const quizProgressBar = document.getElementById('quiz-progress');
  const quizStepTag = document.getElementById('quiz-step-tag');
  const quizTitle = document.getElementById('quiz-question-title');
  const quizOptionsGrid = document.getElementById('quiz-options-grid');
  const quizBox = document.getElementById('quiz-question-box');
  const quizResultView = document.getElementById('quiz-result-view');
  const resultIcon = document.getElementById('result-icon');
  const resultTitle = document.getElementById('result-title');
  const resultDesc = document.getElementById('result-desc');
  const resultMotto = document.getElementById('result-motto');
  const btnQuizRestart = document.getElementById('btn-quiz-restart');

  function renderQuizQuestion(step) {
    const q = quizQuestions[step];
    quizProgressBar.style.width = `${((step + 1) / quizQuestions.length) * 100}%`;
    quizStepTag.textContent = `Pergunta ${step + 1} de ${quizQuestions.length}`;
    quizTitle.textContent = q.question;
    quizOptionsGrid.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span class="option-letter">${letters[i]}</span>
        <span>${opt.text}</span>
      `;
      btn.addEventListener('click', () => {
        quizScores[opt.type]++;
        sound.playClick();
        if (currentQuizStep + 1 < quizQuestions.length) {
          currentQuizStep++;
          renderQuizQuestion(currentQuizStep);
        } else {
          showQuizResult();
        }
      });
      quizOptionsGrid.appendChild(btn);
    });
  }

  function showQuizResult() {
    quizBox.style.display = 'none';
    quizResultView.style.display = 'block';

    // Encontra o tipo com maior pontuação
    let bestType = 'treasure';
    let maxScore = -1;
    for (const type in quizScores) {
      if (quizScores[type] > maxScore) {
        maxScore = quizScores[type];
        bestType = type;
      }
    }

    const arch = quizArchetypes[bestType];
    resultIcon.textContent = arch.icon;
    resultTitle.textContent = arch.title;
    resultDesc.textContent = arch.desc;
    resultMotto.textContent = arch.motto;

    sound.playLevelUp();
  }

  btnQuizRestart.addEventListener('click', () => {
    currentQuizStep = 0;
    quizScores = { treasure: 0, rage: 0, zen: 0, chaos: 0 };
    quizBox.style.display = 'block';
    quizResultView.style.display = 'none';
    renderQuizQuestion(0);
    sound.playClick();
  });

  renderQuizQuestion(0);


  // ============================================================================
  // 8. MINI-GAME ARCADE: "ROUBO DO TESOURO & O ENXAME DE ABELHAS"
  // ============================================================================
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('game-overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayMsg = document.getElementById('overlay-msg');
  const btnStartGame = document.getElementById('btn-start-game');
  const scoreEl = document.getElementById('game-score');
  const highScoreEl = document.getElementById('game-highscore');
  const livesEl = document.getElementById('game-lives');

  let gameRunning = false;
  let score = 0;
  let lives = 3;
  let highScore = parseInt(localStorage.getItem('cage_game_hs') || '0');
  highScoreEl.textContent = highScore;

  // Jogador: Nicolas Cage
  const player = {
    x: canvas.width / 2,
    y: canvas.height - 40,
    width: 36,
    height: 36,
    speed: 7,
    movingLeft: false,
    movingRight: false
  };

  let scrolls = []; // Pergaminhos (pontos)
  let bees = [];    // Abelhas (perigos)
  let gameLoopId = null;

  function spawnItems() {
    // Spawna pergaminhos de tesouro
    if (Math.random() < 0.04) {
      scrolls.push({
        x: Math.random() * (canvas.width - 24) + 12,
        y: -20,
        size: 20,
        speed: 2 + Math.random() * 2
      });
    }

    // Spawna abelhas
    if (Math.random() < 0.035) {
      bees.push({
        x: Math.random() * (canvas.width - 24) + 12,
        y: -20,
        size: 22,
        speed: 3 + Math.random() * 2.5,
        wobble: Math.random() * Math.PI * 2
      });
    }
  }

  function updateGame() {
    if (!gameRunning) return;

    // Movimentação do Jogador
    if (player.movingLeft && player.x > player.width / 2) {
      player.x -= player.speed;
    }
    if (player.movingRight && player.x < canvas.width - player.width / 2) {
      player.x += player.speed;
    }

    spawnItems();

    // Atualiza Pergaminhos
    for (let i = scrolls.length - 1; i >= 0; i--) {
      const s = scrolls[i];
      s.y += s.speed;

      // Colisão com Jogador
      const dist = Math.hypot(player.x - s.x, player.y - s.y);
      if (dist < player.width / 2 + s.size / 2) {
        score += 100;
        scoreEl.textContent = score;
        sound.playCoin();
        scrolls.splice(i, 1);
        continue;
      }

      if (s.y > canvas.height + 20) {
        scrolls.splice(i, 1);
      }
    }

    // Atualiza Abelhas
    for (let i = bees.length - 1; i >= 0; i--) {
      const b = bees[i];
      b.y += b.speed;
      b.wobble += 0.1;
      b.x += Math.sin(b.wobble) * 2;

      // Colisão com Jogador
      const dist = Math.hypot(player.x - b.x, player.y - b.y);
      if (dist < player.width / 2 + b.size / 2) {
        lives--;
        livesEl.textContent = '❤️'.repeat(Math.max(0, lives));
        sound.playBeeHit();
        bees.splice(i, 1);

        if (lives <= 0) {
          gameOver();
          return;
        }
        continue;
      }

      if (b.y > canvas.height + 20) {
        bees.splice(i, 1);
      }
    }

    drawGame();
    gameLoopId = requestAnimationFrame(updateGame);
  }

  function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo Grid Futurista Sutil
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Desenha Pergaminhos (📜)
    scrolls.forEach(s => {
      ctx.font = '22px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📜', s.x, s.y);
    });

    // Desenha Abelhas (🐝)
    bees.forEach(b => {
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐝', b.x, b.y);
    });

    // Desenha Nicolas Cage (Avatar com Óculos)
    ctx.save();
    ctx.translate(player.x, player.y);

    // Brilho de Aura
    const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 28);
    grad.addColorStop(0, 'rgba(245, 158, 11, 0.6)');
    grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, Math.PI * 2);
    ctx.fill();

    // Emoji do Cage
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('😎', 0, 0);
    ctx.restore();
  }

  function startGame() {
    score = 0;
    lives = 3;
    scrolls = [];
    bees = [];
    scoreEl.textContent = '0';
    livesEl.textContent = '❤️❤️❤️';
    overlay.classList.add('hidden');
    gameRunning = true;
    sound.playLevelUp();
    cancelAnimationFrame(gameLoopId);
    gameLoopId = requestAnimationFrame(updateGame);
  }

  function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(gameLoopId);
    sound.playRageScream();

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('cage_game_hs', highScore);
      highScoreEl.textContent = highScore;
    }

    overlayTitle.textContent = "NÃO AS ABELHAS! GAME OVER!";
    overlayTitle.style.color = "#ef4444";
    overlayMsg.innerHTML = `Você recuperou <strong>${score} pontos</strong> em tesouros antes do enxame te alcançar!<br><em>"Elas estão nos meus olhos!"</em>`;
    btnStartGame.innerHTML = `<span>Tentar Novamente</span>`;
    overlay.classList.remove('hidden');
  }

  btnStartGame.addEventListener('click', startGame);

  // Controles de Teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      player.movingLeft = true;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      player.movingRight = true;
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      player.movingLeft = false;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      player.movingRight = false;
    }
  });

  // Controles com Mouse e Toque
  canvas.addEventListener('mousemove', (e) => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, mouseX));
  });

  canvas.addEventListener('touchmove', (e) => {
    if (!gameRunning || !e.touches[0]) return;
    const rect = canvas.getBoundingClientRect();
    const touchX = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, touchX));
    e.preventDefault();
  }, { passive: false });


  // ============================================================================
  // 9. CANVAS DE PARTÍCULAS DE FUNDO (POEIRA DOURADA & BRASAS)
  // ============================================================================
  const pCanvas = document.getElementById('particles-canvas');
  if (pCanvas) {
    const pCtx = pCanvas.getContext('2d');
    let pWidth = (pCanvas.width = window.innerWidth);
    let pHeight = (pCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      pWidth = pCanvas.width = window.innerWidth;
      pHeight = pCanvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 45;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * pWidth,
        y: Math.random() * pHeight,
        radius: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        alpha: Math.random() * 0.7 + 0.2
      });
    }

    function renderParticles() {
      pCtx.clearRect(0, 0, pWidth, pHeight);
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const particleColor = isDark ? '245, 158, 11' : '180, 83, 9';

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = pHeight + 5;
          p.x = Math.random() * pWidth;
        }
        if (p.x < 0) p.x = pWidth;
        if (p.x > pWidth) p.x = 0;

        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
        pCtx.fill();
      });

      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }


  // ============================================================================
  // 10. EASTER EGG: CHUVA DE NICOLAS CAGE
  // ============================================================================
  const easterBtn = document.getElementById('btn-easter-egg');
  if (easterBtn) {
    easterBtn.addEventListener('click', () => {
      sound.playLevelUp();
      const cageFaces = ['⚡', '👑', '📜', '🔥', '🐝', '🏆', '🕶️', '🪓'];
      const totalDrops = 40;

      for (let i = 0; i < totalDrops; i++) {
        setTimeout(() => {
          const drop = document.createElement('div');
          drop.textContent = cageFaces[Math.floor(Math.random() * cageFaces.length)];
          drop.style.position = 'fixed';
          drop.style.top = '-50px';
          drop.style.left = `${Math.random() * 100}vw`;
          drop.style.fontSize = `${Math.random() * 26 + 20}px`;
          drop.style.zIndex = '9999';
          drop.style.pointerEvents = 'none';
          drop.style.transition = `transform ${Math.random() * 2 + 2}s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease`;

          document.body.appendChild(drop);

          requestAnimationFrame(() => {
            drop.style.transform = `translateY(${window.innerHeight + 80}px) rotate(${Math.random() * 720 - 360}deg)`;
          });

          setTimeout(() => {
            drop.style.opacity = '0';
            setTimeout(() => drop.remove(), 500);
          }, 3500);
        }, i * 60);
      }
    });
  }

});
