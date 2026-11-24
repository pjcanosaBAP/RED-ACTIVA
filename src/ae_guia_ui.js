/* Guía AE — ayuda por punto + buscador en el manual. Gratis, sin IA, todo en el navegador.
   Contenido: guía de evidencias + manual 2.0 (+ manual 5.0 como ampliación), entregado por la RPC ae_get_guia
   sólo después de validar código de campaña + PIN. Si la RPC no devuelve datos (interruptor apagado) el portal queda igual que antes.
   Generado por Varios/IA - RED ACTIVA/build_guia.js. Para apagarlo sin redeploy:  update ae_guia set enabled=false where id=1; */
(function () {
  'use strict';
  var G = null, MAP = {}, BPLMAP = {}, IDX = null, Q = [], LOADER = null, LOADING = null, UI = null, CUR = null;

  // ───────── texto (mismo algoritmo que el generador, para vincular igual)
  function strip(s) { return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function norm(s) { return strip(s).toUpperCase().replace(/[^A-Z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  var STOP = { DE: 1, DEL: 1, LA: 1, LAS: 1, LOS: 1, Y: 1, E: 1, EL: 1, EN: 1, A: 1, AL: 1, CON: 1, POR: 1, PARA: 1, O: 1, U: 1, QUE: 1, SE: 1, SU: 1 };
  function toks(s) { return norm(s).split(' ').filter(function (w) { return w && !STOP[w]; }).map(function (w) { return w.replace(/(ES|S)$/, ''); }); }
  function tset(s) { var o = {}, n = 0; toks(s).forEach(function (w) { if (!o[w]) { o[w] = 1; n++; } }); return { o: o, n: n }; }
  function simT(A, B) { if (!A.n || !B.n) return 0; var m = 0; for (var w in A.o) if (B.o[w]) m++; return m / Math.min(A.n, B.n) * 0.5 + m / (A.n + B.n - m) * 0.5; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // ───────── vínculo pregunta de la app ↔ guía (la app manda: se vincula por texto, el número sólo desempata)
  function bind(guide, questions) {
    var map = {}, bmap = {}, used = {};
    var it = guide.items.map(function (x) { return tset(x.q); });
    var bn = {}; Object.keys(guide.bpl).forEach(function (k) { bn[k] = tset(guide.bpl[k].name); });
    questions.forEach(function (q) {
      if (String(q.sheet) === 'SUST') return;               // Sustentabilidad no entra
      var qt = tset(q.question), st = tset(q.subattr || ''), best = -1, s = 0, i, v;
      for (i = 0; i < guide.items.length; i++) {
        if (used[i]) continue; var x = guide.items[i];
        v = simT(qt, it[i]) + (x.c === String(q.comp_num) ? 0.05 : 0) + (st.n && simT(st, bn[x.b]) > 0.6 ? 0.05 : 0);
        if (v > s) { s = v; best = i; }
      }
      if (best >= 0 && s >= 0.62) { used[best] = 1; map[q.comp_num] = best; return; }
      var bb = null, bs = 0;                                 // sin par exacto → ayuda a nivel BPL
      Object.keys(guide.bpl).forEach(function (k) { if (guide.bpl[k].area !== q.sheet) return; var w = simT(st, bn[k]); if (w > bs) { bs = w; bb = k; } });
      if (bb && bs >= 0.6) bmap[q.comp_num] = bb;
    });
    return { map: map, bmap: bmap };
  }

  // ───────── secciones de los manuales
  function secPages(guide, src, i) {
    var S = src === 5 ? guide.sec5 : guide.sec2, PG = src === 5 ? guide.pg5 : guide.pg2, s = S[i], nx = S[i + 1], out = [];
    for (var p = s.p0; p <= s.p1 && p <= PG.length; p++) {
      var t = PG[p - 1] || '', a = p === s.p0 ? (s.o || 0) : 0, b = t.length;
      if (p === s.p1 && nx && nx.p0 === s.p1 && (nx.o || 0) > a) b = nx.o;
      out.push({ p: p, t: t.slice(a, b) });
    }
    return out;
  }
  function secText(guide, src, i) { return secPages(guide, src, i).map(function (x) { return x.t.trim(); }).filter(Boolean).join('\n\n'); }
  function secLabel(guide, src, i) { var s = (src === 5 ? guide.sec5 : guide.sec2)[i]; return src === 5 ? 'BPL ' + s.code + ' · ' + s.t + ' · pág. ' + s.p0 : s.t + ' · pág. ' + s.n; }
  function pageLabel(src, p) { return src === 5 ? 'Manual 5.0 · pág. ' + p : (p <= 1 ? 'Manual 2.0 · portada' : 'Manual 2.0 · págs. ' + (2 * p - 2) + '–' + (2 * p - 1)); }
  function cut(t, n) { if (t.length <= n) return t; var c = t.slice(0, n), k = c.lastIndexOf(' '); return c.slice(0, k > n * 0.6 ? k : n) + '…'; }

  // ───────── buscador (BM25 sobre páginas)
  var SW = {}; ('DE DEL LA LAS LOS Y E EL EN A AL CON POR PARA O U QUE SE SU SUS UN UNA UNO UNOS UNAS ES SON SER ESTA ESTAN ESTE ESTOS ESTAS LO LE LES COMO MAS MUY SIN SOBRE ENTRE TAMBIEN ASI HAY TIENE TIENEN CADA PUEDE PUEDEN DEBE DEBEN SEGUN DESDE HASTA').split(' ').forEach(function (w) { SW[w] = 1; });
  function stem(w) { return w.length > 4 ? w.replace(/(ES|S)$/, '') : w; }
  function stoks(s) { return norm(s).split(' ').filter(function (w) { return w.length > 1 && !SW[w]; }).map(stem); }
  function buildIndex(guide) {
    var docs = [], df = {}, tot = 0;
    guide.pg2.forEach(function (t, i) { docs.push({ s: 2, p: i + 1, t: t || '' }); });
    guide.pg5.forEach(function (t, i) { docs.push({ s: 5, p: i + 1, t: t || '' }); });
    docs.forEach(function (d) { var tf = {}, ws = stoks(d.t); d.len = ws.length || 1; tot += d.len; ws.forEach(function (w) { tf[w] = (tf[w] || 0) + 1; }); d.tf = tf; for (var w in tf) df[w] = (df[w] || 0) + 1; });
    return { docs: docs, df: df, N: docs.length, avg: tot / docs.length };
  }
  function ranges(guide, bpl) {                               // páginas de las secciones del punto actual (para dar prioridad)
    var r = { 2: [], 5: [] }; if (!bpl) return r;
    (bpl.m2 || []).forEach(function (i) { r[2].push([guide.sec2[i].p0, guide.sec2[i].p1]); });
    (bpl.m5 || []).forEach(function (i) { r[5].push([guide.sec5[i].p0, guide.sec5[i].p1]); });
    return r;
  }
  function search(guide, idx, query, bpl) {
    var qt = stoks(query).filter(function (w, i, a) { return a.indexOf(w) === i; }); if (!qt.length) return { terms: [], r2: [], r5: [] };
    var k1 = 1.4, b = 0.75, rg = ranges(guide, bpl), sc = [];
    idx.docs.forEach(function (d) {
      var s = 0, hit = 0;
      qt.forEach(function (w) { var f = d.tf[w]; if (!f) return; hit++; var n = idx.df[w], idf = Math.log(1 + (idx.N - n + 0.5) / (n + 0.5)); s += idf * f * (k1 + 1) / (f + k1 * (1 - b + b * d.len / idx.avg)); });
      if (!s) return; s *= 1 + 0.35 * (hit / qt.length);
      if ((rg[d.s] || []).some(function (r) { return d.p >= r[0] && d.p <= r[1]; })) s *= 1.5;
      sc.push({ d: d, s: s });
    });
    function top(src, n) { var l = sc.filter(function (x) { return x.d.s === src; }).sort(function (a, c) { return c.s - a.s; }); if (!l.length) return []; var min = l[0].s * 0.4; return l.filter(function (x) { return x.s >= min; }).slice(0, n); }
    return { terms: qt, r2: top(2, 4), r5: top(5, 3) };
  }
  function snippet(text, terms, width) {
    var lower = strip(text).toLowerCase(); if (lower.length !== text.length) lower = text.toLowerCase();
    var pos = []; terms.forEach(function (w, ti) { var re = new RegExp(w.toLowerCase().replace(/[^a-z0-9]/g, ''), 'g'), m; if (!re.source) return; while ((m = re.exec(lower))) { pos.push([m.index, ti]); if (pos.length > 400) break; } });
    pos.sort(function (a, c) { return a[0] - c[0]; });
    var best = 0, bestN = -1, i, j;
    for (i = 0; i < pos.length; i++) { var seen = {}, n = 0; for (j = i; j < pos.length && pos[j][0] - pos[i][0] < width * 0.8; j++) { if (!seen[pos[j][1]]) { seen[pos[j][1]] = 1; n++; } } if (n > bestN) { bestN = n; best = pos[i][0]; } }
    var a = Math.max(0, best - 60), z = Math.min(text.length, a + width);
    while (a > 0 && /\S/.test(text[a - 1]) && best - a < 110) a--;
    var seg = text.slice(a, z), lseg = lower.slice(a, z), out = '', last = 0, re2 = new RegExp('(' + terms.map(function (w) { return w.toLowerCase().replace(/[^a-z0-9]/g, ''); }).filter(Boolean).join('|') + ')[a-z0-9]*', 'g'), m2;
    if (re2.source === '()[a-z0-9]*') return esc(seg);
    while ((m2 = re2.exec(lseg))) { out += esc(seg.slice(last, m2.index)) + '<mark>' + esc(seg.slice(m2.index, m2.index + m2[0].length)) + '</mark>'; last = m2.index + m2[0].length; if (m2[0].length === 0) re2.lastIndex++; }
    out += esc(seg.slice(last));
    return (a > 0 ? '… ' : '') + out + (z < text.length ? ' …' : '');
  }

  // ───────── interfaz
  var CSS = '.gd-btn{display:none;margin-top:6px;padding:3px 9px;border-radius:6px;border:1px solid #bfdbfe;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit}' +
    '.gd-btn:hover{background:#dbeafe}body.gd-on .gd-has .gd-btn{display:inline-block}' +
    '.gd-fab{display:none;position:fixed;right:16px;bottom:84px;z-index:8000;padding:10px 14px;border-radius:999px;border:none;background:#1d4ed8;color:#fff;font-weight:700;font-size:13px;box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer;font-family:inherit}body.gd-on .gd-fab{display:block}' +
    '.gd-ov{display:none;position:fixed;inset:0;background:rgba(15,23,42,.35);z-index:8990}.gd-open .gd-ov{display:block}' +
    '.gd-panel{position:fixed;top:0;right:0;height:100%;width:min(520px,100vw);background:#fff;z-index:9000;box-shadow:-6px 0 24px rgba(0,0,0,.2);transform:translateX(100%);transition:transform .22s;display:flex;flex-direction:column;font-family:inherit;color:#1e293b}.gd-open .gd-panel{transform:none}' +
    '.gd-hd{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:#1e3a8a;color:#fff}.gd-ttl{font-weight:800;font-size:14px}.gd-x{background:none;border:none;color:#fff;font-size:18px;cursor:pointer;line-height:1}' +
    '.gd-search{display:flex;gap:6px;padding:10px 14px;border-bottom:1px solid #e2e8f0;background:#f8fafc}.gd-search input{flex:1;min-width:0;padding:8px 10px;border:1.5px solid #cbd5e1;border-radius:8px;font-size:13px;font-family:inherit}.gd-search button{padding:8px 12px;border:none;border-radius:8px;background:#2563eb;color:#fff;font-weight:700;font-size:12px;cursor:pointer;font-family:inherit}' +
    '.gd-body{flex:1;overflow:auto;padding:4px 14px 24px;font-size:13px;line-height:1.55}.gd-note{font-size:11px;color:#64748b;margin:10px 0 0}' +
    '.gd-pt{margin-top:10px;padding:10px 12px;background:#eff6ff;border-radius:8px}.gd-pt b{color:#1e3a8a}.gd-crit{color:#dc2626;font-weight:800;font-size:11px;margin-right:4px}' +
    '.gd-h{font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:#64748b;font-weight:800;margin:16px 0 4px}.gd-txt{white-space:pre-wrap}' +
    '.gd-card{border:1px solid #e2e8f0;border-radius:8px;padding:9px 11px;margin:8px 0}.gd-src{font-size:10px;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px}.gd-card mark{background:#fef08a;padding:0 1px}' +
    '.gd-card details{margin-top:6px}.gd-card summary{cursor:pointer;color:#1d4ed8;font-size:12px;font-weight:700}.gd-full{white-space:pre-wrap;font-size:12px;color:#334155;margin-top:6px;max-height:340px;overflow:auto;background:#f8fafc;border-radius:6px;padding:8px}' +
    '.gd-ext{margin-top:14px;border:1px dashed #94a3b8;border-radius:8px;padding:4px 11px 8px;background:#fafafa}.gd-ext>summary{cursor:pointer;font-weight:800;font-size:12px;color:#475569;padding:6px 0}.gd-warn{font-size:11px;color:#92400e;background:#fffbeb;border-radius:6px;padding:6px 8px;margin:4px 0 6px}' +
    '.gd-empty{color:#64748b;font-size:12px;margin:10px 0}';

  function ensureUI() {
    if (UI) return UI;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var ov = document.createElement('div'); ov.className = 'gd-ov'; ov.addEventListener('click', close); document.body.appendChild(ov);
    var pn = document.createElement('aside'); pn.className = 'gd-panel'; pn.setAttribute('role', 'dialog'); pn.setAttribute('aria-label', 'Guía y manual');
    pn.innerHTML = '<div class="gd-hd"><div class="gd-ttl">📖 Guía y manual</div><button type="button" class="gd-x" aria-label="Cerrar">✕</button></div>' +
      '<div class="gd-search"><input type="search" id="gd-q" placeholder="Buscá en el manual (ej: termómetro, plagas, extintores)" autocomplete="off"><button type="button" id="gd-go">Buscar</button></div>' +
      '<div class="gd-body" id="gd-body"></div>';
    document.body.appendChild(pn);
    var fab = document.createElement('button'); fab.type = 'button'; fab.className = 'gd-fab'; fab.textContent = '📖 Guía y manual'; fab.addEventListener('click', function () { openPanel(null); }); document.body.appendChild(fab);
    pn.querySelector('.gd-x').addEventListener('click', close);
    var inp = pn.querySelector('#gd-q'); pn.querySelector('#gd-go').addEventListener('click', function () { runSearch(inp.value); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') runSearch(inp.value); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.body.classList.contains('gd-open')) close(); });
    document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-gd]'); if (b) { e.preventDefault(); openPanel(b.getAttribute('data-gd')); } });
    UI = { panel: pn, body: pn.querySelector('#gd-body'), input: inp, fab: fab, ov: ov };
    return UI;
  }
  function close() { document.body.classList.remove('gd-open'); }
  function qOf(comp) { for (var i = 0; i < Q.length; i++) if (String(Q[i].comp_num) === String(comp)) return Q[i]; return null; }
  function secCard(src, i, ext) {
    var txt = secText(G, src, i); if (!txt) return '';
    return '<div class="gd-card"><div class="gd-src">' + esc(secLabel(G, src, i)) + '</div><div class="gd-txt">' + esc(cut(txt, 650)) + '</div>' +
      (txt.length > 650 ? '<details><summary>Ver sección completa</summary><div class="gd-full">' + esc(cut(txt, 9000)) + '</div></details>' : '') + '</div>';
  }
  function pointHTML(comp) {
    var q = qOf(comp), idx = MAP[comp], B = idx != null ? G.bpl[G.items[idx].b] : (BPLMAP[comp] ? G.bpl[BPLMAP[comp]] : null), it = idx != null ? G.items[idx] : null;
    if (!q || !B) return '';
    var h = '<div class="gd-pt"><div>' + (q.critico ? '<span class="gd-crit">🔴 CRÍTICO</span>' : '') + '<b>Punto ' + esc(q.comp_num) + '</b> · ' + esc(B.name) + '</div><div style="margin-top:3px">' + esc(q.question) + '</div></div>';
    if (B.decl) h += '<div class="gd-h">Qué se evalúa</div><div class="gd-txt">' + esc(B.decl) + '</div>';
    if (B.evid || (it && it.own)) h += '<div class="gd-h">Cómo se verifica / evidencia a tener lista</div><div class="gd-txt">' + esc(B.evid || '') + (it && it.own ? (B.evid ? '\n\n' : '') + 'Para este punto: ' + esc(it.own) : '') + '</div>';
    if (!it) h += '<div class="gd-note">Esta guía corresponde al grupo de puntos “' + esc(B.name) + '”, no a este punto en particular.</div>';
    var m2 = (B.m2 || []).slice(0, 2).map(function (i) { return secCard(2, i); }).join('');
    if (m2) h += '<div class="gd-h">Qué dice el manual de operaciones (2.0)</div>' + m2;
    var m5 = (B.m5 || []).slice(0, 2).map(function (i) { return secCard(5, i); }).join('');
    if (m5) h += '<details class="gd-ext"><summary>Ampliación — Manual 5.0 (no es requisito del programa 2.0)</summary><div class="gd-warn">Este contenido viene del manual 5.0 y puede incluir exigencias que el programa 2.0 no evalúa. Para responder la autoevaluación rige el texto de la pregunta.</div>' + m5 + '</details>';
    return h;
  }
  function resultHTML(res) {
    function card(x, ext) { return '<div class="gd-card"><div class="gd-src">' + esc(pageLabel(x.d.s, x.d.p)) + '</div><div>' + snippet(x.d.t, res.terms, 340) + '</div><details><summary>Ver página completa</summary><div class="gd-full">' + esc(x.d.t) + '</div></details></div>'; }
    if (!res.r2.length && !res.r5.length) return '<div class="gd-empty">No encontré nada para esa búsqueda. Probá con otras palabras (por ejemplo, el nombre del equipo o del registro) o consultá a tu referente de ARCOR.</div>';
    var h = '<div class="gd-h">Resultados en el manual de operaciones (2.0)</div>' + (res.r2.length ? res.r2.map(function (x) { return card(x); }).join('') : '<div class="gd-empty">Sin coincidencias en el manual 2.0.</div>');
    if (res.r5.length) h += '<details class="gd-ext"><summary>Ampliación — Manual 5.0 (no es requisito del programa 2.0)</summary><div class="gd-warn">Puede incluir exigencias que el programa 2.0 no evalúa.</div>' + res.r5.map(function (x) { return card(x); }).join('') + '</details>';
    return h;
  }
  function runSearch(text) {
    ensureUI(); var q = String(text || '').trim(); var box = UI.body.querySelector('#gd-res');
    if (!box) { UI.body.insertAdjacentHTML('beforeend', '<div id="gd-res"></div>'); box = UI.body.querySelector('#gd-res'); }
    if (!q) { box.innerHTML = ''; return; }
    if (!IDX) IDX = buildIndex(G);
    var B = CUR ? (MAP[CUR] != null ? G.bpl[G.items[MAP[CUR]].b] : (BPLMAP[CUR] ? G.bpl[BPLMAP[CUR]] : null)) : null;
    box.innerHTML = resultHTML(search(G, IDX, q, B));
    box.scrollIntoView && box.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  function openPanel(comp) {
    if (!G) return; ensureUI(); CUR = comp || null;
    var html = comp ? pointHTML(comp) : '<div class="gd-note" style="margin-top:12px">Buscá una palabra o tema y te muestro dónde lo explica el manual. También podés tocar “Guía” en cada pregunta.</div>';
    html += '<div class="gd-note">Ayuda orientativa. Para responder la autoevaluación rige el texto de cada pregunta y lo que indique ARCOR.</div><div id="gd-res"></div>';
    UI.body.innerHTML = html; UI.input.value = ''; UI.body.scrollTop = 0;
    document.body.classList.add('gd-open'); setTimeout(function () { try { UI.input.focus({ preventScroll: true }); } catch (e) { } }, 250);
  }
  function mark() {
    if (!G) return;
    Q.forEach(function (q) { if (MAP[q.comp_num] != null || BPLMAP[q.comp_num]) { var r = document.getElementById('qr-' + q.comp_num); if (r) r.classList.add('gd-has'); } });
    ensureUI(); document.body.classList.add('gd-on');
  }
  function reset() { G = null; MAP = {}; BPLMAP = {}; IDX = null; CUR = null; LOADING = null; try { close(); document.body.classList.remove('gd-on'); } catch (e) { } }

  var api = {
    // opts: { questions: [...preguntas de la campaña (la app manda)], load: function(): Promise<guía|null> }
    init: function (o) {
      Q = (o && o.questions) || []; LOADER = o && o.load;
      if (G) { var b = bind(G, Q); MAP = b.map; BPLMAP = b.bmap; mark(); return; }
      if (LOADING || !LOADER) return;
      LOADING = new Promise(function (r) { setTimeout(r, 400); }).then(function () { return LOADER(); }).then(function (d) {
        if (d && d.items && d.bpl) { G = d; var b = bind(G, Q); MAP = b.map; BPLMAP = b.bmap; mark(); }
      }).catch(function () { }).then(function () { LOADING = null; });
    },
    reset: reset, open: openPanel,
    _t: { bind: bind, search: search, buildIndex: buildIndex, snippet: snippet, secText: secText, secLabel: secLabel, pageLabel: pageLabel }   // para pruebas
  };
  window.AEGuia = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
