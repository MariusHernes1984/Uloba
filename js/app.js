/* ============================================================
   Uloba PoC – ruter og visninger (ingen rammeverk, ren DOM)
   Global: kun IIFE. Krever ULOBA_DATA og UlobaStore.
   ============================================================ */
/* global ULOBA_DATA, UlobaStore */

(function () {
  'use strict';

  var main = document.getElementById('main-content');
  var liveRegion = document.getElementById('live-region');
  var fmt = ULOBA_DATA.fmt;

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* ---------- Hjelpere ---------- */

  // Escaper ALL brukerdata før den settes inn i HTML.
  function esc(value) {
    var s = value === null || value === undefined ? '' : String(value);
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function announce(message) {
    liveRegion.textContent = '';
    window.setTimeout(function () { liveRegion.textContent = message; }, 60);
  }

  function setTitle(title) {
    document.title = title + ' | Uloba PoC';
  }

  var shouldFocusHeading = false;

  function render(html) {
    main.innerHTML = html;
    if (shouldFocusHeading) {
      var h1 = main.querySelector('h1');
      if (h1) {
        h1.setAttribute('tabindex', '-1');
        h1.focus();
      }
      shouldFocusHeading = false;
    }
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function statusChip(status) {
    var label = ULOBA_DATA.statuser[status] || status;
    return '<span class="status-chip status-chip--' + esc(status) + '">' + esc(label) + '</span>';
  }

  function fornavn(navn) {
    return String(navn || '').split(' ')[0];
  }

  // Slår opp visningsnavnet for et livssituasjons-stikkord. Ukjente nøkler vises som de er.
  function tagLabel(key) {
    var tags = ULOBA_DATA.livssituasjonTags || [];
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].key === key) { return tags[i].label; }
    }
    return key;
  }

  // Felles normalisering av timeverdier: nærmeste halvtime, innenfor 0–80.
  function normTimer(value) {
    var v = parseFloat(value);
    if (isNaN(v) || v < 0) { return 0; }
    if (v > 80) { v = 80; }
    return Math.round(v * 2) / 2;
  }

  function markInvalid(input, errId) {
    if (!input) { return; }
    input.setAttribute('aria-invalid', 'true');
    var ids = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    if (ids.indexOf(errId) === -1) { ids.push(errId); }
    input.setAttribute('aria-describedby', ids.join(' '));
  }

  function clearInvalid(input, errId) {
    if (!input) { return; }
    input.removeAttribute('aria-invalid');
    var ids = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean)
      .filter(function (id) { return id !== errId; });
    if (ids.length) { input.setAttribute('aria-describedby', ids.join(' ')); }
    else { input.removeAttribute('aria-describedby'); }
  }

  /* ---------- Navigasjon ---------- */

  function updateNav(path) {
    var links = document.querySelectorAll('#nav-list a');
    Array.prototype.forEach.call(links, function (a) {
      var href = a.getAttribute('href');
      var active =
        (href === '#/' && (path === '/' || path === '')) ||
        (href === '#/min-side' && path.indexOf('/min-side') === 0) ||
        (href === '#/uloba' && path.indexOf('/uloba') === 0);
      if (active) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  /* ============================================================
     1) FORSIDE
     ============================================================ */

  function renderLanding() {
    setTitle('Forside');
    var state = UlobaStore.get();
    var allePersoner = ULOBA_DATA.personas.map(function (p) {
      return { navn: p.navn, beskrivelse: p.beskrivelse };
    }).concat(state.brukere.map(function (b) {
      return { navn: b.navn, beskrivelse: b.sakId ? 'Generert – har innsendt sak' : 'Generert – ny søknadsprosess' };
    }));
    var personaOptions = allePersoner.map(function (p) {
      var sel = state.selectedPersona === p.navn ? ' selected' : '';
      return '<option value="' + esc(p.navn) + '"' + sel + '>' + esc(p.navn) + ' – ' + esc(p.beskrivelse) + '</option>';
    }).join('');

    render(
      '<div class="container">' +
        '<h1><span class="understroke">Du vet hva du trenger</span></h1>' +
        '<p class="lede">Dokumentér assistansebehovet ditt, send det til Uloba, og få en konkret anbefaling om BPA-søknaden din – bygget på regelverket og kvalitetssikret av en rådgiver.</p>' +
        '<div class="card-grid">' +
          '<div class="card card--tint-blue entry-card">' +
            '<h2>Jeg trenger assistanse</h2>' +
            '<p>Kartlegg behovet ditt steg for steg. Du bestemmer hva du deler – og du er arbeidsleder i eget liv.</p>' +
            '<div class="form-field">' +
              '<label for="persona-select">Velg demoperson</label>' +
              '<select id="persona-select">' + personaOptions + '</select>' +
            '</div>' +
            '<a href="#/login" class="btn btn--primary" id="start-login-btn">Logg inn med BankID</a>' +
            '<div class="demo-tools">' +
              '<p class="hint" id="gen-hint">Demoverktøy: Generer en ny bruker med egen, fersk søknadsprosess – eller med kartleggingen allerede innsendt, slik at saken ligger klar i sakslisten hos Uloba.</p>' +
              '<div class="demo-tools__buttons">' +
                '<button type="button" class="btn btn--secondary" id="gen-bruker" aria-describedby="gen-hint">Generer ny bruker</button>' +
                '<button type="button" class="btn btn--secondary" id="gen-bruker-sak" aria-describedby="gen-hint">Generer bruker med innsendt kartlegging</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="card card--tint-warm entry-card">' +
            '<h2>Uloba internt</h2>' +
            '<p>For rådgivere: Se innsendte kartlegginger, kjør KI-agentene og bygg en anbefaling til arbeidslederen.</p>' +
            '<a href="#/uloba" class="btn btn--secondary">Gå til saksbehandling</a>' +
          '</div>' +
        '</div>' +
        '<section class="section" aria-labelledby="slik-virker">' +
          '<h2 id="slik-virker">Slik virker tjenesten</h2>' +
          '<ol>' +
            '<li><strong>Du dokumenterer behovet ditt</strong> i en enkel kartlegging – på dine premisser.</li>' +
            '<li><strong>Kartleggingen sendes til Ulobas interne system</strong> – ingenting går til kommunen uten at du vil det.</li>' +
            '<li><strong>En rådgiver kjører KI-agenter</strong> som analyserer behov, regelverk og timetall – og kvalitetssikrer alt.</li>' +
            '<li><strong>Du får en anbefaling</strong> med konkret timetall, søknadsutkast og en plan for veien videre.</li>' +
          '</ol>' +
        '</section>' +
        '<section class="section" aria-labelledby="hva-er-bpa">' +
          '<div class="card">' +
            '<h2 id="hva-er-bpa">Hva er BPA?</h2>' +
            '<p>' + esc(ULOBA_DATA.regelverk.hvaErBpa) + '</p>' +
            '<p>' + esc(ULOBA_DATA.regelverk.hvemHarRett) + '</p>' +
          '</div>' +
          '<details class="soknad-details">' +
            '<summary>Hva betyr det å være arbeidsleder?</summary>' +
            '<p>' + esc(ULOBA_DATA.regelverk.arbeidsleder) + '</p>' +
          '</details>' +
        '</section>' +
      '</div>'
    );

    var select = byId('persona-select');
    var loginBtn = byId('start-login-btn');
    if (select) {
      select.addEventListener('change', function () {
        var s = UlobaStore.get();
        s.selectedPersona = select.value;
        UlobaStore.save(s);
      });
    }
    if (loginBtn) {
      loginBtn.addEventListener('click', function () {
        var s = UlobaStore.get();
        s.selectedPersona = select ? select.value : 'Kari Nordmann';
        UlobaStore.save(s);
      });
    }
    var genBtn = byId('gen-bruker');
    var genSakBtn = byId('gen-bruker-sak');
    if (genBtn) { genBtn.addEventListener('click', function () { genererDemobruker(false); }); }
    if (genSakBtn) { genSakBtn.addEventListener('click', function () { genererDemobruker(true); }); }
  }

  // Demoverktøy: lager en ny bruker og – hvis medSak – en ferdig innsendt
  // kartlegging, slik at hver generert bruker starter sin egen søknadsprosess.
  function genererDemobruker(medSak) {
    var state = UlobaStore.get();
    var brukteNavn = ULOBA_DATA.personas.map(function (p) { return p.navn; })
      .concat(state.brukere.map(function (b) { return b.navn; }))
      .concat(state.cases.map(function (c) { return c.navn; }));
    var bruker = ULOBA_DATA.genererBruker(brukteNavn);
    var melding;
    if (medSak) {
      var sak = UlobaStore.addCase(ULOBA_DATA.genererKartlegging(bruker));
      bruker.sakId = sak.id;
      melding = 'Ny demobruker generert: ' + bruker.navn + '. Kartleggingen er sendt inn – sak ' + sak.id + ' (' + ULOBA_DATA.fmt(sak.sumTimer) + ' timer per uke) ligger i sakslisten hos Uloba.';
    } else {
      melding = 'Ny demobruker generert: ' + bruker.navn + '. Logg inn med BankID for å starte en ny søknadsprosess.';
    }
    UlobaStore.addBruker(bruker);
    var s = UlobaStore.get();
    s.selectedPersona = bruker.navn;
    UlobaStore.save(s);
    renderLanding();
    var select = byId('persona-select');
    if (select) { select.focus(); }
    announce(melding);
  }

  /* ============================================================
     2) SIMULERT BANKID
     ============================================================ */

  var loginStep = 1;

  function renderLogin() {
    setTitle('Logg inn med BankID (simulert)');
    loginStep = 1;
    renderLoginStep();
  }

  function loginShell(inner) {
    return (
      '<div class="container container--narrow">' +
        '<h1 class="visually-hidden">Simulert BankID-innlogging</h1>' +
        '<div class="bankid-page">' +
          '<div class="bankid-card">' +
            '<p class="bankid-wordmark" aria-hidden="true">BankID</p>' +
            '<p class="demo-banner">DEMO – simulert BankID. Ingen ekte innlogging. Kun demo.</p>' +
            inner +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderLoginStep() {
    var inner = '';
    if (loginStep === 1) {
      inner =
        '<p class="bankid-step-indicator">Steg 1 av 3</p>' +
        '<h2>Logg inn med BankID</h2>' +
        '<form id="bankid-form" novalidate>' +
          '<div class="form-field" id="field-fnr">' +
            '<label for="bankid-fnr">Fødselsnummer (11 siffer)</label>' +
            '<span class="hint" id="fnr-hint">Fødselsnummeret ditt lagres ikke i denne demoen.</span>' +
            '<input type="text" id="bankid-fnr" inputmode="numeric" autocomplete="off" aria-describedby="fnr-hint" value="010190 12345">' +
          '</div>' +
          '<div id="bankid-error" class="field-error" role="alert" hidden></div>' +
          '<button type="submit" class="btn btn--bankid">Neste</button>' +
        '</form>' +
        '<div class="bankid-links"><a href="#/">Avbryt</a></div>';
    } else if (loginStep === 2) {
      inner =
        '<p class="bankid-step-indicator">Steg 2 av 3</p>' +
        '<h2>Engangskode</h2>' +
        '<p>Åpne kodebrikken din og tast inn engangskoden.</p>' +
        '<form id="bankid-form" novalidate>' +
          '<div class="form-field" id="field-otp">' +
            '<label for="bankid-otp">Engangskode (6 siffer)</label>' +
            '<input type="text" id="bankid-otp" inputmode="numeric" autocomplete="one-time-code" value="123456">' +
          '</div>' +
          '<div id="bankid-error" class="field-error" role="alert" hidden></div>' +
          '<button type="submit" class="btn btn--bankid">Neste</button>' +
        '</form>' +
        '<div class="bankid-links">' +
          '<span class="hint">Bruk BankID-appen i stedet (ikke tilgjengelig i demo)</span>' +
          '<a href="#/">Avbryt</a>' +
        '</div>';
    } else {
      inner =
        '<p class="bankid-step-indicator">Steg 3 av 3</p>' +
        '<h2>Personlig passord</h2>' +
        '<form id="bankid-form" novalidate>' +
          '<div class="form-field" id="field-pwd">' +
            '<label for="bankid-pwd">Personlig passord</label>' +
            '<input type="password" id="bankid-pwd" autocomplete="off">' +
          '</div>' +
          '<div id="bankid-error" class="field-error" role="alert" hidden></div>' +
          '<button type="submit" class="btn btn--bankid">Logg inn</button>' +
        '</form>' +
        '<div class="bankid-links"><a href="#/">Avbryt</a></div>';
    }
    render(loginShell(inner));
    var form = byId('bankid-form');
    if (form) {
      form.addEventListener('submit', handleLoginSubmit);
    }
    var firstInput = main.querySelector('input');
    if (firstInput && loginStep > 1) { firstInput.focus(); }
  }

  function showLoginError(message, inputId) {
    var el = byId('bankid-error');
    if (el) {
      el.textContent = message;
      el.hidden = false;
    }
    if (inputId) {
      markInvalid(byId(inputId), 'bankid-error');
      var input = byId(inputId);
      if (input) { input.focus(); }
    }
  }

  function hideLoginError(inputId) {
    var el = byId('bankid-error');
    if (el) { el.hidden = true; }
    if (inputId) { clearInvalid(byId(inputId), 'bankid-error'); }
  }

  function loginSpinnerThen(next) {
    var hashVedStart = window.location.hash;
    var form = byId('bankid-form');
    if (form) {
      form.innerHTML =
        '<div class="spinner-row" id="bankid-spinner" role="status" tabindex="-1"><span class="spinner" aria-hidden="true"></span><span>Kontakter BankID …</span></div>';
      var spinner = byId('bankid-spinner');
      if (spinner) { spinner.focus(); }
    }
    window.setTimeout(function () {
      if (window.location.hash !== hashVedStart) { return; }
      next();
    }, reducedMotion() ? 0 : 800);
  }

  function handleLoginSubmit(event) {
    event.preventDefault();
    if (loginStep === 1) {
      var fnr = (byId('bankid-fnr').value || '').replace(/\s/g, '');
      if (!/^\d{11}$/.test(fnr)) {
        showLoginError('Fødselsnummeret må ha 11 siffer. Dette er en demo – tallet sjekkes ikke mot noe register.', 'bankid-fnr');
        return;
      }
      hideLoginError('bankid-fnr');
      loginSpinnerThen(function () { loginStep = 2; renderLoginStep(); });
    } else if (loginStep === 2) {
      var otp = (byId('bankid-otp').value || '').replace(/\s/g, '');
      if (!/^\d{6}$/.test(otp)) {
        showLoginError('Engangskoden må ha 6 siffer.', 'bankid-otp');
        return;
      }
      hideLoginError('bankid-otp');
      loginSpinnerThen(function () { loginStep = 3; renderLoginStep(); });
    } else {
      var pwd = byId('bankid-pwd').value || '';
      if (pwd.length < 1) {
        showLoginError('Skriv inn et passord – hva som helst fungerer i demoen.', 'bankid-pwd');
        return;
      }
      hideLoginError('bankid-pwd');
      loginSpinnerThen(function () {
        var state = UlobaStore.get();
        var navn = state.selectedPersona || 'Kari Nordmann';
        state.user = { navn: navn };
        var bruker = UlobaStore.getBrukerByNavn(navn);
        if (bruker && bruker.sakId) { state.user.sakId = bruker.sakId; }
        UlobaStore.save(state);
        announce('Du er logget inn som ' + navn + '.');
        window.location.hash = '#/min-side';
      });
    }
  }

  /* ============================================================
     3) MIN SIDE
     ============================================================ */

  var TIMELINE_STEG = [
    { key: 'ny', tittel: 'Ny', beskrivelse: 'Du har sendt inn kartleggingen din.' },
    { key: 'mottatt', tittel: 'Mottatt hos Uloba', beskrivelse: 'En rådgiver har fått saken din.' },
    { key: 'under_behandling', tittel: 'Under behandling', beskrivelse: 'Rådgiveren analyserer behovet ditt sammen med KI-agentene.' },
    { key: 'anbefaling_klar', tittel: 'Anbefaling klar', beskrivelse: 'Anbefalingen din er klar til gjennomlesing.' }
  ];

  function statusIndex(status) {
    if (status === 'anbefaling_klar') { return 3; }
    if (status === 'under_behandling') { return 2; }
    if (status === 'mottatt') { return 1; }
    return 0;
  }

  function renderMinSide() {
    var state = UlobaStore.get();
    if (!state.user) {
      window.location.hash = '#/login';
      return;
    }
    setTitle('Min side');
    var sak = state.user.sakId ? UlobaStore.getCase(state.user.sakId) : null;
    if (!sak) { sak = UlobaStore.getCaseByNavn(state.user.navn); }
    var html =
      '<div class="container container--narrow">' +
      '<h1>God dag, ' + esc(fornavn(state.user.navn)) + '!</h1>';

    if (!sak) {
      html +=
        '<p class="lede">Du har ingen aktiv sak hos Uloba ennå. Start med å kartlegge behovet ditt – du bestemmer tempoet, og du kan endre alt før du sender inn.</p>' +
        '<div class="card card--tint-blue">' +
          '<h2>Start behovskartleggingen</h2>' +
          '<p>Fem korte steg: om deg, livssituasjonen din, assistansebehovet, dagens tjenester og dokumentasjon. Det tar 10–15 minutter, og du kan lagre underveis.</p>' +
          '<a href="#/kartlegging" class="btn btn--primary">Start behovskartlegging</a>' +
        '</div>';
    } else {
      var idx = statusIndex(sak.status);
      html +=
        '<p class="lede">Her har du full oversikt over saken din hos Uloba.</p>' +
        '<div class="card">' +
          '<h2>Saken din: ' + esc(sak.id) + '</h2>' +
          '<p>Status: ' + statusChip(sak.status) + ' &nbsp; Mottatt: ' + esc(sak.mottattDato || '–') + ' &nbsp; Sum behov: <strong>' + esc(fmt(sak.sumTimer)) + ' timer per uke</strong></p>' +
          '<ol class="timeline">' +
          TIMELINE_STEG.map(function (steg, i) {
            var cls = i < idx ? 'done' : (i === idx ? 'current' : '');
            var currentAttr = i === idx ? ' aria-current="step"' : '';
            return '<li class="' + cls + '"' + currentAttr + '>' +
              '<span class="timeline__dot" aria-hidden="true"></span>' +
              '<span class="timeline__title">' + esc(steg.tittel) + '</span><br>' +
              '<span class="timeline__desc">' + esc(steg.beskrivelse) + '</span>' +
            '</li>';
          }).join('') +
          '</ol>';
      if (sak.status === 'anbefaling_klar') {
        html +=
          '<div class="alert alert--success">Anbefalingen din er klar! Les den, og bruk den når du søker kommunen om BPA.</div>' +
          '<a href="#/anbefaling/' + encodeURIComponent(sak.id) + '" class="btn btn--primary">Les anbefalingen din</a>';
      } else {
        html +=
          '<p>Rådgiveren jobber med saken din. Du får beskjed her når anbefalingen er klar.</p>';
      }
      html += '</div>';
    }

    html +=
      '<div class="card card--tint-warm">' +
        '<h3>Godt å vite</h3>' +
        '<p>' + esc(ULOBA_DATA.regelverk.slikSoker) + '</p>' +
      '</div>' +
      '</div>';
    render(html);
  }

  /* ============================================================
     4) KARTLEGGING (5 steg)
     ============================================================ */

  var WIZARD_STEG = ['Om deg', 'Livssituasjon', 'Assistansebehov', 'Dagens tjenester', 'Dokumentasjon og samtykke'];

  function nyttDraft(navn, profil) {
    var behov = {};
    var notater = {};
    ULOBA_DATA.kategorier.forEach(function (k) {
      behov[k.key] = 0;
      notater[k.key] = '';
    });
    return {
      step: 1,
      om: {
        navn: navn || '',
        fodselsaar: profil && profil.fodselsaar ? String(profil.fodselsaar) : '',
        kommune: (profil && profil.kommune) || '',
        boform: (profil && profil.boform) || '',
        epost: (profil && profil.epost) || '',
        telefon: (profil && profil.telefon) || ''
      },
      livssituasjon: { fritekst: '', tags: [] },
      behov: behov,
      notater: notater,
      tjenester: [],
      tidligereBpa: 'nei',
      tjenesterFritekst: '',
      dokumenter: [],
      annet: '',
      arbeidsleder: { hvem: 'selv', navn: '' },
      samtykke: false
    };
  }

  function getDraft() {
    var state = UlobaStore.get();
    if (!state.draft) {
      var profil = state.user ? UlobaStore.getBrukerByNavn(state.user.navn) : null;
      state.draft = nyttDraft(state.user ? state.user.navn : '', profil);
      UlobaStore.save(state);
    }
    return state.draft;
  }

  function saveDraft(draft) {
    var state = UlobaStore.get();
    state.draft = draft;
    UlobaStore.save(state);
  }

  function wizardStepsHtml(current) {
    return (
      '<ol class="steps" aria-label="Steg i kartleggingen">' +
      WIZARD_STEG.map(function (navn, i) {
        var nr = i + 1;
        var cls = nr < current ? ' class="steps__done"' : '';
        var cur = nr === current ? ' aria-current="step"' : '';
        return '<li' + cls + cur + '><span class="visually-hidden">Steg ' + nr + (nr < current ? ' (fullført)' : '') + ': </span>' + esc(navn) + '</li>';
      }).join('') +
      '</ol>'
    );
  }

  function renderKartlegging() {
    var state = UlobaStore.get();
    if (!state.user) {
      window.location.hash = '#/login';
      return;
    }
    setTitle('Behovskartlegging');
    var draft = getDraft();
    renderWizardStep(draft);
  }

  function renderWizardStep(draft, skipFocus) {
    var step = draft.step || 1;
    var inner = '';
    if (step === 1) { inner = wizardStep1(draft); }
    else if (step === 2) { inner = wizardStep2(draft); }
    else if (step === 3) { inner = wizardStep3(draft); }
    else if (step === 4) { inner = wizardStep4(draft); }
    else { inner = wizardStep5(draft); }

    render(
      '<div class="container container--narrow">' +
        '<h1>Behovskartlegging</h1>' +
        '<p class="lede">Steg ' + step + ' av 5: ' + esc(WIZARD_STEG[step - 1]) + '</p>' +
        wizardStepsHtml(step) +
        '<form id="wizard-form" novalidate><div class="card">' + inner + '</div>' +
        '<div class="btn-row btn-row--between no-print">' +
          (step > 1
            ? '<button type="button" class="btn btn--secondary" id="wiz-back">Tilbake</button>'
            : '<a class="btn btn--ghost" href="#/min-side">Avbryt</a>') +
          (step < 5
            ? '<button type="submit" class="btn btn--primary" id="wiz-next">Neste</button>'
            : '<button type="submit" class="btn btn--primary" id="wiz-send">Send til Uloba</button>') +
        '</div></form>' +
      '</div>'
    );
    bindWizardEvents(draft);
    if (!skipFocus) {
      var stegHeading = main.querySelector('.card h2');
      if (stegHeading) {
        stegHeading.setAttribute('tabindex', '-1');
        stegHeading.focus();
      }
      announce('Steg ' + step + ' av 5: ' + WIZARD_STEG[step - 1]);
    }
  }

  /* ----- Steg 1: Om deg ----- */
  function wizardStep1(d) {
    var kommuneOptions = '<option value="">Velg kommune</option>' +
      ULOBA_DATA.kommuner.map(function (k) {
        var sel = d.om.kommune === k ? ' selected' : '';
        return '<option value="' + esc(k) + '"' + sel + '>' + esc(k) + '</option>';
      }).join('');
    return (
      '<h2>Om deg</h2>' +
      '<div class="form-field" id="ff-navn">' +
        '<label for="inp-navn">Navn</label>' +
        '<input type="text" id="inp-navn" autocomplete="name" value="' + esc(d.om.navn) + '">' +
        '<div class="field-error" id="err-navn" role="alert" hidden></div>' +
      '</div>' +
      '<div class="form-field" id="ff-aar">' +
        '<label for="inp-aar">Fødselsår</label>' +
        '<input type="number" id="inp-aar" inputmode="numeric" min="1920" max="2012" autocomplete="bday-year" value="' + esc(d.om.fodselsaar) + '">' +
        '<div class="field-error" id="err-aar" role="alert" hidden></div>' +
      '</div>' +
      '<div class="form-field">' +
        '<label for="inp-kommune">Kommune</label>' +
        '<select id="inp-kommune" autocomplete="address-level2">' + kommuneOptions + '</select>' +
      '</div>' +
      '<div class="form-field">' +
        '<label for="inp-boform">Boform</label>' +
        '<span class="hint" id="boform-hint">For eksempel: leilighet med heis, enebolig, bor med familie, bor alene.</span>' +
        '<input type="text" id="inp-boform" aria-describedby="boform-hint" value="' + esc(d.om.boform) + '">' +
      '</div>' +
      '<div class="form-field">' +
        '<label for="inp-epost">E-post</label>' +
        '<input type="email" id="inp-epost" autocomplete="email" value="' + esc(d.om.epost) + '">' +
      '</div>' +
      '<div class="form-field">' +
        '<label for="inp-telefon">Telefon</label>' +
        '<input type="tel" id="inp-telefon" autocomplete="tel" value="' + esc(d.om.telefon) + '">' +
      '</div>'
    );
  }

  /* ----- Steg 2: Livssituasjon ----- */
  function wizardStep2(d) {
    return (
      '<h2>Livssituasjon</h2>' +
      '<div class="form-field">' +
        '<label for="inp-livssituasjon">Fortell om hverdagen din</label>' +
        '<span class="hint" id="livssituasjon-hint">Jobb, studier, familie, fritid, helse – det du selv mener er viktig. Du er eksperten på ditt eget liv.</span>' +
        '<textarea id="inp-livssituasjon" aria-describedby="livssituasjon-hint">' + esc(d.livssituasjon.fritekst) + '</textarea>' +
      '</div>' +
      '<p class="label" id="tags-label">Hva beskriver situasjonen din? Velg det som passer.</p>' +
      '<div class="chip-row" role="group" aria-labelledby="tags-label">' +
      ULOBA_DATA.livssituasjonTags.map(function (t) {
        var pressed = d.livssituasjon.tags.indexOf(t.key) !== -1 ? 'true' : 'false';
        return '<button type="button" class="chip" data-tag="' + esc(t.key) + '" aria-pressed="' + pressed + '">' + esc(t.label) + '</button>';
      }).join('') +
      '</div>'
    );
  }

  /* ----- Steg 3: Assistansebehov ----- */
  function wizardStep3(d) {
    var rows = ULOBA_DATA.kategorier.map(function (k) {
      return (
        '<div class="behov-rad">' +
          '<label class="label" for="beh-' + esc(k.key) + '">' + esc(k.label) + '</label>' +
          '<div>' +
            '<input type="number" id="beh-' + esc(k.key) + '" min="0" max="80" step="0.5" inputmode="decimal" value="' + esc(d.behov[k.key]) + '" aria-describedby="behov-enhet">' +
          '</div>' +
          '<div>' +
            '<label class="hint" for="note-' + esc(k.key) + '">Kort beskrivelse (valgfritt)</label>' +
            '<input type="text" id="note-' + esc(k.key) + '" value="' + esc(d.notater[k.key]) + '">' +
          '</div>' +
        '</div>'
      );
    }).join('');

    return (
      '<h2>Assistansebehov</h2>' +
      '<p>Anslå hvor mange timer assistanse du trenger per uke i hvert livsområde. <span id="behov-enhet">Timer per uke, i steg på en halv time.</span></p>' +
      rows +
      '<div class="meter-wrap" aria-hidden="true">' +
        '<div class="meter-scale">' +
          '<div class="meter-fill" id="meter-fill" style="width:0%"></div>' +
          '<div class="meter-mark" style="left:50%"></div>' +
          '<div class="meter-mark" style="left:64%"></div>' +
        '</div>' +
        '<div class="meter-labels"><span style="left:50%">25 t</span><span style="left:64%">32 t</span></div>' +
      '</div>' +
      '<p>Samlet behov: <span class="sum-display" id="sum-display">' + esc(fmt(ULOBA_DATA.sumBehov(d.behov))) + '</span> timer per uke</p>' +
      '<div class="sum-hint" id="sum-hint" aria-live="polite">' + esc(ULOBA_DATA.terskelHint(ULOBA_DATA.sumBehov(d.behov))) + '</div>'
    );
  }

  /* ----- Steg 4: Dagens tjenester ----- */
  function wizardStep4(d) {
    var checkboxes = ULOBA_DATA.tjenester.map(function (t) {
      var checked = d.tjenester.indexOf(t.label) !== -1 ? ' checked' : '';
      return (
        '<div class="check-row">' +
          '<input type="checkbox" id="tj-' + esc(t.key) + '" value="' + esc(t.label) + '"' + checked + '>' +
          '<label for="tj-' + esc(t.key) + '">' + esc(t.label) + '</label>' +
        '</div>'
      );
    }).join('');

    function radio(value, label) {
      var checked = d.tidligereBpa === value ? ' checked' : '';
      return (
        '<div class="check-row">' +
          '<input type="radio" name="tidligere-bpa" id="bpa-' + esc(value) + '" value="' + esc(value) + '"' + checked + '>' +
          '<label for="bpa-' + esc(value) + '">' + esc(label) + '</label>' +
        '</div>'
      );
    }

    return (
      '<h2>Dagens tjenester</h2>' +
      '<fieldset>' +
        '<legend>Hvilke kommunale tjenester har du i dag?</legend>' +
        checkboxes +
      '</fieldset>' +
      '<fieldset>' +
        '<legend>Har du søkt BPA før?</legend>' +
        radio('nei', 'Nei') +
        radio('ja_innvilget', 'Ja – innvilget') +
        radio('ja_avslag', 'Ja – avslag') +
      '</fieldset>' +
      '<div class="form-field">' +
        '<label for="inp-tjenester-fritekst">Noe mer om dagens tjenester eller tidligere søknader?</label>' +
        '<span class="hint" id="tjf-hint">For eksempel timetall i dagens vedtak, når du søkte, eller hvorfor tjenestene ikke dekker behovet ditt.</span>' +
        '<textarea id="inp-tjenester-fritekst" aria-describedby="tjf-hint">' + esc(d.tjenesterFritekst) + '</textarea>' +
      '</div>'
    );
  }

  /* ----- Steg 5: Oppsummering, arbeidsleder, dokumentasjon og samtykke ----- */

  function arbeidslederTekst(al) {
    if (al && al.hvem === 'annen') {
      return 'En annen skal være arbeidsleder' + (al.navn ? ': ' + al.navn : '');
    }
    return 'Jeg skal være arbeidsleder selv';
  }

  function wizardOppsummering(d) {
    var tagsTekst = (d.livssituasjon.tags || []).map(tagLabel).join(', ') || 'ingen valgt';
    var behovLinjer = ULOBA_DATA.kategorier
      .filter(function (k) { return (Number(d.behov[k.key]) || 0) > 0; })
      .map(function (k) { return esc(k.label) + ': ' + esc(fmt(d.behov[k.key])) + ' timer per uke'; })
      .join('<br>') || 'Ingen timer fylt inn';
    var sum = ULOBA_DATA.sumBehov(d.behov);

    function rad(tittel, innhold, steg) {
      return (
        '<div class="opps-rad">' +
          '<h4>' + esc(tittel) + '</h4>' +
          '<p>' + innhold + '</p>' +
          (steg
            ? '<button type="button" class="btn btn--ghost btn--small" data-goto-step="' + steg + '">Endre<span class="visually-hidden"> ' + esc(tittel) + '</span></button>'
            : '') +
        '</div>'
      );
    }

    return (
      '<section class="opps" aria-labelledby="opps-heading">' +
        '<h3 id="opps-heading">Oppsummering – dette sender du til Uloba</h3>' +
        rad('Om deg',
          esc(d.om.navn || 'Navn ikke oppgitt') + (d.om.fodselsaar ? ', født ' + esc(d.om.fodselsaar) : '') + '<br>' +
          esc(d.om.kommune || 'Kommune ikke valgt') + (d.om.boform ? ' – ' + esc(d.om.boform) : '') +
          (d.om.epost ? '<br>' + esc(d.om.epost) : '') + (d.om.telefon ? '<br>' + esc(d.om.telefon) : ''), 1) +
        rad('Livssituasjon', esc(d.livssituasjon.fritekst || 'Ikke beskrevet') + '<br>Stikkord: ' + esc(tagsTekst), 2) +
        rad('Assistansebehov', behovLinjer + '<br><strong>Samlet: ' + esc(fmt(sum)) + ' timer per uke</strong>', 3) +
        rad('Dagens tjenester', esc((d.tjenester || []).join(', ') || 'Ingen kommunale tjenester i dag') + '<br>' + esc(tidligereBpaTekst(d)), 4) +
        '<div class="opps-rad"><h4>Arbeidsleder</h4><p id="opps-arbeidsleder">' + esc(arbeidslederTekst(d.arbeidsleder)) + '</p></div>' +
      '</section>'
    );
  }

  function wizardStep5(d) {
    var al = d.arbeidsleder || { hvem: 'selv', navn: '' };
    var docItems = d.dokumenter.map(function (navn, i) {
      return (
        '<li><span class="doc-name">' + esc(navn) + '</span>' +
        '<button type="button" class="btn btn--ghost btn--small" data-remove-doc="' + i + '">Fjern<span class="visually-hidden"> ' + esc(navn) + '</span></button></li>'
      );
    }).join('');

    var quickChips = ULOBA_DATA.dokumentForslag.map(function (navn) {
      return '<button type="button" class="chip" data-quick-doc="' + esc(navn) + '">+ ' + esc(navn) + '</button>';
    }).join('');

    return (
      '<h2>Dokumentasjon og samtykke</h2>' +
      wizardOppsummering(d) +
      '<fieldset>' +
        '<legend>Hvem skal være arbeidsleder?</legend>' +
        '<div class="check-row">' +
          '<input type="radio" name="arbeidsleder-hvem" id="al-selv" value="selv"' + (al.hvem === 'annen' ? '' : ' checked') + '>' +
          '<label for="al-selv">Jeg skal være arbeidsleder selv</label>' +
        '</div>' +
        '<div class="check-row">' +
          '<input type="radio" name="arbeidsleder-hvem" id="al-annen" value="annen"' + (al.hvem === 'annen' ? ' checked' : '') + '>' +
          '<label for="al-annen">En annen skal være arbeidsleder (f.eks. en foresatt eller nærstående)</label>' +
        '</div>' +
        '<div class="form-field" id="ff-al-navn"' + (al.hvem === 'annen' ? '' : ' hidden') + '>' +
          '<label for="inp-al-navn">Navnet på den som skal være arbeidsleder</label>' +
          '<input type="text" id="inp-al-navn" autocomplete="off" value="' + esc(al.navn) + '">' +
          '<div class="field-error" id="err-al-navn" role="alert" hidden></div>' +
        '</div>' +
      '</fieldset>' +
      '<div class="form-field">' +
        '<label for="inp-doknavn">Legg til dokument</label>' +
        '<span class="hint" id="dok-hint">Dette er en demo: Ingen filer lastes faktisk opp – bare filnavnet legges i listen.</span>' +
        '<input type="text" id="inp-doknavn" aria-describedby="dok-hint" placeholder="f.eks. legeerklaering.pdf">' +
        '<div class="field-error" id="err-doknavn" role="alert" hidden></div>' +
      '</div>' +
      '<div class="btn-row" style="margin-top:0">' +
        '<button type="button" class="btn btn--secondary" id="add-doc-btn">Legg til fil</button>' +
      '</div>' +
      '<p class="label" id="quick-label" style="margin-top:16px">Hurtigvalg</p>' +
      '<div class="chip-row" role="group" aria-labelledby="quick-label">' + quickChips + '</div>' +
      '<ul class="doc-list" id="doc-list" aria-label="Dokumenter du legger ved">' + docItems + '</ul>' +
      '<div class="form-field">' +
        '<label for="inp-annet">Annet du vil fortelle oss</label>' +
        '<textarea id="inp-annet">' + esc(d.annet) + '</textarea>' +
      '</div>' +
      '<fieldset>' +
        '<legend>Samtykke</legend>' +
        '<div class="check-row" id="ff-samtykke">' +
          '<input type="checkbox" id="inp-samtykke"' + (d.samtykke ? ' checked' : '') + ' aria-describedby="samtykke-tekst">' +
          '<label for="inp-samtykke">Jeg samtykker til at Uloba behandler opplysningene mine.</label>' +
        '</div>' +
        '<p class="hint" id="samtykke-tekst">Kartleggingen inneholder helseopplysninger (særlige kategorier av personopplysninger, personvernforordningen artikkel 9). I denne demoen lagres alt kun lokalt i nettleseren din. I en ekte tjeneste behandles opplysningene bare for å gi deg råd om BPA, og du kan når som helst trekke samtykket tilbake.</p>' +
        '<div class="field-error" id="err-samtykke" role="alert" hidden></div>' +
      '</fieldset>'
    );
  }

  /* ----- Wizard: lagring og hendelser ----- */

  function collectStepValues(draft) {
    var step = draft.step || 1;
    if (step === 1) {
      draft.om.navn = byId('inp-navn').value.trim();
      draft.om.fodselsaar = byId('inp-aar').value.trim();
      draft.om.kommune = byId('inp-kommune').value;
      draft.om.boform = byId('inp-boform').value.trim();
      draft.om.epost = byId('inp-epost').value.trim();
      draft.om.telefon = byId('inp-telefon').value.trim();
    } else if (step === 2) {
      draft.livssituasjon.fritekst = byId('inp-livssituasjon').value.trim();
      // tags oppdateres direkte ved klikk
    } else if (step === 3) {
      ULOBA_DATA.kategorier.forEach(function (k) {
        draft.behov[k.key] = normTimer(byId('beh-' + k.key).value);
        draft.notater[k.key] = byId('note-' + k.key).value.trim();
      });
    } else if (step === 4) {
      draft.tjenester = [];
      ULOBA_DATA.tjenester.forEach(function (t) {
        var box = byId('tj-' + t.key);
        if (box && box.checked) { draft.tjenester.push(t.label); }
      });
      var radio = main.querySelector('input[name="tidligere-bpa"]:checked');
      draft.tidligereBpa = radio ? radio.value : 'nei';
      draft.tjenesterFritekst = byId('inp-tjenester-fritekst').value.trim();
    } else if (step === 5) {
      draft.annet = byId('inp-annet').value.trim();
      draft.samtykke = byId('inp-samtykke').checked;
      var alRadio = main.querySelector('input[name="arbeidsleder-hvem"]:checked');
      var alHvem = alRadio ? alRadio.value : 'selv';
      var alNavnEl = byId('inp-al-navn');
      draft.arbeidsleder = {
        hvem: alHvem,
        navn: alHvem === 'annen' && alNavnEl ? alNavnEl.value.trim() : ''
      };
      // dokumenter oppdateres direkte ved klikk
    }
  }

  function bindWizardEvents(draft) {
    var form = byId('wizard-form');
    var backBtn = byId('wiz-back');
    var step = draft.step || 1;

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        collectStepValues(draft);
        draft.step = step - 1;
        saveDraft(draft);
        renderWizardStep(draft);
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      collectStepValues(draft);
      if (step === 1) {
        var errNavn = byId('err-navn');
        var ffNavn = byId('ff-navn');
        var navnOk = !!draft.om.navn;
        if (!navnOk) {
          errNavn.textContent = 'Skriv inn navnet ditt, så vi vet hvem kartleggingen gjelder.';
          errNavn.hidden = false;
          ffNavn.classList.add('form-field--error');
          markInvalid(byId('inp-navn'), 'err-navn');
        } else {
          errNavn.hidden = true;
          ffNavn.classList.remove('form-field--error');
          clearInvalid(byId('inp-navn'), 'err-navn');
        }
        var inpAar = byId('inp-aar');
        var minAar = parseInt(inpAar.getAttribute('min'), 10);
        var maxAar = parseInt(inpAar.getAttribute('max'), 10);
        var aar = parseInt(draft.om.fodselsaar, 10);
        var aarOk = !isNaN(aar) && aar >= minAar && aar <= maxAar;
        var errAar = byId('err-aar');
        var ffAar = byId('ff-aar');
        if (!aarOk) {
          errAar.textContent = 'Skriv inn fødselsåret ditt som et årstall mellom ' + minAar + ' og ' + maxAar + '.';
          errAar.hidden = false;
          ffAar.classList.add('form-field--error');
          markInvalid(inpAar, 'err-aar');
        } else {
          errAar.hidden = true;
          ffAar.classList.remove('form-field--error');
          clearInvalid(inpAar, 'err-aar');
        }
        if (!navnOk) { byId('inp-navn').focus(); return; }
        if (!aarOk) { inpAar.focus(); return; }
      }
      if (step === 5) {
        if (draft.arbeidsleder.hvem === 'annen' && !draft.arbeidsleder.navn) {
          var eAl = byId('err-al-navn');
          eAl.textContent = 'Skriv inn navnet på den som skal være arbeidsleder.';
          eAl.hidden = false;
          markInvalid(byId('inp-al-navn'), 'err-al-navn');
          byId('inp-al-navn').focus();
          saveDraft(draft);
          return;
        }
        var eAlOk = byId('err-al-navn');
        if (eAlOk) { eAlOk.hidden = true; }
        clearInvalid(byId('inp-al-navn'), 'err-al-navn');
        if (!draft.samtykke) {
          var e = byId('err-samtykke');
          e.textContent = 'Du må samtykke før vi kan sende kartleggingen til Uloba.';
          e.hidden = false;
          markInvalid(byId('inp-samtykke'), 'err-samtykke');
          byId('inp-samtykke').focus();
          saveDraft(draft);
          return;
        }
        clearInvalid(byId('inp-samtykke'), 'err-samtykke');
        saveDraft(draft);
        submitKartlegging(draft);
        return;
      }
      draft.step = step + 1;
      saveDraft(draft);
      renderWizardStep(draft);
    });

    if (step === 2) {
      Array.prototype.forEach.call(main.querySelectorAll('.chip[data-tag]'), function (chip) {
        chip.addEventListener('click', function () {
          var tag = chip.getAttribute('data-tag');
          var idx = draft.livssituasjon.tags.indexOf(tag);
          if (idx === -1) {
            draft.livssituasjon.tags.push(tag);
            chip.setAttribute('aria-pressed', 'true');
          } else {
            draft.livssituasjon.tags.splice(idx, 1);
            chip.setAttribute('aria-pressed', 'false');
          }
          saveDraft(draft);
        });
      });
    }

    if (step === 3) {
      var update = function () {
        var behov = {};
        ULOBA_DATA.kategorier.forEach(function (k) {
          behov[k.key] = normTimer(byId('beh-' + k.key).value);
        });
        var sum = ULOBA_DATA.sumBehov(behov);
        byId('sum-display').textContent = fmt(sum);
        byId('sum-hint').textContent = ULOBA_DATA.terskelHint(sum);
        var pct = Math.min(100, (sum / 50) * 100);
        byId('meter-fill').style.width = pct + '%';
      };
      ULOBA_DATA.kategorier.forEach(function (k) {
        byId('beh-' + k.key).addEventListener('input', update);
      });
      update();
    }

    if (step === 5) {
      var refresh = function () {
        collectStepValues(draft);
        saveDraft(draft);
        renderWizardStep(draft, true);
      };
      byId('add-doc-btn').addEventListener('click', function () {
        var input = byId('inp-doknavn');
        var errDok = byId('err-doknavn');
        var navn = input.value.trim();
        if (!navn) {
          errDok.textContent = 'Skriv inn et filnavn før du legger til.';
          errDok.hidden = false;
          markInvalid(input, 'err-doknavn');
          announce('Skriv inn et filnavn før du legger til.');
          input.focus();
          return;
        }
        errDok.hidden = true;
        clearInvalid(input, 'err-doknavn');
        draft.dokumenter.push(navn);
        announce('Dokumentet ' + navn + ' er lagt til.');
        refresh();
        byId('inp-doknavn').focus();
      });
      Array.prototype.forEach.call(main.querySelectorAll('[data-quick-doc]'), function (chip) {
        chip.addEventListener('click', function () {
          var navn = chip.getAttribute('data-quick-doc');
          var fil = navn.toLowerCase().replace(/[^a-z0-9æøå]+/g, '_') + '.pdf';
          if (draft.dokumenter.indexOf(fil) !== -1) {
            announce('Dokumentet ' + fil + ' er allerede lagt til.');
            return;
          }
          draft.dokumenter.push(fil);
          announce('Dokumentet ' + fil + ' er lagt til.');
          refresh();
          var nyChip = main.querySelector('[data-quick-doc="' + navn.replace(/"/g, '\\"') + '"]');
          if (nyChip) { nyChip.focus(); }
        });
      });
      Array.prototype.forEach.call(main.querySelectorAll('[data-remove-doc]'), function (btn) {
        btn.addEventListener('click', function () {
          var i = parseInt(btn.getAttribute('data-remove-doc'), 10);
          var fjernet = draft.dokumenter.splice(i, 1);
          announce('Dokumentet ' + (fjernet[0] || '') + ' er fjernet.');
          refresh();
          byId('inp-doknavn').focus();
        });
      });
      Array.prototype.forEach.call(main.querySelectorAll('[data-goto-step]'), function (btn) {
        btn.addEventListener('click', function () {
          collectStepValues(draft);
          draft.step = parseInt(btn.getAttribute('data-goto-step'), 10);
          saveDraft(draft);
          renderWizardStep(draft);
        });
      });
      var oppdaterArbeidsleder = function () {
        var checkedRadio = main.querySelector('input[name="arbeidsleder-hvem"]:checked');
        var hvem = checkedRadio ? checkedRadio.value : 'selv';
        var ffAl = byId('ff-al-navn');
        if (ffAl) { ffAl.hidden = hvem !== 'annen'; }
        var navnEl = byId('inp-al-navn');
        var opps = byId('opps-arbeidsleder');
        if (opps) {
          opps.textContent = arbeidslederTekst({ hvem: hvem, navn: navnEl ? navnEl.value.trim() : '' });
        }
      };
      Array.prototype.forEach.call(main.querySelectorAll('input[name="arbeidsleder-hvem"]'), function (r) {
        r.addEventListener('change', oppdaterArbeidsleder);
      });
      var alNavnInput = byId('inp-al-navn');
      if (alNavnInput) { alNavnInput.addEventListener('input', oppdaterArbeidsleder); }
      var samtykkeBox = byId('inp-samtykke');
      if (samtykkeBox) {
        samtykkeBox.addEventListener('change', function () {
          if (samtykkeBox.checked) {
            var eS = byId('err-samtykke');
            if (eS) { eS.hidden = true; }
            clearInvalid(samtykkeBox, 'err-samtykke');
          }
        });
      }
    }
  }

  function tidligereBpaTekst(draft) {
    var basis;
    if (draft.tidligereBpa === 'ja_innvilget') {
      basis = 'Har søkt BPA tidligere og fått innvilget.';
    } else if (draft.tidligereBpa === 'ja_avslag') {
      basis = 'Har søkt BPA tidligere og fått avslag.';
    } else {
      basis = 'Ingen tidligere BPA-søknader.';
    }
    if (draft.tjenesterFritekst) {
      basis += ' ' + draft.tjenesterFritekst;
    }
    return basis;
  }

  function submitKartlegging(draft) {
    var sum = ULOBA_DATA.sumBehov(draft.behov);
    var notatTekst = ULOBA_DATA.kategorier
      .filter(function (k) { return draft.notater[k.key]; })
      .map(function (k) { return k.label + ': ' + draft.notater[k.key]; })
      .join(' ');
    var fritekstBehov = draft.annet || notatTekst || 'Se timeoversikten per livsområde.';

    var nyCase = {
      navn: draft.om.navn,
      fodselsaar: parseInt(draft.om.fodselsaar, 10) || '',
      kommune: draft.om.kommune || 'Ikke oppgitt',
      boform: draft.om.boform || 'Ikke oppgitt',
      kontakt: { epost: draft.om.epost, telefon: draft.om.telefon },
      livssituasjon: { fritekst: draft.livssituasjon.fritekst, tags: draft.livssituasjon.tags.slice() },
      behov: draft.behov,
      notater: draft.notater,
      sumTimer: sum,
      dagensTjenester: draft.tjenester.length ? draft.tjenester.slice() : ['Ingen kommunale tjenester i dag'],
      tidligereSoknader: tidligereBpaTekst(draft),
      dokumenter: draft.dokumenter.slice(),
      arbeidsleder: draft.arbeidsleder
        ? { hvem: draft.arbeidsleder.hvem, navn: draft.arbeidsleder.navn }
        : { hvem: 'selv', navn: '' },
      fritekstBehov: fritekstBehov,
      status: 'mottatt',
      mottattDato: ULOBA_DATA.dagensDatoKort,
      userCase: true,
      agentOutputs: {}
    };
    var lagret = UlobaStore.addCase(nyCase);

    var state = UlobaStore.get();
    state.draft = null;
    if (state.user) { state.user.sakId = lagret.id; }
    UlobaStore.save(state);

    announce('Kartleggingen er sendt til Uloba. Saks-ID ' + lagret.id + '.');
    window.location.hash = '#/kvittering/' + encodeURIComponent(lagret.id);
  }

  function renderKvittering(id) {
    var sak = UlobaStore.getCase(id);
    if (!sak) {
      window.location.hash = '#/min-side';
      return;
    }
    setTitle('Kartlegging sendt');
    render(
      '<div class="container container--narrow">' +
        '<h1>Kartleggingen er sendt!</h1>' +
        '<div class="alert alert--success">Saken din er mottatt hos Uloba. Du finner den igjen på Min side.</div>' +
        '<div class="card card--tint-blue">' +
          '<h2>Saks-ID: ' + esc(sak.id) + '</h2>' +
          '<p>Samlet behov: <strong>' + esc(fmt(sak.sumTimer)) + ' timer per uke</strong></p>' +
          '<p>En rådgiver går gjennom kartleggingen din sammen med KI-agentene våre. Når anbefalingen er klar, ser du den på Min side. Du bestemmer selv hva du gjør videre – anbefalingen er din.</p>' +
          '<a href="#/min-side" class="btn btn--primary">Gå til Min side</a>' +
        '</div>' +
      '</div>'
    );
  }

  /* ============================================================
     5) ULOBA INTERNT – SAKSLISTE
     ============================================================ */

  function renderUloba() {
    setTitle('Uloba internt – saksliste');
    var state = UlobaStore.get();

    if (!state.raadgiver) {
      render(
        '<div class="container container--narrow">' +
          '<h1>Uloba internt</h1>' +
          '<p class="lede">Saksbehandlingsflaten for Ulobas rådgivere. Her ser du innsendte kartlegginger og kjører KI-agentene.</p>' +
          '<div class="card card--tint-warm">' +
            '<h2>Innlogging for rådgivere</h2>' +
            '<p>I denne demoen er det ingen ekte tilgangsstyring – trykk på knappen for å gå inn som rådgiver.</p>' +
            '<button type="button" class="btn btn--primary" id="raadgiver-login">Logg inn som rådgiver (demo)</button>' +
          '</div>' +
        '</div>'
      );
      byId('raadgiver-login').addEventListener('click', function () {
        var s = UlobaStore.get();
        s.raadgiver = true;
        UlobaStore.save(s);
        announce('Du er logget inn som rådgiver.');
        shouldFocusHeading = true;
        renderUloba();
      });
      return;
    }

    var rows = state.cases.map(function (c) {
      return (
        '<tr>' +
          '<th scope="row">' + esc(c.id) + '</th>' +
          '<td>' + esc(c.navn) + '</td>' +
          '<td>' + esc(c.kommune) + '</td>' +
          '<td>' + esc(fmt(c.sumTimer)) + '</td>' +
          '<td>' + statusChip(c.status) + '</td>' +
          '<td>' + esc(c.mottattDato || '–') + '</td>' +
          '<td><a class="btn btn--secondary btn--small" href="#/uloba/sak/' + encodeURIComponent(c.id) + '">Åpne sak<span class="visually-hidden"> ' + esc(c.id) + ', ' + esc(c.navn) + '</span></a></td>' +
        '</tr>'
      );
    }).join('');

    render(
      '<div class="container">' +
        '<h1>Saksliste</h1>' +
        '<p class="lede">Innsendte behovskartlegginger. Åpne en sak for å kjøre KI-agentene og bygge en anbefaling.</p>' +
        '<div class="table-wrap">' +
          '<table class="saksliste">' +
            '<caption class="visually-hidden">Innsendte saker med status</caption>' +
            '<thead><tr>' +
              '<th scope="col">Saks-ID</th><th scope="col">Navn</th><th scope="col">Kommune</th>' +
              '<th scope="col">Sum t/uke</th><th scope="col">Status</th><th scope="col">Mottatt</th>' +
              '<th scope="col"><span class="visually-hidden">Handling</span></th>' +
            '</tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>'
    );
  }

  /* ============================================================
     6) SAKSDETALJ MED KI-AGENTER
     ============================================================ */

  function kartleggingSummary(c) {
    var behovRows = ULOBA_DATA.kategorier.map(function (k) {
      var notat = c.notater && c.notater[k.key] ? ' – ' + c.notater[k.key] : '';
      return '<tr><td>' + esc(k.label) + esc(notat) + '</td><td>' + esc(fmt(c.behov ? c.behov[k.key] : 0)) + '</td></tr>';
    }).join('');

    var alderVerdi = ULOBA_DATA.alder(c);
    var personTekst = c.navn +
      ' (f. ' + (c.fodselsaar || 'ukjent') +
      (alderVerdi === null || alderVerdi === undefined ? '' : ', ' + alderVerdi + ' år') + ')';

    var alTekst;
    if (c.arbeidsleder && c.arbeidsleder.hvem === 'annen') {
      alTekst = 'En annen skal være arbeidsleder: ' + (c.arbeidsleder.navn || 'navn ikke oppgitt');
    } else {
      alTekst = 'Skal være arbeidsleder selv';
    }

    return (
      '<div class="card">' +
        '<h2>Kartlegging</h2>' +
        '<dl class="datalist">' +
          '<dt>Navn</dt><dd>' + esc(personTekst) + '</dd>' +
          '<dt>Kommune</dt><dd>' + esc(c.kommune) + '</dd>' +
          '<dt>Boform</dt><dd>' + esc(c.boform) + '</dd>' +
          '<dt>Arbeidsleder</dt><dd>' + esc(alTekst) + '</dd>' +
          '<dt>Livssituasjon</dt><dd>' + esc(c.livssituasjon ? c.livssituasjon.fritekst : '') + '</dd>' +
          '<dt>Stikkord</dt><dd>' + esc((c.livssituasjon && c.livssituasjon.tags || []).map(tagLabel).join(', ') || 'ingen') + '</dd>' +
          '<dt>Behovsbeskrivelse</dt><dd>' + esc(c.fritekstBehov) + '</dd>' +
          '<dt>Dagens tjenester</dt><dd>' + esc((c.dagensTjenester || []).join(', ') || 'ingen') + '</dd>' +
          '<dt>Tidligere søknader</dt><dd>' + esc(c.tidligereSoknader || 'ingen oppgitt') + '</dd>' +
          '<dt>Dokumenter</dt><dd>' + esc((c.dokumenter || []).join(', ') || 'ingen') + '</dd>' +
        '</dl>' +
        '<h3>Timer per livsområde</h3>' +
        '<table class="behov-tabell">' +
          '<caption class="visually-hidden">Oppgitt behov i timer per uke</caption>' +
          '<thead><tr><th scope="col">Livsområde</th><th scope="col">t/uke</th></tr></thead>' +
          '<tbody>' + behovRows + '</tbody>' +
          '<tfoot><tr><td>Sum</td><td>' + esc(fmt(c.sumTimer)) + '</td></tr></tfoot>' +
        '</table>' +
      '</div>'
    );
  }

  function renderSak(id, focusAgentId) {
    var state = UlobaStore.get();
    if (!state.raadgiver) {
      window.location.hash = '#/uloba';
      return;
    }
    var c = UlobaStore.getCase(id);
    if (!c) {
      render404();
      return;
    }
    setTitle('Sak ' + c.id + ' – ' + c.navn);

    var agentCards = ULOBA_DATA.agenter.map(function (agent) {
      var output = c.agentOutputs && c.agentOutputs[agent.id];
      var done = !!output;
      return (
        '<section class="agent-card' + (done ? ' agent-card--done' : '') + '" id="agent-' + esc(agent.id) + '" aria-label="Agent: ' + esc(agent.navn) + '">' +
          '<div class="agent-card__head">' +
            '<h3>' + esc(agent.navn) + '</h3>' +
            '<button type="button" class="btn btn--secondary btn--small" data-run-agent="' + esc(agent.id) + '">' + (done ? 'Kjør på nytt' : 'Kjør agent') + '</button>' +
            (done ? '<button type="button" class="btn btn--ghost btn--small" data-edit-agent="' + esc(agent.id) + '">Rediger</button>' : '') +
          '</div>' +
          '<p class="agent-card__desc">' + esc(agent.beskrivelse) + '</p>' +
          '<div id="agent-out-wrap-' + esc(agent.id) + '">' +
            (done
              ? '<div class="agent-output" id="agent-out-' + esc(agent.id) + '">' + esc(output) + '</div>' +
                '<p class="ki-note">KI-generert utkast – skal kvalitetssikres av rådgiver</p>'
              : '') +
          '</div>' +
        '</section>'
      );
    }).join('');

    var alleKjort = ULOBA_DATA.agenter.every(function (a) {
      return c.agentOutputs && c.agentOutputs[a.id];
    });

    render(
      '<div class="container">' +
        '<p class="no-print"><a href="#/uloba">&larr; Tilbake til sakslisten</a></p>' +
        '<h1>Sak ' + esc(c.id) + ' – ' + esc(c.navn) + '</h1>' +
        '<p class="lede">' + statusChip(c.status) + ' &nbsp; Mottatt ' + esc(c.mottattDato || '–') + ' &nbsp; ' + esc(c.kommune) + ' &nbsp; <strong>' + esc(fmt(c.sumTimer)) + ' t/uke</strong></p>' +
        '<div class="two-col">' +
          '<div>' + kartleggingSummary(c) + '</div>' +
          '<div>' +
            '<div class="card card--tint-blue">' +
              '<h2>KI-agenter</h2>' +
              '<p>Kjør agentene i valgfri rekkefølge. Alle utkast kan redigeres, og skal alltid kvalitetssikres av deg som rådgiver før noe sendes til arbeidslederen.</p>' +
            '</div>' +
            agentCards +
            '<div class="card">' +
              '<h2>Anbefaling</h2>' +
              '<p id="bygg-hint">' + (alleKjort
                ? 'Alle fire agentene er kjørt. Bygg anbefalingen, gå gjennom den, og send den til arbeidslederen.'
                : 'Kjør alle fire agentene først – da kan du bygge en samlet anbefaling.') + '</p>' +
              '<button type="button" class="btn btn--primary" id="bygg-anbefaling"' + (alleKjort ? '' : ' disabled') + '>Bygg anbefaling</button>' +
              '<div id="anbefaling-preview"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );

    bindSakEvents(c.id);

    if (focusAgentId) {
      var fokusKort = byId('agent-' + focusAgentId);
      if (fokusKort) {
        fokusKort.setAttribute('tabindex', '-1');
        fokusKort.focus();
      }
    }
  }

  function typewriter(el, text, done) {
    if (reducedMotion()) {
      el.textContent = text;
      if (done) { done(); }
      return;
    }
    el.textContent = '';
    var i = 0;
    var chunk = Math.max(3, Math.round(text.length / 260));
    var timer = window.setInterval(function () {
      i += chunk;
      el.textContent = text.slice(0, i);
      el.scrollTop = el.scrollHeight;
      if (i >= text.length) {
        window.clearInterval(timer);
        el.textContent = text;
        if (done) { done(); }
      }
    }, 14);
  }

  function bindSakEvents(caseId) {
    Array.prototype.forEach.call(main.querySelectorAll('[data-run-agent]'), function (btn) {
      btn.addEventListener('click', function () {
        runAgent(caseId, btn.getAttribute('data-run-agent'));
      });
    });
    Array.prototype.forEach.call(main.querySelectorAll('[data-edit-agent]'), function (btn) {
      btn.addEventListener('click', function () {
        toggleEditAgent(caseId, btn.getAttribute('data-edit-agent'), btn);
      });
    });
    var byggBtn = byId('bygg-anbefaling');
    if (byggBtn) {
      byggBtn.addEventListener('click', function () {
        byggAnbefalingPreview(caseId);
      });
    }
  }

  function runAgent(caseId, agentId) {
    var agent = ULOBA_DATA.agentById(agentId);
    var c = UlobaStore.getCase(caseId);
    if (!agent || !c) { return; }
    var hashVedStart = window.location.hash;
    var wrap = byId('agent-out-wrap-' + agentId);
    var runBtn = main.querySelector('[data-run-agent="' + agentId + '"]');
    if (runBtn) { runBtn.disabled = true; }
    wrap.innerHTML =
      '<div class="spinner-row" role="status"><span class="spinner" aria-hidden="true"></span><span>Agenten analyserer saken …</span></div>';

    var delay = reducedMotion() ? 0 : 1200;
    window.setTimeout(function () {
      if (window.location.hash !== hashVedStart) { return; }
      var wrapNa = byId('agent-out-wrap-' + agentId);
      if (!wrapNa) { return; }
      var tekst = agent.mal(c);
      wrapNa.innerHTML =
        '<div class="agent-output" id="agent-out-' + esc(agentId) + '"></div>' +
        '<p class="ki-note">KI-generert utkast – skal kvalitetssikres av rådgiver</p>';
      var outEl = byId('agent-out-' + agentId);
      if (!outEl) { return; }
      typewriter(outEl, tekst, function () {
        if (window.location.hash !== hashVedStart) { return; }
        var outputs = {};
        var fresh = UlobaStore.getCase(caseId);
        if (fresh && fresh.agentOutputs) {
          Object.keys(fresh.agentOutputs).forEach(function (k) { outputs[k] = fresh.agentOutputs[k]; });
        }
        outputs[agentId] = tekst;
        var patch = { agentOutputs: outputs };
        if (fresh && fresh.status === 'mottatt') {
          patch.status = 'under_behandling';
        }
        UlobaStore.updateCase(caseId, patch);
        announce('Agenten ' + agent.navn + ' er ferdig. Utkastet er klart til gjennomgang.');
        renderSak(caseId, agentId);
      });
    }, delay);
  }

  function toggleEditAgent(caseId, agentId, btn) {
    var wrap = byId('agent-out-wrap-' + agentId);
    var existingTextarea = wrap.querySelector('textarea');
    var c = UlobaStore.getCase(caseId);
    if (!c) { return; }

    if (existingTextarea) {
      // Lagre redigering
      var outputs = {};
      Object.keys(c.agentOutputs || {}).forEach(function (k) { outputs[k] = c.agentOutputs[k]; });
      outputs[agentId] = existingTextarea.value;
      UlobaStore.updateCase(caseId, { agentOutputs: outputs });
      announce('Endringen er lagret.');
      wrap.innerHTML =
        '<div class="agent-output" id="agent-out-' + esc(agentId) + '"></div>' +
        '<p class="ki-note">KI-generert utkast – skal kvalitetssikres av rådgiver</p>';
      byId('agent-out-' + agentId).textContent = existingTextarea.value;
      btn.textContent = 'Rediger';
    } else {
      var current = (c.agentOutputs && c.agentOutputs[agentId]) || '';
      wrap.innerHTML =
        '<label class="visually-hidden" for="agent-edit-' + esc(agentId) + '">Rediger utkast fra agenten</label>' +
        '<textarea class="agent-output-edit" id="agent-edit-' + esc(agentId) + '"></textarea>' +
        '<p class="ki-note">KI-generert utkast – skal kvalitetssikres av rådgiver</p>';
      var ta = byId('agent-edit-' + agentId);
      ta.value = current;
      ta.focus();
      btn.textContent = 'Lagre endring';
    }
  }

  function byggAnbefalingPreview(caseId) {
    var c = UlobaStore.getCase(caseId);
    if (!c) { return; }
    var seksjoner = ULOBA_DATA.byggAnbefalingSeksjoner(c, c.agentOutputs || {});
    var preview = byId('anbefaling-preview');

    preview.innerHTML =
      '<h3 style="margin-top:24px">Forhåndsvisning – rediger fritt før du sender</h3>' +
      seksjoner.map(function (s, i) {
        return (
          '<div class="form-field">' +
            '<label for="anb-sek-' + i + '">' + esc(s.tittel) + '</label>' +
            '<textarea id="anb-sek-' + i + '" data-anb-id="' + esc(s.id) + '" data-anb-tittel="' + esc(s.tittel) + '" class="agent-output-edit" style="min-height:140px"></textarea>' +
          '</div>'
        );
      }).join('') +
      '<p class="ki-note">KI-generert utkast – skal kvalitetssikres av rådgiver</p>' +
      '<div class="btn-row"><button type="button" class="btn btn--primary" id="send-anbefaling">Send anbefaling til arbeidslederen</button></div>' +
      '<div id="send-result"></div>';

    seksjoner.forEach(function (s, i) {
      byId('anb-sek-' + i).value = s.tekst;
    });

    announce('Anbefalingen er bygget. Gå gjennom seksjonene og send når du er klar.');
    byId('send-anbefaling').addEventListener('click', function () {
      var redigerte = [];
      Array.prototype.forEach.call(preview.querySelectorAll('textarea[data-anb-id]'), function (ta) {
        redigerte.push({
          id: ta.getAttribute('data-anb-id'),
          tittel: ta.getAttribute('data-anb-tittel'),
          tekst: ta.value
        });
      });
      UlobaStore.updateCase(caseId, { anbefaling: redigerte, status: 'anbefaling_klar' });
      announce('Anbefalingen er sendt til arbeidslederen. Status er oppdatert til Anbefaling klar.');
      byId('send-result').innerHTML =
        '<div class="alert alert--success" role="status">Anbefalingen er sendt! Arbeidslederen ser den nå på sin side. ' +
        '<a href="#/anbefaling/' + encodeURIComponent(caseId) + '">Se anbefalingen slik arbeidslederen ser den</a>.</div>';
      var chipRow = main.querySelector('.lede .status-chip');
      if (chipRow) {
        chipRow.outerHTML = statusChip('anbefaling_klar');
      }
    });
  }

  /* ============================================================
     7) ANBEFALING (til arbeidslederen)
     ============================================================ */

  function renderAnbefaling(id) {
    var c = UlobaStore.getCase(id);
    if (!c) {
      render404();
      return;
    }
    setTitle('Anbefaling – ' + c.navn);

    if (c.status !== 'anbefaling_klar' && !c.anbefaling) {
      render(
        '<div class="container container--narrow">' +
          '<h1>Anbefalingen er ikke klar ennå</h1>' +
          '<p class="lede">Saken ' + esc(c.id) + ' er fortsatt under behandling. Du får beskjed på Min side når anbefalingen er klar.</p>' +
          '<a href="#/min-side" class="btn btn--primary">Til Min side</a>' +
        '</div>'
      );
      return;
    }

    var seksjoner = c.anbefaling && c.anbefaling.length
      ? c.anbefaling
      : ULOBA_DATA.byggAnbefalingSeksjoner(c, c.agentOutputs || {});

    var res = ULOBA_DATA.beregnAnbefalt(c);
    var timeTabell =
      '<div class="table-wrap"><table class="behov-tabell">' +
        '<caption class="visually-hidden">Anbefalt timetall per livsområde</caption>' +
        '<thead><tr><th scope="col">Livsområde</th><th scope="col">Ditt anslag</th><th scope="col">Anbefalt</th></tr></thead>' +
        '<tbody>' +
        ULOBA_DATA.kategorier.map(function (k) {
          return '<tr><td>' + esc(k.label) + '</td><td>' + esc(fmt(c.behov ? c.behov[k.key] : 0)) + '</td><td>' + esc(fmt(res.anbefalt[k.key])) + '</td></tr>';
        }).join('') +
        '</tbody>' +
        '<tfoot><tr><td>Sum timer per uke</td><td>' + esc(fmt(c.sumTimer)) + '</td><td>' + esc(fmt(res.sum)) + '</td></tr></tfoot>' +
      '</table></div>';

    var sectionsHtml = seksjoner.map(function (s) {
      if (s.id === 'soknadsutkast') {
        return (
          '<section class="anbefaling-section" aria-labelledby="sek-' + esc(s.id) + '">' +
            '<h2 id="sek-' + esc(s.id) + '">' + esc(s.tittel) + '</h2>' +
            '<details class="soknad-details">' +
              '<summary>Vis søknadsutkastet</summary>' +
              '<pre>' + esc(s.tekst) + '</pre>' +
            '</details>' +
          '</section>'
        );
      }
      var extra = s.id === 'timetall' ? timeTabell : '';
      if (s.id === 'dokumentasjon') {
        extra =
          '<h3>Sjekkliste for søknaden</h3>' +
          '<ul>' +
          (ULOBA_DATA.sjekkliste || []).map(function (punkt) {
            return '<li>' + esc(punkt) + '</li>';
          }).join('') +
          '</ul>';
      }
      if (s.id === 'neste-steg' && ULOBA_DATA.regelverk.fremover) {
        extra = '<p class="anbefaling-tekst">' + esc(ULOBA_DATA.regelverk.fremover) + '</p>';
      }
      return (
        '<section class="anbefaling-section" aria-labelledby="sek-' + esc(s.id) + '">' +
          '<h2 id="sek-' + esc(s.id) + '">' + esc(s.tittel) + '</h2>' +
          '<p class="anbefaling-tekst">' + esc(s.tekst) + '</p>' +
          extra +
        '</section>'
      );
    }).join('');

    render(
      '<div class="container container--narrow">' +
        '<p class="no-print"><a href="#/min-side">&larr; Til Min side</a></p>' +
        '<h1>Anbefaling fra Uloba</h1>' +
        '<p class="lede">' + esc(c.navn) + ' &middot; ' + esc(c.kommune) + ' &middot; ' + esc(ULOBA_DATA.dagensDato) + '</p>' +
        '<div class="alert alert--info">Denne anbefalingen er utarbeidet med støtte fra KI-agenter og kvalitetssikret av en rådgiver i Uloba. Den er et råd til deg, ikke et vedtak – du bestemmer selv hva du sender til kommunen.</div>' +
        '<div class="btn-row no-print" style="margin-top:0;margin-bottom:24px">' +
          '<button type="button" class="btn btn--secondary" id="print-btn">Skriv ut / lagre som PDF</button>' +
        '</div>' +
        '<div class="card">' + sectionsHtml + '</div>' +
        '<p class="print-only">Prototype/demo. Utarbeidet med støtte fra KI-agenter og kvalitetssikret av rådgiver i Uloba. Dette er et råd, ikke et vedtak.</p>' +
      '</div>'
    );

    var printBtn = byId('print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
      });
    }
  }

  /* ============================================================
     404
     ============================================================ */

  function render404() {
    setTitle('Fant ikke siden');
    render(
      '<div class="container container--narrow">' +
        '<h1>Vi fant ikke den siden</h1>' +
        '<p class="lede">Noe gikk galt hos oss – ikke hos deg. Lenken finnes ikke, eller demoen er nullstilt.</p>' +
        '<a href="#/" class="btn btn--primary">Til forsiden</a>' +
      '</div>'
    );
  }

  /* ============================================================
     Ruter
     ============================================================ */

  function router() {
    var hash = window.location.hash || '#/';
    var path = hash.slice(1);
    updateNav(path);
    var m;
    if (path === '/' || path === '') {
      renderLanding();
    } else if (path === '/login') {
      renderLogin();
    } else if (path === '/min-side') {
      renderMinSide();
    } else if (path === '/kartlegging') {
      renderKartlegging();
    } else if ((m = path.match(/^\/kvittering\/(.+)$/))) {
      renderKvittering(decodeURIComponent(m[1]));
    } else if (path === '/uloba') {
      renderUloba();
    } else if ((m = path.match(/^\/uloba\/sak\/(.+)$/))) {
      renderSak(decodeURIComponent(m[1]));
    } else if ((m = path.match(/^\/anbefaling\/(.+)$/))) {
      renderAnbefaling(decodeURIComponent(m[1]));
    } else {
      render404();
    }
  }

  window.addEventListener('hashchange', function () {
    shouldFocusHeading = true;
    router();
  });

  // Åpne alle <details> før utskrift, slik at søknadsutkastet kommer med.
  window.addEventListener('beforeprint', function () {
    Array.prototype.forEach.call(document.querySelectorAll('details'), function (d) {
      d.setAttribute('data-was-closed', d.open ? '' : 'true');
      d.open = true;
    });
  });
  window.addEventListener('afterprint', function () {
    Array.prototype.forEach.call(document.querySelectorAll('details'), function (d) {
      if (d.getAttribute('data-was-closed') === 'true') { d.open = false; }
      d.removeAttribute('data-was-closed');
    });
  });

  // Nullstill demo
  var resetBtn = document.getElementById('reset-demo-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      var ok = window.confirm('Vil du nullstille demoen? All lokal demodata slettes, og demosakene legges inn på nytt.');
      if (!ok) { return; }
      UlobaStore.reset();
      announce('Demoen er nullstilt.');
      if (window.location.hash === '#/' || window.location.hash === '') {
        router();
      } else {
        window.location.hash = '#/';
      }
    });
  }

  // Første innlasting
  router();
})();
