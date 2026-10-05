/* ============================================================
   Uloba PoC – tilstand i localStorage
   Global: UlobaStore
   Nøkkel: 'uloba-poc-state'
   ============================================================ */
/* global ULOBA_DATA */

var UlobaStore = (function () {
  'use strict';

  var KEY = 'uloba-poc-state';
  var memoryFallback = null; // brukes hvis localStorage ikke er tilgjengelig

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function readRaw() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) { return JSON.parse(raw); }
    } catch (e) {
      if (memoryFallback) { return deepClone(memoryFallback); }
    }
    return null;
  }

  function persist(state) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      memoryFallback = deepClone(state);
    }
  }

  // Første gangs innlasting: så demosakene, inkludert ferdig kjørte agent-utkast.
  function seed() {
    var cases = deepClone(ULOBA_DATA.demoCases);
    cases.forEach(function (c) {
      c.agentOutputs = {};
      (c.kjorteAgenter || []).forEach(function (agentId) {
        var agent = ULOBA_DATA.agentById(agentId);
        if (agent) {
          c.agentOutputs[agentId] = agent.mal(c);
        }
      });
    });
    var state = {
      version: 1,
      cases: cases,
      user: null,          // { navn, sakId? }
      brukere: [],         // genererte demobrukere: { navn, fodselsaar, kommune, boform, epost, telefon, sakId? }
      raadgiver: false,    // innlogget som rådgiver (demo)
      selectedPersona: 'Kari Nordmann',
      draft: null,         // pågående kartlegging
      nextSakNr: 101
    };
    persist(state);
    return state;
  }

  function get() {
    var state = readRaw();
    if (!state || !state.cases) {
      state = seed();
    }
    if (!state.brukere) { state.brukere = []; } // migrering av eldre lagret tilstand
    return state;
  }

  function save(state) {
    persist(state);
    return state;
  }

  function reset() {
    try {
      window.localStorage.removeItem(KEY);
    } catch (e) { /* ignorer */ }
    memoryFallback = null;
    return seed();
  }

  function addCase(caseData) {
    var state = get();
    var nr = state.nextSakNr || 101;
    state.nextSakNr = nr + 1;
    if (!caseData.id) {
      caseData.id = 'SAK-2026-' + String(nr);
    }
    if (!caseData.agentOutputs) { caseData.agentOutputs = {}; }
    state.cases.push(caseData);
    save(state);
    return caseData;
  }

  function updateCase(id, patch) {
    var state = get();
    var found = null;
    state.cases.forEach(function (c) {
      if (c.id === id) {
        Object.keys(patch).forEach(function (k) { c[k] = patch[k]; });
        found = c;
      }
    });
    if (found) { save(state); }
    return found;
  }

  function getCase(id) {
    var state = get();
    for (var i = 0; i < state.cases.length; i++) {
      if (state.cases[i].id === id) { return state.cases[i]; }
    }
    return null;
  }

  function addBruker(bruker) {
    var state = get();
    state.brukere.push(bruker);
    save(state);
    return bruker;
  }

  function getBrukerByNavn(navn) {
    var state = get();
    for (var i = 0; i < state.brukere.length; i++) {
      if (state.brukere[i].navn === navn) { return state.brukere[i]; }
    }
    return null;
  }

  function getCaseByNavn(navn) {
    var state = get();
    for (var i = 0; i < state.cases.length; i++) {
      if (state.cases[i].navn === navn) { return state.cases[i]; }
    }
    return null;
  }

  return {
    get: get,
    save: save,
    reset: reset,
    addCase: addCase,
    updateCase: updateCase,
    getCase: getCase,
    getCaseByNavn: getCaseByNavn,
    addBruker: addBruker,
    getBrukerByNavn: getBrukerByNavn
  };
})();
