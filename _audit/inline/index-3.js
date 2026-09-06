
const STR = {
  es: {
    nav: ["Buscar", "Situaciones", "¿Qué puedo pedir?", "Escuchar", "Vida diaria", "Datos", "Jugar"],
    a11y: "Lectura accesible", playlist: "Música",
    books: "Todo aquí es gratis gracias a los libros de Iris Green",
    searchPh: "me cuesta salir de casa, no consigo empezar, mi hijo no habla…",
    lede: "Escríbelo como lo dirías en voz alta.",
    directo: "O entra directo a un tema",
    escuchar: "Escuchar a quien lo vive",
    empiezo: "¿Por dónde empiezo?",
    soloEs: "Las secciones están en castellano. La traducción está en marcha."
  },
  en: {
    nav: ["Search", "Situations", "What can I ask for?", "Listen", "Everyday life", "Data", "Play"],
    a11y: "Accessible reading", playlist: "Music",
    books: "Everything here is free thanks to Iris Green's books",
    searchPh: "noise, I can't get started, I can't sleep, school…",
    lede: "Write it as you would say it out loud.",
    directo: "Or go straight to a topic",
    escuchar: "Hear from the people who live it",
    empiezo: "Where do I start?",
    soloEs: "The sections are in Spanish. Translation is under way."
  },
  pt: {
    nav: ["Buscar", "Situações", "O que eu posso pedir?", "Escutar", "Vida diária", "Dados", "Jogar"],
    a11y: "Leitura acessível", playlist: "Música",
    books: "Tudo aqui é gratuito graças aos livros de Iris Green",
    searchPh: "ruído, não consigo começar, não durmo, escola…",
    lede: "Descreva o que está acontecendo. Aqui você encontra por onde seguir.",
    directo: "Ou entre direto num tema",
    escuchar: "Escutar quem vive isso",
    empiezo: "Por onde eu começo?",
    soloEs: "As fichas e os textos das seções estão em castelhano. Esta página inicial já muda de idioma; a tradução das seções está em andamento, e isso é dito aqui para não dar como pronta."
  }
};

const BOOKS = {
  autismo: {
    es: { title: "Autismo en la vida diaria", cover: "/assets/books/autismo-es-512.webp", sub: "Guía práctica · edición en español", price: "5,99 €", bar: "edición ES", url: "/es/libros/#autismo" },
    en: { title: "Autism in Everyday Life", cover: "/assets/books/autismo-en-512.webp", sub: "Practical guide · English edition", price: "5,98 €", bar: "English edition", url: "/es/libros/#autismo" },
    pt: { title: "Autismo no dia a dia", cover: "/assets/books/autismo-ptbr-512.webp", sub: "Guia prático · edição em português do Brasil", price: "5,95 €", bar: "edição PT-BR", url: "/es/libros/#autismo" }
  },
  luma: {
    es: { title: "Luma y la flor que sabía escuchar", cover: "/assets/books/luma-es-512.webp", sub: "Cuento ilustrado · edición en español · también en inglés y japonés", price: "5,95 €", bar: "edición ES", url: "/es/libros/#luma" },
    en: { title: "Luma and the Flower That Knew How to Listen", cover: "/assets/books/luma-en-512.webp", sub: "Illustrated story · English edition", price: "5,95 €", bar: "English edition", url: "/es/libros/#luma" },
    pt: { title: "Luma y la flor que sabía escuchar", cover: "/assets/books/luma-es-512.webp", sub: "Conto ilustrado · edição em espanhol; a edição PT-BR ainda não saiu", price: "5,95 €", bar: "edição ES", url: "/es/libros/#luma" }
  }
};

