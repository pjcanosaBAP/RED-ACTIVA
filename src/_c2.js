 tag (treated as raw text)
  const src = document.documentElement.outerHTML;
  const PLACEHOLDER = '/* __SNAP_PLACEHOLDER__ */';
  if(src.indexOf(PLACEHOLDER) === -1){
    alert('Error: no se encontró el placeholder del snapshot. Contactá al soporte.');
    return;
  }
  const snapshotHTML = src.replace(PLACEHOLDER, snapData);

  // Generate filename
  const pais  = cfg.pais||'XX';
  const anio  = cfg.anio||new Date().getFullYear();
  const fecha = new Date().toISOString().slice(0,10);
  const ndist = saved.length;
  const fname = `RedActiva_${pais}_${anio}_${ndist}dist_${fecha}.html`;

  // Use Electron native save dialog if available, else browser download
  if(window.electronAPI){
    window.electronAPI.saveSnapshot(snapshotHTML, fname).then(res=>{
      if(res.success) showToast('✅ Snapshot guardado en: '+res.path);
      else showToast('⚠️ Guardado cancelado');
    });
  } else {
    const blob = new Blob([snapshotHTML], {type:'text/html;charset=utf-8'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href=url; a.download=fname; a.click();
    URL.revokeObjectURL(url);
    showToast('✅ Snapshot exportado: '+fname+' — '+ndist+' auditorías embebidas');
  }
}

// ── RESET STRUCTURE ────────────────────────────────────
function resetQToBase(){
  if(!confirm('¿Restablecer la estructura original? Se perderán todos los cambios de áreas, preguntas y BPLs. Las auditorías guardadas NO se borran.')) return;
  localStorage.removeItem('bpl_q_custom_v1');
  localStorage.removeItem('bpl_areas_cfg_v1');
  Q=[...Q_BASE.map(q=>({...q}))];
  // Reset AC/AN/AW to defaults
  Object.assign(AC,{IFT:'#1565c0',PLG:'#6a1b9a',GST:'#e65100',IDP:'#1b5e20'});
  Object.assign(AN,{IFT:'Infraestructura',PLG:'Procesos Logísticos',GST:'Gestión',IDP:'Integridad del Producto'});
  Object.assign(AW,{...AW_DEFAULT});
  rebuildAll(); rebuildDynamicUI(); edInitAreas();
  showToast('✅ Estructura restablecida al original');
}

// ── PESOS RESTABLECIMIENTO COMPLETO ─────────────────────
function resetAllWeights(){
  if(!confirm('¿Restablecer TODOS los pesos (área, atributo, BPL, componente) a sus valores originales?')) return;
  WCfg={at:{},bpl:{},comp:{}};
  Object.assign(AW,{...AW_DEFAULT});
  localStorage.setItem('bpl_wcfg',JSON.stringify(WCfg));
  rebuildCfgWeightRows(); renderWeightsCfg(); updateAreaWeights();
  showToast('✅ Pesos restablecidos');
}

// ── ANÁLISIS COMPARATIVO MEJORADO ───────────────────────
// Patch renderCompareEditions with edition-over-edition delta + trend arrows
function renderCompareEditionsFull(){
  const wrap=document.getElementById('compare-output'); if(!wrap) return;
  const editions=[...new Set(saved.map(a=>a.edicion).filter(Boolean))].sort();
  if(!editions.length){
    wrap.innerHTML='<div style="padding:40px;text-align:center;color:var(--g400)">⚠️ No hay auditorías guardadas.</div>';
    return;
  }

  const edData=editions.map(ed=>{
    const data=saved.filter(a=>a.edicion===ed);
    const avg=data.length?data.reduce((s,a)=>s+((a.scores||{}).total||0)*100,0)/data.length:0;
    const areas=Object.fromEntries(SHEETS().map(sh=>[sh,
      data.length?data.reduce((s,a)=>s+((a.scores||{}).areas[sh]||0)*100,0)/data.length:0
    ]));
    const critAvg=data.length?data.reduce((s,a)=>s+((a.scores||{}).critMet||0),0)/data.length:0;
    const cats={PROACTIVO:0,ACTIVO:0,REACTIVO:0,INACTIVO:0};
    data.forEach(a=>{ const cat=recomputeCategory(a); cats[cat]=(cats[cat]||0)+1; });
    return {ed,n:data.length,avg,areas,critAvg,cats};
  });

  const catCols={PROACTIVO:'#2e7d32',ACTIVO:'#00695c',REACTIVO:'#e65100',INACTIVO:'#c62828'};
  const edCols=['#1565c0','#6a1b9a','#00695c','#e65100','#c62828','#1b5e20','#4527a0','#558b2f'];

  // ── 1. Resumen ejecutivo por edición ──
  let html=`<div style="margin-bottom:20px">
    <div style="font-size:11px;font-weight:800;color:var(--g500);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px">📊 Resumen Ejecutivo por Edición</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">`;

  edData.forEach((ed,i)=>{
    const prev=edData[i-1];
    const delta=prev?ed.avg-prev.avg:null;
    const arrow=delta===null?'':delta>0?`<span style="color:#2e7d32;font-size:13px">▲ +${delta.toFixed(1)}%</span>`:
      delta<0?`<span style="color:#c62828;font-size:13px">▼ ${delta.toFixed(1)}%</span>`:
      `<span style="color:#607d8b;font-size:11px">= sin cambio</span>`;
    const color=edCols[i%edCols.length];
    const topCat=Object.entries(ed.cats).sort((a,b)=>b[1]-a[1])[0];
    html+=`<div style="background:#fff;border:2px solid ${color};border-radius:10px;padding:14px 18px;min-width:160px;flex:1">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;color:${color}">${ed.ed}</div>
      <div style="font-size:11px;color:var(--g400);margin-bottom:6px">${ed.n} distribuidor${ed.n!==1?'es':''}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;color:${scoreColor(ed.avg/100)}">${ed.avg.toFixed(1)}%</div>
      <div style="margin:2px 0 6px">${arrow}</div>
      <div style="font-size:10px;color:var(--g500)">Crit: ${ed.critAvg.toFixed(1)}/${CRIT_LIST.length} · ${topCat?topCat[0]:''} x${topCat?topCat[1]:0}</div>
    </div>`;
  });
  html+=`</div></div>`;

  // ── 2. Evolución por área (tabla) ──
  html+=`<div style="margin-bottom:20px">
    <div style="font-size:11px;font-weight:800;color:var(--g500);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px">📐 Evolución por Área de Interés</div>
    <div style="overflow-x:auto"><table class="tbl"><thead><tr>
      <th>Área</th>
      ${edData.map((ed,i)=>`<th style="color:${edCols[i%edCols.length]}">${ed.ed}</th>`).join('')}
      ${edData.length>1?`<th>Δ Total</th>`:''}
    </tr></thead><tbody>`;

  SHEETS().forEach(sh=>{
    const color=AC[sh]||'#607d8b';
    const vals=edData.map(ed=>ed.areas[sh]||0);
    const delta=vals.length>1?vals[vals.length-1]-vals[0]:null;
    html+=`<tr>
      <td><strong style="color:${color}">${sh}</strong><br><span style="font-size:10px;color:var(--g400)">${AN[sh]||''}</span></td>
      ${vals.map(v=>`<td>${pctBadge(v.toFixed(1))}</td>`).join('')}
      ${delta!==null?`<td style="font-weight:800;color:${delta>=0?'#2e7d32':'#c62828'}">${delta>=0?'+':''}${delta.toFixed(1)}%</td>`:''}
    </tr>`;
  });

  // Total row
  const totals=edData.map(ed=>ed.avg);
  const totDelta=totals.length>1?totals[totals.length-1]-totals[0]:null;
  html+=`<tr style="background:var(--g50);border-top:2px solid var(--g200)">
    <td style="font-weight:800">TOTAL</td>
    ${totals.map(v=>`<td style="font-weight:800">${pctBadge(v.toFixed(1))}</td>`).join('')}
    ${totDelta!==null?`<td style="font-weight:900;color:${totDelta>=0?'#2e7d32':'#c62828'};font-size:14px">${totDelta>=0?'+':''}${totDelta.toFixed(1)}%</td>`:''}
  </tr></tbody></table></div></div>`;

  // ── 3. Distribución de categorías por edición ──
  html+=`<div style="margin-bottom:20px">
    <div style="font-size:11px;font-weight:800;color:var(--g500);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px">🏷 Distribución de Categorías por Edición</div>
    <div style="overflow-x:auto"><table class="tbl"><thead><tr>
      <th>Categoría</th>
      ${edData.map((ed,i)=>`<th style="color:${edCols[i%edCols.length]}">${ed.ed}</th>`).join('')}
    </tr></thead><tbody>`;
  ['PROACTIVO','ACTIVO','REACTIVO','INACTIVO'].forEach(cat=>{
    html+=`<tr><td><span class="badge" style="background:${catCols[cat]}20;color:${catCols[cat]};border:1px solid ${catCols[cat]}40">${cat}</span></td>
      ${edData.map(ed=>`<td style="font-weight:700;color:${catCols[cat]}">${ed.cats[cat]||0}</td>`).join('')}
    </tr>`;
  });
  html+=`</tbody></table></div></div>`;

  // ── 4. Tendencia visual por área (barras apiladas) ──
  html+=`<div style="margin-bottom:20px">
    <div style="font-size:11px;font-weight:800;color:var(--g500);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px">📈 Tendencia por Área</div>`;
  SHEETS().forEach(sh=>{
    const color=AC[sh]||'#607d8b';
    const vals=edData.map(ed=>ed.areas[sh]||0);
    html+=`<div style="margin-bottom:10px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:800;color:${color};min-width:50px">${sh}</div>
        <div style="font-size:10px;color:var(--g400)">${AN[sh]||''}</div>
      </div>
      <div style="display:flex;gap:4px;align-items:flex-end;height:40px">
        ${vals.map((v,i)=>{
          const h=Math.max(4,v*0.4);
          return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;flex:1">
            <div style="font-size:9px;font-weight:700;color:${scoreColor(v/100)}">${v.toFixed(0)}%</div>
            <div style="width:100%;background:${edCols[i%edCols.length]};height:${h}px;border-radius:3px 3px 0 0;opacity:.85;transition:height .3s"></div>
            <div style="font-size:8px;color:var(--g400)">${edData[i].ed}</div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  });
  html+=`</div>`;

  wrap.innerHTML=html;
}

// ── EXPORT EXCEL COMPLETO ────────────────────────────────
function exportExcelFull(){
  if(typeof XLSX==='undefined'){showToast('⚠️ XLSX no disponible');return;}
  const wb=XLSX.utils.book_new();

  // Sheet 1: Resumen General
  const sheets=SHEETS();
  const hdr1=['Edición','Distribuidor','Fecha','Auditor',...sheets.map(sh=>sh+' %'),'Total %','Críticos','Categoría'];
  const rows1=[hdr1];
  saved.forEach(a=>{
    const s=a.scores||{}; const at=s.areas||{};
    rows1.push([
      a.edicion||'',a.distribuidor,a.fecha||'',a.auditor||'',
      ...sheets.map(sh=>+((at[sh]||0)*100).toFixed(1)),
      +((s.total||0)*100).toFixed(1),
      s.critMet||0, recomputeCategory(a)||''
    ]);
  });
  const ws1=XLSX.utils.aoa_to_sheet(rows1);
  XLSX.utils.book_append_sheet(wb,ws1,'Resumen General');

  // Sheet 2: Detalle de Respuestas
  const hdr2=['Edición','Distribuidor','Fecha','Auditor','Área','Atributo','BPL','#Pregunta','Pregunta','Respuesta','Crítico'];
  const rows2=[hdr2];
  saved.forEach(a=>{
    Q.forEach(q=>{
      const resp=(a.answers||{})[q.comp_num];
      if(resp){
        rows2.push([
          a.edicion||'',a.distribuidor,a.fecha||'',a.auditor||'',
          q.sheet,q.bpl_name,q.subattr||'',q.comp_num,q.question,
          resp.toUpperCase(),q.critico||''
        ]);
      }
    });
  });
  const ws2=XLSX.utils.aoa_to_sheet(rows2);
  XLSX.utils.book_append_sheet(wb,ws2,'Respuestas Detalle');

  // Sheet 3: Comparativo Ediciones
  const editions=[...new Set(saved.map(a=>a.edicion).filter(Boolean))].sort();
  const hdr3=['Área',...editions];
  const rows3=[hdr3];
  sheets.forEach(sh=>{
    const row=[sh];
    editions.forEach(ed=>{
      const data=saved.filter(a=>a.edicion===ed);
      const avg=data.length?data.reduce((s,a)=>s+((a.scores||{}).areas[sh]||0)*100,0)/data.length:0;
      row.push(+avg.toFixed(1));
    });
    rows3.push(row);
  });
  // Total row
  const totRow=['TOTAL'];
  editions.forEach(ed=>{
    const data=saved.filter(a=>a.edicion===ed);
    const avg=data.length?data.reduce((s,a)=>s+((a.scores||{}).total||0)*100,0)/data.length:0;
    totRow.push(+avg.toFixed(1));
  });
  rows3.push(totRow);
  const ws3=XLSX.utils.aoa_to_sheet(rows3);
  XLSX.utils.book_append_sheet(wb,ws3,'Comparativo Ediciones');

  // Sheet 4: Condicionales Críticos
  const hdr4=['Edición','Distribuidor','Crítico','BPL','Estado'];
  const rows4=[hdr4];
  saved.forEach(a=>{
    CRIT_LIST.forEach(cr=>{
      const allSi=cr.qs.every(comp=>(((a.answers||{})[comp])||'')===('si'));
      rows4.push([a.edicion||'',a.distribuidor,cr.tag,cr.subattr,allSi?'✓ CUMPLE':'✗ NO CUMPLE']);
    });
  });
  const ws4=XLSX.utils.aoa_to_sheet(rows4);
  XLSX.utils.book_append_sheet(wb,ws4,'Condicionales Críticos');

  const fname=`RedActiva_${cfg.pais||'UY'}_${cfg.anio||2025}_${new Date().toISOString().slice(0,10)}.xlsx`;
  if(window.electronAPI){
    const wbOut = XLSX.write(wb, {bookType:'xlsx', type:'array'});
    window.electronAPI.saveExcel(wbOut, fname).then(res=>{
      if(res.success) showToast('✅ Excel guardado en: '+res.path);
      else showToast('⚠️ Guardado cancelado');
    });
  } else {
    XLSX.writeFile(wb, fname);
    showToast('✅ Excel exportado: '+fname);
  }
}

// ── PRINT / PDF REPORT ───────────────────────────────────
function printReport(){
  window.print();
}



// ══════════════════════════════════════════════════════
// MÓDULO ANÁLISIS — 4 sub-módulos completos
// ══════════════════════════════════════════════════════

function goAnTab(t){
  document.querySelectorAll('.an-mod').forEach(el=>el.style.display='none');
  document.querySelectorAll('.an-tab-btn').forEach(el=>el.classList.remove('on'));
  const el=document.getElementById('an-'+t); if(el) el.style.display='';
  // Highlight correct button (NV btn is by id, others by index)
  if(t==='nv'){
    const b=document.getElementById('an-tab-nv-btn'); if(b) b.classList.add('on');
  } else {
    const btns=document.querySelectorAll('.an-tab-btn');
    const idx={m1:0,m2:1,m3:2,m4:3}[t];
    if(btns[idx]) btns[idx].classList.add('on');
  }
  if(t==='m1') renderM1();
  if(t==='m2') renderM2();
  if(t==='m3') renderM3();
  if(t==='m4') renderM4();
  if(t==='nv') renderNV();
}

function initAnalisis(){
  // Populate all selectors — include distributors from autoevals too
  const dists=[...new Set([...saved.map(a=>a.distribuidor),...autoevals.map(a=>a.distribuidor)])].sort();
  const eds=[...new Set([...saved.map(a=>a.edicion),...autoevals.map(a=>a.edicion)].filter(Boolean))].sort();
  ['an-sel-dist','an-nv-dist'].forEach(id=>{
    const s=document.getElementById(id); if(!s) return;
    const cur=s.value;
    const lbl=id==='an-nv-dist'?'— Red completa —':'— Seleccioná —';
    s.innerHTML=`<option value="">${lbl}</option>`+dists.map(d=>`<option value="${d}">${d}</option>`).join('');
    if(cur) s.value=cur;
  });
  ['an-sel-ed','an-m2-ed','an-m4-ed','an-nv-ed'].forEach(id=>{
    const s=document.getElementById(id); if(!s) return;
    const cur=s.value;
    const label=id==='an-sel-ed'?'— Última —':'Todas';
    s.innerHTML=`<option value="">${label}</option>`+eds.map(e=>`<option value="${e}">${e}</option>`).join('');
    if(cur) s.value=cur;
  });
  // Show/hide NV tab based on whether NV areas exist
  const nvBtn=document.getElementById('an-tab-nv-btn');
  if(nvBtn) nvBtn.style.display=SHEETS_NV().length>0?'':'none';
  // Show active tab
  const active=document.querySelector('.an-mod:not([style*="none"])');
  if(!active) goAnTab('m1'); else goAnTab(active.id.replace('an-',''));
}

// ── Análisis No Vinculantes ───────────────────────────
function renderNV(){
  const out=document.getElementById('an-nv-out'); if(!out) return;
  const nvSh=SHEETS_NV();
  if(!nvSh.length){
    out.innerHTML='<div class="an-empty">No hay áreas No Vinculantes. Marcalas en Config → Pesos de Áreas.</div>';
    return;
  }
  const distSel=(document.getElementById('an-nv-dist')||{}).value||'';
  const edSel=(document.getElementById('an-nv-ed')||{}).value||'';
  let data=saved;
  if(distSel) data=data.filter(a=>a.distribuidor===distSel);
  if(edSel) data=data.filter(a=>a.edicion===edSel);
  if(!data.length){
    out.innerHTML='<div class="an-empty">No hay auditorías para la selección.</div>';
    return;
  }
  const n=data.length;
  let h='';
  // KPIs per NV area
  nvSh.forEach(sh=>{
    const color=AC[sh]||'#607d8b';
    const name=AN[sh]||sh;
    const scores=data.map(a=>((a.scores||{}).areas||{})[sh]||0);
    const avg=scores.reduce((s,v)=>s+v,0)/n;
    const best=Math.max(...scores); const worst=Math.min(...scores);
    // Ranking by this area
    const ranked=[...data].sort((a,b)=>(((b.scores||{}).areas||{})[sh]||0)-(((a.scores||{}).areas||{})[sh]||0));
    h+=`<div class="an-card" style="border-left:4px solid ${color};margin-bottom:12px">
      <div class="an-card-hd" style="color:${color}">${sh} — ${name}
        <span style="margin-left:8px;font-size:10px;font-weight:400;color:var(--g400)">Indicador No Vinculante</span>
      </div>
      <div class="an-kpi-row" style="margin-bottom:12px">
        <div class="an-kpi" style="background:${semBg(avg)}">
          <div class="an-kpi-val" style="color:${semColor(avg)}">${(avg*100).toFixed(1)}%</div>
          <div class="an-kpi-lbl">Promedio Red</div></div>
        <div class="an-kpi" style="background:${semBg(best)}">
          <div class="an-kpi-val" style="color:${semColor(best)}">${(best*100).toFixed(1)}%</div>
          <div class="an-kpi-lbl">Mejor</div></div>
        <div class="an-kpi" style="background:${semBg(worst)}">
          <div class="an-kpi-val" style="color:${semColor(worst)}">${(worst*100).toFixed(1)}%</div>
          <div class="an-kpi-lbl">Peor</div></div>
        <div class="an-kpi"><div class="an-kpi-val">${n}</div><div class="an-kpi-lbl">Distribuidores</div></div>
      </div>
      <div style="font-size:10px;font-weight:700;color:var(--g500);margin-bottom:6px;text-transform:uppercase;letter-spacing:.8px">Ranking por ${sh}</div>
      ${ranked.map((a,i)=>{
        const v=((a.scores||{}).areas||{})[sh]||0; const c=scoreColor(v);
        return `<div class="an-bar-row">
          <div style="font-size:10px;color:var(--g400);min-width:18px">${i+1}</div>
          <div class="an-bar-lbl" style="font-size:11px">${a.distribuidor}</div>
          ${svgBar(v*100,c)}
          <div class="an-bar-val" style="color:${c}">${(v*100).toFixed(1)}%</div>
        </div>`;
      }).join('')}
    </div>`;
  });
  out.innerHTML=h;
}

// ── helpers ──────────────────────────────────────────
function semColor(v){ return v>=0.85?'#16a34a':v>=0.70?'#0d9488':v>=0.50?'#ea580c':'#dc2626'; }
function semBg(v){ return v>=0.85?'var(--green-l)':v>=0.70?'var(--teal-l)':v>=0.50?'var(--amber-l)':'var(--red-l)'; }
function pctStr(v){ return v===null||v===undefined?'—':(v*100).toFixed(1)+'%'; }
function deltaHtml(d){
  if(d===null) return '<span class="delta-eq">—</span>';
  if(d>0.001) return `<span class="delta-up">▲ +${(d*100).toFixed(1)}%</span>`;
  if(d<-0.001) return `<span class="delta-dn">▼ ${(d*100).toFixed(1)}%</span>`;
  return '<span class="delta-eq">= sin cambio</span>';
}

// ── SVG Bar ──
function svgBar(pct, color, height=14, showThr=true){
  const w=Math.max(0,Math.min(100,pct));
  return `<div class="an-bar-track">
    ${showThr?`<div style="position:absolute;left:${THR.rea}%;top:0;bottom:0;width:1.5px;background:#e65100;opacity:.5"></div>
    <div style="position:absolute;left:${THR.act}%;top:0;bottom:0;width:1.5px;background:#f9a825;opacity:.6"></div>
    <div style="position:absolute;left:${THR.pro}%;top:0;bottom:0;width:1.5px;background:#2e7d32;opacity:.6"></div>`:''}
    <div class="an-bar-fill" style="width:${w}%;background:${color}"></div>
  </div>`;
}

// ── SVG Radar ──
function svgRadar(areas, values, benchValues, size=200){
  const n=areas.length; if(n<3) return '';
  const cx=size/2, cy=size/2, r=size*0.38;
  const angle=i=>-Math.PI/2+(2*Math.PI*i/n);
  const pt=(i,frac)=>{
    const a=angle(i);
    return [cx+r*frac*Math.cos(a), cy+r*frac*Math.sin(a)];
  };
  // Grid
  let grid='';
  [.25,.5,.75,1].forEach(frac=>{
    const pts=areas.map((_,i)=>pt(i,frac)).map(p=>p.join(',')).join(' ');
    grid+=`<polygon points="${pts}" fill="none" stroke="#e0e0e0" stroke-width="${frac===1?1.5:.7}"/>`;
  });
  // Axes
  let axes='';
  areas.forEach((_,i)=>{
    const [x,y]=pt(i,1);
    axes+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e0e0e0" stroke-width=".7"/>`;
  });
  // Bench polygon
  const benchPts=benchValues.map((v,i)=>pt(i,Math.min(1,v)).join(',')).join(' ');
  // Value polygon
  const valPts=values.map((v,i)=>pt(i,Math.min(1,v)).join(',')).join(' ');
  // Labels
  let labels='';
  areas.forEach((a,i)=>{
    const [x,y]=pt(i,1.22);
    const color=AC[a]||'#607d8b';
    labels+=`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle"
      font-size="9" font-weight="800" fill="${color}" font-family="'Barlow Condensed',sans-serif">${a}</text>`;
  });
  // Pct labels on axes
  let pctLabels='';
  [25,50,75,100].forEach(p=>{
    const [x,y]=pt(0,p/100);
    pctLabels+=`<text x="${x+3}" y="${y}" font-size="7" fill="#bbb" font-family="'Barlow',sans-serif">${p}%</text>`;
  });
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    ${grid}${axes}
    <polygon points="${benchPts}" fill="rgba(96,125,139,.1)" stroke="#90a4ae" stroke-width="1.5" stroke-dasharray="3,2"/>
    <polygon points="${valPts}" fill="${semColor(values.reduce((s,v)=>s+v,0)/n)+'33'}" stroke="${semColor(values.reduce((s,v)=>s+v,0)/n)}" stroke-width="2"/>
    ${values.map((v,i)=>{ const [x,y]=pt(i,Math.min(1,v)); return `<circle cx="${x}" cy="${y}" r="3" fill="${semColor(v)}"/>`; }).join('')}
    ${labels}${pctLabels}
    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
      font-size="18" font-weight="900" fill="${semColor(values.reduce((s,v)=>s+v,0)/n)}"
      font-family="'Barlow Condensed',sans-serif">${(values.reduce((s,v)=>s+v,0)/n*100).toFixed(0)}%</text>
  </svg>`;
}

// ════════════════════════════════════════════════════
// MÓDULO 1 — PERFORMANCE INDIVIDUAL
// ════════════════════════════════════════════════════
function renderM1(){
  const dist=(document.getElementById('an-sel-dist')||{}).value||'';
  const edSel=(document.getElementById('an-sel-ed')||{}).value||'';
  const out=document.getElementById('an-m1-out');
  if(!dist){out.innerHTML='<div class="an-empty">Seleccioná un distribuidor.</div>';return;}

  // Get audits for this dist, pick edition
  const allAudits=saved.filter(a=>a.distribuidor===dist).sort((a,b)=>(a.edicion||'').localeCompare(b.edicion||''));
  if(!allAudits.length){out.innerHTML='<div class="an-empty">No hay auditorías para este distribuidor.</div>';return;}
  const audit=edSel?allAudits.find(a=>a.edicion===edSel)||allAudits[allAudits.length-1]:allAudits[allAudits.length-1];
  const sc=audit.scores||{}; const at=sc.areas||{}; const ans=audit.answers||{};
  const sheets=SHEETS();

  // Network benchmark for this edition
  const netAudits=saved.filter(a=>a.edicion===audit.edicion);
  const netAvg=netAudits.length?netAudits.reduce((s,a)=>s+((a.scores||{}).total||0),0)/netAudits.length:0;
  const netAreas=Object.fromEntries(sheets.map(sh=>[sh,
    netAudits.length?netAudits.reduce((s,a)=>s+((a.scores||{}).areas[sh]||0),0)/netAudits.length:0]));

  // Previous audit for delta
  const m1CmpEd=(document.getElementById('m1-cmp-ed')||{}).value||'';
  const prevIdx=allAudits.indexOf(audit)-1;
  let prev=prevIdx>=0?allAudits[prevIdx]:null;
  if(m1CmpEd) prev=allAudits.find(a=>a.edicion===m1CmpEd)||prev;
  const m1ShowPrev=(document.getElementById('m1-btn-prev')||{}).classList?.contains('on')??true;
  const m1ShowAE=(document.getElementById('m1-btn-ae')||{}).classList?.contains('on')??true;

  // AE data for this dist + edition
  const aeAudit=m1ShowAE?autoevals.find(a=>a.distribuidor===dist&&a.edicion===audit.edicion)||null:null;
  const aeAt=(aeAudit?.scores||{}).areas||{};
  const aeTotal=(aeAudit?.scores||{}).total||null;

  // Update comparison edition dropdown
  const m1SelEd=document.getElementById('m1-cmp-ed');
  if(m1SelEd){
    const opts=allAudits.filter(a=>a.edicion!==audit.edicion).map(a=>a.edicion).reverse();
    m1SelEd.innerHTML='<option value="">— más reciente —</option>'+opts.map(ed=>`<option value="${ed}"${m1CmpEd===ed?' selected':''}>${ed}</option>`).join('');
  }

  let h='';

  // ── Comparison summary bar ──
  if((aeAudit&&m1ShowAE)||(prev&&m1ShowPrev)){
    h+=`<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;padding:12px 16px;background:linear-gradient(135deg,#f0f4fa,#e8edf5);border-radius:10px;border:1.5px solid var(--g200)">`;
    h+=`<div class="cmp-score-pill csp-ev"><span class="csp-lbl">EV ${audit.edicion}</span><span class="csp-val">${(sc.total*100||0).toFixed(1)}%</span></div>`;
    if(aeAudit&&m1ShowAE) h+=`<div class="cmp-score-pill csp-ae"><span class="csp-lbl">AE ${audit.edicion}</span><span class="csp-val">${(aeTotal*100||0).toFixed(1)}%</span><span style="font-size:9px;margin-left:6px;color:${(aeTotal||0)>=(sc.total||0)?'#2e7d32':'#c62828'}">${(aeTotal||0)>=(sc.total||0)?'▲':'▼'}${Math.abs(((aeTotal||0)-(sc.total||0))*100).toFixed(1)}%</span></div>`;
    if(prev&&m1ShowPrev) h+=`<div class="cmp-score-pill csp-prev"><span class="csp-lbl">EV ${prev.edicion}</span><span class="csp-val">${((prev.scores?.total||0)*100).toFixed(1)}%</span><span style="font-size:9px;margin-left:6px;color:${(sc.total||0)>=(prev.scores?.total||0)?'#2e7d32':'#c62828'}">${(sc.total||0)>=(prev.scores?.total||0)?'▲':'▼'}${Math.abs(((sc.total||0)-(prev.scores?.total||0))*100).toFixed(1)}%</span></div>`;
    h+=`</div>`;
  }

  // ── KPIs ──
  const total=sc.total||0;
  const critOk=sc.critMet||0;
  h+=`<div class="an-kpi-row">
    <div class="an-kpi" style="background:${semBg(total)};border:1.5px solid ${semColor(total)}40">
      <div class="an-kpi-val" style="color:${semColor(total)}">${(total*100).toFixed(1)}%</div>
      <div class="an-kpi-lbl">Puntaje Total EV</div>
    </div>
    ${aeAudit&&m1ShowAE?`<div class="an-kpi" style="background:#f3e5f5;border:1.5px solid #ce93d840">
      <div class="an-kpi-val" style="color:#7b1fa2">${(aeTotal*100).toFixed(1)}%</div>
      <div class="an-kpi-lbl">Autoevaluación ${audit.edicion}</div>
    </div>`:''}
    <div class="an-kpi" style="background:${semBg(netAvg)};border:1.5px solid ${semColor(netAvg)}40">
      <div class="an-kpi-val" style="color:${semColor(netAvg)}">${(netAvg*100).toFixed(1)}%</div>
      <div class="an-kpi-lbl">Promedio Red</div>
    </div>
    <div class="an-kpi" style="background:${total>=netAvg?'#e8f5e9':'#ffebee'}">
      <div class="an-kpi-val" style="color:${total>=netAvg?'#2e7d32':'#c62828'}">${total>=netAvg?'▲':'▼'} ${Math.abs((total-netAvg)*100).toFixed(1)}%</div>
      <div class="an-kpi-lbl">vs Promedio Red</div>
    </div>
    <div class="an-kpi">
      <div class="an-kpi-val" style="color:${critOk===CRIT_LIST.length?'#2e7d32':'#c62828'}">${critOk}/${CRIT_LIST.length}</div>
      <div class="an-kpi-lbl">Críticos OK</div>
    </div>
    <div class="an-kpi" style="background:${semBg(total)}">
      <div class="an-kpi-val" style="color:${semColor(total)};font-size:14px;font-weight:900">${recomputeCategory(audit)||'—'}</div>
      <div class="an-kpi-lbl">Categoría · Ed. ${audit.edicion||'—'}</div>
    </div>
    ${prev&&m1ShowPrev?`<div class="an-kpi">
      <div class="an-kpi-val">${deltaHtml((sc.total||0)-((prev.scores||{}).total||0))}</div>
      <div class="an-kpi-lbl">vs Ed. ${prev.edicion}</div>
    </div>`:''}
  </div>`;

  // ── Radar + Barras por Área (solo core) ──
  const coreSheets=SHEETS_CORE(); const nvSheets=SHEETS_NV();
  function _m1AreaBar(sh){
    const v=at[sh]||0; const bv=netAreas[sh]||0; const col=AC[sh]||'#607d8b';
    const gap=THR.pro/100-v;
    const aeV=aeAudit&&m1ShowAE?(aeAt[sh]||0):null;
    const prevV=prev&&m1ShowPrev?((prev.scores||{}).areas||{})[sh]||0:null;
    return `<div class="an-bar-row">
        <div class="an-bar-lbl" style="color:${col}">${sh}</div>
        ${svgBar(v*100,col)}
        <div class="an-bar-val" style="color:${semColor(v)}">${(v*100).toFixed(0)}%</div>
      </div>
      <div style="font-size:9px;color:var(--g400);margin:-4px 0 8px 128px">
        Red: ${(bv*100).toFixed(0)}% ${v>=bv?'<span style="color:#2e7d32">▲ sobre red</span>':'<span style="color:#c62828">▼ bajo red</span>'}
        ${aeV!==null?` · <span style="color:#7b1fa2">AE: ${(aeV*100).toFixed(0)}% ${aeV>=v?'<span style="color:#4a148c">▲</span>':'<span style="color:#880e4f">▼</span>'}</span>`:''}
        ${prevV!==null?` · <span style="color:var(--g600)">Ant: ${(prevV*100).toFixed(0)}%</span>`:''}
        ${gap>0?` · <span style="color:var(--amber)">Faltan ${(gap*100).toFixed(1)}% para PROACTIVO</span>`:'<span style="color:var(--green)"> ✓ PROACTIVO</span>'}
      </div>`;
  }
  h+=`<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:14px">
    <div class="an-card" style="flex:0 0 auto">
      <div class="an-card-hd">🕸 Radar por Área <small style="font-weight:400;color:var(--g400)">— punteado=red</small></div>
      <div class="an-radar-wrap">${svgRadar(coreSheets,coreSheets.map(sh=>at[sh]||0),coreSheets.map(sh=>netAreas[sh]||0),220)}</div>
    </div>
    <div class="an-card" style="flex:1;min-width:220px">
      <div class="an-card-hd">📐 Puntaje por Área vs Red</div>
      ${coreSheets.map(_m1AreaBar).join('')}
      ${nvSheets.length>0?`<div style="margin-top:10px;padding-top:8px;border-top:1px dashed var(--g200)">
        <div style="font-size:9px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--g400);margin-bottom:6px">No Vinculantes</div>
        ${nvSheets.map(_m1AreaBar).join('')}
      </div>`:''}
    </div>
  </div>`;

  // ── Detalle por BPL (ordenado por impacto) ──
  const bplScores=[];
  sheets.forEach(sh=>{
    const shQ=Q.filter(q=>q.sheet===sh);
    const bplNums=[...new Set(shQ.map(q=>q.bpl_num))];
    bplNums.forEach(bk=>{
      const bkQ=shQ.filter(q=>q.bpl_num===bk);
      const ok=bkQ.filter(q=>ans[q.comp_num]==='si').length;
      const tot=bkQ.filter(q=>ans[q.comp_num]).length;
      if(!tot) return;
      const pct=ok/tot;
      bplScores.push({sh,bk,name:(bkQ[0]||{}).bpl_name||'',pct,ok,tot,color:AC[sh]||'#607d8b'});
    });
  });
  bplScores.sort((a,b)=>a.pct-b.pct);
  h+=`<div class="an-card">
    <div class="an-card-hd">📉 Atributos con Menor Desempeño <small style="font-weight:400;color:var(--g400)">(impacto descendente)</small></div>
    ${bplScores.slice(0,8).map(b=>`<div class="an-bar-row">
      <div class="an-bar-lbl" title="${b.name}"><span style="color:${b.color};font-size:9px;font-weight:800">${b.sh} ${b.bk}</span> ${b.name.length>18?b.name.slice(0,18)+'…':b.name}</div>
      ${svgBar(b.pct*100,semColor(b.pct))}
      <div class="an-bar-val" style="color:${semColor(b.pct)}">${(b.pct*100).toFixed(0)}%</div>
    </div>`).join('')}
  </div>`;

  // ── Preguntas críticas fallidas ──
  const critFail=[];
  Q.forEach(q=>{
    if(!q.critico) return;
    const r=ans[q.comp_num];
    if(r==='no'||!r) critFail.push({...q,resp:r||'sin respuesta'});
  });
  if(critFail.length){
    h+=`<div class="an-card">
      <div class="an-card-hd">🔴 Condicionales Críticos Fallidos (${critFail.length})</div>
      <table class="an-tbl"><thead><tr><th>#</th><th>Crítico</th><th>Área</th><th>Pregunta</th><th>Estado</th></tr></thead><tbody>
      ${critFail.map(q=>`<tr>
        <td style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--g400)">${q.comp_num}</td>
        <td><span style="color:var(--red);font-weight:800;font-size:11px">${q.critico}</span></td>
        <td><span style="color:${AC[q.sheet]||'#607d8b'};font-weight:700;font-size:11px">${q.sheet}</span></td>
        <td style="font-size:11px">${q.question}</td>
        <td><span class="badge" style="background:#ffebee;color:#c62828;border:1px solid #ffcdd2">${q.resp==='no'?'✗ NO':'⚪ Sin resp.'}</span></td>
      </tr>`).join('')}
      </tbody></table>
    </div>`;
  } else {
    h+=`<div class="an-card" style="border-color:#a5d6a7"><div class="an-card-hd" style="color:#2e7d32">✅ Todos los condicionales críticos cumplidos</div></div>`;
  }

  // ── Historial ──
  if(allAudits.length>1){
    h+=`<div class="an-card">
      <div class="an-card-hd">📅 Historial de Ediciones</div>
      <div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;padding:8px 0">
        ${allAudits.map((a,i)=>{
          const v=((a.scores||{}).total||0)*100;
          const prev2=i>0?((allAudits[i-1].scores||{}).total||0)*100:null;
          const barH=Math.max(20,v*1.2);
          const col=semColor(v/100);
          return `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;min-width:60px">
            <div style="font-size:11px;font-weight:800;color:${col}">${v.toFixed(1)}%</div>
            ${prev2!==null?`<div style="font-size:9px;${v>prev2?'color:#2e7d32':'color:#c62828'}">${v>prev2?'▲':'▼'}${Math.abs(v-prev2).toFixed(1)}</div>`:'<div style="font-size:9px;color:var(--g300)">base</div>'}
            <div style="width:100%;background:${col};height:${barH}px;border-radius:4px 4px 0 0;opacity:.85"></div>
            <div style="font-size:9px;color:var(--g500);font-weight:700">${a.edicion||'—'}</div>
            <div style="font-size:9px;color:var(--g400)">${recomputeCategory(a)||''}</div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  // ── Brecha vs PROACTIVO ──
  const proThr=THR.pro/100;
  const brechas=sheets.map(sh=>({sh,gap:Math.max(0,proThr-(at[sh]||0)),color:AC[sh]||'#607d8b'})).filter(b=>b.gap>0).sort((a,b)=>b.gap-a.gap);
  if(brechas.length){
    h+=`<div class="an-card">
      <div class="an-card-hd">🎯 Brecha hacia PROACTIVO (${THR.pro}%)</div>
      ${brechas.map(b=>`<div class="an-bar-row">
        <div class="an-bar-lbl" style="color:${b.color}">${b.sh} · ${AN[b.sh]||''}</div>
        ${svgBar(b.gap*100,'#ef9a9a',14,false)}
        <div class="an-bar-val" style="color:#c62828">-${(b.gap*100).toFixed(1)}%</div>
      </div>`).join('')}
    </div>`;
  }

  // ── Comparación por pregunta (AE / Edición Anterior) ──
  if((aeAudit&&m1ShowAE)||(prev&&m1ShowPrev)){
    const hasCols=[
      ...(m1ShowAE&&aeAudit?[{lbl:`AE ${audit.edicion}`,key:'ae',color:'#7b1fa2'}]:[]),
      ...(m1ShowPrev&&prev?[{lbl:`EV ${prev.edicion}`,key:'prev',color:'#546e7a'}]:[])
    ];
    const evAnswers=ans;
    const aeAnswers=aeAudit?(aeAudit.answers||{}):{};
    const pvAnswers=prev?(prev.answers||{}):{};
    function _qValCell(v,color){
      const cls=v==='si'?'cmp-si':v==='no'?'cmp-no':v==='na'?'cmp-na':'cmp-none';
      const icon=v==='si'?'✓':v==='no'?'✗':v==='na'?'—':'·';
      const txt=v==='si'?'SÍ':v==='no'?'NO':v==='na'?'N/A':'—';
      return `<td style="text-align:center;padding:3px 6px"><span class="cmp-chip ${cls}" style="font-size:9px">${icon} ${txt}</span></td>`;
    }
    h+=`<div class="an-card">
      <div class="an-card-hd" style="display:flex;align-items:center;gap:10px">
        🔬 Comparación por Pregunta
        <span style="font-size:10px;color:var(--g400);font-weight:400">— todas las preguntas, respuestas por edición</span>
      </div>
      <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:10px">
        <thead>
          <tr style="background:var(--g50)">
            <th style="padding:5px 8px;text-align:left;border-bottom:2px solid var(--g200);font-size:9px;color:var(--g500);font-weight:700;letter-spacing:.5px;min-width:50px">#</th>
            <th style="padding:5px 8px;text-align:left;border-bottom:2px solid var(--g200);font-size:9px;color:var(--g500);font-weight:700;min-width:200px">Pregunta</th>
            <th style="padding:5px 8px;text-align:center;border-bottom:2px solid var(--g200);font-size:9px;color:var(--blue2);font-weight:700">EV ${audit.edicion}</th>
            ${hasCols.map(c=>`<th style="padding:5px 8px;text-align:center;border-bottom:2px solid var(--g200);font-size:9px;color:${c.color};font-weight:700">${c.lbl}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${sheets.map(sh=>{
            const shQs=Q.filter(q=>q.sheet===sh);
            if(!shQs.length) return '';
            const colSp=2+hasCols.length;
            let rows=`<tr><td colspan="${colSp}" style="padding:5px 8px;background:${(AC[sh]||'#607d8b')}18;font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:800;color:${AC[sh]||'#607d8b'};letter-spacing:.8px;text-transform:uppercase">${sh} · ${AN[sh]||sh}</td></tr>`;
            shQs.forEach((q,qi)=>{
              const ev=evAnswers[q.comp_num]||null;
              const ae=aeAnswers[q.comp_num]||null;
              const pv=pvAnswers[q.comp_num]||null;
              const rowBg=qi%2===0?'':'background:var(--g50)';
              rows+=`<tr style="${rowBg}">
                <td style="padding:3px 8px;color:var(--g400);font-size:9px;white-space:nowrap">${q.comp_num}${q.critico?` <span style="color:var(--red);font-size:8px">🔴</span>`:''}</td>
                <td style="padding:3px 8px;color:var(--g700);line-height:1.3">${q.question.length>80?q.question.slice(0,80)+'…':q.question}</td>
                ${_qValCell(ev,'var(--blue2)')}
                ${m1ShowAE&&aeAudit?_qValCell(ae,'#7b1fa2'):''}
                ${m1ShowPrev&&prev?_qValCell(pv,'#546e7a'):''}
              </tr>`;
            });
            return rows;
          }).join('')}
        </tbody>
      </table>
      </div>
    </div>`;
  }

  out.innerHTML=h;
}

function toggleM1AE(){
  const btn=document.getElementById('m1-btn-ae'); if(!btn) return;
  btn.classList.toggle('on'); renderM1();
}
function toggleM1Prev(){
  const btn=document.getElementById('m1-btn-prev'); if(!btn) return;
  btn.classList.toggle('on'); renderM1();
}

// ════════════════════════════════════════════════════
// MÓDULO 2 — PERFORMANCE GLOBAL
// ════════════════════════════════════════════════════
function renderM2(){
  const edSel=(document.getElementById('an-m2-ed')||{}).value||'';
  const out=document.getElementById('an-m2-out');
  const data=edSel?saved.filter(a=>a.edicion===edSel):saved;
  if(!data.length){out.innerHTML='<div class="an-empty">No hay auditorías para mostrar.</div>';return;}

  const sheets=SHEETS();
  const eds=[...new Set(saved.map(a=>a.edicion).filter(Boolean))].sort();
  const prevEd=eds.length>1?eds[eds.indexOf(edSel||eds[eds.length-1])-1]:null;
  const prevData=prevEd?saved.filter(a=>a.edicion===prevEd):[];

  const sorted=[...data].sort((a,b)=>((b.scores||{}).total||0)-((a.scores||{}).total||0));
  const cats={PROACTIVO:0,ACTIVO:0,REACTIVO:0,INACTIVO:0};
  data.forEach(a=>{const c=recomputeCategory(a);cats[c]=(cats[c]||0)+1;});
  const catCols={PROACTIVO:'#2e7d32',ACTIVO:'#00695c',REACTIVO:'#e65100',INACTIVO:'#c62828'};
  const n=data.length;
  const avg=n?data.reduce((s,a)=>s+((a.scores||{}).total||0),0)/n:0;

  let h='';

  // ── KPIs globales ──
  h+=`<div class="an-kpi-row">
    <div class="an-kpi"><div class="an-kpi-val">${n}</div><div class="an-kpi-lbl">Distribuidores</div></div>
    <div class="an-kpi" style="background:${semBg(avg)}">
      <div class="an-kpi-val" style="color:${semColor(avg)}">${(avg*100).toFixed(1)}%</div>
      <div class="an-kpi-lbl">Promedio Red</div></div>
    <div class="an-kpi" style="background:#e8f5e9">
      <div class="an-kpi-val" style="color:#2e7d32">${cats.PROACTIVO}</div>
      <div class="an-kpi-lbl">Proactivos</div></div>
    <div class="an-kpi" style="background:#e0f2f1">
      <div class="an-kpi-val" style="color:#00695c">${cats.ACTIVO}</div>
      <div class="an-kpi-lbl">Activos</div></div>
    <div class="an-kpi" style="background:#fff3e0">
      <div class="an-kpi-val" style="color:#e65100">${cats.REACTIVO}</div>
      <div class="an-kpi-lbl">Reactivos</div></div>
    <div class="an-kpi" style="background:#ffebee">
      <div class="an-kpi-val" style="color:#c62828">${cats.INACTIVO}</div>
      <div class="an-kpi-lbl">Inactivos</div></div>
    <div class="an-kpi">
      <div class="an-kpi-val" style="font-size:16px">${((((sorted[0]||{}).scores||{}).total||0)*100).toFixed(1)}% / ${((((sorted[n-1]||{}).scores||{}).total||0)*100).toFixed(1)}%</div>
      <div class="an-kpi-lbl">Mejor / Peor</div></div>
  </div>`;

  // ── Distribución de categorías ──
  h+=`<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:14px">
  <div class="an-card" style="flex:1;min-width:220px">
    <div class="an-card-hd">🏷 Distribución de Categorías</div>
    ${['PROACTIVO','ACTIVO','REACTIVO','INACTIVO'].map(cat=>{
      const count=cats[cat]||0; const pct=n?count/n*100:0;
      return `<div class="an-bar-row">
        <div class="an-bar-lbl"><span class="sem" style="background:${catCols[cat]}"></span> ${cat}</div>
        ${svgBar(pct,catCols[cat],14,false)}
        <div class="an-bar-val" style="color:${catCols[cat]}">${count} <span style="font-size:10px;font-weight:400;color:var(--g400)">(${pct.toFixed(0)}%)</span></div>
      </div>`;
    }).join('')}
  </div>

  <!-- Top 5 / Bottom 5 -->
  <div class="an-card" style="flex:1;min-width:220px">
    <div class="an-card-hd">🏆 Top 5 · 💀 Bottom 5</div>
    <div style="font-size:10px;font-weight:700;color:var(--g400);margin-bottom:4px">MEJORES</div>
    ${sorted.slice(0,5).map((a,i)=>{
      const v=(a.scores||{}).total||0;
      const prev2=prevData.find(p=>p.distribuidor===a.distribuidor);
      const delta=prev2?(v-((prev2.scores||{}).total||0)):null;
      return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:900;color:var(--g300);min-width:16px">${i+1}</div>
        <div style="flex:1;font-size:11px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.distribuidor}</div>
        ${delta!==null?deltaHtml(delta):''}
        <div style="font-size:12px;font-weight:800;color:${semColor(v)}">${(v*100).toFixed(1)}%</div>
      </div>`;
    }).join('')}
    <div style="font-size:10px;font-weight:700;color:var(--g400);margin:8px 0 4px">PEORES</div>
    ${sorted.slice(-5).reverse().map((a,i)=>{
      const v=(a.scores||{}).total||0;
      return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:900;color:var(--red);min-width:16px">${n-i}</div>
        <div style="flex:1;font-size:11px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.distribuidor}</div>
        <div style="font-size:12px;font-weight:800;color:${semColor(v)}">${(v*100).toFixed(1)}%</div>
      </div>`;
    }).join('')}
  </div></div>`;

  // ── Ranking general ──
  const m2ShowAE=(document.getElementById('m2-btn-ae')||{}).classList?.contains('on')??true;
  const m2ShowPrev=(document.getElementById('m2-btn-prev')||{}).classList?.contains('on')??true;
  const curEd=edSel||[...new Set(saved.map(a=>a.edicion).filter(Boolean))].sort().pop()||'';

  // AE comparison summary
  if(m2ShowAE&&autoevals.length){
    const aeForEd=autoevals.filter(a=>!curEd||a.edicion===curEd);
    const aeAvg=aeForEd.length?aeForEd.reduce((s,a)=>s+((a.scores||{}).total||0),0)/aeForEd.length:null;
    if(aeAvg!==null){
      h+=`<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;padding:12px 16px;background:#f3e5f5;border-radius:10px;border:1.5px solid #ce93d8">
        <div style="flex:1">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:800;color:#7b1fa2;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">🟣 Autoevaluaciones ${curEd||'(todos los años)'} — ${aeForEd.length} registros</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <div class="cmp-score-pill csp-ae"><span class="csp-lbl">Promedio AE</span><span class="csp-val">${(aeAvg*100).toFixed(1)}%</span></div>
            <div class="cmp-score-pill csp-ev"><span class="csp-lbl">Promedio EV</span><span class="csp-val">${(avg*100).toFixed(1)}%</span></div>
            <div class="cmp-score-pill" style="border-color:${aeAvg>=avg?'#2e7d32':'#c62828'}"><span class="csp-lbl">Diferencia AE - EV</span><span class="csp-val" style="color:${aeAvg>=avg?'#2e7d32':'#c62828'}">${aeAvg>=avg?'+':''}${((aeAvg-avg)*100).toFixed(1)}%</span></div>
          </div>
        </div>
      </div>`;
    }
  }

  h+=`<div class="an-card">
    <div class="an-card-hd">📋 Ranking General</div>
    <div style="overflow-x:auto"><table class="an-tbl"><thead><tr>
      <th>#</th><th>Distribuidor</th>
      ${sheets.map(sh=>`<th style="color:${AC[sh]||'#607d8b'}">${sh}</th>`).join('')}
      <th>Total EV</th>
      ${m2ShowAE?`<th style="color:#7b1fa2">AE</th><th style="color:#7b1fa2">Δ EV-AE</th>`:''}
      ${m2ShowPrev?`<th>Δ ant.</th>`:''}
      <th>Críticos</th><th>Categoría</th>
    </tr></thead><tbody>
    ${sorted.map((a,i)=>{
      const s=a.scores||{}; const at=s.areas||{};
      const prev2=m2ShowPrev?prevData.find(p=>p.distribuidor===a.distribuidor):null;
      const delta=prev2?((s.total||0)-((prev2.scores||{}).total||0)):null;
      const ae2=m2ShowAE?autoevals.find(ae=>ae.distribuidor===a.distribuidor&&ae.edicion===a.edicion):null;
      const aeTotal2=ae2?(ae2.scores||{}).total||0:null;
      const deltaAE=aeTotal2!==null?((s.total||0)-aeTotal2):null;
      return `<tr>
        <td style="font-weight:800;color:var(--g400)">${i+1}</td>
        <td style="font-weight:700">${a.distribuidor}</td>
        ${sheets.map(sh=>`<td>${pctBadge(((at[sh]||0)*100).toFixed(1))}</td>`).join('')}
        <td style="font-weight:800">${pctBadge(((s.total||0)*100).toFixed(1))}</td>
        ${m2ShowAE?`<td>${ae2?pctBadge((aeTotal2*100).toFixed(1)):'<span style="color:var(--g300)">—</span>'}</td><td>${deltaAE!==null?deltaHtml(deltaAE):'<span style="color:var(--g300)">—</span>'}</td>`:''}
        ${m2ShowPrev?`<td>${deltaHtml(delta)}</td>`:''}
        <td><span class="badge b-purple">${s.critMet||0}/${auditTotalCrits(a)}</span></td>
        <td>${catBadge(recomputeCategory(a))}</td>
      </tr>`;
    }).join('')}
    </tbody></table></div>
  </div>`;

  // ── Dispersión por área ──
  h+=`<div class="an-card">
    <div class="an-card-hd">📊 Dispersión por Área (Mín / Prom / Máx)</div>
    ${sheets.map(sh=>{
      const vals=data.map(a=>((a.scores||{}).areas[sh]||0)*100);
      const min2=Math.min(...vals),max2=Math.max(...vals),avg2=vals.reduce((s,v)=>s+v,0)/vals.length;
      const col=AC[sh]||'#607d8b';
      return `<div class="an-bar-row" style="margin-bottom:10px">
        <div class="an-bar-lbl" style="color:${col};font-weight:800">${sh}</div>
        <div style="flex:1;position:relative;height:18px;background:var(--g100);border-radius:9px;overflow:visible">
          <div style="position:absolute;left:${min2}%;top:3px;width:${max2-min2}%;height:12px;background:${col}22;border-radius:6px;border:1.5px solid ${col}66"></div>
          <div style="position:absolute;left:${avg2-1.5}%;top:2px;width:3%;height:14px;background:${col};border-radius:3px"></div>
        </div>
        <div style="font-size:10px;color:var(--g500);min-width:120px;text-align:right">
          ${min2.toFixed(0)}% — <strong style="color:${col}">${avg2.toFixed(1)}%</strong> — ${max2.toFixed(0)}%
        </div>
      </div>`;
    }).join('')}
  </div>`;

  // ── Cumplimiento de críticos ──
  if(CRIT_LIST.length){
    h+=`<div class="an-card">
      <div class="an-card-hd">🔴 Cumplimiento de Condicionales Críticos</div>
      <table class="an-tbl"><thead><tr><th>Crítico</th><th>BPL</th><th>% Cumple</th><th>Distribuidores</th></tr></thead><tbody>
      ${CRIT_LIST.map(cr=>{
        const ok=data.filter(a=>cr.qs.every(comp=>(((a.answers||{})[comp])||'')==='si')).length;
        const pct=n?ok/n*100:0;
        return `<tr>
          <td style="font-weight:800;color:var(--red)">${cr.tag}</td>
          <td style="font-size:11px">${cr.subattr}</td>
          <td>
            <div class="an-bar-row" style="margin:0">
              ${svgBar(pct,semColor(pct/100),12,false)}
              <span style="color:${semColor(pct/100)};font-weight:800;min-width:38px;text-align:right;font-size:11px">${pct.toFixed(0)}%</span>
            </div>
          </td>
          <td style="font-size:11px">${ok}/${n}</td>
        </tr>`;
      }).join('')}
      </tbody></table>
    </div>`;
  }

  // ── Heatmap de preguntas ──
  const noRate=Q.map(q=>{
    const total2=data.filter(a=>(a.answers||{})[q.comp_num]).length;
    const nos=data.filter(a=>(a.answers||{})[q.comp_num]==='no').length;
    return {q,rate:total2?nos/total2:0,total2,nos};
  }).filter(x=>x.total2>0).sort((a,b)=>b.rate-a.rate).slice(0,15);

  if(noRate.length){
    h+=`<div class="an-card">
      <div class="an-card-hd">🔥 Preguntas con Mayor Tasa de NO en la Red</div>
      <table class="an-tbl"><thead><tr><th>#</th><th>Área</th><th>Pregunta</th><th>% NO</th><th>Distribuidores</th></tr></thead><tbody>
      ${noRate.map((x,i)=>`<tr>
        <td style="font-family:'Barlow Condensed',sans-serif;font-size:10px;color:var(--g400)">${x.q.comp_num}</td>
        <td><span style="color:${AC[x.q.sheet]||'#607d8b'};font-weight:800;font-size:11px">${x.q.sheet}</span></td>
        <td style="font-size:11px;max-width:240px">${x.q.question}</td>
        <td>
          <div class="an-bar-row" style="margin:0">
            ${svgBar(x.rate*100,semColor(1-x.rate),12,false)}
            <span style="color:${semColor(1-x.rate)};font-weight:800;min-width:38px;font-size:11px">${(x.rate*100).toFixed(0)}%</span>
          </div>
        </td>
        <td style="font-size:11px">${x.nos}/${x.total2}</td>
      </tr>`).join('')}
      </tbody></table>
    </div>`;
  }

  out.innerHTML=h;
}
function toggleM2AE(){const btn=document.getElementById('m2-btn-ae');if(btn)btn.classList.toggle('on');renderM2();}
function toggleM2Prev(){const btn=document.getElementById('m2-btn-prev');if(btn)btn.classList.toggle('on');renderM2();}

// ════════════════════════════════════════════════════
// MÓDULO 3 — TENDENCIAS ENTRE EDICIONES
// ════════════════════════════════════════════════════
function renderM3(){
  const out=document.getElementById('an-m3-out');
  const eds=[...new Set(saved.map(a=>a.edicion).filter(Boolean))].sort();
  if(eds.length<2){out.innerHTML='<div class="an-empty">Necesitás auditorías de al menos 2 ediciones distintas para ver tendencias.</div>';return;}

  const sheets=SHEETS();
  const edData=eds.map(ed=>{
    const data=saved.filter(a=>a.edicion===ed);
    const avg=data.length?data.reduce((s,a)=>s+((a.scores||{}).total||0),0)/data.length:0;
    const areas=Object.fromEntries(sheets.map(sh=>[sh,
      data.length?data.reduce((s,a)=>s+((a.scores||{}).areas[sh]||0),0)/data.length:0]));
    const cats={PROACTIVO:0,ACTIVO:0,REACTIVO:0,INACTIVO:0};
    data.forEach(a=>{const ct=recomputeCategory(a);cats[ct]=(cats[ct]||0)+1;});
    return {ed,n:data.length,avg,areas,cats,data};
  });

  const edCols=['#1565c0','#6a1b9a','#00695c','#e65100','#c62828','#1b5e20'];
  const catCols={PROACTIVO:'#2e7d32',ACTIVO:'#00695c',REACTIVO:'#e65100',INACTIVO:'#c62828'};

  let h='';

  // ── Evolución total de red ──
  h+=`<div class="an-card">
    <div class="an-card-hd">📈 Evolución del Promedio de Red</div>
    <div style="display:flex;gap:8px;align-items:flex-end;padding:8px 0;flex-wrap:wrap">
      ${edData.map((ed,i)=>{
        const prev=edData[i-1];
        const delta=prev?ed.avg-prev.avg:null;
        const barH=Math.max(24,ed.avg*160);
        const col=edCols[i%edCols.length];
        return `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;min-width:70px">
          <div style="font-size:12px;font-weight:800;color:${semColor(ed.avg)}">${(ed.avg*100).toFixed(1)}%</div>
          ${delta!==null?`<div style="font-size:9px;color:${delta>=0?'#2e7d32':'#c62828'}">${delta>=0?'▲':'▼'} ${Math.abs(delta*100).toFixed(1)}%</div>`:'<div style="font-size:9px;color:var(--g300)">base</div>'}
          <div style="width:100%;background:${col};height:${barH}px;border-radius:4px 4px 0 0;opacity:.8"></div>
          <div style="font-size:10px;font-weight:800;color:${col}">${ed.ed}</div>
          <div style="font-size:9px;color:var(--g400)">${ed.n} dist.</div>
        </div>`;
      }).join('')}
    </div>
  </div>`;

  // ── Áreas en deterioro vs mejora ──
  h+=`<div class="an-card">
    <div class="an-card-hd">📐 Tendencia por Área (primera vs última edición)</div>
    ${sheets.map(sh=>{
      const first=edData[0].areas[sh]||0, last=edData[edData.length-1].areas[sh]||0;
      const delta=last-first; const col=AC[sh]||'#607d8b';
      return `<div class="an-bar-row" style="margin-bottom:8px">
        <div class="an-bar-lbl" style="color:${col};font-weight:800">${sh}</div>
        ${svgBar(last*100,col)}
        <div style="min-width:90px;text-align:right;font-size:11px">
          <span style="font-weight:800;color:${semColor(last)}">${(last*100).toFixed(1)}%</span>
          <span style="color:${delta>=0?'#2e7d32':'#c62828'};font-size:10px;margin-left:4px">${delta>=0?'▲':'▼'}${Math.abs(delta*100).toFixed(1)}%</span>
        </div>
      </div>`;
    }).join('')}
  </div>`;

  // ── Velocidad de mejora por distribuidor ──
  const dists=[...new Set(saved.map(a=>a.distribuidor))];
  const mejoras=dists.map(dist=>{
    const audits=eds.map(ed=>saved.find(a=>a.distribuidor===dist&&a.edicion===ed)).filter(Boolean);
    if(audits.length<2) return null;
    const first=(audits[0].scores||{}).total||0, last=(audits[audits.length-1].scores||{}).total||0;
    const delta=last-first; const n=audits.length-1;
    return {dist,delta,deltaPerEd:delta/n,first,last,audits};
  }).filter(Boolean).sort((a,b)=>b.delta-a.delta);

  if(mejoras.length){
    h+=`<div class="an-card">
      <div class="an-card-hd">🚀 Velocidad de Mejora (${eds[0]} → ${eds[eds.length-1]})</div>
      <table class="an-tbl"><thead><tr><th>Distribuidor</th><th>Inicio</th><th>Actual</th><th>Δ Total</th><th>Δ por edición</th><th>Tendencia</th></tr></thead><tbody>
      ${mejoras.map(m=>`<tr>
        <td style="font-weight:700">${m.dist}</td>
        <td style="color:var(--g400)">${(m.first*100).toFixed(1)}%</td>
        <td style="font-weight:800;color:${semColor(m.last)}">${(m.last*100).toFixed(1)}%</td>
        <td class="${m.delta>=0?'delta-up':'delta-dn'}">${m.delta>=0?'+':''}${(m.delta*100).toFixed(1)}%</td>
        <td class="${m.deltaPerEd>=0?'delta-up':'delta-dn'}">${m.deltaPerEd>=0?'+':''}${(m.deltaPerEd*100).toFixed(1)}%/ed</td>
        <td style="font-size:18px">${m.delta>0.05?'🟢':m.delta>0?'🟡':m.delta===0?'⚪':'🔴'}</td>
      </tr>`).join('')}
      </tbody></table>
    </div>`;
  }

  // ── Movilidad de categorías ──
  if(eds.length>=2){
    const e1=eds[eds.length-2], e2=eds[eds.length-1];
    const move={up:0,down:0,same:0,details:[]};
    const catOrder={PROACTIVO:4,ACTIVO:3,REACTIVO:2,INACTIVO:1};
    dists.forEach(dist=>{
      const a1=saved.find(a=>a.distribuidor===dist&&a.edicion===e1);
      const a2=saved.find(a=>a.distribuidor===dist&&a.edicion===e2);
      if(!a1||!a2) return;
      const c1=recomputeCategory(a1)||'INACTIVO', c2=recomputeCategory(a2)||'INACTIVO';
      const diff=(catOrder[c2]||0)-(catOrder[c1]||0);
      if(diff>0) move.up++;
      else if(diff<0) move.down++;
      else move.same++;
      move.details.push({dist,c1,c2,diff,v1:(a1.scores||{}).total||0,v2:(a2.scores||{}).total||0});
    });
    h+=`<div class="an-card">
      <div class="an-card-hd">🔀 Movilidad de Categorías: ${e1} → ${e2}</div>
      <div class="an-kpi-row" style="margin-bottom:12px">
        <div class="an-kpi" style="background:#e8f5e9"><div class="an-kpi-val" style="color:#2e7d32">${move.up}</div><div class="an-kpi-lbl">Subieron ↑</div></div>
        <div class="an-kpi" style="background:#fff8e1"><div class="an-kpi-val" style="color:#f57f17">${move.same}</div><div class="an-kpi-lbl">Se mantienen =</div></div>
        <div class="an-kpi" style="background:#ffebee"><div class="an-kpi-val" style="color:#c62828">${move.down}</div><div class="an-kpi-lbl">Bajaron ↓</div></div>
      </div>
      <table class="an-tbl"><thead><tr><th>Distribuidor</th><th>${e1}</th><th></th><th>${e2}</th><th>Δ %</th></tr></thead><tbody>
      ${move.details.sort((a,b)=>b.diff-a.diff).map(m=>`<tr>
        <td style="font-weight:700">${m.dist}</td>
        <td>${catBadge(m.c1)}</td>
        <td style="font-size:16px;text-align:center">${m.diff>0?'→':'→'}</td>
        <td>${catBadge(m.c2)} ${m.diff>0?'<span style="color:#2e7d32">▲</span>':m.diff<0?'<span style="color:#c62828">▼</span>':'<span style="color:var(--g400)">═</span>'}</td>
        <td class="${m.v2>m.v1?'delta-up':'delta-dn'}">${m.v2>m.v1?'+':''}${((m.v2-m.v1)*100).toFixed(1)}%</td>
      </tr>`).join('')}
      </tbody></table>
    </div>`;
  }

  // ── Consistencia (varianza) ──
  const consistencia=dists.map(dist=>{
    const vals=eds.map(ed=>{const a=saved.find(x=>x.distribuidor===dist&&x.edicion===ed);return a?((a.scores||{}).total||0):null;}).filter(v=>v!==null);
    if(vals.length<2) return null;
    const avg2=vals.reduce((s,v)=>s+v,0)/vals.length;
    const variance=vals.reduce((s,v)=>s+Math.pow(v-avg2,2),0)/vals.length;
    const std=Math.sqrt(variance);
    return {dist,avg2,std,vals,min:Math.min(...vals),max:Math.max(...vals)};
  }).filter(Boolean).sort((a,b)=>b.std-a.std);

  if(consistencia.length){
    h+=`<div class="an-card">
      <div class="an-card-hd">📉 Consistencia entre Ediciones <small style="font-weight:400;color:var(--g400)">(mayor σ = más inestable)</small></div>
      <table class="an-tbl"><thead><tr><th>Distribuidor</th><th>Promedio</th><th>σ Desvío</th><th>Mín</th><th>Máx</th><th>Estabilidad</th></tr></thead><tbody>
      ${consistencia.map(x=>{
        const stab=x.std<0.03?'🟢 Muy estable':x.std<0.07?'🟡 Estable':x.std<0.12?'🟠 Variable':'🔴 Inestable';
        return `<tr>
          <td style="font-weight:700">${x.dist}</td>
          <td style="font-weight:800;color:${semColor(x.avg2)}">${(x.avg2*100).toFixed(1)}%</td>
          <td class="${x.std>0.10?'risk-hi':x.std>0.05?'risk-md':'risk-lo'}">± ${(x.std*100).toFixed(1)}%</td>
          <td style="color:#c62828">${(x.min*100).toFixed(1)}%</td>
          <td style="color:#2e7d32">${(x.max*100).toFixed(1)}%</td>
          <td>${stab}</td>
        </tr>`;
      }).join('')}
      </tbody></table>
    </div>`;
  }

  // ── Brecha histórica ──
  h+=`<div class="an-card">
    <div class="an-card-hd">📏 Brecha Histórica (Mejor - Peor)</div>
    <div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;padding:8px 0">
      ${edData.map((ed,i)=>{
        const vals=ed.data.map(a=>(a.scores||{}).total||0);
        const gap=Math.max(...vals)-Math.min(...vals);
        const barH=Math.max(10,gap*200);
        const col=edCols[i%edCols.length];
        return `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;min-width:70px">
          <div style="font-size:11px;font-weight:800;color:${gap>0.3?'#c62828':gap>0.15?'#e65100':'#2e7d32'}">${(gap*100).toFixed(1)}%</div>
          <div style="width:100%;background:${col};height:${barH}px;border-radius:4px 4px 0 0;opacity:.7"></div>
          <div style="font-size:10px;font-weight:800;color:${col}">${ed.ed}</div>
        </div>`;
      }).join('')}
    </div>
    <div style="font-size:10px;color:var(--g400);margin-top:4px">Menor brecha = red más homogénea y consistente</div>
  </div>`;

  out.innerHTML=h;
}

// ════════════════════════════════════════════════════
// MÓDULO 4 — ANÁLISIS ESTRATÉGICO
// ════════════════════════════════════════════════════
function renderM4(){
  const edSel=(document.getElementById('an-m4-ed')||{}).value||'';
  const out=document.getElementById('an-m4-out');
  const data=edSel?saved.filter(a=>a.edicion===edSel):saved;
  if(!data.length){out.innerHTML='<div class="an-empty">No hay auditorías para analizar.</div>';return;}

  const sheets=SHEETS();
  const n=data.length;
  let h='';

  // ─────────────────────────────────────────
  // 1. ÍNDICE DE RIESGO
  // ─────────────────────────────────────────
  const riskData=data.map(a=>{
    const s=a.scores||{};
    const scoreRisk=Math.max(0,1-(s.total||0));
    const critRisk=CRIT_LIST.length?(1-(s.critMet||0)/CRIT_LIST.length):0;
    const allA=saved.filter(x=>x.distribuidor===a.distribuidor).sort((x,y)=>(x.edicion||'').localeCompare(y.edicion||''));
    const idx2=allA.indexOf(a);
    const prev=idx2>0?allA[idx2-1]:null;
    const trendRisk=prev?Math.max(0,-((s.total||0)-((prev.scores||{}).total||0))):0;
    const ri=scoreRisk*0.5+critRisk*0.3+trendRisk*0.2;
    return {...a,ri,scoreRisk,critRisk,trendRisk};
  }).sort((a,b)=>b.ri-a.ri);

  const riskColor=ri=>ri>0.5?'#c62828':ri>0.25?'#e65100':ri>0.1?'#f9a825':'#2e7d32';
  const riskLabel=ri=>ri>0.5?'ALTO':ri>0.25?'MEDIO':ri>0.1?'BAJO':'OK';
  const riskBg=ri=>ri>0.5?'#ffebee':ri>0.25?'#fff3e0':ri>0.1?'#fffde7':'#e8f5e9';

  h+=`<div class="an-card">
    <div class="an-card-hd">⚠️ Índice de Riesgo Integral
      <span style="font-size:10px;font-weight:400;color:var(--g400);margin-left:6px">Puntaje 50% + Críticos 30% + Tendencia 20%</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px">
    ${riskData.map(a=>{
      const ri=a.ri; const col=riskColor(ri); const bg=riskBg(ri);
      const barW=Math.min(100,ri*100);
      return `<div style="background:${bg};border:1.5px solid ${col}30;border-radius:8px;padding:10px 12px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <div style="font-size:12px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${a.distribuidor}</div>
          <div style="background:${col};color:#fff;border-radius:4px;padding:2px 7px;font-size:10px;font-weight:800;flex-shrink:0;margin-left:6px">${riskLabel(ri)}</div>
        </div>
        <div style="background:rgba(0,0,0,.08);border-radius:6px;height:8px;margin-bottom:6px;overflow:hidden">
          <div style="height:100%;width:${barW}%;background:${col};border-radius:6px;transition:width .4s"></div>
        </div>
        <div style="display:flex;gap:10px;font-size:10px;color:var(--g600)">
          <span>Score: <strong style="color:${semColor((a.scores||{}).total||0)}">${(((a.scores||{}).total||0)*100).toFixed(0)}%</strong></span>
          <span>Crit: <strong>${(a.scores||{}).critMet||0}/${CRIT_LIST.length}</strong></span>
          <span>Tend: <strong style="color:${a.trendRisk>0.02?'#c62828':'#2e7d32'}">${a.trendRisk>0.02?'▼ -'+(a.trendRisk*100).toFixed(1)+'%':'↔ ok'}</strong></span>
        </div>
      </div>`;
    }).join('')}
    </div>
  </div>`;

  // ─────────────────────────────────────────
  // 2. SEGMENTACIÓN POR PERFIL
  // ─────────────────────────────────────────
  const segmentos={};
  data.forEach(a=>{
    const at=(a.scores||{}).areas||{};
    const avg=(a.scores||{}).total||0;
    const strongs=sheets.filter(sh=>(at[sh]||0)>=THR.act/100);
    const weaks=sheets.filter(sh=>(at[sh]||0)<THR.rea/100);
    let perfil,pColor;
    if(avg>=THR.pro/100){perfil='Alto rendimiento general';pColor='#2e7d32';}
    else if(strongs.length>=Math.ceil(sheets.length*0.6)){perfil='Fuerte en '+strongs.slice(0,2).join(', ');pColor='#00695c';}
    else if(weaks.length>=Math.ceil(sheets.length*0.5)){perfil='Débil en '+weaks.slice(0,2).join(', ');pColor='#e65100';}
    else if(avg>=THR.act/100){perfil='Rendimiento medio-alto';pColor='#f57f17';}
    else{perfil='Bajo rendimiento general';pColor='#c62828';}
    if(!segmentos[perfil]) segmentos[perfil]={color:pColor,dists:[]};
    segmentos[perfil].dists.push({name:a.distribuidor,score:((a.scores||{}).total||0)*100});
  });

  h+=`<div class="an-card">
    <div class="an-card-hd">🗂 Segmentación por Perfil</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">
    ${Object.entries(segmentos).sort((a,b)=>b[1].dists.length-a[1].dists.length).map(([perfil,seg])=>`
      <div style="border:2px solid ${seg.color}30;border-radius:8px;overflow:hidden">
        <div style="background:${seg.color};color:#fff;padding:7px 12px;font-size:11px;font-weight:800">${perfil}
          <span style="opacity:.7;font-weight:400"> · ${seg.dists.length} distribuidor${seg.dists.length!==1?'es':''}</span>
        </div>
        <div style="padding:8px 10px;display:flex;flex-wrap:wrap;gap:4px">
          ${seg.dists.sort((a,b)=>b.score-a.score).map(d=>`
            <div style="background:#fff;border:1px solid ${seg.color}40;border-radius:5px;padding:3px 9px;font-size:11px">
              <span style="font-weight:700">${d.name}</span>
              <span style="color:${seg.color};font-size:10px;margin-left:4px">${d.score.toFixed(0)}%</span>
            </div>`).join('')}
        </div>
      </div>`).join('')}
    </div>
  </div>`;

  // ─────────────────────────────────────────
  // 3. PLAN DE ACCIÓN — tarjetas por distribuidor
  // ─────────────────────────────────────────
  const planData=data.map(a=>{
    const ans=a.answers||{};
    const bplList=[];
    sheets.forEach(sh=>{
      const shQ=Q.filter(q=>q.sheet===sh);
      const bplNums=[...new Set(shQ.map(q=>q.bpl_num))];
      bplNums.forEach(bk=>{
        const bkQ=shQ.filter(q=>q.bpl_num===bk);
        const ok=bkQ.filter(q=>ans[q.comp_num]==='si').length;
        const tot=bkQ.filter(q=>ans[q.comp_num]).length;
        if(!tot) return;
        const pct=ok/tot;
        const impact=(1-pct)*(AW[sh]||0.25);
        bplList.push({sh,bk,name:(bkQ[0]||{}).bpl_name||'?',pct,impact,color:AC[sh]||'#607d8b'});
      });
    });
    bplList.sort((a,b)=>b.impact-a.impact);
    return {...a,top3:bplList.slice(0,3),total:((a.scores||{}).total||0)};
  }).sort((a,b)=>a.total-b.total); // worst first

  h+=`<div class="an-card">
    <div class="an-card-hd">🎯 Plan de Acción — Top 3 BPLs a Trabajar por Distribuidor
      <span style="font-size:10px;font-weight:400;color:var(--g400);margin-left:6px">ordenado de peor a mejor</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
    ${planData.map(a=>{
      const col=semColor(a.total);
      return `<div style="border:1px solid var(--g200);border-radius:8px;overflow:hidden">
        <div style="background:var(--g50);padding:8px 14px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--g200)">
          <div style="font-size:13px;font-weight:800;flex:1">${a.distribuidor}</div>
          ${catBadge(recomputeCategory(a))}
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:900;color:${col}">${(a.total*100).toFixed(1)}%</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0">
        ${a.top3.length?a.top3.map((b,i)=>`
          <div style="padding:10px 12px;border-right:${i<2?'1px solid var(--g100)':'none'}">
            <div style="font-size:10px;font-weight:800;color:var(--g400);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Prioridad ${i+1}</div>
            <div style="display:flex;align-items:center;gap:5px;margin-bottom:3px">
              <span style="background:${b.color};color:#fff;border-radius:3px;padding:1px 6px;font-size:9px;font-weight:800">${b.sh}</span>
              <span style="font-size:11px;font-weight:700;color:var(--g700)">${b.name.length>22?b.name.slice(0,22)+'…':b.name}</span>
            </div>
            <div style="background:var(--g100);border-radius:5px;height:6px;margin:5px 0;overflow:hidden">
              <div style="height:100%;width:${(b.pct*100).toFixed(0)}%;background:${semColor(b.pct)};border-radius:5px"></div>
            </div>
            <div style="font-size:10px;color:var(--g500)">
              Actual: <strong style="color:${semColor(b.pct)}">${(b.pct*100).toFixed(0)}%</strong>
              · Impacto: <strong>${(b.impact*100).toFixed(0)}pts</strong>
            </div>
          </div>`).join('')
          :'<div style="grid-column:1/-1;padding:12px;color:var(--g400);font-size:12px;text-align:center">Sin datos suficientes</div>'}
        </div>
      </div>`;
    }).join('')}
    </div>
  </div>`;

  out.innerHTML=h;
}


// ══════════════════════════════════════════════════════
// HISTORY PANEL — auditoría anterior componente x componente
// ══════════════════════════════════════════════════════

function openHist(){
  const dist = document.getElementById('sel-dist').value;
  if(!dist) return;

  // Populate edition selector with all saved editions for this dist
  const audits = saved.filter(a=>a.distribuidor===dist)
    .sort((a,b)=>(b.edicion||'').localeCompare(a.edicion||''));
  
  const selEd = document.getElementById('hist-sel-ed');
  const curEd = document.getElementById('sel-edicion').value;
  selEd.innerHTML = audits.map(a=>
    `<option value="${a.edicion||''}" ${(a.edicion||'')===curEd?'':''}>${a.edicion||'Sin edición'} · ${a.fecha||''}</option>`
  ).join('');

  // Default: select the most recent edition that is NOT the current one
  const otherEd = audits.find(a=>(a.edicion||'')!==(curEd||''));
  if(otherEd) selEd.value = otherEd.edicion||'';

  document.getElementById('hist-dist-name').textContent = dist;
  document.getElementById('hist-panel').classList.add('open');
  document.getElementById('hist-overlay').classList.add('open');
  renderHistPanel();
}

function closeHist(){
  document.getElementById('hist-panel').classList.remove('open');
  document.getElementById('hist-overlay').classList.remove('open');
}

function renderHistPanel(){
  const dist = document.getElementById('sel-dist').value;
  const ed   = document.getElementById('hist-sel-ed').value;
  const body = document.getElementById('hist-body');
  const sumEl= document.getElementById('hist-summary');
  const onlyDiff = document.getElementById('hist-only-diff').checked;
  const onlyNo   = document.getElementById('hist-only-no').checked;
  const onlyCrit = document.getElementById('hist-only-crit').checked;

  if(!dist||!ed){
    body.innerHTML='<div style="padding:40px;text-align:center;color:var(--g400)">Seleccioná una edición.</div>';
    return;
  }

  // Get historical audit
  const histAudit = saved.find(a=>a.distribuidor===dist&&(a.edicion||'')===ed);
  if(!histAudit){
    body.innerHTML='<div style="padding:40px;text-align:center;color:var(--g400)">No se encontró la auditoría.</div>';
    return;
  }

  const histAns = histAudit.answers||{};
  const curAns  = ans; // current form answers
  const sheets  = SHEETS();

  // Update subtitle
  const sc = histAudit.scores||{};
  document.getElementById('hist-edition-label').textContent =
    'Ed. '+ ed +' · '+ (sc.category||'—') +' · '+ (((sc.total||0)*100).toFixed(1)) +'%';

  // Summary stats
  let totalQ=0, diffQ=0, improvedQ=0, worsenedQ=0;

  // Respond label helpers
  const respLabel = r => r==='si'?'SI':r==='no'?'NO':r==='na'?'N/A':'—';
  const respClass = r => r==='si'?'hist-resp-si':r==='no'?'hist-resp-no':'hist-resp-na';
  const respVal   = r => r==='si'?1:r==='no'?0:null;

  let html='';

  sheets.forEach(sh=>{
    const shQ = Q.filter(q=>q.sheet===sh);
    if(!shQ.length) return;

    const color = AC[sh]||'#607d8b';
    const aScore = (sc.areas&&sc.areas[sh])||0;

    // Check if area has any visible questions after filters
    const bplNums = [...new Set(shQ.map(q=>q.bpl_num))];
    let areaHtml='', areaHasQ=false;

    bplNums.forEach(bk=>{
      const bkQ = shQ.filter(q=>q.bpl_num===bk);
      const bplName = (bkQ[0]||{}).bpl_name||'';
      const subattrs = [...new Set(bkQ.map(q=>q.subattr||''))];
      let bplHtml='', bplHasQ=false;

      subattrs.forEach(sa=>{
        const saQ = bkQ.filter(q=>(q.subattr||'')===sa);
        let saHtml='', saHasQ=false;

        saQ.forEach(q=>{
          totalQ++;
          const hResp = histAns[q.comp_num]||null;
          const cResp = curAns[q.comp_num]||null;
          const hVal  = respVal(hResp);
          const cVal  = respVal(cResp);

          // Delta
          let delta='', deltaClass='hist-delta-eq';
          if(hVal!==null && cVal!==null && hVal!==cVal){
            diffQ++;
            if(cVal>hVal){ delta='🔺'; deltaClass='hist-delta-up'; improvedQ++; }
            else          { delta='🔻'; deltaClass='hist-delta-dn'; worsenedQ++; }
          } else if(hVal!==null && cVal!==null){
            delta='◾';
          } else {
            delta='·';
          }

          // Apply filters
          if(onlyDiff && delta!=='🔺' && delta!=='🔻') return;
          if(onlyNo   && hResp!=='no') return;
          if(onlyCrit && !q.critico) return;

          saHasQ=true; bplHasQ=true; areaHasQ=true;

          const critBadge = q.critico
            ? `<span style="color:var(--red);font-size:9px;font-weight:800;margin-right:3px">${q.critico}</span>`
            : '';

          saHtml+=`<div class="hist-q-row">
            <div class="hist-q-num">${q.comp_num}</div>
            <div class="hist-q-text">${critBadge}${q.question}</div>
            <div class="hist-q-resp ${respClass(hResp)}">${respLabel(hResp)}</div>
            <div class="hist-q-delta ${deltaClass}" title="Actual: ${respLabel(cResp)}">${delta}</div>
          </div>`;
        });

        if(saHasQ){
          bplHtml+=`<div class="hist-bpl-hd">
            <span>${sa||bplName}</span>
            <span style="font-weight:400;text-transform:none;letter-spacing:0">${bk}. ${bplName}</span>
          </div>${saHtml}`;
        }
      });

      if(bplHasQ) areaHtml+=bplHtml;
    });

    if(areaHasQ){
      const barW = (aScore*100).toFixed(0);
      const barCol = aScore>=0.85?'#2e7d32':aScore>=0.70?'#00695c':aScore>=0.50?'#e65100':'#c62828';
      html+=`<div class="hist-area-hd" style="background:${color}15;border-left:4px solid ${color}">
        <span style="color:${color};font-size:15px">${sh}</span>
        <span style="color:${color};font-size:11px;font-weight:600">${AN[sh]||''}</span>
        <div style="flex:1;margin:0 10px;background:var(--g100);border-radius:4px;height:8px;overflow:hidden">
          <div style="height:100%;width:${barW}%;background:${barCol};border-radius:4px;transition:width .5s"></div>
        </div>
        <span style="font-size:13px;font-weight:900;color:${barCol}">${barW}%</span>
      </div>${areaHtml}`;
    }
  });

  if(!html){
    html='<div style="padding:40px;text-align:center;color:var(--g400)">No hay preguntas que mostrar con los filtros aplicados.</div>';
  }

  // Summary bar at top of toolbar
  sumEl.innerHTML = `<span style="color:#2e7d32;font-weight:700">${improvedQ} mejoraron</span> · 
    <span style="color:#c62828;font-weight:700">${worsenedQ} empeoraron</span> · 
    <span style="color:var(--g500)">${totalQ} total</span>`;

  body.innerHTML=html;
}

// ── INIT ──
// 1. Load embedded snapshot data if present (snapshot mode)
// Otherwise start clean (template mode)
(function(){
  const snapEl = document.getElementById('__snap_embed__');
  const snapText = snapEl ? snapEl.textContent.trim() : '';
  if(snapText && snapText !== '/* __SNAP_PLACEHOLDER__ */'){
    try{
      const d = JSON.parse(snapText);
      if(d.saved)   saved.push(...d.saved);
      if(d.cfg)     Object.assign(cfg, d.cfg);
      if(d.distributors && d.distributors.length){
        DISTRIBUTORS.length=0;
        d.distributors.forEach(x=>{ if(!DISTRIBUTORS.includes(x)) DISTRIBUTORS.push(x); });
        cfg.dists=[...DISTRIBUTORS];
      }
      if(d.aw)    Object.assign(AW, d.aw);
      if(d.wcfg)  WCfg = d.wcfg;
      // FIX: restaurar matrixCfg
      if(d.matrixCfg) try{ MATRIX_CFG = d.matrixCfg; }catch(e){}
      if(d.qCustom) try{
        Q = JSON.parse(d.qCustom);
        // FIX CRÍTICO: reconstruir CRIT_LIST desde qCustom
        // CRIT_LIST se construyó desde Q_BASE que puede tener críticos diferentes
        var _crit={};
        Q.forEach(function(q){ if(q.critico){ if(!_crit[q.critico]) _crit[q.critico]={tag:q.critico,bpl_name:q.bpl_name,subattr:q.subattr||q.bpl_name,sheet:q.sheet,qs:[]}; _crit[q.critico].qs.push(q.comp_num); }});
        CRIT_LIST.length=0;
        Object.values(_crit).sort(function(a,b){return +a.tag.replace(/\D/g,'')-+b.tag.replace(/\D/g,'');}).forEach(function(c){CRIT_LIST.push(c);});
      }catch(e){}
      if(d.areasCfg) try{ const ac=JSON.parse(d.areasCfg); if(ac.ac&&ac.an){Object.assign(AC,ac.ac);Object.assign(AN,ac.an);} }catch(e){}
      // Banner de solo lectura en Chrome
      if(__IS_SNAPSHOT_BROWSER){
        window.addEventListener('DOMContentLoaded', function(){
          var b=document.createElement('div');
          b.style.cssText='position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:#1565c0;color:#fff;border-radius:8px;padding:8px 18px;font-size:12px;font-weight:600;font-family:Barlow,sans-serif;z-index:9999;box-shadow:0 2px 12px #0005;display:flex;align-items:center;gap:10px;white-space:nowrap';
          b.innerHTML='<span>📋 Snapshot de solo lectura</span><span style="opacity:.7;font-weight:400">Datos oficiales · No se pueden editar</span><button onclick="this.parentElement.remove()" style="background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:11px">✕</button>';
          document.body.appendChild(b);
        });
      }
    }catch(e){ console.warn('Snapshot load error:', e); }
  } else {
    // Template mode (Electron): load structure for current país/año, fallback to legacy keys
    const _startPais=cfg.pais||'XX', _startAnio=cfg.anio||'0000';
    if(!loadStructure(_startPais,_startAnio)){
      // No per-país structure yet — migrate from legacy keys
      loadAreasCfg();
      loadQCustom();
      console.log('[RA2] startup: no per-país structure, loaded from legacy keys');
    }
    console.log('[RA2] startup: AC keys =',Object.keys(AC).join(','),' pais='+_startPais+' anio='+_startAnio);
  }
})();
// 2. Build dynamic UI FIRST (sidebar nav, dashboard bars, config weight rows)
//    so that loadCfg() finds the inputs it needs
rebuildDynamicUI();
// 3. Set date/year defaults
document.getElementById('sel-fecha').value=new Date().toISOString().slice(0,10);
const _anioInit=(cfg.anio||'').toString();
document.getElementById('sel-edicion').value=_anioInit;
const glEd=document.getElementById('gl-edicion'); if(glEd) glEd.value=_anioInit;
// 4. Clear any DOM content captured by outerHTML snapshot, then rebuild clean
['form-sections','crit-grid','sb-area-nav','db-area-bars',
 'cfg-area-weight-rows','an-m1-out','an-m2-out','an-m3-out','an-m4-out'].forEach(id=>{
  const el=document.getElementById(id); if(el) el.innerHTML='';
});
buildForm();
buildCritGrid();
loadCfg();
loadPaisAnio();
// 5. Init editor and rebuild all dynamic UI after loadCfg set AW correctly
edInitAreas();
rebuildDynamicUI(); // Rebuilds sidebar, dashboard bars (dbf-total), cfg weight rows
setTimeout(function(){
  document.querySelectorAll('.area-body').forEach(function(el){el.style.display='none';});
  document.querySelectorAll('.area-chev').forEach(function(el){el.classList.remove('open');});
  document.querySelectorAll('[id^="bplc-"]').forEach(function(el){el.style.display='none';});
  document.querySelectorAll('.bpl-chev').forEach(function(el){el.classList.remove('open');});
},80);



renderSaved();
renderBplWeights();
updateAudCnt();
renderCritMatrix();

// ── Electron desktop integration ──────────────────────
if(window.electronAPI){
  // Ctrl+S from menu → export snapshot
  window.electronAPI.onTriggerSnapshot(()=>exportSnapshot());
  // Ctrl+E from menu → export excel
  window.electronAPI.onTriggerExcel(()=>exportExcelFull());
  // File → Merge Snapshot
  window.electronAPI.onMergeSnapshot(filePath=>mergeSnapshotFromFile(filePath));
  // File → Open Snapshot
  window.electronAPI.onOpenSnapshot(filePath=>{
    window.electronAPI.readFile(filePath).then(res=>{
      if(!res.success){ showToast('❌ No se pudo leer el archivo'); return; }
      // Extract JSON from the snap_embed script tag in the opened file
      const parser=new DOMParser();
      const doc=parser.parseFromString(res.content,'text/html');
      const snapEl=doc.getElementById('__snap_embed__');
      if(!snapEl){ showToast('❌ No es un snapshot válido de RED Activa'); return; }
      try{
        const d=JSON.parse(snapEl.textContent);
        // Warn before replacing existing saved audits
        if(saved.length>0 && !confirm('¿Cargar este snapshot?\n\nSe reemplazarán los datos actuales ('+(saved.length)+' auditorías guardadas).\nUsá "Fusionar Edición" (Ctrl+M) para agregar sin borrar.')) return;
        // REPLACE everything — clear current state first
        saved.length=0;
        DISTRIBUTORS.length=0;
        // Reset form state
        ans={}; coms={}; _loadedFrozenAudit=null; _loadedAuditMatrix=null;
        // Reset Q and areas to defaults before loading (replace, not merge)
        Q=[...Q_BASE.map(q=>({...q}))];
        Object.keys(AC).forEach(k=>delete AC[k]);
        Object.assign(AC,{IFT:'#1565c0',PLG:'#6a1b9a',GST:'#e65100',IDP:'#1b5e20'});
        Object.keys(AN).forEach(k=>delete AN[k]);
        Object.assign(AN,{IFT:'Infraestructura',PLG:'Procesos Logísticos',GST:'Gestión',IDP:'Integridad del Producto'});
        Object.keys(AW).forEach(k=>delete AW[k]);
        Object.assign(AW,{...AW_DEFAULT});
        // Load snapshot data
        if(d.saved) saved.push(...d.saved);
        if(d.cfg) Object.assign(cfg,d.cfg);
        if(d.distributors&&d.distributors.length) d.distributors.forEach(x=>DISTRIBUTORS.push(x));
        if(d.aw) Object.assign(AW,d.aw);
        if(d.qCustom) try{Q=JSON.parse(d.qCustom);}catch(e){}
        if(d.areasCfg) try{const ac=JSON.parse(d.areasCfg);if(ac.ac&&ac.an){Object.keys(AC).forEach(k=>delete AC[k]);Object.assign(AC,ac.ac);Object.keys(AN).forEach(k=>delete AN[k]);Object.assign(AN,ac.an);}}catch(e){}
        if(d.matrixCfg) try{MATRIX_CFG=d.matrixCfg; saveMatrixCfg(MATRIX_CFG);}catch(e){}
        // Sync cfg.aw with current AW (after all area data is loaded)
        cfg.aw={...AW};
        // Clear DOM and rebuild clean
        ['form-sections','crit-grid','sb-area-nav','db-area-bars','cfg-area-weight-rows'].forEach(id=>{
          const el=document.getElementById(id); if(el) el.innerHTML='';
        });
        // Persist structure under this snapshot's país/año key
        saveStructure();
        persist();
        // Rebuild UI — keep renderSaved outside try so panel always updates
        try{ rebuildAll(); }catch(rebuildErr){ console.error('[RA2] rebuildAll error after snapshot load:',rebuildErr); }
        rebuildDynamicUI();
        rebuildDistSelect();
        renderSaved(); updateAudCnt();
        loadPaisAnio();
        showToast('✅ Snapshot cargado: '+(d.saved||[]).length+' auditorías · '+(cfg.pais||'')+" "+( cfg.anio||''));
      }catch(e){ console.error('[RA2] onOpenSnapshot error:',e); showToast('❌ Error al leer snapshot: '+e.message); }
    });
  });
  // Show platform in title
  document.title='RED Activa 2.0 · BAP Partners';
}


// ═══════════════════════════════════════════════════════
// COMPARE MODULE
// Terminology:
//   bpl_name (field) = Atributo en la UI  (ej: EMPLAZAMIENTO)
//   subattr  (field) = BPL en la UI       (ej: ENTORNO - ACCESO)
// ═══════════════════════════════════════════════════════

function initCompare() {
  if (!saved.length) {
    document.getElementById('cmp-nodata-msg').style.display = '';
    document.getElementById('compare-output').innerHTML =
      '<div style="padding:30px;text-align:center;color:var(--g400);font-size:13px">'+
      '⚠️ No hay auditorías guardadas.<br>Importá tu JSON desde la solapa <strong>Cfg</strong> para ver comparativas.</div>';
    return;
  }
  document.getElementById('cmp-nodata-msg').style.display = 'none';

  // Populate distributor selector
  const sel = document.getElementById('cmp-dist');
  const dists = [...new Set(saved.map(a=>a.distribuidor))].sort();
  const curVal = sel.value;
  sel.innerHTML = '<option value="">— Seleccionar —</option>' +
    dists.map(d=>`<option value="${d}"${d===curVal?' selected':''}>${d}</option>`).join('');

  onCmpModeChange();
}

function onCmpModeChange() {
  const mode = document.getElementById('cmp-mode').value;
  const distFg = document.getElementById('cmp-dist-fg');
  distFg.style.display = (mode === 'distributor') ? '' : 'none';
  renderCompare();
}

function renderCompare() {
  const mode = document.getElementById('cmp-mode').value;
  if (mode === 'editions') renderCompareEditionsFull();
  else renderCompareDistributor();
}

// ── MODE 1: Global comparison between editions ──────────
function renderCompareEditions() {
  const wrap = document.getElementById('compare-output');
  const editions = [...new Set(saved.map(a=>a.edicion).filter(Boolean))].sort();
  const catCols = {PROACTIVO:'#2e7d32',ACTIVO:'#00695c',REACTIVO:'#e65100',INACTIVO:'#c62828'};
  const edCols = ['#1565c0','#6a1b9a','#00695c','#e65100','#c62828','#1b5e20'];

  if (!editions.length) {
    wrap.innerHTML = '<div style="padding:40px;text-align:center;color:var(--g400);font-size:13px">⚠️ No hay auditorías. Importá tu JSON desde Configuración.</div>';
    return;
  }

  // Build per-edition summary data
  const edData = editions.map((ed,i) => {
    const data = saved.filter(a=>a.edicion===ed);
    const avg = data.length ? data.reduce((s,a)=>s+((a.scores||{}).total||0)*100,0)/data.length : 0;
    const cats = {PROACTIVO:0,ACTIVO:0,REACTIVO:0,INACTIVO:0};
    data.forEach(a=>{ const c=recomputeCategory(a); if(c&&cats[c]!==undefined) cats[c]++; });
    const areas = Object.fromEntries(SHEETS().map(sh=>[sh,0]));
    data.forEach(a=>{ SHEETS().forEach(sh=>{ areas[sh]+=((a.scores||{}).areas[sh]||0)*100/Math.max(1,data.length); }); });
    return {ed, data, avg, cats, areas, col: edCols[i%edCols.length]};
  });

  let html = '';

  // ── Card 1: Score promedio por edición ──
  html += `<div class="cmp-edition-block">
    <div class="cmp-edition-title">📊 Evolución del Puntaje Promedio por Edición</div>
    <div style="display:flex;align-items:flex-end;gap:12px;padding:10px 0;min-height:120px">`;
  const maxAvg = Math.max(...edData.map(d=>d.avg), 1);
  edData.forEach(({ed,avg,col,data})=>{
    const barH = Math.max(12, (avg/100)*100);
    const col2 = scoreColor(avg/100);
    html += `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;min-width:60px">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:900;color:${col2}">${avg.toFixed(1)}%</div>
      <div style="width:100%;background:${col2};border-radius:6px 6px 0 0;height:${barH}px;min-height:12px;max-height:100px;opacity:.85"></div>
      <div style="background:${col};color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:800;padding:2px 8px;border-radius:8px">${ed}</div>
      <div style="font-size:10px;color:var(--g500)">${data.length} distrib.</div>
    </div>`;
  });
  html += `</div></div>`;

  // ── Card 2: Distribución por categoría por edición ──
  html += `<div class="cmp-edition-block">
    <div class="cmp-edition-title">🏷️ Distribución por Categoría por Edición</div>
    <div style="overflow-x:auto"><table class="tbl" style="font-size:12px"><thead><tr>
      <th>Edición</th><th>N</th>
      <th style="color:#2e7d32">PROACTIVO</th>
      <th style="color:#00695c">ACTIVO</th>
      <th style="color:#e65100">REACTIVO</th>
      <th style="color:#c62828">INACTIVO</th>
      <th>Distribución visual</th>
    </tr></thead><tbody>`;
  edData.forEach(({ed,cats,data,col})=>{
    const n=data.length||1;
    html+=`<tr>
      <td><span class="cmp-edition-badge" style="background:${col}">${ed}</span></td>
      <td style="text-align:center;font-weight:700">${data.length}</td>
      <td style="text-align:center;color:#2e7d32;font-weight:700">${cats.PROACTIVO}</td>
      <td style="text-align:center;color:#00695c;font-weight:700">${cats.ACTIVO}</td>
      <td style="text-align:center;color:#e65100;font-weight:700">${cats.REACTIVO}</td>
      <td style="text-align:center;color:#c62828;font-weight:700">${cats.INACTIVO}</td>
      <td><div style="display:flex;height:14px;border-radius:6px;overflow:hidden;min-width:120px">
        ${['PROACTIVO','ACTIVO','REACTIVO','INACTIVO'].map(k=>{
          const w=(cats[k]/n*100).toFixed(0);
          return w>0?`<div style="width:${w}%;background:${catCols[k]};transition:width .4s" title="${k}: ${cats[k]}"></div>`:'';
        }).join('')}
      </div></td>
    </tr>`;
  });
  html += `</tbody></table></div></div>`;

  // ── Card 3: Área promedio por edición ──
  html += `<div class="cmp-edition-block">
    <div class="cmp-edition-title">📐 Promedio por Área de Interés por Edición</div>
    <div style="overflow-x:auto"><table class="tbl" style="font-size:12px"><thead><tr>
      <th>Área</th>
      ${edData.map(({ed,col})=>`<th style="text-align:center"><span class="cmp-edition-badge" style="background:${col}">${ed}</span></th>`).join('')}
    </tr></thead><tbody>`;
  SHEETS().forEach(sh=>{
    html+=`<tr>
      <td><strong style="color:${AC[sh]}">${sh}</strong> <span style="font-size:10px;color:var(--g400)">${AN[sh]}</span></td>
      ${edData.map(({areas})=>{
        const v=areas[sh]; const c=scoreColor(v/100);
        return `<td style="text-align:center;font-weight:800;color:${c}">${v.toFixed(1)}%</td>`;
      }).join('')}
    </tr>`;
  });
  html += `</tbody></table></div></div>`;

  // ── Card 4: Evolución por distribuidor (table with category per edition) ──
  if (editions.length > 0) {
    const allDists = [...new Set(saved.map(a=>a.distribuidor))].sort();
    html += `<div class="cmp-edition-block">
      <div class="cmp-edition-title">👥 Evolución por Distribuidor</div>
      <div style="overflow-x:auto"><table class="tbl" style="font-size:11px"><thead><tr>
        <th>Distribuidor</th>
        ${edData.map(({ed,col})=>`<th colspan="2" style="text-align:center;background:${col}22;color:${col};font-weight:800">${ed}</th>`).join('')}
        <th style="text-align:center">Δ Total</th>
      </tr><tr>
        <th></th>
        ${edData.map(()=>'<th style="text-align:center;font-size:9px;color:var(--g400)">Score</th><th style="text-align:center;font-size:9px;color:var(--g400)">Cat.</th>').join('')}
        <th></th>
      </tr></thead><tbody>`;

    allDists.forEach(dist=>{
      const rows = editions.map(ed=>{
        const a=saved.find(x=>x.distribuidor===dist&&x.edicion===ed);
        return a ? {v:((a.scores||{}).total||0)*100, cat:recomputeCategory(a)} : null;
      });
      if(rows.every(r=>r===null)) return;
      const vals = rows.filter(r=>r!==null).map(r=>r.v);
      const trend = vals.length>=2 ? vals[vals.length-1]-vals[0] : null;

      html += `<tr>
        <td style="font-weight:600;font-size:11px">${dist}</td>
        ${rows.map(r=>r===null
          ? `<td colspan="2" style="text-align:center;color:var(--g300);font-size:10px">—</td>`
          : `<td style="text-align:center;font-weight:800;color:${scoreColor(r.v/100)};font-size:12px">${r.v.toFixed(1)}%</td>
             <td style="text-align:center">${catBadge(r.cat)}</td>`
        ).join('')}
        <td style="text-align:center;font-weight:800;color:${trend===null?'var(--g400)':trend>=0?'#2e7d32':'#c62828'}">
          ${trend===null?'—':(trend>=0?'▲':'▼')+' '+Math.abs(trend).toFixed(1)}
        </td>
      </tr>`;
    });

    html += '</tbody></table></div></div>';
  }

  wrap.innerHTML = html;
}

// ── MODE 2: Analysis by distributor ──────────────────────
function renderCompareDistributor() {
  const wrap = document.getElementById('compare-output');
  const dist = document.getElementById('cmp-dist').value;

  if (!dist) {
    wrap.innerHTML = '<p style="font-size:12px;color:var(--g400)">Seleccioná un distribuidor para ver su análisis comparativo.</p>';
    return;
  }

  const audits = saved.filter(a=>a.distribuidor===dist).sort((a,b)=>(a.edicion||'').localeCompare(b.edicion||''));
  if (!audits.length) {
    wrap.innerHTML = '<p style="font-size:12px;color:var(--g400)">No hay auditorías para este distribuidor.</p>';
    return;
  }

  const editions = audits.map(a=>a.edicion||'?');
  const edColors = ['#1565c0','#6a1b9a','#00695c','#e65100','#c62828','#1b5e20'];

  // Overall scores bar
  let html = `<div class="cmp-dist-block">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:900;color:#0a1628;margin-bottom:12px">${dist}</div>
    <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--g400);margin-bottom:8px">Resultado total por edición</div>
    ${audits.map((a,i)=>{
      const pct=((a.scores&&a.scores.total||0)*100);
      const col=scoreColor(a.scores&&a.scores.total);
      return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span class="cmp-edition-badge" style="background:${edColors[i%edColors.length]}">${editions[i]}</span>
        <div style="flex:1;height:12px;background:#f5f5f5;border-radius:8px;overflow:hidden">
          <div style="width:${pct.toFixed(0)}%;height:100%;background:${col};border-radius:8px"></div>
        </div>
        <span style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:900;color:${col};min-width:44px">${pct.toFixed(1)}%</span>
        ${catBadge(a.scores&&recomputeCategory(a))}
      </div>`;
    }).join('')}
  </div>`;

  // Per-area breakdown - grouped by Atributo (bpl_name), clean design
  html += `<div class="cmp-dist-block">
    <div class="cmp-edition-title" style="margin-bottom:10px">📐 Score por Área y Atributo</div>`;

  SHEETS().forEach(sh => {
    const shQs = Q.filter(q=>q.sheet===sh);
    // Unique Atributos (bpl_name) with their bpl_num
    const attrMap = {};
    shQs.forEach(q=>{ if(!attrMap[q.bpl_num]) attrMap[q.bpl_num]={name:q.bpl_name,weight:q.bpl_weight}; });

    html += `<div style="margin-bottom:14px">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:800;text-transform:uppercase;
        letter-spacing:.8px;padding:4px 10px;background:${AC[sh]};color:#fff;border-radius:5px;margin-bottom:8px;
        display:flex;justify-content:space-between;align-items:center">
        <span>${sh} · ${AN[sh]}</span>
        <div style="display:flex;gap:6px">
          ${audits.map((a,i)=>{
            const v=(a.scores||{}).areas[sh];
            return `<span style="font-size:11px;opacity:.9">${editions[i]}: ${v!=null?(v*100).toFixed(1)+'%':'—'}</span>`;
          }).join('<span style="opacity:.4">|</span>')}
        </div>
      </div>`;

    Object.entries(attrMap).forEach(([bk,attr])=>{
      html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;padding:4px 6px;border-radius:4px;background:#fafafa">
        <div style="min-width:130px;font-size:11px;font-weight:600;color:var(--g700)">${attr.name}</div>`;
      audits.forEach((a,i)=>{
        const bv=((a.scores||{}).bpls||{})[sh+'_'+bk];
        const sc=bv?bv.score:0;
        const pct=sc*100;
        const col=scoreColor(sc);
        html+=`<div style="flex:1;display:flex;align-items:center;gap:4px">
          <span style="font-size:9px;font-weight:700;color:${edColors[i%edColors.length]};min-width:30px">${editions[i]}</span>
          <div style="flex:1;height:8px;background:#eeeeee;border-radius:4px;overflow:hidden">
            <div style="width:${pct.toFixed(0)}%;height:100%;background:${col};border-radius:4px"></div>
          </div>
          <span style="font-size:10px;font-weight:800;color:${col};min-width:36px;text-align:right">${pct.toFixed(0)}%</span>
        </div>`;
      });
      html+=`</div>`;
    });

    html+=`</div>`;
  });

  html += `</div>`;
  wrap.innerHTML = html;
}

// ── PRINT CURRENT TAB ──
function printCurrentTab(){
  const activePanel = document.querySelector('.panel.on');
  if(!activePanel){ window.print(); return; }
  const panelId = activePanel.id;

  // Expand ALL collapsed BPL sections in Results before printing
  if(panelId === 'panel-dash'){
    document.querySelectorAll('.bpl-attr-rows').forEach(el=>{
      el._wasHidden = el.style.display === 'none';
      el.style.display = 'block';
    });
    document.querySelectorAll('.bpl-area-block').forEach(el=>{
      el._wasHidden = el.style.display === 'none';
      el.style.display = 'block';
    });
  }

  document.body.setAttribute('data-print', panelId);
  window.print();
  document.body.removeAttribute('data-print');

  // Restore collapsed state
  document.querySelectorAll('.bpl-attr-rows').forEach(el=>{
    if(el._wasHidden) el.style.display = 'none';
  });
  document.querySelectorAll('.bpl-area-block').forEach(el=>{
    if(el._wasHidden) el.style.display = 'none';
  });
}

function renderAEList(){
  const el=document.getElementById('ae-list'); if(!el) return;
  if(!autoevals.length){ el.innerHTML='<span style="color:var(--g400)">Sin autoevaluaciones importadas.</span>'; return; }
  const byEd={};
  autoevals.forEach(ae=>{
    const k=ae.edicion||'—';
    if(!byEd[k]) byEd[k]=[];
    byEd[k].push(ae);
  });
  el.innerHTML=Object.entries(byEd).sort((a,b)=>b[0].localeCompare(a[0])).map(([ed,list])=>`
    <div style="margin-bottom:4px">
      <span style="font-weight:700;color:var(--g700)">Edición ${ed}</span>
      <span style="color:var(--g400);font-size:10px;margin-left:4px">(${list.length} registros)</span>
      <button onclick="clearAEByEd('${ed}')" style="font-size:9px;padding:1px 5px;border:1px solid #ef9a9a;background:#fff;color:#c62828;border-radius:4px;cursor:pointer;margin-left:6px">✕</button>
      <div style="padding-left:10px;font-size:10px;color:var(--g500)">${list.map(ae=>ae.distribuidor).join(' · ')}</div>
    </div>`).join('');
}
function clearAllAE(){
  if(!confirm('¿Eliminar TODAS las autoevaluaciones importadas?')) return;
  autoevals=[]; persist(); updateAudCnt(); renderAEList();
  showToast('🗑 Autoevaluaciones eliminadas');
}
function clearAEByEd(ed){
  if(!confirm(`¿Eliminar todas las autoevaluaciones de la edición ${ed}?`)) return;
  autoevals=autoevals.filter(a=>a.edicion!==ed);
  persist(); updateAudCnt(); renderAEList();
  showToast(`🗑 AE edición ${ed} eliminadas`);
}

function renderSaved(){
  const wrap=document.getElementById('saved-wrap');
  if(!wrap) return;
  renderAEList();
  // Update count badges
  const cntEl=document.getElementById('aud-cnt');
  if(cntEl) cntEl.textContent=saved.length;
  const cntBadge=document.getElementById('aud-cnt-badge');
  if(cntBadge) cntBadge.textContent=saved.length;
  const _sh=SHEETS();
  if(!saved.length){
    wrap.innerHTML='<tr><td colspan="'+(7+_sh.length)+'" style="text-align:center;padding:24px;color:var(--g400)">No hay auditorías guardadas</td></tr>';
    return;
  }
  // Populate edition filter dropdown
  const filEl=document.getElementById('saved-fil-ed');
  if(filEl){
    const editions=[...new Set(saved.map(a=>a.edicion||'').filter(Boolean))].sort().reverse();
    const curFil=filEl.value;
    filEl.innerHTML='<option value="">Todas</option>'+editions.map(e=>`<option value="${e}">${e}</option>`).join('');
    if(curFil) filEl.value=curFil;
  }
  const edFil=filEl?filEl.value:'';
  const data=[...saved]
    .filter(a=>!edFil||a.edicion===edFil)
    .sort((a,b)=>{
      const ea=a.edicion||'',eb=b.edicion||'';
      if(ea!==eb) return eb.localeCompare(ea);
      return (a.distribuidor||'').localeCompare(b.distribuidor||'');
    });
  // Build full table inside saved-wrap
  const _nc=auditTotalCrits(data[0]||{});
  wrap.innerHTML=`<table class="saved-table" style="width:100%;border-collapse:collapse;font-size:12px">
  <thead><tr style="background:var(--navy2);color:#fff">
    <th style="padding:8px 10px;text-align:left">Edición</th>
    <th style="padding:8px 10px;text-align:left">Distribuidor</th>
    <th style="padding:8px 10px;text-align:left">Fecha</th>
    <th style="padding:8px 10px;text-align:left">Auditor</th>
    ${_sh.map(s=>`<th style="padding:8px 6px;color:${AC[s]||'#607d8b'};text-align:center">${s}</th>`).join('')}
    <th style="padding:8px 10px;text-align:center">Total</th>
    <th style="padding:8px 6px;text-align:center">Crít.</th>
    <th style="padding:8px 10px;text-align:center">Categoría</th>
    <th style="padding:8px 10px">Acciones</th>
  </tr></thead>
  <tbody>${data.map(a=>{
    const s=a.scores||{};
    const cat=recomputeCategory(a);
    const total=s.total||0;
    const col=scoreColor(total);
    const pct=(total*100).toFixed(1)+'%';
    const frozenBadge=a.frozen?'<span title="Auditoría congelada" style="font-size:10px">🔒</span>':'';
    const warnBadge=(()=>{
      if(!a.weights||!a.weights.aw) return '';
      const diff=SHEETS().some(sh=>Math.abs((a.weights.aw[sh]||0)-(AW[sh]||0))>0.001);
      return diff?'<span title="Ponderaciones distintas a las actuales" style="color:var(--orange);font-size:14px;cursor:help">⚖️</span>':'';
    })();
    return `<tr>
      <td>${a.edicion||'—'}</td>
      <td style="font-weight:700">${a.distribuidor||'—'} ${frozenBadge}</td>
      <td>${a.fecha||'—'}</td>
      <td>${a.auditor||'—'}</td>
      ${_sh.map(sh=>`<td style="color:${scoreColor(s.areas&&s.areas[sh]||0)};font-weight:700">${s.areas&&s.areas[sh]!==undefined?(s.areas[sh]*100).toFixed(1)+'%':'—'}</td>`).join('')}
      <td style="font-weight:800;color:${col}">${pct}</td>
      <td>${(()=>{const cm=s.critMet||0,tc=auditTotalCrits(a),bg=cm>=tc?'var(--green)':'var(--g200)',fc=cm>=tc?'#fff':'var(--g600)';return `<span style="background:${bg};color:${fc};border-radius:10px;padding:2px 7px;font-size:10px;font-weight:700">${cm}/${tc}</span>`;})()}</td>
      <td>${catBadge(cat)}</td>
      <td style="display:flex;gap:4px;min-width:90px">
        ${warnBadge}
        <button class="btn btn-xs btn-blue" onclick="loadAudit(${saved.findIndex(x=>x.id===a.id)})">📂</button>
        <button class="btn btn-xs btn-red" onclick="deleteAudit(${a.id})">🗑</button>
      </td>
    </tr>`;
  }).join('')}</tbody></table>`;
}

