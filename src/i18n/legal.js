/**
 * Aviso de privacidad y términos, en los tres idiomas.
 *
 * Antes vivían como HTML suelto dentro de `src/pages/privacidad.astro` y
 * `terminos.astro`, y solo existían en español. El problema no era de traducción
 * sino de enlaces: el pie de página de /en/ y /pt/ apuntaba a esas dos URLs, así
 * que un visitante en inglés hacía clic en "Privacy" y aterrizaba en un
 * documento en español con `lang="es-MX"`.
 *
 * El texto se guarda como datos y no como marcado para que las tres versiones
 * compartan estructura: si mañana se agrega una sección al aviso, se agrega una
 * vez y las tres la reciben o falta en todas de forma evidente.
 *
 * Los datos de contacto NO se escriben aquí: se dejan como marcas —{email},
 * {city}, {region}, {phone}, {url}— y las rellena `Legal.astro` desde
 * `data/seo.ts`. Un teléfono repetido a mano en seis documentos es un teléfono
 * que algún día va a estar desactualizado en cinco.
 *
 * AVISO: esto es una traducción del documento mexicano, no un documento legal
 * redactado para otra jurisdicción. Sigue rigiéndose por la LFPDPPP y por
 * tribunales de Hidalgo del Parral, y así lo dice en los tres idiomas. Si algún
 * día se vende con contrato en Estados Unidos o Brasil, esto lo tiene que
 * revisar un abogado de allá — traducir no es adaptar.
 */

/** Fecha de última actualización, común a los dos documentos. */
export const LEGAL_UPDATED = {
  es: '17 de agosto de 2026',
  en: 'August 17, 2026',
  pt: '17 de agosto de 2026',
};