const TR = {
      "Cuento ilustrado · ES · EN": { en: "Illustrated story · ES · EN", pt: "Conto ilustrado · ES · EN" },
  "Guía práctica · ES · EN": { en: "Practical guide · ES · EN", pt: "Guia prático · ES · EN" },
  "Toca los pasos en orden": { en: "Tap the steps in order", pt: "Toque nos passos em ordem" },
  "Ver más vídeos": { en: "See more videos", pt: "Ver mais vídeos" },
  "restantes": { en: "left", pt: "restantes" },
  "Ver en ": { en: "Watch on ", pt: "Ver em " },
  "¿Dónde se nota más?": { en: "Where do you notice it most?", pt: "Onde isso aparece mais?" },
  "Elige lo que más se parezca a tu caso. No hay respuestas incorrectas.": { en: "Pick whatever is closest to your case. There are no wrong answers.", pt: "Escolha o que mais se parece com o seu caso. Não há respostas erradas." },
  "En el cuerpo y los sentidos: ruido, luz, ropa, olores": { en: "In the body and the senses: noise, light, clothes, smells", pt: "No corpo e nos sentidos: ruído, luz, roupa, cheiros" },
  "En arrancar y organizarme: empiezo tarde o no empiezo": { en: "In getting started and organising: I start late or not at all", pt: "Em começar e me organizar: começo tarde ou não começo" },
  "En pensamientos que vuelven una y otra vez": { en: "In thoughts that keep coming back", pt: "Em pensamentos que voltam sempre" },
  "En lo social: hablar, mirar, encajar": { en: "In social things: talking, looking, fitting in", pt: "No social: falar, olhar, se encaixar" },
  "¿Y qué pasa después?": { en: "And what happens next?", pt: "E o que acontece depois?" },
  "Piensa en un día que ya ha ido mal.": { en: "Think of a day that has already gone badly.", pt: "Pense num dia que já foi mal." },
  "Me quedo sin batería y me apago": { en: "I run out of battery and shut down", pt: "Fico sem bateria e me apago" },
  "Me acelero y no puedo parar": { en: "I speed up and can't stop", pt: "Eu acelero e não consigo parar" },
  "Repito algo concreto para calmarme": { en: "I repeat something specific to calm down", pt: "Repito algo específico para me acalmar" },
  "Aparento que estoy bien delante de la gente": { en: "I look fine in front of other people", pt: "Finjo que estou bem na frente das pessoas" },
  "¿Cuándo aparece?": { en: "When does it show up?", pt: "Quando isso aparece?" },
  "Última pregunta.": { en: "Last question.", pt: "Última pergunta." },
  "Con ruido, luz o mucha gente": { en: "With noise, light or crowds", pt: "Com ruído, luz ou muita gente" },
  "Con tareas, plazos, papeleo": { en: "With tasks, deadlines, paperwork", pt: "Com tarefas, prazos, papelada" },
  "Al final del día o al intentar dormir": { en: "At the end of the day or when trying to sleep", pt: "No fim do dia ou ao tentar dormir" },
  "Casi siempre, sin un motivo claro": { en: "Almost always, with no clear reason", pt: "Quase sempre, sem motivo claro" },
  "Escribir la tarea en una sola frase": { en: "Write the task in a single sentence", pt: "Escrever a tarefa em uma só frase" },
  "Partirla y quedarte con el primer paso": { en: "Split it and keep only the first step", pt: "Dividir e ficar com o primeiro passo" },
  "Dejar ese primer paso a la vista": { en: "Leave that first step in sight", pt: "Deixar esse primeiro passo à vista" },
  "Poner cinco minutos de reloj y empezar": { en: "Set a five-minute timer and start", pt: "Colocar cinco minutos no relógio e começar" },
  "Marcar lo hecho y elegir el paso siguiente": { en: "Tick off what is done and pick the next step", pt: "Marcar o que já foi feito e escolher o passo seguinte" },
  "Apoyos escolares": { en: "Support at school", pt: "Apoios escolares" },
  "Ajustes laborales": { en: "Adjustments at work", pt: "Ajustes no trabalho" },
  "Valoración o diagnóstico": { en: "Assessment or diagnosis", pt: "Avaliação ou diagnóstico" },
  "Lo hace el equipo de orientación del colegio. Sin él casi no se puede pedir nada más.": { en: "The school's guidance team writes it. Without it, almost nothing else can be requested.", pt: "Quem faz é a equipe de orientação da escola. Sem ele, quase nada mais pode ser pedido." },
  "Más tiempo, examen en otro formato, sitio con menos ruido.": { en: "More time, the exam in another format, a quieter place.", pt: "Mais tempo, prova em outro formato, lugar com menos ruído." },
  "Solo si se valoran apoyos específicos o cambio de modalidad.": { en: "Only when specific support or a change of setting is being assessed.", pt: "Só se estiverem avaliando apoios específicos ou mudança de modalidade." },
  "Se solicita por la escuela; da acceso al apoyo del equipo USAER.": { en: "Requested through the school; it opens access to the USAER team's support.", pt: "É solicitada pela escola; dá acesso ao apoio da equipe USAER." },
  "Reconocidos por la Ley General de Educación.": { en: "Recognised by the General Education Act.", pt: "Reconhecidos pela Lei Geral de Educação." },
  "Se acuerda entre escuela, familia y equipo interdisciplinario.": { en: "Agreed between school, family and the interdisciplinary team.", pt: "Acordado entre escola, família e equipe interdisciplinar." },
  "Suele requerir certificado del equipo tratante.": { en: "It usually requires a certificate from the treating team.", pt: "Normalmente exige certificado da equipe que atende." },
  "Requiere evaluación diagnóstica integral del establecimiento.": { en: "It requires the school's full diagnostic assessment.", pt: "Exige avaliação diagnóstica integral do estabelecimento." },
  "Permite ajustar objetivos y evaluación.": { en: "It allows objectives and assessment to be adjusted.", pt: "Permite ajustar objetivos e avaliação." },
  "Deja constancia con fecha: casi todos los sistemas parten de ahí.": { en: "Keep a dated record: almost every system starts there.", pt: "Registre com data: quase todos os sistemas começam aí." },
  "El nombre cambia, el derecho suele existir.": { en: "The name changes; the right usually exists.", pt: "O nome muda, o direito costuma existir." },
  "Se piden a la empresa. No hace falta contar todo tu diagnóstico.": { en: "You ask the employer. You do not have to disclose your whole diagnosis.", pt: "Você pede à empresa. Não precisa contar todo o seu diagnóstico." },
  "Desde el 33% abre bonificaciones y reserva de puesto.": { en: "From 33% it opens tax relief and reserved posts.", pt: "A partir de 33% dá acesso a benefícios e reserva de vaga." },
  "Es una vía poco conocida y suele ir más rápido.": { en: "It is a little-known route and usually moves faster.", pt: "É um caminho pouco conhecido e costuma ser mais rápido." },
  "Solicítalos por escrito a Recursos Humanos.": { en: "Ask for them in writing to HR.", pt: "Peça por escrito ao RH." },
  "Da acceso a cupo laboral y coberturas.": { en: "It opens access to the employment quota and coverage.", pt: "Dá acesso à cota de trabalho e a coberturas." },
  "Obliga a cupo del 1% en empresas de 100+ personas.": { en: "It requires a 1% quota in companies with 100+ staff.", pt: "Exige cota de 1% em empresas com mais de 100 pessoas." },
  "Explica qué te cuesta y qué necesitas, no tu diagnóstico.": { en: "Explain what is hard and what you need, not your diagnosis.", pt: "Explique o que é difícil e o que você precisa, não o seu diagnóstico." },
  "Pide constancia por escrito si te la deniegan.": { en: "Ask for written proof if it is refused.", pt: "Peça comprovante por escrito se for negado." },
  "La espera suele ser larga. Pide el número de tu solicitud.": { en: "The wait is usually long. Ask for your request number.", pt: "A espera costuma ser longa. Peça o número da sua solicitação." },
  "Pregunta antes si sirve para el colegio o para el trabajo.": { en: "Ask beforehand whether it is valid for school or for work.", pt: "Pergunte antes se serve para a escola ou para o trabalho." },
  "Pide la hoja de referencia.": { en: "Ask for the referral sheet.", pt: "Peça a folha de referência." },
  "Necesario para el CUD.": { en: "Needed for the CUD.", pt: "Necessário para o CUD." },
  "Derivación desde el consultorio.": { en: "Referral from the local clinic.", pt: "Encaminhamento pelo posto de saúde." },
  "Es la puerta de entrada en casi todos los sistemas.": { en: "It is the way in for almost every system.", pt: "É a porta de entrada em quase todos os sistemas." },
  "Compatible con otras ayudas familiares.": { en: "It can be combined with other family benefits.", pt: "Compatível com outros benefícios familiares." },
  "Deducciones fiscales, transporte, ocio.": { en: "Tax relief, transport, leisure.", pt: "Deduções fiscais, transporte, lazer." },
  "Cambian por comunidad: revisa la de la tuya.": { en: "They vary by region: check your own.", pt: "Mudam por região: confira a sua." },
  "Bienestar; requisitos por edad y estado.": { en: "Bienestar programme; requirements by age and state.", pt: "Programa Bienestar; requisitos por idade e estado." },
  "Requiere CUD vigente.": { en: "It requires a valid CUD.", pt: "Exige CUD válido." },
  "Se solicita con la inscripción en el Registro Nacional.": { en: "Applied for together with registration in the National Registry.", pt: "Solicita-se junto com a inscrição no Registro Nacional." },
  "Suele ser el requisito previo a cualquier ayuda.": { en: "It is usually the prerequisite for any benefit.", pt: "Costuma ser o requisito prévio para qualquer ajuda." },
  "Pregunta por psicología clínica infantil o de adultos.": { en: "Ask for child or adult clinical psychology.", pt: "Pergunte por psicologia clínica infantil ou de adultos." },
  "Gratuita y prioritaria; se pide desde pediatría.": { en: "Free and given priority; requested through paediatrics.", pt: "Gratuita e prioritária; pede-se pela pediatria." },
  "Algunas comunidades y mutuas reembolsan parte.": { en: "Some regions and insurers refund part of it.", pt: "Algumas regiões e planos reembolsam parte." },
  "Cuotas ajustadas a ingresos.": { en: "Fees scaled to income.", pt: "Taxas ajustadas à renda." },
  "Con CUD, la obra social debe cubrir las prestaciones.": { en: "With a CUD, the health scheme must cover the services.", pt: "Com CUD, a obra social deve cobrir as prestações." },
  "Ingreso por el consultorio.": { en: "Entry through the local clinic.", pt: "Entrada pelo posto de saúde." },
  "Y pide la negativa por escrito si la hay.": { en: "And ask for any refusal in writing.", pt: "E peça a negativa por escrito, se houver." },
  "Busca una palabra, responde tres preguntas o mira qué ayuda puedes pedir.": { en: "Search a word, answer three questions, or see what you can ask for where you live.", pt: "Busque uma palavra, responda três perguntas ou veja o que você pode pedir onde vive." },
  "Buscar": { en: "Search", pt: "Buscar" },
  "¿Qué me pasa?": { en: "What is going on with me?", pt: "O que está acontecendo comigo?" },
  "¿Qué puedo pedir?": { en: "What can I ask for?", pt: "O que eu posso pedir?" },
  "no puedo empezar": { en: "I can't get started", pt: "não consigo começar" },
  "ruido": { en: "noise", pt: "ruído" },
  "no duermo": { en: "I can't sleep", pt: "não durmo" },
  "colegio": { en: "school", pt: "escola" },
  "me agoto": { en: "I get worn out", pt: "fico esgotada" },
  " resultados": { en: " results", pt: " resultados" },
  "sugerencias": { en: "suggestions", pt: "sugestões" },
  "Nada con esas palabras. Prueba la pestaña «¿Qué me pasa?».": { en: "Nothing with those words. Try the «What is going on with me?» tab.", pt: "Nada com essas palavras. Tente a aba «O que está acontecendo comigo?»." },
  "Para leer luego": { en: "To read later", pt: "Para ler depois" },
  "Tema": { en: "Topic", pt: "Tema" },
  "Situación": { en: "Situation", pt: "Situação" },
  "Trámite": { en: "Procedure", pt: "Trâmite" },
  "Juego": { en: "Game", pt: "Jogo" },
  "Vídeo": { en: "Video", pt: "Vídeo" },
  "Libro": { en: "Book", pt: "Livro" },
  "Autismo": { en: "Autism", pt: "Autismo" },
  "TDAH": { en: "ADHD", pt: "TDAH" },
  "TOC": { en: "OCD", pt: "TOC" },
  "Ansiedad": { en: "Anxiety", pt: "Ansiedade" },
  "Dislexia": { en: "Dyslexia", pt: "Dislexia" },
  "Discalculia": { en: "Dyscalculia", pt: "Discalculia" },
  "Sueño": { en: "Sleep", pt: "Sono" },
  "Masking": { en: "Masking", pt: "Masking" },
  "Burnout autista": { en: "Autistic burnout", pt: "Burnout autista" },
  "Interocepción": { en: "Interoception", pt: "Interocepção" },
  "ARFID": { en: "ARFID", pt: "ARFID" },
  "Tourette": { en: "Tourette", pt: "Tourette" },
  "Tartamudez": { en: "Stuttering", pt: "Gagueira" },
  "Síndrome de Down": { en: "Down syndrome", pt: "Síndrome de Down" },
  "Identidad LGTBI+": { en: "LGBTQIA+ identity", pt: "Identidade LGBTQIA+" },
  "Dislexia y discalculia": { en: "Dyslexia and dyscalculia", pt: "Dislexia e discalculia" },
  "Misofonía": { en: "Misophonia", pt: "Misofonia" },
  "CAA": { en: "AAC", pt: "CAA" },
  "TDL": { en: "DLD", pt: "TDL" },
  "Todos": { en: "All", pt: "Todos" },
  "sensorial, social, comunicación": { en: "sensory, social, communication", pt: "sensorial, social, comunicação" },
  "atención, impulso, iniciar tareas": { en: "attention, impulse, starting tasks", pt: "atenção, impulso, iniciar tarefas" },
  "pensamientos que se repiten": { en: "thoughts that keep coming back", pt: "pensamentos que se repetem" },
  "alarma que no se apaga": { en: "an alarm that does not switch off", pt: "um alarme que não desliga" },
  "lectura y escritura": { en: "reading and writing", pt: "leitura e escrita" },
  "números y cálculo": { en: "numbers and calculation", pt: "números e cálculo" },
  "dormir, despertares, rutina": { en: "falling asleep, waking up, routine", pt: "dormir, despertares, rotina" },
  "aparentar que todo va bien": { en: "looking as though everything is fine", pt: "parecer que está tudo bem" },
  "apagarse tras mucho aguantar": { en: "shutting down after holding on too long", pt: "apagar depois de aguentar muito" },
  "no notar hambre, sed o cansancio": { en: "not noticing hunger, thirst or tiredness", pt: "não perceber fome, sede ou cansaço" },
  "comer muy selectivo": { en: "very selective eating", pt: "comer muito seletivo" },
  "tics motores y vocales": { en: "motor and vocal tics", pt: "tiques motores e vocais" },
  "Sobrecarga en el supermercado": { en: "Overload at the supermarket", pt: "Sobrecarga no mercado" },
  "ruido, luces, mucha gente": { en: "noise, lights, lots of people", pt: "ruído, luzes, muita gente" },
  "Mi hijo acaba de ser diagnosticado": { en: "My child has just been diagnosed", pt: "Meu filho acabou de ser diagnosticado" },
  "primeros pasos para familias": { en: "first steps for families", pt: "primeiros passos para famílias" },
  "No consigo empezar la tarea": { en: "I can't start the task", pt: "Não consigo começar a tarefa" },
  "bloqueo de inicio": { en: "a block at the start", pt: "bloqueio no início" },
  "Reuniones que me agotan": { en: "Meetings that wear me out", pt: "Reuniões que me esgotam" },
  "trabajo y carga social": { en: "work and social load", pt: "trabalho e carga social" },
  "Apoyos en el colegio": { en: "Support at school", pt: "Apoios na escola" },
  "qué pedir y con qué nombre": { en: "what to ask for and by what name", pt: "o que pedir e com que nome" },
  "Ajustes en el trabajo": { en: "Adjustments at work", pt: "Ajustes no trabalho" },
  "adaptaciones razonables": { en: "reasonable adjustments", pt: "adaptações razoáveis" },
  "¿Por dónde empiezo?": { en: "Where do I start?", pt: "Por onde eu começo?" },
  "ordenar pasos · funciones ejecutivas": { en: "putting steps in order · executive functions", pt: "ordenar passos · funções executivas" },
  "El alivio que dura poco": { en: "The relief that does not last", pt: "O alívio que dura pouco" },
  "el ciclo del TOC, en dominó": { en: "the OCD cycle, as dominoes", pt: "o ciclo do TOC, em dominó" },
  "«Creía que era vaga hasta los 34»": { en: "«I thought I was lazy until I was 34»", pt: "«Eu achava que era preguiçosa até os 34»" },
  "TDAH en la edad adulta · 6 min": { en: "ADHD in adulthood · 6 min", pt: "TDAH na vida adulta · 6 min" },
  "Autismo en la vida diaria": { en: "Autismo en la vida diaria", pt: "Autismo en la vida diaria" },
  "Luma y la flor que sabía escuchar": { en: "Luma y la flor que sabía escuchar", pt: "Luma y la flor que sabía escuchar" },
  "Por aquí puedes empezar": { en: "You can start here", pt: "Você pode começar por aqui" },
  "Estos dos temas encajan con lo que has contado.": { en: "These two topics fit what you have described.", pt: "Estes dois temas combinam com o que você contou." },
  "Más cercano": { en: "Closest", pt: "Mais próximo" },
  "También encaja": { en: "Also fits", pt: "Também combina" },
  "Guardado ✓": { en: "Saved ✓", pt: "Salvo ✓" },
  "Guardar": { en: "Save", pt: "Salvar" },
  "Leer el tema": { en: "Read the topic", pt: "Ler o tema" },
  "Esto no es un diagnóstico. Es solo una idea de por dónde empezar a leer, según lo que has contado.": { en: "This is not a diagnosis. It is only an idea of where to start reading, based on what you have described.", pt: "Isto não é um diagnóstico. É só uma ideia de por onde começar a ler, pelo que você contou." },
  "Empezar de nuevo": { en: "Start again", pt: "Começar de novo" },
  "Lo que necesito": { en: "What I need", pt: "O que eu preciso" },
  "Dónde vivo": { en: "Where I live", pt: "Onde eu moro" },
  "Apoyos en el colegio o instituto": { en: "Support at school or secondary school", pt: "Apoios na escola ou no ensino médio" },
  "Una valoración o diagnóstico": { en: "An assessment or diagnosis", pt: "Uma avaliação ou diagnóstico" },
  "Ayuda económica": { en: "Financial support", pt: "Ajuda financeira" },
  "Terapia o intervención": { en: "Therapy or intervention", pt: "Terapia ou intervenção" },
  "España": { en: "Spain", pt: "Espanha" },
  "México": { en: "Mexico", pt: "México" },
  "Argentina": { en: "Argentina", pt: "Argentina" },
  "Chile": { en: "Chile", pt: "Chile" },
  "Otro país": { en: "Another country", pt: "Outro país" },
  "Cómo pedirlo paso a paso →": { en: "How to ask for it, step by step →", pt: "Como pedir, passo a passo →" },
  "Directorio de 2.422 ayudas →": { en: "Directory of 2,422 supports →", pt: "Diretório de 2.422 ajudas →" },
  "Ver todos los temas, de la A a la Z →": { en: "See every topic, from A to Z →", pt: "Ver todos os temas, de A a Z →" },
  "Experiencias reales · se ven aquí mismo": { en: "Real experiences · they play right here", pt: "Experiências reais · dá para ver aqui" },
  "Ir a la videoteca completa →": { en: "Go to the full video library →", pt: "Ir para a videoteca completa →" },
  "Ver aquí": { en: "Play here", pt: "Ver aqui" },
  " vídeos en la videoteca": { en: " videos in the library", pt: " vídeos na videoteca" },
  " vídeos sobre ": { en: " videos about ", pt: " vídeos sobre " },
  "Juego · puedes jugar aquí mismo": { en: "Game · you can play right here", pt: "Jogo · dá para jogar aqui" },
  "Ver la colección →": { en: "See the collection →", pt: "Ver a coleção →" },
  "Piensa en una tarea que te cueste empezar y ordena los pasos. Al terminar verás el orden que suele funcionar.": { en: "You have a task that is hard to start. Tap the steps in the order you would do them.", pt: "Você tem uma tarefa difícil de começar. Toque nos passos na ordem em que você faria." },
  "Reiniciar": { en: "Restart", pt: "Reiniciar" },
  "Ese es el orden que suele funcionar: primero ver la tarea, después empezar.": { en: "That is the order that usually works: see the task first, then start.", pt: "Essa é a ordem que costuma funcionar: primeiro ver a tarefa, depois começar." },
  "Ese orden funciona. Otra manera: escribir antes la tarea y partirla en trozos.": { en: "Your order works too. Try writing the task down first and splitting it into pieces: it costs less to start that way.", pt: "Sua ordem também vale. Tente antes escrever a tarefa e dividi-la em partes: assim custa menos começar." },
  "Leer las primeras páginas": { en: "Read the first pages", pt: "Ler as primeiras páginas" },
  "Sobre Iris Green": { en: "About Iris Green", pt: "Sobre Iris Green" },
  "Metodología": { en: "Methodology", pt: "Metodologia" },
  "Investigación": { en: "Research", pt: "Pesquisa" },
  "Privacidad": { en: "Privacy", pt: "Privacidade" },
  "Tamaño del texto": { en: "Text size", pt: "Tamanho do texto" },
  "Letra más separada": { en: "More letter spacing", pt: "Letra mais espaçada" },
  "Botones más grandes": { en: "Bigger buttons", pt: "Botões maiores" },
  "Más contraste": { en: "More contrast", pt: "Mais contraste" },
  "Guía de lectura": { en: "Reading guide", pt: "Guia de leitura" },
  "Leer en voz alta": { en: "Read aloud", pt: "Ler em voz alta" },
  "Reducir movimiento": { en: "Reduce motion", pt: "Reduzir movimento" },
  "Restablecer": { en: "Reset", pt: "Restaurar" },
  "Más opciones": { en: "More options", pt: "Mais opções" },
};
const tr = (s, L) => (L === "es" || !s) ? s : ((TR[s] || {})[L] || s);

