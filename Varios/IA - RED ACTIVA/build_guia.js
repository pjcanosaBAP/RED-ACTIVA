/* Genera ae_guia.js (guía de evidencias + manual 2.0 + manual 5.0 complementario) para el portal AE.
   Uso:  node build_guia.js <carpeta-insumos> <app_q.txt> <salida-dir>
   Requiere:  npm i pdf-parse@1.1.1 xlsx
   Insumos en la carpeta: "Guia Evidencias.xlsx", "Manual de operaciones logisticas RA v1.pdf", "Manual RedActiva 5.0 2026.pdf".
   app_q.txt = preguntas vigentes de la campaña (comp|sheet|bpl|bpl_name|subattr|critico|pregunta). La app manda. */
const fs = require('fs'), path = require('path'), X = require('xlsx'), pdf = require('pdf-parse');
const [DIR, APPQ, OUT] = process.argv.slice(2);

// ───────── utilidades de texto
const strip = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
const norm = s => strip(s).toUpperCase().replace(/[^A-Z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const STOP = new Set(['DE', 'DEL', 'LA', 'LAS', 'LOS', 'Y', 'E', 'EL', 'EN', 'A', 'AL', 'CON', 'POR', 'PARA', 'O', 'U', 'QUE', 'SE', 'SU']);
const toks = s => norm(s).split(' ').filter(w => w && !STOP.has(w)).map(w => w.replace(/(ES|S)$/, ''));
function sim(a, b) { const A = new Set(toks(a)), B = new Set(toks(b)); if (!A.size || !B.size) return 0; let n = 0; A.forEach(w => { if (B.has(w)) n++; }); return n / Math.min(A.size, B.size) * 0.5 + n / new Set([...A, ...B]).size * 0.5; }
const clean1 = s => String(s || '').replace(/\s+/g, ' ').trim();

// ───────── PDFs por página
async function pdfPages(file) {
  const out = [];
  await pdf(fs.readFileSync(file), { pagerender: p => p.getTextContent({ normalizeWhitespace: true }).then(tc => {
    let last = null, s = '';
    for (const it of tc.items) { if (last !== null && Math.abs(it.transform[5] - last) > 2) s += '\n'; else if (s && !s.endsWith(' ') && !s.endsWith('\n')) s += ' '; s += it.str; last = it.transform[5]; }
    out[p.pageIndex] = s; return s; }) });
  return out;
}
function tidy(t, is5) {
  let L = t.split('\n').map(l => l.replace(/[ \t]+/g, ' ').trim()).filter(Boolean);
  if (is5) L = L.filter(l => !/^Manual de operaciones para Distribuidores$/i.test(l) && !/^P[aá]gina\s*:?\s*\d+$/i.test(l) && !/^Revisi[oó]n\s*:/i.test(l));
  let o = ''; L.forEach((l, i) => { o += (i && !/^([•▪●·\-–]|\d+[\.\)]\s)/.test(l) && !/[:;.]$/.test(L[i - 1]) ? ' ' : (i ? '\n' : '')) + l; });
  return o.trim();
}

(async () => {
  const wb = X.readFile(path.join(DIR, 'Guia Evidencias.xlsx'));
  const rows = X.utils.sheet_to_json(wb.Sheets['Guia de Evidencias 2,0'], { header: 1, defval: '' }).slice(1);

  // ───────── 1) guía de evidencias → items por componente y datos por BPL
  const items = [], bpl = {}; let cur = null;
  rows.forEach(r => {
    const [area, attr, name, crit, decl, evid, num, comp] = r.map(c => String(c).trim());
    if (area && name) { cur = { key: area + '|' + norm(name), name: clean1(name), area, attr: clean1(attr), crit: !!crit, decl: clean1(decl), evid: clean1(evid) }; if (!bpl[cur.key]) bpl[cur.key] = { ...cur, dup: 0 }; else bpl[cur.key].dup++; }
    if (/^\d+\.\d+\.\d+$/.test(num) && cur) {
      const own = area && name ? '' : clean1(evid);   // nota propia del componente (sub-fila)
      items.push({ c: num, q: clean1(comp), b: cur.key, area: cur.area, crit: cur.crit, own });
    }
  });

  // ───────── 2) manuales
  const p2 = await pdfPages(path.join(DIR, 'Manual de operaciones logisticas RA v1.pdf'));
  const p5 = await pdfPages(path.join(DIR, 'Manual RedActiva 5.0 2026.pdf'));

  // m2: índice con páginas impresas; el PDF es de pliegos (impresa n → pdf floor((n+2)/2))
  const toc2 = []; [1, 2].forEach(i => p2[i].split('\n').forEach(l => { l = l.replace(/[ \t]+/g, ' ').trim(); const m = l.match(/^(?:\d+(?:\.\d+)*\s*\|\s*)?([A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ0-9 \/\-–:\.\(\),]+?)\s+(\d{1,3})$/); if (m && m[1].length > 3 && +m[2] > 8 && +m[2] < 130) toc2.push({ t: m[1].trim(), n: +m[2], p: Math.floor((+m[2] + 2) / 2) }); }));
  toc2.sort((a, b) => a.n - b.n);
  const sec2 = toc2.map((e, i) => ({ t: e.t, n: e.n, p0: e.p, p1: Math.max(e.p, (toc2[i + 1] || { p: p2.length }).p) }));

  // m5: índice con (BPL x.y) … página (= página del PDF; el encabezado dice "Página: N")
  const toc5 = []; for (let i = 1; i <= 8; i++) p5[i].split('\n').forEach(l => { l = l.replace(/(\.\s*){3,}/g, ' … ').replace(/[ \t]+/g, ' ').trim(); const m = l.match(/^(.*?)\s*…\s*(\d{1,3})$/); if (m) toc5.push({ raw: m[1].trim(), p: +m[2] }); });
  const sec5 = []; toc5.forEach((e, i) => {
    const b = e.raw.match(/^(.*?)\s*\(\s*BPL\s*(\d+)\s*\.\s*(\d+)\s*\)$/); if (!b) return;
    let end = e.p; for (let j = i + 1; j < toc5.length; j++) { const nb = /\(\s*BPL\s*\d+\s*\.\s*\d+\s*\)/.test(toc5[j].raw) || /M\s?O\s?D\s?U\s?L\s?O|CONCEPTOS GENERALES|CONCLUSION|ANEXO/i.test(toc5[j].raw); if (nb) { end = Math.max(e.p, toc5[j].p); break; } end = p5.length; }
    sec5.push({ t: clean1(b[1]), code: b[2] + '.' + b[3], p0: e.p, p1: end });
  });
  // verificación: el título debe aparecer en su página de inicio
  const ver5 = sec5.filter(s => norm(p5[s.p0 - 1] || '').includes(norm(s.t).slice(0, 18))).length;

  // ───────── 3) BPL (guía) → secciones de cada manual (por nombre + sinónimos revisados)
  const OV5 = { // clave de BPL de la guía → códigos BPL del 5.0
    'ILUMNACION': ['3.8'], 'EPPS Y EXTINGUIDORES': ['1.8'], 'ADQUISICION DE DATOS': ['3.16'], 'TRANSMISION DE PEDIDOS': ['6.8'],
    'ALMACENAMIENTO': ['2.2'], 'CONTAMINACION CRUZADA': ['2.2'], 'INSTRUMENTOS MEDICION TEMPERATURA': ['2.1'], 'DEVOLUCIONES DE PRODUCTOS NO APTOS': ['6.13'],
    'CONTROL DE PLAGAS': ['2.4'], 'INFRAESTRUCTURA': ['2.4'], 'DESPACHO': ['3.19'], 'IDENTIFICACION LAY OUT': ['6.5'],
    'ARMADO Y ASIGNACION DE CONSOLIDADOS Y O PEDIDOS': ['6.8', '6.10'], 'LAY OUT CAPACIDAD Y MODULACION': ['3.15'],
    'ENTORNO Y SEGURIDAD EXTERNA': ['3.1', '3.2'], 'PREDIO Y CIRCULACION': ['3.3'], 'TECHOS Y PAREDES ESTADO': ['3.5'], 'CAPACITACION': ['4.8'], 'INDICADORES': ['8.1', '8.2'], 'RESIDUOS': ['3.20'], 'PLANES DE LIMPIEZA': ['2.3'], 'ROTACION Y REPOSICION': ['6.6'], 'RECHAZOS': ['6.13'],
    'GST|ROTACION Y POLICOMPETENCIAS': ['4.8'], 'IDP|RECEPCION': ['2.2'] };
  const OV2 = { 'ILUMNACION': ['ILUMINACIÓN'], 'EPPS Y EXTINGUIDORES': ['EQUIPAMIENTO DE SEGURIDAD INTERNA'], 'ALMACENAMIENTO': ['BPL / IDP DURANTE MANIPULEO Y ALMACENAMIENTO DE PRODUCTOS'], 'INSTRUMENTOS MEDICION TEMPERATURA': ['TEMPERATURA'], 'DEVOLUCIONES DE PRODUCTOS NO APTOS': ['PROCESAMIENTO DE RECHAZOS Y DEVOLUCIONES'], 'INFRAESTRUCTURA': ['MANEJO DE PLAGAS'], 'DESPACHO': ['BPL / IDP DURANTE EL DESPACHO DE PEDIDOS'], 'IDENTIFICACION LAY OUT': ['IDENTIFICACIÓN'], 'ARMADO Y ASIGNACION DE CONSOLIDADOS Y O PEDIDOS': ['ASIGNACIÓN DE CONSOLIDADOS', 'ARMADO DE PEDIDOS'], 'LAY OUT CAPACIDAD Y MODULACION': ['ORGANIZACIÓN DEL LAY OUT – CAPACIDAD Y MODULACIÓN'],
    'ENTORNO Y SEGURIDAD EXTERNA': ['SEGURIDAD EXTERNA'], 'PREDIO Y CIRCULACION': ['ENTORNOS EXTERNOS Y ACCESOS'], 'TECHOS Y PAREDES ESTADO': ['TECHOS', 'PAREDES'], 'VEHICULOS': ['FLOTA', 'ESTRUCTURA DE LOS VEHÍCULOS DE TRASLADO'], 'INFORMATICA': ['EQUIPAMIENTO INFORMÁTICO'], 'CAPACITACION': ['CAPACITACIÓN Y DESARROLLO DE LOS RRHH'], 'INDICADORES': ['POLÍTICA, OBJETIVOS E INDICADORES'], 'METODO DE 5 S': ['ETAPA 3: APLICACIÓN 5S'], 'DESPACHO LEGALES HIGIENE': ['REQUISITOS LEGALES Y REGLAMENTARIOS'],
    'GST|ROTACION Y POLICOMPETENCIAS': ['CAPACITACIÓN Y DESARROLLO DE LOS RRHH'], 'IDP|RECEPCION': ['BPL / IDP DURANTE ABASTECIMIENTO Y RECEPCIÓN'] };
  const map = [];
  Object.values(bpl).forEach(B => {
    const NK = norm(B.name);
    const O5 = OV5[B.key] || OV5[NK], O2 = OV2[B.key] || OV2[NK];
    let m5 = []; if (O5) m5 = O5.map(c => sec5.findIndex(s => s.code === c)).filter(i => i >= 0); else { let best = -1, s = 0; sec5.forEach((x, i) => { const v = sim(B.name, x.t); if (v > s) { s = v; best = i; } }); if (s >= 0.75) m5 = [best]; }
    let m2 = []; if (O2) m2 = O2.map(t => sec2.findIndex(s => norm(s.t) === norm(t))).filter(i => i >= 0); else { let best = -1, s = 0; sec2.forEach((x, i) => { const v = sim(B.name, x.t); if (v > s) { s = v; best = i; } }); if (s >= 0.7) m2 = [best]; }
    B.m2 = m2; B.m5 = m5; map.push({ name: B.name, area: B.area, m2: m2.map(i => sec2[i].t + ' (pág. ' + sec2[i].n + ')'), m5: m5.map(i => 'BPL ' + sec5[i].code + ' ' + sec5[i].t + ' (pág. ' + sec5[i].p0 + ')') });
  });

  // ───────── 4) cruce guía ↔ preguntas vigentes de la app (la app manda)
  const app = fs.readFileSync(APPQ, 'utf8').split('\n').filter(Boolean).map(l => { const [c, sheet, bn, bname, sub, crit, ...q] = l.split('|'); return { c, sheet, bn, bname, sub, crit, q: q.join('|').trim() }; });
  const used = new Set(), link = {}, rep = { exact: 0, numTxt: 0, soloTxt: 0, sinGuia: [], difText: [], difNum: [] };
  app.forEach(a => {
    let best = -1, s = 0;
    items.forEach((it, i) => { const v = sim(a.q, it.q) + (it.c === a.c ? 0.05 : 0) + (norm(a.sub) && sim(a.sub, bpl[it.b].name) > 0.6 ? 0.05 : 0); if (!used.has(i) && v > s) { s = v; best = i; } });
    if (best >= 0 && s >= 0.62) {
      used.add(best); const it = items[best]; link[a.c] = best; const same = norm(a.q) === norm(it.q);
      if (it.c !== a.c) { rep.soloTxt++; rep.difNum.push(`${a.c} (app) = ${it.c} (guía): "${a.q.slice(0, 70)}"`); } else if (same) rep.exact++; else rep.numTxt++;
      if (!same) rep.difText.push(`${a.c}: app "${a.q.slice(0, 90)}" ≠ guía "${it.q.slice(0, 90)}"`);
    } else rep.sinGuia.push(`${a.c} ${a.sub}: ${a.q.slice(0, 80)}`);
  });
  const sinApp = items.filter((_, i) => !used.has(i)).map(it => `${it.c} ${it.q.slice(0, 80)}`);
  // BPL de la app → BPL de la guía (para dar ayuda a nivel BPL aunque el punto no tenga par)
  const bplApp = {}; app.forEach(a => { const k = norm(a.sub); if (!bplApp[k]) { let best = null, s = 0; Object.values(bpl).forEach(B => { const v = sim(a.sub, B.name); if (v > s) { s = v; best = B.key; } }); bplApp[k] = s >= 0.6 ? best : null; } });

  // ───────── 5) salida: páginas limpias + ae_guia.js
  const pg2 = p2.map(t => tidy(t, false)), pg5 = p5.map(t => tidy(t, true));
  // offset donde empieza realmente cada sección dentro de su página de inicio (la página puede traer el final de la anterior)
  function headingOffset(text, title) {
    let ns = '', im = []; for (let i = 0; i < text.length; i++) { for (const ch of strip(text[i]).toUpperCase()) { if (/[A-Z0-9]/.test(ch)) { ns += ch; im.push(i); } else if (ns && !ns.endsWith(' ')) { ns += ' '; im.push(i); } } }
    const tg = norm(title); let from = 0, first = -1;
    for (;;) { const k = ns.indexOf(tg, from); if (k < 0) break; const o = im[k], seg = text.substr(o, title.length); if (first < 0) first = o; if (seg === seg.toUpperCase()) return o; from = k + 1; }
    return first < 0 ? 0 : first;
  }
  sec2.forEach(s => { s.o = headingOffset(pg2[s.p0 - 1] || '', s.t); });
  sec5.forEach(s => { s.o = headingOffset(pg5[s.p0 - 1] || '', s.t); });
  const G = { v: new Date().toISOString().slice(0, 10), items, bpl, sec2, sec5, pg2, pg5 };
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'ae_guia.js'), 'window.AE_GUIA=' + JSON.stringify(G) + ';');
  const kb = f => (fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0) + ' KB';
  const R = [];
  R.push('# Informe de la guía AE (generado)', '', `- Componentes en la guía: **${items.length}** · BPL: **${Object.keys(bpl).length}** · Preguntas de la app (sin SUST): **${app.length}**`,
    `- Manual 2.0: ${p2.length} págs, ${sec2.length} secciones en el índice · Manual 5.0: ${p5.length} págs, ${sec5.length} BPL en el índice (${ver5} verificadas contra el texto de su página)`,
    `- Vínculo pregunta de la app ↔ guía: **${rep.exact}** idénticas · **${rep.numTxt}** mismo número con texto distinto · **${rep.soloTxt}** vinculadas por texto con otro número · **${rep.sinGuia.length}** sin par en la guía · ${sinApp.length} filas de la guía sin par en la app`, '',
    '## Preguntas de la app que NO tienen par en la guía', ...rep.sinGuia.map(x => '- ' + x), '', '## Filas de la guía sin par en la app', ...sinApp.map(x => '- ' + x), '',
    '## Mismo punto con distinto número (guía vs app)', ...rep.difNum.map(x => '- ' + x), '', '## Texto distinto entre guía y app (rige la app)', ...rep.difText.map(x => '- ' + x), '',
    '## Equivalencia de BPL: guía 2.0 → manual 2.0 / manual 5.0', '', '| BPL (guía) | Manual 2.0 | Manual 5.0 (complemento) |', '|---|---|---|', ...map.map(m => `| ${m.area} · ${m.name} | ${m.m2.join('; ') || '—'} | ${m.m5.join('; ') || '—'} |`));
  fs.writeFileSync(path.join(OUT, 'guia_informe.md'), R.join('\n'));
  console.log('ae_guia.js', kb('ae_guia.js'), '| items', items.length, '| bpl', Object.keys(bpl).length, '| sec2', sec2.length, '| sec5', sec5.length, 'verif5', ver5);
  console.log('vínculo: idénticas', rep.exact, '| num+texto dif', rep.numTxt, '| por texto otro nro', rep.soloTxt, '| sin par app', rep.sinGuia.length, '| sin par guía', sinApp.length);
  console.log('BPL sin m2:', map.filter(m => !m.m2.length).map(m => m.name).join(' · '));
  console.log('BPL sin m5:', map.filter(m => !m.m5.length).map(m => m.name).join(' · '));
})();
