/* ============================================================
   Uloba PoC – domeneinnhold
   Alt innhold er statisk demoinnhold. Ingen data forlater nettleseren.
   Global: ULOBA_DATA
   ============================================================ */
/* eslint-disable no-unused-vars */

var ULOBA_DATA = (function () {
  'use strict';

  // Fast demodato slik at demoen er deterministisk.
  var DAGENS_DATO = '17. august 2026';
  var DAGENS_DATO_KORT = '17.08.2026';
  var DEMO_AAR = 2026;

  var KOMMUNER = ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Tromsø', 'Annen'];

  var KATEGORIER = [
    { key: 'personligStell', label: 'Personlig stell og hygiene' },
    { key: 'maaltider', label: 'Måltider og ernæring' },
    { key: 'forflytning', label: 'Forflytning' },
    { key: 'husholdning', label: 'Husholdning og praktiske oppgaver' },
    { key: 'arbeidUtdanning', label: 'Arbeid og utdanning' },
    { key: 'fritidSamfunn', label: 'Fritid og samfunnsdeltakelse' },
    { key: 'nattTilsyn', label: 'Natt og tilsyn' }
  ];

  var LIVSSITUASJON_TAGS = [
    { key: 'arbeid', label: 'I arbeid' },
    { key: 'student', label: 'Student' },
    { key: 'familie', label: 'Har barn' },
    { key: 'organisasjon', label: 'Aktiv i organisasjonsliv' },
    { key: 'fritid', label: 'Aktivt fritidsliv' },
    { key: 'alene', label: 'Bor alene' }
  ];

  var TJENESTER = [
    { key: 'hjemmesykepleie', label: 'Hjemmesykepleie' },
    { key: 'praktiskBistand', label: 'Praktisk bistand' },
    { key: 'avlastning', label: 'Avlastning' },
    { key: 'stottekontakt', label: 'Støttekontakt' },
    { key: 'ingen', label: 'Ingen kommunale tjenester i dag' }
  ];

  var DOKUMENT_FORSLAG = ['Legeerklæring', 'Spesialistuttalelse', 'Individuell plan'];

  var STATUSER = {
    ny: 'Ny',
    mottatt: 'Mottatt hos Uloba',
    under_behandling: 'Under behandling',
    anbefaling_klar: 'Anbefaling klar'
  };

  var PERSONAS = [
    { navn: 'Kari Nordmann', beskrivelse: 'Ny søker – ingen sak ennå' },
    { navn: 'Ingrid Solheim', beskrivelse: 'Har sak med ferdig anbefaling' },
    { navn: 'Sander Bakke', beskrivelse: 'Har sak under behandling' },
    { navn: 'Anne Kristin Løvås', beskrivelse: 'Har sak under behandling' }
  ];

  /* ------------------------------------------------------------
     Regelverkstekster (verifisert kunnskapsgrunnlag per 17.08.2026)
     ------------------------------------------------------------ */
  var REGELVERK = {
    hvaErBpa:
      'Brukerstyrt personlig assistanse (BPA) er en måte å organisere praktisk bistand, opplæring og støttekontakt på, der du selv styrer hjelpen. I stedet for å motta tjenester når kommunen har ledig kapasitet, får du et timevedtak og bestemmer selv hvem som skal assistere deg, hva assistentene skal gjøre, og når og hvor assistansen skal skje. BPA er et likestillingsverktøy: Målet er at du skal kunne leve et aktivt og selvstendig liv – jobbe, studere, delta i fritidsaktiviteter og familieliv – på linje med alle andre.',
    hvemHarRett:
      'Du har rett til BPA etter pasient- og brukerrettighetsloven § 2-1 d hvis du er under 67 år, har behov for assistanse i mer enn 2 år, og behovet er på minst 32 timer per uke. Har du behov for mellom 25 og 32 timer per uke, har du også rett til BPA – med mindre kommunen kan dokumentere at BPA vil bli vesentlig dyrere enn andre måter å gi tjenestene på. Fikk du BPA før du fylte 67, beholder du retten også etter fylte 67 år. Foreldre til hjemmeboende barn under 18 år med nedsatt funksjonsevne har rett til å få avlastning organisert som BPA. Oppfyller du ikke disse vilkårene, kan kommunen likevel velge å gi deg BPA etter en konkret vurdering – alle kommuner har plikt til å ha et BPA-tilbud (helse- og omsorgstjenesteloven §§ 3-2 og 3-8).',
    slikSoker:
      'Du søker om BPA til kommunen du bor i – ikke til Uloba eller andre leverandører. Kommunen skal kartlegge bistandsbehovet ditt (behovet registreres i kommunens kartleggingssystem, IPLOS/KPR) og fatte et skriftlig enkeltvedtak som sier hvor mange assistansetimer du får per uke. Beskriv behovet ditt konkret og gjerne time for time: morgenstell, måltider, husarbeid, jobb eller studier, trening, fritid, samfunnsdeltakelse. Når vedtaket er fattet, velger du leverandør av ordningen der kommunen har avtaler – for eksempel Uloba, som er et samvirke eid av funksjonshemmede selv. Uloba kan også hjelpe deg med selve søknaden.',
    arbeidsleder:
      'Med BPA blir du arbeidsleder for dine egne assistenter. Du rekrutterer assistenter, setter opp arbeidsplaner og leder det daglige arbeidet – med opplæring og støtte fra leverandøren, som normalt har arbeidsgiveransvaret. Arbeidslederrollen må ivaretas på en forsvarlig måte, men du må ikke gjøre alt selv: Rollen kan helt eller delvis ivaretas av en annen, for eksempel en forelder eller verge.',
    avslag:
      'Får du avslag, eller færre timer enn du trenger, kan du klage. Fristen er fire uker fra du mottok vedtaket. Klagen skal være skriftlig og undertegnet, og sendes til kommunen, som skal vurdere saken på nytt. Hvis kommunen opprettholder vedtaket, sendes klagen automatisk videre til statsforvalteren, som avgjør saken endelig (pasient- og brukerrettighetsloven § 7-2). Pasient- og brukerombudet i fylket ditt kan gi gratis hjelp i klageprosessen.',
    fremover:
      'BPA-utvalgets utredning NOU 2021: 11 «Selvstyrt er velstyrt» foreslo å styrke BPA som likestillingsverktøy. I oktober 2024 sendte Helse- og omsorgsdepartementet rundskriv I-4/2024 til alle kommuner med presiseringer av gjeldende rett, og i oktober 2025 ble det oppnevnt et ekspertutvalg som skal levere forslag til fremtidens BPA-ordning innen 15. desember 2026 – blant annet om BPA bør få en egen lov. Inntil videre gjelder reglene beskrevet ovenfor.'
  };

  // Hint i kartleggingens time-summering, basert på tersklene 25 og 32 t/uke.
  function terskelHint(sum) {
    if (sum >= 32) {
      return '32 timer per uke eller mer: Du har rett til å få tjenestene organisert som BPA (pasient- og brukerrettighetsloven § 2-1 d).';
    }
    if (sum >= 25) {
      return 'Mellom 25 og 32 timer per uke: Du har rett til BPA – med mindre kommunen kan dokumentere at BPA blir vesentlig dyrere. Bevisbyrden ligger hos kommunen.';
    }
    if (sum > 0) {
      return 'Under 25 timer per uke: Ingen automatisk rettighet, men kommunen har plikt til å ha et BPA-tilbud (helse- og omsorgstjenesteloven § 3-8) og skal vurdere søknaden din konkret og individuelt (pasient- og brukerrettighetsloven § 2-1 a, jf. rundskriv I-9/2015).';
    }
    return 'Fyll inn timene dine, så ser du hva summen betyr for retten til BPA.';
  }

  var SJEKKLISTE = [
    'Personalia og kontaktinformasjon for søkeren (og eventuelt den som søker på vegne av søkeren, med fullmakt).',
    'Tydelig angivelse av hva det søkes om: personlig assistanse organisert som BPA, med ønsket timetall per uke.',
    'Legeerklæring eller uttalelse fra fastlege eller spesialist som dokumenterer diagnose, funksjonsnedsettelse og at behovet er langvarig (ut over 2 år).',
    'Konkret beskrivelse av bistandsbehovet, gjerne time for time gjennom uken, slik at samlet timetall kommer tydelig frem.',
    'Behov på natt eller for flere assistenter samtidig beskrevet særskilt, med begrunnelse for om behovet er kontinuerlig.',
    'Mål for ordningen: hvordan BPA gir et aktivt og selvstendig liv – jobb, studier, familieliv, organisasjonsliv.',
    'Hvordan arbeidslederrollen skal ivaretas forsvarlig: av søkeren selv eller av navngitt person.',
    'Eksisterende vedtak og tjenester som ønskes samlet i BPA-ordningen.',
    'Ønsket leverandør der kommunen har fritt brukervalg (for eksempel Uloba).',
    'Henvisning til rettsgrunnlaget: pbrl. § 2-1 d, hol. §§ 3-2 og 3-8, rundskriv I-9/2015 og I-4/2024.',
    'Dato og underskrift – og husk: Vedtaket kan påklages innen 4 uker (pbrl. §§ 7-2 og 7-5).'
  ];

  /* ------------------------------------------------------------
     Demosaker (faste demodatoer – ikke Date.now)
     ------------------------------------------------------------ */
  var DEMO_CASES = [
    {
      id: 'demo-001',
      navn: 'Ingrid Solheim',
      fodselsaar: 1992,
      kommune: 'Drammen',
      boform: 'Tilrettelagt enebolig, bor med ektefelle og to barn (6 og 9 år)',
      kontakt: { epost: 'ingrid.solheim@example.no', telefon: '901 23 456' },
      livssituasjon: {
        fritekst:
          'Ryggmargsskade (komplett, Th6) etter trafikkulykke i 2019. Rullestolbruker. Jobber 80 % som regnskapsfører, delvis hjemmekontor. Aktiv i barnas fritidsaktiviteter og styremedlem i borettslaget.',
        tags: ['arbeid', 'familie', 'fritid']
      },
      behov: {
        personligStell: 10,
        maaltider: 5,
        forflytning: 4,
        husholdning: 6,
        arbeidUtdanning: 8,
        fritidSamfunn: 8,
        nattTilsyn: 4
      },
      sumTimer: 45,
      arbeidsleder: { hvem: 'selv', navn: '' },
      dagensTjenester: ['Hjemmesykepleie', 'Praktisk bistand'],
      tidligereSoknader:
        'Søkte BPA i 2023, fikk innvilget 28 t/uke. Klaget ikke. Behovet har økt etter at yngste barn begynte på skolen og stillingsprosenten økte.',
      dokumenter: [
        'legeerklaering_spesialist_2026.pdf',
        'funksjonsvurdering_ergoterapeut.pdf',
        'vedtak_2023.pdf',
        'arbeidsgiverbekreftelse.pdf'
      ],
      fritekstBehov:
        'Trenger assistanse morgen og kveld til stell og forflytning, praktisk hjelp i hjemmet, følge til barnas aktiviteter, og bistand til å komme meg på jobb og i møter. Om natten trenger jeg hjelp til snuing og toalettbesøk.',
      status: 'anbefaling_klar',
      mottattDato: '04.08.2026',
      kjorteAgenter: ['behovsanalyse', 'regelverk', 'timeberegning', 'soknadsutkast'],
      agentReferanser: {
        regelverk:
          'Konklusjon: Sterk rettighetsposisjon. 45 t/uke er klart over 32-timersgrensen, alder 34 år, varig behov dokumentert. Nattbehov må vurderes mot kontinuitetskravet i § 2-1 d annet ledd.',
        timeberegning:
          'Anbefalt 47 t/uke (dokumentert 45). Justert opp fritid/samfunnsdeltakelse (+2) pga. styreverv og barnas aktiviteter som ikke var fullt tallfestet.'
      }
    },
    {
      id: 'demo-002',
      navn: 'Sander Bakke',
      fodselsaar: 1999,
      kommune: 'Trondheim',
      boform: 'Tilrettelagt studentleilighet, bor alene',
      kontakt: { epost: 'sander.bakke@example.no', telefon: '902 34 567' },
      livssituasjon: {
        fritekst:
          'Limb-girdle muskeldystrofi, gradvis progredierende. Elektrisk rullestol. Masterstudent i informatikk ved NTNU, aktiv i studentforening og e-sportmiljø.',
        tags: ['student', 'fritid']
      },
      behov: {
        personligStell: 8,
        maaltider: 4,
        forflytning: 3,
        husholdning: 4,
        arbeidUtdanning: 6,
        fritidSamfunn: 4,
        nattTilsyn: 1
      },
      sumTimer: 30,
      arbeidsleder: { hvem: 'selv', navn: '' },
      dagensTjenester: ['Praktisk bistand'],
      tidligereSoknader: 'Ingen tidligere BPA-søknader. Flyttet fra foreldrehjemmet i Molde i 2024.',
      dokumenter: ['legeerklaering_nevrolog.pdf', 'epikrise_2025.pdf', 'bekreftelse_studieplass_NTNU.pdf'],
      fritekstBehov:
        'Trenger hjelp til morgen- og kveldsrutiner, matlaging, husarbeid, bæring og praktisk bistand på campus, og til å delta i studentaktiviteter. Behovet øker gradvis pga. progresjon.',
      status: 'under_behandling',
      mottattDato: '11.08.2026',
      kjorteAgenter: ['behovsanalyse', 'regelverk'],
      agentReferanser: {
        behovsanalyse:
          'Flagget: tilsyn og samfunnsdeltakelse trolig underestimert. Progredierende tilstand tilsier at utmålingen bør ta høyde for utvikling. Assistanse i studiesituasjon bør avklares mot NAV funksjonsassistanse.',
        regelverk:
          'Konklusjon: God rettighetsposisjon. 30 t/uke ligger i intervallet 25–32: rett til BPA med mindre kommunen dokumenterer vesentlig økt kostnad. Bevisbyrden ligger hos kommunen.'
      }
    },
    {
      id: 'demo-003',
      navn: 'Anne Kristin Løvås',
      fodselsaar: 1968,
      kommune: 'Kristiansand',
      boform: 'Leilighet med heis, bor med ektefelle',
      kontakt: { epost: 'ak.lovas@example.no', telefon: '903 45 678' },
      livssituasjon: {
        fritekst:
          'Multippel sklerose (RRMS diagnostisert 2011, nå sekundær progressiv). Bruker krykker inne, rullestol ute. Jobber 50 % som bibliotekar. Varierende dagsform med betydelig fatigue.',
        tags: ['arbeid', 'fritid']
      },
      behov: {
        personligStell: 5,
        maaltider: 3,
        forflytning: 2,
        husholdning: 5,
        arbeidUtdanning: 3,
        fritidSamfunn: 4,
        nattTilsyn: 0
      },
      sumTimer: 22,
      arbeidsleder: { hvem: 'annen', navn: 'Terje Løvås (ektefelle)' },
      dagensTjenester: ['Hjemmesykepleie'],
      tidligereSoknader:
        "Fikk avslag på BPA i 2024 med begrunnelsen 'behov under 25 t/uke gir ikke rettskrav'. Klaget ikke den gangen.",
      dokumenter: ['legeerklaering_fastlege_2026.pdf', 'MS-forlop_nevrologisk_avd.pdf', 'avslagsvedtak_2024.pdf'],
      fritekstBehov:
        'Trenger fleksibel hjelp som følger dagsformen: stell og husarbeid på dårlige dager, følge til jobb og svømming, og mulighet til å spare timer til bedre perioder. Hjemmesykepleiens faste tider passer svært dårlig med MS-svingningene.',
      status: 'under_behandling',
      mottattDato: '13.08.2026',
      kjorteAgenter: ['behovsanalyse'],
      agentReferanser: {
        behovsanalyse:
          'Flagget: 22 t/uke er trolig underestimert – fatigue-relatert tilsyn og samfunnsdeltakelse er ikke tallfestet, og progresjon tilsier økende behov. Avslaget fra 2024 brukte timetallet alene som begrunnelse, noe som ikke er tilstrekkelig: kommunen har plikt til å ha et BPA-tilbud (hol. § 3-8) og skal vurdere søknaden konkret og individuelt (pbrl. § 2-1 a, jf. rundskriv I-9/2015).'
      }
    }
  ];

  /* ------------------------------------------------------------
     Hjelpere for maler
     ------------------------------------------------------------ */
  function fmt(n) {
    var v = Number(n) || 0;
    return String(v).replace('.', ',');
  }

  function alder(c) {
    var f = Number(c.fodselsaar);
    if (!f || f < 1900 || f > DEMO_AAR) { return null; }
    return DEMO_AAR - f;
  }

  // Hvem skal ivareta arbeidslederrollen? Mangler feltet, antas «selv» med myk formulering.
  function arbeidslederInfo(c) {
    var al = c.arbeidsleder || {};
    if (al.hvem === 'annen' && al.navn) { return { hvem: 'annen', navn: al.navn }; }
    if (al.hvem === 'selv') { return { hvem: 'selv', navn: '' }; }
    return { hvem: 'ukjent', navn: '' };
  }

  function joinListe(arr, fallback) {
    if (arr && arr.length) { return arr.join(', '); }
    return fallback || 'ingen oppgitt';
  }

  function harTag(c, tag) {
    return !!(c.livssituasjon && c.livssituasjon.tags && c.livssituasjon.tags.indexOf(tag) !== -1);
  }

  function sumBehov(behov) {
    var sum = 0;
    KATEGORIER.forEach(function (k) { sum += Number(behov && behov[k.key]) || 0; });
    return Math.round(sum * 2) / 2;
  }

  function harAvslag(c) {
    return /avslag/i.test(c.tidligereSoknader || '');
  }

  /* ------------------------------------------------------------
     Timeberegning: anbefalt utmåling per livsområde
     ------------------------------------------------------------ */
  function beregnAnbefalt(c) {
    var b = c.behov || {};
    var anbefalt = {};
    var begrunnelse = {};

    KATEGORIER.forEach(function (k) {
      anbefalt[k.key] = Number(b[k.key]) || 0;
      begrunnelse[k.key] = 'Egenvurdering lagt til grunn.';
    });

    // Samfunnsdeltakelse undervurderes erfaringsmessig.
    if ((Number(b.fritidSamfunn) || 0) < 5) {
      anbefalt.fritidSamfunn += 2;
      begrunnelse.fritidSamfunn =
        'Justert opp: Verv, trening, kultur og sosiale relasjoner er legitime assistansebehov som erfaringsmessig undervurderes.';
    } else if (harTag(c, 'familie')) {
      anbefalt.fritidSamfunn += 2;
      begrunnelse.fritidSamfunn =
        'Justert opp: Foreldrerollen krever assistanse til følging, aktiviteter og praktiske oppgaver knyttet til barna.';
    }

    // Lavt, men tilstedeværende nattbehov tilsier beredskap som sjelden tallfestes.
    var natt = Number(b.nattTilsyn) || 0;
    if (natt > 0 && natt <= 2) {
      anbefalt.nattTilsyn += 1;
      begrunnelse.nattTilsyn = 'Justert opp: Tilsyn og beredskap om natten telles ofte ikke med i egenvurderingen.';
    }

    var sum = 0;
    KATEGORIER.forEach(function (k) { sum += anbefalt[k.key]; });
    sum = Math.round(sum * 2) / 2;

    return { anbefalt: anbefalt, begrunnelse: begrunnelse, sum: sum };
  }

  /* ------------------------------------------------------------
     Agentmaler (KI-genererte utkast – kvalitetssikres av rådgiver)
     ------------------------------------------------------------ */

  function malBehovsanalyse(c) {
    var linjer = [];
    var b = c.behov || {};
    linjer.push('BEHOVSANALYSE – ' + c.navn + ' (f. ' + (c.fodselsaar || 'ukjent') + '), ' + c.kommune);
    linjer.push('');
    linjer.push(
      'Basert på innsendte opplysninger og vedlagte dokumenter (' + joinListe(c.dokumenter) +
      ') har jeg strukturert det beskrevne assistansebehovet per livsområde. ' + c.navn +
      ' bor i ' + (c.boform || 'ukjent boform') + ' og beskriver sin situasjon slik: «' +
      ((c.livssituasjon && c.livssituasjon.fritekst) || 'ikke oppgitt') + '». Egne ord om behovet: «' +
      (c.fritekstBehov || 'ikke oppgitt') + '».'
    );
    linjer.push('');
    linjer.push('Dokumentert behov per livsområde – totalt ' + fmt(c.sumTimer) + ' t/uke:');
    KATEGORIER.forEach(function (k) {
      linjer.push('  • ' + k.label + ': ' + fmt(b[k.key]) + ' t/uke');
    });
    linjer.push('');
    linjer.push('Områder som erfaringsmessig underestimeres:');
    linjer.push('');
    var pkt1 = '1. Tilsyn og beredskap. Timer der assistenten må være tilgjengelig uten aktiv oppgave telles ofte ikke med.';
    if ((Number(b.nattTilsyn) || 0) <= 2) {
      pkt1 += ' Oppgitt natt/tilsyn er lavt – avklar om det finnes behov for tilstedeværelse, snuing, toalettbesøk eller trygghet om natten som ikke er tallfestet.';
    }
    linjer.push(pkt1);
    linjer.push(
      '2. Spontanitet. BPA skal dekke livet slik det faktisk leves – ikke bare faste rutiner. Uforutsette ærender, besøk og endrede planer krever fleksible timer.'
    );
    var pkt3 = '3. Samfunnsdeltakelse.';
    if ((Number(b.fritidSamfunn) || 0) < 5) {
      pkt3 += ' Oppgitt tid til fritid og deltakelse er lav sammenlignet med det som er vanlig for et aktivt liv. Verv, trening, kultur og sosiale relasjoner er legitime assistansebehov.';
    }
    if (harTag(c, 'familie')) {
      pkt3 += ' Foreldrerollen krever assistanse til følging, aktiviteter og praktiske oppgaver knyttet til barna – sjekk at dette er medregnet.';
    }
    if (harTag(c, 'arbeid') || harTag(c, 'student')) {
      pkt3 += ' Assistanse i arbeid/studier kan kreve egen avklaring mot funksjonsassistanseordningen (NAV), men skal beskrives i søknaden.';
    }
    linjer.push(pkt3);
    linjer.push('');
    var al = arbeidslederInfo(c);
    var merk =
      'Merk: Behovet skal beskrives ut fra hva ' + c.navn +
      ' selv ønsker å gjøre i eget liv – ikke ut fra et minimumsnivå for forsvarlige tjenester. Dagens tjenester (' +
      joinListe(c.dagensTjenester, 'ingen') + ') er ikke et tak for utmålingen.';
    if (al.hvem === 'annen') {
      merk += ' Arbeidslederrollen skal ivaretas av ' + al.navn +
        ' – beskriv i søknaden hvordan rollen ivaretas forsvarlig.';
    } else {
      merk += ' ' + c.navn + ' planlegger selv å ivareta arbeidslederrollen.';
    }
    linjer.push(merk);
    return linjer.join('\n');
  }

  function malRegelverk(c) {
    var linjer = [];
    var a = alder(c);
    var sum = Number(c.sumTimer) || 0;
    linjer.push('REGELVERKSVURDERING – ' + c.navn + ', ' + c.kommune + ' kommune');
    linjer.push('');
    linjer.push(
      'Vurdering opp mot pasient- og brukerrettighetsloven (pbrl.) § 2-1 d og helse- og omsorgstjenesteloven (hol.) § 3-8.'
    );
    linjer.push('');
    var v1;
    if (a === null) {
      v1 = 'Vilkår 1 – alder: Alder er ikke oppgitt – vilkåret om å være under 67 år må avklares.';
    } else if (a < 67) {
      v1 = 'Vilkår 1 – alder: ' + c.navn + ' er ' + a + ' år. Vilkåret om å være under 67 år er oppfylt.';
    } else {
      v1 = 'Vilkår 1 – alder: ' + c.navn + ' er ' + a + ' år. Over 67 år gir bare rettighet dersom BPA var innvilget før fylte 67 – avklar historikk.';
    }
    linjer.push(v1);
    linjer.push('');
    linjer.push(
      'Vilkår 2 – langvarig behov (over 2 år): Ut fra beskrivelsen («' +
      ((c.livssituasjon && c.livssituasjon.fritekst) || 'ikke oppgitt') + '») og dokumentasjonen (' +
      joinListe(c.dokumenter) + ') fremstår behovet som varig. Sørg for at legeerklæring bekrefter forventet varighet over 2 år.'
    );
    linjer.push('');
    var v3 = 'Vilkår 3 – stort behov: Dokumentert behov er ' + fmt(sum) + ' t/uke. ';
    if (sum >= 32) {
      v3 += 'Behovet er minst 32 timer per uke. Vilkåret om stort behov er klart oppfylt, og ' + c.navn +
        ' har rett til å få tjenestene organisert som BPA.';
    } else if (sum >= 25) {
      v3 += 'Behovet er minst 25 timer per uke, men under 32. Da foreligger rett til BPA med mindre kommunen kan dokumentere at BPA-organisering vil medføre vesentlig økt kostnad. Bevisbyrden ligger hos kommunen.';
    } else {
      v3 += 'Behovet er under 25 timer per uke, og den individuelle rettigheten etter § 2-1 d gjelder ikke. Kommunen har likevel plikt til å ha et BPA-tilbud (hol. § 3-8) og skal vurdere søknaden konkret og individuelt (pbrl. § 2-1 a, jf. rundskriv I-9/2015). Mange kommuner innvilger BPA også under 25 timer per uke – et avslag kan ikke begrunnes med timetallet alene.';
    }
    linjer.push(v3);
    linjer.push('');
    linjer.push(
      'Merknad om natt og flere assistenter: Tjenester som krever mer enn én tjenesteyter til stede eller nattjenester inngår i rettighetsvurderingen bare ved kontinuerlig behov (§ 2-1 d annet ledd).'
    );
    if (harAvslag(c)) {
      linjer.push('');
      linjer.push(
        'Tidligere avslag: ' + c.tidligereSoknader +
        ' Gjennomgå begrunnelsen – endret behov, ny dokumentasjon eller feil rettsanvendelse kan gi grunnlag for ny søknad eller klage.'
      );
    }
    linjer.push('');
    var status = 'Sannsynlig rettighetsstatus: ';
    if (sum >= 32) {
      status += 'Sterk rettighetsposisjon.';
    } else if (sum >= 25) {
      status += 'God rettighetsposisjon med forbehold om kostnadsvurdering.';
    } else {
      status += 'Ingen automatisk rettighet, men reell mulighet gjennom kommunens plikt til å ha et BPA-tilbud (hol. § 3-8) og kravet om konkret, individuell vurdering (pbrl. § 2-1 a, jf. rundskriv I-9/2015).';
    }
    if (a === null) {
      status += ' Forbehold: Alder er ikke oppgitt – vilkåret om å være under 67 år må avklares før rettighetsstatusen kan bekreftes.';
    }
    linjer.push(status);
    return linjer.join('\n');
  }

  function malTimeberegning(c) {
    var res = beregnAnbefalt(c);
    var b = c.behov || {};
    var sum = Number(c.sumTimer) || 0;
    var linjer = [];
    linjer.push('ANBEFALT UTMÅLING – ' + c.navn);
    linjer.push('');
    KATEGORIER.forEach(function (k) {
      linjer.push(
        k.label + ': ' + fmt(b[k.key]) + ' → ' + fmt(res.anbefalt[k.key]) + ' t/uke. ' + res.begrunnelse[k.key]
      );
    });
    linjer.push('');
    linjer.push('Totalt: dokumentert ' + fmt(sum) + ' t/uke → anbefalt ' + fmt(res.sum) + ' t/uke.');
    linjer.push('');
    if (res.sum > sum) {
      linjer.push(
        'Vurdering av differansen: Anbefalingen ligger ' + fmt(Math.round((res.sum - sum) * 2) / 2) +
        ' t/uke over det ' + c.navn +
        ' selv har oppgitt. Dette skyldes at typisk underestimerte poster (tilsyn, spontanitet, samfunnsdeltakelse) er justert opp basert på beskrivelsen i «' +
        (c.fritekstBehov || '') + '».'
      );
    } else {
      linjer.push('Vurdering av differansen: Egenvurderingen fremstår realistisk og godt dokumentert.');
    }
    linjer.push('');
    var prinsipp =
      'Viktig prinsipp: Anbefalingen skal speile det reelle behovet – aldri tilpasses timegrensene på 25 eller 32 t/uke.';
    if ((res.sum >= 22 && res.sum < 25) || (res.sum >= 29 && res.sum < 32)) {
      prinsipp +=
        ' Totalen ligger like under en rettighetsgrense. Gå derfor nøye gjennom om alle reelle behov faktisk er tallfestet – underrapportering er svært vanlig, særlig for tilsyn og deltakelse. Dokumentér hver justering konkret.';
    }
    linjer.push(prinsipp);
    linjer.push('');
    var al = arbeidslederInfo(c);
    if (al.hvem === 'annen') {
      linjer.push(
        'Utmålingen forutsetter at ' + al.navn + ' ivaretar arbeidslederrollen, og at timene styres fleksibelt ut fra ' +
        c.navn + ' sitt behov. Timene bør vedtas som en fleksibel ukeramme, ikke bindes til klokkeslett.'
      );
    } else {
      linjer.push(
        'Utmålingen forutsetter at ' + c.navn +
        ' er arbeidsleder og selv styrer når, hvor og hvordan timene brukes. Timene bør vedtas som en fleksibel ukeramme, ikke bindes til klokkeslett.'
      );
    }
    return linjer.join('\n');
  }

  function malSoknadsutkast(c) {
    var res = beregnAnbefalt(c);
    var linjer = [];
    linjer.push(c.navn);
    linjer.push(c.kommune + ', ' + DAGENS_DATO);
    linjer.push('');
    linjer.push('Til ' + c.kommune + ' kommune v/ forvaltnings-/tildelingskontoret');
    linjer.push('');
    linjer.push('SØKNAD OM BRUKERSTYRT PERSONLIG ASSISTANSE (BPA)');
    linjer.push('');
    linjer.push(
      'Jeg søker med dette om brukerstyrt personlig assistanse med ' + fmt(res.sum) +
      ' timer per uke, jf. pasient- og brukerrettighetsloven § 2-1 a og § 2-1 d, jf. helse- og omsorgstjenesteloven § 3-2 første ledd nr. 6 bokstav b og § 3-8.'
    );
    linjer.push('');
    linjer.push(
      'Om meg: ' + (c.fodselsaar ? 'Jeg er født ' + c.fodselsaar + ' og bor' : 'Jeg bor') +
      ' i ' + (c.boform || 'egen bolig') + ' i ' + c.kommune + '. ' +
      ((c.livssituasjon && c.livssituasjon.fritekst) || '')
    );
    linjer.push('');
    linjer.push(
      'Mitt assistansebehov: ' + (c.fritekstBehov || '') +
      ' Behovet fordeler seg slik: personlig stell og hygiene (' + fmt(res.anbefalt.personligStell) +
      ' timer per uke), måltider (' + fmt(res.anbefalt.maaltider) + '), forflytning (' + fmt(res.anbefalt.forflytning) +
      '), husholdning (' + fmt(res.anbefalt.husholdning) + '), arbeid/utdanning (' + fmt(res.anbefalt.arbeidUtdanning) +
      '), fritid og samfunnsdeltakelse (' + fmt(res.anbefalt.fritidSamfunn) + '), natt/tilsyn (' +
      fmt(res.anbefalt.nattTilsyn) + '). Behovet er varig og vil bestå i mer enn to år, jf. vedlagt dokumentasjon.'
    );
    linjer.push('');
    if (res.sum >= 32) {
      linjer.push(
        'Mitt omsøkte behov er ' + fmt(res.sum) +
        ' timer per uke, som er minst 32 timer per uke. Jeg har dermed rett til å få tjenestene organisert som BPA etter pbrl. § 2-1 d.'
      );
    } else if (res.sum >= 25) {
      linjer.push(
        'Mitt omsøkte behov er ' + fmt(res.sum) +
        ' timer per uke, som er minst 25 timer per uke. Jeg har dermed rett til BPA med mindre kommunen kan dokumentere at organiseringen medfører vesentlig økt kostnad.'
      );
    } else {
      linjer.push(
        'Selv om det omsøkte behovet er under 25 timer per uke, har kommunen plikt til å ha et BPA-tilbud (hol. § 3-8) og skal vurdere søknaden konkret og individuelt (pbrl. § 2-1 a, jf. rundskriv I-9/2015). BPA er den organiseringsformen som best sikrer meg et aktivt og selvstendig liv.'
      );
    }
    linjer.push('');
    var al = arbeidslederInfo(c);
    var alSetning;
    if (al.hvem === 'annen') {
      alSetning = al.navn + ' skal være arbeidsleder for ordningen';
    } else if (al.hvem === 'selv') {
      alSetning = 'Jeg ønsker selv å være arbeidsleder';
    } else {
      alSetning = 'Jeg planlegger selv å ivareta arbeidslederrollen';
    }
    linjer.push(
      alSetning + ', og jeg ber om at timene vedtas som en fleksibel ramme. Dagens tjenester (' +
      joinListe(c.dagensTjenester, 'ingen') + ') dekker ikke mitt behov for selvbestemmelse og deltakelse.'
    );
    linjer.push('');
    linjer.push('Vedlegg: ' + joinListe(c.dokumenter));
    linjer.push('');
    linjer.push(
      'Jeg ber om skriftlig bekreftelse på mottatt søknad og foreløpig svar dersom saken ikke kan avgjøres innen én måned, jf. forvaltningsloven § 11 a. Jeg ber også om å få delta i kartleggingen, og om et begrunnet enkeltvedtak med opplysning om klageadgang.'
    );
    linjer.push('');
    linjer.push('Med vennlig hilsen');
    linjer.push(c.navn);
    return linjer.join('\n');
  }

  var AGENTER = [
    {
      id: 'behovsanalyse',
      navn: 'Behovsanalyse',
      beskrivelse:
        'Strukturerer det innsendte behovet per livsområde og flagger poster som erfaringsmessig underestimeres – tilsyn, spontanitet og samfunnsdeltakelse.',
      mal: malBehovsanalyse
    },
    {
      id: 'regelverk',
      navn: 'Regelverkssjekk',
      beskrivelse:
        'Vurderer saken opp mot pbrl. § 2-1 d og hol. § 3-8: alder, varighet og timegrensene på 25 og 32 t/uke.',
      mal: malRegelverk
    },
    {
      id: 'timeberegning',
      navn: 'Timeberegning',
      beskrivelse:
        'Foreslår anbefalt utmåling per livsområde med begrunnelse, og vurderer differansen mot egenvurderingen.',
      mal: malTimeberegning
    },
    {
      id: 'soknadsutkast',
      navn: 'Søknadsutkast',
      beskrivelse:
        'Skriver et komplett utkast til BPA-søknad til kommunen, klart til gjennomgang og signering.',
      mal: malSoknadsutkast
    }
  ];

  function agentById(id) {
    for (var i = 0; i < AGENTER.length; i++) {
      if (AGENTER[i].id === id) { return AGENTER[i]; }
    }
    return null;
  }

  /* ------------------------------------------------------------
     Anbefaling til arbeidsleder (seksjonsbasert)
     ------------------------------------------------------------ */
  function byggAnbefalingSeksjoner(c, agentOutputs) {
    var res = beregnAnbefalt(c);
    var sum = Number(c.sumTimer) || 0;
    var harTjenester = c.dagensTjenester && c.dagensTjenester.length &&
      !(c.dagensTjenester.length === 1 && /ingen/i.test(c.dagensTjenester[0]));
    var seksjoner = [];

    var al = arbeidslederInfo(c);
    var alTekst;
    if (al.hvem === 'annen') {
      alTekst = 'organisert slik at ' + al.navn + ' er arbeidsleder for ordningen';
    } else {
      alTekst = 'organisert slik at du selv er arbeidsleder';
    }
    var s1 =
      'Vi anbefaler at du søker ' + c.kommune + ' kommune om brukerstyrt personlig assistanse (BPA) med ' +
      fmt(res.sum) + ' timer per uke, ' + alTekst + '. BPA er ikke en helsetjeneste du mottar, men et verktøy du styrer – for arbeid, familie, fritid og deltakelse i samfunnet. Søk om en fleksibel timeramme, ikke timer bundet til faste klokkeslett.';
    if (harTjenester) {
      s1 += ' Be samtidig om at BPA erstatter dagens tjenester (' + joinListe(c.dagensTjenester) + ').';
    }
    seksjoner.push({ id: 'soke-om', tittel: 'Hva bør du søke om', tekst: s1 });

    var s2 =
      'Vi anbefaler ' + fmt(res.sum) + ' timer per uke, fordelt per livsområde (se tabellen under).';
    if (res.sum > sum) {
      s2 += ' Dette er ' + fmt(Math.round((res.sum - sum) * 2) / 2) +
        ' timer mer enn du selv oppga – erfaring viser at tilsyn, spontanitet og samfunnsdeltakelse ofte undervurderes, og disse er justert opp med konkret begrunnelse.';
    }
    seksjoner.push({ id: 'timetall', tittel: 'Anbefalt timetall', tekst: s2 });

    var status;
    if (res.sum >= 32) {
      status = 'klar rettighet';
    } else if (res.sum >= 25) {
      status = 'rettighet med kostnadsforbehold';
    } else {
      status = 'ingen automatisk rettighet, men reell mulighet etter en konkret og individuell vurdering';
    }
    var s3 =
      'Rett til BPA følger av pasient- og brukerrettighetsloven § 2-1 d. Vilkårene er: under 67 år (eller BPA innvilget før fylte 67), behov som varer over 2 år, og stort behov. Minst 32 timer per uke gir klar rettighet. Er behovet minst 25 timer per uke, har du også rett, med mindre kommunen kan dokumentere at BPA gir vesentlig økt kostnad. Under 25 timer per uke gjelder ikke rettigheten, men kommunen har plikt til å ha et BPA-tilbud (helse- og omsorgstjenesteloven § 3-8) og skal vurdere søknaden din konkret og individuelt (pbrl. § 2-1 a, jf. rundskriv I-9/2015).\n\nDin status: ' +
      status + '.';
    seksjoner.push({ id: 'regelverk', tittel: 'Slik fungerer regelverket', tekst: s3 });

    var dokLinjer = [
      '• Legeerklæring som bekrefter diagnose og at behovet varer over 2 år',
      '• Funksjonsbeskrivelse (gjerne ergoterapeut) knyttet til konkrete livsområder',
      '• Din egen behovsbeskrivelse med timeoversikt – den viktigste kilden er deg'
    ];
    if (harTag(c, 'arbeid') || harTag(c, 'student')) {
      dokLinjer.push('• Arbeidsgiver- eller studiestedsbekreftelse');
    }
    if (c.tidligereSoknader && !/^ingen/i.test(c.tidligereSoknader)) {
      dokLinjer.push('• Tidligere vedtak og søknadshistorikk: ' + c.tidligereSoknader);
    }
    dokLinjer.push('• Innsendte dokumenter: ' + joinListe(c.dokumenter) + ' – manglende punkter over bør ettersendes');
    seksjoner.push({ id: 'dokumentasjon', tittel: 'Krav til dokumentasjon', tekst: dokLinjer.join('\n') });

    var soknad = (agentOutputs && agentOutputs.soknadsutkast) || malSoknadsutkast(c);
    seksjoner.push({ id: 'soknadsutkast', tittel: 'Søknadsutkast', tekst: soknad });

    var s5 = [
      '1. Gjennomgå og signer søknadsutkastet',
      '2. Send søknaden til ' + c.kommune + ' kommune og be om bekreftelse på mottak',
      '3. Kommunen skal svare innen én måned eller gi foreløpig svar (fvl. § 11 a)',
      '4. Delta aktivt i kartleggingen – du definerer behovet, ikke skjemaet',
      '5. Uloba – samvirket eid av funksjonshemmede – kan bistå deg gjennom hele prosessen'
    ].join('\n');
    seksjoner.push({ id: 'neste-steg', tittel: 'Neste steg', tekst: s5 });

    var s6 =
      'Får du avslag, eller færre timer enn omsøkt, kan du klage etter pbrl. § 7-2. Fristen er fire uker fra du mottok vedtaket. Klagen sendes til kommunen, som skal vurdere saken på nytt; opprettholdes vedtaket, går klagen videre til Statsforvalteren. Et delvis innvilget vedtak kan også påklages – for eksempel på timetall eller manglende fleksibilitet. Uloba hjelper deg gjerne med klagen.';
    seksjoner.push({ id: 'klagerett', tittel: 'Dine klagerettigheter', tekst: s6 });

    return seksjoner;
  }

  /* ------------------------------------------------------------
     Generator: nye demobrukere med egen, fersk søknadsprosess.
     Brukes av demoverktøyet på forsiden. Kun demoinnhold –
     navn og situasjoner er tilfeldig sammensatt fra listene under.
     ------------------------------------------------------------ */
  var GEN_FORNAVN = ['Emma', 'Nora', 'Olav', 'Jakob', 'Selma', 'Amir', 'Maja', 'Henrik', 'Sofia', 'Leah', 'Mats', 'Aisha', 'Even', 'Tuva', 'Jonas', 'Live', 'Sigrid', 'Noah'];
  var GEN_ETTERNAVN = ['Hansen', 'Johansen', 'Berg', 'Strand', 'Moen', 'Dahl', 'Aune', 'Lie', 'Nguyen', 'Sæther', 'Foss', 'Holm', 'Brekke', 'Ali', 'Eide', 'Vik'];
  var GEN_BOFORMER = [
    'Leilighet med heis, bor alene',
    'Enebolig med tilrettelagt inngang, bor med samboer',
    'Borettslagsleilighet i første etasje, bor alene',
    'Tilrettelagt kommunal bolig, bor alene',
    'Rekkehus, bor med familie'
  ];
  var GEN_RELASJONER = ['mor', 'far', 'ektefelle', 'samboer', 'søster', 'bror'];
  var GEN_TIDLIGERE = [
    'Ikke søkt BPA tidligere.',
    'Søkte BPA i 2024 og fikk avslag med begrunnelse om at behovet kunne dekkes av hjemmetjenesten. Klaget ikke.',
    'Har praktisk bistand i dag, men har ikke søkt BPA før.'
  ];
  // Vekter: hvor stor andel av timene som typisk faller på hvert livsområde.
  var GEN_PROFILER = [
    {
      fritekst: function (fornavn) {
        return 'Ryggmargsskade etter ulykke i 2021, bruker manuell rullestol. ' + fornavn + ' jobber deltid og vil kunne stå i jobben, følge opp hjem og delta i fritidsaktiviteter uten å være avhengig av familien.';
      },
      tags: ['arbeid', 'fritid'],
      dokumenter: ['legeerklaering_fastlege.pdf', 'spesialistuttalelse_spinalenheten.pdf'],
      fritekstBehov: 'Trenger assistanse til morgen- og kveldsstell, forflytning, praktiske oppgaver i hjemmet og følge til jobb og aktiviteter.',
      vekter: { personligStell: 26, maaltider: 12, forflytning: 12, husholdning: 16, arbeidUtdanning: 14, fritidSamfunn: 14, nattTilsyn: 6 }
    },
    {
      fritekst: function (fornavn) {
        return 'Multippel sklerose (MS) diagnostisert i 2018, med gradvis økende assistansebehov og store dagsvariasjoner. ' + fornavn + ' jobber redusert og prioriterer å bruke kreftene på jobb og familie.';
      },
      tags: ['arbeid', 'familie'],
      dokumenter: ['legeerklaering_noevrolog.pdf', 'funksjonsvurdering_ergoterapeut.pdf'],
      fritekstBehov: 'Behovet varierer med dagsformen: gode dager mest praktisk bistand, dårlige dager også stell, måltider og forflytning. Trenger fleksibilitet i når timene brukes.',
      vekter: { personligStell: 20, maaltider: 14, forflytning: 10, husholdning: 22, arbeidUtdanning: 16, fritidSamfunn: 14, nattTilsyn: 4 }
    },
    {
      fritekst: function (fornavn) {
        return 'Muskeldystrofi med gradvis redusert kraft i armer og bein, bruker elektrisk rullestol. ' + fornavn + ' studerer og er aktiv i studentforeningen, og trenger assistanse for å leve et vanlig studentliv.';
      },
      tags: ['student', 'organisasjon', 'alene'],
      dokumenter: ['legeerklaering_fastlege.pdf', 'uttalelse_nevromuskulaert_kompetansesenter.pdf'],
      fritekstBehov: 'Trenger assistanse gjennom hele dagen: stell, påkledning, måltider, notater og praktisk tilrettelegging på studiestedet, samt deltakelse i studentaktiviteter på kveldstid.',
      vekter: { personligStell: 24, maaltider: 14, forflytning: 10, husholdning: 12, arbeidUtdanning: 20, fritidSamfunn: 14, nattTilsyn: 6 }
    },
    {
      fritekst: function (fornavn) {
        return 'Cerebral parese (GMFCS nivå IV). ' + fornavn + ' bor for seg selv for første gang og vil bygge et selvstendig voksenliv med jobb i deltidsstilling og et aktivt sosialt liv.';
      },
      tags: ['arbeid', 'alene', 'fritid'],
      dokumenter: ['legeerklaering_fastlege.pdf', 'epikrise_habiliteringstjenesten.pdf'],
      fritekstBehov: 'Trenger assistanse til stell, matlaging, husarbeid, trening etter program fra fysioterapeut, og følge til jobb, venner og aktiviteter.',
      vekter: { personligStell: 24, maaltider: 16, forflytning: 10, husholdning: 16, arbeidUtdanning: 12, fritidSamfunn: 16, nattTilsyn: 6 }
    },
    {
      fritekst: function (fornavn) {
        return 'Sterkt nedsatt syn kombinert med kronisk utmattelse. ' + fornavn + ' er i arbeidsrettet aktivitet og trenger assistanse for å delta i samfunnet på egne premisser.';
      },
      tags: ['fritid', 'alene'],
      dokumenter: ['legeerklaering_fastlege.pdf', 'synsvurdering_oyelege.pdf'],
      fritekstBehov: 'Trenger assistanse til lesing og administrasjon, handling, orientering på ukjente steder, husarbeid og følge til aktiviteter og avtaler.',
      vekter: { personligStell: 10, maaltider: 14, forflytning: 8, husholdning: 26, arbeidUtdanning: 16, fritidSamfunn: 24, nattTilsyn: 2 }
    }
  ];

  function pick(liste) {
    return liste[Math.floor(Math.random() * liste.length)];
  }

  function rund05(n) {
    return Math.max(0, Math.round(n * 2) / 2);
  }

  function tilEpost(navn) {
    return navn.toLowerCase()
      .replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa')
      .replace(/\s+/g, '.').replace(/[^a-z.]/g, '') + '@example.no';
  }

  // Lager en ny, unik demobruker. brukteNavn: liste over navn som allerede finnes.
  function genererBruker(brukteNavn) {
    brukteNavn = brukteNavn || [];
    var navn = '';
    for (var i = 0; i < 60; i++) {
      navn = pick(GEN_FORNAVN) + ' ' + pick(GEN_ETTERNAVN);
      if (brukteNavn.indexOf(navn) === -1) { break; }
    }
    if (brukteNavn.indexOf(navn) !== -1) {
      navn += ' ' + String(2 + Math.floor(Math.random() * 97));
    }
    var fodselsaar = 1961 + Math.floor(Math.random() * 44); // 22–65 år i demoåret 2026
    var kommune = pick(KOMMUNER.filter(function (k) { return k !== 'Annen'; }));
    return {
      navn: navn,
      fodselsaar: fodselsaar,
      kommune: kommune,
      boform: pick(GEN_BOFORMER),
      epost: tilEpost(navn),
      telefon: '9' + String(10 + Math.floor(Math.random() * 89)) + ' ' + String(10 + Math.floor(Math.random() * 89)) + ' ' + String(100 + Math.floor(Math.random() * 899)),
      generert: true
    };
  }

  // Lager en komplett, innsendt kartlegging (ny søknadsprosess) for en generert bruker.
  // Timesummen legges bevisst i ulike bånd (under 25 / 25–32 / over 32) så
  // regelverksvurderingene treffer forskjellige juridiske grener fra sak til sak.
  function genererKartlegging(bruker) {
    var profil = pick(GEN_PROFILER);
    var baand = pick(['under', 'mellom', 'over', 'over']);
    var maal;
    if (baand === 'under') { maal = 18 + Math.floor(Math.random() * 13) * 0.5; }        // 18–24
    else if (baand === 'mellom') { maal = 25 + Math.floor(Math.random() * 13) * 0.5; }  // 25–31
    else { maal = 33 + Math.floor(Math.random() * 25) * 0.5; }                          // 33–45

    var totalVekt = 0;
    KATEGORIER.forEach(function (k) { totalVekt += profil.vekter[k.key] || 0; });
    var behov = {};
    var notater = {};
    var fordelt = 0;
    KATEGORIER.forEach(function (k, i) {
      var verdi;
      if (i === KATEGORIER.length - 1) {
        verdi = rund05(maal - fordelt);
      } else {
        verdi = rund05(maal * (profil.vekter[k.key] || 0) / totalVekt);
        fordelt += verdi;
      }
      behov[k.key] = verdi;
      notater[k.key] = '';
    });

    var fornavnet = bruker.navn.split(' ')[0];
    var arbeidsleder = Math.random() < 0.8
      ? { hvem: 'selv', navn: '' }
      : { hvem: 'annen', navn: pick(GEN_FORNAVN) + ' ' + pick(GEN_ETTERNAVN) + ' (' + pick(GEN_RELASJONER) + ')' };

    return {
      navn: bruker.navn,
      fodselsaar: bruker.fodselsaar,
      kommune: bruker.kommune,
      boform: bruker.boform,
      kontakt: { epost: bruker.epost, telefon: bruker.telefon },
      livssituasjon: { fritekst: profil.fritekst(fornavnet), tags: profil.tags.slice() },
      behov: behov,
      notater: notater,
      sumTimer: sumBehov(behov),
      dagensTjenester: Math.random() < 0.5 ? [pick(['Hjemmesykepleie', 'Praktisk bistand'])] : ['Ingen kommunale tjenester i dag'],
      tidligereSoknader: pick(GEN_TIDLIGERE),
      dokumenter: profil.dokumenter.slice(),
      arbeidsleder: arbeidsleder,
      fritekstBehov: profil.fritekstBehov,
      status: 'mottatt',
      mottattDato: DAGENS_DATO_KORT,
      userCase: true,
      generert: true,
      agentOutputs: {}
    };
  }

  return {
    dagensDato: DAGENS_DATO,
    dagensDatoKort: DAGENS_DATO_KORT,
    demoAar: DEMO_AAR,
    kommuner: KOMMUNER,
    kategorier: KATEGORIER,
    livssituasjonTags: LIVSSITUASJON_TAGS,
    tjenester: TJENESTER,
    dokumentForslag: DOKUMENT_FORSLAG,
    statuser: STATUSER,
    personas: PERSONAS,
    regelverk: REGELVERK,
    sjekkliste: SJEKKLISTE,
    demoCases: DEMO_CASES,
    agenter: AGENTER,
    agentById: agentById,
    terskelHint: terskelHint,
    fmt: fmt,
    alder: alder,
    sumBehov: sumBehov,
    harTag: harTag,
    harAvslag: harAvslag,
    beregnAnbefalt: beregnAnbefalt,
    byggAnbefalingSeksjoner: byggAnbefalingSeksjoner,
    genererBruker: genererBruker,
    genererKartlegging: genererKartlegging
  };
})();