const BASE = "";
const T = (slug) => BASE + "/es/neurodiversidad/condiciones/" + slug + "/";

const ITEMS = [
  { name: "Autismo", kind: "Tema", url: T("autismo"), hint: "sensorial, social, comunicación", tags: ["sens","social","mask"], k: "autismo tea espectro sensorial ruido luz social" },
  { name: "TDAH", kind: "Tema", url: T("tdah"), hint: "atención, impulso, iniciar tareas", tags: ["exec","hiper"], k: "tdah atencion hiperactividad empezar tareas despiste procrastinar" },
  { name: "TOC", kind: "Tema", url: T("toc"), hint: "pensamientos que se repiten", tags: ["rumia","ritual"], k: "toc obsesion compulsion comprobar lavar ritual repetir" },
  { name: "Ansiedad", kind: "Tema", url: T("ansiedad"), hint: "alarma que no se apaga", tags: ["ansiedad","rumia","hiper"], k: "ansiedad miedo panico nervios alarma preocupacion" },
  { name: "Dislexia", kind: "Tema", url: T("dislexia"), hint: "lectura y escritura", tags: ["exec"], k: "dislexia leer lectura escribir colegio letras" },
  { name: "Discalculia", kind: "Tema", url: T("discalculia"), hint: "números y cálculo", tags: ["exec"], k: "discalculia numeros matematicas calculo" },
  { name: "Sueño", kind: "Tema", url: T("sueno"), hint: "dormir, despertares, rutina", tags: ["sueno","ansiedad"], k: "sueno dormir insomnio no duermo despertar noche" },
  { name: "Masking", kind: "Tema", url: T("masking-camuflaje-autista"), hint: "aparentar que todo va bien", tags: ["mask","social"], k: "masking mascara aparentar disimular camuflaje" },
  { name: "Burnout autista", kind: "Tema", url: T("burnout-autista"), hint: "apagarse tras mucho aguantar", tags: ["burnout","sens","mask"], k: "burnout agotamiento apagado sin bateria colapso" },
  { name: "Interocepción", kind: "Tema", url: T("interocepcion"), hint: "no notar hambre, sed o cansancio", tags: ["sens","burnout"], k: "interocepcion hambre sed bano cansancio cuerpo senales" },
  { name: "ARFID", kind: "Tema", url: T("arfid"), hint: "comer muy selectivo", tags: ["sens"], k: "arfid comer comida selectivo textura asco" },
  { name: "Tourette", kind: "Tema", url: T("sindrome-de-tourette"), hint: "tics motores y vocales", tags: ["ritual","hiper"], k: "tourette tics movimientos sonidos" },
  { name: "Sobrecarga en el supermercado", kind: "Situación", url: BASE + "/es/situaciones/", hint: "ruido, luces, mucha gente", tags: ["sens"], k: "supermercado ruido tienda multitud sobrecarga colapso luces" },
  { name: "Mi hijo acaba de ser diagnosticado", kind: "Situación", url: BASE + "/es/situaciones/", hint: "primeros pasos para familias", tags: ["social"], k: "hijo hija diagnostico familia madre padre recien colegio" },
  { name: "No consigo empezar la tarea", kind: "Situación", url: BASE + "/es/situaciones/", hint: "bloqueo de inicio", tags: ["exec"], k: "empezar tarea bloqueo procrastinar deberes trabajo" },
  { name: "Reuniones que me agotan", kind: "Situación", url: BASE + "/es/situaciones/", hint: "trabajo y carga social", tags: ["social","mask"], k: "reunion trabajo oficina agotar social jefe" },
  { name: "Apoyos en el colegio", kind: "Trámite", url: BASE + "/es/tramites/", hint: "qué pedir y con qué nombre", tags: [], k: "colegio escuela apoyos adaptaciones informe" },
  { name: "Ajustes en el trabajo", kind: "Trámite", url: BASE + "/es/tramites/", hint: "adaptaciones razonables", tags: [], k: "trabajo empleo ajustes adaptaciones empresa" },
  { name: "¿Por dónde empiezo?", kind: "Juego", url: BASE + "/es/recursos/juegos/", hint: "ordenar pasos · funciones ejecutivas", tags: ["exec"], k: "juego ordenar pasos empezar ejecutivas" },
  { name: "El alivio que dura poco", kind: "Juego", url: BASE + "/es/recursos/juegos/", hint: "el ciclo del TOC, en dominó", tags: ["ritual"], k: "juego domino toc alivio ciclo" },
  { name: "«Creía que era vaga hasta los 34»", kind: "Vídeo", url: BASE + "/es/videos/", hint: "TDAH en la edad adulta · 6 min", tags: ["exec"], k: "video tdah adulta mujer tarde diagnostico" },
  { name: "Autismo en la vida diaria", kind: "Libro", url: BASE + "/es/libros/#autismo", hint: "guía práctica de escenas cotidianas", tags: ["sens"], k: "libro autismo guia practica comprar" },
  { name: "Luma y la flor que sabía escuchar", kind: "Libro", url: BASE + "/es/libros/#luma", hint: "cuento ilustrado sobre sensibilidad", tags: ["sens"], k: "libro cuento luma flor ninos sensibilidad comprar" }
];