export const LEGAL = {
  privacy: {
    es: {
      heading: 'Aviso de Privacidad',
      intro: 'Este aviso describe cómo Geck Codex recaba, usa y protege los datos personales que nos proporcionas a través de este sitio web.',
      sections: [
        {
          h2: '1. Responsable de los datos',
          blocks: [
            { p: '<strong>Geck Codex</strong>, con domicilio en {city}, {region}, México, es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).' },
            { p: 'Contacto para asuntos de privacidad: <a href="mailto:{email}">{email}</a> · WhatsApp {phone}.' },
          ],
        },
        {
          h2: '2. Datos personales que recabamos',
          blocks: [
            { p: 'Recabamos únicamente los datos que tú nos proporcionas de forma voluntaria:' },
            { ul: [
              '<strong>Datos de contacto:</strong> nombre, correo electrónico y, si nos escribes por WhatsApp, tu número telefónico.',
              '<strong>Contenido del mensaje:</strong> la descripción del proyecto o consulta que envías en el formulario de contacto.',
              '<strong>Datos de navegación:</strong> páginas visitadas, tipo de dispositivo, navegador, origen del tráfico y duración de la visita, recabados mediante cookies y herramientas de analítica.',
            ] },
            { p: 'No recabamos datos personales sensibles ni datos financieros a través de este sitio. Nunca solicitamos contraseñas ni números de tarjeta por formulario, correo o mensajería.' },
          ],
        },
        {
          h2: '3. Finalidades del tratamiento',
          blocks: [
            { p: 'Usamos tus datos para:' },
            { ul: [
              'Responder tu solicitud de información o cotización.',
              'Dar seguimiento comercial al proyecto que nos planteas.',
              'Prestar los servicios contratados y darles soporte.',
              'Medir el desempeño del sitio y de nuestras campañas publicitarias de forma agregada.',
            ] },
            { p: 'No vendemos, rentamos ni comercializamos tus datos personales con terceros. No enviamos comunicaciones promocionales masivas sin tu consentimiento previo.' },
          ],
        },
        {
          h2: '4. Transferencia de datos a terceros',
          blocks: [
            { p: 'Para operar el sitio y atender tus solicitudes usamos proveedores que pueden procesar datos por cuenta nuestra, exclusivamente con las finalidades descritas arriba:' },
            { ul: [
              '<strong>Web3Forms</strong> — procesamiento y envío del formulario de contacto.',
              '<strong>Google (Analytics y Google Ads)</strong> — medición de tráfico y desempeño publicitario.',
              '<strong>Meta / WhatsApp</strong> — cuando eliges contactarnos por ese canal.',
              '<strong>Proveedor de hospedaje del sitio</strong> — entrega de las páginas y registros técnicos.',
            ] },
            { p: 'Estos proveedores pueden almacenar información fuera de México, bajo sus propias políticas de privacidad.' },
          ],
        },
        {
          h2: '5. Cookies y tecnologías de rastreo',
          blocks: [
            { p: 'Este sitio usa cookies y almacenamiento local del navegador para dos propósitos: recordar tus preferencias (idioma y tema claro/oscuro) y medir el tráfico y el desempeño de nuestras campañas publicitarias. Puedes bloquear o borrar las cookies desde la configuración de tu navegador; algunas preferencias del sitio dejarán de recordarse si lo haces.' },
            { p: 'Google puede usar cookies para mostrar anuncios basados en visitas previas a este sitio. Puedes desactivar la publicidad personalizada en <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">la configuración de anuncios de Google</a>.' },
          ],
        },
        {
          h2: '6. Derechos ARCO',
          blocks: [
            { p: 'Tienes derecho a <strong>Acceder</strong> a tus datos personales, <strong>Rectificarlos</strong> cuando sean inexactos, <strong>Cancelarlos</strong> cuando consideres que no son necesarios, y a <strong>Oponerte</strong> a su tratamiento. También puedes revocar tu consentimiento en cualquier momento.' },
            { p: 'Para ejercer cualquiera de estos derechos, envía tu solicitud a <a href="mailto:{email}">{email}</a> indicando tu nombre, el derecho que deseas ejercer y un medio de contacto. Responderemos en un plazo máximo de 20 días hábiles.' },
          ],
        },
        {
          h2: '7. Conservación y seguridad',
          blocks: [
            { p: 'Conservamos tus datos de contacto mientras exista una relación comercial o un proceso de cotización activo, y hasta por 24 meses después del último contacto, salvo obligación legal en contrario. Aplicamos medidas técnicas y administrativas razonables para proteger la información contra pérdida, uso indebido o acceso no autorizado.' },
          ],
        },
        {
          h2: '8. Menores de edad',
          blocks: [
            { p: 'Este sitio y nuestros servicios están dirigidos a personas mayores de 18 años. No recabamos intencionalmente datos de menores de edad.' },
          ],
        },
        {
          h2: '9. Cambios a este aviso',
          blocks: [
            { p: 'Podemos actualizar este aviso de privacidad. La versión vigente siempre estará publicada en <a href="{url}">{url}</a> con su fecha de última actualización.' },
          ],
        },
      ],
    },

    en: {
      heading: 'Privacy Notice',
      intro: 'This notice describes how Geck Codex collects, uses and protects the personal data you provide through this website.',
      sections: [
        {
          h2: '1. Data controller',
          blocks: [
            { p: '<strong>Geck Codex</strong>, based in {city}, {region}, Mexico, is responsible for processing your personal data under the Mexican Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP).' },
            { p: 'Privacy contact: <a href="mailto:{email}">{email}</a> · WhatsApp {phone}.' },
          ],
        },
        {
          h2: '2. Personal data we collect',
          blocks: [
            { p: 'We only collect the data you give us voluntarily:' },
            { ul: [
              '<strong>Contact details:</strong> name, email address and, if you write to us on WhatsApp, your phone number.',
              '<strong>Message content:</strong> the description of the project or enquiry you send through the contact form.',
              '<strong>Browsing data:</strong> pages visited, device type, browser, traffic source and time on site, collected through cookies and analytics tools.',
            ] },
            { p: 'We do not collect sensitive personal data or financial data through this site. We never ask for passwords or card numbers by form, email or messaging.' },
          ],
        },
        {
          h2: '3. Purposes of processing',
          blocks: [
            { p: 'We use your data to:' },
            { ul: [
              'Answer your request for information or a quote.',
              'Follow up commercially on the project you bring to us.',
              'Deliver and support the services you hire.',
              'Measure the performance of the site and our advertising campaigns in aggregate.',
            ] },
            { p: 'We do not sell, rent or trade your personal data with third parties. We do not send mass promotional communications without your prior consent.' },
          ],
        },
        {
          h2: '4. Transfers to third parties',
          blocks: [
            { p: 'To run the site and handle your requests we use providers that may process data on our behalf, solely for the purposes described above:' },
            { ul: [
              '<strong>Web3Forms</strong> — processing and delivery of the contact form.',
              '<strong>Google (Analytics and Google Ads)</strong> — traffic measurement and advertising performance.',
              '<strong>Meta / WhatsApp</strong> — when you choose to contact us through that channel.',
              '<strong>Our hosting provider</strong> — page delivery and technical logs.',
            ] },
            { p: 'These providers may store information outside Mexico, under their own privacy policies.' },
          ],
        },
        {
          h2: '5. Cookies and tracking technologies',
          blocks: [
            { p: 'This site uses cookies and browser local storage for two purposes: remembering your preferences (language and light/dark theme) and measuring traffic and the performance of our advertising campaigns. You can block or delete cookies from your browser settings; some site preferences will stop being remembered if you do.' },
            { p: 'Google may use cookies to show ads based on previous visits to this site. You can turn off personalised advertising in <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google\'s ad settings</a>.' },
          ],
        },
        {
          h2: '6. Your ARCO rights',
          blocks: [
            { p: 'You have the right to <strong>Access</strong> your personal data, <strong>Rectify</strong> it when inaccurate, <strong>Cancel</strong> it when you consider it unnecessary, and to <strong>Object</strong> to its processing. You may also withdraw your consent at any time.' },
            { p: 'To exercise any of these rights, send your request to <a href="mailto:{email}">{email}</a> stating your name, the right you wish to exercise and a way to reach you. We respond within a maximum of 20 business days.' },
          ],
        },
        {
          h2: '7. Retention and security',
          blocks: [
            { p: 'We keep your contact details while a commercial relationship or an active quoting process exists, and for up to 24 months after the last contact, unless a legal obligation says otherwise. We apply reasonable technical and administrative measures to protect information against loss, misuse or unauthorised access.' },
          ],
        },
        {
          h2: '8. Minors',
          blocks: [
            { p: 'This site and our services are directed at people over 18. We do not knowingly collect data from minors.' },
          ],
        },
        {
          h2: '9. Changes to this notice',
          blocks: [
            { p: 'We may update this privacy notice. The version in force will always be published at <a href="{url}">{url}</a> with its last updated date.' },
          ],
        },
      ],
    },

    pt: {
      heading: 'Aviso de Privacidade',
      intro: 'Este aviso descreve como a Geck Codex coleta, usa e protege os dados pessoais que você nos fornece por meio deste site.',
      sections: [
        {
          h2: '1. Responsável pelos dados',
          blocks: [
            { p: 'A <strong>Geck Codex</strong>, com sede em {city}, {region}, México, é responsável pelo tratamento dos seus dados pessoais conforme a Lei Federal de Proteção de Dados Pessoais em Posse de Particulares do México (LFPDPPP).' },
            { p: 'Contato para assuntos de privacidade: <a href="mailto:{email}">{email}</a> · WhatsApp {phone}.' },
          ],
        },
        {
          h2: '2. Dados pessoais que coletamos',
          blocks: [
            { p: 'Coletamos apenas os dados que você nos fornece voluntariamente:' },
            { ul: [
              '<strong>Dados de contato:</strong> nome, e-mail e, se você nos escrever pelo WhatsApp, seu telefone.',
              '<strong>Conteúdo da mensagem:</strong> a descrição do projeto ou consulta que você envia pelo formulário de contato.',
              '<strong>Dados de navegação:</strong> páginas visitadas, tipo de dispositivo, navegador, origem do tráfego e duração da visita, coletados por cookies e ferramentas de análise.',
            ] },
            { p: 'Não coletamos dados pessoais sensíveis nem dados financeiros por este site. Nunca pedimos senhas ou números de cartão por formulário, e-mail ou mensagem.' },
          ],
        },
        {
          h2: '3. Finalidades do tratamento',
          blocks: [
            { p: 'Usamos seus dados para:' },
            { ul: [
              'Responder ao seu pedido de informação ou orçamento.',
              'Dar seguimento comercial ao projeto que você nos apresenta.',
              'Prestar e dar suporte aos serviços contratados.',
              'Medir o desempenho do site e das nossas campanhas publicitárias de forma agregada.',
            ] },
            { p: 'Não vendemos, alugamos nem comercializamos seus dados pessoais com terceiros. Não enviamos comunicações promocionais em massa sem o seu consentimento prévio.' },
          ],
        },
        {
          h2: '4. Transferência de dados a terceiros',
          blocks: [
            { p: 'Para operar o site e atender aos seus pedidos usamos fornecedores que podem processar dados por nossa conta, exclusivamente com as finalidades descritas acima:' },
            { ul: [
              '<strong>Web3Forms</strong> — processamento e envio do formulário de contato.',
              '<strong>Google (Analytics e Google Ads)</strong> — medição de tráfego e desempenho publicitário.',
              '<strong>Meta / WhatsApp</strong> — quando você escolhe nos contatar por esse canal.',
              '<strong>Provedor de hospedagem do site</strong> — entrega das páginas e registros técnicos.',
            ] },
            { p: 'Esses fornecedores podem armazenar informação fora do México, sob suas próprias políticas de privacidade.' },
          ],
        },
        {
          h2: '5. Cookies e tecnologias de rastreamento',
          blocks: [
            { p: 'Este site usa cookies e armazenamento local do navegador para dois propósitos: lembrar suas preferências (idioma e tema claro/escuro) e medir o tráfego e o desempenho das nossas campanhas publicitárias. Você pode bloquear ou apagar os cookies nas configurações do navegador; algumas preferências do site deixarão de ser lembradas se fizer isso.' },
            { p: 'O Google pode usar cookies para exibir anúncios com base em visitas anteriores a este site. Você pode desativar a publicidade personalizada nas <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">configurações de anúncios do Google</a>.' },
          ],
        },
        {
          h2: '6. Direitos ARCO',
          blocks: [
            { p: 'Você tem direito de <strong>Acessar</strong> seus dados pessoais, <strong>Retificá-los</strong> quando estiverem inexatos, <strong>Cancelá-los</strong> quando considerar que não são necessários, e de <strong>Opor-se</strong> ao seu tratamento. Também pode revogar seu consentimento a qualquer momento.' },
            { p: 'Para exercer qualquer desses direitos, envie seu pedido para <a href="mailto:{email}">{email}</a> indicando seu nome, o direito que deseja exercer e um meio de contato. Respondemos em no máximo 20 dias úteis.' },
          ],
        },
        {
          h2: '7. Conservação e segurança',
          blocks: [
            { p: 'Mantemos seus dados de contato enquanto existir uma relação comercial ou um processo de orçamento ativo, e por até 24 meses após o último contato, salvo obrigação legal em contrário. Aplicamos medidas técnicas e administrativas razoáveis para proteger a informação contra perda, uso indevido ou acesso não autorizado.' },
          ],
        },
        {
          h2: '8. Menores de idade',
          blocks: [
            { p: 'Este site e nossos serviços são dirigidos a maiores de 18 anos. Não coletamos intencionalmente dados de menores de idade.' },
          ],
        },
        {
          h2: '9. Alterações neste aviso',
          blocks: [
            { p: 'Podemos atualizar este aviso de privacidade. A versão vigente estará sempre publicada em <a href="{url}">{url}</a> com sua data de última atualização.' },
          ],
        },
      ],
    },
  },

  terms: {
    es: {
      heading: 'Términos y Condiciones',
      intro: 'Condiciones que rigen el uso de este sitio web y la contratación de los servicios de Geck Codex.',
      sections: [
        { h2: '1. Quiénes somos', blocks: [
          { p: '<strong>Geck Codex</strong> es una agencia de desarrollo de software con domicilio en {city}, {region}, México. Contacto: <a href="mailto:{email}">{email}</a> · WhatsApp {phone}.' },
        ] },
        { h2: '2. Aceptación', blocks: [
          { p: 'Al navegar en geckcodex.com aceptas estos términos. Si no estás de acuerdo con ellos, te pedimos no utilizar el sitio.' },
        ] },
        { h2: '3. Naturaleza de la información publicada', blocks: [
          { p: 'El contenido de este sitio —descripciones de servicios, casos de portafolio, tecnologías y procesos— tiene fines informativos. No constituye una oferta vinculante ni un contrato. Toda contratación se formaliza mediante una propuesta o contrato escrito y firmado por ambas partes, donde se define alcance, entregables, tiempos, costos y condiciones de pago.' },
        ] },
        { h2: '4. Cotizaciones', blocks: [
          { p: 'Las cotizaciones se elaboran a partir del alcance descrito por el cliente. Tienen una vigencia indicada en el documento y pueden ajustarse si el alcance cambia. La consultoría inicial y la cotización no tienen costo ni obligan a contratar.' },
        ] },
        { h2: '5. Propiedad intelectual', blocks: [
          { h3: 'Del sitio' },
          { p: 'La marca Geck Codex, el logotipo, los textos, el diseño y el código de este sitio son propiedad de Geck Codex. No pueden reproducirse, copiarse ni distribuirse sin autorización escrita.' },
          { h3: 'De los proyectos' },
          { p: 'La titularidad del software desarrollado para un cliente se define en el contrato de cada proyecto, y por regla general se transfiere al cliente una vez liquidado el pago total, salvo componentes, librerías o herramientas propias de Geck Codex y software de terceros, que se licencian para su uso dentro del proyecto entregado.' },
          { p: 'Salvo acuerdo en contrario, Geck Codex puede mostrar el trabajo realizado en su portafolio y materiales promocionales.' },
        ] },
        { h2: '6. Portafolio y marcas de terceros', blocks: [
          { p: 'Los nombres, logotipos y marcas de clientes y tecnologías mostrados en este sitio pertenecen a sus respectivos titulares y se usan únicamente con fines ilustrativos y de referencia de trabajos realizados.' },
        ] },
        { h2: '7. Enlaces externos', blocks: [
          { p: 'El sitio contiene enlaces a servicios de terceros (WhatsApp, Instagram, tiendas de aplicaciones, sitios de clientes). Geck Codex no controla ni se responsabiliza del contenido, disponibilidad o políticas de esos sitios.' },
        ] },
        { h2: '8. Limitación de responsabilidad', blocks: [
          { p: 'El sitio se ofrece "tal cual". Aunque procuramos que la información esté completa y actualizada, no garantizamos que esté libre de errores ni que el sitio opere sin interrupciones. Geck Codex no será responsable por daños indirectos o incidentales derivados del uso del sitio. Las responsabilidades sobre servicios contratados se rigen exclusivamente por el contrato del proyecto.' },
        ] },
        { h2: '9. Uso permitido', blocks: [
          { p: 'No está permitido usar este sitio para actividades ilícitas, intentar vulnerar su seguridad, extraer contenido de forma automatizada con fines comerciales, ni enviar contenido ofensivo o fraudulento a través del formulario de contacto.' },
        ] },
        { h2: '10. Privacidad', blocks: [
          { p: 'El tratamiento de datos personales se rige por nuestro <a href="{privacyUrl}">Aviso de Privacidad</a>.' },
        ] },
        { h2: '11. Modificaciones', blocks: [
          { p: 'Podemos actualizar estos términos en cualquier momento. La versión vigente es la publicada en esta página, con su fecha de última actualización.' },
        ] },
        { h2: '12. Ley aplicable', blocks: [
          { p: 'Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia se someterá a los tribunales competentes de Hidalgo del Parral, Chihuahua, renunciando a cualquier otro fuero.' },
        ] },
      ],
    },

    en: {
      heading: 'Terms and Conditions',
      intro: 'The terms governing the use of this website and the hiring of Geck Codex services.',
      sections: [
        { h2: '1. Who we are', blocks: [
          { p: '<strong>Geck Codex</strong> is a software development agency based in {city}, {region}, Mexico. Contact: <a href="mailto:{email}">{email}</a> · WhatsApp {phone}.' },
        ] },
        { h2: '2. Acceptance', blocks: [
          { p: 'By browsing geckcodex.com you accept these terms. If you do not agree with them, please do not use the site.' },
        ] },
        { h2: '3. Nature of the published information', blocks: [
          { p: 'The content of this site — service descriptions, portfolio cases, technologies and processes — is informational. It is not a binding offer or a contract. Any engagement is formalised through a proposal or contract signed in writing by both parties, defining scope, deliverables, timelines, costs and payment terms.' },
        ] },
        { h2: '4. Quotes', blocks: [
          { p: 'Quotes are prepared from the scope described by the client. They are valid for the period stated in the document and may be adjusted if the scope changes. The initial consultation and the quote are free and carry no obligation to hire.' },
        ] },
        { h2: '5. Intellectual property', blocks: [
          { h3: 'Of the site' },
          { p: 'The Geck Codex brand, logo, texts, design and code of this site are the property of Geck Codex. They may not be reproduced, copied or distributed without written authorisation.' },
          { h3: 'Of the projects' },
          { p: 'Ownership of software developed for a client is defined in each project contract, and as a rule transfers to the client once payment is settled in full, except for components, libraries or tools belonging to Geck Codex and third-party software, which are licensed for use within the delivered project.' },
          { p: 'Unless agreed otherwise, Geck Codex may show the work produced in its portfolio and promotional materials.' },
        ] },
        { h2: '6. Portfolio and third-party trademarks', blocks: [
          { p: 'The names, logos and trademarks of clients and technologies shown on this site belong to their respective owners and are used solely to illustrate and reference work carried out.' },
        ] },
        { h2: '7. External links', blocks: [
          { p: 'The site contains links to third-party services (WhatsApp, Instagram, app stores, client sites). Geck Codex does not control and is not responsible for the content, availability or policies of those sites.' },
        ] },
        { h2: '8. Limitation of liability', blocks: [
          { p: 'The site is provided "as is". While we aim to keep the information complete and up to date, we do not guarantee it is free of errors or that the site will run without interruption. Geck Codex will not be liable for indirect or incidental damages arising from use of the site. Liability for contracted services is governed exclusively by the project contract.' },
        ] },
        { h2: '9. Permitted use', blocks: [
          { p: 'You may not use this site for unlawful activities, attempt to breach its security, extract content automatically for commercial purposes, or send offensive or fraudulent content through the contact form.' },
        ] },
        { h2: '10. Privacy', blocks: [
          { p: 'The processing of personal data is governed by our <a href="{privacyUrl}">Privacy Notice</a>.' },
        ] },
        { h2: '11. Changes', blocks: [
          { p: 'We may update these terms at any time. The version in force is the one published on this page, with its last updated date.' },
        ] },
        { h2: '12. Governing law', blocks: [
          { p: 'These terms are governed by the laws of the United Mexican States. Any dispute will be submitted to the competent courts of Hidalgo del Parral, Chihuahua, waiving any other jurisdiction.' },
        ] },
      ],
    },

    pt: {
      heading: 'Termos e Condições',
      intro: 'Condições que regem o uso deste site e a contratação dos serviços da Geck Codex.',
      sections: [
        { h2: '1. Quem somos', blocks: [
          { p: 'A <strong>Geck Codex</strong> é uma agência de desenvolvimento de software com sede em {city}, {region}, México. Contato: <a href="mailto:{email}">{email}</a> · WhatsApp {phone}.' },
        ] },
        { h2: '2. Aceitação', blocks: [
          { p: 'Ao navegar em geckcodex.com você aceita estes termos. Se não concordar com eles, pedimos que não utilize o site.' },
        ] },
        { h2: '3. Natureza da informação publicada', blocks: [
          { p: 'O conteúdo deste site — descrições de serviços, casos de portfólio, tecnologias e processos — tem fins informativos. Não constitui oferta vinculante nem contrato. Toda contratação é formalizada por meio de proposta ou contrato escrito e assinado por ambas as partes, onde se definem escopo, entregas, prazos, custos e condições de pagamento.' },
        ] },
        { h2: '4. Orçamentos', blocks: [
          { p: 'Os orçamentos são elaborados a partir do escopo descrito pelo cliente. Têm validade indicada no documento e podem ser ajustados se o escopo mudar. A consultoria inicial e o orçamento não têm custo nem obrigam a contratar.' },
        ] },
        { h2: '5. Propriedade intelectual', blocks: [
          { h3: 'Do site' },
          { p: 'A marca Geck Codex, o logotipo, os textos, o design e o código deste site são propriedade da Geck Codex. Não podem ser reproduzidos, copiados nem distribuídos sem autorização escrita.' },
          { h3: 'Dos projetos' },
          { p: 'A titularidade do software desenvolvido para um cliente é definida no contrato de cada projeto e, em regra, é transferida ao cliente após a quitação do pagamento total, exceto componentes, bibliotecas ou ferramentas próprias da Geck Codex e software de terceiros, que são licenciados para uso dentro do projeto entregue.' },
          { p: 'Salvo acordo em contrário, a Geck Codex pode exibir o trabalho realizado em seu portfólio e materiais promocionais.' },
        ] },
        { h2: '6. Portfólio e marcas de terceiros', blocks: [
          { p: 'Os nomes, logotipos e marcas de clientes e tecnologias exibidos neste site pertencem aos seus respectivos titulares e são usados unicamente com fins ilustrativos e de referência de trabalhos realizados.' },
        ] },
        { h2: '7. Links externos', blocks: [
          { p: 'O site contém links para serviços de terceiros (WhatsApp, Instagram, lojas de aplicativos, sites de clientes). A Geck Codex não controla nem se responsabiliza pelo conteúdo, disponibilidade ou políticas desses sites.' },
        ] },
        { h2: '8. Limitação de responsabilidade', blocks: [
          { p: 'O site é oferecido "no estado em que se encontra". Embora procuremos manter a informação completa e atualizada, não garantimos que esteja livre de erros nem que o site opere sem interrupções. A Geck Codex não será responsável por danos indiretos ou incidentais decorrentes do uso do site. As responsabilidades sobre serviços contratados regem-se exclusivamente pelo contrato do projeto.' },
        ] },
        { h2: '9. Uso permitido', blocks: [
          { p: 'Não é permitido usar este site para atividades ilícitas, tentar violar sua segurança, extrair conteúdo de forma automatizada com fins comerciais, nem enviar conteúdo ofensivo ou fraudulento pelo formulário de contato.' },
        ] },
        { h2: '10. Privacidade', blocks: [
          { p: 'O tratamento de dados pessoais rege-se pelo nosso <a href="{privacyUrl}">Aviso de Privacidade</a>.' },
        ] },
        { h2: '11. Modificações', blocks: [
          { p: 'Podemos atualizar estes termos a qualquer momento. A versão vigente é a publicada nesta página, com sua data de última atualização.' },
        ] },
        { h2: '12. Lei aplicável', blocks: [
          { p: 'Estes termos regem-se pelas leis dos Estados Unidos Mexicanos. Qualquer controvérsia será submetida aos tribunais competentes de Hidalgo del Parral, Chihuahua, renunciando a qualquer outro foro.' },
        ] },
      ],
    },
  },
};

/** Etiqueta de "última actualización" en cada idioma. */
export const LEGAL_UPDATED_LABEL = {
  es: 'Última actualización:',
  en: 'Last updated:',
  pt: 'Última atualização:',
};
