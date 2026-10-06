// Page translations. No build step, no libraries.
// Language order of preference: ?lang=xx in the URL (saved), then a choice saved
// from the picker, then the browser's languages, then English.
// Only what people see is translated. Everything sent to Forminit stays in English
// (see form.js), so requests always arrive in English.
(function () {
  "use strict";

  var LANGS = [
    { code: "en", short: "EN", name: "English" },
    { code: "pt-PT", short: "PT", name: "Português (Portugal)" },
    { code: "pt-BR", short: "BR", name: "Português (Brasil)" },
    { code: "es", short: "ES", name: "Español" },
    { code: "fr", short: "FR", name: "Français" },
    { code: "de", short: "DE", name: "Deutsch" },
  ];
  var STORE_KEY = "tss-lang";
  var MAIL = '<a href="mailto:hello@tosleepstories.com">hello@tosleepstories.com</a>';

  var DICT = {
    en: {
      "picker.label": "Language",
      "meta.title": "Request your free sample ebook | To Sleep Stories",
      "meta.description": "Send a few family photos and names, and we'll email you a finished personalised, printable picture ebook starring them.",
      "doc.brandTitle": "{brand} — free sample ebook",
      "index.h1": "Request your free sample ebook",
      "index.lede": "Send a few photos and names, and we’ll email you a finished, printable picture ebook (PDF) starring that family.",
      "setup.warn": "The form is not connected yet. Add your Forminit form ID in <code>config.js</code>. See the README.",
      "count.label": "How many characters are in this book?",
      "contact.name": "Your name",
      "contact.company": "Company",
      "contact.email": "Work email (where we send the book)",
      "btn.continue": "Continue",
      "progress.single": "Who is in the book",
      "progress.many": "Character {n} of {total}",
      "person.hint": "Close, sharp photos of faces (or a pet’s head) work best. A tiny chat picture won’t look like them.",
      "btn.back": "Back",
      "btn.toStory": "Continue to the story",
      "btn.nextChar": "Next character",
      "book.setting": "Story setting",
      "scenario.forest_path": "A Walk in the Forest",
      "scenario.backyard_garden": "The Backyard Garden",
      "scenario.seaside": "A Day by the Sea",
      "scenario.starry_hill": "Stars on the Hill",
      "scenario.snowy_day": "A Snowy Day",
      "scenario.birthday_picnic": "A Birthday Picnic",
      "scenario.hidden_meadow": "The Hidden Meadow",
      "book.readingAge": "Read-aloud age",
      "book.language": "Language",
      "booklang.english": "English",
      "booklang.portuguese": "Portuguese",
      "booklang.spanish": "Spanish",
      "booklang.french": "French",
      "booklang.german": "German",
      "booklang.italian": "Italian",
      "book.notes": "Anything we should know",
      "book.notesPlaceholder": "Optional",
      "btn.request": "Request my sample ebook",
      "btn.sending": "Sending…",
      "privacy": "Photos are used only to make your book and are deleted after use. To ask for deletion, email " + MAIL + ".",
      "samples.label": "Sample covers",
      "samples.title": "Real sample ebooks",
      "cover.forest": "Sample cover: Ben's One-Dog Forest Circus (Now With Mud)",
      "cover.sock": "Sample cover: Ben's Sock Museum and the Great Bubu Wetting",
      "cover.sprinkler": "Sample cover: Ben's Mega Sprinkler and the Great Tomato Soaking",
      "cover.root": "Sample cover: Ben's Root Olympics (Bubu is Winning)",
      "thanks.title": "Thanks, we’ve got your photos | To Sleep Stories",
      "thanks.h1": "Thanks, we’ve got your photos",
      "thanks.lede": "We’ll email your finished sample ebook (a printable PDF) to you at the address you gave, usually within two working days.",
      "thanks.retake": "If a photo is too small or blurry to make a good likeness, we’ll email you to ask for another one.",
      "thanks.spam": "No email from us? Check your spam folder, or write to " + MAIL + ".",
      "thanks.back": "← Back to the form",
      "role.child": "Child",
      "role.adult": "Adult",
      "role.pet": "Pet",
      "age.baby": "Baby (under 1)",
      "age.toddler": "Toddler (1–2)",
      "age.3-5": "3–5 years",
      "age.6-9": "6–9 years",
      "age.10-12": "10–12 years",
      "card.howOld": "How old?",
      "card.title": "Character {n}",
      "card.who": "Who is this?",
      "card.name": "Name",
      "card.namePlaceholder": "Name",
      "card.photo": "Photo",
      "photo.hint": "Close-up of the face (or pet’s head).",
      "photo.oneOnlyBubble": "Please choose one photo for this person.",
      "photo.oneOnly": "Just one photo per person, please.",
      "photo.preparing": "Preparing photos…",
      "photo.readyOne": "{count} photo ready ({size}).",
      "photo.readyMany": "{count} photos ready ({size}).",
      "photo.unreadable": "“{file}” could not be read. Please use a JPEG or PNG photo.",
      "photo.tooLarge": "“{file}” is too large to send. Please choose a smaller photo.",
      "check.yourName": "Please add your name.",
      "check.email": "Please add a valid email address so we can send the book.",
      "check.charName": "Please add a name.",
      "check.photoMissing": "Please add at least one photo.",
      "check.photoOne": "Please choose one photo.",
      "err.rate": "Please wait about 30 seconds and press Send again.",
      "err.tooLargeTotal": "The photos are too large together. Try fewer photos per character.",
      "err.network": "Could not reach the server. Check your connection and try again.",
      "err.setup": "The form is not set up correctly on our side. Please email us instead.",
      "err.rejectedMsg": "Something in the form was not accepted: {msg} Please check and try again.",
      "err.rejected": "Something in the form was not accepted. Please check and try again.",
      "err.genericMsg": "Sorry, something went wrong ({msg}). Please try again.",
      "err.generic": "Sorry, something went wrong. Please try again.",
      "status.notConnected": "This form is not connected yet: add the Forminit form ID in config.js.",
      "status.sdkMissing": "The sending service did not load (an ad blocker can cause this). Please disable it for this page, or reload.",
      "status.checking": "Checking your details…",
      "status.checkDetails": "Please check your details above.",
      "status.charProblem": "Character {n}: {problem}",
      "status.totalTooBig": "The photos add up to {total}; the limit is {limit}. Please use fewer photos.",
      "status.sendingOne": "Sending {count} photo ({size})… please keep this page open.",
      "status.sendingMany": "Sending {count} photos ({size})… please keep this page open.",
      "status.couldNotSend": "Could not send. Please try again.",
    },

    "pt-PT": {
      "picker.label": "Língua",
      "meta.title": "Peça o seu ebook de amostra gratuito | To Sleep Stories",
      "meta.description": "Envie algumas fotografias e os nomes da família e enviamos-lhe por email um ebook ilustrado personalizado, pronto a imprimir, em que eles são os protagonistas.",
      "doc.brandTitle": "{brand} — ebook de amostra gratuito",
      "index.h1": "Peça o seu ebook de amostra gratuito",
      "index.lede": "Envie algumas fotografias e nomes, e enviamos-lhe por email um ebook ilustrado completo, pronto a imprimir (PDF), protagonizado por essa família.",
      "setup.warn": "O formulário ainda não está ligado. Adicione o ID do formulário Forminit em <code>config.js</code>. Consulte o README.",
      "count.label": "Quantas personagens tem este livro?",
      "contact.name": "O seu nome",
      "contact.company": "Empresa",
      "contact.email": "Email profissional (para onde enviamos o livro)",
      "btn.continue": "Continuar",
      "progress.single": "Quem entra no livro",
      "progress.many": "Personagem {n} de {total}",
      "person.hint": "Resultam melhor fotografias do rosto nítidas e tiradas de perto (ou da cabeça do animal). Uma imagem pequenina enviada por mensagem não vai ficar parecida.",
      "btn.back": "Voltar",
      "btn.toStory": "Continuar para a história",
      "btn.nextChar": "Personagem seguinte",
      "book.setting": "Cenário da história",
      "scenario.forest_path": "Um passeio na floresta",
      "scenario.backyard_garden": "O jardim lá de casa",
      "scenario.seaside": "Um dia à beira-mar",
      "scenario.starry_hill": "Estrelas na colina",
      "scenario.snowy_day": "Um dia de neve",
      "scenario.birthday_picnic": "Um piquenique de aniversário",
      "scenario.hidden_meadow": "O prado escondido",
      "book.readingAge": "Idade para leitura em voz alta",
      "book.language": "Língua",
      "booklang.english": "Inglês",
      "booklang.portuguese": "Português",
      "booklang.spanish": "Espanhol",
      "booklang.french": "Francês",
      "booklang.german": "Alemão",
      "booklang.italian": "Italiano",
      "book.notes": "Algo que devamos saber",
      "book.notesPlaceholder": "Opcional",
      "btn.request": "Pedir o meu ebook de amostra",
      "btn.sending": "A enviar…",
      "privacy": "As fotografias são usadas apenas para fazer o seu livro e são apagadas depois. Para pedir que as apaguemos, envie um email para " + MAIL + ".",
      "samples.label": "Capas de amostra",
      "samples.title": "Ebooks de amostra reais",
      "cover.forest": "Capa de amostra: Ben's One-Dog Forest Circus (Now With Mud)",
      "cover.sock": "Capa de amostra: Ben's Sock Museum and the Great Bubu Wetting",
      "cover.sprinkler": "Capa de amostra: Ben's Mega Sprinkler and the Great Tomato Soaking",
      "cover.root": "Capa de amostra: Ben's Root Olympics (Bubu is Winning)",
      "thanks.title": "Obrigado, recebemos as suas fotografias | To Sleep Stories",
      "thanks.h1": "Obrigado, recebemos as suas fotografias",
      "thanks.lede": "Vamos enviar-lhe o seu ebook de amostra (um PDF pronto a imprimir) para o email que indicou, normalmente no prazo de dois dias úteis.",
      "thanks.retake": "Se alguma fotografia for demasiado pequena ou desfocada para ficar parecida, enviamos-lhe um email a pedir outra.",
      "thanks.spam": "Não recebeu o nosso email? Veja a pasta de spam ou escreva para " + MAIL + ".",
      "thanks.back": "← Voltar ao formulário",
      "role.child": "Criança",
      "role.adult": "Adulto",
      "role.pet": "Animal de estimação",
      "age.baby": "Bebé (menos de 1 ano)",
      "age.toddler": "Criança pequena (1–2 anos)",
      "age.3-5": "3–5 anos",
      "age.6-9": "6–9 anos",
      "age.10-12": "10–12 anos",
      "card.howOld": "Que idade tem?",
      "card.title": "Personagem {n}",
      "card.who": "Quem é?",
      "card.name": "Nome",
      "card.namePlaceholder": "Nome",
      "card.photo": "Fotografia",
      "photo.hint": "Fotografia do rosto, tirada de perto (ou da cabeça do animal).",
      "photo.oneOnlyBubble": "Escolha só uma fotografia para esta pessoa.",
      "photo.oneOnly": "Só uma fotografia por pessoa, por favor.",
      "photo.preparing": "A preparar as fotografias…",
      "photo.readyOne": "{count} fotografia pronta ({size}).",
      "photo.readyMany": "{count} fotografias prontas ({size}).",
      "photo.unreadable": "Não foi possível abrir “{file}”. Use uma fotografia em JPEG ou PNG.",
      "photo.tooLarge": "“{file}” é demasiado grande para enviar. Escolha uma fotografia mais pequena.",
      "check.yourName": "Indique o seu nome.",
      "check.email": "Indique um email válido para lhe podermos enviar o livro.",
      "check.charName": "Indique um nome.",
      "check.photoMissing": "Adicione pelo menos uma fotografia.",
      "check.photoOne": "Escolha só uma fotografia.",
      "err.rate": "Aguarde cerca de 30 segundos e carregue novamente em Enviar.",
      "err.tooLargeTotal": "As fotografias, em conjunto, são demasiado grandes. Experimente com menos fotografias por personagem.",
      "err.network": "Não foi possível ligar ao servidor. Verifique a sua ligação e tente novamente.",
      "err.setup": "O formulário não está bem configurado do nosso lado. Por favor, envie-nos antes um email.",
      "err.rejectedMsg": "Algo no formulário não foi aceite: {msg} Verifique e tente novamente.",
      "err.rejected": "Algo no formulário não foi aceite. Verifique e tente novamente.",
      "err.genericMsg": "Lamentamos, algo correu mal ({msg}). Tente novamente.",
      "err.generic": "Lamentamos, algo correu mal. Tente novamente.",
      "status.notConnected": "Este formulário ainda não está ligado: adicione o ID do formulário Forminit em config.js.",
      "status.sdkMissing": "O serviço de envio não carregou (um bloqueador de anúncios pode causar isto). Desative-o nesta página ou recarregue-a.",
      "status.checking": "A verificar os seus dados…",
      "status.checkDetails": "Verifique os seus dados acima.",
      "status.charProblem": "Personagem {n}: {problem}",
      "status.totalTooBig": "As fotografias somam {total}; o limite é {limit}. Use menos fotografias.",
      "status.sendingOne": "A enviar {count} fotografia ({size})… mantenha esta página aberta.",
      "status.sendingMany": "A enviar {count} fotografias ({size})… mantenha esta página aberta.",
      "status.couldNotSend": "Não foi possível enviar. Tente novamente.",
    },

    "pt-BR": {
      "picker.label": "Idioma",
      "meta.title": "Peça seu e-book de amostra grátis | To Sleep Stories",
      "meta.description": "Envie algumas fotos e os nomes da família e mandamos por e-mail um e-book ilustrado personalizado, pronto para imprimir, com eles como protagonistas.",
      "doc.brandTitle": "{brand} — e-book de amostra grátis",
      "index.h1": "Peça seu e-book de amostra grátis",
      "index.lede": "Envie algumas fotos e nomes, e mandamos para você por e-mail um e-book ilustrado completo, pronto para imprimir (PDF), estrelado por essa família.",
      "setup.warn": "O formulário ainda não está conectado. Adicione o ID do formulário Forminit em <code>config.js</code>. Veja o README.",
      "count.label": "Quantos personagens tem este livro?",
      "contact.name": "Seu nome",
      "contact.company": "Empresa",
      "contact.email": "E-mail corporativo (para onde enviamos o livro)",
      "btn.continue": "Continuar",
      "progress.single": "Quem está no livro",
      "progress.many": "Personagem {n} de {total}",
      "person.hint": "Fotos do rosto nítidas e de perto (ou da cabeça do pet) funcionam melhor. Uma foto pequenininha tirada do chat não vai ficar parecida.",
      "btn.back": "Voltar",
      "btn.toStory": "Continuar para a história",
      "btn.nextChar": "Próximo personagem",
      "book.setting": "Cenário da história",
      "scenario.forest_path": "Um passeio na floresta",
      "scenario.backyard_garden": "O jardim do quintal",
      "scenario.seaside": "Um dia na praia",
      "scenario.starry_hill": "Estrelas no morro",
      "scenario.snowy_day": "Um dia de neve",
      "scenario.birthday_picnic": "Um piquenique de aniversário",
      "scenario.hidden_meadow": "A campina escondida",
      "book.readingAge": "Idade para leitura em voz alta",
      "book.language": "Idioma",
      "booklang.english": "Inglês",
      "booklang.portuguese": "Português",
      "booklang.spanish": "Espanhol",
      "booklang.french": "Francês",
      "booklang.german": "Alemão",
      "booklang.italian": "Italiano",
      "book.notes": "Algo que devemos saber",
      "book.notesPlaceholder": "Opcional",
      "btn.request": "Pedir meu e-book de amostra",
      "btn.sending": "Enviando…",
      "privacy": "As fotos são usadas apenas para fazer o seu livro e são apagadas depois do uso. Para pedir a exclusão, envie um e-mail para " + MAIL + ".",
      "samples.label": "Capas de amostra",
      "samples.title": "E-books de amostra reais",
      "cover.forest": "Capa de amostra: Ben's One-Dog Forest Circus (Now With Mud)",
      "cover.sock": "Capa de amostra: Ben's Sock Museum and the Great Bubu Wetting",
      "cover.sprinkler": "Capa de amostra: Ben's Mega Sprinkler and the Great Tomato Soaking",
      "cover.root": "Capa de amostra: Ben's Root Olympics (Bubu is Winning)",
      "thanks.title": "Obrigado, recebemos suas fotos | To Sleep Stories",
      "thanks.h1": "Obrigado, recebemos suas fotos",
      "thanks.lede": "Vamos enviar seu e-book de amostra (um PDF pronto para imprimir) para o e-mail que você informou, normalmente em até dois dias úteis.",
      "thanks.retake": "Se alguma foto estiver pequena ou desfocada demais para ficar parecida, vamos mandar um e-mail pedindo outra.",
      "thanks.spam": "Não recebeu nosso e-mail? Confira a pasta de spam ou escreva para " + MAIL + ".",
      "thanks.back": "← Voltar para o formulário",
      "role.child": "Criança",
      "role.adult": "Adulto",
      "role.pet": "Animal de estimação",
      "age.baby": "Bebê (menos de 1 ano)",
      "age.toddler": "Criança pequena (1–2 anos)",
      "age.3-5": "3–5 anos",
      "age.6-9": "6–9 anos",
      "age.10-12": "10–12 anos",
      "card.howOld": "Quantos anos?",
      "card.title": "Personagem {n}",
      "card.who": "Quem é?",
      "card.name": "Nome",
      "card.namePlaceholder": "Nome",
      "card.photo": "Foto",
      "photo.hint": "Foto de perto do rosto (ou da cabeça do pet).",
      "photo.oneOnlyBubble": "Escolha apenas uma foto para esta pessoa.",
      "photo.oneOnly": "Só uma foto por pessoa, por favor.",
      "photo.preparing": "Preparando as fotos…",
      "photo.readyOne": "{count} foto pronta ({size}).",
      "photo.readyMany": "{count} fotos prontas ({size}).",
      "photo.unreadable": "Não conseguimos abrir “{file}”. Use uma foto JPEG ou PNG.",
      "photo.tooLarge": "“{file}” é grande demais para enviar. Escolha uma foto menor.",
      "check.yourName": "Informe seu nome.",
      "check.email": "Informe um e-mail válido para podermos enviar o livro.",
      "check.charName": "Informe um nome.",
      "check.photoMissing": "Adicione pelo menos uma foto.",
      "check.photoOne": "Escolha apenas uma foto.",
      "err.rate": "Aguarde uns 30 segundos e clique em Enviar de novo.",
      "err.tooLargeTotal": "As fotos juntas são grandes demais. Tente com menos fotos por personagem.",
      "err.network": "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      "err.setup": "O formulário não está configurado corretamente do nosso lado. Por favor, fale com a gente por e-mail.",
      "err.rejectedMsg": "Algo no formulário não foi aceito: {msg} Confira e tente novamente.",
      "err.rejected": "Algo no formulário não foi aceito. Confira e tente novamente.",
      "err.genericMsg": "Desculpe, algo deu errado ({msg}). Tente novamente.",
      "err.generic": "Desculpe, algo deu errado. Tente novamente.",
      "status.notConnected": "Este formulário ainda não está conectado: adicione o ID do formulário Forminit em config.js.",
      "status.sdkMissing": "O serviço de envio não carregou (um bloqueador de anúncios pode causar isso). Desative-o nesta página ou recarregue.",
      "status.checking": "Verificando seus dados…",
      "status.checkDetails": "Confira seus dados acima.",
      "status.charProblem": "Personagem {n}: {problem}",
      "status.totalTooBig": "As fotos somam {total}; o limite é {limit}. Use menos fotos.",
      "status.sendingOne": "Enviando {count} foto ({size})… mantenha esta página aberta.",
      "status.sendingMany": "Enviando {count} fotos ({size})… mantenha esta página aberta.",
      "status.couldNotSend": "Não foi possível enviar. Tente novamente.",
    },

    es: {
      "picker.label": "Idioma",
      "meta.title": "Pide tu ebook de muestra gratis | To Sleep Stories",
      "meta.description": "Envía unas fotos y los nombres de la familia y te mandaremos por email un ebook ilustrado personalizado, listo para imprimir, protagonizado por ellos.",
      "doc.brandTitle": "{brand} — ebook de muestra gratis",
      "index.h1": "Pide tu ebook de muestra gratis",
      "index.lede": "Envía unas fotos y nombres, y te mandaremos por email un ebook ilustrado completo y listo para imprimir (PDF) protagonizado por esa familia.",
      "setup.warn": "El formulario aún no está conectado. Añade tu ID de formulario de Forminit en <code>config.js</code>. Consulta el README.",
      "count.label": "¿Cuántos personajes hay en este libro?",
      "contact.name": "Tu nombre",
      "contact.company": "Empresa",
      "contact.email": "Email de trabajo (donde enviaremos el libro)",
      "btn.continue": "Continuar",
      "progress.single": "Quién sale en el libro",
      "progress.many": "Personaje {n} de {total}",
      "person.hint": "Funcionan mejor las fotos nítidas y de cerca de la cara (o de la cabeza de la mascota). Una foto diminuta sacada de un chat no se parecerá.",
      "btn.back": "Atrás",
      "btn.toStory": "Continuar con la historia",
      "btn.nextChar": "Siguiente personaje",
      "book.setting": "Escenario de la historia",
      "scenario.forest_path": "Un paseo por el bosque",
      "scenario.backyard_garden": "El jardín de casa",
      "scenario.seaside": "Un día junto al mar",
      "scenario.starry_hill": "Estrellas en la colina",
      "scenario.snowy_day": "Un día de nieve",
      "scenario.birthday_picnic": "Un pícnic de cumpleaños",
      "scenario.hidden_meadow": "El prado escondido",
      "book.readingAge": "Edad para leer en voz alta",
      "book.language": "Idioma",
      "booklang.english": "Inglés",
      "booklang.portuguese": "Portugués",
      "booklang.spanish": "Español",
      "booklang.french": "Francés",
      "booklang.german": "Alemán",
      "booklang.italian": "Italiano",
      "book.notes": "Algo que debamos saber",
      "book.notesPlaceholder": "Opcional",
      "btn.request": "Pedir mi ebook de muestra",
      "btn.sending": "Enviando…",
      "privacy": "Las fotos solo se usan para hacer tu libro y se borran después. Para pedir que las borremos, escribe a " + MAIL + ".",
      "samples.label": "Portadas de muestra",
      "samples.title": "Ebooks de muestra reales",
      "cover.forest": "Portada de muestra: Ben's One-Dog Forest Circus (Now With Mud)",
      "cover.sock": "Portada de muestra: Ben's Sock Museum and the Great Bubu Wetting",
      "cover.sprinkler": "Portada de muestra: Ben's Mega Sprinkler and the Great Tomato Soaking",
      "cover.root": "Portada de muestra: Ben's Root Olympics (Bubu is Winning)",
      "thanks.title": "Gracias, hemos recibido tus fotos | To Sleep Stories",
      "thanks.h1": "Gracias, hemos recibido tus fotos",
      "thanks.lede": "Te enviaremos tu ebook de muestra (un PDF listo para imprimir) a la dirección que nos diste, normalmente en un plazo de dos días laborables.",
      "thanks.retake": "Si alguna foto es demasiado pequeña o está demasiado borrosa para que se parezca, te escribiremos para pedirte otra.",
      "thanks.spam": "¿No te ha llegado nuestro email? Revisa la carpeta de spam o escribe a " + MAIL + ".",
      "thanks.back": "← Volver al formulario",
      "role.child": "Niño/a",
      "role.adult": "Adulto",
      "role.pet": "Mascota",
      "age.baby": "Bebé (menos de 1 año)",
      "age.toddler": "Niño/a pequeño/a (1–2 años)",
      "age.3-5": "3–5 años",
      "age.6-9": "6–9 años",
      "age.10-12": "10–12 años",
      "card.howOld": "¿Qué edad tiene?",
      "card.title": "Personaje {n}",
      "card.who": "¿Quién es?",
      "card.name": "Nombre",
      "card.namePlaceholder": "Nombre",
      "card.photo": "Foto",
      "photo.hint": "Primer plano de la cara (o de la cabeza de la mascota).",
      "photo.oneOnlyBubble": "Elige solo una foto para esta persona.",
      "photo.oneOnly": "Solo una foto por persona, por favor.",
      "photo.preparing": "Preparando las fotos…",
      "photo.readyOne": "{count} foto lista ({size}).",
      "photo.readyMany": "{count} fotos listas ({size}).",
      "photo.unreadable": "No se ha podido abrir “{file}”. Usa una foto en JPEG o PNG.",
      "photo.tooLarge": "“{file}” es demasiado grande para enviarla. Elige una foto más pequeña.",
      "check.yourName": "Escribe tu nombre.",
      "check.email": "Escribe un email válido para que podamos enviarte el libro.",
      "check.charName": "Escribe un nombre.",
      "check.photoMissing": "Añade al menos una foto.",
      "check.photoOne": "Elige solo una foto.",
      "err.rate": "Espera unos 30 segundos y vuelve a pulsar Enviar.",
      "err.tooLargeTotal": "Las fotos juntas pesan demasiado. Prueba con menos fotos por personaje.",
      "err.network": "No se ha podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.",
      "err.setup": "El formulario no está bien configurado por nuestra parte. Por favor, escríbenos por email.",
      "err.rejectedMsg": "Hay algo en el formulario que no se ha aceptado: {msg} Revísalo e inténtalo de nuevo.",
      "err.rejected": "Hay algo en el formulario que no se ha aceptado. Revísalo e inténtalo de nuevo.",
      "err.genericMsg": "Lo sentimos, algo ha fallado ({msg}). Inténtalo de nuevo.",
      "err.generic": "Lo sentimos, algo ha fallado. Inténtalo de nuevo.",
      "status.notConnected": "Este formulario aún no está conectado: añade el ID del formulario de Forminit en config.js.",
      "status.sdkMissing": "El servicio de envío no se ha cargado (puede deberse a un bloqueador de anuncios). Desactívalo en esta página o recárgala.",
      "status.checking": "Comprobando tus datos…",
      "status.checkDetails": "Revisa tus datos de arriba.",
      "status.charProblem": "Personaje {n}: {problem}",
      "status.totalTooBig": "Las fotos suman {total} y el límite es {limit}. Usa menos fotos.",
      "status.sendingOne": "Enviando {count} foto ({size})… no cierres esta página.",
      "status.sendingMany": "Enviando {count} fotos ({size})… no cierres esta página.",
      "status.couldNotSend": "No se ha podido enviar. Inténtalo de nuevo.",
    },

    fr: {
      "picker.label": "Langue",
      "meta.title": "Demandez votre e-book d’essai gratuit | To Sleep Stories",
      "meta.description": "Envoyez quelques photos et les prénoms de la famille : nous vous enverrons par e-mail un e-book illustré personnalisé et imprimable, dont ils sont les héros.",
      "doc.brandTitle": "{brand} — e-book d’essai gratuit",
      "index.h1": "Demandez votre e-book d’essai gratuit",
      "index.lede": "Envoyez quelques photos et prénoms : nous vous enverrons par e-mail un e-book illustré complet et imprimable (PDF), dont cette famille est l’héroïne.",
      "setup.warn": "Le formulaire n’est pas encore connecté. Ajoutez votre identifiant de formulaire Forminit dans <code>config.js</code>. Voir le README.",
      "count.label": "Combien de personnages dans ce livre\u00a0?",
      "contact.name": "Votre nom",
      "contact.company": "Entreprise",
      "contact.email": "E-mail professionnel (où nous enverrons le livre)",
      "btn.continue": "Continuer",
      "progress.single": "Qui est dans le livre",
      "progress.many": "Personnage {n} sur {total}",
      "person.hint": "Des photos du visage nettes et prises de près (ou de la tête de l’animal) donnent les meilleurs résultats. Une minuscule image de messagerie ne sera pas ressemblante.",
      "btn.back": "Retour",
      "btn.toStory": "Passer à l’histoire",
      "btn.nextChar": "Personnage suivant",
      "book.setting": "Cadre de l’histoire",
      "scenario.forest_path": "Une promenade en forêt",
      "scenario.backyard_garden": "Le jardin de la maison",
      "scenario.seaside": "Une journée au bord de la mer",
      "scenario.starry_hill": "Des étoiles sur la colline",
      "scenario.snowy_day": "Une journée sous la neige",
      "scenario.birthday_picnic": "Un pique-nique d’anniversaire",
      "scenario.hidden_meadow": "La prairie cachée",
      "book.readingAge": "Âge pour la lecture à voix haute",
      "book.language": "Langue",
      "booklang.english": "Anglais",
      "booklang.portuguese": "Portugais",
      "booklang.spanish": "Espagnol",
      "booklang.french": "Français",
      "booklang.german": "Allemand",
      "booklang.italian": "Italien",
      "book.notes": "Quelque chose que nous devrions savoir",
      "book.notesPlaceholder": "Facultatif",
      "btn.request": "Demander mon e-book d’essai",
      "btn.sending": "Envoi en cours…",
      "privacy": "Les photos servent uniquement à créer votre livre et sont supprimées après usage. Pour demander leur suppression, écrivez à " + MAIL + ".",
      "samples.label": "Couvertures d’exemple",
      "samples.title": "De vrais e-books d’exemple",
      "cover.forest": "Couverture d’exemple\u00a0: Ben's One-Dog Forest Circus (Now With Mud)",
      "cover.sock": "Couverture d’exemple\u00a0: Ben's Sock Museum and the Great Bubu Wetting",
      "cover.sprinkler": "Couverture d’exemple\u00a0: Ben's Mega Sprinkler and the Great Tomato Soaking",
      "cover.root": "Couverture d’exemple\u00a0: Ben's Root Olympics (Bubu is Winning)",
      "thanks.title": "Merci, nous avons bien reçu vos photos | To Sleep Stories",
      "thanks.h1": "Merci, nous avons bien reçu vos photos",
      "thanks.lede": "Nous vous enverrons votre e-book d’essai (un PDF imprimable) à l’adresse indiquée, généralement sous deux jours ouvrés.",
      "thanks.retake": "Si une photo est trop petite ou trop floue pour être ressemblante, nous vous écrirons pour vous en demander une autre.",
      "thanks.spam": "Pas d’e-mail de notre part\u00a0? Vérifiez vos spams ou écrivez à " + MAIL + ".",
      "thanks.back": "← Retour au formulaire",
      "role.child": "Enfant",
      "role.adult": "Adulte",
      "role.pet": "Animal",
      "age.baby": "Bébé (moins d’1 an)",
      "age.toddler": "Tout-petit (1–2 ans)",
      "age.3-5": "3–5 ans",
      "age.6-9": "6–9 ans",
      "age.10-12": "10–12 ans",
      "card.howOld": "Quel âge\u00a0?",
      "card.title": "Personnage {n}",
      "card.who": "Qui est-ce\u00a0?",
      "card.name": "Prénom",
      "card.namePlaceholder": "Prénom",
      "card.photo": "Photo",
      "photo.hint": "Gros plan du visage (ou de la tête de l’animal).",
      "photo.oneOnlyBubble": "Choisissez une seule photo pour cette personne.",
      "photo.oneOnly": "Une seule photo par personne, s’il vous plaît.",
      "photo.preparing": "Préparation des photos…",
      "photo.readyOne": "{count} photo prête ({size}).",
      "photo.readyMany": "{count} photos prêtes ({size}).",
      "photo.unreadable": "Impossible d’ouvrir «\u00a0{file}\u00a0». Utilisez une photo JPEG ou PNG.",
      "photo.tooLarge": "«\u00a0{file}\u00a0» est trop lourde pour être envoyée. Choisissez une photo plus petite.",
      "check.yourName": "Indiquez votre nom.",
      "check.email": "Indiquez une adresse e-mail valide pour que nous puissions vous envoyer le livre.",
      "check.charName": "Indiquez un prénom.",
      "check.photoMissing": "Ajoutez au moins une photo.",
      "check.photoOne": "Choisissez une seule photo.",
      "err.rate": "Patientez environ 30 secondes, puis cliquez à nouveau sur Envoyer.",
      "err.tooLargeTotal": "Les photos sont trop lourdes au total. Essayez avec moins de photos par personnage.",
      "err.network": "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
      "err.setup": "Le formulaire est mal configuré de notre côté. Merci de nous écrire plutôt par e-mail.",
      "err.rejectedMsg": "Un élément du formulaire n’a pas été accepté\u00a0: {msg} Vérifiez et réessayez.",
      "err.rejected": "Un élément du formulaire n’a pas été accepté. Vérifiez et réessayez.",
      "err.genericMsg": "Désolé, une erreur s’est produite ({msg}). Veuillez réessayer.",
      "err.generic": "Désolé, une erreur s’est produite. Veuillez réessayer.",
      "status.notConnected": "Ce formulaire n’est pas encore connecté\u00a0: ajoutez l’identifiant du formulaire Forminit dans config.js.",
      "status.sdkMissing": "Le service d’envoi ne s’est pas chargé (un bloqueur de publicités peut en être la cause). Désactivez-le pour cette page ou rechargez-la.",
      "status.checking": "Vérification de vos informations…",
      "status.checkDetails": "Vérifiez vos informations ci-dessus.",
      "status.charProblem": "Personnage {n}\u00a0: {problem}",
      "status.totalTooBig": "Les photos pèsent {total} au total\u00a0; la limite est de {limit}. Utilisez moins de photos.",
      "status.sendingOne": "Envoi de {count} photo ({size})… merci de garder cette page ouverte.",
      "status.sendingMany": "Envoi de {count} photos ({size})… merci de garder cette page ouverte.",
      "status.couldNotSend": "Envoi impossible. Veuillez réessayer.",
    },

    de: {
      "picker.label": "Sprache",
      "meta.title": "Fordern Sie Ihr kostenloses Beispiel-E-Book an | To Sleep Stories",
      "meta.description": "Schicken Sie uns ein paar Familienfotos und Namen – wir senden Ihnen per E-Mail ein fertiges, personalisiertes Bilder-E-Book zum Ausdrucken, in dem genau diese Familie die Hauptrolle spielt.",
      "doc.brandTitle": "{brand} — kostenloses Beispiel-E-Book",
      "index.h1": "Fordern Sie Ihr kostenloses Beispiel-E-Book an",
      "index.lede": "Schicken Sie uns ein paar Fotos und Namen – wir senden Ihnen per E-Mail ein fertiges Bilder-E-Book zum Ausdrucken (PDF), in dem diese Familie die Hauptrolle spielt.",
      "setup.warn": "Das Formular ist noch nicht verbunden. Tragen Sie Ihre Forminit-Formular-ID in <code>config.js</code> ein. Siehe README.",
      "count.label": "Wie viele Figuren kommen in diesem Buch vor?",
      "contact.name": "Ihr Name",
      "contact.company": "Firma",
      "contact.email": "Geschäftliche E-Mail (an diese Adresse senden wir das Buch)",
      "btn.continue": "Weiter",
      "progress.single": "Wer im Buch vorkommt",
      "progress.many": "Figur {n} von {total}",
      "person.hint": "Am besten eignen sich scharfe Nahaufnahmen von Gesichtern (oder vom Kopf des Haustiers). Ein winziges Bild aus einem Chat wird nicht ähnlich aussehen.",
      "btn.back": "Zurück",
      "btn.toStory": "Weiter zur Geschichte",
      "btn.nextChar": "Nächste Figur",
      "book.setting": "Schauplatz der Geschichte",
      "scenario.forest_path": "Ein Spaziergang im Wald",
      "scenario.backyard_garden": "Der Garten hinterm Haus",
      "scenario.seaside": "Ein Tag am Meer",
      "scenario.starry_hill": "Sterne auf dem Hügel",
      "scenario.snowy_day": "Ein Tag im Schnee",
      "scenario.birthday_picnic": "Ein Geburtstagspicknick",
      "scenario.hidden_meadow": "Die versteckte Wiese",
      "book.readingAge": "Alter zum Vorlesen",
      "book.language": "Sprache",
      "booklang.english": "Englisch",
      "booklang.portuguese": "Portugiesisch",
      "booklang.spanish": "Spanisch",
      "booklang.french": "Französisch",
      "booklang.german": "Deutsch",
      "booklang.italian": "Italienisch",
      "book.notes": "Was wir sonst noch wissen sollten",
      "book.notesPlaceholder": "Optional",
      "btn.request": "Mein Beispiel-E-Book anfordern",
      "btn.sending": "Wird gesendet…",
      "privacy": "Fotos werden nur für Ihr Buch verwendet und danach gelöscht. Wenn Sie die Löschung wünschen, schreiben Sie an " + MAIL + ".",
      "samples.label": "Beispiel-Cover",
      "samples.title": "Echte Beispiel-E-Books",
      "cover.forest": "Beispiel-Cover: Ben's One-Dog Forest Circus (Now With Mud)",
      "cover.sock": "Beispiel-Cover: Ben's Sock Museum and the Great Bubu Wetting",
      "cover.sprinkler": "Beispiel-Cover: Ben's Mega Sprinkler and the Great Tomato Soaking",
      "cover.root": "Beispiel-Cover: Ben's Root Olympics (Bubu is Winning)",
      "thanks.title": "Danke, wir haben Ihre Fotos erhalten | To Sleep Stories",
      "thanks.h1": "Danke, wir haben Ihre Fotos erhalten",
      "thanks.lede": "Wir senden Ihr fertiges Beispiel-E-Book (ein druckfertiges PDF) an die angegebene Adresse, meist innerhalb von zwei Werktagen.",
      "thanks.retake": "Falls ein Foto zu klein oder zu unscharf für eine gute Ähnlichkeit ist, melden wir uns per E-Mail und bitten um ein anderes.",
      "thanks.spam": "Keine E-Mail von uns erhalten? Schauen Sie in Ihren Spam-Ordner oder schreiben Sie an " + MAIL + ".",
      "thanks.back": "← Zurück zum Formular",
      "role.child": "Kind",
      "role.adult": "Erwachsener",
      "role.pet": "Haustier",
      "age.baby": "Baby (unter 1)",
      "age.toddler": "Kleinkind (1–2)",
      "age.3-5": "3–5 Jahre",
      "age.6-9": "6–9 Jahre",
      "age.10-12": "10–12 Jahre",
      "card.howOld": "Wie alt?",
      "card.title": "Figur {n}",
      "card.who": "Wer ist das?",
      "card.name": "Name",
      "card.namePlaceholder": "Name",
      "card.photo": "Foto",
      "photo.hint": "Nahaufnahme des Gesichts (oder des Kopfes beim Haustier).",
      "photo.oneOnlyBubble": "Bitte wählen Sie ein Foto für diese Person.",
      "photo.oneOnly": "Bitte nur ein Foto pro Person.",
      "photo.preparing": "Fotos werden vorbereitet…",
      "photo.readyOne": "{count} Foto bereit ({size}).",
      "photo.readyMany": "{count} Fotos bereit ({size}).",
      "photo.unreadable": "„{file}“ konnte nicht geöffnet werden. Bitte verwenden Sie ein JPEG- oder PNG-Foto.",
      "photo.tooLarge": "„{file}“ ist zu groß zum Senden. Bitte wählen Sie ein kleineres Foto.",
      "check.yourName": "Bitte geben Sie Ihren Namen ein.",
      "check.email": "Bitte geben Sie eine gültige E-Mail-Adresse ein, damit wir Ihnen das Buch senden können.",
      "check.charName": "Bitte geben Sie einen Namen ein.",
      "check.photoMissing": "Bitte fügen Sie mindestens ein Foto hinzu.",
      "check.photoOne": "Bitte wählen Sie nur ein Foto.",
      "err.rate": "Bitte warten Sie etwa 30 Sekunden und klicken Sie dann erneut auf Senden.",
      "err.tooLargeTotal": "Die Fotos sind zusammen zu groß. Versuchen Sie es mit weniger Fotos pro Figur.",
      "err.network": "Der Server ist nicht erreichbar. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
      "err.setup": "Das Formular ist bei uns nicht richtig eingerichtet. Bitte schreiben Sie uns stattdessen eine E-Mail.",
      "err.rejectedMsg": "Etwas im Formular wurde nicht akzeptiert: {msg} Bitte prüfen Sie Ihre Angaben und versuchen Sie es erneut.",
      "err.rejected": "Etwas im Formular wurde nicht akzeptiert. Bitte prüfen Sie Ihre Angaben und versuchen Sie es erneut.",
      "err.genericMsg": "Leider ist etwas schiefgelaufen ({msg}). Bitte versuchen Sie es erneut.",
      "err.generic": "Leider ist etwas schiefgelaufen. Bitte versuchen Sie es erneut.",
      "status.notConnected": "Dieses Formular ist noch nicht verbunden: Tragen Sie die Forminit-Formular-ID in config.js ein.",
      "status.sdkMissing": "Der Versanddienst wurde nicht geladen (das kann an einem Werbeblocker liegen). Bitte deaktivieren Sie ihn für diese Seite oder laden Sie die Seite neu.",
      "status.checking": "Ihre Angaben werden geprüft…",
      "status.checkDetails": "Bitte prüfen Sie Ihre Angaben oben.",
      "status.charProblem": "Figur {n}: {problem}",
      "status.totalTooBig": "Die Fotos sind zusammen {total} groß; das Limit liegt bei {limit}. Bitte verwenden Sie weniger Fotos.",
      "status.sendingOne": "{count} Foto wird gesendet ({size})… bitte lassen Sie diese Seite geöffnet.",
      "status.sendingMany": "{count} Fotos werden gesendet ({size})… bitte lassen Sie diese Seite geöffnet.",
      "status.couldNotSend": "Senden fehlgeschlagen. Bitte versuchen Sie es erneut.",
    },
  };

  // ---- Language detection ---------------------------------------------------
  // Maps any language tag to a supported code, or null.
  // pt-BR -> Brazilian Portuguese; pt and every other pt-* -> European Portuguese.
  function normalize(tag) {
    var s = String(tag || "").trim().toLowerCase().replace(/_/g, "-");
    if (!s) return null;
    if (s === "pt-br" || s === "br") return "pt-BR";
    var base = s.split("-")[0];
    if (base === "pt") return "pt-PT";
    if (base === "en" || base === "es" || base === "fr" || base === "de") return base;
    return null;
  }

  function loadSaved() {
    try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function save(code) {
    try { window.localStorage.setItem(STORE_KEY, code); } catch (e) { /* private mode: ignore */ }
  }
  function urlParam() {
    try { return new URLSearchParams(window.location.search).get("lang"); } catch (e) { return null; }
  }

  function detect() {
    var fromUrl = normalize(urlParam());
    if (fromUrl) { save(fromUrl); return fromUrl; }
    var saved = normalize(loadSaved());
    if (saved) return saved;
    var nav = window.navigator || {};
    var list = (nav.languages && nav.languages.length) ? nav.languages : [nav.language || nav.userLanguage];
    for (var i = 0; i < list.length; i += 1) {
      var match = normalize(list[i]);
      if (match) return match;
    }
    return "en";
  }

  var current = detect();

  // ---- Lookup and apply ----------------------------------------------------
  function t(key, vars) {
    var table = DICT[current] || DICT.en;
    var text = Object.prototype.hasOwnProperty.call(table, key) ? table[key] : DICT.en[key];
    if (text == null) return key;
    if (vars) {
      text = text.replace(/\{(\w+)\}/g, function (m, name) {
        return Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : m;
      });
    }
    return text;
  }

  var ATTRS = ["placeholder", "alt", "content", "aria-label", "title"];
  var SELECTOR = "[data-i18n],[data-i18n-html]," + ATTRS.map(function (a) { return "[data-i18n-" + a + "]"; }).join(",");

  function translateElement(el) {
    var vars = null;
    var raw = el.getAttribute("data-i18n-vars");
    if (raw) { try { vars = JSON.parse(raw); } catch (e) { vars = null; } }
    var key = el.getAttribute("data-i18n");
    if (key) el.textContent = t(key, vars);
    var htmlKey = el.getAttribute("data-i18n-html");
    if (htmlKey) el.innerHTML = t(htmlKey, vars); // only our own dictionary text
    ATTRS.forEach(function (attr) {
      var k = el.getAttribute("data-i18n-" + attr);
      if (k) el.setAttribute(attr, t(k, vars));
    });
  }

  function apply(root) {
    root = root || document;
    document.documentElement.setAttribute("lang", current);
    if (root.nodeType === 1 && root.matches(SELECTOR)) translateElement(root);
    var els = root.querySelectorAll(SELECTOR);
    for (var i = 0; i < els.length; i += 1) translateElement(els[i]);
  }

  // Sets an element's text from a key and remembers it, so a language switch updates it.
  function set(el, key, vars) {
    el.setAttribute("data-i18n", key);
    if (vars) el.setAttribute("data-i18n-vars", JSON.stringify(vars));
    else el.removeAttribute("data-i18n-vars");
    el.textContent = t(key, vars);
  }
  // Sets already-translated text and forgets any key on the element.
  function setText(el, text) {
    el.removeAttribute("data-i18n");
    el.removeAttribute("data-i18n-vars");
    el.textContent = text;
  }

  // Number with one decimal in the page language (English keeps "1.5").
  function decimal(n) {
    if (current === "en") return n.toFixed(1);
    try {
      return n.toLocaleString(current, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    } catch (e) {
      return n.toFixed(1);
    }
  }

  var picker = null;

  function setLang(code) {
    code = normalize(code) || "en";
    current = code;
    save(code);
    // Keep a ?lang= link in the address bar in step with the choice.
    try {
      var url = new URL(window.location.href);
      if (url.searchParams.has("lang")) {
        url.searchParams.set("lang", code);
        window.history.replaceState(null, "", url.toString());
      }
    } catch (e) { /* ignore */ }
    apply();
    if (picker) picker.value = code;
    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: code } }));
  }

  // Small language picker in the masthead corner (built here so it only appears with JS).
  function buildPicker() {
    var host = document.getElementById("lang-picker");
    if (!host) return;
    picker = document.createElement("select");
    picker.setAttribute("data-i18n-aria-label", "picker.label");
    picker.setAttribute("aria-label", t("picker.label"));
    LANGS.forEach(function (l) {
      var opt = document.createElement("option");
      opt.value = l.code;
      opt.textContent = l.short;
      opt.title = l.name;
      opt.lang = l.code;
      picker.appendChild(opt);
    });
    picker.value = current;
    picker.addEventListener("change", function () { setLang(picker.value); });
    host.appendChild(picker);
  }

  window.I18N = {
    t: t,
    apply: apply,
    set: set,
    setText: setText,
    setLang: setLang,
    decimal: decimal,
    normalize: normalize,
    languages: LANGS.map(function (l) { return l.code; }),
    dictionaries: DICT,
    get lang() { return current; },
  };

  apply();
  buildPicker();
})();