const QUIZ = [
  { q: "¿Dónde se nota más?", sub: "Elige lo que más se parezca a tu caso. No hay respuestas incorrectas.", options: [
    { label: "En el cuerpo y los sentidos: ruido, luz, ropa, olores", tags: ["sens"] },
    { label: "En arrancar y organizarme: empiezo tarde o no empiezo", tags: ["exec"] },
    { label: "En pensamientos que vuelven una y otra vez", tags: ["rumia"] },
    { label: "En lo social: hablar, mirar, encajar", tags: ["social"] }
  ]},
  { q: "¿Y qué pasa después?", sub: "Piensa en un día que ya ha ido mal.", options: [
    { label: "Me quedo sin batería y me apago", tags: ["burnout"] },
    { label: "Me acelero y no puedo parar", tags: ["hiper"] },
    { label: "Repito algo concreto para calmarme", tags: ["ritual"] },
    { label: "Aparento que estoy bien delante de la gente", tags: ["mask"] }
  ]},
  { q: "¿Cuándo aparece?", sub: "Última pregunta.", options: [
    { label: "Con ruido, luz o mucha gente", tags: ["sens"] },
    { label: "Con tareas, plazos, papeleo", tags: ["exec"] },
    { label: "Al final del día o al intentar dormir", tags: ["sueno"] },
    { label: "Casi siempre, sin un motivo claro", tags: ["ansiedad"] }
  ]}
];

const GAME_ORDER = ["Escribir la tarea en una sola frase","Partirla y quedarte con el primer paso","Dejar ese primer paso a la vista","Poner cinco minutos de reloj y empezar","Marcar lo hecho y elegir el paso siguiente"];
const GAME_SHUFFLED = [2, 0, 4, 1, 3];

const PEDIR = {
  colegio: { es: [["Informe psicopedagógico","Lo hace el equipo de orientación del colegio. Sin él casi no se puede pedir nada más."],["Adaptaciones metodológicas","Más tiempo, examen en otro formato, sitio con menos ruido."],["Dictamen de escolarización","Solo si se valoran apoyos específicos o cambio de modalidad."]],
    mx: [["Evaluación psicopedagógica (USAER)","Se solicita por la escuela; da acceso al apoyo del equipo USAER."],["Ajustes razonables en el aula","Reconocidos por la Ley General de Educación."]],
    ar: [["Proyecto Pedagógico Individual (PPI)","Se acuerda entre escuela, familia y equipo interdisciplinario."],["Maestro/a de apoyo a la inclusión","Suele requerir certificado del equipo tratante."]],
    cl: [["Programa de Integración Escolar (PIE)","Requiere evaluación diagnóstica integral del establecimiento."],["Decreto 83: adecuaciones curriculares","Permite ajustar objetivos y evaluación."]],
    otro: [["Pide por escrito la evaluación al centro","Deja constancia con fecha: casi todos los sistemas parten de ahí."],["Busca la ley de inclusión educativa de tu país","El nombre cambia, el derecho suele existir."]] },
  trabajo: { es: [["Ajustes razonables","Se piden a la empresa. No hace falta contar todo tu diagnóstico."],["Certificado de discapacidad","Desde el 33% abre bonificaciones y reserva de puesto."],["Adaptación de puesto por el servicio de prevención","Es una vía poco conocida y suele ir más rápido."]],
    mx: [["Ajustes razonables (LFT y Ley de Inclusión)","Solicítalos por escrito a Recursos Humanos."]],
    ar: [["Certificado Único de Discapacidad (CUD)","Da acceso a cupo laboral y coberturas."]],
    cl: [["Ley 21.015 de inclusión laboral","Obliga a cupo del 1% en empresas de 100+ personas."]],
    otro: [["Petición escrita de ajustes","Explica qué te cuesta y qué necesitas, no tu diagnóstico."]] },
  diagnostico: { es: [["Derivación desde atención primaria","Pide constancia por escrito si te la deniegan."],["Unidad de salud mental o neuropediatría","La espera suele ser larga. Pide el número de tu solicitud."],["Valoración privada con informe","Pregunta antes si sirve para el colegio o para el trabajo."]],
    mx: [["Valoración en centro de salud o CAISAME","Pide la hoja de referencia."]],
    ar: [["Turno con equipo interdisciplinario","Necesario para el CUD."]],
    cl: [["Evaluación en CESFAM o COSAM","Derivación desde el consultorio."]],
    otro: [["Empieza por atención primaria","Es la puerta de entrada en casi todos los sistemas."]] },
  economica: { es: [["Prestación por hijo con discapacidad","Compatible con otras ayudas familiares."],["Grado de discapacidad ≥33%","Deducciones fiscales, transporte, ocio."],["Ayudas autonómicas","Cambian por comunidad: revisa la de la tuya."]],
    mx: [["Pensión para personas con discapacidad","Bienestar; requisitos por edad y estado."]],
    ar: [["Asignación por hijo con discapacidad (ANSES)","Requiere CUD vigente."]],
    cl: [["Subsidio de discapacidad mental","Se solicita con la inscripción en el Registro Nacional."]],
    otro: [["Busca el registro nacional de discapacidad","Suele ser el requisito previo a cualquier ayuda."]] },
  terapia: { es: [["Terapia por la vía pública","Pregunta por psicología clínica infantil o de adultos."],["Atención temprana (0-6 años)","Gratuita y prioritaria; se pide desde pediatría."],["Ayudas a tratamiento privado","Algunas comunidades y mutuas reembolsan parte."]],
    mx: [["CRIT / centros de rehabilitación","Cuotas ajustadas a ingresos."]],
    ar: [["Cobertura por Ley 24.901","Con CUD, la obra social debe cubrir las prestaciones."]],
    cl: [["Programa de salud mental en APS","Ingreso por el consultorio."]],
    otro: [["Pregunta qué cubre tu seguro o sistema público","Y pide la negativa por escrito si la hay."]] }
};

const KINDC = { "Tema": ["#1f5f8b","rgba(31,95,139,0.1)"], "Condición": ["#1f5f8b","rgba(31,95,139,0.12)"], "Vida diaria": ["#1f8ba8","rgba(31,139,168,0.12)"], "Ayuda": ["#1f8ba8","rgba(31,139,168,0.12)"], "Situación": ["#6f5fc0","rgba(111,95,192,0.12)"], "Trámite": ["#1f8ba8","rgba(31,139,168,0.12)"], "Juego": ["#a8336f","rgba(168,51,111,0.16)"], "Vídeo": ["#a8336f","rgba(194,86,140,0.12)"], "Libro": ["#a8336f","rgba(168,51,111,0.12)"] };
const PEDIR_LABEL = { colegio: "Apoyos escolares", trabajo: "Ajustes laborales", diagnostico: "Valoración o diagnóstico", economica: "Ayuda económica", terapia: "Terapia o intervención" };
const COUNTRY_LABEL = { es: "España", mx: "México", ar: "Argentina", cl: "Chile", otro: "Otro país" };

const VIDEOTECA = "/es/videos/";
const YT = (id) => "https://www.youtube-nocookie.com/embed/" + id + "?rel=0&playsinline=1";
const YTW = (id) => "https://www.youtube.com/watch?v=" + id;
const IG = (path) => "https://www.instagram.com/" + path + "/embed/";
const thumbImg = (u) => u ? React.createElement("img", { src: u, alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } }) : null;
const ytThumb = (u) => null;
const IGW = (path) => "https://www.instagram.com/" + path + "/";
const y = (n, t, id) => ({ name: n, tema: t, source: "YouTube", embed: YT(id), href: YTW(id) });
const i = (n, t, p) => ({ name: n, tema: t, source: "Instagram", embed: IG(p), href: IGW(p) });

const VIDEOS = [
  y("Dan Wilkins · Managing on the Spectrum", "Autismo", "qy_6-Zhx-i0"),
  y("Ro Vitale · La Cruda", "TOC", "jS2LoXykaRw"),
  y("Jordi Rodríguez · Roca Project", "Tourette", "to77ghKeq8I"),
  y("Cate Moretti · Roca Project", "Síndrome de Down", "kR_ZyTd2PW8"),
  y("Josep Thió", "Autismo", "rEU5YZGvovc"),
  y("Abraham Ros · Más allá del rosa", "Autismo", "KOHb8-xHpOU"),
  y("Elisa Farías", "TDAH", "IZhswSOVNoc"),
  y("Yessenia y Javier · Autismo Guía", "Autismo", "6avzOjlOPeQ"),
  y("Renzo Schuller", "TDAH", "86UnZk_tRUI"),
  y("Norma Echavarría · Inesperado Podcast", "TDAH", "P1x13ntninc"),
  y("Jaume Aymar / Mind Sylenth", "TOC", "0da3Lud8aqo"),
  y("Fernando · historia de TOC", "TOC", "74KDFWp1jK8"),
  y("Lele Pons", "TOC", "utFNW9znXMU"),
  y("Tini Stoessel", "Ansiedad", "rUDlpO89isc"),
  y("María Becerra", "Ansiedad", "yNo-OBEJ-2s"),
  y("Leiva", "Ansiedad", "AR-mhLGktMs"),
  y("Beret", "Ansiedad", "TJtqJaTMbTk"),
  y("Jely Reátegui", "Ansiedad", "FXuObQT10Ew"),
  y("Felipe Silva Eltit · Inesperado Podcast", "Tourette", "Pt2v_vS2LuA"),
  y("Bianca Sáez", "Tourette", "Rl3nZwxM28w"),
  y("Wado de Pedro", "Tartamudez", "5n-svsAPUlE"),
  y("Kenya Cuevas · Se Regalan Dudas", "Identidad LGTBI+", "NdsTWfDG4n8"),
  y("Alex Orué · Se Regalan Dudas", "Identidad LGTBI+", "dtwJcwFFGIE"),
  y("Aike Martín · Les Mariquites", "Identidad LGTBI+", "mlruSqK0YM4"),
  y("Jesica y Ambar · CAMBIO", "Identidad LGTBI+", "qCM_mBpfkug"),
  y("Izan Baptista", "Identidad LGTBI+", "KKVxqJIJNcw"),
  y("Bea Is · Perú Intersex", "Identidad LGTBI+", "U9ORbTEkmE8"),
  y("Luta Cruz", "Identidad LGTBI+", "rpkHylCno1s"),
  y("Rosario Ortega", "Identidad LGTBI+", "QmxhKxJK_eU"),
  y("Paula Gonu", "Identidad LGTBI+", "dB4DzHS_P58"),
  y("Ellie Middleton · diagnóstico AuDHD", "TDAH", "u-Qtf9YAlts"),
  y("Lizi Jackson-Barrett", "TDAH", "EDLpUMjYoGY"),
  y("Orlando Bloom · Made By Dyslexia", "Dislexia y discalculia", "-_ij_ZyDwVI"),
  y("Joyce Luz · Drauzio Varella", "Tourette", "ZYAfjjHrI_A"),
  y("Amanda Ramalho · The Noite", "Autismo", "WewQesBzrmI"),
  y("Bella Ramsey · autismo e identidad", "Identidad LGTBI+", "xR1Brs76IEo"),
  y("Jessica Kellgren-Fozard · TDAH y vida queer", "Identidad LGTBI+", "BrxAnehKjZ0"),
  y("Fern Brady · autismo y bisexualidad", "Identidad LGTBI+", "URzPua45sRQ"),
  y("Hannah Gadsby · autismo y experiencia queer", "Identidad LGTBI+", "PaT__mzkHbA"),
  y("Chloé Hayden · autismo, TDAH y representación", "Autismo", "roFFvyNVWtc"),
  y("Yasmin Finney · representación trans", "Identidad LGTBI+", "8bzfJXGieng")
].map((v, n) => Object.assign({ id: "v" + n }, v));

const TEMAS = ["Todos", "Autismo", "TDAH", "TOC", "Ansiedad", "Tourette", "Dislexia y discalculia", "ARFID", "Tartamudez", "Síndrome de Down", "Identidad LGTBI+"];

class Component extends DCLogic {
  state = { idx: [], vids: [], savedOpen: false, savedTouched: false, lang: "es", tab: "search", q: "", step: 0, tally: {}, need: "colegio", country: "es", picked: [], saved: [], a11y: false, music: false, fs: 17, spacing: false, controls: false, contrast: false, guide: false, speak: false, motion: false, playing: null, tema: "Todos", limit: 6 };

  componentDidMount() {
    fetch("videoteca-listado.json").then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { var a = Array.isArray(j) ? j : (j && j.videos); if (a && a.length) this.setState({ vids: a.map(function (v) { return y(v.name, v.tema, v.ref); }) }); }.bind(this)).catch(function () {});
    fetch("buscador.json").then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j && j.length) this.setState({ idx: j.map(function (x) { var d = x.d || ""; var corto = d.length > 120 ? d.slice(0, 117).replace(/[\s,;:.]+$/, "") + "…" : d;
      return { name: x.t, kind: x.s, url: x.u, hint: corto, full: d, k: "", area: x.a }; }) }); }.bind(this)).catch(function () {});
    try {
      const saved = localStorage.getItem("ig_lang");
      if (saved && STR[saved]) this.setState({ lang: saved });
      document.documentElement.lang = saved === "pt" ? "pt-BR" : (saved || "es");
    } catch (e) {}
    try { document.documentElement.lang = document.documentElement.lang || "es"; } catch (e) {}
    try {
      const raw = localStorage.getItem("ig_saved_b");
      if (raw) this.setState({ saved: JSON.parse(raw) });
    } catch (e) {}
  }

  setLang(l) {
    this.setState({ lang: l });
    try { localStorage.setItem("ig_lang", l); document.documentElement.lang = l === "pt" ? "pt-BR" : l; } catch (e) {}
  }

  persist(saved) {
    this.setState({ saved: saved, savedTouched: true });
    try { localStorage.setItem("ig_saved_b", JSON.stringify(saved)); } catch (e) {}
  }

  applyReading(s) {
    const b = document.body, h = document.documentElement;
    if (!b) return;
    b.style.zoom = (s.fs / 17).toFixed(3);
    b.style.lineHeight = s.spacing ? "1.9" : "";
    b.style.letterSpacing = s.spacing ? "0.045em" : "";
    b.style.wordSpacing = s.spacing ? "0.12em" : "";
    h.dataset.igControls = s.controls ? "big" : "";
    h.dataset.igContrast = s.contrast ? "on" : "";
    h.dataset.igMotion = s.motion ? "off" : "";
    this.setGuide(s.guide);
    this.setSpeak(s.speak);
  }

  setGuide(on) {
    let g = document.getElementById("ig-guide");
    if (on && !g) {
      g = document.createElement("div");
      g.id = "ig-guide";
      g.style.cssText = "position:fixed;left:0;right:0;height:46px;pointer-events:none;z-index:70;background:rgba(111,95,192,0.14);border-top:2px solid rgba(111,95,192,0.5);border-bottom:2px solid rgba(111,95,192,0.5);top:0";
      document.body.appendChild(g);
      this._guideMove = (e) => { g.style.top = Math.max(0, e.clientY - 23) + "px"; };
      window.addEventListener("pointermove", this._guideMove);
    } else if (!on && g) {
      window.removeEventListener("pointermove", this._guideMove);
      g.remove();
    }
  }

  setSpeak(on) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (!on) return;
    const main = document.querySelector("main");
    const text = (main ? main.innerText : "").slice(0, 4000);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }

  setReading(patch) {
    const st = this.state;
    const next = Object.assign({ fs: st.fs, spacing: st.spacing, controls: st.controls, contrast: st.contrast, guide: st.guide, speak: st.speak, motion: st.motion }, patch);
    this.setState(next);
    this.applyReading(next);
  }

  toggleSave(name, url) {
    const saved = this.state.saved.some((s) => s.name === name)
      ? this.state.saved.filter((s) => s.name !== name)
      : this.state.saved.concat([{ name, url }]);
    this.persist(saved);
  }

  norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

  search() {
    var VACIAS = "no me con el la que de del a y o en un una lo los las al se su mi te les nos por para es son ser estoy esta este eso hay muy mas pero si ya cuando donde como todo toda".split(" ");
    var fondo = ITEMS.concat(this.state.idx || []);
    var q = this.norm(this.state.q).trim();
    if (!q) {
      var FIJAS = [
        { name: "Todas las fichas de Vida diaria", kind: "Vida diaria", url: "/es/biblioteca/", hint: "Moldes para el día a día: la compra, la cocina, el papeleo, dormir y salir de casa.", area: "" },
        { name: "Todas las cifras de Datos", kind: "Datos", url: "/es/datos/", hint: "Cifras con su población, su método y su incertidumbre en la misma frase.", area: "" },
        { name: "Todas las ayudas por país", kind: "Ayudas", url: "/es/tramites/directorio/", hint: "Qué ayuda puedes pedir en tu país, con su nombre oficial y su explicación en llano.", area: "" }
      ];
      var fuente = (this.state.idx && this.state.idx.length) ? this.state.idx : ITEMS;
      var PREFIERE = { "Condición": ["Autismo", "TDAH", "Dislexia"], "Situación": [] };
      var una = function (k) {
        var pool = fuente.filter(function (x) { return x.kind === k });
        var pref = PREFIERE[k] || [];
        for (var p = 0; p < pref.length; p++) {
          var hit = pool.filter(function (x) { return x.name === pref[p] })[0];
          if (hit) return hit;
        }
        return pool[0];
      };
      var sits = fuente.filter(function (x) { return x.kind === "Situación" });
      var mezcla = sits.slice(0, 2).concat(FIJAS).filter(Boolean);
      return mezcla.length >= 3 ? mezcla.slice(0, 5) : fuente.slice(0, 5);
    }
    var todas = q.split(/\s+/).filter(Boolean);
    var words = todas.filter(function (w) { return w.length > 2 && VACIAS.indexOf(w) === -1; });
    var buscar = words.length ? words : todas;
    var self = this;
    return fondo.map(function (it) { var hay = self.norm(it.name + " " + (it.hint || "") + " " + (it.k || "") + " " + (it.area || "")); var p = 0; buscar.forEach(function (w) { if (hay.indexOf(w) !== -1) p += (self.norm(it.name).indexOf(w) !== -1 ? 2 : 1); }); return { it: it, p: p }; }).filter(function (r) { return r.p > 0; }).sort(function (x, y) { return y.p - x.p; }).slice(0, 9).map(function (r) { return r.it; });
  }

  quizTop() {
    const tally = this.state.tally;
    return ITEMS.filter((i) => i.kind === "Tema")
      .map((i) => ({ item: i, score: i.tags.reduce((a, t) => a + (tally[t] || 0), 0) }))
      .sort((a, b) => b.score - a.score).slice(0, 2).map((s) => s.item);
  }

  renderVals() {
    const st = this.state;
    const L = st.lang;
    const T = STR[L] || STR.es;
    const results = this.search();
    const isSaved = (n) => st.saved.some((s) => s.name === n);
    const FUENTE = (st.vids && st.vids.length) ? st.vids : VIDEOS;
    const filtered = st.tema === "Todos" ? FUENTE : FUENTE.filter((v) => v.tema === st.tema);
    const done = st.step >= QUIZ.length;
    const step = QUIZ[Math.min(st.step, QUIZ.length - 1)];
    const TABC = { search: "#1f5f8b", quiz: "#6f5fc0", pedir: "#1f8ba8" };
    const tab = (id, label) => ({
      label,
      bg: st.tab === id ? "#fff" : "transparent",
      color: st.tab === id ? TABC[id] : "#5d6779",
      shadow: st.tab === id ? "0 6px 16px -10px rgba(23,57,92,0.5)" : "none",
      pick: () => this.setState({ tab: id })
    });

    const X = (v) => tr(v, L);
    return {
      hasSaved: st.saved.length > 0,
      savedRowBg: st.savedTouched ? "rgba(90,73,168,0.10)" : "transparent",
      savedOpen: st.savedOpen,
      savedOpenAttr: st.savedOpen ? "true" : "false",
      savedLabel: X("Guardados") + " (" + st.saved.length + ")",
      toggleSaved: () => this.setState({ savedOpen: !st.savedOpen, savedTouched: false }),
      savedList: st.saved.map((s) => ({ name: s.name, url: s.url, removeLabel: X("Quitar de lo guardado") + ": " + s.name, remove: () => this.toggleSave(s.name, s.url) })),
      hideOnError: (e) => { e.target.style.display = "none"; },
      fallbackLuma: (e) => { const i = e.target; if (i.dataset.fb) { i.style.display = "none"; return; } i.dataset.fb = "1"; i.src = "/assets/books/luma-es-512.webp"; },
      fallbackAut: (e) => { const i = e.target; if (i.dataset.fb) { i.style.display = "none"; return; } i.dataset.fb = "1"; i.src = "/assets/books/autismo-es-512.webp"; },
      bookAut: (BOOKS.autismo[L] || BOOKS.autismo.es),
      bookLuma: (BOOKS.luma[L] || BOOKS.luma.es),
      tHero2: X("Las situaciones están contadas en primera persona, y la tuya puede estar. También puedes responder tres preguntas o mirar qué ayuda puedes pedir."),
      tBooksCta: X("Leer las primeras páginas"),
      tBarLuma: (BOOKS.luma[L] || BOOKS.luma.es).title + " · " + (BOOKS.luma[L] || BOOKS.luma.es).bar,
      tBarAut: (BOOKS.autismo[L] || BOOKS.autismo.es).title + " · " + (BOOKS.autismo[L] || BOOKS.autismo.es).bar,
      tFootAbout: X("Sobre Iris Green"), tFootMethod: X("Metodología"), tFootResearch: X("Investigación"), tFootPrivacy: X("Privacidad"),
      tSavedTitle: X("Para leer luego"),
      tNoRes: X("Nada con esas palabras. Prueba la pestaña «¿Qué me pasa?»."),
      tReadTopic: X("Leer el tema"), tQuizNote: X("Esto no es un diagnóstico. Es solo una idea de por dónde empezar a leer, según lo que has contado."), tQuizRestart: X("Empezar de nuevo"),
      tNeedLabel: X("Lo que necesito"), tWhereLabel: X("Dónde vivo"),
      tNeed1: X("Apoyos en el colegio o instituto"), tNeed2: X("Ajustes en el trabajo"), tNeed3: X("Una valoración o diagnóstico"), tNeed4: X("Ayuda económica"), tNeed5: X("Terapia o intervención"),
      tC1: X("España"), tC2: X("México"), tC3: X("Argentina"), tC4: X("Chile"), tC5: X("Otro país"),
      tPedirCta1: X("Cómo pedirlo paso a paso →"), tPedirCta2: X("Directorio de 2.422 ayudas →"),
      tAZ: X("Ver todos los temas, de la A a la Z →"),
      tVidEyebrow: X("Experiencias reales · se ven aquí mismo"), tVidAll: X("Ir a la videoteca completa →"), tPlay: X(""),
      tGameEyebrow: X("Juego · puedes jugar aquí mismo"), tGameAll: X("Ver la colección →"), tGameLede: X("Piensa en una tarea que te cueste empezar y ordena los pasos. Al terminar verás el orden que suele funcionar."), tGameRestart: X("Reiniciar"),
      tFsLabel: X("Tamaño del texto"), tReset: X("Restablecer"), tMoreOpts: X("Más opciones"),
      langButtons: [["es", "ES"], ["en", "EN"]].map(([code, label]) => ({
        label,
        pick: () => this.setLang(code),
        bg: L === code ? "#17395c" : "#fff",
        color: L === code ? "#fff" : "#17395c",
        border: L === code ? "#17395c" : "rgba(23,57,92,0.16)"
      })),
      nav0: T.nav[0], nav1: T.nav[1], nav2: T.nav[2], nav3: T.nav[3], nav4: T.nav[4], nav5: T.nav[5], nav6: T.nav[6],
      tA11y: T.a11y, tPlaylist: T.playlist, tBooks: T.books, tSearchPh: T.searchPh,
      tLede: T.lede, tDirecto: T.directo, tEscuchar: T.escuchar, tEmpiezo: T.empiezo, tSoloEs: T.soloEs,
      tabs: [tab("search", X("Buscar")), tab("quiz", X("Responder 3 preguntas")), tab("pedir", X("¿Qué puedo pedir?"))],
      tabSearch: st.tab === "search",
      tabQuiz: st.tab === "quiz",
      tabPedir: st.tab === "pedir",

      q: st.q,
      onQ: (e) => this.setState({ q: e.target.value, savedTouched: false }),
      resultLabel: st.q.trim() ? results.length + X(" resultados") : "",
      listaLabel: st.q.trim() ? X("Resultados para") + " «" + st.q.trim() + "»" : X("Puedes empezar por aquí"),
      noResults: st.q.trim().length > 0 && results.length === 0,
      suggestions: ["no soporto el ruido", "me agoto con la gente", "no consigo dormir", "en el colegio no le entienden", "me bloqueo con los papeles"].map((label) => ({
        label: X(label), pick: () => this.setState({ q: label })
      })),
      results: results.map((r) => ({
        name: X(r.name), kind: X(r.kind), url: r.url, hint: X(r.hint),
        kindColor: (KINDC[r.kind] || KINDC["Tema"])[0], kindBg: (KINDC[r.kind] || KINDC["Tema"])[1],
        savedFill: isSaved(r.name) ? "#1f5f8b" : "none",
        savedOn: isSaved(r.name) ? "true" : "false",
        saveLabel: isSaved(r.name) ? X("Quitar de lo guardado") : X("Guardar para leer luego"),
        save: () => this.toggleSave(r.name, r.url)
      })),
      topics: ITEMS.filter((i) => i.kind === "Tema").map((i) => ({ name: X(i.name), url: i.url })),

      quizOpen: !done,
      quizDone: done,
      quizTitle: done ? X("Por aquí puedes empezar") : X(step.q),
      quizSub: done ? X("Estos dos temas encajan con lo que has contado.") : X(step.sub),
      quizDots: QUIZ.map((_, i) => ({ bg: i < st.step ? "#1f5f8b" : "rgba(23,57,92,0.12)" })),
      quizOptions: done ? [] : step.options.map((o) => ({
        label: X(o.label),
        pick: () => {
          const tally = Object.assign({}, this.state.tally);
          o.tags.forEach((t) => { tally[t] = (tally[t] || 0) + 1; });
          this.setState({ tally, step: this.state.step + 1 });
        }
      })),
      quizResults: done ? this.quizTop().map((t, i) => ({
        name: X(t.name), hint: X(t.hint), url: t.url,
        rank: i === 0 ? X("Más cercano") : X("También encaja"),
        saveLabel: isSaved(t.name) ? X("Guardado ✓") : X("Guardar"),
        save: () => this.toggleSave(t.name, t.url)
      })) : [],
      quizReset: () => this.setState({ step: 0, tally: {} }),

      need: st.need,
      country: st.country,
      onNeed: (e) => this.setState({ need: e.target.value }),
      onCountry: (e) => this.setState({ country: e.target.value }),
      pedirHeading: X(PEDIR_LABEL[st.need]) + " · " + X(COUNTRY_LABEL[st.country]),
      pedirItems: ((PEDIR[st.need] || {})[st.country] || []).map((p) => ({ name: X(p[0]), detail: X(p[1]) })),

      gameCards: GAME_SHUFFLED.map((idx) => {
        const pos = st.picked.indexOf(idx);
        const chosen = pos !== -1;
        const complete = st.picked.length === GAME_ORDER.length;
        const right = complete && st.picked[pos] === pos;
        return {
          label: X(GAME_ORDER[idx]),
          num: chosen ? String(pos + 1) : "",
          bg: !chosen ? "#fff" : complete ? (right ? "rgba(168,51,111,0.14)" : "rgba(224,132,170,0.14)") : "rgba(168,51,111,0.09)",
          border: !chosen ? "rgba(23,57,92,0.14)" : complete && !right ? "rgba(224,132,170,0.6)" : "#a8336f",
          numBg: chosen ? "#a8336f" : "rgba(23,57,92,0.08)",
          numColor: chosen ? "#fbfcfe" : "#98a1b0",
          cursor: chosen ? "default" : "pointer",
          pick: () => { if (!chosen && st.picked.length < GAME_ORDER.length) this.setState({ picked: st.picked.concat([idx]) }); }
        };
      }),
      gameFeedback: st.picked.length < GAME_ORDER.length
        ? st.picked.length + " de " + GAME_ORDER.length
        : st.picked.every((v, i) => v === i)
          ? X("Ese es el orden que suele funcionar: primero ver la tarea, después empezar.")
          : X("Ese orden funciona. Otra manera: escribir antes la tarea y partirla en trozos."),
      gameStarted: st.picked.length > 0,
      gameReset: () => this.setState({ picked: [] }),

      temaChips: TEMAS.map((t) => ({
        label: X(t),
        bg: st.tema === t ? "#6f5fc0" : "#fff",
        color: st.tema === t ? "#fdfcff" : "#17395c",
        border: st.tema === t ? "#6f5fc0" : "rgba(23,57,92,0.14)",
        pick: () => this.setState({ tema: t, limit: 6 })
      })),
      videoCount: filtered.length + (st.tema === "Todos" ? X(" vídeos en la videoteca") : X(" vídeos sobre ") + X(st.tema).toLowerCase()),
      videoCards: filtered.slice(0, st.limit).map((v) => ({
        name: v.name, tema: v.tema, href: v.href, thumbImg: thumbImg(ytThumb(v.embed)), hasThumb: !!ytThumb(v.embed), noThumb: !ytThumb(v.embed),
        role: X(v.tema) + " · " + v.source,
        ratio: "16 / 9",
        playing: st.playing === v.name,
        idle: st.playing !== v.name,
        linkLabel: X("Ver en ") + v.source,
        src: v.embed,
        play: () => this.setState({ playing: v.name })
      })),
      hasMore: filtered.length > st.limit,
      moreLabel: X("Ver más vídeos"),
      showMore: () => this.setState({ limit: st.limit + 6 }),

      hasSaved: st.saved.length > 0,
      savedRowBg: st.savedTouched ? "rgba(90,73,168,0.10)" : "transparent",
      savedItems: st.saved.map((s) => ({
        name: s.name, url: s.url,
        remove: () => this.persist(this.state.saved.filter((x) => x.name !== s.name))
      })),

      musicOpen: st.music,
      musicBg: st.music ? "rgba(29,185,84,0.22)" : "rgba(29,185,84,0.12)",
      toggleMusic: () => this.setState({ music: !st.music }),
      a11yOpen: st.a11y,
      toggleA11y: () => this.setState({ a11y: !st.a11y }),
      fsUp: () => this.setReading({ fs: Math.min(st.fs + 2, 25) }),
      fsDown: () => this.setReading({ fs: Math.max(st.fs - 2, 15) }),
      fsLabel: Math.round((st.fs / 17) * 100) + "%",
      a11yToggles: [
        ["spacing", "Letra más separada"],
        ["controls", "Botones más grandes"],
        ["contrast", "Más contraste"],
        ["guide", "Guía de lectura"],
        ["speak", "Leer en voz alta"],
        ["motion", "Reducir movimiento"]
      ].map(([key, label]) => {
        const on = !!st[key];
        return {
          label: X(label),
          bg: on ? "rgba(111,95,192,0.12)" : "#fff",
          border: on ? "#6f5fc0" : "rgba(23,57,92,0.16)",
          knobTrack: on ? "#6f5fc0" : "rgba(23,57,92,0.22)",
          knobLeft: on ? "16px" : "2px",
          toggle: () => this.setReading({ [key]: !on })
        };
      }),
      a11yReset: () => this.setReading({ fs: 17, spacing: false, controls: false, contrast: false, guide: false, speak: false, motion: false })
    };
  }
}

