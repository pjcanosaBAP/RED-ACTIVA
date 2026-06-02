  <button class="btn btn-sm" onclick="miniModalCancel()" style="background:var(--g100);color:var(--g600);border:none;padding:8px 18px">Cancelar</button>
      <button class="btn btn-green btn-sm" onclick="miniModalOk()" style="padding:8px 18px">Aceptar</button>
    </div>
  </div>
</div>

<!-- ── PANEL HISTÓRICO ── -->
<button id="hist-toggle" onclick="toggleHistPanel()" style="display:none"><span>📋 HISTÓRICO</span></button>

<div id="hist-panel">
  <div id="hist-panel-hd">
    <h3 id="hist-panel-title">Histórico</h3>
    <button id="hist-close" onclick="toggleHistPanel()">✕</button>
  </div>
  <div id="hist-controls">
    <div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap">
      <div class="fg" style="flex:1">
        <label style="font-size:10px;font-weight:700;color:var(--g500);text-transform:uppercase;letter-spacing:.5px">Edición a comparar</label>
        <select id="hist-sel-ed" onchange="renderHistPanel()" style="width:100%;padding:5px 8px;border:1.5px solid var(--g200);border-radius:6px;font-size:12px">
          <option value="">— Seleccioná una edición —</option>
        </select>
      </div>
      <div style="display:flex;gap:4px">
        <label style="display:flex;align-items:center;gap:4px;font-size:11px;cursor:pointer;white-space:nowrap">
          <input type="checkbox" id="hist-only-diff" onchange="renderHistPanel()" checked>
          Solo diferencias
        </label>
      </div>
    </div>
    <div id="hist-summary" style="margin-top:8px"></div>
  </div>
  <div id="hist-body">
    <div style="padding:30px;text-align:center;color:var(--g400);font-size:12px">
      Seleccioná un distribuidor y una edición para ver el histórico.
    </div>
  </div>
</div>



<div class="toast" id="toast"></div>

<script>
const Q_BASE = [{"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 1, "bpl_name": "EMPLAZAMIENTO", "bpl_weight": 0.225, "subattr": "ENTORNO Y SEGURIDAD EXTERNA", "comp_num": "1.1.1", "question": "Predios cerrados, o Zonas industriales o logísticas", "critico": null, "weight_attr": 0.15, "peso_bpl": 0.5}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 1, "bpl_name": "EMPLAZAMIENTO", "bpl_weight": 0.225, "subattr": "ENTORNO Y SEGURIDAD EXTERNA", "comp_num": "1.1.2", "question": "Zona segura, con vigilancia de fuerzas públicas o privadas", "critico": null, "weight_attr": 0.35, "peso_bpl": 0.5}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 1, "bpl_name": "EMPLAZAMIENTO", "bpl_weight": 0.225, "subattr": "ENTORNO Y SEGURIDAD EXTERNA", "comp_num": "1.1.3", "question": "Zona provista de iluminación pública o propia.", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.5}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 1, "bpl_name": "EMPLAZAMIENTO", "bpl_weight": 0.225, "subattr": "ENTORNO Y SEGURIDAD EXTERNA", "comp_num": "1.1.4", "question": "Existen cámaras de video externas pública o propia que cubran el ingreso principal o aledaños", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.5}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 1, "bpl_name": "EMPLAZAMIENTO", "bpl_weight": 0.225, "subattr": "ENTORNO - ACCESO", "comp_num": "1.2.1", "question": "Capacidad de recibir unidades de alto / Medio tonelaje, según requerimientos de ARCOR", "critico": "CRITICO 1", "weight_attr": 1.0, "peso_bpl": 0.35}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 1, "bpl_name": "EMPLAZAMIENTO", "bpl_weight": 0.225, "subattr": "PREDIO Y CIRCULACION", "comp_num": "1.3.2", "question": "Entorno sin problemas de congestionamiento de tráfico", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.15}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 1, "bpl_name": "EMPLAZAMIENTO", "bpl_weight": 0.225, "subattr": "PREDIO Y CIRCULACION", "comp_num": "1.3.3", "question": "Poseen alero o permiten el ingreso de la culata de los vehiculos para la carga/descarga en condiciones climáticas desfavorables", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.15}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 1, "bpl_name": "EMPLAZAMIENTO", "bpl_weight": 0.225, "subattr": "PREDIO Y CIRCULACION", "comp_num": "1.3.4", "question": "Fácil maniobrabilidad", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.15}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 1, "bpl_name": "EMPLAZAMIENTO", "bpl_weight": 0.225, "subattr": "PREDIO Y CIRCULACION", "comp_num": "1.3.5", "question": "Calles y accesos en buen estado, sin pendientes, consolidados o asfaltados", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.15}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "SEGURIDAD INTERNA", "comp_num": "2.1.1", "question": "Sistema de Alarmas en depósito y oficinas", "critico": null, "weight_attr": 0.6, "peso_bpl": 0.05}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "SEGURIDAD INTERNA", "comp_num": "2.1.2", "question": "Cámaras de Video en distintos sectores, con grabación y registro", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.05}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "LAY OUT - CAPACIDAD Y MODULACION", "comp_num": "2.2.1", "question": "Días hábiles promedio  6 meses de venta almacenados en la bodega (MinImo 18 dias)", "critico": "CRITICO 2", "weight_attr": 1.0, "peso_bpl": 0.5}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "TECHOS  y PAREDES: ESTADO", "comp_num": "2.3.1", "question": "Techo aislado y/o revestido,  bien conservado", "critico": null, "weight_attr": 0.35, "peso_bpl": 0.1}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "TECHOS  y PAREDES: ESTADO", "comp_num": "2.3.2", "question": "Paredes aisladas y/o revestidas, bien conservadas, que no permitan la acumulación de tierra o plagas", "critico": null, "weight_attr": 0.35, "peso_bpl": 0.1}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "TECHOS  y PAREDES: ESTADO", "comp_num": "2.3.3", "question": "Cuenta con extractores eólicos y/o ventilación forzada", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.1}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "TECHOS  y PAREDES: ESTADO", "comp_num": "2.3.4", "question": "Posee termómetro en sector Secos, (no se permiten termometros de mercurio)", "critico": null, "weight_attr": 0.1, "peso_bpl": 0.1}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "PISOS y JUNTAS: ESTADO", "comp_num": "2.4.1", "question": "Posee terminación alisada  (a llana)", "critico": null, "weight_attr": 0.15, "peso_bpl": 0.225}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "PISOS y JUNTAS: ESTADO", "comp_num": "2.4.2", "question": "Las juntas poseen relleno (compuesto elástico ) y/o protección metálica que no genere golpes al transito de apiladoras o transpaletas", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.225}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "PISOS y JUNTAS: ESTADO", "comp_num": "2.4.3", "question": "No posee desniveles entre los paños", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.225}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "PISOS y JUNTAS: ESTADO", "comp_num": "2.4.4", "question": "El piso no desprende polvillo y/o no se visualizan grietas", "critico": null, "weight_attr": 0.35, "peso_bpl": 0.225}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "ABERTURAS", "comp_num": "2.5.1", "question": "Cuenta con 2 o más portones", "critico": null, "weight_attr": 0.6, "peso_bpl": 0.05}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "ABERTURAS", "comp_num": "2.5.2", "question": "Posee ingreso de personal independiente de la carga", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.05}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "ILUMNACIÓN", "comp_num": "2.6.1", "question": "Se encuentran por encima del nivel más alto de almacenamiento ", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.05}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "ILUMNACIÓN", "comp_num": "2.6.2", "question": "Se encuentran centradas a lo largo de los pasillos", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.05}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "ILUMNACIÓN", "comp_num": "2.6.3", "question": "No se perciben sectores oscuros que afecten la operación", "critico": null, "weight_attr": 0.1, "peso_bpl": 0.05}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "ILUMNACIÓN", "comp_num": "2.6.4", "question": "Se aprovecha la luz natural para la operación diurna sin aumento considerable de la temperatura en el interior", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.05}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "DESAGUES", "comp_num": "2.7.1", "question": "Se ubican en el exterior del edificio", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.025}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 2, "bpl_name": "EDIFICACION", "bpl_weight": 0.4, "subattr": "DESAGUES", "comp_num": "2.7.2", "question": "Se  encuentran en buen estado (no se visualizan manchas de humedad), con rejillas de protección", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.025}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "EPPS Y EXTINGUIDORES", "comp_num": "3.1.1", "question": "Uso correcto de EPPS (zapatos o casco según reglamentación local vigente)", "critico": "CRITICO 3", "weight_attr": 0.4, "peso_bpl": 0.1}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "EPPS Y EXTINGUIDORES", "comp_num": "3.1.2", "question": "Extintores bien ubicados y en período de vencimiento", "critico": "CRITICO 3", "weight_attr": 0.6, "peso_bpl": 0.1}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "POP Y MOBILIARIO", "comp_num": "3.2.1", "question": "Los freezers y/o mobiliarios usados se encuentran en condiciones de higiene adecuadas", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.2}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "POP Y MOBILIARIO", "comp_num": "3.2.2", "question": "El material se encuentra inventariado el mueble pesado", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.2}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "POP Y MOBILIARIO", "comp_num": "3.2.3", "question": "El material se encuentra en un sector aislado de la mercadería", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.2}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "POP Y MOBILIARIO", "comp_num": "3.2.4", "question": "El material se encuentra identificado", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.2}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "CAMARA DE REFRIGERADOS", "comp_num": "3.3.1", "question": "Indice nivel de capacidad para productos refrigerados es menor que 1 respecto a su capacidad teorica real", "critico": "CRITICO 4", "weight_attr": 0.3, "peso_bpl": 0.225}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "CAMARA DE REFRIGERADOS", "comp_num": "3.3.2", "question": "Posee aislación térmica en paredes laterales, techo y acceso. Paredes aisladas y/o revestidas, bien conservadas, que no permitan la acumulación de tierra o plagas", "critico": "CRITICO 4", "weight_attr": 0.3, "peso_bpl": 0.225}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "CAMARA DE REFRIGERADOS", "comp_num": "3.3.3", "question": "Posee termómetro en Cámara de Refrigerados, (no se permiten termometros de mercurio)", "critico": "CRITICO 4", "weight_attr": 0.4, "peso_bpl": 0.225}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "CAMARA DE CONGELADOS", "comp_num": "3.4.1", "question": "Indice nivel de capacidad para productos congelados es menor que 1 respecto a su capacidad teorica real", "critico": "CRITICO 5", "weight_attr": 0.25, "peso_bpl": 0.225}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "CAMARA DE CONGELADOS", "comp_num": "3.4.2", "question": "Su ubicación permite carga / descarga directa desde el transporte", "critico": "CRITICO 5", "weight_attr": 0.5, "peso_bpl": 0.225}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "CAMARA DE CONGELADOS", "comp_num": "3.4.3", "question": "Posee termómetro", "critico": "CRITICO 5", "weight_attr": 0.25, "peso_bpl": 0.225}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "EQUIPAMIENTO DE MANIPULEO", "comp_num": "3.5.1", "question": "Cuenta con un equipo propio que le permite operar dentro del depósito y a su vez realizar la descarga de camiones", "critico": "CRITICO 6", "weight_attr": 0.3, "peso_bpl": 0.25}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "EQUIPAMIENTO DE MANIPULEO", "comp_num": "3.5.2", "question": "Cuenta con traspallets o \"zorritas\" ", "critico": "CRITICO 6", "weight_attr": 0.3, "peso_bpl": 0.25}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "EQUIPAMIENTO DE MANIPULEO", "comp_num": "3.5.3", "question": "Cuenta con carros para Consolidados/Pedidos", "critico": "CRITICO 6", "weight_attr": 0.1, "peso_bpl": 0.25}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 3, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.275, "subattr": "EQUIPAMIENTO DE MANIPULEO", "comp_num": "3.5.4", "question": "El equipo para operar (dentro del depósito) es electrico", "critico": "CRITICO 6", "weight_attr": 0.3, "peso_bpl": 0.25}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 4, "bpl_name": "TRANSPORTE Y REPARTO", "bpl_weight": 0.025, "subattr": "VEHICULOS", "comp_num": "4.1.1", "question": "Se guardan en sectores seguros y aislados de la mercadería", "critico": null, "weight_attr": 1.0, "peso_bpl": 1.0}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 5, "bpl_name": "INFORMACIÓN Y COMUNICACIONES", "bpl_weight": 0.075, "subattr": "INFORMÁTICA", "comp_num": "5.1.1", "question": "El personal de logística cuenta con acceso al sistema y/o con usuario propio", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.5}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 5, "bpl_name": "INFORMACIÓN Y COMUNICACIONES", "bpl_weight": 0.075, "subattr": "INFORMÁTICA", "comp_num": "5.1.2", "question": "El personal de logística cuenta con acceso a correo electrónico y/o con cuenta propia", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.5}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 5, "bpl_name": "INFORMACIÓN Y COMUNICACIONES", "bpl_weight": 0.075, "subattr": "INFORMÁTICA", "comp_num": "5.1.3", "question": "El personal de logística cuenta con equipamiento informático en su oficina", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.5}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 5, "bpl_name": "INFORMACIÓN Y COMUNICACIONES", "bpl_weight": 0.075, "subattr": "COMUNICACIONES", "comp_num": "5.2.1", "question": "El personal de logística cuenta con algún dispositivo de comunicación que permita contactarse al interior y exterior de la distribuidora", "critico": null, "weight_attr": 1.0, "peso_bpl": 0.35}, {"sheet": "IFT", "area": "Infraestructura", "area_weight": 0.25, "bpl_num": 5, "bpl_name": "INFORMACIÓN Y COMUNICACIONES", "bpl_weight": 0.075, "subattr": "ADQUISICIÓN DE DATOS", "comp_num": "5.3.1", "question": "El personal de logística cuenta cámaras digitales o escáneres, o \"smartphones\"", "critico": null, "weight_attr": 1.0, "peso_bpl": 0.15}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 6, "bpl_name": "ABASTECIMIENTO Y RECEPCIÓN", "bpl_weight": 0.2, "subattr": "PLANIFICACIÓN DE LAS COMPRAS", "comp_num": "6.1.1", "question": "Se informa/comunica las compras ( de volumen mayor a los normal o excepcionales)a Logística para que pueda planificar la operación de descarga y espacio necesario.(Registro, email, etc)", "critico": null, "weight_attr": 0.6, "peso_bpl": 0.45}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 6, "bpl_name": "ABASTECIMIENTO Y RECEPCIÓN", "bpl_weight": 0.2, "subattr": "PLANIFICACIÓN DE LAS COMPRAS", "comp_num": "6.1.2", "question": "Realizan compras proporcionales y distribuidas dentro del mes", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.45}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 6, "bpl_name": "ABASTECIMIENTO Y RECEPCIÓN", "bpl_weight": 0.2, "subattr": "ACTIVACION DEL ABASTECIMIENTO", "comp_num": "6.2.1", "question": "Logística recibe el IAD ", "critico": null, "weight_attr": 1.0, "peso_bpl": 0.3}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 6, "bpl_name": "ABASTECIMIENTO Y RECEPCIÓN", "bpl_weight": 0.2, "subattr": "COORDINACIÓN DEL ABASTECIMIENTO", "comp_num": "6.3.1", "question": "Previsión de espacio para el guardado/almacenamiento y/o reordenamiento de la mercadería", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.15}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 6, "bpl_name": "ABASTECIMIENTO Y RECEPCIÓN", "bpl_weight": 0.2, "subattr": "COORDINACIÓN DEL ABASTECIMIENTO", "comp_num": "6.3.2", "question": "Previsión de personas y equipo (Apilador/Autoelevador) necesarias para la descarga", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.15}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 6, "bpl_name": "ABASTECIMIENTO Y RECEPCIÓN", "bpl_weight": 0.2, "subattr": "COORDINACIÓN DEL ABASTECIMIENTO", "comp_num": "6.3.3", "question": "Cuenta con una ventana horaria de 8hs para recepción de mercadería", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.15}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 6, "bpl_name": "ABASTECIMIENTO Y RECEPCIÓN", "bpl_weight": 0.2, "subattr": "COORDINACIÓN DEL ABASTECIMIENTO", "comp_num": "6.3.4", "question": "Descarga  en lugares definidos", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.15}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 6, "bpl_name": "ABASTECIMIENTO Y RECEPCIÓN", "bpl_weight": 0.2, "subattr": "RECEPCION", "comp_num": "6.4.1", "question": "Las novedades se transmiten a Logística de Arcor por correo", "critico": null, "weight_attr": 1.0, "peso_bpl": 0.1}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 7, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.1, "subattr": "ORGANIZACIÓN DEL LAY OUT", "comp_num": "7.1.1", "question": "Frecuencia definida documentada de revisión y/o modificación del lay-out (minimo cada 3 meses, maximo cada 6 meses)", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.5}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 7, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.1, "subattr": "ORGANIZACIÓN DEL LAY OUT", "comp_num": "7.1.2", "question": "Pasillos organizados por algun criterio logico (Negocio, ABC, familia, etc)", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.5}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 7, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.1, "subattr": "IDENTIFICACION DEL LAY OUT", "comp_num": "7.2.1", "question": "Cada área del lay out se encuentra demarcada (Zonas pintadas en el piso)", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.15}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 7, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.1, "subattr": "IDENTIFICACION DEL LAY OUT", "comp_num": "7.2.2", "question": "Áreas principales identificadas (Recepción-Despacho-Devoluciones-Mercadería no comercializable-picking/almacenamiento)", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.15}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 7, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.1, "subattr": "IDENTIFICACION DEL LAY OUT", "comp_num": "7.2.3", "question": "No hay superposición entre áreas críticas (Despacho y Recepción por ej)", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.15}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 7, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.1, "subattr": "ROTACION", "comp_num": "7.3.1", "question": "Control de rotación y vencimientos junto al inventario rotativo y/o auditorias de 5S", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.35}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 7, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.1, "subattr": "ROTACION", "comp_num": "7.3.2", "question": "Se lleva registro de las unidades vencidas", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.35}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 7, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.1, "subattr": "ROTACION", "comp_num": "7.3.3", "question": "Se informa sobre productos proximos a vencer a fin de tomar acciones", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.35}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 8, "bpl_name": "REPOSICION INVENTARIOS", "bpl_weight": 0.25, "subattr": "REPOSICIÓN DE MERCADERIA", "comp_num": "8.1.1", "question": "Logística o personal designado supervisa por turno o por día con algún criterio (Por ej: Productos A)", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.2}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 8, "bpl_name": "REPOSICION INVENTARIOS", "bpl_weight": 0.25, "subattr": "REPOSICIÓN DE MERCADERIA", "comp_num": "8.1.2", "question": "Posiciones fijas de pickeo con capacidades definidas y/o frecuencias de reposición.", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.2}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 8, "bpl_name": "REPOSICION INVENTARIOS", "bpl_weight": 0.25, "subattr": "REPOSICIÓN DE MERCADERIA", "comp_num": "8.1.3", "question": "Se verifica el volumen de la posición de picking con una frecuencia determinada (minimo cada 3 meses, maximo cada 6 meses)", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.2}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 8, "bpl_name": "REPOSICION INVENTARIOS", "bpl_weight": 0.25, "subattr": "INVENTARIOS ROTATIVOS", "comp_num": "8.2.1", "question": "Se analizan causas al finalizar. Se registran acciones ", "critico": "CRITICO 7", "weight_attr": 0.4, "peso_bpl": 0.8}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 8, "bpl_name": "REPOSICION INVENTARIOS", "bpl_weight": 0.25, "subattr": "INVENTARIOS ROTATIVOS", "comp_num": "8.2.2", "question": "Criterio definido de  selección de items (ABC, rotativo,negocio, pasillo, etc.). Se toman y/o verifican  fechas de vencimientos.", "critico": "CRITICO 7", "weight_attr": 0.35, "peso_bpl": 0.8}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 8, "bpl_name": "REPOSICION INVENTARIOS", "bpl_weight": 0.25, "subattr": "INVENTARIOS ROTATIVOS", "comp_num": "8.2.3", "question": "Se realizan con una frecuencia definida,  mínima mensual", "critico": "CRITICO 7", "weight_attr": 0.25, "peso_bpl": 0.8}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 9, "bpl_name": "CONSOLIDADOS Y PEDIDOS", "bpl_weight": 0.25, "subattr": "TRANSMISION DE PEDIDOS", "comp_num": "9.1.1", "question": "Ventana horaria establecida para el corte de pedidos", "critico": null, "weight_attr": 0.6, "peso_bpl": 0.1}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 9, "bpl_name": "CONSOLIDADOS Y PEDIDOS", "bpl_weight": 0.25, "subattr": "TRANSMISION DE PEDIDOS", "comp_num": "9.1.2", "question": "Realiza analisis frecuentes relacionado a desvios en el corte de pedidos", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.1}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 9, "bpl_name": "CONSOLIDADOS Y PEDIDOS", "bpl_weight": 0.25, "subattr": "ARMADO Y ASIGNACIÓN DE CONSOLIDADOS Y/O PEDIDOS", "comp_num": "9.2.1", "question": "El ordenamiento físico de los productos coincide con el consolidado", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.15}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 9, "bpl_name": "CONSOLIDADOS Y PEDIDOS", "bpl_weight": 0.25, "subattr": "ARMADO Y ASIGNACIÓN DE CONSOLIDADOS Y/O PEDIDOS", "comp_num": "9.2.2", "question": "Se generan los consolidados aplicando criterios (Logísticos)de corte a partir de los pedidos ingresados-Solo para los que trabajan pedido por pedido", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.15}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 9, "bpl_name": "CONSOLIDADOS Y PEDIDOS", "bpl_weight": 0.25, "subattr": "CONTROL DE CONSOLIDADO", "comp_num": "9.3.1", "question": "Se registran los errores y usuarios para mejorar el proceso", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.4}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 9, "bpl_name": "CONSOLIDADOS Y PEDIDOS", "bpl_weight": 0.25, "subattr": "CONTROL DE CONSOLIDADO", "comp_num": "9.3.2", "question": "Se conserva en forma transitoria registro de control del consolidado", "critico": null, "weight_attr": 0.45, "peso_bpl": 0.4}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 9, "bpl_name": "CONSOLIDADOS Y PEDIDOS", "bpl_weight": 0.25, "subattr": "CONTROL DE CONSOLIDADO", "comp_num": "9.3.3", "question": "Existe un metodo de control de consolidado", "critico": null, "weight_attr": 0.25, "peso_bpl": 0.4}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 9, "bpl_name": "CONSOLIDADOS Y PEDIDOS", "bpl_weight": 0.25, "subattr": "ARMADO DE PEDIDOS", "comp_num": "9.4.1", "question": "El pedido contiene identificación  de bultos, cliente, zona de reparto, factura, o alguna identificación que facilite la carga ", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.35}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 9, "bpl_name": "CONSOLIDADOS Y PEDIDOS", "bpl_weight": 0.25, "subattr": "ARMADO DE PEDIDOS", "comp_num": "9.4.2", "question": "Se registran los errores y usuarios para mejorar el proceso en el armado de pedido", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.35}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 9, "bpl_name": "CONSOLIDADOS Y PEDIDOS", "bpl_weight": 0.25, "subattr": "ARMADO DE PEDIDOS", "comp_num": "9.4.3", "question": "El ordenamiento coincide con las facturas/pedido", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.35}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 10, "bpl_name": "TRANSPORTE Y REPARTO", "bpl_weight": 0.1, "subattr": "PEDIDOS LISTOS PARA CARGA", "comp_num": "10.1.1", "question": "La carga en la zona de despacho contiene identificación zona/reparto/fletero.", "critico": null, "weight_attr": 1.0, "peso_bpl": 0.2}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 10, "bpl_name": "TRANSPORTE Y REPARTO", "bpl_weight": 0.1, "subattr": "CARGA DE PEDIDOS", "comp_num": "10.2.1", "question": "Pedido:La carga se realiza por LIFO de acuerdo al ruteo. Consolidado:La mercadería se carga organizada (manteniendo identificado cada negocio para su pickeo en el punto de venta", "critico": null, "weight_attr": 0.35, "peso_bpl": 0.5}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 10, "bpl_name": "TRANSPORTE Y REPARTO", "bpl_weight": 0.1, "subattr": "CARGA DE PEDIDOS", "comp_num": "10.2.2", "question": "Cuenta con metodologia o registro de la hoja de ruta y el responsable del armado", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.5}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 10, "bpl_name": "TRANSPORTE Y REPARTO", "bpl_weight": 0.1, "subattr": "CARGA DE PEDIDOS", "comp_num": "10.2.3", "question": "Fletero controla y realiza la carga, si existe diferencia verifica con logística y realiza un registro de conformidad", "critico": null, "weight_attr": 0.15, "peso_bpl": 0.5}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 10, "bpl_name": "TRANSPORTE Y REPARTO", "bpl_weight": 0.1, "subattr": "ENTREGA AL CLIENTE", "comp_num": "10.3.1", "question": "Posee registro de reclamos del cliente (Planilla  con registro de incidentes)", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.3}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 10, "bpl_name": "TRANSPORTE Y REPARTO", "bpl_weight": 0.1, "subattr": "ENTREGA AL CLIENTE", "comp_num": "10.3.2", "question": "Cuenta con registro de pedidos reasignados", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.3}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 11, "bpl_name": "RETORNO Y/O DEVOLUCIONES", "bpl_weight": 0.1, "subattr": "RECHAZOS / DEVOLUCIONES", "comp_num": "11.1.1", "question": "Registro de motivos para posterior analisis y mejora del proceso", "critico": null, "weight_attr": 0.3, "peso_bpl": 1.0}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 11, "bpl_name": "RETORNO Y/O DEVOLUCIONES", "bpl_weight": 0.1, "subattr": "RECHAZOS / DEVOLUCIONES", "comp_num": "11.1.2", "question": "Mercadería ordenada con algún criterio y documentación de respaldo para validacion", "critico": null, "weight_attr": 0.3, "peso_bpl": 1.0}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 11, "bpl_name": "RETORNO Y/O DEVOLUCIONES", "bpl_weight": 0.1, "subattr": "RECHAZOS / DEVOLUCIONES", "comp_num": "11.1.3", "question": "Mercadería en el sector identificada y controlada", "critico": null, "weight_attr": 0.25, "peso_bpl": 1.0}, {"sheet": "PLG", "area": "Procesos Logísticos", "area_weight": 0.25, "bpl_num": 11, "bpl_name": "RETORNO Y/O DEVOLUCIONES", "bpl_weight": 0.1, "subattr": "RECHAZOS / DEVOLUCIONES", "comp_num": "11.1.4", "question": "Lugar físico identificado y separado para almacenar rechazos/devoluciones", "critico": null, "weight_attr": 0.15, "peso_bpl": 1.0}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "HERRAMIENTAS DE GESTION", "comp_num": "12.1.1", "question": "Dispone de alguna herramienta informatica y la utiliza en el depósito", "critico": "CRITICO 8", "weight_attr": 0.2, "peso_bpl": 0.2}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "HERRAMIENTAS DE GESTION", "comp_num": "12.1.2", "question": "Cuenta con la aplicación de Arcortrukc para gestionar las entregas , rechazos y/o devoluciones de los clientes", "critico": null, "weight_attr": 0.0, "peso_bpl": 0.2}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "HERRAMIENTAS DE GESTION", "comp_num": "12.1.3", "question": "Utiliza el Modulo Recepción", "critico": "CRITICO 8", "weight_attr": 0.15, "peso_bpl": 0.2}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "HERRAMIENTAS DE GESTION", "comp_num": "12.1.4", "question": "Utiliza el Modulo Inventario", "critico": "CRITICO 8", "weight_attr": 0.15, "peso_bpl": 0.2}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "HERRAMIENTAS DE GESTION", "comp_num": "12.1.5", "question": "Utiliza el Modulo Picking", "critico": "CRITICO 8", "weight_attr": 0.25, "peso_bpl": 0.2}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "HERRAMIENTAS DE GESTION", "comp_num": "12.1.6", "question": "Utiliza el Modulo Control de Consolidados", "critico": "CRITICO 8", "weight_attr": 0.15, "peso_bpl": 0.2}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "HERRAMIENTAS DE GESTION", "comp_num": "12.1.7", "question": "Utiliza el Modulo Armado de Pedidos", "critico": "CRITICO 8", "weight_attr": 0.1, "peso_bpl": 0.2}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "ORGANIGRAMAS Y PERFILES", "comp_num": "12.2.1", "question": "Se encuentran comunicados ", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.3}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "ORGANIGRAMAS Y PERFILES", "comp_num": "12.2.2", "question": "Se encuentra definido y documentado el perfil del puesto de MML logística", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.3}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "ORGANIGRAMAS Y PERFILES", "comp_num": "12.2.3", "question": "Se encuentran definidos los perfiles de puestos principales (comercial y administrativo)", "critico": null, "weight_attr": 0.15, "peso_bpl": 0.3}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "ORGANIGRAMAS Y PERFILES", "comp_num": "12.2.4", "question": "El organigrama se encuentra definido y documentado por la distribuidora", "critico": null, "weight_attr": 0.35, "peso_bpl": 0.3}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "PROCESOS DOCUMENTADOS", "comp_num": "12.3.1", "question": "Cuenta con el Procedimiento Proceso de Recepción y Control de Mercadería", "critico": "CRITICO 9", "weight_attr": 0.1, "peso_bpl": 0.5}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "PROCESOS DOCUMENTADOS", "comp_num": "12.3.2", "question": "Cuenta con el Procedimiento Proceso de Reposición de Productos en Picking", "critico": "CRITICO 9", "weight_attr": 0.1, "peso_bpl": 0.5}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "PROCESOS DOCUMENTADOS", "comp_num": "12.3.3", "question": "Cuenta con el Procedimiento Proceso de Almacenamiento de Productos", "critico": "CRITICO 9", "weight_attr": 0.1, "peso_bpl": 0.5}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "PROCESOS DOCUMENTADOS", "comp_num": "12.3.4", "question": "Cuenta con el Procedimiento Proceso de Armado y Control de Consolidados", "critico": "CRITICO 9", "weight_attr": 0.1, "peso_bpl": 0.5}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "PROCESOS DOCUMENTADOS", "comp_num": "12.3.5", "question": "Cuenta con el Procedimiento Proceso de Armado de Pedidos", "critico": "CRITICO 9", "weight_attr": 0.1, "peso_bpl": 0.5}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "PROCESOS DOCUMENTADOS", "comp_num": "12.3.6", "question": "Cuenta con el Procedimiento Proceso de Control de hojas de ruta y carga de pedidos", "critico": "CRITICO 9", "weight_attr": 0.1, "peso_bpl": 0.5}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "PROCESOS DOCUMENTADOS", "comp_num": "12.3.7", "question": "Cuenta con el Procedimiento Proceso de Control de Inventario", "critico": "CRITICO 9", "weight_attr": 0.1, "peso_bpl": 0.5}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "PROCESOS DOCUMENTADOS", "comp_num": "12.3.8", "question": "Cuenta con el Procedimiento Proceso de  Control de Hoja de Ruta y Logistica de Reversa", "critico": "CRITICO 9", "weight_attr": 0.1, "peso_bpl": 0.5}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "PROCESOS DOCUMENTADOS", "comp_num": "12.3.9", "question": "Los responsables del proceso conocen el procedimiento, el mismo coincide con el proceso", "critico": "CRITICO 9", "weight_attr": 0.1, "peso_bpl": 0.5}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 12, "bpl_name": "ORGANIZACIÓN", "bpl_weight": 0.25, "subattr": "PROCESOS DOCUMENTADOS", "comp_num": "12.3.10", "question": "El formato del procedimiento se ajusta al modelo estandar propuesto por Arcor", "critico": "CRITICO 9", "weight_attr": 0.1, "peso_bpl": 0.5}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 13, "bpl_name": "PLANIFICACION", "bpl_weight": 0.25, "subattr": "PLANIFICACIÓN TÁCTICA", "comp_num": "13.1.1", "question": "Logistica participa de reuniones con Ventas y Administracion, en las cuales se definen objetivos anuales y/o mensuales", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.45}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 13, "bpl_name": "PLANIFICACION", "bpl_weight": 0.25, "subattr": "PLANIFICACIÓN TÁCTICA", "comp_num": "13.1.2", "question": "Se realiza el seguimiento de la  planificación en forma períodica (semanal, quincenal o mensual) evaluando el alcance de los resultados.", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.45}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 13, "bpl_name": "PLANIFICACION", "bpl_weight": 0.25, "subattr": "PLANIFICACIÓN TÁCTICA", "comp_num": "13.1.3", "question": "Las acciones surgidas de la planificación quedan plasmadas en un plan de acción", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.45}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 13, "bpl_name": "PLANIFICACION", "bpl_weight": 0.25, "subattr": "PLANIFICACIÓN OPERATIVA", "comp_num": "13.2.1", "question": "Se registran e informan las acciones o novedades en un pizarrón o avisadores.", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.15}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 13, "bpl_name": "PLANIFICACION", "bpl_weight": 0.25, "subattr": "PLANIFICACIÓN OPERATIVA", "comp_num": "13.2.2", "question": "Se realizan reuniones periódicas en el sector registrándose las decisiones en  planes de acción", "critico": null, "weight_attr": 0.6, "peso_bpl": 0.15}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 13, "bpl_name": "PLANIFICACION", "bpl_weight": 0.25, "subattr": "MANTENIMIENTO", "comp_num": "13.3.1", "question": "Se planifica el mantenimiento preventivo de la infraestructura (desagües, portones, racks, techos)", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.4}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 13, "bpl_name": "PLANIFICACION", "bpl_weight": 0.25, "subattr": "MANTENIMIENTO", "comp_num": "13.3.2", "question": "Se planifica el mantenimiento preventivo del grupo electrógeno", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.4}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 13, "bpl_name": "PLANIFICACION", "bpl_weight": 0.25, "subattr": "MANTENIMIENTO", "comp_num": "13.3.3", "question": "Se planifica el mantenimiento preventivos del equipamiento logístico de manipuleo", "critico": null, "weight_attr": 0.25, "peso_bpl": 0.4}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 13, "bpl_name": "PLANIFICACION", "bpl_weight": 0.25, "subattr": "MANTENIMIENTO", "comp_num": "13.3.4", "question": "Se planifica el mantenimiento preventivo de flota propia o chequeo de tercerizada", "critico": null, "weight_attr": 0.25, "peso_bpl": 0.4}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 14, "bpl_name": "INFORMACION Y COMUNICACIONES", "bpl_weight": 0.1, "subattr": "INFORMACIÓN AL PERSONAL", "comp_num": "14.1.1", "question": "La información en ella se encuentra actualizada", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.7}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 14, "bpl_name": "INFORMACION Y COMUNICACIONES", "bpl_weight": 0.1, "subattr": "INFORMACIÓN AL PERSONAL", "comp_num": "14.1.2", "question": "Existe cartelería informativa en el sector (novedades, indicadores, vacaciones, lanzamientos, informacion relacionada a la operación del depósito, seguridad)", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.7}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 14, "bpl_name": "INFORMACION Y COMUNICACIONES", "bpl_weight": 0.1, "subattr": "SUGERENCIAS DE MEJORA", "comp_num": "14.2.1", "question": "Existe un registro de sugerencias realizadas por parte del personal", "critico": null, "weight_attr": 0.7, "peso_bpl": 0.3}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 14, "bpl_name": "INFORMACION Y COMUNICACIONES", "bpl_weight": 0.1, "subattr": "SUGERENCIAS DE MEJORA", "comp_num": "14.2.2", "question": "Queda plasmado un plan de acción/respuesta en base a las sugerencias realizadas", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.3}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 15, "bpl_name": "FORMACION Y DESARROLLO", "bpl_weight": 0.1, "subattr": "CAPACITACION", "comp_num": "15.1.1", "question": "Realizan capacitaciones relacionadas a cambios o mejoras en los procesos o cuentan con un plan de capacitaciones especificas", "critico": null, "weight_attr": 1.0, "peso_bpl": 0.4}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 15, "bpl_name": "FORMACION Y DESARROLLO", "bpl_weight": 0.1, "subattr": "ROTACIÓN Y POLICOMPETENCIAS", "comp_num": "15.2.1", "question": "Están definidas matrices de polivalencia o policompetencia", "critico": null, "weight_attr": 1.0, "peso_bpl": 0.6}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 16, "bpl_name": "MEDICION Y MEJORA", "bpl_weight": 0.3, "subattr": "INDICADORES", "comp_num": "16.1.1", "question": "Diferencia de inventario", "critico": "CRITICO 10", "weight_attr": 0.2, "peso_bpl": 0.6}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 16, "bpl_name": "MEDICION Y MEJORA", "bpl_weight": 0.3, "subattr": "INDICADORES", "comp_num": "16.1.2", "question": "Costo de transporte", "critico": "CRITICO 10", "weight_attr": 0.2, "peso_bpl": 0.6}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 16, "bpl_name": "MEDICION Y MEJORA", "bpl_weight": 0.3, "subattr": "INDICADORES", "comp_num": "16.1.3", "question": "Costo Operativo  Depósito", "critico": "CRITICO 10", "weight_attr": 0.1, "peso_bpl": 0.6}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 16, "bpl_name": "MEDICION Y MEJORA", "bpl_weight": 0.3, "subattr": "INDICADORES", "comp_num": "16.1.4", "question": "Productividad global", "critico": "CRITICO 10", "weight_attr": 0.2, "peso_bpl": 0.6}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 16, "bpl_name": "MEDICION Y MEJORA", "bpl_weight": 0.3, "subattr": "INDICADORES", "comp_num": "16.1.5", "question": "Rechazos", "critico": "CRITICO 10", "weight_attr": 0.1, "peso_bpl": 0.6}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 16, "bpl_name": "MEDICION Y MEJORA", "bpl_weight": 0.3, "subattr": "INDICADORES", "comp_num": "16.1.6", "question": "Devoluciones", "critico": "CRITICO 10", "weight_attr": 0.1, "peso_bpl": 0.6}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 16, "bpl_name": "MEDICION Y MEJORA", "bpl_weight": 0.3, "subattr": "INDICADORES", "comp_num": "16.1.7", "question": "Informan mensualmente el tablero Logistico.", "critico": "CRITICO 10", "weight_attr": 0.1, "peso_bpl": 0.6}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 16, "bpl_name": "MEDICION Y MEJORA", "bpl_weight": 0.3, "subattr": "5S", "comp_num": "16.2.1", "question": "Posee implementadas las 3 primeras \"S\"   (CLASIFICAR - ORDENAR - LIMPIAR)", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.4}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 16, "bpl_name": "MEDICION Y MEJORA", "bpl_weight": 0.3, "subattr": "5S", "comp_num": "16.2.2", "question": "Se auditan con frecuencia determinada (4ta S - AUDITORIA) los niveles de orden y limpieza alcanzados", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.4}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 16, "bpl_name": "MEDICION Y MEJORA", "bpl_weight": 0.3, "subattr": "5S", "comp_num": "16.2.3", "question": "Se toman acciones sobre  los resultados de las auditorias", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.4}, {"sheet": "GST", "area": "Gestión", "area_weight": 0.2, "bpl_num": 16, "bpl_name": "MEDICION Y MEJORA", "bpl_weight": 0.3, "subattr": "5S", "comp_num": "16.2.4", "question": "Está implementada cada una de las 5Ss, se mantiene en el tiempo y es base para mejoras edilicias, de procesos y de clima laboral", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.4}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 17, "bpl_name": "ABASTECIMIENTO Y RECEPCIÓN", "bpl_weight": 0.15, "subattr": "RECEPCION", "comp_num": "17.1.1", "question": "Control general de la carga incluye vencimientos", "critico": null, "weight_attr": 0.25, "peso_bpl": 1.0}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 17, "bpl_name": "ABASTECIMIENTO Y RECEPCIÓN", "bpl_weight": 0.15, "subattr": "RECEPCION", "comp_num": "17.1.2", "question": "Control general de cantidad y estado de  bultos recibidos", "critico": null, "weight_attr": 0.25, "peso_bpl": 1.0}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 17, "bpl_name": "ABASTECIMIENTO Y RECEPCIÓN", "bpl_weight": 0.15, "subattr": "RECEPCION", "comp_num": "17.1.3", "question": "Controlan y poseen un registro de la temperatura con la que arriba la carga de Helados", "critico": null, "weight_attr": 0.25, "peso_bpl": 1.0}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 17, "bpl_name": "ABASTECIMIENTO Y RECEPCIÓN", "bpl_weight": 0.15, "subattr": "RECEPCION", "comp_num": "17.1.4", "question": "Controlan y poseen un registro de la temperatura con la que arriba la carga de Refrigerados", "critico": null, "weight_attr": 0.25, "peso_bpl": 1.0}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "ALMACENAMIENTO", "comp_num": "18.1.1", "question": "Se identifican claramente los vencimientos.", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.16666666666}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "ALMACENAMIENTO", "comp_num": "18.1.2", "question": "Los bultos almacenados se encuentran en buen estado de conservación, apilabilidad y separacion de la estiba contra la pared", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.16666666666}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "ALMACENAMIENTO", "comp_num": "18.1.3", "question": "Los productos que requieren acondicionamiento de temperatura (según Maestro de Articulos) se encuentran almacenados dentro de la cámara", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.16666666666}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "ALMACENAMIENTO", "comp_num": "18.1.4", "question": "No se encuentran pallets rotos, deteriorados, dañados almacenando mercadería", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.16666666666}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "CONTAMINACIÓN CRUZADA", "comp_num": "18.2.1", "question": "En el depósito no se perciben olores extraños provenientes de estos químicos.", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.277777777}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "CONTAMINACIÓN CRUZADA", "comp_num": "18.2.2", "question": "Los productos químicos se almacenan en lugares cerrados (armarios o gabinetes)", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.277777777}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "CONTAMINACIÓN CRUZADA", "comp_num": "18.2.3", "question": "El lugar se encuentra identificado con cartelería", "critico": null, "weight_attr": 0.1, "peso_bpl": 0.277777777}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "CONTAMINACIÓN CRUZADA", "comp_num": "18.2.4", "question": "Se accede al lugar mediante uso de llave u otro elemento que garantice la inviolabilidad y no se evidencia concentración de aromas.", "critico": null, "weight_attr": 0.1, "peso_bpl": 0.277777777}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "CONTROL DE TEMPERATURAS", "comp_num": "18.3.1", "question": "La temperatura de los productos secos no supera los 30°C (promedio máximo diario) y 35°C  máximo y se garantiza mediante elemento de medición y registros", "critico": null, "weight_attr": 0.35, "peso_bpl": 0.1111}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "CONTROL DE TEMPERATURAS", "comp_num": "18.3.2", "question": "La temperatura de los productos refrigeriados se encuentra entre 15°C  y 25°C y se garantiza mediante registros", "critico": null, "weight_attr": 0.35, "peso_bpl": 0.1111}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "CONTROL DE TEMPERATURAS", "comp_num": "18.3.3", "question": "La temperatura de los productos congelados se encuentra en -22°C y se garantiza mediante registros", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.1111}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "INSTRUMENTOS MEDICIÓN TEMPERATURA", "comp_num": "18.4.1", "question": "Existe un registro de contrastación y/o calibración de termometros que garantice el correcto funcionamiento", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.0556}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "INSTRUMENTOS MEDICIÓN TEMPERATURA", "comp_num": "18.4.2", "question": "Los instrumentos de medición alertan ante variaciones inaceptables de temperatura ", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.0556}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "ROTACIÓN Y REPOSICIÓN", "comp_num": "18.5.1", "question": "Se garantiza la inocuidad del producto evitando el contacto del envase primario o secundario con la madera u otro material contaminante ", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.3333}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "ROTACIÓN Y REPOSICIÓN", "comp_num": "18.5.2", "question": "Se garantiza la correcta rotación FEFO por gestión visual o informática.", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.3333}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "ILUMINACION", "comp_num": "18.6.1", "question": "Las luminarias y aberturas de vidrio estan protegidas ante estallidos", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.0556}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 18, "bpl_name": "ALMACENAMIENTO Y MANIPULEO", "bpl_weight": 0.25, "subattr": "ILUMINACION", "comp_num": "18.6.2", "question": "Existen métodos de prevención de  estallido y astillado en aberturas, etc", "critico": null, "weight_attr": 0.5, "peso_bpl": 0.0556}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 19, "bpl_name": "TRANSPORTE Y REPARTO", "bpl_weight": 0.25, "subattr": "DESPACHO", "comp_num": "19.1.1", "question": "Cuenta con una check-list para controlar las adecuadas condiciones de higiene, limpieza y acondicionamiento de la unidad contenedora del vehículo", "critico": null, "weight_attr": 0.35, "peso_bpl": 0.7}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 19, "bpl_name": "TRANSPORTE Y REPARTO", "bpl_weight": 0.25, "subattr": "DESPACHO", "comp_num": "19.1.2", "question": "Se tienen en cuenta las condiciones de carga de los distintos productos (apilabilidad, peso, volumen, fragilidad, condiciones de temperatura, etc.)", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.7}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 19, "bpl_name": "TRANSPORTE Y REPARTO", "bpl_weight": 0.25, "subattr": "DESPACHO", "comp_num": "19.1.3", "question": "El distribuidor controla la temperatura al momento del despacho y durante la distribución en productos refrigerados.", "critico": null, "weight_attr": 0.35, "peso_bpl": 0.7}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 19, "bpl_name": "TRANSPORTE Y REPARTO", "bpl_weight": 0.25, "subattr": "DESPACHO LEGALES HIGIENE", "comp_num": "19.2.1", "question": "Cuentan con un metodo/planilla de seguimiento de la documentación de los repartidores (Carnet de conducir y sanitario, tarjeta verde o azul, seguros, VTV o ITV, habilitaciones, etc)", "critico": null, "weight_attr": 0.25, "peso_bpl": 0.3}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 19, "bpl_name": "TRANSPORTE Y REPARTO", "bpl_weight": 0.25, "subattr": "DESPACHO LEGALES HIGIENE", "comp_num": "19.2.2", "question": "Los transportes son de uso exclusivo para alimentos y se encuentran habilitados por la autoridad compentente.", "critico": null, "weight_attr": 0.25, "peso_bpl": 0.3}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 19, "bpl_name": "TRANSPORTE Y REPARTO", "bpl_weight": 0.25, "subattr": "DESPACHO LEGALES HIGIENE", "comp_num": "19.2.3", "question": "Los contenedores utilizados para el reparto conservan la integridad del producto.", "critico": null, "weight_attr": 0.25, "peso_bpl": 0.3}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 19, "bpl_name": "TRANSPORTE Y REPARTO", "bpl_weight": 0.25, "subattr": "DESPACHO LEGALES HIGIENE", "comp_num": "19.2.4", "question": "El vehiculo que transporta helados cuenta con instrumento de medición de temperatura permitiendo su verificación en cabina.", "critico": null, "weight_attr": 0.25, "peso_bpl": 0.3}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 20, "bpl_name": "RETORNO Y/O DEVOLUCIONES", "bpl_weight": 0.15, "subattr": "RECHAZOS", "comp_num": "20.1.1", "question": "Está determinada la frecuencia de procesamiento de productos rechazados", "critico": "CRITICO 11", "weight_attr": 0.5, "peso_bpl": 0.4}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 20, "bpl_name": "RETORNO Y/O DEVOLUCIONES", "bpl_weight": 0.15, "subattr": "RECHAZOS", "comp_num": "20.1.2", "question": "Los productos rechazados no aptos son rápidamente segregados de los productos aptos", "critico": "CRITICO 11", "weight_attr": 0.5, "peso_bpl": 0.4}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 20, "bpl_name": "RETORNO Y/O DEVOLUCIONES", "bpl_weight": 0.15, "subattr": "DEVOLUCIONES DE PRODUCTOS NO APTOS", "comp_num": "20.2.1", "question": "El lugar se encuentra delimitado/identificado con cartelería de manera visual e inequívoca", "critico": "CRITICO 12", "weight_attr": 0.5, "peso_bpl": 0.4}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 20, "bpl_name": "RETORNO Y/O DEVOLUCIONES", "bpl_weight": 0.15, "subattr": "DEVOLUCIONES DE PRODUCTOS NO APTOS", "comp_num": "20.2.2", "question": "El lugar para almacenamiento de estos productos se encuentra separado del producto apto", "critico": "CRITICO 12", "weight_attr": 0.5, "peso_bpl": 0.4}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 20, "bpl_name": "RETORNO Y/O DEVOLUCIONES", "bpl_weight": 0.15, "subattr": "RECALL Y TRAZABILIDAD", "comp_num": "20.3.1", "question": "Cuenta con el Procedimiento Proceso de Recall", "critico": null, "weight_attr": 1.0, "peso_bpl": 0.2}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 21, "bpl_name": "LIMPIEZA", "bpl_weight": 0.1, "subattr": "RESIDUOS", "comp_num": "21.1.1", "question": "Dispone de un sector para almacenar los residuos que se mantiene despejado y ordenado compacto y fácilmente lavable.", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.3}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 21, "bpl_name": "LIMPIEZA", "bpl_weight": 0.1, "subattr": "RESIDUOS", "comp_num": "21.1.2", "question": "Cuenta con contenedores cerrados para depositar residuos.", "critico": null, "weight_attr": 0.6, "peso_bpl": 0.3}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 21, "bpl_name": "LIMPIEZA", "bpl_weight": 0.1, "subattr": "LIMPIEZA", "comp_num": "21.2.1", "question": "Las oficinas están construidas afuera o separados de las zonas donde se encuentran los productos.", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.2}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 21, "bpl_name": "LIMPIEZA", "bpl_weight": 0.1, "subattr": "LIMPIEZA", "comp_num": "21.2.2", "question": "Los baños, vestuarios y/o comedor están en buenas condiciones edilicias, no generan olores y/o contaminación cruzada. ", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.2}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 21, "bpl_name": "LIMPIEZA", "bpl_weight": 0.1, "subattr": "LIMPIEZA", "comp_num": "21.2.3", "question": "Sector de carga y descarga en buenas condiciones de limpieza, cumple con el plan de limpieza", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.2}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 21, "bpl_name": "LIMPIEZA", "bpl_weight": 0.1, "subattr": "PLANES DE LIMPIEZA", "comp_num": "21.3.1", "question": "Los productos químicos utilizados cuentan con los certificados de habilitación de la autoridad sanitaria correspondientes.", "critico": null, "weight_attr": 0.3, "peso_bpl": 0.5}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 21, "bpl_name": "LIMPIEZA", "bpl_weight": 0.1, "subattr": "PLANES DE LIMPIEZA", "comp_num": "21.3.2", "question": "Existe plan/seguimiento de limpieza documentado.", "critico": null, "weight_attr": 0.7, "peso_bpl": 0.5}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 22, "bpl_name": "MANEJO INTEGRADO DE PLAGAS", "bpl_weight": 0.1, "subattr": "CONTROL DE PLAGAS", "comp_num": "22.1.1", "question": "Llevan a cabo y existen registros del plan documentado de control de plaga para insectos terrestre, voladores, aves y roedores", "critico": "CRITICO 13", "weight_attr": 0.2, "peso_bpl": 0.7}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 22, "bpl_name": "MANEJO INTEGRADO DE PLAGAS", "bpl_weight": 0.1, "subattr": "CONTROL DE PLAGAS", "comp_num": "22.1.2", "question": "La empresa cuenta con las habilitaciones vigentes requeridas para realizar todas las tareas del manejo integrado de plagas (incluye la aplicación de plaguicidas). Se deja registro de las aplicaciones (productos, sectores, objetivo,etc)", "critico": "CRITICO 13", "weight_attr": 0.3, "peso_bpl": 0.7}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 22, "bpl_name": "MANEJO INTEGRADO DE PLAGAS", "bpl_weight": 0.1, "subattr": "CONTROL DE PLAGAS", "comp_num": "22.1.3", "question": "Los dispositivos de control de plagas están identificados, protegidos, fijos, razonablemente limpios, no obstruidos y en buenas condiciones para cumplir su función", "critico": "CRITICO 13", "weight_attr": 0.3, "peso_bpl": 0.7}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 22, "bpl_name": "MANEJO INTEGRADO DE PLAGAS", "bpl_weight": 0.1, "subattr": "CONTROL DE PLAGAS", "comp_num": "22.1.4", "question": "Se realiza monitoreo y control de insectos voladores con trampas UV.", "critico": "CRITICO 13", "weight_attr": 0.1, "peso_bpl": 0.7}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 22, "bpl_name": "MANEJO INTEGRADO DE PLAGAS", "bpl_weight": 0.1, "subattr": "CONTROL DE PLAGAS", "comp_num": "22.1.5", "question": "Se realiza monitoreo y control de gorgojos / carcoma con feromonas", "critico": "CRITICO 13", "weight_attr": 0.1, "peso_bpl": 0.7}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 22, "bpl_name": "MANEJO INTEGRADO DE PLAGAS", "bpl_weight": 0.1, "subattr": "INFRAESTRUCTURA", "comp_num": "22.2.1", "question": "El depósito cuenta con aberturas (puertas, portones y ventanas) que garantizan hermeticidad y se mantienen cerradas", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.3}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 22, "bpl_name": "MANEJO INTEGRADO DE PLAGAS", "bpl_weight": 0.1, "subattr": "INFRAESTRUCTURA", "comp_num": "22.2.2", "question": "El exterior del depósito se encuentra despejado, con el pasto corto, sin acumulación de desechos. No hay equipos/estructuras/POP etc en desuso que favorezcan el anidamiento de plagas. (exterior e interior)", "critico": null, "weight_attr": 0.4, "peso_bpl": 0.3}, {"sheet": "IDP", "area": "Integridad del Producto", "area_weight": 0.3, "bpl_num": 22, "bpl_name": "MANEJO INTEGRADO DE PLAGAS", "bpl_weight": 0.1, "subattr": "INFRAESTRUCTURA", "comp_num": "22.2.3", "question": "No hay evidencia de presencia de mascotas dentro del predio (perros, gatos, etc.)", "critico": null, "weight_attr": 0.2, "peso_bpl": 0.3}];
const DIST_BASE = []; // Template limpio — agregá distribuidores desde Configuración
const AC = {IFT:'#1565c0',PLG:'#6a1b9a',GST:'#e65100',IDP:'#1b5e20'};

// ── DYNAMIC AREAS HELPER ──────────────────────────────
// Always returns current areas in Q order (+ AC keys not in Q)
function SHEETS(){
  const fromQ=[...new Set(Q.map(q=>q.sheet))];
  const extra=Object.keys(AC).filter(k=>!fromQ.includes(k));
  return [...fromQ,...extra];
}
function SHEETS_CORE(){ return SHEETS().filter(sh=>!NV[sh]); }
function SHEETS_NV(){ return SHEETS().filter(sh=>!!NV[sh]); }

// Rebuild sidebar nav items dynamically
function rebuildSidebarNav(){
  const wrap=document.getElementById('sb-area-nav'); if(!wrap) return;
  wrap.innerHTML=SHEETS().map((sh,i)=>{
    const color=AC[sh]||'#607d8b';
    const name=AN[sh]||sh;
    const qs=Q.filter(q=>q.sheet===sh);
    const bpls=new Set(qs.map(q=>q.bpl_num));
    const wPct=Math.round((AW[sh]||0)*100);
    return `<div class="ni${i===0?' on':''}" id="ni-${sh}" onclick="goArea('${sh}')">
      <div class="ni-dot" style="background:${color}"></div>
      <div class="ni-lw">
        <div class="ni-name">${name.length>14?name.substring(0,14)+'…':name}</div>
        <div class="ni-sub" id="ni-sub-${sh}">${bpls.size} BPL · ${qs.length} preg · ${wPct}%</div>
        <div class="ni-bar"><div class="ni-fill" id="pb-${sh}" style="background:${color};width:0%"></div></div>
      </div>
      <div class="ni-pct" id="np-${sh}">—</div>
    </div>`;
  }).join('');
}

// Rebuild dashboard area bars dynamically
function rebuildDashAreaBars(){
  const wrap=document.getElementById('db-area-bars'); if(!wrap) return;
  function _areaBar(sh){
    const color=AC[sh]||'#607d8b';
    const w=Math.round((AW[sh]||0)*100);
    return `<div class="ab-row">
      <div class="ab-lbl" style="color:${color}">${sh}</div>
      <div class="ab-track">
        <div class="ab-thr" style="left:${THR.rea}%;background:#e65100;opacity:.5"></div>
        <div class="ab-thr" style="left:${THR.act}%;background:#f9a825;opacity:.6"></div>
        <div class="ab-thr" style="left:${THR.pro}%;background:#2e7d32;opacity:.6"></div>
        <div class="ab-fill" id="dbf-${sh}" style="background:${color};width:0%"></div>
      </div>
      <div class="ab-pct" id="dbp-${sh}">—</div>
      <div class="ab-w">×${w}%</div>
    </div>`;
  }
  const _threshLegend=`<div style="display:flex;justify-content:space-between;margin-top:4px;font-size:9px;padding-left:44px;padding-right:30px">
    <span style="color:var(--g400)">0%</span>
    <span style="color:#c62828">${THR.rea}% INACT.</span>
    <span style="color:#f57f17">${THR.act}% ACT.</span>
    <span style="color:#2e7d32">${THR.pro}% PROACT.</span>
    <span style="color:var(--g400)">100%</span>
  </div>`;
  // Core areas + TOTAL row
  let h=SHEETS_CORE().map(_areaBar).join('');
  h+=`<div class="ab-total-row">
    <div class="ab-lbl" style="color:var(--g600);font-size:11px">TOTAL</div>
    <div class="ab-track" style="flex:1">
      <div class="ab-thr" style="left:${THR.rea}%;background:#c62828;opacity:.6"></div>
      <div class="ab-thr" style="left:${THR.act}%;background:#f9a825;opacity:.7"></div>
      <div class="ab-thr" style="left:${THR.pro}%;background:#2e7d32;opacity:.7"></div>
      <div class="ab-fill" id="dbf-total" style="background:var(--g400);width:0%;height:12px;border-radius:8px;"></div>
    </div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:900;width:44px;text-align:right" id="dbp-total">—</div>
    <div class="ab-w"></div>
  </div>${_threshLegend}`;
  // NV areas section
  const _nvSheets=SHEETS_NV();
  if(_nvSheets.length>0){
    h+=`<div style="margin-top:14px;padding-top:12px;border-top:1px dashed var(--g200)">
      <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--g400);margin-bottom:8px">Indicadores No Vinculantes</div>
      ${_nvSheets.map(_areaBar).join('')}
    </div>`;
  }
  wrap.innerHTML=h;
}

// Rebuild config area weight rows dynamically
function rebuildCfgWeightRows(){
  const wrap=document.getElementById('cfg-area-weight-rows'); if(!wrap) return;
  wrap.innerHTML=SHEETS().map(sh=>{
    const isNV=!!NV[sh];
    const btnStyle=isNV
      ?'background:var(--g200);color:var(--g500);border:1px solid var(--g200);'
      :'background:var(--blue2);color:#fff;border:1px solid var(--blue2);';
    const btnLabel=isNV?'NO VINCULANTE':'RESULTADO';
    return `<div class="cfg-row">
      <div class="cfg-lbl"><strong>${sh}</strong> · ${AN[sh]||sh}</div>
      <button onclick="toggleAreaNV('${sh}')" style="padding:3px 9px;font-size:10px;font-weight:700;border-radius:5px;cursor:pointer;letter-spacing:.5px;flex-shrink:0;${btnStyle}">${btnLabel}</button>
      <input class="cfg-input" type="number" id="cfg-w-${sh}" value="${Math.round((AW[sh]||0)*100)}"
        min="0" max="100" step="1" oninput="updateAreaWeights()"${isNV?' disabled style="opacity:.4;pointer-events:none"':''}> %
    </div>`;
  }).join('');
}

function toggleAreaNV(sh){
  if(NV[sh]) delete NV[sh]; else NV[sh]=true;
  saveStructure();
  rebuildDynamicUI();
  recalc();
  showToast(NV[sh]?('⚪ '+sh+' → No Vinculante'):('✅ '+sh+' → Resultado General'));
}

// Full UI rebuild (called after editor changes)
function rebuildDynamicUI(){
  rebuildSidebarNav();
  rebuildDashAreaBars();
  rebuildCfgWeightRows();
  rebuildStructSelector();
}

function rebuildStructSelector(){
  const wrap=document.getElementById('struct-selector-list');
  if(!wrap) return;
  // Scan localStorage for bpl_struct_* keys
  const structs=[];
  for(let i=0;i<localStorage.length;i++){
    const k=localStorage.key(i);
    if(k&&k.startsWith('bpl_struct_')){
      // key format: bpl_struct_PAIS_ANIO
      const rest=k.slice('bpl_struct_'.length); // e.g. "CHILE_2026"
      const lastUs=rest.lastIndexOf('_');
      if(lastUs<1) continue;
      const pais=rest.slice(0,lastUs);
      const anio=rest.slice(lastUs+1);
      if(!anio||isNaN(Number(anio))) continue;
      try{
        const d=JSON.parse(localStorage.getItem(k));
        const nAreas=d&&d.ac?Object.keys(d.ac).length:0;
        const nQ=d&&d.q&&Array.isArray(d.q)?d.q.length:0;
        structs.push({key:k,pais,anio:Number(anio),nAreas,nQ});
      }catch(e){ structs.push({key:k,pais,anio:Number(anio),nAreas:0,nQ:0}); }
    }
  }
  structs.sort((a,b)=>a.pais.localeCompare(b.pais)||b.anio-a.anio);

  const flags={URUGUAY:'🇺🇾',ARGENTINA:'🇦🇷',CHILE:'🇨🇱',BRASIL:'🇧🇷',PARAGUAY:'🇵🇾',PERU:'🇵🇪',COLOMBIA:'🇨🇴',MEXICO:'🇲🇽'};
  const curKey=structureKey();

  if(structs.length===0){
    wrap.innerHTML='<div style="font-size:12px;color:var(--g400);padding:4px 0">No hay estructuras guardadas todavía. Guardá País y Año para crear la primera.</div>';
    return;
  }

  wrap.innerHTML=structs.map(s=>{
    const active=s.key===curKey;
    const flag=flags[s.pais]||'🌍';
    const aStyle=active
      ?'background:var(--blue);color:#fff;border-color:var(--blue);'
      :'background:#fff;color:var(--g700);border-color:var(--g200);cursor:pointer;';
    const badge=active?'<span style="font-size:9px;background:rgba(255,255,255,.25);border-radius:3px;padding:1px 4px;margin-left:4px">ACTIVA</span>':'';
    return '<div onclick="switchStruct(\''+s.pais+'\','+s.anio+')" style="border:1.5px solid;border-radius:8px;padding:8px 12px;font-size:12px;user-select:none;transition:all .15s;'+aStyle+'">'
      +'<div style="font-weight:700;font-size:13px">'+flag+' '+s.pais+' · '+s.anio+badge+'</div>'
      +'<div style="margin-top:3px;font-size:11px;opacity:.8">'+s.nAreas+' áreas · '+s.nQ+' preguntas</div>'
      +'</div>';
  }).join('');
}

function switchStruct(pais, anio){
  if(cfg.pais===pais&&cfg.anio===anio) return; // already active
  cfg.pais=pais; cfg.anio=anio;
  localStorage.setItem('bpl_cfg_v5',JSON.stringify(cfg));
  const flags={URUGUAY:'🇺🇾',ARGENTINA:'🇦🇷',CHILE:'🇨🇱',BRASIL:'🇧🇷',PARAGUAY:'🇵🇾',PERU:'🇵🇪',COLOMBIA:'🇨🇴',MEXICO:'🇲🇽'};
  const pv=document.getElementById('sb-prog-val');
  if(pv) pv.textContent=(flags[pais]||'🌍')+' '+pais+' · '+anio;
  const sel=document.getElementById('sel-edicion'); if(sel) sel.value=anio;
  const inp=document.getElementById('cfg-pais'); if(inp) inp.value=pais;
  const inpa=document.getElementById('cfg-anio'); if(inpa) inpa.value=anio;
  if(loadStructure(pais,anio)){
    showToast('✅ '+pais+' '+anio+' cargado — '+Object.keys(AC).join(', '));
  } else {
    showToast('⚠️ No se encontró estructura para '+pais+' '+anio);
  }
  markFormDirty();
  rebuildAll(); rebuildDynamicUI(); edInitAreas();
}
const AN = {IFT:'Infraestructura',PLG:'Procesos Logísticos',GST:'Gestión',IDP:'Integridad del Producto'};
const AW_DEFAULT = {IFT:.25,PLG:.25,GST:.20,IDP:.30};

// ── WEIGHT CONFIG (all 4 levels) ──
// Keys:  at_SHEET_BPLnum  |  bpl_SHEET_BPLnum_SUBATTR  |  comp_COMPNUM
function buildWCfgDefaults(){
  const at={}, bpl={}, comp={};
  Q_BASE.forEach(q=>{
    const ak=q.sheet+'_'+q.bpl_num;
    if(at[ak]===undefined) at[ak]=q.bpl_weight;
    const bk=q.sheet+'_'+q.bpl_num+'_'+(q.subattr||'').replace(/\W+/g,'_');
    if(bpl[bk]===undefined) bpl[bk]=q.peso_bpl;
    comp[q.comp_num]=q.weight_attr;
  });
  return {at,bpl,comp};
}
let WCfg=(()=>{
  try{
    const s=localStorage.getItem('bpl_wcfg_v1');
    if(s){ const d=JSON.parse(s); if(d&&d.at&&d.bpl&&d.comp) return d; }
  }catch(e){}
  return buildWCfgDefaults();
})();
function saveWCfg(){ localStorage.setItem('bpl_wcfg_v1',JSON.stringify(WCfg)); recalc(); }
function resetWeightsCfg(){
  if(!confirm('¿Restablecer TODOS los pesos a los valores originales del Excel?')) return;
  WCfg=buildWCfgDefaults();
  saveWCfg();
  renderWeightsCfg();
  showToast('✅ Pesos restablecidos');
}

// ── STATE ──
let ans={}, coms={};
const __IS_SNAPSHOT_BROWSER = (function(){
  const el = document.getElementById('__snap_embed__');
  const txt = el ? el.textContent.trim() : '';
  return txt && txt !== '/* __SNAP_PLACEHOLDER__ */' && !window.electronAPI;
})();
if(__IS_SNAPSHOT_BROWSER){
  try {
    Object.defineProperty(window,'localStorage',{
      value:{getItem:()=>null,setItem:()=>{},removeItem:()=>{},clear:()=>{},key:()=>null,length:0},
      writable:false
    });
  }catch(e){try{window.localStorage.getItem=()=>null;}catch(_){}}
}
let saved = __IS_SNAPSHOT_BROWSER ? [] : (function(){
  try{ const s=localStorage.getItem('bpl_ra2_v6'); return s?JSON.parse(s):[]; }catch(e){ return []; }
})(); // Carga desde localStorage en Electron; vacío en snapshot browser
let autoevals = __IS_SNAPSHOT_BROWSER ? [] : (function(){
  try{ const s=localStorage.getItem('bpl_ra2_autoevals'); return s?JSON.parse(s):[]; }catch(e){ return []; }
})(); // Autoevaluaciones — mismo formato que saved[], clave bpl_ra2_autoevals
let cmpShowAE = true;   // Mostrar columna Autoevaluación en formulario
let cmpShowPrev = true; // Mostrar columna Edición Anterior en formulario
let cmpEdicion = null;  // null = edición previa más reciente; o año como string
let _loadedAuditMatrix = null; // Matrix snapshot of the currently loaded audit
let _loadedFrozenAudit = null;  // Currently loaded frozen audit (null = live/editable)

let cfg = __IS_SNAPSHOT_BROWSER ? {} : JSON.parse(localStorage.getItem('bpl_cfg_v5')||'{}');

// Default critical matrix config
// bands: array of {label, max} — max=null means "up to total"
// cells: 4x4 array [scoreRow][critBand] = 'PR'|'AC'|'RE'|'IN'
const MATRIX_DEFAULT = {
  bands: [
    {label:'≤ 5', max:5},
    {label:'6 – 8', max:8},
    {label:'9 – 12', max:12},
    {label:'13', max:null}
  ],
  cells: [
    ['IN','RE','AC','PR'],  // PROACTIVO row
    ['IN','RE','AC','AC'],  // ACTIVO row
    ['IN','RE','RE','RE'],  // REACTIVO row
    ['IN','IN','IN','IN']   // INACTIVO row
  ]
};
// Load saved matrix or use default
function loadMatrixCfg(){
  try{
    const s=localStorage.getItem('bpl_matrix_cfg_v1');
    if(s) return JSON.parse(s);
  }catch(e){}
  return JSON.parse(JSON.stringify(MATRIX_DEFAULT));
}
function saveMatrixCfg(mx){
  localStorage.setItem('bpl_matrix_cfg_v1', JSON.stringify(mx));
}
let MATRIX_CFG = loadMatrixCfg();

// Dynamic config
let AW = {...AW_DEFAULT};
let NV = {}; // Non-Vinculante areas: NV['SUST']=true → excluded from total score
let THR = {pro:85,act:70,rea:50};
let DISTRIBUTORS = [...DIST_BASE];
let Q = [...Q_BASE]; // can be extended

// Load cfg
function loadCfg(){
  // FIX 1a: merge AW en vez de reemplazar — evita borrar áreas recién creadas
  if(cfg.aw) Object.assign(AW, cfg.aw);
  if(cfg.thr) THR = {...cfg.thr};
  if(cfg.dists && DISTRIBUTORS.length===0) DISTRIBUTORS = [...cfg.dists];
  // Set UI
  SHEETS().forEach(sh=>{
    const el=document.getElementById('cfg-w-'+sh);
    if(el) el.value = Math.round((AW[sh]||0)*100);
  });
  ['pro','act','rea'].forEach(k=>{
    const el=document.getElementById('cfg-thr-'+k);
    if(el) el.value = THR[k]||0;
  });
  updateAreaWeights();
  renderCfgDists();
  renderWeightsCfg();
}
function saveCfg(){
  // Safe reads — elements may not be rendered if Config tab is not active
  const elPro=document.getElementById('cfg-thr-pro');
  const elAct=document.getElementById('cfg-thr-act');
  const elRea=document.getElementById('cfg-thr-rea');
  if(elPro) THR.pro = parseInt(elPro.value)||85;
  if(elAct) THR.act = parseInt(elAct.value)||70;
  if(elRea) THR.rea = parseInt(elRea.value)||50;
  cfg.thr = {...THR};
  cfg.dists = [...DISTRIBUTORS];
  cfg.aw = {...AW};
  localStorage.setItem('bpl_cfg_v5', JSON.stringify(cfg));
  // Also persist AW into the per-país structure
  const _sk=structureKey(); const _sd=localStorage.getItem(_sk);
  if(_sd){ try{ const _sd2=JSON.parse(_sd); _sd2.aw={...AW}; localStorage.setItem(_sk,JSON.stringify(_sd2)); }catch(_){} }
  recalc();
}
function updateAreaWeights(){
  const vals = {};
  let coreTotal = 0;
  SHEETS().forEach(sh=>{
    const v = parseFloat((document.getElementById('cfg-w-'+sh)||{}).value)||0;
    vals[sh] = v;
    if(!NV[sh]) coreTotal += v;
  });
  const el = document.getElementById('cfg-w-total');
  const ok = Math.abs(coreTotal-100)<0.5;
  if(el){ el.textContent = coreTotal.toFixed(0)+'%'; el.style.color = ok?'var(--green)':'var(--red)'; }
  if(ok){
    SHEETS().forEach(sh=>{ AW[sh] = vals[sh]/100; });
    SHEETS().forEach(sh=>{
      const el2 = document.getElementById('ni-sub-'+sh);
      if(el2){
        const qs=Q.filter(q=>q.sheet===sh); const bpls=new Set(qs.map(q=>q.bpl_num));
        el2.textContent=`${bpls.size} BPL · ${qs.length} preg · ${Math.round(AW[sh]*100)}%`;
      }
    });
    rebuildDashAreaBars();
    saveCfg();
  }
}
function resetAreaWeights(){ AW={...AW_DEFAULT}; rebuildCfgWeightRows(); saveCfg(); showToast('✅ Pesos restablecidos'); updateAreaWeights(); rebuildDashAreaBars(); }
function resetThresholds(){ THR={pro:85,act:70,rea:50}; document.getElementById('cfg-thr-pro').value=85; document.getElementById('cfg-thr-act').value=70; document.getElementById('cfg-thr-rea').value=50; saveCfg(); showToast('✅ Umbrales restablecidos'); }
function resetDistributors(){ DISTRIBUTORS=[...DIST_BASE]; renderCfgDists(); rebuildDistSelect(); saveCfg(); showToast('✅ Distribuidores restablecidos'); }

function renderCfgDists(){
  const w=document.getElementById('cfg-dist-list');
  if(!w) return;
  w.innerHTML=DISTRIBUTORS.map((d,i)=>
    `<div class="cfg-dist-tag">${d}<span class="cfg-dist-del" onclick="removeDist(${i})">✕</span></div>`).join('');
}
function addDistributor(){
  const inp=document.getElementById('cfg-new-dist'); const v=inp.value.trim();
  if(!v) return;
  if(DISTRIBUTORS.includes(v)){showToast('⚠️ Ya existe');return;}
  DISTRIBUTORS.push(v); inp.value='';
  renderCfgDists(); rebuildDistSelect(); saveCfg(); showToast('✅ Agregado: '+v);
}
function removeDist(i){
  if(!confirm('¿Eliminar '+DISTRIBUTORS[i]+'?')) return;
  DISTRIBUTORS.splice(i,1);
  renderCfgDists(); rebuildDistSelect(); saveCfg();
}
function rebuildDistSelect(){
  const sel=document.getElementById('sel-dist');
  const cur=sel.value;
  sel.innerHTML='<option value="">— Seleccionar —</option>'+DISTRIBUTORS.map(d=>`<option value="${d}">${d}</option>`).join('');
  if(DISTRIBUTORS.includes(cur)) sel.value=cur;
}
function renderBplWeights(){ renderWeightsCfg(); } // compat shim

// ── FULL WEIGHTS CONFIG TREE ──────────────────────────────────
function renderWeightsCfg(){
  const wrap=document.getElementById('wcfg-wrap'); if(!wrap) return;
  let h='';

  SHEETS().forEach(sh=>{
    const shQs=Q.filter(q=>q.sheet===sh);
    const color=AC[sh];

    // collect unique atributos
    const atributos=[]; const seenAt=new Set();
    shQs.forEach(q=>{ if(!seenAt.has(q.bpl_num)){seenAt.add(q.bpl_num); atributos.push({bk:q.bpl_num,name:q.bpl_name});}});

    h+=`<div style="margin-bottom:18px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;color:${color};text-transform:uppercase;letter-spacing:.5px;flex:1">${sh} · ${AN[sh]}</div>
        <span id="wcfg-sum-${sh}" style="font-size:10px;font-weight:700"></span>
      </div>`;

    // ─ Atributos ─
    atributos.forEach(at=>{
      const atK=sh+'_'+at.bk;
      const atDefW=(Q_BASE.find(q=>q.sheet===sh&&q.bpl_num===at.bk)||{}).bpl_weight||0;
      const atW=WCfg.at[atK]!==undefined?WCfg.at[atK]:atDefW;
      const atBqs=shQs.filter(q=>q.bpl_num===at.bk);

      // collect unique BPLs within this atributo
      const bplItems=[]; const seenBpl=new Set();
      atBqs.forEach(q=>{ const bk=sh+'_'+at.bk+'_'+(q.subattr||'').replace(/\W+/g,'_');
        if(!seenBpl.has(bk)){seenBpl.add(bk); bplItems.push({k:bk,label:q.subattr||'(sin nombre)',qs:atBqs.filter(qq=>qq.subattr===q.subattr)});}});

      h+=`<div style="background:#fafafa;border:1px solid var(--g200);border-radius:7px;margin-bottom:8px;overflow:hidden">
        <div style="display:flex;align-items:center;gap:8px;padding:7px 12px;background:#fff;cursor:pointer;user-select:none" onclick="wcfgToggle('at-${atK}')">
          <span style="font-size:9px;color:var(--g400)">▶</span>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:800;color:var(--g700);flex:1;text-transform:uppercase">${at.name}</div>
          <div style="display:flex;align-items:center;gap:4px">
            <input type="number" min="0" max="100" step="0.1"
              id="w-at-${atK}"
              value="${(atW*100).toFixed(1)}"
              style="width:60px;padding:3px 6px;border:1.5px solid var(--g200);border-radius:5px;font-size:12px;font-weight:700;text-align:right;font-family:'Barlow Condensed',sans-serif"
              oninput="wcfgUpdateAt('${sh}',${at.bk},this.value)"
              onclick="event.stopPropagation()">
            <span style="font-size:11px;color:var(--g500)">%</span>
            <span id="wcfg-sum-${sh}-${at.bk}" style="font-size:9px;margin-left:4px"></span>
          </div>
        </div>
        <div id="at-${atK}" style="display:none;padding:6px 10px 10px 20px">`;

      // ─ BPLs within this atributo ─
      bplItems.forEach(bplItem=>{
        const bplDefW=(bplItem.qs[0]||{}).peso_bpl||0;
        const bplW=WCfg.bpl[bplItem.k]!==undefined?WCfg.bpl[bplItem.k]:bplDefW;
        const bplUid=bplItem.k.replace(/[^a-zA-Z0-9]/g,'_');

        h+=`<div style="background:#fff;border:1px solid var(--g100);border-radius:5px;margin-bottom:6px;overflow:hidden">
          <div style="display:flex;align-items:center;gap:6px;padding:5px 10px;cursor:pointer;user-select:none" onclick="wcfgToggle('bpl-${bplUid}')">
            <span style="font-size:9px;color:var(--g400)">▶</span>
            <div style="font-size:11px;font-weight:600;color:var(--g600);flex:1">${bplItem.label}</div>
            <div style="display:flex;align-items:center;gap:4px">
              <input type="number" min="0" max="100" step="0.1"
                id="w-bpl-${bplUid}"
                value="${(bplW*100).toFixed(1)}"
                style="width:58px;padding:2px 5px;border:1.5px solid var(--g200);border-radius:4px;font-size:11px;font-weight:700;text-align:right;font-family:'Barlow Condensed',sans-serif"
                oninput="wcfgUpdateBpl('${bplItem.k}',this.value,'${sh}',${at.bk})"
                onclick="event.stopPropagation()">
              <span style="font-size:10px;color:var(--g500)">%</span>
              <span id="wcfg-sum-${bplUid}" style="font-size:9px;margin-left:4px"></span>
            </div>
          </div>
          <div id="bpl-${bplUid}" style="display:none;padding:4px 8px 8px 16px">`;

        // ─ Components ─
        bplItem.qs.forEach(q=>{
          const cW=WCfg.comp[q.comp_num]!==undefined?WCfg.comp[q.comp_num]:q.weight_attr;
          const cUid=q.comp_num.replace(/\./g,'_');
          h+=`<div style="display:flex;align-items:center;gap:6px;padding:3px 0;border-bottom:1px solid var(--g100)">
            <span style="font-size:10px;color:var(--g400);min-width:36px">${q.comp_num}</span>
            <div style="flex:1;font-size:10px;color:var(--g700);line-height:1.3">${q.question.length>80?q.question.slice(0,80)+'…':q.question}${q.critico?` <span style="font-size:8px;font-weight:700;background:var(--red-l);color:var(--red-t);padding:1px 4px;border-radius:3px">${q.critico}</span>`:''}</div>
            <div style="display:flex;align-items:center;gap:3px;flex-shrink:0">
              <input type="number" min="0" max="100" step="0.01"
                id="w-comp-${cUid}"
                value="${(cW*100).toFixed(2)}"
                style="width:56px;padding:2px 4px;border:1.5px solid var(--g200);border-radius:4px;font-size:10px;font-weight:700;text-align:right;font-family:'Barlow Condensed',sans-serif"
                oninput="wcfgUpdateComp('${q.comp_num}',this.value,'${bplUid}')">
              <span style="font-size:9px;color:var(--g500)">%</span>
            </div>
          </div>`;
        });

        h+=`</div></div>`;  // close bpl-div + container
      });

      h+=`</div></div>`;  // close at-div + container
    });

    h+=`</div>`;  // close area div
  });

  wrap.innerHTML=h;
  // run initial sum checks
  SHEETS().forEach(sh=>wcfgCheckAreaSum(sh));
}

// ── Toggle helper ──
function wcfgToggle(id){
  const el=document.getElementById(id); if(!el) return;
  const show=el.style.display==='none';
  el.style.display=show?'':'none';
  const prev=el.previousElementSibling;
  if(prev){ const arrow=prev.querySelector('span'); if(arrow&&arrow.textContent.includes('▶')||arrow&&arrow.textContent.includes('▼')) arrow.textContent=show?'▼':'▶'; }
}

// ── Sum validation helpers ──
function wcfgCheckSum(ids, spanId, warnBelow){
  const total=ids.reduce((s,id)=>{ const el=document.getElementById(id); return s+(el?parseFloat(el.value)||0:0);},0);
  const span=document.getElementById(spanId); if(!span) return;
  const ok=Math.abs(total-100)<0.6;
  span.textContent=ok?'✅':'⚠️'+total.toFixed(1)+'%';
  span.style.color=ok?'var(--green)':'var(--red)';
  return ok;
}
function wcfgCheckAreaSum(sh){
  const shQs=Q.filter(q=>q.sheet===sh);
  const atBks=[...new Set(shQs.map(q=>q.bpl_num))];
  const ids=atBks.map(bk=>'w-at-'+sh+'_'+bk);
  wcfgCheckSum(ids,'wcfg-sum-'+sh);
}
function wcfgCheckBplSum(sh,atBk){
  const shQs=Q.filter(q=>q.sheet===sh&&q.bpl_num===atBk);
  const bplKeys=[...new Set(shQs.map(q=>sh+'_'+atBk+'_'+(q.subattr||'').replace(/\W+/g,'_')))];
  const ids=bplKeys.map(k=>'w-bpl-'+k.replace(/[^a-zA-Z0-9]/g,'_'));
  wcfgCheckSum(ids,'wcfg-sum-'+sh+'-'+atBk);
}
function wcfgCheckCompSum(bplUid, bplK){
  // bplK like "IFT_1_ENTORNO_Y_SEGURIDAD_EXTERNA"
  const parts=bplK.split('_');
  const sh=parts[0]; const atBk=parseInt(parts[1]);
  const subattrRaw=parts.slice(2).join('_');
  const compQs=Q.filter(q=>q.sheet===sh&&q.bpl_num===atBk&&(q.subattr||'').replace(/\W+/g,'_')===subattrRaw);
  const ids=compQs.map(q=>'w-comp-'+q.comp_num.replace(/\./g,'_'));
  wcfgCheckSum(ids,'wcfg-sum-'+bplUid);
}

// ── Update handlers ──
function wcfgUpdateAt(sh,atBk,val){
  const k=sh+'_'+atBk; WCfg.at[k]=parseFloat(val)/100||0;
  wcfgCheckAreaSum(sh); saveWCfg();
}
function wcfgUpdateBpl(bplK,val,sh,atBk){
  WCfg.bpl[bplK]=parseFloat(val)/100||0;
  const bplUid=bplK.replace(/[^a-zA-Z0-9]/g,'_');
  wcfgCheckBplSum(sh,atBk); saveWCfg();
}
function wcfgUpdateComp(compNum,val,bplUid){
  WCfg.comp[compNum]=parseFloat(val)/100||0;
  // find sh+atBk from bplUid to recheck BPL sum
  const q=Q.find(q=>q.comp_num===compNum);
  if(q){ const bplK=q.sheet+'_'+q.bpl_num+'_'+(q.subattr||'').replace(/\W+/g,'_'); wcfgCheckCompSum(bplUid,bplK); }
  saveWCfg();
}

// ── CRITICOS ──
const CRIT={};
Q.forEach(q=>{ if(q.critico){ if(!CRIT[q.critico]) CRIT[q.critico]={tag:q.critico,bpl_name:q.bpl_name,subattr:q.subattr||q.bpl_name,sheet:q.sheet,qs:[]}; CRIT[q.critico].qs.push(q.comp_num); }});
const CRIT_LIST=Object.values(CRIT).sort((a,b)=>+a.tag.replace('CRITICO ','')-+b.tag.replace('CRITICO ',''));

// ── FORMAT ──
function fmt(v){ if(v===null||v===undefined) return '—'; return (v*100).toFixed(1)+'%'; }
function fmtP(v){ if(isNaN(v)||v===null) return '—'; return parseFloat(v).toFixed(1)+'%'; }
function scoreColor(v){
  if(v===null||v===undefined) return 'var(--g400)';
  const p=typeof v==='number'&&v<=1?v*100:v;
  if(p>=THR.pro) return '#2e7d32';
  if(p>=THR.act) return '#00695c';
  if(p>=THR.rea) return '#e65100';
  return '#c62828';
}
// Returns correct total crits for an audit (frozen use their own, live use CRIT_LIST)
function auditTotalCrits(audit){
  if(audit && audit.totalCrits) return audit.totalCrits;
  return CRIT_LIST.length;
}

// Display frozen audit scores directly without recalculating
function displayFrozenScores(a){
  const sc = a.scores || {};
  const total = sc.total || 0;
  const p = (total*100).toFixed(1)+'%';
  const cat = recomputeCategory(a);
  const color = scoreColor(total);
  const totalCrits = auditTotalCrits(a);

  // Sidebar
  const sbSc = document.getElementById('sb-score');
  if(sbSc) sbSc.textContent = p;
  const sbCat = document.getElementById('sb-cat');
  if(sbCat){ sbCat.textContent = cat; sbCat.className = 'cat-pill cp-'+cat; }
  const sbSub = document.getElementById('sb-sub');
  if(sbSub) sbSub.textContent = (sc.answered||0)+' / '+Q.length+' respondidas';

  // KPIs
  const kpiSc = document.getElementById('kpi-score');
  if(kpiSc){ kpiSc.textContent = p; kpiSc.style.color = color; }
  const kpiBpl = document.getElementById('kpi-bpl');
  if(kpiBpl) kpiBpl.textContent = (sc.critMet||0)+'/'+totalCrits;
  const kpiResp = document.getElementById('kpi-resp');
  if(kpiResp) kpiResp.textContent = (sc.answered||0)+'/'+Q.length;
  const kpiNa = document.getElementById('kpi-na');
  if(kpiNa) kpiNa.textContent = sc.naCount||0;

  // Result description
  // Update banner (big category display)
  const banner = document.getElementById('res-banner');
  if(banner) banner.className = 'res-banner rb-'+cat;
  const resCat = document.getElementById('res-cat');
  if(resCat){ resCat.textContent = cat; resCat.className = 'rb-cat'; }
  const resSc = document.getElementById('res-sc');
  if(resSc) resSc.textContent = p;
  const resDet = document.getElementById('res-det');
  const _ftc = auditTotalCrits(a);
  const _fdm = {
    PROACTIVO:`≥${THR.pro}% y ${sc.critMet}/${_ftc} condicionales críticos → PROACTIVO`,
    ACTIVO:`${(total*100).toFixed(1)}% con ${sc.critMet}/${_ftc} BPL → ACTIVO`,
    REACTIVO:`${(total*100).toFixed(1)}% → REACTIVO`,
    INACTIVO:`${(total*100).toFixed(1)}% → INACTIVO`
  };
  if(resDet) resDet.textContent = _fdm[cat]||'';

  // Area bars in sidebar and dashboard
  const areas = sc.areas || {};
  SHEETS().forEach(sh=>{
    const v = areas[sh]||0;
    const col = scoreColor(v);
    const pb = document.getElementById('pb-'+sh);
    if(pb) pb.style.width = (v*100).toFixed(0)+'%';
    const np = document.getElementById('np-'+sh);
    if(np){ np.textContent = (v*100).toFixed(1)+'%'; np.style.color = col; }
    const dbf = document.getElementById('dbf-'+sh);
    if(dbf){ dbf.style.width = (v*100).toFixed(0)+'%'; dbf.style.background = col; }
    const dbp = document.getElementById('dbp-'+sh);
    if(dbp){ dbp.textContent = (v*100).toFixed(1)+'%'; dbp.style.color = col; }
  });

  // Dashboard total bar
  const dbfTotal = document.getElementById('dbf-total');
  if(dbfTotal){ dbfTotal.style.width = (total*100).toFixed(0)+'%'; dbfTotal.style.background = color; }
  const dbpTotal = document.getElementById('dbp-total');
  if(dbpTotal){ dbpTotal.textContent = p; dbpTotal.style.color = color; }

  // Score label
  const mxScore = document.getElementById('mx-score-lbl');
  if(mxScore) mxScore.textContent = p;
  const mxBpl = document.getElementById('mx-bpl-cnt');
  if(mxBpl) mxBpl.textContent = (sc.critMet||0)+'/'+totalCrits;
  const critCnt = document.getElementById('crit-cnt');
  if(critCnt) critCnt.textContent = (sc.critMet||0)+'/'+totalCrits;

  // Matrix highlight
  const _frozenMx = (a.weights&&a.weights.matrixCfg)||MATRIX_CFG;
  const scoreRow = total*100>=THR.pro?0:total*100>=THR.act?1:total*100>=50?2:3;
  renderCritMatrix(sc.critMet||0, scoreRow, _frozenMx);

  // Override all crit displays with frozen values
  const critStatus = sc.critStatus || {};
  // FIX: soporta strings "met"/"unmet" (formato viejo) y objetos {st,pct} (formato nuevo)
  const _stOf = function(v){ return (v && typeof v === 'object') ? (v.st||'pending') : (v||'pending'); };
  const _pctOf = function(v){ return (v && typeof v === 'object') ? (v.pct||0) : (_stOf(v)==='met'?1:0); };
  const metCount   = Object.values(critStatus).filter(function(v){return _stOf(v)==='met';}).length;
  const unmetCount = Object.values(critStatus).filter(function(v){return _stOf(v)==='unmet';}).length;
  const pendCount  = Math.max(0, totalCrits - metCount - unmetCount);

  // KPI badge
  const kpiBpl2 = document.getElementById('kpi-bpl');
  if(kpiBpl2) kpiBpl2.textContent = metCount+'/'+totalCrits;
  const critCnt2 = document.getElementById('crit-cnt');
  if(critCnt2) critCnt2.textContent = metCount+'/'+totalCrits;
  const mxBpl2 = document.getElementById('mx-bpl-cnt');
  if(mxBpl2) mxBpl2.textContent = metCount+'/'+totalCrits;

  // Summary row (cs-met, cs-unmet, cs-pend)
  const csMet = document.getElementById('cs-met');
  const csUnmet = document.getElementById('cs-unmet');
  const csPend = document.getElementById('cs-pend');
  if(csMet) csMet.textContent = metCount+' cumplidos';
  if(csUnmet) csUnmet.textContent = unmetCount+' no cumplidos';
  if(csPend) csPend.textContent = pendCount+' pendientes';

  // FIX: actualizar tarjetas individuales iterando sobre critStatus directamente
  // (no depende de CRIT_LIST para evitar desincronismos de IDs)
  Object.entries(critStatus).forEach(function(entry){
    var tag = entry[0]; var val = entry[1];
    var st  = _stOf(val);
    var pct = _pctOf(val);
    // buildCritGrid usa .replace(' ','_') — solo primer espacio — probar ambas variantes
    [tag.replace(' ','_'), tag.replace(/\s+/g,'_')].forEach(function(id){
      var elCard = document.getElementById('cc-'+id);
      if(elCard) elCard.className = 'crit-card '+st;
      var elIcon = document.getElementById('cci-'+id);
      if(elIcon) elIcon.textContent = st==='met'?'✅':st==='unmet'?'❌':'⭕';
      var elFill = document.getElementById('ccf-'+id);
      if(elFill){ elFill.style.width=(pct*100).toFixed(0)+'%'; elFill.style.background=st==='met'?'#66bb6a':st==='unmet'?'#ef5350':'var(--g300)'; }
    });
  });
}

function recomputeCategory(audit){
  const s=audit.scores||{};
  // FROZEN audits: always use stored category — never recalculate
  if(audit.frozen && s.category) return s.category;
  const total=s.total||0; const critMet=s.critMet||0;
  const mx=(audit.weights&&audit.weights.matrixCfg)?audit.weights.matrixCfg:MATRIX_CFG;
  const p=total*100;
  const scoreRow=p>=THR.pro?0:p>=THR.act?1:p>=THR.rea?2:3;
  const totalCrit=CRIT_LIST.length;
  let bplCol=mx.bands.length-1;
  if(critMet<totalCrit){
    for(let i=0;i<mx.bands.length-1;i++){
      if(mx.bands[i].max!==null&&critMet<=mx.bands[i].max){bplCol=i;break;}
    }
  }
  const code=((mx.cells||[])[scoreRow]||[])[bplCol]||'IN';
  return {PR:'PROACTIVO',AC:'ACTIVO',RE:'REACTIVO',IN:'INACTIVO'}[code]||'INACTIVO';
}
function catBadge(c){ const m={PROACTIVO:'b-green',ACTIVO:'b-teal',REACTIVO:'b-amber',INACTIVO:'b-red'}; return `<span class="badge ${m[c]||'b-gray'}">${c||'—'}</span>`; }
function pctBadge(v){ const n=parseFloat(v); if(isNaN(n)) return '<span class="badge b-gray">—</span>'; const c=n>=THR.pro?'b-green':n>=THR.act?'b-teal':n>=THR.rea?'b-amber':'b-red'; return `<span class="badge ${c}">${n.toFixed(1)}%</span>`; }

// ── BUILD FORM ──
function buildForm(){
  const wrap=document.getElementById('form-sections');
  SHEETS().forEach(sh=>{
    const shQs=Q.filter(q=>q.sheet===sh);
    const bpls={};
    shQs.forEach(q=>{
      const bk=q.bpl_num;
      if(!bpls[bk]) bpls[bk]={num:bk,name:q.bpl_name,weight:q.bpl_weight,sas:{}};
      const sk=(q.subattr||'').replace(/[^\w]/g,'_');
      const skL=q.subattr||'';
      if(!bpls[bk].sas[sk]) bpls[bk].sas[sk]={label:skL,qs:[]};
      bpls[bk].sas[sk].qs.push(q);
    });
    const color=AC[sh];
    let html=`<div class="area-wrap" id="aw-${sh}">
      <div class="area-hdr" style="background:${color}" onclick="togArea('${sh}')">
        <span class="area-badge" style="background:rgba(0,0,0,.25);color:#fff">${sh}</span>
        <span class="area-name">${AN[sh]}</span>
        <span class="area-score-pill" id="asc-${sh}">—</span>
        <span class="area-chev open" id="ach-${sh}">▼</span>
      </div>
      <div class="area-body" id="ab-${sh}">`;
    Object.values(bpls).forEach(bpl=>{
      const bk=bpl.num;
      html+=`<div id="bplb-${sh}-${bk}">
        <div class="bpl-hdr" onclick="togBpl('${sh}',${bk})">
          <div class="bpl-num">${bk}</div>
          <div class="bpl-name-txt">${bpl.name}</div>
          <div class="bpl-wtag">peso: ${(bpl.weight*100).toFixed(0)}%</div>
          <div class="bpl-score-chip" id="bsc-${sh}-${bk}" style="background:var(--g100);color:var(--g400)">—</div>
          <div class="bpl-chev open" id="bch-${sh}-${bk}">▼</div>
        </div>
        <div id="bplc-${sh}-${bk}">`;
      Object.values(bpl.sas).forEach(sa=>{
        const sk=sa.label.replace(/[^\w]/g,'_');
        html+=`<div class="sa-hdr"><span style="color:${color};font-size:9px">▪</span> ${sa.label}<span class="sa-score" id="sas-${sh}-${bk}-${sk}" style="color:var(--g400)">—</span></div>`;
        sa.qs.forEach(q=>{
          const k=q.comp_num.replace(/\./g,'_'); const isCrit=!!q.critico;
          const _isPeso0=(q.bpl_weight===0||q.bpl_weight==='0'||q.weight_attr===0||q.peso_bpl===0);
          html+=`<div class="q-row${isCrit?' crit':_isPeso0?' peso-cero':''}" id="qr-${k}" data-peso0="${_isPeso0}">
            <div class="q-num">${q.comp_num}</div>
            <div class="q-main">
              <div class="q-top">
                <div class="q-text">${q.question}</div>
                ${isCrit?`<span class="crit-badge">🔴 ${q.critico}</span>`:''}
                ${_isPeso0?`<span style="font-size:9px;background:#ede7f6;color:#7e57c2;border-radius:4px;padding:1px 6px;font-weight:700;margin-left:4px">PESO 0 · N/A sugerido</span>`:''}
              </div>
              <textarea class="q-com" id="com-${k}" placeholder="Observación..." rows="1" oninput="setCom('${q.comp_num}',this.value)"></textarea>
            </div>
            <div class="q-ctrl">
              <button class="tgl tg-si" id="si-${k}" onclick="setA('${q.comp_num}','si')">SÍ</button>
              <button class="tgl tg-no" id="no-${k}" onclick="setA('${q.comp_num}','no')">NO</button>
              <button class="tgl tg-na" id="na-${k}" onclick="setA('${q.comp_num}','na')">N/A</button>
            </div>
            <div class="q-cmp-row" id="qcmp-${k}"></div>
          </div>`;
        });
      });
      html+=`</div>
        <div class="bpl-sub" id="bplsb-${sh}-${bk}">
          <div class="bpl-sub-lbl">BPL ${bk}</div>
          <div class="bpl-sub-track"><div class="bpl-sub-fill" id="bsf-${sh}-${bk}" style="background:${color};width:0%"></div></div>
          <div class="bpl-sub-pct" id="bsp-${sh}-${bk}" style="color:${color}">—</div>
          <div class="bpl-sub-contrib">peso ${(bpl.weight*100).toFixed(0)}% → <strong id="bcon-${sh}-${bk}">—</strong></div>
        </div></div>`;
    });
    // Area subtotal
    html+=`<div class="area-sub">
      <div class="as-lbl" style="color:${color}">${AN[sh]} · Subtotal</div>
      <div class="as-bpls" id="asbpls-${sh}"></div>
      <div class="as-total" id="asttl-${sh}" style="background:${color}22;color:${color}">—</div>
      <span style="font-size:10px;color:var(--g400)">× ${(AW[sh]*100).toFixed(0)}%</span>
    </div>`;
    html+=`</div></div>`;
    wrap.innerHTML+=html;
  });
}

function buildCritGrid(){
  // Dynamic byArea supports custom areas (not just the 4 hardcoded base areas)
  const byArea={};
  SHEETS().forEach(sh=>{byArea[sh]=[];});
  CRIT_LIST.forEach(c=>{ if(byArea[c.sheet]) byArea[c.sheet].push(c); else byArea[c.sheet]=[c]; });
  let h='';
  SHEETS().forEach(sh=>{
    const areaItems=byArea[sh]||[]; if(!areaItems.length) return;
    const color=AC[sh]||'#607d8b';
    h+=`<div style="margin-bottom:12px">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:800;text-transform:uppercase;
        letter-spacing:1.5px;color:${color};padding:3px 0;border-bottom:2px solid ${color}22;margin-bottom:6px">
        ${sh} · ${AN[sh]||sh}
      </div>
      <div class="crit-visual-grid">`;
    areaItems.forEach(c=>{
      const tagId=c.tag.replace(' ','_');
      // Show subattr (BPL) name, not atributo
      const bplLabel=c.subattr||c.bpl_name;
      h+=`<div class="crit-card pending" id="cc-${tagId}">
        <div class="crit-card-icon" id="cci-${tagId}">⭕</div>
        <div class="crit-card-num">${c.tag}</div>
        <div class="crit-card-name" style="font-size:9px;line-height:1.3">${bplLabel}</div>
        <div class="crit-card-qs">${c.qs.length} comp</div>
        <div class="crit-progress-bar">
          <div class="crit-progress-fill" id="ccf-${tagId}" style="background:var(--g300);width:0%"></div>
        </div>
      </div>`;
    });
    h+=`</div></div>`;
  });
  document.getElementById('crit-grid').innerHTML=h;
}

// ── ANSWER / COMMENT ──
function setA(comp,val){
  const k=comp.replace(/\./g,'_');
  ans[comp]=val;
  ['si','no','na'].forEach(v=>{ const b=document.getElementById(v+'-'+k); if(b) b.classList.toggle('on',v===val); });
  const row=document.getElementById('qr-'+k);
  if(row) row.style.background=val==='si'?'#f1f8e9':val==='no'?'#fce4ec':'#fff8e1';
  recalc();
}
function setCom(comp,val){
  if(val.trim()) coms[comp]=val; else delete coms[comp];
  document.getElementById('kpi-com').textContent=Object.keys(coms).length;
}

// ── DISTRIBUTOR CHANGE GUARD ──
let pendingDistChange = false;
function onDistChange(){
  const newDist = document.getElementById('sel-dist').value;
  if(Object.keys(ans).length > 0){
    if(!confirm('¿Cambiar distribuidor? Se perderán las respuestas no guardadas. ¿Continuar?')){
      // Revert
      // We need to restore previous value - save it first
      document.getElementById('sel-dist').value = document.getElementById('sel-dist').getAttribute('data-prev')||'';
      return;
    }
  }
  document.getElementById('sel-dist').setAttribute('data-prev', newDist);
  resetForm();
  document.getElementById('tb-dist').textContent = newDist ? '· '+newDist : '';
  updateHistPanelForDist(newDist);
  setTimeout(renderCmpColumns, 50);
}

function onEdicionChange(){
  if(Object.keys(ans).length > 0){
    if(!confirm('¿Cambiar edición? Se perderán las respuestas no guardadas. ¿Continuar?')){
      return;
    }
  }
  resetForm();
  const ed = document.getElementById('sel-edicion').value;
  const pv = document.getElementById('sb-prog-val');
  if(pv) pv.textContent = '🇺🇾 URUGUAY · ' + (ed||'—');
  setTimeout(renderCmpColumns, 50);
}
function resetForm(){
  _loadedAuditMatrix = null; // Clear saved matrix on new form
  _loadedFrozenAudit = null;  // Clear frozen audit on new form
  ans={}; coms={};
  Q.forEach(q=>{
    const k=q.comp_num.replace(/\./g,'_');
    ['si','no','na'].forEach(v=>{ const b=document.getElementById(v+'-'+k); if(b) b.classList.remove('on'); });
    const row=document.getElementById('qr-'+k); if(row) row.style.background='';
    const com=document.getElementById('com-'+k); if(com) com.value='';
  });
  document.getElementById('kpi-com').textContent=0;
  recalc();
}

function updateTbDist(){
  const v=document.getElementById('sel-dist').value;
  document.getElementById('tb-dist').textContent=v?'· '+v:'';
}

// ── CORE SCORING ──
function computeScores(answers, weightOverride){
  // ── FULLY NORMALIZED 3-LEVEL SCORING ──────────────────────────────
  // weightOverride: optional {aw, wcfg} from a saved audit — prevents historical distortion
  // Level 1: Components within a BPL (subattr) → normalized fraction
  // Level 2: BPLs (subattrs) within an Atributo → weighted avg, normalized by sum of bplW
  // Level 3: Atributos within an Area → weighted avg, normalized by sum of atW
  // This guarantees: all-SI = 100% regardless of raw weight sums in Q_BASE
  const res={areas:{},bpls:{},subattrs:{},total:0};

  // Use snapshot weights if provided (historical audit), else use current
  const _AW   = (weightOverride&&weightOverride.aw)   ? weightOverride.aw   : AW;
  const _WCfg = (weightOverride&&weightOverride.wcfg) ? weightOverride.wcfg : WCfg;

  // WCfg helpers (with Q_BASE fallback)
  function _atW(q){ const k=q.sheet+'_'+q.bpl_num; return _WCfg.at[k]!==undefined?_WCfg.at[k]:q.bpl_weight; }
  function _bplW(q){ const k=q.sheet+'_'+q.bpl_num+'_'+(q.subattr||'').replace(/\W+/g,'_'); return _WCfg.bpl[k]!==undefined?_WCfg.bpl[k]:q.peso_bpl; }
  function _compW(q){ return _WCfg.comp[q.comp_num]!==undefined?_WCfg.comp[q.comp_num]:q.weight_attr; }

  SHEETS().forEach(sh=>{
    const shQs=Q.filter(q=>q.sheet===sh);

    // ── Step 1: score each (bpl_num × subattr) group as a fraction ──
    const saScores={}; // key=sh_bk_sk → {score:0..1, bplW, label, answered}
    const seen={};
    shQs.forEach(q=>{
      const sk=(q.subattr||'').replace(/[^\w]/g,'_');
      const key=sh+'_'+q.bpl_num+'_'+sk;
      if(!seen[key]){
        seen[key]=true;
        // Compute fraction for this group
        let sumW=0, siW=0;
        shQs.filter(x=>x.bpl_num===q.bpl_num&&(x.subattr||'').replace(/[^\w]/g,'_')===sk).forEach(x=>{
          const a=answers[x.comp_num]; const cw=_compW(x);
          if(a!=='na'&&a!==undefined){ sumW+=cw; if(a==='si') siW+=cw; }
        });
        saScores[key]={score:sumW>0?siW/sumW:0, bplW:_bplW(q), label:q.subattr||'', answered:sumW>0};
        res.subattrs[key]={pct:sumW>0?siW/sumW:null, label:q.subattr||''};
      }
    });

    // ── Step 2: score each Atributo (bpl_num) as weighted avg of BPL scores ──
    const bplKeys=[...new Set(shQs.map(q=>q.bpl_num))];
    let areaWSum=0, areaSumW=0;

    bplKeys.forEach(bk=>{
      const bpGroups=Object.entries(saScores).filter(([k])=>k.startsWith(sh+'_'+bk+'_'));
      let bplScoreSum=0, bplWSum=0;
      bpGroups.forEach(([,v])=>{
        if(v.answered){ bplScoreSum+=v.score*v.bplW; bplWSum+=v.bplW; }
      });
      const bplScore=bplWSum>0?bplScoreSum/bplWSum:0;
      const atW=_atW(shQs.find(q=>q.bpl_num===bk));
      const atName=(shQs.find(q=>q.bpl_num===bk)||{}).bpl_name||'';
      res.bpls[sh+'_'+bk]={score:bplScore,name:atName,weight:atW,contrib:bplScore*atW,sheet:sh,num:bk};
      areaWSum+=bplScore*atW; areaSumW+=atW;
    });

    // ── Step 3: area score = weighted avg of atributo scores ──
    res.areas[sh]=areaSumW>0?areaWSum/areaSumW:0;
    if(!NV[sh]) res.total+=res.areas[sh]*(_AW[sh]||AW[sh]||0);
  });
  // Normalize total by sum of core area weights (so NV areas don't distort scale)
  const _coreWSum=SHEETS_CORE().reduce((s,sh)=>s+(_AW[sh]||AW[sh]||0),0);
  if(_coreWSum>0&&_coreWSum<0.999) res.total/=_coreWSum;
  let critMet=0; const critStatus={};
  CRIT_LIST.forEach(c=>{
    const allSi=c.qs.every(q=>answers[q]==='si');
    const anyNo=c.qs.some(q=>answers[q]==='no');
    const pct=c.qs.filter(q=>answers[q]==='si').length/c.qs.length;
    const st=allSi?'met':anyNo?'unmet':'pending';
    critStatus[c.tag]={st,pct}; if(st==='met') critMet++;
  });
  res.critMet=critMet; res.critStatus=critStatus;
  const p=res.total*100;
  // bplCol uses the loaded audit's matrix (historical) or current MATRIX_CFG
  const _activeMx = (typeof _loadedAuditMatrix!=='undefined' && _loadedAuditMatrix)
    ? _loadedAuditMatrix
    : (typeof MATRIX_CFG!=='undefined' ? MATRIX_CFG : MATRIX_DEFAULT);
  const _mxBands = _activeMx.bands;
  const _totalCrit = CRIT_LIST.length;
  // If met all critics OR meets/exceeds the last band's min, use last band
  let bplCol = _mxBands.length - 1;
  if(critMet < _totalCrit){
    // Only look for a lower band if didn't meet all
    for(let _bi = 0; _bi < _mxBands.length - 1; _bi++){
      if(_mxBands[_bi].max !== null && critMet <= _mxBands[_bi].max){
        bplCol = _bi; break;
      }
    }
  }
  const scoreRow=p>=THR.pro?0:p>=THR.act?1:p>=THR.rea?2:3;
  // Matrix: row 3 (INACTIVO) only has INACTIVO at col 0, rest blank
  const answered=Object.keys(answers).length;
  // Use dynamic MATRIX_CFG for category
  const _mxCells = _activeMx.cells;
  const _mxCodes=(_mxCells[scoreRow]||[])[bplCol]||'IN';
  const _catMap={PR:'PROACTIVO',AC:'ACTIVO',RE:'REACTIVO',IN:'INACTIVO'};
  res.category=answered>0?(_catMap[_mxCodes]||'INACTIVO'):'PENDIENTE';
  res.bplCol=bplCol; res.scoreRow=scoreRow;
  res.answered=answered;
  res.naCount=Object.values(answers).filter(v=>v==='na').length;
  return res;
}

// Update only detail sections (BPL atributos, crit grid) without touching totals
function _recalcDetailOnly(sc){
  // Crit grid matrix
  const _mxRow = (sc.total||0)*100>=THR.pro?0:(sc.total||0)*100>=THR.act?1:(sc.total||0)*100>=50?2:3;
  renderCritMatrix((sc.critMet||0), _mxRow);
  // BPL detail by area
  renderBplDetailByArea(sc);
}

function recalc(){
  const sc=computeScores(ans);
  const pStr=sc.answered>0?fmt(sc.total):'—';
  // Sidebar
  document.getElementById('sb-score').textContent=pStr;
  const _unanswered = Q.length - sc.answered;
  const _sbSub = _unanswered > 0
    ? `⚠️ ${_unanswered} sin responder · ${sc.answered}/${Q.length}`
    : `✅ Todas respondidas · ${sc.answered}/${Q.length}`;
  document.getElementById('sb-sub').textContent = _sbSub;
  const sbCat=document.getElementById('sb-cat');
  sbCat.textContent=sc.category; sbCat.className='cat-pill cp-'+sc.category;
  // Nav bars
  SHEETS().forEach(sh=>{
    const qs=Q.filter(q=>q.sheet===sh);
    const aAns=qs.filter(q=>ans[q.comp_num]).length;
    const _pbEl=document.getElementById('pb-'+sh); if(_pbEl) _pbEl.style.width=(aAns/Math.max(1,qs.length)*100).toFixed(0)+'%';
    const _npEl=document.getElementById('np-'+sh); if(_npEl) _npEl.textContent=sc.answered>0?fmt(sc.areas[sh]):'—';
    const ascEl=document.getElementById('asc-'+sh); if(ascEl) ascEl.textContent=sc.answered>0?fmt(sc.areas[sh]):'—';
  });
  // KPIs
  document.getElementById('kpi-resp').textContent=sc.answered+'/'+Q.length;
  // Unanswered alert banner
  const _pendN = Q.length - sc.answered;
  let _alertEl = document.getElementById('unanswered-alert-banner');
  if(!_alertEl){
    _alertEl = document.createElement('div');
    _alertEl.id = 'unanswered-alert-banner';
    _alertEl.style.cssText = 'margin:8px 0;padding:10px 14px;border-radius:8px;font-size:12px;font-weight:700;display:flex;align-items:center;gap:8px;';
    const resCards = document.querySelector('.res-cards');
    if(resCards) resCards.before(_alertEl);
  }
  if(_pendN > 0){
    _alertEl.style.background='#fff8e1';
    _alertEl.style.border='1.5px solid #ffb300';
    _alertEl.style.color='#e65100';
    _alertEl.innerHTML=`⚠️ <span>${_pendN} pregunta${_pendN>1?'s':''} sin responder — los puntajes pueden ser inexactos</span>
      <button onclick="scrollToUnanswered()" style="margin-left:auto;padding:3px 10px;background:#ff9800;border:none;border-radius:5px;color:#fff;font-size:11px;font-weight:700;cursor:pointer">Ver pendientes</button>`;
    _alertEl.style.display='flex';
  } else {
    _alertEl.style.display='none';
  }
  document.getElementById('kpi-bpl').textContent=sc.critMet+'/'+CRIT_LIST.length;
  document.getElementById('kpi-na').textContent=sc.naCount;
  // Form BPL subtotals
  SHEETS().forEach(sh=>{
    const shQs=Q.filter(q=>q.sheet===sh);
    const bplKeys=[...new Set(shQs.map(q=>q.bpl_num))];
    const color=AC[sh];
    const asbpls=document.getElementById('asbpls-'+sh);
    if(asbpls) asbpls.innerHTML=bplKeys.map(bk=>{
      const b=sc.bpls[sh+'_'+bk]||{score:0}; return `<div class="as-bpl"><div class="as-bpl-n">BPL ${bk}</div><div class="as-bpl-v" style="color:${scoreColor(b.score)}">${sc.answered>0?fmt(b.score):'—'}</div></div>`;
    }).join('');
    const asttl=document.getElementById('asttl-'+sh);
    if(asttl){ asttl.textContent=sc.answered>0?fmt(sc.areas[sh]):'—'; asttl.style.color=scoreColor(sc.areas[sh]); }
    bplKeys.forEach(bk=>{
      const b=sc.bpls[sh+'_'+bk]||{score:0,contrib:0};
      const chip=document.getElementById('bsc-'+sh+'-'+bk);
      if(chip){ chip.textContent=sc.answered>0?fmt(b.score):'—'; chip.style.background=sc.answered>0?scoreColor(b.score)+'22':'var(--g100)'; chip.style.color=sc.answered>0?scoreColor(b.score):'var(--g400)'; }
      const sp=document.getElementById('bsp-'+sh+'-'+bk); if(sp) sp.textContent=sc.answered>0?fmt(b.score):'—';
      const sf=document.getElementById('bsf-'+sh+'-'+bk); if(sf) sf.style.width=(sc.answered>0?b.score*100:0).toFixed(0)+'%';
      const bc=document.getElementById('bcon-'+sh+'-'+bk); if(bc) bc.textContent=sc.answered>0?fmt(b.contrib):'—';
    });
    // Subattr scores
    shQs.forEach(q=>{
      const sk=sh+'_'+q.bpl_num+'_'+(q.subattr||'').replace(/[^\w]/g,'_');
      const saK=(q.subattr||'').replace(/[^\w]/g,'_');
      const el=document.getElementById('sas-'+sh+'-'+q.bpl_num+'-'+saK);
      if(el){ const sv=sc.subattrs[sk]; if(sv){ el.textContent=sv.pct!==null?fmt(sv.pct):'—'; el.style.color=sv.pct!==null?scoreColor(sv.pct):'var(--g400)'; } }
    });
  });
  // Dashboard
  const banner=document.getElementById('res-banner');
  banner.className='res-banner rb-'+sc.category;
  document.getElementById('res-cat').textContent=sc.category;
  document.getElementById('res-sc').textContent=pStr;
  const _tc=CRIT_LIST.length;
  const dm={PROACTIVO:`≥${THR.pro}% y ${sc.critMet}/${_tc} condicionales críticos → PROACTIVO`,ACTIVO:`${fmt(sc.total)} con ${sc.critMet}/${_tc} BPL → ACTIVO`,REACTIVO:`${fmt(sc.total)} con ${sc.critMet}/13 BPL → REACTIVO`,INACTIVO:`${fmt(sc.total)} — Por debajo del umbral mínimo`,PENDIENTE:'Completá la auditoría para ver el resultado'};
  document.getElementById('res-det').textContent=dm[sc.category]||'';
  document.getElementById('mx-bpl-cnt').textContent=sc.critMet+'/'+CRIT_LIST.length;
  document.getElementById('mx-score-lbl').textContent=pStr;
  // Determine current score row for matrix highlight
  const _mxRow = sc.total>=THR.pro/100?0:sc.total>=THR.act/100?1:sc.total>=0.5?2:3;
  renderCritMatrix(sc.critMet, _mxRow);
  document.getElementById('crit-cnt').textContent=sc.critMet+'/'+CRIT_LIST.length;
  // Area bars (null-safe for dynamic elements)
  SHEETS().forEach(sh=>{
    const p=sc.areas[sh]; const col=scoreColor(p);
    const fill=document.getElementById('dbf-'+sh);
    const pct=document.getElementById('dbp-'+sh);
    if(fill){ fill.style.width=(sc.answered>0?p*100:0).toFixed(0)+'%'; fill.style.background=col; }
    if(pct){ pct.textContent=sc.answered>0?fmt(p):'—'; pct.style.color=col; }
  });
  const tc=scoreColor(sc.total);
  const _dbtFill=document.getElementById('dbf-total');
  const _dbtPct=document.getElementById('dbp-total');
  if(_dbtFill){ _dbtFill.style.width=(sc.answered>0?sc.total*100:0).toFixed(0)+'%'; _dbtFill.style.background=tc; }
  if(_dbtPct){ _dbtPct.textContent=sc.answered>0?fmt(sc.total):'—'; _dbtPct.style.color=tc; }
  // Matrix
  for(let r=0;r<4;r++) for(let c=0;c<4;c++){
    const el=document.getElementById('mx'+r+c);
    if(el) el.classList.toggle('m-cur', sc.answered>0&&r===sc.scoreRow&&c===sc.bplCol);
  }
  // Critical grid
  let metC=0,unmetC=0,pendC=0;
  CRIT_LIST.forEach(c=>{
    const info=sc.critStatus[c.tag]||{st:'pending',pct:0};
    const id=c.tag.replace(' ','_');
    const el=document.getElementById('cc-'+id); if(el) el.className='crit-card '+info.st;
    const ic=document.getElementById('cci-'+id); if(ic) ic.textContent=info.st==='met'?'✅':info.st==='unmet'?'❌':'⭕';
    const fill=document.getElementById('ccf-'+id); if(fill){ fill.style.width=(info.pct*100).toFixed(0)+'%'; fill.style.background=info.st==='met'?'#66bb6a':info.st==='unmet'?'#ef5350':'var(--g300)'; }
    if(info.st==='met') metC++; else if(info.st==='unmet') unmetC++; else pendC++;
  });
  document.getElementById('cs-met').textContent=metC+' cumplidos';
  document.getElementById('cs-unmet').textContent=unmetC+' no cumplidos';
  document.getElementById('cs-pend').textContent=pendC+' pendientes';
  // BPL detail by area
  renderBplDetailByArea(sc);
  // If a frozen audit is loaded, override ALL totals with official scores
  if(_loadedFrozenAudit){ displayFrozenScores(_loadedFrozenAudit); return; }
}

function renderBplDetailByArea(sc){
  const wrap=document.getElementById('bpl-detail-area-wrap'); if(!wrap) return;
  let h='';
  SHEETS().forEach(sh=>{
    const color=AC[sh]; const shQs=Q.filter(q=>q.sheet===sh);
    // For frozen audits, use stored area score; otherwise use computed
    const _frozenAreas = (_loadedFrozenAudit&&_loadedFrozenAudit.scores&&_loadedFrozenAudit.scores.areas)||null;
    const areaSc = _frozenAreas ? (_frozenAreas[sh]||0) : (sc.areas[sh]||0);
    const areaP = sc.answered>0 ? fmt(areaSc) : '—';
    // Get unique Atributos (bpl_name) in order
    const attrOrder=[];
    const seenAttr=new Set();
    shQs.forEach(q=>{ if(!seenAttr.has(q.bpl_num)){ seenAttr.add(q.bpl_num); attrOrder.push({bk:q.bpl_num,name:q.bpl_name,weight:q.bpl_weight}); } });

    h+=`<div class="bpl-area-block">
      <div class="bpl-area-title" style="background:${color}">
        <span class="bpl-area-title-txt">${sh} · ${AN[sh]}</span>
        <span class="bpl-area-score">${areaP}</span>
      </div>
      <table class="bpl-attr-table">
        <thead><tr><th>Atributo (bpl_name)</th><th style="min-width:62px">Score</th><th style="min-width:120px;width:45%">Barra</th><th style="min-width:48px">Peso</th></tr></thead>
        <tbody>`;

    attrOrder.forEach(attr=>{
      const bv=sc.bpls[sh+'_'+attr.bk];
      const attrSc=bv?bv.score:0;
      const attrP=sc.answered>0?fmt(attrSc):'—';
      const attrColor=sc.answered>0?scoreColor(attrSc):'var(--g300)';
      const barW=sc.answered>0?(attrSc*100).toFixed(0):0;
      h+=`<tr>
        <td style="font-size:12px;font-weight:600;color:var(--g800)">${attr.name}</td>
        <td style="font-weight:800;color:${attrColor};font-size:13px">${attrP}</td>
        <td><div style="height:8px;background:var(--g100);border-radius:5px">
          <div style="height:100%;border-radius:5px;background:${attrColor};width:${barW}%;transition:width .4s"></div>
        </div></td>
        <td style="font-size:10px;color:var(--g400)">${(attr.weight*100).toFixed(0)}%</td>
      </tr>`;
    });

    h+=`<tr class="bpl-attr-subtotal">
      <td><strong style="font-family:'Barlow Condensed',sans-serif;letter-spacing:.5px">${AN[sh].toUpperCase()} · SUBTOTAL</strong></td>
      <td style="font-weight:900;color:${scoreColor(areaSc)};font-size:14px">${areaP}</td>
      <td><div style="height:10px;background:var(--g100);border-radius:5px">
        <div style="height:100%;border-radius:5px;background:${scoreColor(areaSc)};width:${sc.answered>0?(areaSc*100).toFixed(0):0}%;transition:width .4s"></div>
      </div></td>
      <td style="font-size:10px;color:var(--g400)">${(AW[sh]*100).toFixed(0)}%</td>
    </tr>`;

    h+=`</tbody></table></div>`;
  });
  wrap.innerHTML=h;
}

// ── TOGGLES ──
function togArea(sh){const b=document.getElementById('ab-'+sh),c=document.getElementById('ach-'+sh);const h=b.style.display==='none';b.style.display=h?'':'none';c.classList.toggle('open',h);}
function togBpl(sh,bk){const b=document.getElementById('bplc-'+sh+'-'+bk),c=document.getElementById('bch-'+sh+'-'+bk);const h=b.style.display==='none';b.style.display=h?'':'none';c.classList.toggle('open',h);}
function goArea(sh){
  // Update active state in dynamic sidebar
  document.querySelectorAll('.ni').forEach(el=>el.classList.remove('on'));
  const ni=document.getElementById('ni-'+sh); if(ni) ni.classList.add('on');
  goTab('form');
  setTimeout(()=>{const el=document.getElementById('aw-'+sh);if(el) el.scrollIntoView({behavior:'smooth',block:'start'});},100);
}
function goTab(t){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.sb-tab').forEach(x=>x.classList.remove('on'));
  document.getElementById('panel-'+t).classList.add('on');
  const idx={'form':0,'dash':1,'global':2,'compare':3,'config':4,'analisis':5}[t];
  if(idx!==undefined) document.querySelectorAll('.sb-tab')[idx].classList.add('on');
  if(t==='global') renderGlobal();
  if(t==='compare') initCompare();
  if(t==='config'){ renderWeightsCfg(); renderMatrixEditor(); edInitAreas(); }
  if(t==='form') flushFormIfDirty();
  if(t==='analisis') initAnalisis();
}
function toggleSaved(){
  const el=document.getElementById('saved-panel');
  el.style.display=el.style.display==='none'?'block':'none';
  if(el.style.display==='block') renderSaved();
}

// ── SAVE / LOAD / DELETE ──
function saveAudit(){
  const dist=document.getElementById('sel-dist').value;
  const fecha=document.getElementById('sel-fecha').value;
  const auditor=document.getElementById('sel-auditor').value;
  const edicion=document.getElementById('sel-edicion').value;
  if(!dist||!fecha){showToast('⚠️ Seleccioná distribuidor y fecha');return;}
  if(Object.keys(ans).length<5){showToast('⚠️ Respondé al menos 5 preguntas');return;}
  const sc=computeScores(ans);
  // Snapshot the weights active at save time so historical recalcs use correct pesos
  const weightSnapshot={
    aw: {...AW},
    wcfg: JSON.parse(JSON.stringify(WCfg)),
    matrixCfg: JSON.parse(JSON.stringify(MATRIX_CFG)),
  };
  const audit={id:Date.now(),distribuidor:dist,fecha,auditor,edicion,answers:{...ans},comments:{...coms},scores:sc,weights:weightSnapshot};
  // Match by dist + edicion
  const idx=saved.findIndex(a=>a.distribuidor===dist&&a.edicion===edicion);
  if(idx>=0){if(!confirm(`¿Reemplazar auditoría de ${dist} (${edicion})?`)) return; saved[idx]=audit;}
  else saved.push(audit);
  persist(); showToast('✅ Guardado: '+dist+' · '+edicion);
  updateAudCnt(); renderSaved(); renderGlobal();
}
function loadAudit(idx){
  const a=saved[idx]; if(!a) return;
  if(Object.keys(ans).length>0&&!confirm('¿Cargar esta auditoría? Se perderán cambios no guardados.')) return;
  ans={...a.answers}; coms={...(a.comments||{})};
  // Store the matrix used when this audit was saved
  _loadedAuditMatrix = (a.weights&&a.weights.matrixCfg) ? a.weights.matrixCfg : null;
  // Track frozen audit so recalc() knows to preserve its scores
  _loadedFrozenAudit = a.frozen ? a : null;
  // Ensure distribuidor is in the select before setting value
  const _selDist=document.getElementById('sel-dist');
  if(!Array.from(_selDist.options).some(o=>o.value===a.distribuidor)){
    const opt=document.createElement('option');
    opt.value=a.distribuidor; opt.textContent=a.distribuidor;
    _selDist.appendChild(opt);
  }
  _selDist.value=a.distribuidor;
  _selDist.setAttribute('data-prev',a.distribuidor);
  document.getElementById('sel-fecha').value=a.fecha;
  document.getElementById('sel-auditor').value=a.auditor||'';
  document.getElementById('sel-edicion').value=a.edicion||'2025';
  document.getElementById('tb-dist').textContent='· '+a.distribuidor;
  Q.forEach(q=>{
    const k=q.comp_num.replace(/\./g,'_'); const v=ans[q.comp_num];
    ['si','no','na'].forEach(x=>{const b=document.getElementById(x+'-'+k);if(b)b.classList.toggle('on',x===v);});
    const row=document.getElementById('qr-'+k);
    if(row&&v) row.style.background=v==='si'?'#f1f8e9':v==='no'?'#fce4ec':'#fff8e1';
    const com=document.getElementById('com-'+k); if(com) com.value=coms[q.comp_num]||'';
  });
  document.getElementById('kpi-com').textContent=Object.keys(coms).length;
  if(_loadedFrozenAudit){
    // FIX: recalc() actualiza accordion y tabla BPL; al final llama displayFrozenScores con los scores guardados
    recalc();
  } else {
    recalc();
  }
  goTab('form'); toggleSaved();
  // Warn if the audit was saved with different area weights than current
  if(a.weights && a.weights.aw){
    const diffs=SHEETS().filter(sh=>Math.abs((a.weights.aw[sh]||0)-(AW[sh]||0))>0.001);
    if(diffs.length){
      const msg=diffs.map(sh=>`${sh}: guardado ${((a.weights.aw[sh]||0)*100).toFixed(0)}% → actual ${((AW[sh]||0)*100).toFixed(0)}%`).join(' · ');
      showToast('⚠️ Pesos distintos a los actuales: '+msg+' — el score guardado es el correcto');
    } else {
      showToast('📂 Cargado: '+a.distribuidor+' · '+(a.edicion||''));
    }
  } else {
    showToast('📂 Cargado: '+a.distribuidor+' · '+(a.edicion||''));
  }
  window.scrollTo({top:0,behavior:'smooth'});
  // Show historical panel button for this distribuidor
  updateHistPanelForDist(a.distribuidor);
  // Update comparison columns after loading
  setTimeout(renderCmpColumns, 50);
}
function deleteAudit(id){
  const a=saved.find(x=>x.id===id);
  if(!a||!confirm(`¿Eliminar auditoría de ${a.distribuidor} (${a.edicion||''})?`)) return;
  saved=saved.filter(x=>x.id!==id); persist();
  showToast('🗑 Eliminado: '+a.distribuidor); updateAudCnt(); renderSaved(); renderGlobal();
}
function clearAll(){
  const edFil=(document.getElementById('saved-fil-ed')||{}).value||'';
  if(edFil){
    if(!confirm('¿Borrar todas las auditorías de la edición '+edFil+'?')) return;
    saved=saved.filter(a=>a.edicion!==edFil);
    showToast('🗑 Edición '+edFil+' eliminada');
  } else {
    if(!confirm('¿Borrar TODAS las auditorías de TODAS las ediciones?')) return;
    saved=[];
    showToast('🗑 Todas las auditorías eliminadas');
  }
  persist(); renderSaved(); renderGlobal(); updateAudCnt();
}
function persist(){
  if(__IS_SNAPSHOT_BROWSER) return;
  localStorage.setItem('bpl_ra2_v6',JSON.stringify(saved));
  localStorage.setItem('bpl_ra2_autoevals',JSON.stringify(autoevals));
}
// ── COMPARACIÓN: helpers ────────────────────────────────────
function _getAEFor(distribuidor, edicion){
  return autoevals.find(a=>a.distribuidor===distribuidor&&a.edicion===edicion)||null;
}
function _getPrevAudit(distribuidor, edicion, overrideEdicion){
  if(overrideEdicion) return saved.find(a=>a.distribuidor===distribuidor&&a.edicion===overrideEdicion)||null;
  const others=saved.filter(a=>a.distribuidor===distribuidor&&a.edicion<edicion);
  if(!others.length) return null;
  others.sort((a,b)=>b.edicion.localeCompare(a.edicion));
  return others[0];
}
function _cmpChipHTML(lbl, val){
  const cls=val==='si'?'cmp-si':val==='no'?'cmp-no':val==='na'?'cmp-na':'cmp-none';
  const icon=val==='si'?'✓':val==='no'?'✗':val==='na'?'—':'·';
  const txt=val==='si'?'SÍ':val==='no'?'NO':val==='na'?'N/A':'—';
  return `<div class="cmp-chip ${cls}" title="${lbl}"><span class="cmp-lbl">${lbl}</span>${icon} ${txt}</div>`;
}

function renderCmpColumns(){
  const dist=(document.getElementById('sel-dist')||{}).value||'';
  const edicion=(document.getElementById('sel-edicion')||{}).value||'';
  const ae=cmpShowAE&&dist&&edicion?_getAEFor(dist,edicion):null;
  const prev=cmpShowPrev&&dist&&edicion?_getPrevAudit(dist,edicion,cmpEdicion||null):null;
  // Show bar whenever a distributor is selected (even without comparison data)
  const bar=document.getElementById('cmp-compare-bar');
  if(bar) bar.style.display=dist?'block':'none';
  // Update edition selector options in comparison bar
  _refreshCmpEdSelect(dist, edicion);
  Q.forEach(q=>{
    const k=q.comp_num.replace(/\./g,'_');
    const el=document.getElementById('qcmp-'+k);
    if(!el) return;
    // Show chips whenever a distributor+edicion is selected and at least one toggle is on
    if(!dist||!edicion||(!cmpShowAE&&!cmpShowPrev)){el.innerHTML='';el.style.display='none';return;}
    el.style.display='flex';
    let html='';
    if(cmpShowAE){
      // null val renders as "—" chip (cmp-none class)
      const v=ae?(ae.answers||{})[q.comp_num]||null:null;
      html+=_cmpChipHTML('AE',v);
    }
    if(cmpShowPrev){
      const v=prev?(prev.answers||{})[q.comp_num]||null:null;
      const lbl=prev?prev.edicion:'PREV';
      html+=_cmpChipHTML(lbl,v);
    }
    el.innerHTML=html;
  });
  renderCmpBar(dist, edicion, ae, prev);
}

function renderCmpBar(dist, edicion, ae, prev){
  const pills=document.getElementById('cmp-bar-pills');
  const sub=document.getElementById('cmp-bar-subtitle');
  if(!pills) return;
  if(sub) sub.textContent=dist?(dist.length>50?dist.slice(0,50)+'…':dist):'';
  if(!dist||!edicion){
    pills.innerHTML='<span style="font-size:10px;color:var(--g400);font-style:italic">Seleccioná un distribuidor y edición para ver comparaciones.</span>';
    return;
  }
  let html='';
  // Current EV score pill
  const curAudit=saved.find(a=>a.distribuidor===dist&&a.edicion===edicion);
  const curScore=curAudit?(curAudit.scores||{}).total||0:null;
  if(curScore!==null){
    html+=`<div class="cmp-score-pill csp-ev"><span class="csp-lbl">Evaluación ${edicion}</span><span class="csp-val">${(curScore*100).toFixed(1)}%</span></div>`;
  }
  // AE score pill — show placeholder if toggle on but no data
  if(cmpShowAE){
    if(ae){
      const aeScore=(ae.scores||{}).total||0;
      html+=`<div class="cmp-score-pill csp-ae"><span class="csp-lbl">Autoevaluación ${edicion}</span><span class="csp-val">${(aeScore*100).toFixed(1)}%</span></div>`;
    } else {
      html+=`<div class="cmp-score-pill csp-ae" style="opacity:.45;border-style:dashed"><span class="csp-lbl">Autoevaluación ${edicion}</span><span class="csp-val" style="font-size:10px;color:var(--g400)">Sin datos — importá EV/AE</span></div>`;
    }
  }
  // Prev edition score pill — show placeholder if toggle on but no data
  if(cmpShowPrev){
    if(prev){
      const prevScore=(prev.scores||{}).total||0;
      html+=`<div class="cmp-score-pill csp-prev"><span class="csp-lbl">Edición ${prev.edicion}</span><span class="csp-val">${(prevScore*100).toFixed(1)}%</span></div>`;
    } else {
      html+=`<div class="cmp-score-pill csp-prev" style="opacity:.45;border-style:dashed"><span class="csp-lbl">Edición Anterior</span><span class="csp-val" style="font-size:10px;color:var(--g400)">Sin ediciones previas</span></div>`;
    }
  }
  pills.innerHTML=html||'<span style="font-size:10px;color:var(--g400);font-style:italic">Activá "Autoevaluación" o "Edición Anterior" para comparar.</span>';
}

function _refreshCmpEdSelect(dist, curEdicion){
  const sel=document.getElementById('cmp-ed-sel');
  if(!sel) return;
  const prevOpts=saved.filter(a=>a.distribuidor===dist&&a.edicion!==curEdicion)
    .map(a=>a.edicion).filter((v,i,arr)=>arr.indexOf(v)===i).sort().reverse();
  let opts='<option value="">— más reciente —</option>';
  prevOpts.forEach(ed=>{ opts+=`<option value="${ed}"${cmpEdicion===ed?' selected':''}>${ed}</option>`; });
  sel.innerHTML=opts;
}

// ── SIDEBAR COLLAPSE ─────────────────────────────────────────
function toggleSidebar(){
  const mini=document.body.classList.toggle('sb-mini');
  try{ localStorage.setItem('bpl_ra2_sb_mini',mini?'1':'0'); }catch(e){}
}

function toggleCmpAE(){
  cmpShowAE=!cmpShowAE;
  const btn=document.getElementById('cmp-btn-ae');
  if(btn) btn.classList.toggle('on',cmpShowAE);
  renderCmpColumns();
}
function toggleCmpPrev(){
  cmpShowPrev=!cmpShowPrev;
  const btn=document.getElementById('cmp-btn-prev');
  if(btn) btn.classList.toggle('on',cmpShowPrev);
  renderCmpColumns();
}
function onCmpEdicionChange(){
  cmpEdicion=document.getElementById('cmp-ed-sel').value||null;
  renderCmpColumns();
}

// ── IMPORTAR FORMATO EV / AE (nuevo formato por solapas de área) ──────────────
function importEVFile(input){
  const files=input.files; if(!files||!files.length) return;
  const log=document.getElementById('ev-import-log');
  log.innerHTML='Procesando...';
  let totalEV=0, totalAE=0, filesOK=0, filesFail=0;
  let pending=files.length;

  Array.from(files).forEach(file=>{
    const fname=file.name;
    // Parse type and edition from filename: "EV25 - DIST NAME.xlsx" or "AE25 - DIST NAME.xlsx"
    const m=fname.match(/^(EV|AE)(\d{2,4})\s*-?\s*(.+?)\.xlsx?$/i);
    let fileType='EV', edYear='', distName='';
    if(m){
      fileType=m[1].toUpperCase();
      const ySuffix=m[2];
      edYear=ySuffix.length===2?'20'+ySuffix:ySuffix;
      distName=m[3].trim();
    } else {
      // Fallback: use full name without ext
      distName=fname.replace(/\.xlsx?$/i,'').trim();
      edYear=document.getElementById('ev-import-anio').value||'2025';
      fileType=fname.match(/^AE/i)?'AE':'EV';
    }

    const reader=new FileReader();
    reader.onload=function(e){
      try{
        const wb=XLSX.read(new Uint8Array(e.target.result),{type:'array'});
        // Find area sheets: any sheet whose name is in SHEETS() list
        const areaNames=SHEETS();
        const areaSheets=wb.SheetNames.filter(s=>areaNames.includes(s));
        if(!areaSheets.length){
          filesFail++; pending--;
          if(!pending) _evImportDone(log,totalEV,totalAE,filesOK,filesFail);
          return;
        }
        const evAnswers={}, evComments={};
        const aeAnswers={};
        areaSheets.forEach(shName=>{
          const ws=wb.Sheets[shName];
          const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
          rows.forEach(row=>{
            const compNum=(row[3]||'').toString().trim();
            if(!/^\d+\.\d+(\.\d+)+$/.test(compNum)) return; // skip header/summary rows
            // Column F (idx 5) = EV answer; Column K (idx 10) = AE answer
            const evRaw=row[5]; const aeRaw=row[10];
            function _parseAns(raw){
              if(raw===1||raw===true||raw==='1'||raw==='TRUE'||raw==='true'||String(raw).toLowerCase()==='si'||String(raw).toLowerCase()==='sí') return 'si';
              if(raw===0||raw===false||raw==='0'||raw==='FALSE'||raw==='false'||String(raw).toLowerCase()==='no') return 'no';
              if(String(raw).toLowerCase()==='n/a'||String(raw).toLowerCase()==='na') return 'na';
              return null;
            }
            const evV=_parseAns(evRaw);
            const aeV=_parseAns(aeRaw);
            // Column I (idx 8) = comment
            const cmtRaw=(row[8]||'').toString().trim();
            if(evV) evAnswers[compNum]=evV;
            if(aeV) aeAnswers[compNum]=aeV;
            if(cmtRaw&&evV) evComments[compNum]=cmtRaw;
          });
        });

        const fecha=new Date().toISOString().slice(0,10);

        // Save EV audit (always, unless file is AE-only)
        if(Object.keys(evAnswers).length>0){
          const sc=computeScores(evAnswers);
          const audit={id:Date.now()+Math.random(),distribuidor:distName,fecha,auditor:'',edicion:edYear,answers:evAnswers,comments:evComments,scores:sc};
          const idx=saved.findIndex(a=>a.distribuidor===distName&&a.edicion===edYear);
          if(idx>=0) saved[idx]=audit; else saved.push(audit);
          totalEV++;
        }

        // Save AE (autoevaluación) if present
        if(Object.keys(aeAnswers).length>0){
          const sc=computeScores(aeAnswers);
          const ae={id:Date.now()+Math.random(),distribuidor:distName,fecha,edicion:edYear,answers:aeAnswers,scores:sc};
          const idx=autoevals.findIndex(a=>a.distribuidor===distName&&a.edicion===edYear);
          if(idx>=0) autoevals[idx]=ae; else autoevals.push(ae);
          totalAE++;
        }

        filesOK++; pending--;
        if(!pending){
          persist(); updateAudCnt(); renderSaved(); renderGlobal();
          _evImportDone(log,totalEV,totalAE,filesOK,filesFail);
          renderCmpColumns();
        }
      }catch(err){
        filesFail++; pending--;
        log.innerHTML+=`<br>❌ ${fname}: ${err.message}`;
        if(!pending) _evImportDone(log,totalEV,totalAE,filesOK,filesFail);
      }
    };
    reader.readAsArrayBuffer(file);
  });
  input.value='';
}
function _evImportDone(log,ev,ae,ok,fail){
  let msg=`✅ ${ok} archivo(s) procesado(s). <strong>${ev}</strong> evaluaciones importadas, <strong>${ae}</strong> autoevaluaciones importadas.`;
  if(fail>0) msg+=` <span style="color:#c62828">${fail} archivo(s) con error.</span>`;
  log.innerHTML=msg;
  showToast(`✅ EV/AE importado: ${ev+ae} registros`);
}

function updateAudCnt(){
  document.getElementById('aud-cnt-badge').textContent=saved.length;
  // Update autoevals count badge if it exists
  const aeBadge=document.getElementById('ae-cnt-badge');
  if(aeBadge) aeBadge.textContent=autoevals.length;
  // Pending indicator in topbar
  const _pend = Q.filter(q=>!ans[q.comp_num]).length;
  let pendEl = document.getElementById('tb-pending');
  if(_pend > 0){
    if(!pendEl){
      pendEl = document.createElement('span');
      pendEl.id = 'tb-pending';
      pendEl.style.cssText='font-size:10px;background:#ff9800;color:#fff;border-radius:10px;padding:1px 7px;font-weight:700;margin-left:6px;cursor:pointer';
      pendEl.onclick = scrollToUnanswered;
      const tbTitle = document.querySelector('.tb-title');
      if(tbTitle) tbTitle.appendChild(pendEl);
    }
    pendEl.textContent = _pend+' sin responder';
    pendEl.style.display='';
  } else {
    if(pendEl) pendEl.style.display='none';
  }
}

// ── GLOBAL ──
function getFilteredSaved(){
  const ed=(document.getElementById('gl-edicion')||{}).value;
  return ed ? saved.filter(a=>a.edicion===ed) : saved;
}
function renderGlobal(){
  const data=getFilteredSaved();
  document.getElementById('gl-auditados').textContent=(data.length||0)+'/'+DISTRIBUTORS.length;
  if(!data.length){
    ['ranking-bars','global-table-wrap','cross-table-wrap','global-areas','cat-dist-wrap'].forEach(id=>{
      const el=document.getElementById(id); if(el) el.innerHTML='<p style="padding:20px 0;font-size:12px;color:var(--g400)">Sin datos para la edición seleccionada. Importá tu JSON desde Configuración.</p>';
    });
    ['gl-prom','gl-bpl','gl-cat'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent='—';});
    return;
  }
  const totals=data.map(a=>((a.scores||{}).total||0)*100);
  const avgTotal=totals.reduce((s,v)=>s+v,0)/totals.length;
  document.getElementById('gl-prom').textContent=avgTotal.toFixed(1)+'%';
  const avgBpl=data.reduce((s,a)=>s+((a.scores||{}).critMet||0),0)/data.length;
  document.getElementById('gl-bpl').textContent=avgBpl.toFixed(1)+'/'+CRIT_LIST.length;
  const catCount={PROACTIVO:0,ACTIVO:0,REACTIVO:0,INACTIVO:0};
  data.forEach(a=>{const c=recomputeCategory(a); if(c&&catCount[c]!==undefined) catCount[c]++;});
  document.getElementById('gl-cat').textContent=`P:${catCount.PROACTIVO} A:${catCount.ACTIVO} R:${catCount.REACTIVO} I:${catCount.INACTIVO}`;
  document.getElementById('gl-cat').style.fontSize='14px';

  // Cat distribution - cleaner visual
  const total=data.length;
  const catCfg=[
    {k:'PROACTIVO',col:'#2e7d32',bg:'#e8f5e9'},
    {k:'ACTIVO',col:'#00695c',bg:'#e0f2f1'},
    {k:'REACTIVO',col:'#e65100',bg:'#fff3e0'},
    {k:'INACTIVO',col:'#c62828',bg:'#ffebee'}
  ];
  let cdh=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">`;
  catCfg.forEach(({k,col,bg})=>{
    const n=catCount[k]; const pct=total>0?(n/total*100).toFixed(0):0;
    cdh+=`<div style="background:${bg};border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:10px">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:900;color:${col};line-height:1">${n}</div>
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:800;color:${col}">${k}</div>
        <div style="font-size:10px;color:var(--g500)">${pct}% del total</div>
        <div style="height:4px;background:rgba(0,0,0,.1);border-radius:4px;margin-top:4px;width:60px">
          <div style="height:100%;background:${col};border-radius:4px;width:${pct}%"></div>
        </div>
      </div>
    </div>`;
  });
  cdh+=`</div><div style="text-align:center;font-size:10px;color:var(--g400)">${total} distribuidor${total!==1?'es':''} auditados</div>`;
  document.getElementById('cat-dist-wrap').innerHTML=cdh;

  // Area averages (all areas including NV)
  const avgAreas={};
  SHEETS().forEach(sh=>avgAreas[sh]=0);
  data.forEach(a=>{ SHEETS().forEach(sh=>{ avgAreas[sh]+=((a.scores||{}).areas[sh]||0)*100/Math.max(1,data.length); }); });
  function _areaAvgBar(sh){
    const avg=avgAreas[sh]; const c=scoreColor(avg/100);
    return `<div class="rank-row">
      <div class="rank-dist" style="color:${AC[sh]};font-weight:800">${sh}</div>
      <div class="rank-track" style="height:16px">
        <div class="rank-thr" style="left:50%;background:var(--red)"></div>
        <div class="rank-thr" style="left:70%;background:var(--yellow)"></div>
        <div class="rank-thr" style="left:85%;background:var(--green)"></div>
        <div class="rank-fill" style="width:${avg.toFixed(0)}%;background:${c}">
          ${avg>8?`<span class="rank-pct">${avg.toFixed(1)}%</span>`:''}
        </div>
      </div>
      <div style="font-size:10px;color:var(--g400);min-width:32px;text-align:right">×${Math.round(AW[sh]*100)}%</div>
    </div>`;
  }
  let ga=SHEETS_CORE().map(_areaAvgBar).join('');
  ga+=`<div class="divider"></div><div class="rank-row">
    <div class="rank-dist" style="font-weight:800">TOTAL RED</div>
    <div class="rank-track" style="height:16px">
      <div class="rank-fill" style="width:${avgTotal.toFixed(0)}%;background:${scoreColor(avgTotal/100)}">
        ${avgTotal>8?`<span class="rank-pct">${avgTotal.toFixed(1)}%</span>`:''}
      </div>
    </div><div style="min-width:32px"></div>
  </div>`;
  const _nvGl=SHEETS_NV();
  if(_nvGl.length>0){
    ga+=`<div style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--g200)">
      <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--g400);margin-bottom:6px">Indicadores No Vinculantes</div>
      ${_nvGl.map(_areaAvgBar).join('')}
    </div>`;
  }
  document.getElementById('global-areas').innerHTML=ga;

  // Ranking
  const sorted=[...data].sort((a,b)=>((b.scores||{}).total||0)-((a.scores||{}).total||0));
  let rb='';
  sorted.forEach((a,i)=>{
    const p=((a.scores||{}).total||0)*100; const c=scoreColor(p/100);
    rb+=`<div class="rank-row">
      <div class="rank-pos">${i+1}</div>
      <div class="rank-dist" title="${a.distribuidor}">${a.distribuidor}</div>
      <div class="rank-track">
        <div class="rank-thr" style="left:50%;background:var(--red)"></div>
        <div class="rank-thr" style="left:70%;background:var(--yellow)"></div>
        <div class="rank-thr" style="left:85%;background:var(--green)"></div>
        <div class="rank-fill" style="width:${p.toFixed(0)}%;background:${c}">
          <span class="rank-pct">${p.toFixed(1)}%</span>
        </div>
      </div>
      <div class="rank-cat">${catBadge(recomputeCategory(a))}</div>
    </div>`;
  });
  document.getElementById('ranking-bars').innerHTML=rb;

  // Summary table — core areas + Total, then NV area columns
  const _nvSh=SHEETS_NV(); const _coreSh=SHEETS_CORE();
  const _nvSep=_nvSh.length>0?`<th style="background:var(--g100);color:var(--g400);font-size:9px;font-style:italic;letter-spacing:.5px">NV▸</th>`:'' ;
  const _nvHdrs=_nvSh.map(sh=>`<th style="color:${AC[sh]||'#607d8b'};opacity:.7;font-style:italic">${sh}</th>`).join('');
  let gt=`<div style="overflow-x:auto"><table class="tbl"><thead><tr>
    <th>#</th><th>Edición</th><th>Distribuidor</th><th>Fecha</th>
    ${_coreSh.map(sh=>`<th style="color:${AC[sh]||'#607d8b'}">${sh}</th>`).join('')}
    <th>Total</th>${_nvSep}${_nvHdrs}<th>Crit.</th><th>Categoría</th>
  </tr></thead><tbody>`;
  sorted.forEach((a,i)=>{
    const s=a.scores||{}; const at=s.areas||{};
    const _nvSepCell=_nvSh.length>0?`<td style="background:var(--g100)"></td>`:'' ;
    gt+=`<tr><td style="color:var(--g400);font-weight:700">${i+1}</td>
      <td><span class="badge b-blue">${a.edicion||'—'}</span></td>
      <td><strong>${a.distribuidor}</strong></td><td>${a.fecha}</td>
      ${_coreSh.map(sh=>`<td>${pctBadge(((at[sh]||0)*100).toFixed(1))}</td>`).join('')}
      <td>${pctBadge(((s.total||0)*100).toFixed(1))}</td>${_nvSepCell}
      ${_nvSh.map(sh=>`<td style="opacity:.75">${pctBadge(((at[sh]||0)*100).toFixed(1))}</td>`).join('')}
      <td><span class="badge b-purple">${s.critMet||0}/${auditTotalCrits(a)}</span></td>
      <td>${catBadge(recomputeCategory(a))}</td></tr>`;
  });
  // Avg row
  gt+=`<tr style="background:var(--g50);border-top:2px solid var(--g200)">
    <td colspan="4" style="font-weight:800;font-family:'Barlow Condensed',sans-serif">PROMEDIO EDICIÓN</td>
    ${_coreSh.map(sh=>`<td>${pctBadge((avgAreas[sh]||0).toFixed(1))}</td>`).join('')}
    <td>${pctBadge(avgTotal.toFixed(1))}</td>
    ${_nvSh.length>0?`<td style="background:var(--g100)"></td>`:''}
    ${_nvSh.map(sh=>`<td style="opacity:.75">${pctBadge((avgAreas[sh]||0).toFixed(1))}</td>`).join('')}
    <td><span class="badge b-purple">${avgBpl.toFixed(1)}/${CRIT_LIST.length}</span></td>
    <td>—</td>
  </tr>`;
  gt+='</tbody></table></div>';
  document.getElementById('global-table-wrap').innerHTML=gt;

  // Cross table
  let ct=`<div style="overflow-x:auto"><table class="cross-table"><thead><tr>
    <th class="ct-head-dist">Distribuidor</th>
    <th class="ct-head-score">Total</th>
    <th class="ct-head-score">Cat.</th>
    ${CRIT_LIST.map(c=>`<th class="ct-head-bpl" title="${c.bpl_name}">${c.tag.replace('CRITICO ','C')}</th>`).join('')}
  </tr></thead><tbody>`;
  sorted.forEach(a=>{
    const p=(((a.scores||{}).total||0)*100).toFixed(1)+'%';
    ct+=`<tr><td class="ct-dist">${a.distribuidor}</td>
      <td style="text-align:center;font-weight:700">${p}</td>
      <td style="text-align:center">${catBadge(recomputeCategory(a))}</td>
      ${CRIT_LIST.map(c=>{
        const met=c.qs.every(q=>((a.answers||{})[q])==='si');
        const any=c.qs.some(q=>((a.answers||{})[q])!==undefined);
        return `<td class="${met?'ct-met':any?'ct-unmet':'ct-pending'}">${met?'✅':any?'❌':'⭕'}</td>`;
      }).join('')}
    </tr>`;
  });
  // % row
  ct+=`<tr class="ct-prom-row"><td class="ct-dist">% CUMPLIMIENTO</td><td></td><td></td>
    ${CRIT_LIST.map(c=>{
      const metN=data.filter(a=>c.qs.every(q=>((a.answers||{})[q])==='si')).length;
      const pct=data.length>0?Math.round(metN/data.length*100):0;
      const col=pct>=85?'#2e7d32':pct>=50?'#e65100':'#c62828';
      return `<td style="font-weight:800;color:${col};font-size:12px;text-align:center">${pct}%</td>`;
    }).join('')}
  </tr>`;
  ct+='</tbody></table></div>';
  document.getElementById('cross-table-wrap').innerHTML=ct;
}

// ── EXPORT ──
function exportExcel(){
  if(!saved.length){showToast('⚠️ No hay auditorías guardadas');return;}
  const wb2=XLSX.utils.book_new();
  const data=getFilteredSaved();
  const sorted=[...data].sort((a,b)=>((b.scores||{}).total||0)-((a.scores||{}).total||0));

  // 1. Resumen
  const r1=[['Edición','Distribuidor','Fecha','Auditor','IFT %','PLG %','GST %','IDP %','Total %','Crit.','Categoría','Respondidas']];
  sorted.forEach(a=>{const s=a.scores||{};const at=s.areas||{};
    r1.push([a.edicion||'',a.distribuidor,a.fecha,a.auditor||'',((at.IFT||0)*100).toFixed(1)+'%',((at.PLG||0)*100).toFixed(1)+'%',((at.GST||0)*100).toFixed(1)+'%',((at.IDP||0)*100).toFixed(1)+'%',((s.total||0)*100).toFixed(1)+'%',s.critMet+'/'+CRIT_LIST.length,recomputeCategory(a)||'',s.answered+'/187']);});
  const ws1=XLSX.utils.aoa_to_sheet(r1); XLSX.utils.book_append_sheet(wb2,ws1,'Resumen');

  // 2. BPL Subtotales
  const bplKeys=[]; Q.reduce((s,q)=>{const k=q.sheet+'_'+q.bpl_num;if(!s[k]){s[k]=true;bplKeys.push({sh:q.sheet,bk:q.bpl_num,name:q.bpl_name,w:q.bpl_weight});}return s;},{});
  const r2=[['Edición','Distribuidor','Fecha','Total %','Categoría',...bplKeys.map(b=>`BPL ${b.bk} ${b.name} (${b.sh} ×${(b.w*100).toFixed(0)}%)`)]];
  sorted.forEach(a=>{const s=a.scores||{};
    const row=[a.edicion||'',a.distribuidor,a.fecha,((s.total||0)*100).toFixed(1)+'%',recomputeCategory(a)||''];
    bplKeys.forEach(b=>{const bv=s.bpls&&s.bpls[b.sh+'_'+b.bk]; row.push(bv?((bv.score||0)*100).toFixed(1)+'%':'—');});
    r2.push(row);});
  const ws2=XLSX.utils.aoa_to_sheet(r2); XLSX.utils.book_append_sheet(wb2,ws2,'Subtotales BPL');

  // 3. BPL Críticos
  const r3=[['Edición','Distribuidor','Fecha','Categoría',...CRIT_LIST.map(c=>c.tag+' - '+c.bpl_name)]];
  sorted.forEach(a=>{const row=[a.edicion||'',a.distribuidor,a.fecha,recomputeCategory(a)||''];
    CRIT_LIST.forEach(c=>{const met=c.qs.every(q=>((a.answers||{})[q])==='si');const any=c.qs.some(q=>((a.answers||{})[q])!==undefined);row.push(met?'CUMPLE':any?'NO CUMPLE':'PENDIENTE');});
    r3.push(row);});
  const ws3=XLSX.utils.aoa_to_sheet(r3); XLSX.utils.book_append_sheet(wb2,ws3,'BPL Críticos');

  // 4. Respuestas
  const r4=[['Edición','Distribuidor','Fecha','Área','BPL','Sub-Atributo','#Pregunta','Pregunta','Crítico','Respuesta','Comentario']];
  sorted.forEach(a=>{Q.forEach(q=>{r4.push([a.edicion||'',a.distribuidor,a.fecha,q.area,q.bpl_num+' '+q.bpl_name,q.subattr||'',q.comp_num,q.question,q.critico||'',({si:'SI',no:'NO',na:'N/A'})[(a.answers||{})[q.comp_num]]||'',(a.comments||{})[q.comp_num]||'']);});});
  const ws4=XLSX.utils.aoa_to_sheet(r4); ws4['!cols']=[{wch:8},{wch:24},{wch:12},{wch:22},{wch:28},{wch:26},{wch:10},{wch:60},{wch:12},{wch:10},{wch:40}];
  XLSX.utils.book_append_sheet(wb2,ws4,'Respuestas Detalle');

  XLSX.writeFile(wb2,'RedActiva2_BPL_UY_'+new Date().toISOString().slice(0,10)+'.xlsx');
  showToast('📊 Excel exportado');
}

// ── BACKUP / RESTORE JSON ──
function exportBackupJSON(){
  if(!saved.length){showToast('⚠️ No hay auditorías para exportar');return;}
  const blob = new Blob([JSON.stringify(saved, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'RedActiva2_backup_' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('💾 Backup exportado: ' + saved.length + ' auditorías');
}

function importBackupJSON(input){
  const file = input.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e){
    try {
      const data = JSON.parse(e.target.result);
      if(!Array.isArray(data)) throw new Error('Formato inválido');
      
      let added = 0, replaced = 0, skipped = 0;
      data.forEach(function(a){
        if(!a.distribuidor || !a.answers) { skipped++; return; }
        const idx = saved.findIndex(function(s){ return s.distribuidor===a.distribuidor && s.edicion===a.edicion; });
        if(idx >= 0){
          saved[idx] = a; replaced++;
        } else {
          saved.push(a); added++;
        }
      });
      
      persist();
      updateAudCnt();
      renderSaved();
      renderGlobal();
      input.value = '';
      showToast('✅ Importado: ' + added + ' nuevas, ' + replaced + ' reemplazadas' + (skipped?', '+skipped+' omitidas':''));
    } catch(err){
      showToast('❌ Error al importar: ' + err.message);
      input.value = '';
    }
  };
  reader.readAsText(file);
}

function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);}

// ── PAÍS Y AÑO ──────────────────────────────────────────
function savePaisAnio(){
  const pais=(document.getElementById('cfg-pais').value||'').trim().toUpperCase()||'URUGUAY';
  const anio=parseInt(document.getElementById('cfg-anio').value)||2025;
  cfg.pais=pais; cfg.anio=anio;
  localStorage.setItem('bpl_cfg_v5',JSON.stringify(cfg));
  const flags={URUGUAY:'🇺🇾',ARGENTINA:'🇦🇷',CHILE:'🇨🇱',BRASIL:'🇧🇷',PARAGUAY:'🇵🇾',PERU:'🇵🇪',COLOMBIA:'🇨🇴',MEXICO:'🇲🇽'};
  const flag=flags[pais]||'🌍';
  const pv=document.getElementById('sb-prog-val');
  if(pv) pv.textContent=flag+' '+pais+' · '+anio;
  const sel=document.getElementById('sel-edicion'); if(sel) sel.value=anio;
  // Load structure for the new pais/anio (or reset to base if none exists)
  if(!loadStructure(pais,anio)){
    Q=[...Q_BASE.map(q=>({...q}))];
    Object.keys(AC).forEach(k=>delete AC[k]);Object.assign(AC,{IFT:'#1565c0',PLG:'#6a1b9a',GST:'#e65100',IDP:'#1b5e20'});
    Object.keys(AN).forEach(k=>delete AN[k]);Object.assign(AN,{IFT:'Infraestructura',PLG:'Procesos Logísticos',GST:'Gestión',IDP:'Integridad del Producto'});
    Object.keys(AW).forEach(k=>delete AW[k]);Object.assign(AW,{...AW_DEFAULT});
    showToast('🆕 Nueva estructura para '+pais+' '+anio+' — configurá áreas y preguntas en Config');
  } else {
    showToast('✅ '+pais+' '+anio+' cargado — '+Object.keys(AC).join(', '));
  }
  markFormDirty();
  rebuildAll(); rebuildDynamicUI(); edInitAreas();
}
function loadPaisAnio(){
  const pais=cfg.pais||'URUGUAY'; const anio=cfg.anio||2025;
  const inp=document.getElementById('cfg-pais'); if(inp) inp.value=pais;
  const ainp=document.getElementById('cfg-anio'); if(ainp) ainp.value=anio;
  const flags={URUGUAY:'🇺🇾',ARGENTINA:'🇦🇷',CHILE:'🇨🇱',BRASIL:'🇧🇷',PARAGUAY:'🇵🇾',PERU:'🇵🇪',COLOMBIA:'🇨🇴',MEXICO:'🇲🇽'};
  const pv=document.getElementById('sb-prog-val');
  if(pv) pv.textContent=(flags[pais]||'🌍')+' '+pais+' · '+anio;
}

// ── ESTRUCTURA POR PAÍS/AÑO ──────────────────────────────
// Cada país+año tiene su propia estructura (Q, áreas, pesos)
function structureKey(pais, anio){
  const p=((pais||cfg.pais||'XX')+'').toUpperCase().replace(/\s+/g,'_');
  const a=((anio||cfg.anio||'0000')+'');
  return 'bpl_struct_'+p+'_'+a;
}
function saveStructure(){
  cfg.aw={...AW};
  const data={q:Q,ac:{...AC},an:{...AN},aw:{...AW},wcfg:WCfg,nv:{...NV}};
  localStorage.setItem(structureKey(),JSON.stringify(data));
  console.log('[RA2] saveStructure → key='+structureKey()+' areas='+Object.keys(AC).join(','));
  // Legacy keys for backward compat
  saveQCustom(); saveAreasCfg();
  localStorage.setItem('bpl_cfg_v5',JSON.stringify(cfg));
}
function loadStructure(pais, anio){
  try{
    const s=localStorage.getItem(structureKey(pais,anio));
    if(!s) return false;
    const d=JSON.parse(s);
    if(d.q&&Array.isArray(d.q)&&d.q.length>0) Q=d.q;
    if(d.ac){Object.keys(AC).forEach(k=>delete AC[k]);Object.assign(AC,d.ac);}
    if(d.an){Object.keys(AN).forEach(k=>delete AN[k]);Object.assign(AN,d.an);}
    if(d.aw){Object.keys(AW).forEach(k=>delete AW[k]);Object.assign(AW,d.aw);}
    if(d.wcfg) WCfg=d.wcfg;
    Object.keys(NV).forEach(k=>delete NV[k]); if(d.nv) Object.assign(NV,d.nv);
    console.log('[RA2] loadStructure('+pais+','+anio+') → areas='+Object.keys(AC).join(','));
    return true;
  }catch(e){console.warn('[RA2] loadStructure error:',e);}
  return false;
}

// ── EDITOR DE ESTRUCTURA ────────────────────────────────
// Guardar Q personalizado en localStorage
function saveQCustom(){ localStorage.setItem('bpl_q_custom_v1',JSON.stringify(Q)); }
function loadQCustom(){
  try{
    const s=localStorage.getItem('bpl_q_custom_v1');
    if(s){ const d=JSON.parse(s); if(Array.isArray(d)&&d.length>0){ Q=d; return true; } }
  }catch(e){}
  return false;
}
// Guardar áreas custom (AC/AN)
function saveAreasCfg(){
  const ac={},an={};
  Object.keys(AC).forEach(k=>{ac[k]=AC[k];an[k]=AN[k]===undefined?'':AN[k];});
  const payload=JSON.stringify({ac,an});
  console.log('[RA2] saveAreasCfg → keys=',Object.keys(ac).join(','));
  localStorage.setItem('bpl_areas_cfg_v1',payload);
}
function loadAreasCfg(){
  try{
    const s=localStorage.getItem('bpl_areas_cfg_v1');
    if(s){ const d=JSON.parse(s); if(d&&d.ac&&d.an){ console.log('[RA2] loadAreasCfg → keys=',Object.keys(d.ac).join(',')); Object.assign(AC,d.ac); Object.assign(AN,d.an); return true; } }
  }catch(e){ console.warn('[RA2] loadAreasCfg error:',e); }
  console.log('[RA2] loadAreasCfg → no data in localStorage');
  return false;
}

// Rebuild form + critical grid after Q changes
function rebuildAll(){
  _formDirty=false;
  document.getElementById('form-sections').innerHTML='';
  // Rebuild CRIT_LIST from current Q
  const _crit={};
  Q.forEach(q=>{ if(q.critico){ if(!_crit[q.critico]) _crit[q.critico]={tag:q.critico,bpl_name:q.bpl_name,subattr:q.subattr||q.bpl_name,sheet:q.sheet,qs:[]}; _crit[q.critico].qs.push(q.comp_num); }});
  CRIT_LIST.length=0;
  Object.values(_crit).sort((a,b)=>+a.tag.replace(/\D/g,'')-+b.tag.replace(/\D/g,'')).forEach(c=>CRIT_LIST.push(c));
  buildForm(); buildCritGrid(); loadCfg();
  rebuildDynamicUI();
  // re-collapse areas
  setTimeout(function(){
    document.querySelectorAll('.area-body').forEach(function(el){el.style.display='none';});
    document.querySelectorAll('.area-chev').forEach(function(el){el.classList.remove('open');});
    document.querySelectorAll('[id^="bplc-"]').forEach(function(el){el.style.display='none';});
    document.querySelectorAll('.bpl-chev').forEach(function(el){el.classList.remove('open');});
  },50);
  recalc();
  // El editor se resincroniza solo cuando el usuario entra a la pestaña Config (goTab→edInitAreas)
}

// ── EDITOR DE ESTRUCTURA ────────────────────────────────
// Estado interno del editor (no depende del DOM para no perderse)
const ED = { area:'', bplnum:0, subattr:'' };

// Marca que el formulario necesita reconstruirse (lazy rebuild)
let _formDirty = false;
function markFormDirty(){ _formDirty=true; }
function flushFormIfDirty(){
  if(!_formDirty) return;
  _formDirty=false;
  // Rebuild CRIT_LIST
  const crit={};
  Q.forEach(q=>{ if(q.critico){ if(!crit[q.critico]) crit[q.critico]={tag:q.critico,bpl_name:q.bpl_name,subattr:q.subattr||'',sheet:q.sheet,qs:[]}; crit[q.critico].qs.push(q.comp_num); }});
  CRIT_LIST.length=0;
  Object.values(crit).sort((a,b)=>+a.tag.replace(/\D/g,'')-+b.tag.replace(/\D/g,'')).forEach(x=>CRIT_LIST.push(x));
  document.getElementById('form-sections').innerHTML='';
  buildForm(); buildCritGrid(); loadCfg();
  rebuildDynamicUI();
  setTimeout(function(){
    document.querySelectorAll('.area-body').forEach(el=>el.style.display='none');
    document.querySelectorAll('.area-chev').forEach(el=>el.classList.remove('open'));
    document.querySelectorAll('[id^="bplc-"]').forEach(el=>el.style.display='none');
    document.querySelectorAll('.bpl-chev').forEach(el=>el.classList.remove('open'));
  },50);
  recalc();
}

// ── Inicializar selector de áreas ──
function edInitAreas(){
  const sel=document.getElementById('ed-sel-area'); if(!sel) return;
  const areas=[...new Set(Q.map(q=>q.sheet))];
  Object.keys(AC).forEach(k=>{ if(!areas.includes(k)) areas.push(k); });
  sel.innerHTML='<option value="">— Seleccioná un área —</option>'+
    areas.map(a=>`<option value="${a}">${a} · ${AN[a]||''}</option>`).join('');
  // Re-validate ED state against current Q
  if(ED.area && areas.includes(ED.area)){
    sel.value=ED.area;
    edShowArea();
  } else {
    ED.area=''; ED.bplnum=0; ED.subattr='';
    _edHideArea();
  }
}

function _edHideArea(){
  document.getElementById('ed-area-editor').style.display='none';
  document.getElementById('ed-btn-del-area').style.display='none';
}

// ── Área seleccionada ──
function edLoadArea(){
  const sh=document.getElementById('ed-sel-area').value;
  ED.area=sh; ED.bplnum=0; ED.subattr='';
  if(!sh){ _edHideArea(); return; }
  edShowArea();
}
function edShowArea(){
  const sh=ED.area; if(!sh) return;
  document.getElementById('ed-area-editor').style.display='';
  document.getElementById('ed-btn-del-area').style.display='';
  document.getElementById('ed-area-code').value=sh;
  document.getElementById('ed-area-name').value=AN[sh]||'';
  document.getElementById('ed-area-color').value=AC[sh]||'#1565c0';
  edRefreshAtributos();
}

function edRefreshAtributos(){
  const sh=ED.area;
  const sel=document.getElementById('ed-sel-bplname');
  const pairs=[...new Map(Q.filter(q=>q.sheet===sh).sort((a,b)=>a.bpl_num-b.bpl_num).map(q=>[q.bpl_num,q.bpl_name]))];
  sel.innerHTML='<option value="">— Seleccioná un Atributo —</option>'+
    pairs.map(([num,name])=>`<option value="${num}">${num}. ${name||'(sin nombre)'}</option>`).join('');
  // Re-validate bplnum
  const validNums=pairs.map(([n])=>String(n));
  if(ED.bplnum && validNums.includes(String(ED.bplnum))){
    sel.value=ED.bplnum; edShowBplName();
  } else {
    ED.bplnum=0; ED.subattr='';
    document.getElementById('ed-bplname-section').style.display='none';
    document.getElementById('ed-btn-del-bplname').style.display='none';
  }
}

function edLoadBplName(){
  ED.bplnum=parseInt(document.getElementById('ed-sel-bplname').value)||0;
  ED.subattr='';
  if(!ED.bplnum){ document.getElementById('ed-bplname-section').style.display='none'; document.getElementById('ed-btn-del-bplname').style.display='none'; return; }
  edShowBplName();
}
function edShowBplName(){
  if(!ED.bplnum) return;
  document.getElementById('ed-btn-del-bplname').style.display='';
  document.getElementById('ed-bplname-section').style.display='';
  // Populate atributo edit fields
  const sh=ED.area;
  const firstQ=Q.find(q=>q.sheet===sh&&String(q.bpl_num)===String(ED.bplnum));
  const numEl=document.getElementById('ed-atrib-num');
  const nameEl=document.getElementById('ed-atrib-name');
  if(numEl) numEl.value=ED.bplnum;
  if(nameEl) nameEl.value=firstQ?firstQ.bpl_name:'';
  edRefreshSubattrs();
}

// Update atributo NUMBER for all questions in this atributo
function edUpdateAtribNum(val){
  const newNum=parseInt(val);
  if(!newNum||newNum<1){showToast('⚠️ Número inválido');return;}
  const sh=ED.area; const oldNum=ED.bplnum;
  // Check not already used
  const existing=Q.find(q=>q.sheet===sh&&String(q.bpl_num)===String(newNum)&&String(q.bpl_num)!==String(oldNum));
  if(existing){showToast('⚠️ El número '+newNum+' ya está en uso');return;}
  Q.filter(q=>q.sheet===sh&&String(q.bpl_num)===String(oldNum)).forEach(q=>{
    q.bpl_num=newNum;
    // Update comp_num X part
    const parts=q.comp_num.split('.');
    parts[0]=String(newNum);
    q.comp_num=parts.join('.');
  });
  ED.bplnum=newNum;
  saveStructure(); markFormDirty();
  edRefreshAtributos();
  showToast('✅ Atributo renumerado: '+oldNum+' → '+newNum);
}

// Update atributo NAME for all questions in this atributo
function edUpdateAtribName(val){
  const name=val.trim().toUpperCase();
  if(!name) return;
  const sh=ED.area; const bk=ED.bplnum;
  Q.filter(q=>q.sheet===sh&&String(q.bpl_num)===String(bk)).forEach(q=>q.bpl_name=name);
  saveStructure(); markFormDirty();
  edRefreshAtributos();
  showToast('✅ Nombre de Atributo actualizado');
}

// Rename BPL (subattr)
function edRenameSubattr(oldName, newName){
  newName=newName.trim().toUpperCase();
  if(!newName||newName===oldName) return;
  const sh=ED.area; const bk=ED.bplnum;
  Q.filter(q=>q.sheet===sh&&String(q.bpl_num)===String(bk)&&q.subattr===oldName).forEach(q=>q.subattr=newName);
  ED.subattr=newName;
  saveStructure(); markFormDirty();
  edRefreshSubattrs();
  showToast('✅ BPL renombrado');
}

function edRefreshSubattrs(){
  const sh=ED.area; const bk=ED.bplnum;
  const sel=document.getElementById('ed-sel-subattr');
  const sas=[...new Set(Q.filter(q=>q.sheet===sh&&String(q.bpl_num)===String(bk)).map(q=>q.subattr||''))].filter(s=>s);
  sel.innerHTML='<option value="">— Seleccioná un BPL —</option>'+
    sas.map(s=>`<option value="${s}">${s}</option>`).join('');
  if(ED.subattr && sas.includes(ED.subattr)){
    sel.value=ED.subattr; edShowSubattr();
  } else {
    ED.subattr='';
    document.getElementById('ed-questions-section').style.display='none';
    document.getElementById('ed-btn-del-subattr').style.display='none';
  }
}

function edLoadSubattr(){
  ED.subattr=document.getElementById('ed-sel-subattr').value||'';
  if(!ED.subattr){ document.getElementById('ed-questions-section').style.display='none'; document.getElementById('ed-btn-del-subattr').style.display='none'; return; }
  edShowSubattr();
}
function edShowSubattr(){
  if(!ED.subattr) return;
  const delBtn=document.getElementById('ed-btn-del-subattr');
  if(delBtn) delBtn.style.display='';
  const qSec=document.getElementById('ed-questions-section');
  if(qSec) qSec.style.display='';
  // Populate BPL rename field
  const renameEl=document.getElementById('ed-bpl-rename');
  if(renameEl) renameEl.value=ED.subattr;
  edRenderQuestions();
}

// ── Área CRUD ──
function edSaveArea(){
  const oldSh=ED.area;
  const newSh=(document.getElementById('ed-area-code').value||'').trim().toUpperCase().replace(/\s+/g,'');
  const name=(document.getElementById('ed-area-name').value||'').trim();
  const color=document.getElementById('ed-area-color').value;
  if(!newSh||!name){showToast('⚠️ Código y nombre requeridos');return;}
  if(oldSh&&oldSh!==newSh){
    Q.forEach(q=>{ if(q.sheet===oldSh){q.sheet=newSh;q.area=name;} });
    AC[newSh]=color; AN[newSh]=name; delete AC[oldSh]; delete AN[oldSh];
    if(AW[oldSh]!==undefined){ AW[newSh]=AW[oldSh]; delete AW[oldSh]; }
  } else {
    AC[newSh]=color; AN[newSh]=name;
  }
  ED.area=newSh;
  saveStructure(); markFormDirty();
  edInitAreas(); rebuildDynamicUI();
  showToast('✅ Área guardada: '+newSh);
}
async function edAddArea(){
  const code=await miniPrompt('Código del área (ej: MKT, VNT, LOG)','MKT');
  if(!code) return;
  const sh=code.trim().toUpperCase();
  if(AC[sh]){showToast('⚠️ Ya existe: '+sh);return;}
  const name=await miniPrompt('Nombre completo del área','Nueva Área');
  if(!name) return;
  AC[sh]='#'+(Math.random()*0xFFFFFF|0).toString(16).padStart(6,'0');
  AN[sh]=name.trim();
  AW[sh]=0;
  ED.area=sh; ED.bplnum=0; ED.subattr='';
  saveStructure(); markFormDirty();
  edInitAreas(); rebuildDynamicUI();
  showToast('✅ Área "'+sh+'" creada');
}
function edDeleteArea(){
  const sh=ED.area; if(!sh) return;
  const n=Q.filter(q=>q.sheet===sh).length;
  if(!confirm('¿Eliminar área '+sh+' ('+AN[sh]+')?\nTiene '+n+' preguntas. Esta acción no se puede deshacer.')) return;
  Q=Q.filter(q=>q.sheet!==sh); delete AC[sh]; delete AN[sh]; delete AW[sh];
  ED.area=''; ED.bplnum=0; ED.subattr='';
  saveStructure(); markFormDirty();
  edInitAreas(); rebuildDynamicUI();
  showToast('🗑 Área eliminada: '+sh);
}

// ── Atributo (bpl_name) CRUD ──
async function edAddBplName(){
  const sh=ED.area; if(!sh){showToast('⚠️ Seleccioná un área primero');return;}
  const name=await miniPrompt('Nombre del Atributo','NUEVO ATRIBUTO');
  if(!name) return;
  const maxNum=Math.max(0,...Q.map(q=>q.bpl_num).filter(n=>Number.isFinite(n)));
  const newNum=maxNum+1;
  // FIX 1c: subattr default único por bpl_num para evitar colisiones entre áreas
  const defaultSubattr='BPL '+newNum+'.1';
  Q.push({sheet:sh,area:AN[sh]||sh,area_weight:AW[sh]||0,bpl_num:newNum,bpl_name:name.trim().toUpperCase(),bpl_weight:1,subattr:defaultSubattr,comp_num:newNum+'.1.1',question:'Nueva pregunta — editá el texto',critico:null,weight_attr:1,peso_bpl:1});
  ED.bplnum=newNum; ED.subattr=defaultSubattr;
  saveStructure(); markFormDirty();
  edRefreshAtributos();
  setTimeout(function(){
    const tas=document.querySelectorAll('#ed-q-list textarea');
    if(tas.length){ const last=tas[tas.length-1]; last.focus(); last.select(); }
  },80);
  showToast('✅ Atributo "'+name.trim().toUpperCase()+'" creado — escribí el texto de la primera pregunta');
}
function edDeleteBplName(){
  const sh=ED.area; const bk=ED.bplnum; if(!bk) return;
  const n=Q.filter(q=>q.sheet===sh&&q.bpl_num===bk).length;
  if(!confirm('¿Eliminar este atributo? Tiene '+n+' preguntas.')) return;
  Q=Q.filter(q=>!(q.sheet===sh&&q.bpl_num===bk));
  ED.bplnum=0; ED.subattr='';
  saveStructure(); markFormDirty();
  edRefreshAtributos();
  showToast('🗑 Atributo eliminado');
}

// ── BPL (Buena Práctica Logística) CRUD ──
async function edAddSubattr(){
  const sh=ED.area; const bk=ED.bplnum; if(!bk){showToast('⚠️ Seleccioná un Atributo primero');return;}
  const name=await miniPrompt('Nombre del nuevo BPL','NUEVO BPL');
  if(!name) return;
  const bkQs=Q.filter(q=>q.sheet===sh&&q.bpl_num===bk);
  const maxSub=bkQs.reduce((m,q)=>{ const p=q.comp_num.split('.'); return Math.max(m,parseInt(p[1]||0)); },0);
  const sub=name.trim().toUpperCase();
  Q.push({sheet:sh,area:AN[sh]||sh,area_weight:AW[sh]||0,bpl_num:bk,bpl_name:(bkQs[0]||{}).bpl_name||'',bpl_weight:1,subattr:sub,comp_num:bk+'.'+(maxSub+1)+'.1',question:'Nueva pregunta — editá el texto',critico:null,weight_attr:1,peso_bpl:1});
  ED.subattr=sub;
  saveStructure(); markFormDirty();
  edRefreshSubattrs();
  setTimeout(function(){
    const tas=document.querySelectorAll('#ed-q-list textarea');
    if(tas.length){ const last=tas[tas.length-1]; last.focus(); last.select(); }
  },80);
  showToast('✅ BPL "'+sub+'" creado — escribí el texto de la primera pregunta');
}
function edDeleteSubattr(){
  const sh=ED.area; const bk=ED.bplnum; const sa=ED.subattr; if(!sa) return;
  const n=Q.filter(q=>q.sheet===sh&&q.bpl_num===bk&&q.subattr===sa).length;
  if(!confirm('¿Eliminar BPL "'+sa+'"? Tiene '+n+' preguntas.')) return;
  Q=Q.filter(q=>!(q.sheet===sh&&q.bpl_num===bk&&q.subattr===sa));
  ED.subattr='';
  saveStructure(); markFormDirty();
  edRefreshSubattrs();
  showToast('🗑 BPL eliminado');
}

// ── Preguntas ──
function edRenderQuestions(){
  const sh=ED.area; const bk=ED.bplnum; const sa=ED.subattr;
  const qs=Q.filter(q=>q.sheet===sh&&String(q.bpl_num)===String(bk)&&(q.subattr||'')===sa);
  const list=document.getElementById('ed-q-list');
  if(!qs.length){
    list.innerHTML='<div style="padding:12px 16px;font-size:12px;color:var(--g400)">Sin preguntas. Usá "+ Agregar Pregunta".</div>';
    return;
  }
  list.innerHTML=qs.map(q=>{
    const idx=Q.indexOf(q); const isCrit=!!q.critico;
    return `<div style="padding:8px 12px;border-bottom:1px solid var(--g100);display:flex;align-items:flex-start;gap:8px;background:${isCrit?'#fff5f5':'#fff'}">
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px;min-width:54px">
        <input type="text" value="${q.comp_num}"
          title="Número de componente (X.Y.Z)"
          style="width:52px;padding:2px 4px;border:1.5px solid var(--g200);border-radius:4px;font-size:10px;font-family:'Barlow Condensed',sans-serif;font-weight:700;text-align:center;color:var(--g600)"
          onchange="edUpdateCompNum(${idx},this.value)">
        <div style="display:flex;gap:2px">
          <button onclick="edMoveQ(${idx},-1)" title="Subir" style="width:22px;height:16px;font-size:9px;border:1px solid var(--g200);background:#fff;border-radius:3px;cursor:pointer;padding:0">▲</button>
          <button onclick="edMoveQ(${idx},1)" title="Bajar" style="width:22px;height:16px;font-size:9px;border:1px solid var(--g200);background:#fff;border-radius:3px;cursor:pointer;padding:0">▼</button>
        </div>
      </div>
      <div style="flex:1">
        <textarea style="width:100%;padding:4px 7px;border:1.5px solid var(--g200);border-radius:5px;font-size:12px;resize:vertical;min-height:36px;font-family:'Barlow',sans-serif"
          oninput="edUpdateQ(${idx},'question',this.value)">${q.question}</textarea>
        <div style="display:flex;gap:10px;margin-top:4px;align-items:center;flex-wrap:wrap">
          <label style="display:flex;align-items:center;gap:4px;font-size:11px;cursor:pointer">
            <input type="checkbox" ${isCrit?'checked':''} onchange="edToggleCrit(${idx},this.checked)">
            <span style="color:var(--red);font-weight:700">🔴 Crítico</span>
          </label>
          ${isCrit?`<input type="text" value="${q.critico}" placeholder="Ej: CRITICO 1"
            style="width:110px;padding:2px 6px;border:1.5px solid #ef9a9a;border-radius:4px;font-size:11px;color:var(--red);font-weight:700"
            onchange="edUpdateQ(${idx},'critico',this.value)">`:''}
          <span style="font-size:10px;color:var(--g400)">Peso:
            <input type="number" value="${(q.weight_attr*100).toFixed(0)}" min="0" max="100" step="1"
              style="width:48px;padding:2px 4px;border:1px solid var(--g200);border-radius:4px;font-size:11px;text-align:right"
              onchange="edUpdateQ(${idx},'weight_attr',this.value/100)">%
          </span>
        </div>
      </div>
      <button class="btn btn-red btn-xs" onclick="edDelQ(${idx})" style="flex-shrink:0;margin-top:2px">✕</button>
    </div>`;
  }).join('');
}
// Update comp_num manually
function edUpdateCompNum(idx, val){
  const v = val.trim();
  if(!v || !v.match(/^\d+\.\d+\.\d+$/)){
    showToast('⚠️ Formato inválido. Usá X.Y.Z (ej: 1.2.3)'); return;
  }
  Q[idx].comp_num = v;
  saveStructure(); markFormDirty();
  showToast('✓ Número actualizado: '+v);
}

// Move question up or down within its BPL
function edMoveQ(idx, dir){
  const q = Q[idx];
  const sh=q.sheet, bk=q.bpl_num, sa=q.subattr;
  // Get all indices for this BPL+subattr in order
  const peers = Q.map((x,i)=>i).filter(i=>Q[i].sheet===sh&&String(Q[i].bpl_num)===String(bk)&&(Q[i].subattr||'')===sa);
  const pos = peers.indexOf(idx);
  const newPos = pos + dir;
  if(newPos < 0 || newPos >= peers.length) return;

  // Swap in Q array
  const other = peers[newPos];
  const tmp = Q[idx];
  Q[idx] = Q[other];
  Q[other] = tmp;

  // Renumber comp_nums automatically after move
  edRenumberBpl(sh, bk, sa);
  saveStructure(); markFormDirty();
  edRenderQuestions();
}

// Renumber all comp_nums for a given area/atributo/bpl sequentially
function edRenumberBpl(sh, bk, sa){
  const idxs = Q.map((x,i)=>i).filter(i=>Q[i].sheet===sh&&String(Q[i].bpl_num)===String(bk)&&(Q[i].subattr||'')===sa);
  // Find the BPL Y number from first question
  const firstNum = Q[idxs[0]]?.comp_num || bk+'.1.1';
  const parts = firstNum.split('.');
  const atribN = parts[0] || bk;
  const bplN   = parts[1] || '1';
  idxs.forEach((qi, n)=>{
    Q[qi].comp_num = `${atribN}.${bplN}.${n+1}`;
  });
}

// Auto-renumber ALL questions in Q to fix X.Y.Z structure
function edRenumberAll(){
  if(!confirm('¿Renumerar automáticamente TODAS las preguntas?\nEsto sobrescribirá los números existentes según el orden actual.')) return;
  SHEETS().forEach(sh=>{
    const atribs=[...new Set(Q.filter(q=>q.sheet===sh).map(q=>q.bpl_num))].sort((a,b)=>a-b);
    atribs.forEach((bk, atribIdx)=>{
      const atribN = bk; // use bpl_num as atrib number
      const subattrs=[...new Set(Q.filter(q=>q.sheet===sh&&q.bpl_num===bk).map(q=>q.subattr||''))];
      subattrs.forEach((sa, bplIdx)=>{
        const bplN = bplIdx+1;
        const idxs=Q.map((x,i)=>i).filter(i=>Q[i].sheet===sh&&Q[i].bpl_num===bk&&Q[i].subattr===sa);
        idxs.forEach((qi,n)=>{
          Q[qi].comp_num = `${atribN}.${bplN}.${n+1}`;
        });
      });
    });
  });
  saveStructure(); markFormDirty();
  edRenderQuestions();
  showToast('✅ Renumeración completa');
}

let _edSaveTimer=null;
function edUpdateQ(idx,field,val){
  if(!Q[idx]) return;
  Q[idx][field]=field==='weight_attr'?parseFloat(val):val;
  markFormDirty();
  // Debounced save with visual feedback
  clearTimeout(_edSaveTimer);
  _edSaveTimer=setTimeout(function(){
    saveStructure();
    const st=document.getElementById('ed-save-status');
    if(st){ st.textContent='✓ Guardado'; st.style.opacity='1'; setTimeout(()=>st.style.opacity='0',1500); }
  },400);
  if(field==='critico') edRenderQuestions();
}
function edToggleCrit(idx,checked){
  if(!Q[idx]) return;
  if(checked){
    const maxN=Math.max(0,...Q.filter(q=>q.critico).map(q=>parseInt((q.critico||'').replace(/\D/g,''))||0));
    Q[idx].critico='CRITICO '+(maxN+1);
  } else { Q[idx].critico=null; }
  saveStructure(); markFormDirty(); edRenderQuestions();
}
function edDelQ(idx){
  if(!Q[idx]) return;
  if(!confirm('¿Eliminar esta pregunta?')) return;
  Q.splice(idx,1); saveStructure(); markFormDirty(); edRenderQuestions();
  showToast('🗑 Pregunta eliminada');
}
function edAddQuestion(){
  const sh=ED.area; const bk=ED.bplnum; const sa=ED.subattr;
  if(!sh||!bk||!sa){showToast('⚠️ Seleccioná Área → Atributo → BPL primero');return;}
  const bkQs=Q.filter(q=>q.sheet===sh&&String(q.bpl_num)===String(bk)&&(q.subattr||'')===sa);
  const maxComp=bkQs.reduce((m,q)=>{ const p=q.comp_num.split('.'); return Math.max(m,parseInt(p[2]||0)); },0);
  const subN=bkQs[0]?bkQs[0].comp_num.split('.')[1]:'1';
  const ref=bkQs[0]||{bpl_name:'',bpl_weight:1,peso_bpl:1};
  Q.push({sheet:sh,area:AN[sh]||sh,area_weight:AW[sh]||0,bpl_num:bk,bpl_name:ref.bpl_name,bpl_weight:ref.bpl_weight,subattr:sa,comp_num:bk+'.'+subN+'.'+(maxComp+1),question:'Nueva pregunta — editá el texto',critico:null,weight_attr:1,peso_bpl:ref.peso_bpl});
  saveStructure(); markFormDirty(); edRenderQuestions();
  // Auto-focus the last textarea so user can start typing immediately
  setTimeout(function(){
    const tas=document.querySelectorAll('#ed-q-list textarea');
    if(tas.length){ const last=tas[tas.length-1]; last.focus(); last.select(); }
  },50);
  showToast('✅ Pregunta agregada — escribí el texto directamente');
}


// ── IMPORTAR EXCEL CON AÑO ─────────────────────────────
function importExcelAudits(input){
  const file=input.files[0]; if(!file) return;
  const anio=document.getElementById('xl-import-anio').value||'2025';
  const log=document.getElementById('xl-import-log');
  log.textContent='Procesando...';
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const wb=XLSX.read(new Uint8Array(e.target.result),{type:'array'});
      // Try sheet "Respuestas Detalle"
      const wsName=wb.SheetNames.find(n=>n.toLowerCase().includes('respuesta')||n.toLowerCase().includes('detalle'))||wb.SheetNames[0];
      const ws=wb.Sheets[wsName];
      const rows=XLSX.utils.sheet_to_json(ws,{defval:''});
      if(!rows.length){log.textContent='⚠️ No se encontraron filas.';return;}
      // Expected cols: Distribuidor, #Pregunta or comp_num, Respuesta
      const distCol=Object.keys(rows[0]).find(k=>k.toLowerCase().includes('distrib'))||'Distribuidor';
      const compCol=Object.keys(rows[0]).find(k=>k.toLowerCase().includes('pregunta')||k.toLowerCase().includes('comp')||k==='#Pregunta')||'#Pregunta';
      const respCol=Object.keys(rows[0]).find(k=>k.toLowerCase().includes('respuesta'))||'Respuesta';
      const fechaCol=Object.keys(rows[0]).find(k=>k.toLowerCase().includes('fecha'))||'Fecha';
      const auditorCol=Object.keys(rows[0]).find(k=>k.toLowerCase().includes('auditor'))||'Auditor';
      
      // Group by distribuidor
      const byDist={};
      rows.forEach(r=>{
        const dist=(r[distCol]||'').toString().trim(); if(!dist) return;
        if(!byDist[dist]) byDist[dist]={dist,fecha:r[fechaCol]||'',auditor:r[auditorCol]||'',answers:{},comments:{}};
        const comp=(r[compCol]||'').toString().trim(); if(!comp) return;
        const resp=(r[respCol]||'').toString().trim().toLowerCase();
        const a=resp==='si'||resp==='sí'?'si':resp==='no'?'no':resp==='n/a'||resp==='na'?'na':null;
        if(a) byDist[dist].answers[comp]=a;
      });
      
      let added=0,replaced=0;
      Object.values(byDist).forEach(d=>{
        const sc=computeScores(d.answers); // imported without weight snapshot — uses current weights
        const audit={id:Date.now()+Math.random(),distribuidor:d.dist,fecha:d.fecha||new Date().toISOString().slice(0,10),auditor:d.auditor,edicion:anio,answers:d.answers,comments:d.comments,scores:sc};
        const idx=saved.findIndex(a=>a.distribuidor===d.dist&&a.edicion===anio);
        if(idx>=0){saved[idx]=audit;replaced++;}else{saved.push(audit);added++;}
      });
      persist(); updateAudCnt(); renderSaved(); renderGlobal();
      log.innerHTML=`✅ Importado desde "<strong>${wsName}</strong>": <strong>${added}</strong> nuevas, <strong>${replaced}</strong> reemplazadas. Edición asignada: <strong>${anio}</strong>`;
      input.value='';
      showToast('✅ Excel importado: '+(added+replaced)+' distribuidores');
    }catch(err){
      log.textContent='❌ Error: '+err.message;
      console.error(err);
      input.value='';
    }
  };
  reader.readAsArrayBuffer(file);
}

// ── RECALC SAVED SCORES FROM ANSWERS ──
// Called so that saved audits always reflect the current weight config
function recalcAuditScores(audit){
  if(!audit||!audit.answers) return audit;
  audit.scores = computeScores(audit.answers);
  return audit;
}

// ── CRITICAL MATRIX ──────────────────────────────────────
const CAT_COLORS = {
  PR:{label:'PROACTIVO',cls:'m-PR',color:'#2e7d32'},
  AC:{label:'ACTIVO',   cls:'m-AC',color:'#00695c'},
  RE:{label:'REACTIVO', cls:'m-RE',color:'#e65100'},
  IN:{label:'INACTIVO', cls:'m-IN',color:'#c62828'}
};
const SCORE_ROWS = [
  {label:'PROACTIVO', thr:'≥ '+THR.pro+'%', color:'#2e7d32'},
  {label:'ACTIVO',    thr:'≥ '+THR.act+'%', color:'#00695c'},
  {label:'REACTIVO',  thr:'≥ 50%',          color:'#e65100'},
  {label:'INACTIVO',  thr:'< 50%',          color:'#c62828'}
];

// Determine category from matrix given score and crit count
function getCategoryFromMatrix(score, critCount){
  const mx = MATRIX_CFG;
  // Find score row (0=PROACTIVO, 1=ACTIVO, 2=REACTIVO, 3=INACTIVO)
  let row = 3;
  if(score >= THR.pro/100) row = 0;
  else if(score >= THR.act/100) row = 1;
  else if(score >= 0.50) row = 2;
  // Find crit band column
  let col = mx.bands.length - 1; // default to last band
  for(let i = 0; i < mx.bands.length; i++){
    if(mx.bands[i].max !== null && critCount <= mx.bands[i].max){
      col = i; break;
    }
  }
  const code = mx.cells[row] && mx.cells[row][col] ? mx.cells[row][col] : 'IN';
  return CAT_COLORS[code] ? CAT_COLORS[code].label : 'INACTIVO';
}

// Render the matrix table dynamically
function renderCritMatrix(currentCritCount, currentScoreRow, matrixOverride){
  const mx = matrixOverride || (_loadedFrozenAudit&&_loadedFrozenAudit.weights&&_loadedFrozenAudit.weights.matrixCfg) || MATRIX_CFG;
  const wrap = document.getElementById('mx-table-wrap');
  if(!wrap) return;

  let h = `<table class="mx-table"><thead>
    <tr>
      <th class="mh1" style="text-align:left">Categoría</th>
      <th class="mh1">Puntaje</th>
      <th class="mh2" colspan="${mx.bands.length}">BPL Condicionales Cumplidos</th>
    </tr>
    <tr>
      <th class="mh3"></th><th class="mh3"></th>
      ${mx.bands.map(b=>`<th class="mh3">${b.label}</th>`).join('')}
    </tr>
  </thead><tbody>`;

  const rows = [
    {label:'PROACTIVO', thr:'≥ '+THR.pro+'%', color:'#2e7d32', row:0},
    {label:'ACTIVO',    thr:'≥ '+THR.act+'%', color:'#00695c', row:1},
    {label:'REACTIVO',  thr:'≥ 50%',          color:'#e65100', row:2},
    {label:'INACTIVO',  thr:'< 50%',          color:'#c62828', row:3}
  ];

  rows.forEach(r=>{
    h += `<tr><td style="font-weight:700;text-align:left;color:${r.color}">${r.label}</td>
      <td style="font-size:10px;color:var(--g500)">${r.thr}</td>`;
    mx.bands.forEach((b,ci)=>{
      const code = (mx.cells[r.row]||[])[ci]||'IN';
      const catInfo = CAT_COLORS[code]||CAT_COLORS.IN;
      const isActive = (currentScoreRow===r.row && currentCritCount!==undefined &&
        (ci===mx.bands.length-1 ? true : currentCritCount<=b.max) &&
        (ci===0 ? true : currentCritCount>(mx.bands[ci-1].max||0)));
      h += `<td id="mx${r.row}${ci}" class="${catInfo.cls}${isActive?' mx-active':''}"
        title="Click para editar" onclick="cycleCritCell(${r.row},${ci})"
        style="cursor:pointer">${catInfo.label}</td>`;
    });
    h += '</tr>';
  });

  h += '</tbody></table>';
  wrap.innerHTML = h;
}

// Cycle through categories on cell click
function cycleCritCell(row, col){
  const order = ['PR','AC','RE','IN'];
  const cur = (MATRIX_CFG.cells[row]||[])[col]||'IN';
  const nextIdx = (order.indexOf(cur)+1) % order.length;
  if(!MATRIX_CFG.cells[row]) MATRIX_CFG.cells[row]=[];
  MATRIX_CFG.cells[row][col] = order[nextIdx];
  saveMatrixCfg(MATRIX_CFG);
  // Re-render with current position
  const critEl = document.getElementById('mx-bpl-cnt');
  const critN = critEl ? parseInt(critEl.textContent)||0 : 0;
  renderCritMatrix(critN, -1);
  recalc(); // recalculate all scores with new matrix
  showToast('✅ Matriz actualizada');
}

// Add/remove bands
function addCritBand(){
  const mx = MATRIX_CFG;
  const lastMax = (mx.bands[mx.bands.length-2]||{}).max||0;
  const newMax = lastMax + 3;
  // Insert before the last (open-ended) band
  const label = (lastMax+1)+' – '+newMax;
  mx.bands.splice(mx.bands.length-1, 0, {label, max:newMax});
  // Add column to each row
  mx.cells.forEach(row=>{ row.splice(row.length-1, 0, 'RE'); });
  saveMatrixCfg(mx);
  renderCritMatrix(); renderMatrixEditor();
  showToast('✅ Banda agregada');
}
function removeCritBand(idx){
  const mx = MATRIX_CFG;
  if(mx.bands.length <= 2){ showToast('⚠️ Mínimo 2 bandas'); return; }
  mx.bands.splice(idx,1);
  mx.cells.forEach(row=>row.splice(idx,1));
  saveMatrixCfg(mx);
  renderCritMatrix(); renderMatrixEditor();
  showToast('🗑 Banda eliminada');
}
function updateBandLabel(idx, val){
  MATRIX_CFG.bands[idx].label = val;
  saveMatrixCfg(MATRIX_CFG);
  renderCritMatrix(); renderMatrixEditor();
}
function resetCritMatrix(){
  if(!confirm('¿Restablecer la matriz a los valores por defecto?')) return;
  MATRIX_CFG = JSON.parse(JSON.stringify(MATRIX_DEFAULT));
  saveMatrixCfg(MATRIX_CFG);
  renderCritMatrix(); renderMatrixEditor();
  recalc();
  showToast('✅ Matriz restablecida');
}

// Render the matrix editor in Config panel
function renderMatrixEditor(){
  const wrap = document.getElementById('matrix-editor-wrap');
  if(!wrap) return;
  const mx = MATRIX_CFG;
  const cats = [
    {code:'PR', label:'PROACTIVO', color:'#2e7d32', bg:'#e8f5e9'},
    {code:'AC', label:'ACTIVO',    color:'#00695c', bg:'#e0f2f1'},
    {code:'RE', label:'REACTIVO',  color:'#e65100', bg:'#fff3e0'},
    {code:'IN', label:'INACTIVO',  color:'#c62828', bg:'#ffebee'}
  ];
  const scoreRows = [
    {label:'PROACTIVO', color:'#2e7d32', row:0},
    {label:'ACTIVO',    color:'#00695c', row:1},
    {label:'REACTIVO',  color:'#e65100', row:2},
    {label:'INACTIVO',  color:'#c62828', row:3}
  ];

  let h = `<div style="font-size:11px;color:var(--blue);background:var(--blue-xl);border-radius:6px;padding:8px 12px;margin-bottom:14px">
    💡 Editá las bandas de críticos, sus rangos, y la categoría de cada celda. Los cambios se aplican en tiempo real.
  </div>`;

  // ── BANDAS EDITOR ─────────────────────────────────────────────
  h += `<div style="margin-bottom:18px">
    <div style="font-size:11px;font-weight:800;color:var(--g600);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px">
      Bandas de Condicionales Críticos
    </div>
    <div style="display:flex;flex-direction:column;gap:6px" id="bands-editor">`;

  mx.bands.forEach((b, i) => {
    const isLast = i === mx.bands.length - 1;
    h += `<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:#fff;border:1.5px solid var(--g200);border-radius:8px">
      <div style="font-size:11px;font-weight:700;color:var(--g500);min-width:24px">${i+1}</div>
      <div style="flex:1">
        <div style="font-size:10px;color:var(--g400);margin-bottom:3px;text-transform:uppercase;letter-spacing:.5px">Etiqueta visible</div>
        <input type="text" value="${b.label}"
          style="width:100%;padding:5px 9px;border:1.5px solid var(--g200);border-radius:5px;font-size:12px;font-weight:700;font-family:inherit"
          onchange="updateBandLabel(${i}, this.value)">
      </div>
      <div style="width:110px">
        <div style="font-size:10px;color:var(--g400);margin-bottom:3px;text-transform:uppercase;letter-spacing:.5px">${isLast ? 'Máximo (vacío=∞)' : 'Hasta (N° críticos)'}</div>
        <input type="number" value="${b.max !== null ? b.max : ''}" min="0" max="999"
          placeholder="${isLast ? '∞' : 'ej: 5'}"
          style="width:100%;padding:5px 9px;border:1.5px solid var(--g200);border-radius:5px;font-size:12px;font-family:inherit;text-align:center"
          onchange="updateBandMax(${i}, this.value)">
      </div>
      ${mx.bands.length > 2 ? `<button onclick="removeCritBand(${i})"
        style="width:28px;height:28px;border-radius:6px;border:1.5px solid var(--g200);background:#fff;cursor:pointer;color:var(--red);font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0"
        title="Eliminar banda">✕</button>` : `<div style="width:28px"></div>`}
    </div>`;
  });

  h += `</div>
    <button class="btn btn-green btn-sm" onclick="addCritBand()" style="margin-top:8px">+ Agregar Banda</button>
  </div>`;

  // ── SCORE ROWS EDITOR ─────────────────────────────────────────
  h += `<div style="margin-bottom:18px">
    <div style="font-size:11px;font-weight:800;color:var(--g600);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px">
      Umbrales de Puntaje (definen las filas)
    </div>
    <div style="background:#fff;border:1.5px solid var(--g200);border-radius:8px;overflow:hidden">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;padding:8px 12px;background:var(--g50);font-size:10px;font-weight:700;color:var(--g500);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--g200)">
        <div>Categoría</div><div>Puntaje mínimo</div><div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;padding:10px 12px;border-bottom:1px solid var(--g100);align-items:center">
        <div style="font-weight:800;color:#2e7d32">PROACTIVO</div>
        <div style="display:flex;align-items:center;gap:6px">
          ≥ <input type="number" value="${THR.pro}" min="1" max="100" style="width:60px;padding:4px 8px;border:1.5px solid var(--g200);border-radius:5px;font-size:12px;text-align:center;font-family:inherit"
            onchange="updateThreshold('pro',this.value)"> %
        </div>
        <div style="font-size:10px;color:var(--g400)">Puntaje más alto</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;padding:10px 12px;border-bottom:1px solid var(--g100);align-items:center">
        <div style="font-weight:800;color:#00695c">ACTIVO</div>
        <div style="display:flex;align-items:center;gap:6px">
          ≥ <input type="number" value="${THR.act}" min="1" max="100" style="width:60px;padding:4px 8px;border:1.5px solid var(--g200);border-radius:5px;font-size:12px;text-align:center;font-family:inherit"
            onchange="updateThreshold('act',this.value)"> %
        </div>
        <div style="font-size:10px;color:var(--g400)">Por debajo de PROACTIVO</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;padding:10px 12px;border-bottom:1px solid var(--g100);align-items:center">
        <div style="font-weight:800;color:#e65100">REACTIVO</div>
        <div style="display:flex;align-items:center;gap:6px">
          ≥ <input type="number" value="${THR.rea}" min="1" max="100" style="width:60px;padding:4px 8px;border:1.5px solid var(--g200);border-radius:5px;font-size:12px;text-align:center;font-family:inherit"
            onchange="updateThreshold('rea',this.value)"> %
        </div>
        <div style="font-size:10px;color:var(--g400)">Por debajo de ACTIVO</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;padding:10px 12px;align-items:center">
        <div style="font-weight:800;color:#c62828">INACTIVO</div>
        <div style="font-size:11px;color:var(--g400)">< ${THR.rea}%</div>
        <div style="font-size:10px;color:var(--g400)">Puntaje más bajo</div>
      </div>
    </div>
  </div>`;

  // ── MATRIX CELLS EDITOR ───────────────────────────────────────
  h += `<div>
    <div style="font-size:11px;font-weight:800;color:var(--g600);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px">
      Categoría por celda
      <span style="font-size:10px;font-weight:400;color:var(--g400);text-transform:none;letter-spacing:0"> — usá el desplegable en cada celda</span>
    </div>
    <div style="overflow-x:auto">
    <table style="width:100%;border-collapse:collapse;min-width:400px">
      <thead>
        <tr>
          <th style="padding:8px 12px;background:var(--g50);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--g500);border:1px solid var(--g200);text-align:left">Puntaje →</th>
          ${mx.bands.map(b=>`<th style="padding:8px 12px;background:var(--g50);font-size:11px;font-weight:700;color:var(--g600);border:1px solid var(--g200);text-align:center">${b.label} crít.</th>`).join('')}
        </tr>
      </thead>
      <tbody>`;

  scoreRows.forEach(r => {
    h += `<tr>
      <td style="padding:8px 12px;font-weight:800;color:${r.color};border:1px solid var(--g200);white-space:nowrap">${r.label}</td>`;
    mx.bands.forEach((b, ci) => {
      const code = (mx.cells[r.row]||[])[ci]||'IN';
      const cat = cats.find(x=>x.code===code)||cats[3];
      h += `<td style="padding:6px 8px;border:1px solid var(--g200);background:${cat.bg}">
        <select onchange="setCritCell(${r.row},${ci},this.value)"
          style="width:100%;padding:5px 6px;border:1.5px solid ${cat.color}44;border-radius:6px;
            font-size:11px;font-weight:800;color:${cat.color};background:${cat.bg};
            font-family:inherit;cursor:pointer;text-align:center">
          ${cats.map(opt=>`<option value="${opt.code}" ${opt.code===code?'selected':''} 
            style="color:${opt.color}">${opt.label}</option>`).join('')}
        </select>
      </td>`;
    });
    h += '</tr>';
  });

  h += `</tbody></table></div>
    <div style="display:flex;gap:8px;margin-top:14px;justify-content:flex-end">
      <button class="btn btn-red btn-sm" onclick="resetCritMatrix()">↺ Restablecer defaults</button>
    </div>
  </div>`;

  wrap.innerHTML = h;
}

// Update band max from number input
function updateBandMax(idx, val){
  const num = val===''||val===null ? null : parseInt(val);
  MATRIX_CFG.bands[idx].max = isNaN(num) ? null : num;
  saveMatrixCfg(MATRIX_CFG);
  renderCritMatrix(); renderMatrixEditor();
  recalc();
}

// Update threshold and re-render
function updateThreshold(key, val){
  const num = parseInt(val)||0;
  THR[key] = Math.max(1, Math.min(99, num));
  saveCfg();
  renderCritMatrix();
  renderMatrixEditor();
  recalc();
  showToast('✅ Umbral actualizado: '+key.toUpperCase()+' = '+THR[key]+'%');
}

// Set cell directly from select
function setCritCell(row, col, code){
  if(!MATRIX_CFG.cells[row]) MATRIX_CFG.cells[row]=[];
  MATRIX_CFG.cells[row][col] = code;
  saveMatrixCfg(MATRIX_CFG);
  renderCritMatrix();
  recalc();
  // Don't re-render editor on cell change — keeps focus on the select
}


function updateBandMax(idx, val){
  const n = parseInt(val);
  MATRIX_CFG.bands[idx].max = isNaN(n) ? null : n;
  saveMatrixCfg(MATRIX_CFG);
  renderCritMatrix();
  recalc();
}

// Set cell directly from select
function setCritCell(row, col, code){
  if(!MATRIX_CFG.cells[row]) MATRIX_CFG.cells[row]=[];
  MATRIX_CFG.cells[row][col] = code;
  saveMatrixCfg(MATRIX_CFG);
  // Update select style
  const sel = document.getElementById('mxsel_'+row+'_'+col);
  if(sel){
    const cat = CAT_COLORS[code]||CAT_COLORS.IN;
    sel.style.borderColor = cat.color;
    sel.style.color = cat.color;
    sel.style.background = cat.color+'18';
  }
  renderCritMatrix();
  recalc();
  showToast('✅ Matriz actualizada');
}

// ── PPTX REPORT GENERATOR ─────────────────────────────────
async function generatePPTX(){
  if(typeof PptxGenJS==='undefined'){ showToast('❌ PptxGenJS no cargó. Recompilá la app.'); return; }
  if(saved.length===0){ showToast('⚠️ No hay auditorías para generar el informe'); return; }
  showToast('⏳ Generando informe PPTX...');
  
  const C={dark:"1E3357",mid:"2F5496",light:"4472C4",
    accent:"0070C0",accentSoft:"B3C6E7",
    white:"FFFFFF",offwhite:"F0F4FA",
    g50:"F8FAFC",g100:"E8EDF5",g200:"C5D3E8",g300:"8DA9DB",g500:"5B7DB5",g700:"2C3E6B",
    proact:"00B050",activo:"0D9488",reactivo:"ED7D31",inactivo:"C62828"};
  const AREA_C=Object.fromEntries(SHEETS().map(sh=>[sh,(AC[sh]||'#607d8b').replace('#','')]));
  const CAT_C={PROACTIVO:C.proact,ACTIVO:C.activo,REACTIVO:C.reactivo,INACTIVO:C.inactivo};
  const AREAS=SHEETS_CORE();
  const W=13.3,H=7.5;

  // Get current edition filter or use all
  // Use all saved audits (ignore edition filter when generating full report)
  const data = saved.filter(a=>a.scores&&a.scores.total!==undefined);
  if(data.length===0){ showToast('⚠️ No hay auditorías guardadas'); return; }

  const sortedA=[...data].sort((a,b)=>b.scores.total-a.scores.total);
  const avg=data.reduce((s,a)=>s+a.scores.total,0)/data.length;
  const cats={PROACTIVO:0,ACTIVO:0,REACTIVO:0,INACTIVO:0};
  data.forEach(a=>cats[recomputeCategory(a)]=(cats[recomputeCategory(a)]||0)+1);
  const totalCrits=auditTotalCrits(data[0]);
  const avgCrits=data.reduce((s,a)=>s+a.scores.critMet,0)/data.length;
  const areaAvg={};
  AREAS.forEach(ar=>{const v=data.map(a=>a.scores.areas[ar]||0);areaAvg[ar]=v.reduce((s,x)=>s+x,0)/v.length;});

  const critTags=[];
  data.forEach(a=>Object.keys(a.scores.critStatus||{}).forEach(t=>{if(!critTags.includes(t))critTags.push(t);}));
  critTags.sort((a,b)=>parseInt(a.split(" ")[1])-parseInt(b.split(" ")[1]));
  const critComp={};
  critTags.forEach(tag=>{ critComp[tag]=data.filter(a=>(a.scores.critStatus||{})[tag]==='met').length/data.length; });

  // Q analysis
  const qNo={},qTotal={};
  data.forEach(a=>Object.entries(a.answers||{}).forEach(([comp,resp])=>{
    qTotal[comp]=(qTotal[comp]||0)+1;
    if(resp==='no') qNo[comp]=(qNo[comp]||0)+1;
  }));
  const qNoRate=Object.entries(qTotal).map(([comp,tot])=>({comp,pct:(qNo[comp]||0)/tot,n:(qNo[comp]||0),tot})).sort((a,b)=>b.pct-a.pct);
  const top15=qNoRate.slice(0,15);

  // Logos as base64
  const logos={};
  try{
    const logoEls=[['bap','logo_bap'],['arcor','logo_arcor'],['ra','logo_ra']];
    for(const[k,id] of logoEls){
      const el=document.getElementById(id);
      if(el&&el.src) logos[k]=el.src.split(',')[1]||'';
    }
  }catch(e){}

  const PAIS=cfg.pais||'RED';
  const ANIO=cfg.anio||'2025';

  const pptx=new PptxGenJS();
  pptx.layout="LAYOUT_WIDE";
  pptx.title=`RED Activa 2.0 · ${PAIS} ${ANIO}`;

  const mkSh=()=>({type:"outer",blur:6,offset:2,angle:135,color:"000000",opacity:0.08});
  const addHeader=(s,title,sub="")=>{
    s.addShape(pptx.shapes.RECTANGLE,{x:0,y:0,w:W,h:0.55,fill:{color:C.mid},line:{color:C.mid}});
    s.addShape(pptx.shapes.RECTANGLE,{x:0,y:0.55,w:W,h:0.04,fill:{color:C.accent},line:{color:C.accent}});
    s.addText(title,{x:0.28,y:0,w:9.5,h:0.55,fontSize:16,bold:true,color:C.white,valign:"middle",fontFace:"Calibri"});
    if(sub) s.addText(sub,{x:0.28,y:0.19,w:9.5,h:0.34,fontSize:8.5,color:C.accentSoft,valign:"middle",fontFace:"Calibri"});
    if(logos.bap) s.addImage({data:`image/png;base64,${logos.bap}`,x:W-2.2,y:0.04,w:2.05,h:0.47});
    s.addShape(pptx.shapes.RECTANGLE,{x:0,y:H-0.22,w:W,h:0.22,fill:{color:C.g100},line:{color:C.g200}});
    s.addText(`RED Activa 2.0 · ${PAIS} ${ANIO}`,{x:0.2,y:H-0.22,w:7,h:0.22,fontSize:7,color:C.g500,valign:"middle"});
    s.addText("BAP Partners Consultoría Empresarial",{x:W-3.6,y:H-0.22,w:3.4,h:0.22,fontSize:7,color:C.g500,align:"right",valign:"middle"});
  };
  const kpi=(s,x,y,w,h,val,lbl,sub,col)=>{
    s.addShape(pptx.shapes.RECTANGLE,{x,y,w,h,fill:{color:C.white},line:{color:C.g200},shadow:mkSh()});
    s.addShape(pptx.shapes.RECTANGLE,{x,y,w,h:0.05,fill:{color:col},line:{color:col}});
    s.addText(val,{x:x+0.15,y:y+0.1,w:w-0.2,h:h*0.52,fontSize:26,bold:true,color:col,valign:"middle",fontFace:"Calibri"});
    s.addText(lbl,{x:x+0.15,y:y+h*0.57,w:w-0.2,h:h*0.28,fontSize:8.5,bold:true,color:C.g700,fontFace:"Calibri"});
    if(sub) s.addText(sub,{x:x+0.15,y:y+h*0.78,w:w-0.2,h:h*0.22,fontSize:7.5,color:C.g500,fontFace:"Calibri"});
  };

  // ── SLIDE 1: PORTADA
  {const s=pptx.addSlide();s.background={color:C.white};
  // Panel izquierdo navy
  s.addShape(pptx.shapes.RECTANGLE,{x:0,y:0,w:4.65,h:H,fill:{color:C.dark},line:{color:C.dark}});
  // Franja accent superior en panel izquierdo
  s.addShape(pptx.shapes.RECTANGLE,{x:0,y:0,w:4.65,h:0.06,fill:{color:C.accent},line:{color:C.accent}});
  // Divisor vertical accent
  s.addShape(pptx.shapes.RECTANGLE,{x:4.65,y:0,w:0.05,h:H,fill:{color:C.accent},line:{color:C.accent}});
  // Panel izquierdo: logo RED Activa
  if(logos.ra) s.addImage({data:`image/png;base64,${logos.ra}`,x:0.3,y:0.2,w:4.1,h:1.55});
  // Panel izquierdo: separador
  s.addShape(pptx.shapes.LINE,{x:0.3,y:1.98,w:4.0,h:0,line:{color:C.accent,width:1.2}});
  // Panel izquierdo: título
  s.addText("Cierre de",{x:0.3,y:2.08,w:4.1,h:0.7,fontSize:31,bold:true,color:C.white,fontFace:"Calibri"});
  s.addText("Resultados",{x:0.3,y:2.75,w:4.1,h:0.7,fontSize:31,bold:true,color:C.white,fontFace:"Calibri"});
  s.addText(`RED Activa 2.0 · ${PAIS}`,{x:0.3,y:3.56,w:4.1,h:0.42,fontSize:13,color:C.accentSoft,fontFace:"Calibri"});
  s.addText(`Edición ${ANIO}`,{x:0.3,y:3.98,w:4.1,h:0.38,fontSize:13,bold:true,color:C.accent,fontFace:"Calibri"});
  // Panel izquierdo: logo BAP abajo
  if(logos.bap) s.addImage({data:`image/png;base64,${logos.bap}`,x:0.3,y:5.9,w:2.9,h:1.05});
  // Panel derecho: logo ARCOR arriba
  if(logos.arcor) s.addImage({data:`image/png;base64,${logos.arcor}`,x:5.1,y:0.25,w:3.2,h:2.1});
  // Panel derecho: KPIs 2×2
  const kpis=[
    {v:`${data.length}`,l:"Distribuidores auditados",c:C.mid},
    {v:`${(avg*100).toFixed(1)}%`,l:"Promedio ponderado RED",c:C.mid},
    {v:`${(cats.PROACTIVO||0)+(cats.ACTIVO||0)}/${data.length}`,l:"Cumplen objetivo",c:C.proact},
    {v:`${avgCrits.toFixed(1)}/${totalCrits}`,l:"BPL críticos promedio",c:C.g700},
  ];
  kpis.forEach((k,i)=>{
    const col=i%2,row=Math.floor(i/2);
    const kx=4.88+col*4.15,ky=2.58+row*1.52;
    s.addShape(pptx.shapes.RECTANGLE,{x:kx,y:ky,w:3.95,h:1.32,fill:{color:C.white},line:{color:C.g200}});
    s.addShape(pptx.shapes.RECTANGLE,{x:kx,y:ky,w:3.95,h:0.06,fill:{color:k.c},line:{color:k.c}});
    s.addText(k.v,{x:kx+0.18,y:ky+0.1,w:3.6,h:0.65,fontSize:28,bold:true,color:k.c,fontFace:"Calibri",valign:"middle"});
    s.addText(k.l,{x:kx+0.18,y:ky+0.8,w:3.6,h:0.4,fontSize:9.5,color:C.g700,fontFace:"Calibri"});
  });}

  // ── SLIDE 2: RESUMEN EJECUTIVO
  {const s=pptx.addSlide();s.background={color:C.white};addHeader(s,"Resumen Ejecutivo",`RED Activa 2.0 · ${PAIS} · Edición ${ANIO}`);
  // 4 KPIs fila superior
  const kpis2=[
    {v:`${(avg*100).toFixed(1)}%`,l:"Promedio Ponderado RED",c:C.mid},
    {v:`${data.length}`,l:"Distribuidores Auditados",c:C.accent},
    {v:`${Math.round(((cats.PROACTIVO||0)+(cats.ACTIVO||0))/data.length*100)}%`,l:"Cumplen Objetivo",c:C.proact},
    {v:`${avgCrits.toFixed(1)}/${totalCrits}`,l:"BPL Críticos Prom.",c:C.reactivo},
  ];
  kpis2.forEach((k,i)=>{
    const x=0.25+i*3.2;
    s.addShape(pptx.shapes.RECTANGLE,{x,y:0.68,w:3.1,h:1.05,fill:{color:C.white},line:{color:C.g200}});
    s.addShape(pptx.shapes.RECTANGLE,{x,y:0.68,w:3.1,h:0.05,fill:{color:k.c},line:{color:k.c}});
    s.addText(k.v,{x:x+0.14,y:0.76,w:2.82,h:0.52,fontSize:26,bold:true,color:k.c,fontFace:"Calibri",valign:"middle"});
    s.addText(k.l,{x:x+0.14,y:1.28,w:2.82,h:0.34,fontSize:9,color:C.g500,fontFace:"Calibri"});
  });
  // Gráfico izquierdo: distribución categorías
  s.addChart(pptx.charts.BAR,[{name:"N",labels:["PROACTIVO","ACTIVO","REACTIVO","INACTIVO"],values:[cats.PROACTIVO||0,cats.ACTIVO||0,cats.REACTIVO||0,cats.INACTIVO||0]}],{
    x:0.25,y:1.86,w:5.8,h:5.39,barDir:"bar",
    chartColors:[C.proact,C.activo,C.reactivo,C.inactivo],
    chartArea:{fill:{color:C.white}},plotArea:{fill:{color:C.white}},
    showValue:true,dataLabelPosition:"outEnd",dataLabelColor:C.g700,dataLabelFontSize:13,dataLabelFontBold:true,
    catAxisLabelColor:C.g700,catAxisLabelFontSize:11,catAxisLabelFontBold:true,
    valAxisHidden:true,catGridLine:{style:"none"},valGridLine:{style:"none"},
    showLegend:false,title:"Distribución por Categoría",showTitle:true,titleColor:C.g700,titleFontSize:12,titleFontBold:true,
  });
  // Gráfico derecho: puntaje por área
  s.addChart(pptx.charts.BAR,[{name:"%",labels:AREAS.map(a=>`${a} · ${AN[a]?AN[a].split(" ")[0]:a}`),values:AREAS.map(a=>Math.round(areaAvg[a]*1000)/10)}],{
    x:6.3,y:1.86,w:6.75,h:5.39,barDir:"bar",
    chartColors:AREAS.map(a=>AREA_C[a]),
    chartArea:{fill:{color:C.white}},plotArea:{fill:{color:C.white}},
    showValue:true,dataLabelPosition:"outEnd",dataLabelColor:C.g700,dataLabelFontSize:11,dataLabelFontBold:true,
    catAxisLabelColor:C.g700,catAxisLabelFontSize:11,catAxisLabelFontBold:true,
    valAxisMinVal:0,valAxisMaxVal:100,
    valGridLine:{color:C.g100},catGridLine:{style:"none"},
    showLegend:false,title:"Puntaje Promedio por Área (%)",showTitle:true,titleColor:C.g700,titleFontSize:12,titleFontBold:true,
  });}

  // ── SLIDE 3: RANKING
  {const s=pptx.addSlide();s.background={color:C.white};addHeader(s,"Ranking de Distribuidores","Ordenado por puntaje ponderado total — coloreado por categoría");
  s.addChart(pptx.charts.BAR,[{name:"%",labels:sortedA.map(a=>a.distribuidor.substring(0,32)),values:sortedA.map(a=>Math.round(a.scores.total*1000)/10)}],{
    x:0.25,y:0.68,w:9.3,h:6.57,barDir:"bar",
    chartColors:sortedA.map(a=>CAT_C[recomputeCategory(a)]||C.g500),
    chartArea:{fill:{color:C.white}},plotArea:{fill:{color:C.white}},
    showValue:true,dataLabelPosition:"outEnd",dataLabelColor:C.g700,dataLabelFontSize:8,dataLabelFontBold:true,
    catAxisLabelColor:C.g700,catAxisLabelFontSize:7.5,
    valAxisMinVal:0,valAxisMaxVal:100,
    valGridLine:{color:C.g100},catGridLine:{style:"none"},showLegend:false,
  });
  // Panel derecho — leyenda de categorías
  const leg=[{c:C.proact,l:"PROACTIVO",d:"≥85%"},{c:C.activo,l:"ACTIVO",d:"≥70%"},{c:C.reactivo,l:"REACTIVO",d:"≥50%"},{c:C.inactivo,l:"INACTIVO",d:"<50%"}];
  leg.forEach((li,i)=>{
    const ly=0.72+i*0.52;
    s.addShape(pptx.shapes.RECTANGLE,{x:9.77,y:ly+0.05,w:0.24,h:0.24,fill:{color:li.c},line:{color:li.c}});
    s.addText(li.l,{x:10.1,y:ly,w:3.0,h:0.22,fontSize:9,bold:true,color:li.c});
    s.addText(li.d,{x:10.1,y:ly+0.22,w:3.0,h:0.2,fontSize:8.5,color:C.g500});
  });
  // Tabla resumen
  s.addShape(pptx.shapes.RECTANGLE,{x:9.77,y:3.05,w:3.28,h:4.2,fill:{color:C.g50},line:{color:C.g200}});
  s.addShape(pptx.shapes.RECTANGLE,{x:9.77,y:3.05,w:3.28,h:0.36,fill:{color:C.mid},line:{color:C.mid}});
  s.addText("Distribución por Categoría",{x:9.88,y:3.05,w:3.06,h:0.36,fontSize:8.5,bold:true,color:C.white,valign:"middle"});
  const sumR=[["Categoría","N°","%"],...["PROACTIVO","ACTIVO","REACTIVO","INACTIVO"].map(c=>[c,String(cats[c]||0),`${Math.round((cats[c]||0)/data.length*100)}%`]),["TOTAL",String(data.length),"100%"]];
  sumR.forEach((row,ri)=>{
    const ry=3.44+ri*0.52;const isH=ri===0,isT=ri===sumR.length-1;
    s.addShape(pptx.shapes.RECTANGLE,{x:9.77,y:ry,w:3.28,h:0.5,fill:{color:isH||isT?C.g100:C.white},line:{color:C.g200}});
    if(ri>0&&ri<sumR.length-1){const cc=CAT_C[row[0]]||C.g700;s.addShape(pptx.shapes.RECTANGLE,{x:9.77,y:ry,w:0.06,h:0.5,fill:{color:cc},line:{color:cc}});}
    const cx=[{x:9.86,w:1.7},{x:11.6,w:0.65},{x:12.28,w:0.7}];
    row.forEach((cell,ci)=>{
      const tc=isH||isT?C.g700:(ci===0?CAT_C[cell]||C.g700:C.dark);
      s.addText(cell,{x:cx[ci].x,y:ry,w:cx[ci].w,h:0.5,fontSize:9,bold:isH||isT,color:tc,valign:"middle",align:ci===0?"left":"center"});
    });
  });}

  // ── SLIDE 4: PUNTAJE POR ÁREA
  {const s=pptx.addSlide();s.background={color:C.white};addHeader(s,"Puntaje por Área de Interés","Score promedio de todos los distribuidores por área");
  const nAreas=AREAS.length;const aW=Math.min(3.5,12.6/nAreas);
  AREAS.forEach((area,i)=>{
    const x=0.25+i*aW;const pct=(areaAvg[area]*100);const col=AREA_C[area];
    s.addShape(pptx.shapes.RECTANGLE,{x,y:0.68,w:aW-0.1,h:1.1,fill:{color:col},line:{color:col}});
    s.addText(area,{x:x+0.1,y:0.71,w:aW-0.2,h:0.3,fontSize:11,bold:true,color:C.white,fontFace:"Calibri"});
    s.addText(AN[area]||area,{x:x+0.1,y:0.98,w:aW-0.2,h:0.22,fontSize:8,color:C.white,fontFace:"Calibri"});
    s.addText(`${pct.toFixed(1)}%`,{x:x+0.1,y:1.18,w:aW-0.2,h:0.5,fontSize:24,bold:true,color:C.white,fontFace:"Calibri"});
  });
  s.addChart(pptx.charts.BAR,AREAS.map(area=>({
    name:(AN[area]||area).split(" ")[0],
    labels:sortedA.map(a=>a.distribuidor.substring(0,22)),
    values:sortedA.map(a=>Math.round((a.scores.areas[area]||0)*1000)/10),
  })),{
    x:0.25,y:1.9,w:12.8,h:5.35,barDir:"col",barGrouping:"clustered",
    chartColors:AREAS.map(a=>AREA_C[a]),
    chartArea:{fill:{color:C.white}},plotArea:{fill:{color:C.white}},
    valAxisMinVal:0,valAxisMaxVal:100,
    catAxisLabelColor:C.g700,catAxisLabelFontSize:7,catAxisLabelRotate:35,
    valGridLine:{color:C.g100},catGridLine:{style:"none"},
    showLegend:true,legendPos:"t",legendColor:C.g700,legendFontSize:9,showValue:false,
  });}

  // ── SLIDE(S) 5: CRÍTICOS — todos los distribuidores, paginado si es necesario
  {const CRIT_PER_PAGE=22;
  const critPages=Math.ceil(sortedA.length/CRIT_PER_PAGE);
  for(let pg=0;pg<critPages;pg++){
    const pageDistrs=sortedA.slice(pg*CRIT_PER_PAGE,(pg+1)*CRIT_PER_PAGE);
    const pageLbl=critPages>1?` · Página ${pg+1} de ${critPages}`:"";
    const s=pptx.addSlide();s.background={color:C.white};
    addHeader(s,"Análisis de Condicionales Críticos",`Cumplimiento por distribuidor${pageLbl}`);
    // Gráfico de cumplimiento solo en primera página
    if(pg===0){
      s.addChart(pptx.charts.BAR,[{name:"%",labels:critTags.map(t=>t.replace("CRITICO ","C")),values:critTags.map(t=>Math.round(critComp[t]*100))}],{
        x:0.25,y:0.65,w:12.8,h:2.42,barDir:"col",
        chartColors:critTags.map(t=>{const v=critComp[t]*100;return v>=90?C.proact:v>=70?C.activo:v>=50?C.reactivo:C.inactivo;}),
        chartArea:{fill:{color:C.white}},plotArea:{fill:{color:C.white}},
        showValue:true,dataLabelPosition:"outEnd",dataLabelColor:C.g700,dataLabelFontSize:9,dataLabelFontBold:true,
        catAxisLabelColor:C.g700,catAxisLabelFontSize:9,catAxisLabelFontBold:true,
        valAxisMinVal:0,valAxisMaxVal:100,
        valGridLine:{color:C.g100},catGridLine:{style:"none"},showLegend:false,
        title:"% de Distribuidores que Cumplen cada Condicional Crítico",
        showTitle:true,titleColor:C.g700,titleFontSize:10,titleFontBold:true,
      });
      // Leyenda
      const lz=[{c:C.proact,l:"≥90%"},{c:C.activo,l:"70-89%"},{c:C.reactivo,l:"50-69%"},{c:C.inactivo,l:"<50%"}];
      lz.forEach((li,i)=>{
        s.addShape(pptx.shapes.RECTANGLE,{x:0.4+i*2.4,y:3.14,w:0.2,h:0.2,fill:{color:li.c},line:{color:li.c}});
        s.addText(li.l,{x:0.68+i*2.4,y:3.14,w:2.0,h:0.2,fontSize:8.5,color:C.g700,valign:"middle"});
      });
    }
    // Tabla de heat-map (todos los distribs de esta página)
    const tableY=pg===0?3.42:0.68;
    const availH=H-0.22-tableY;
    const N=pageDistrs.length;
    const rh=Math.max(0.16,Math.min(0.28,availH/(N+1)));
    const tx=0.25,tW=12.8;
    const distW=Math.min(3.8,tW*0.28);
    const bplW=0.7;
    const ncw=Math.max(0.3,(tW-distW-bplW)/Math.max(critTags.length,1));
    const critFS=ncw>0.65?8:ncw>0.45?7:6.5;
    // Encabezado tabla
    s.addShape(pptx.shapes.RECTANGLE,{x:tx,y:tableY,w:distW,h:rh,fill:{color:C.mid},line:{color:C.mid}});
    s.addText("Distribuidor",{x:tx+0.05,y:tableY,w:distW-0.1,h:rh,fontSize:8,bold:true,color:C.white,valign:"middle"});
    critTags.forEach((tag,ci)=>{
      const cx=tx+distW+ci*ncw;
      s.addShape(pptx.shapes.RECTANGLE,{x:cx,y:tableY,w:ncw,h:rh,fill:{color:C.mid},line:{color:C.mid}});
      s.addText(tag.replace("CRITICO ","C"),{x:cx,y:tableY,w:ncw,h:rh,fontSize:critFS,bold:true,color:C.white,align:"center",valign:"middle"});
    });
    const bplX=tx+distW+critTags.length*ncw;
    s.addShape(pptx.shapes.RECTANGLE,{x:bplX,y:tableY,w:bplW,h:rh,fill:{color:C.accent},line:{color:C.accent}});
    s.addText("TOTAL",{x:bplX,y:tableY,w:bplW,h:rh,fontSize:7.5,bold:true,color:C.white,align:"center",valign:"middle"});
    // Filas de datos — todos los distribuidores de esta página
    pageDistrs.forEach((a,ri)=>{
      const ry=tableY+(ri+1)*rh;
      const bg=ri%2===0?C.white:C.g50;
      s.addShape(pptx.shapes.RECTANGLE,{x:tx,y:ry,w:distW,h:rh,fill:{color:bg},line:{color:C.g200}});
      s.addText(a.distribuidor.substring(0,40),{x:tx+0.05,y:ry,w:distW-0.1,h:rh,fontSize:6.5,color:C.g700,valign:"middle"});
      critTags.forEach((tag,ci)=>{
        const met=(a.scores.critStatus||{})[tag]==='met';
        const cx=tx+distW+ci*ncw;
        s.addShape(pptx.shapes.RECTANGLE,{x:cx,y:ry,w:ncw,h:rh,fill:{color:met?"E8F5E9":"FFEBEE"},line:{color:C.g200}});
        s.addText(met?"✓":"✗",{x:cx,y:ry,w:ncw,h:rh,fontSize:critFS,bold:true,color:met?C.proact:C.inactivo,align:"center",valign:"middle"});
      });
      const cm=a.scores.critMet;
      const tc2=cm>=totalCrits?C.proact:cm>=totalCrits*0.7?C.activo:C.reactivo;
      s.addShape(pptx.shapes.RECTANGLE,{x:bplX,y:ry,w:bplW,h:rh,fill:{color:tc2},line:{color:tc2}});
      s.addText(`${cm}/${totalCrits}`,{x:bplX,y:ry,w:bplW,h:rh,fontSize:7.5,bold:true,color:C.white,align:"center",valign:"middle"});
    });
  }}

  // ── SLIDE 6: TOP PREGUNTAS CON MÁS INCUMPLIMIENTO
  {const s=pptx.addSlide();s.background={color:C.white};addHeader(s,"Preguntas con Mayor Incumplimiento","Top 15 componentes con más respuestas NO en la red");
  s.addChart(pptx.charts.BAR,[{name:"%NO",labels:top15.map(q=>q.comp),values:top15.map(q=>Math.round(q.pct*100))}],{
    x:0.25,y:0.68,w:5.6,h:6.57,barDir:"bar",
    chartColors:top15.map(q=>q.pct>=0.8?C.inactivo:q.pct>=0.6?C.reactivo:C.accent),
    chartArea:{fill:{color:C.white}},plotArea:{fill:{color:C.white}},
    showValue:true,dataLabelPosition:"outEnd",dataLabelColor:C.g700,dataLabelFontSize:9,dataLabelFontBold:true,
    catAxisLabelColor:C.g700,catAxisLabelFontSize:9,catAxisLabelFontBold:true,
    valAxisMinVal:0,valAxisMaxVal:100,
    valGridLine:{color:C.g100},catGridLine:{style:"none"},showLegend:false,
    title:"% Respuestas NO",showTitle:true,titleColor:C.g700,titleFontSize:10,titleFontBold:true,
  });
  // Panel tabla derecha
  s.addShape(pptx.shapes.RECTANGLE,{x:6.1,y:0.68,w:6.95,h:6.57,fill:{color:C.white},line:{color:C.g200}});
  s.addShape(pptx.shapes.RECTANGLE,{x:6.1,y:0.68,w:6.95,h:0.38,fill:{color:C.mid},line:{color:C.mid}});
  s.addText("Detalle de Componentes con Mayor Incumplimiento",{x:6.2,y:0.68,w:6.75,h:0.38,fontSize:9,bold:true,color:C.white,valign:"middle"});
  s.addShape(pptx.shapes.RECTANGLE,{x:6.1,y:1.08,w:6.95,h:0.28,fill:{color:C.g100},line:{color:C.g200}});
  const qHdrs=["#","Comp.","Descripción del componente","%NO"];
  const qHx=[6.15,6.42,6.88,12.42];const qHw=[0.24,0.43,5.5,0.56];
  qHdrs.forEach((h,ci)=>s.addText(h,{x:qHx[ci],y:1.08,w:qHw[ci],h:0.28,fontSize:7.5,bold:true,color:C.g700,valign:"middle",align:ci===3?"center":"left"}));
  top15.forEach((q,ri)=>{
    const ry=1.38+ri*0.385;const bg=ri%2===0?C.white:C.g50;
    const pct=Math.round(q.pct*100);const pc=pct>=80?C.inactivo:pct>=60?C.reactivo:C.accent;
    const qObj=Q.find(qi=>qi.comp_num===q.comp);
    const desc=(qObj?.question||q.comp).substring(0,70);
    const areaCode=qObj?.sheet||'';
    s.addShape(pptx.shapes.RECTANGLE,{x:6.1,y:ry,w:6.95,h:0.37,fill:{color:bg},line:{color:C.g100}});
    s.addText(String(ri+1),{x:qHx[0],y:ry,w:qHw[0],h:0.37,fontSize:7.5,color:C.g500,valign:"middle",align:"center"});
    s.addText(q.comp,{x:qHx[1],y:ry,w:qHw[1],h:0.37,fontSize:7.5,bold:true,color:C.dark,valign:"middle"});
    s.addText(desc,{x:qHx[2],y:ry,w:qHw[2],h:0.37,fontSize:7.5,color:C.g700,valign:"middle"});
    s.addShape(pptx.shapes.RECTANGLE,{x:12.38,y:ry+0.06,w:0.6,h:0.24,fill:{color:pc},line:{color:pc}});
    s.addText(`${pct}%`,{x:12.38,y:ry+0.06,w:0.6,h:0.24,fontSize:8.5,bold:true,color:C.white,align:"center",valign:"middle"});
  });}

  // ── SLIDE 7: BRECHA VS PROMEDIO
  {const s=pptx.addSlide();s.background={color:C.white};addHeader(s,"Brecha vs Promedio RED",`Posición de cada distribuidor respecto al promedio general (${(avg*100).toFixed(1)}%)`);
  const gapS=[...sortedA].map(a=>({name:a.distribuidor.substring(0,28),gap:(a.scores.total-avg)*100,cat:recomputeCategory(a)})).sort((a,b)=>b.gap-a.gap);
  s.addChart(pptx.charts.BAR,[{name:"pp",labels:gapS.map(g=>g.name),values:gapS.map(g=>Math.round(g.gap*10)/10)}],{
    x:0.25,y:0.68,w:9.5,h:6.57,barDir:"bar",
    chartColors:gapS.map(g=>g.gap>=5?C.proact:g.gap>=0?C.activo:g.gap>=-5?C.reactivo:C.inactivo),
    chartArea:{fill:{color:C.white}},plotArea:{fill:{color:C.white}},
    showValue:true,dataLabelPosition:"outEnd",dataLabelColor:C.g700,dataLabelFontSize:8,dataLabelFontBold:true,
    catAxisLabelColor:C.g700,catAxisLabelFontSize:7.5,
    valGridLine:{color:C.g100},catGridLine:{style:"none"},showLegend:false,
    title:`Diferencia en puntos porcentuales respecto al promedio RED (${(avg*100).toFixed(1)}%)`,
    showTitle:true,titleColor:C.g700,titleFontSize:10,titleFontBold:true,
  });
  // Panel interpretación
  const liteBg={[C.proact]:"E8F5E9",[C.activo]:"E0F2F1",[C.reactivo]:"FFF3E0",[C.inactivo]:"FFEBEE"};
  s.addShape(pptx.shapes.RECTANGLE,{x:10.05,y:0.68,w:3.0,h:6.57,fill:{color:C.g50},line:{color:C.g200}});
  s.addShape(pptx.shapes.RECTANGLE,{x:10.05,y:0.68,w:3.0,h:0.36,fill:{color:C.mid},line:{color:C.mid}});
  s.addText("Interpretación",{x:10.15,y:0.68,w:2.8,h:0.36,fontSize:9.5,bold:true,color:C.white,valign:"middle"});
  const interp=[{c:C.proact,l:"≥+5 pp",d:"Claramente por encima del promedio"},{c:C.activo,l:"0 a +5 pp",d:"Sobre el promedio de la red"},{c:C.reactivo,l:"-5 a 0 pp",d:"Por debajo del promedio"},{c:C.inactivo,l:"< -5 pp",d:"Significativamente bajo"}];
  interp.forEach((it,i)=>{
    const iy=1.12+i*0.78;
    s.addShape(pptx.shapes.RECTANGLE,{x:10.15,y:iy,w:2.75,h:0.65,fill:{color:liteBg[it.c]||C.g50},line:{color:it.c,width:0.75}});
    s.addShape(pptx.shapes.RECTANGLE,{x:10.15,y:iy,w:0.07,h:0.65,fill:{color:it.c},line:{color:it.c}});
    s.addText(it.l,{x:10.28,y:iy+0.05,w:2.55,h:0.28,fontSize:11,bold:true,color:it.c,fontFace:"Calibri"});
    s.addText(it.d,{x:10.28,y:iy+0.33,w:2.55,h:0.28,fontSize:8.5,color:C.g700,fontFace:"Calibri"});
  });
  // Resumen numérico
  const above=gapS.filter(g=>g.gap>0).length;const below=gapS.length-above;
  s.addShape(pptx.shapes.RECTANGLE,{x:10.15,y:4.25,w:2.75,h:1.3,fill:{color:C.white},line:{color:C.g200}});
  s.addShape(pptx.shapes.RECTANGLE,{x:10.15,y:4.25,w:2.75,h:0.05,fill:{color:C.mid},line:{color:C.mid}});
  s.addText(`${above} sobre promedio`,{x:10.2,y:4.35,w:2.65,h:0.44,fontSize:13,bold:true,color:C.proact,fontFace:"Calibri"});
  s.addText(`${below} bajo promedio`,{x:10.2,y:4.82,w:2.65,h:0.44,fontSize:13,bold:true,color:C.reactivo,fontFace:"Calibri"});}

  // ── SLIDE 8: MEJORES Y OPORTUNIDADES
  {const s=pptx.addSlide();s.background={color:C.white};addHeader(s,"Mejores Resultados y Oportunidades de Mejora","Top 5 mejor posicionados · Top 5 con mayor potencial de mejora");
  // Panel izquierdo — Top 5
  s.addShape(pptx.shapes.RECTANGLE,{x:0.25,y:0.68,w:6.3,h:6.57,fill:{color:C.white},line:{color:C.g200}});
  s.addShape(pptx.shapes.RECTANGLE,{x:0.25,y:0.68,w:6.3,h:0.38,fill:{color:C.proact},line:{color:C.proact}});
  s.addText("TOP 5 · Mejores Puntajes de la Red",{x:0.38,y:0.68,w:6.1,h:0.38,fontSize:10,bold:true,color:C.white,valign:"middle"});
  sortedA.slice(0,5).forEach((a,i)=>{
    const ry=1.1+i*1.03;const pc=Math.round(a.scores.total*100);
    const catC=CAT_C[recomputeCategory(a)]||C.g500;
    s.addShape(pptx.shapes.RECTANGLE,{x:0.3,y:ry,w:6.2,h:0.95,fill:{color:i===0?"F0FFF4":C.white},line:{color:C.g200}});
    s.addShape(pptx.shapes.RECTANGLE,{x:0.3,y:ry,w:0.06,h:0.95,fill:{color:catC},line:{color:catC}});
    s.addShape(pptx.shapes.OVAL,{x:0.42,y:ry+0.22,w:0.44,h:0.44,fill:{color:catC},line:{color:catC}});
    s.addText(`${i+1}`,{x:0.42,y:ry+0.22,w:0.44,h:0.44,fontSize:12,bold:true,color:C.white,align:"center",valign:"middle"});
    s.addText(a.distribuidor.substring(0,42),{x:0.94,y:ry+0.04,w:3.5,h:0.32,fontSize:9,bold:true,color:C.dark,fontFace:"Calibri"});
    s.addShape(pptx.shapes.RECTANGLE,{x:0.94,y:ry+0.45,w:3.2,h:0.2,fill:{color:C.g100},line:{color:C.g200}});
    s.addShape(pptx.shapes.RECTANGLE,{x:0.94,y:ry+0.45,w:Math.max(0.04,3.2*a.scores.total),h:0.2,fill:{color:catC},line:{color:catC}});
    s.addText(`${pc}%`,{x:4.18,y:ry+0.43,w:0.55,h:0.26,fontSize:9,bold:true,color:catC});
    s.addText(`${a.scores.critMet}/${totalCrits} crít.`,{x:4.75,y:ry+0.43,w:1.4,h:0.26,fontSize:8,color:C.g500});
    s.addShape(pptx.shapes.RECTANGLE,{x:4.18,y:ry+0.06,w:1.98,h:0.26,fill:{color:catC},line:{color:catC}});
    s.addText(recomputeCategory(a),{x:4.18,y:ry+0.06,w:1.98,h:0.26,fontSize:7.5,bold:true,color:C.white,align:"center",valign:"middle"});
  });
  // Panel derecho — Bottom 5
  const worst=[...sortedA].reverse().slice(0,5);
  s.addShape(pptx.shapes.RECTANGLE,{x:6.8,y:0.68,w:6.25,h:6.57,fill:{color:C.white},line:{color:C.g200}});
  s.addShape(pptx.shapes.RECTANGLE,{x:6.8,y:0.68,w:6.25,h:0.38,fill:{color:C.reactivo},line:{color:C.reactivo}});
  s.addText("TOP 5 · Principales Oportunidades de Mejora",{x:6.92,y:0.68,w:6.05,h:0.38,fontSize:10,bold:true,color:C.white,valign:"middle"});
  worst.forEach((a,i)=>{
    const ry=1.1+i*1.03;const pc=Math.round(a.scores.total*100);
    const catC=CAT_C[recomputeCategory(a)]||C.g500;
    s.addShape(pptx.shapes.RECTANGLE,{x:6.85,y:ry,w:6.15,h:0.95,fill:{color:C.white},line:{color:C.g200}});
    s.addShape(pptx.shapes.RECTANGLE,{x:6.85,y:ry,w:0.06,h:0.95,fill:{color:catC},line:{color:catC}});
    s.addShape(pptx.shapes.OVAL,{x:6.97,y:ry+0.22,w:0.44,h:0.44,fill:{color:catC},line:{color:catC}});
    s.addText(`${worst.length-i}°`,{x:6.97,y:ry+0.22,w:0.44,h:0.44,fontSize:10,bold:true,color:C.white,align:"center",valign:"middle"});
    s.addText(a.distribuidor.substring(0,40),{x:7.5,y:ry+0.04,w:3.5,h:0.32,fontSize:9,bold:true,color:C.dark,fontFace:"Calibri"});
    s.addShape(pptx.shapes.RECTANGLE,{x:7.5,y:ry+0.45,w:3.0,h:0.2,fill:{color:C.g100},line:{color:C.g200}});
    s.addShape(pptx.shapes.RECTANGLE,{x:7.5,y:ry+0.45,w:Math.max(0.04,3.0*a.scores.total),h:0.2,fill:{color:catC},line:{color:catC}});
    s.addText(`${pc}%`,{x:10.55,y:ry+0.43,w:0.6,h:0.26,fontSize:9,bold:true,color:catC});
    s.addText(`${a.scores.critMet}/${totalCrits} crít.`,{x:11.18,y:ry+0.43,w:1.55,h:0.26,fontSize:8,color:C.g500});
    s.addShape(pptx.shapes.RECTANGLE,{x:10.55,y:ry+0.06,w:2.12,h:0.26,fill:{color:catC},line:{color:catC}});
    s.addText(recomputeCategory(a),{x:10.55,y:ry+0.06,w:2.12,h:0.26,fontSize:7.5,bold:true,color:C.white,align:"center",valign:"middle"});
  });}

  // ── SLIDE 9: CIERRE
  {const s=pptx.addSlide();s.background={color:C.white};
  // Panel derecho navy (espejo de la portada)
  s.addShape(pptx.shapes.RECTANGLE,{x:W-4.65,y:0,w:4.65,h:H,fill:{color:C.dark},line:{color:C.dark}});
  s.addShape(pptx.shapes.RECTANGLE,{x:W-4.65,y:H-0.06,w:4.65,h:0.06,fill:{color:C.accent},line:{color:C.accent}});
  s.addShape(pptx.shapes.RECTANGLE,{x:W-4.7,y:0,w:0.05,h:H,fill:{color:C.accent},line:{color:C.accent}});
  // Panel izquierdo: texto
  s.addText("Muchas",{x:0.5,y:1.4,w:8.0,h:0.9,fontSize:46,bold:true,color:C.mid,fontFace:"Calibri"});
  s.addText("gracias",{x:0.5,y:2.28,w:8.0,h:0.9,fontSize:46,bold:true,color:C.mid,fontFace:"Calibri"});
  s.addShape(pptx.shapes.LINE,{x:0.5,y:3.28,w:8.0,h:0,line:{color:C.accent,width:1.5}});
  s.addText(`RED Activa 2.0 · ${PAIS} ${ANIO}`,{x:0.5,y:3.42,w:8.0,h:0.5,fontSize:18,color:C.g700,fontFace:"Calibri"});
  s.addText("BAP Partners Consultoría Empresarial",{x:0.5,y:3.98,w:8.0,h:0.4,fontSize:13,color:C.g500,fontFace:"Calibri"});
  if(logos.bap) s.addImage({data:`image/png;base64,${logos.bap}`,x:0.5,y:4.72,w:3.5,h:1.28});
  // Panel derecho: logos
  if(logos.arcor) s.addImage({data:`image/png;base64,${logos.arcor}`,x:W-4.2,y:0.9,w:3.8,h:2.5});
  if(logos.ra) s.addImage({data:`image/png;base64,${logos.ra}`,x:W-4.3,y:4.4,w:3.9,h:1.8});}

  // Save — Electron uses native dialog, browser uses download
  const fileName=`RedActiva_${PAIS}_${ANIO}_Informe.pptx`;
  try{
    if(window.electronAPI&&window.electronAPI.savePptx){
      const ab=await pptx.write({outputType:'arraybuffer'});
      const u8=Array.from(new Uint8Array(ab));
      const res=await window.electronAPI.savePptxDirect(u8,fileName);
      if(res&&res.success) showToast('✅ Informe guardado: '+res.filePath.split('\\').pop());
      else showToast('⚠️ Guardado cancelado');
    }else{
      const ab2=await pptx.write({outputType:'arraybuffer'});
      const blob=new Blob([ab2],{type:'application/vnd.openxmlformats-officedocument.presentationml.presentation'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url; a.download=fileName;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      showToast('✅ Descargando: '+fileName);
    }
  }catch(e){
    console.error('PPTX error:',e);
    showToast('❌ Error PPTX: '+(e.message||String(e)));
    alert('Error generando PPTX:\n\n'+e.message+'\n\nStack: '+e.stack?.substring(0,200));
  }
}

// Scroll to first unanswered question in the form
function scrollToUnanswered(){
  goTab('form');
  setTimeout(()=>{
    // Find first q-row without answered state
    const allRows = document.querySelectorAll('.q-row');
    for(const row of allRows){
      const k = row.id.replace('qr-','');
      const comp = k.replace(/_/g,'.');
      if(!ans[comp]){
        row.scrollIntoView({behavior:'smooth', block:'center'});
        row.style.transition='background 0.3s';
        row.style.background='#fff8e1';
        setTimeout(()=>row.style.background='', 1500);
        return;
      }
    }
  }, 300);
}

// ── PER-DISTRIBUTOR PPTX REPORT ──────────────────────────
async function generateDistPPTX(){
  if(typeof PptxGenJS==='undefined'){ showToast('❌ PptxGenJS no cargó. Recompilá la app.'); return; }
  // Get current loaded audit
  const curAudit = _loadedFrozenAudit || (()=>{
    const dist = document.getElementById('sel-dist')?.value;
    const ed   = document.getElementById('sel-edicion')?.value;
    if(!dist||!ed) return null;
    return saved.find(a=>a.distribuidor===dist&&a.edicion===ed);
  })();

  if(!curAudit){ showToast('⚠️ Cargá una auditoría primero'); return; }

  showToast('⏳ Generando informe de '+curAudit.distribuidor+'...');

  const PAIS  = cfg.pais||'';
  const ANIO  = cfg.anio||'';
  const W=13.3,H=7.5;

  const C={dark:"1E3357",mid:"2F5496",light:"4472C4",
    accent:"0070C0",accentSoft:"B3C6E7",
    white:"FFFFFF",offwhite:"F0F4FA",
    g50:"F8FAFC",g100:"E8EDF5",g200:"C5D3E8",g300:"8DA9DB",g500:"5B7DB5",g700:"2C3E6B",
    proact:"00B050",activo:"0D9488",reactivo:"ED7D31",inactivo:"C62828"};
  const AREA_C=Object.fromEntries(SHEETS().map(sh=>[sh,(AC[sh]||'#607d8b').replace('#','')]));
  const CAT_C={PROACTIVO:C.proact,ACTIVO:C.activo,REACTIVO:C.reactivo,INACTIVO:C.inactivo};

  const sc   = curAudit.scores||{};
  const cat  = recomputeCategory(curAudit);
  const tc   = auditTotalCrits(curAudit);
  const pct  = ((sc.total||0)*100).toFixed(1)+'%';
  const catC = CAT_C[cat]||C.mid;
  const AREAS= SHEETS();
  const aw   = curAudit.weights?.aw||AW;

  // Get logos
  const logos={};
  for(const[k,id] of [['bap','logo_bap'],['arcor','logo_arcor'],['ra','logo_ra']]){
    const el=document.getElementById(id);
    if(el?.src) logos[k]=el.src.split(',')[1]||'';
  }

  // Historical audits for same distribuidor
  const histAudits = saved
    .filter(a=>a.distribuidor===curAudit.distribuidor && a.edicion!==curAudit.edicion)
    .sort((a,b)=>(b.edicion||'').localeCompare(a.edicion||''));

  const pptx = new PptxGenJS();
  pptx.layout="LAYOUT_WIDE";
  pptx.title=`${curAudit.distribuidor} · RED Activa ${curAudit.edicion}`;

  const mkSh=()=>({type:"outer",blur:6,offset:2,angle:135,color:"000000",opacity:0.08});

  const addHeader=(s,title,sub="")=>{
    s.addShape(pptx.shapes.RECTANGLE,{x:0,y:0,w:W,h:0.55,fill:{color:C.mid},line:{color:C.mid}});
    s.addShape(pptx.shapes.RECTANGLE,{x:0,y:0.55,w:W,h:0.04,fill:{color:catC},line:{color:catC}});
    s.addText(title,{x:0.28,y:0,w:9.5,h:0.55,fontSize:16,bold:true,color:C.white,valign:"middle",fontFace:"Calibri"});
    if(sub) s.addText(sub,{x:0.28,y:0.19,w:9.5,h:0.34,fontSize:8.5,color:C.accentSoft,valign:"middle",fontFace:"Calibri"});
    if(logos.bap) s.addImage({data:`image/png;base64,${logos.bap}`,x:W-2.2,y:0.04,w:2.05,h:0.47});
    s.addShape(pptx.shapes.RECTANGLE,{x:0,y:H-0.22,w:W,h:0.22,fill:{color:C.g100},line:{color:C.g200}});
    s.addText(`${curAudit.distribuidor} · Edición ${curAudit.edicion} · RED Activa 2.0`,{x:0.2,y:H-0.22,w:9,h:0.22,fontSize:7,color:C.g500,valign:"middle"});
    s.addText("BAP Partners Consultoría Empresarial",{x:W-3.6,y:H-0.22,w:3.4,h:0.22,fontSize:7,color:C.g500,align:"right",valign:"middle"});
  };

  // ── SLIDE 1: PORTADA ──────────────────────────────────────────
  {
    const s=pptx.addSlide();s.background={color:C.offwhite};
    // Banda superior oscura (60% del alto)
    s.addShape(pptx.shapes.RECTANGLE,{x:0,y:0,w:W,h:3.15,fill:{color:C.dark},line:{color:C.dark}});
    // Franja accent en tope y separador inferior
    s.addShape(pptx.shapes.RECTANGLE,{x:0,y:0,w:W,h:0.06,fill:{color:catC},line:{color:catC}});
    s.addShape(pptx.shapes.RECTANGLE,{x:0,y:3.15,w:W,h:0.05,fill:{color:catC},line:{color:catC}});

    // TOP: Logos
    if(logos.ra) s.addImage({data:`image/png;base64,${logos.ra}`,x:0.45,y:0.15,w:3.8,h:0.88});
    if(logos.arcor) s.addImage({data:`image/png;base64,${logos.arcor}`,x:W-4.1,y:0.25,w:3.75,h:2.45});

    // TOP: Texto
    s.addText("Informe de Auditoría BPL",{x:0.45,y:1.14,w:8.5,h:0.38,fontSize:14,color:C.accentSoft,fontFace:"Calibri"});
    s.addText(curAudit.distribuidor,{x:0.45,y:1.52,w:8.4,h:1.45,fontSize:26,bold:true,color:C.white,fontFace:"Calibri",wrap:true,valign:"top"});

    // BOTTOM: Badge de categoría grande
    s.addShape(pptx.shapes.RECTANGLE,{x:0.45,y:3.35,w:5.6,h:1.7,fill:{color:catC},line:{color:catC}});
    s.addText("CATEGORÍA FINAL",{x:0.62,y:3.42,w:5.3,h:0.3,fontSize:9,bold:true,color:C.white,fontFace:"Calibri"});
    s.addText(cat,{x:0.62,y:3.7,w:5.3,h:0.72,fontSize:30,bold:true,color:C.white,fontFace:"Calibri"});
    s.addText(pct,{x:0.62,y:4.38,w:5.3,h:0.5,fontSize:24,bold:false,color:C.white,fontFace:"Calibri"});

    // BOTTOM: 3 KPIs a la derecha
    const kpisDist=[
      {v:`${sc.critMet||0}/${tc}`,l:"BPL Críticos",c:catC},
      {v:`${sc.answered||0}/${Q.length}`,l:"Respondidas",c:C.mid},
      {v:`Ed. ${curAudit.edicion}`,l:PAIS||"RED",c:C.mid},
    ];
    kpisDist.forEach((k,i)=>{
      const kx=6.35+i*2.28;
      s.addShape(pptx.shapes.RECTANGLE,{x:kx,y:3.35,w:2.12,h:1.7,fill:{color:C.white},line:{color:C.g200}});
      s.addShape(pptx.shapes.RECTANGLE,{x:kx,y:3.35,w:2.12,h:0.05,fill:{color:k.c},line:{color:k.c}});
      s.addText(k.v,{x:kx+0.12,y:3.44,w:1.88,h:0.75,fontSize:22,bold:true,color:k.c,fontFace:"Calibri",valign:"middle"});
      s.addText(k.l,{x:kx+0.12,y:4.22,w:1.88,h:0.62,fontSize:9,color:C.g500,fontFace:"Calibri"});
    });

    // BOTTOM: Logo BAP + info
    if(logos.bap) s.addImage({data:`image/png;base64,${logos.bap}`,x:0.45,y:5.28,w:2.8,h:1.0});
    s.addText(`Fecha: ${curAudit.fecha||'—'}`,{x:3.5,y:5.38,w:9.4,h:0.35,fontSize:11,color:C.g700,fontFace:"Calibri"});
    s.addText(`Auditor: ${curAudit.auditor||'—'}`,{x:3.5,y:5.78,w:9.4,h:0.35,fontSize:11,color:C.g500,fontFace:"Calibri"});
  }

  // ── SLIDE 2: RESUMEN RESULTADOS ───────────────────────────────
  {
    const s=pptx.addSlide();
    s.background={color:C.offwhite};
    addHeader(s,"Resumen de Resultados",`${curAudit.distribuidor} · Edición ${curAudit.edicion}`);

    // Category banner
    s.addShape(pptx.shapes.RECTANGLE,{x:0.3,y:0.7,w:12.7,h:1.2,fill:{color:catC},line:{color:catC},shadow:mkSh()});
    s.addText("CATEGORÍA FINAL · RED ACTIVA 2.0",{x:0.6,y:0.76,w:8,h:0.28,fontSize:9,bold:true,color:"rgba(255,255,255,0.7)",fontFace:"Calibri"});
    s.addText(cat,{x:0.6,y:1.0,w:8,h:0.8,fontSize:36,bold:true,color:C.white,fontFace:"Calibri"});
    s.addText("PUNTAJE PONDERADO",{x:9.5,y:0.76,w:3.3,h:0.28,fontSize:9,bold:true,color:"rgba(255,255,255,0.7)",align:"right",fontFace:"Calibri"});
    s.addText(pct,{x:9.5,y:1.0,w:3.3,h:0.8,fontSize:36,bold:true,color:C.white,align:"right",fontFace:"Calibri"});

    // 4 KPIs
    const kpis2=[
      {v:`${sc.answered||0}/${Q.length}`,l:"RESPONDIDAS",s:"preguntas",c:C.accent},
      {v:`${sc.critMet||0}/${tc}`,l:"BPL CRÍTICOS",s:"condicionales",c:(sc.critMet||0)>=tc?C.proact:C.reactivo},
      {v:String(sc.naCount||0),l:"N/A",s:"excluidas",c:C.g500},
      {v:String(Object.keys(sc.critStatus||{}).filter(k=>(sc.critStatus||{})[k]==='unmet').length),l:"CRÍTICOS FALLIDOS",s:"condicionales",c:(sc.critMet||0)<tc?C.inactivo:C.g500},
    ];
    kpis2.forEach((k,i)=>{
      const x=0.3+i*3.2;
      s.addShape(pptx.shapes.RECTANGLE,{x,y:2.05,w:3.0,h:1.1,fill:{color:C.white},line:{color:C.g200},shadow:mkSh()});
      s.addShape(pptx.shapes.RECTANGLE,{x,y:2.05,w:0.07,h:1.1,fill:{color:k.c},line:{color:k.c}});
      s.addText(k.v,{x:x+0.18,y:2.1,w:2.7,h:0.55,fontSize:26,bold:true,color:k.c,valign:"middle",fontFace:"Calibri"});
      s.addText(k.l,{x:x+0.18,y:2.64,w:2.7,h:0.28,fontSize:8,bold:true,color:C.g700,fontFace:"Calibri"});
      s.addText(k.s,{x:x+0.18,y:2.88,w:2.7,h:0.22,fontSize:7.5,color:C.g500,fontFace:"Calibri"});
    });

    // Area bars
    s.addShape(pptx.shapes.RECTANGLE,{x:0.3,y:3.3,w:8.5,h:3.9,fill:{color:C.white},line:{color:C.g200},shadow:mkSh()});
    s.addText("Puntaje por Área de Interés",{x:0.5,y:3.38,w:8.0,h:0.32,fontSize:11,bold:true,color:C.dark,fontFace:"Calibri"});
    AREAS.forEach((area,i)=>{
      const v=(sc.areas||{})[area]||0;
      const pctV=(v*100).toFixed(1);
      const col=AREA_C[area];
      const barW=Math.max(0.1,v*7.2);
      const ry=3.82+i*0.75;
      s.addText(`${area} · ${AN[area]||area}`,{x:0.5,y:ry,w:2.4,h:0.3,fontSize:10,bold:true,color:col,valign:"middle",fontFace:"Calibri"});
      s.addText(`Peso: ${Math.round((aw[area]||0)*100)}%`,{x:2.9,y:ry,w:1.0,h:0.3,fontSize:8,color:C.g500,valign:"middle",fontFace:"Calibri"});
      s.addShape(pptx.shapes.RECTANGLE,{x:3.9,y:ry+0.04,w:4.2,h:0.22,fill:{color:C.g100},line:{color:C.g200}});
      s.addShape(pptx.shapes.RECTANGLE,{x:3.9,y:ry+0.04,w:barW,h:0.22,fill:{color:col},line:{color:col}});
      s.addText(pctV+'%',{x:8.15,y:ry,w:0.6,h:0.3,fontSize:10,bold:true,color:col,valign:"middle",fontFace:"Calibri"});
    });
    // Total bar
    const ry2=6.07;
    s.addText("TOTAL",{x:0.5,y:ry2,w:2.4,h:0.3,fontSize:10,bold:true,color:C.dark,valign:"middle",fontFace:"Calibri"});
    s.addShape(pptx.shapes.RECTANGLE,{x:3.9,y:ry2+0.04,w:4.2,h:0.22,fill:{color:C.g100},line:{color:C.g200}});
    s.addShape(pptx.shapes.RECTANGLE,{x:3.9,y:ry2+0.04,w:Math.max(0.1,(sc.total||0)*4.2),h:0.22,fill:{color:catC},line:{color:catC}});
    s.addText(pct,{x:8.15,y:ry2,w:0.6,h:0.3,fontSize:10,bold:true,color:catC,valign:"middle",fontFace:"Calibri"});

    // Matrix right panel
    s.addShape(pptx.shapes.RECTANGLE,{x:9.1,y:3.3,w:4.0,h:3.9,fill:{color:C.white},line:{color:C.g200},shadow:mkSh()});
    s.addText("Matriz BPL Críticos",{x:9.3,y:3.38,w:3.6,h:0.32,fontSize:11,bold:true,color:C.dark,fontFace:"Calibri"});
    const mx = (curAudit.weights?.matrixCfg)||MATRIX_CFG;
    const sRow=(sc.total||0)*100>=THR.pro?0:(sc.total||0)*100>=THR.act?1:(sc.total||0)*100>=50?2:3;
    let bCol=mx.bands.length-1;
    if((sc.critMet||0)<tc){for(let i=0;i<mx.bands.length-1;i++){if(mx.bands[i].max!==null&&(sc.critMet||0)<=mx.bands[i].max){bCol=i;break;}}}
    const catRows=["PROACTIVO","ACTIVO","REACTIVO","INACTIVO"];
    const catColors=[C.proact,C.activo,C.reactivo,C.inactivo];
    const codMap={PR:C.proact,AC:C.activo,RE:C.reactivo,IN:C.inactivo};
    const codeLabel={PR:"PRO",AC:"ACT",RE:"REA",IN:"INA"};
    // Band headers
    s.addShape(pptx.shapes.RECTANGLE,{x:9.1,y:3.76,w:1.2,h:0.3,fill:{color:C.mid},line:{color:C.mid}});
    mx.bands.forEach((b,bi)=>{
      const bx=10.3+bi*0.7;
      const isActive=bi===bCol;
      s.addShape(pptx.shapes.RECTANGLE,{x:bx,y:3.76,w:0.68,h:0.3,fill:{color:isActive?C.accent:C.mid},line:{color:isActive?C.accent:C.mid}});
      s.addText(b.label,{x:bx,y:3.76,w:0.68,h:0.3,fontSize:7,bold:true,color:C.white,align:"center",valign:"middle"});
    });
    catRows.forEach((cr,ri)=>{
      const ry3=4.1+ri*0.72;
      const isActiveRow=ri===sRow;
      s.addShape(pptx.shapes.RECTANGLE,{x:9.1,y:ry3,w:1.2,h:0.65,fill:{color:isActiveRow?catColors[ri]+"22":C.g50},line:{color:C.g200}});
      s.addText(cr,{x:9.12,y:ry3,w:1.16,h:0.32,fontSize:8,bold:true,color:catColors[ri],valign:"middle",fontFace:"Calibri"});
      s.addText(ri===0?`≥${THR.pro}%`:ri===1?`≥${THR.act}%`:ri===2?"≥50%":"<50%",{x:9.12,y:ry3+0.32,w:1.16,h:0.28,fontSize:7,color:C.g500,valign:"middle",fontFace:"Calibri"});
      mx.bands.forEach((b,bi)=>{
        const bx=10.3+bi*0.7;
        const code=(mx.cells[ri]||[])[bi]||'IN';
        const bg=codMap[code]||C.inactivo;
        const isActive=ri===sRow&&bi===bCol;
        s.addShape(pptx.shapes.RECTANGLE,{x:bx,y:ry3,w:0.68,h:0.65,fill:{color:isActive?bg:bg+"22"},line:{color:isActive?bg:C.g200,width:isActive?1.5:0.5}});
        s.addText(codeLabel[code]||code,{x:bx,y:ry3,w:0.68,h:0.65,fontSize:7.5,bold:isActive,color:isActive?C.white:bg,align:"center",valign:"middle"});
      });
    });
    s.addText(`Crit: ${sc.critMet||0}/${tc} · Score: ${pct}`,{x:9.1,y:7.22,w:4.0,h:0.2,fontSize:8,color:C.g500,align:"center"});
  }

  // ── SLIDE 3: DETALLE DE CRÍTICOS ─────────────────────────────
  {
    const s=pptx.addSlide();
    s.background={color:C.offwhite};
    addHeader(s,"Análisis de Condicionales Críticos",`${curAudit.distribuidor} · Edición ${curAudit.edicion}`);
    const critStatus=sc.critStatus||{};
    const critTags=Object.keys(critStatus).sort((a,b)=>parseInt(a.split(" ")[1])-parseInt(b.split(" ")[1]));
    const met=critTags.filter(t=>critStatus[t]==='met');
    const unmet=critTags.filter(t=>critStatus[t]==='unmet');

    // Summary
    s.addShape(pptx.shapes.RECTANGLE,{x:0.3,y:0.7,w:3.8,h:1.2,fill:{color:C.proact},line:{color:C.proact},shadow:mkSh()});
    s.addText(String(met.length),{x:0.4,y:0.75,w:3.6,h:0.65,fontSize:36,bold:true,color:C.white,fontFace:"Calibri"});
    s.addText("CRÍTICOS CUMPLIDOS",{x:0.4,y:1.38,w:3.6,h:0.28,fontSize:9,bold:true,color:"rgba(255,255,255,0.8)",fontFace:"Calibri"});
    s.addShape(pptx.shapes.RECTANGLE,{x:4.4,y:0.7,w:3.8,h:1.2,fill:{color:C.inactivo},line:{color:C.inactivo},shadow:mkSh()});
    s.addText(String(unmet.length),{x:4.5,y:0.75,w:3.6,h:0.65,fontSize:36,bold:true,color:C.white,fontFace:"Calibri"});
    s.addText("CRÍTICOS NO CUMPLIDOS",{x:4.5,y:1.38,w:3.6,h:0.28,fontSize:9,bold:true,color:"rgba(255,255,255,0.8)",fontFace:"Calibri"});
    s.addShape(pptx.shapes.RECTANGLE,{x:8.5,y:0.7,w:4.5,h:1.2,fill:{color:C.mid},line:{color:C.mid},shadow:mkSh()});
    s.addText(`${sc.critMet||0}/${tc}`,{x:8.6,y:0.75,w:4.2,h:0.65,fontSize:36,bold:true,color:C.accent,fontFace:"Calibri"});
    s.addText("TOTAL BPL CRÍTICOS",{x:8.6,y:1.38,w:4.2,h:0.28,fontSize:9,bold:true,color:"rgba(255,255,255,0.8)",fontFace:"Calibri"});

    // Grid of all critics
    const cols=Math.ceil(critTags.length/2);
    critTags.forEach((tag,i)=>{
      const col=i%2; const row=Math.floor(i/2);
      const x=0.3+row*(12.7/cols);
      const y=2.1+col*2.3;
      const isMet=critStatus[tag]==='met';
      const bg=isMet?"E8F5E9":"FFEBEE";
      const bc=isMet?C.proact:C.inactivo;
      s.addShape(pptx.shapes.RECTANGLE,{x,y,w:12.4/cols,h:2.1,fill:{color:bg},line:{color:bc,width:1.5},shadow:mkSh()});
      s.addShape(pptx.shapes.RECTANGLE,{x,y,w:12.4/cols,h:0.38,fill:{color:bc},line:{color:bc}});
      s.addText(`${tag.replace('CRITICO','C')} · ${isMet?'✓ CUMPLIDO':'✗ NO CUMPLIDO'}`,{x:x+0.1,y,w:12.0/cols,h:0.38,fontSize:9.5,bold:true,color:C.white,valign:"middle",fontFace:"Calibri"});
      // Questions in this critic
      const critQs=Q.filter(q=>q.critico===tag);
      critQs.forEach((q,qi)=>{
        const resp=(curAudit.answers||{})[q.comp_num]||'';
        const rColor=resp==='si'?C.proact:resp==='no'?C.inactivo:C.g500;
        const rLabel=resp==='si'?'✓ SI':resp==='no'?'✗ NO':resp==='na'?'N/A':'—';
        const qy=y+0.45+qi*0.38;
        if(qy>y+2.0) return;
        s.addText(q.comp_num,{x:x+0.1,y:qy,w:0.5,h:0.32,fontSize:8,bold:true,color:rColor,valign:"middle"});
        s.addText(q.question.substring(0,55),{x:x+0.65,y:qy,w:12.0/cols-1.1,h:0.32,fontSize:8,color:C.g700,valign:"middle"});
        s.addText(rLabel,{x:x+12.0/cols-0.42,y:qy,w:0.38,h:0.32,fontSize:8,bold:true,color:rColor,align:"center",valign:"middle"});
      });
    });
  }

  // ── SLIDE 4: DETALLE POR ÁREA ────────────────────────────────
  {
    const s=pptx.addSlide();
    s.background={color:C.offwhite};
    addHeader(s,"Detalle por Área de Interés",`Score y cumplimiento por atributo y BPL`);

    AREAS.forEach((area,ai)=>{
      const x=0.3+ai*3.2;
      const v=(sc.areas||{})[area]||0;
      const col=AREA_C[area];
      s.addShape(pptx.shapes.RECTANGLE,{x,y:0.7,w:3.0,h:0.9,fill:{color:col},line:{color:col},shadow:mkSh()});
      s.addText(area,{x:x+0.1,y:0.73,w:2.8,h:0.3,fontSize:11,bold:true,color:C.white,fontFace:"Calibri"});
      s.addText(AN[area]||area,{x:x+0.1,y:1.0,w:2.8,h:0.22,fontSize:8,color:C.accentSoft,fontFace:"Calibri"});
      s.addText(`${(v*100).toFixed(1)}%`,{x:x+0.1,y:1.22,w:2.8,h:0.32,fontSize:18,bold:true,color:C.white,fontFace:"Calibri"});
    });

    // Atributo breakdown
    const atribs=[...new Map(Q.sort((a,b)=>a.bpl_num-b.bpl_num).map(q=>[q.bpl_num,{num:q.bpl_num,name:q.bpl_name,area:q.sheet}]))];
    let curX=0.3,curY=1.72,colW=6.15;
    const col2=curX+colW+0.1;
    let useCol2=false;

    atribs.forEach(([bnum,atrib],ai)=>{
      if(ai===Math.ceil(atribs.length/2)) { useCol2=true; curY=1.72; }
      const x=useCol2?col2:curX;
      const aqs=Q.filter(q=>q.bpl_num===bnum);
      const answeredQs=aqs.filter(q=>{const r=(curAudit.answers||{})[q.comp_num]; return r&&r!=='na';});
      const siQs=answeredQs.filter(q=>(curAudit.answers||{})[q.comp_num]==='si');
      const atribPct=answeredQs.length>0?siQs.length/answeredQs.length:0;
      const col=AREA_C[atrib.area]||C.mid;
      s.addShape(pptx.shapes.RECTANGLE,{x,y:curY,w:colW,h:0.34,fill:{color:col+"18"},line:{color:col+"40"}});
      s.addText(`${bnum}. ${atrib.name||''}`,{x:x+0.1,y:curY,w:colW-1.2,h:0.34,fontSize:8.5,bold:true,color:col,valign:"middle",fontFace:"Calibri"});
      const bw=Math.max(0.05,atribPct*1.5);
      s.addShape(pptx.shapes.RECTANGLE,{x:x+colW-1.8,y:curY+0.07,w:1.5,h:0.2,fill:{color:C.g100},line:{color:C.g200}});
      s.addShape(pptx.shapes.RECTANGLE,{x:x+colW-1.8,y:curY+0.07,w:bw,h:0.2,fill:{color:col},line:{color:col}});
      s.addText(`${(atribPct*100).toFixed(0)}%`,{x:x+colW-0.28,y:curY,w:0.25,h:0.34,fontSize:8,bold:true,color:col,valign:"middle",align:"right"});
      curY+=0.37;
    });
  }

  // ── SLIDE 5: COMPARACIÓN CON EDICIONES ANTERIORES ────────────
  if(histAudits.length>0){
    const s=pptx.addSlide();
    s.background={color:C.offwhite};
    addHeader(s,"Evolución por Edición",`Comparativo histórico · ${curAudit.distribuidor}`);

    const allEditions=[...histAudits,curAudit].sort((a,b)=>(a.edicion||'').localeCompare(b.edicion||''));
    const edLabels=allEditions.map(a=>a.edicion||'?');

    // Total evolution chart
    s.addChart(pptx.charts.BAR,[{
      name:"Score Total (%)",
      labels:edLabels,
      values:allEditions.map(a=>Math.round((a.scores?.total||0)*1000)/10),
    }],{
      x:0.3,y:0.7,w:6.5,h:4.0,barDir:"col",
      chartColors:allEditions.map(a=>CAT_C[recomputeCategory(a)]||C.mid),
      chartArea:{fill:{color:C.white}},
      showValue:true,dataLabelPosition:"outEnd",
      dataLabelColor:C.g700,dataLabelFontSize:11,dataLabelFontBold:true,
      catAxisLabelColor:C.g700,catAxisLabelFontSize:10,
      valAxisMinVal:0,valAxisMaxVal:100,
      valGridLine:{color:"E2E8F0"},catGridLine:{style:"none"},
      showLegend:false,
      title:"Puntaje Total por Edición (%)",showTitle:true,
      titleColor:C.dark,titleFontSize:11,titleFontBold:true,
    });

    // Area evolution
    s.addChart(pptx.charts.BAR,AREAS.map(area=>({
      name:AN[area]||area,
      labels:edLabels,
      values:allEditions.map(a=>Math.round(((a.scores?.areas||{})[area]||0)*1000)/10),
    })),{
      x:7.1,y:0.7,w:6.0,h:4.0,barDir:"col",barGrouping:"clustered",
      chartColors:AREAS.map(a=>AREA_C[a]),
      chartArea:{fill:{color:C.white}},
      valAxisMinVal:0,valAxisMaxVal:100,
      catAxisLabelColor:C.g700,catAxisLabelFontSize:9,
      valGridLine:{color:"E2E8F0"},catGridLine:{style:"none"},
      showLegend:true,legendPos:"t",legendFontSize:9,
      showValue:false,
      title:"Puntaje por Área · Comparativo",showTitle:true,
      titleColor:C.dark,titleFontSize:11,titleFontBold:true,
    });

    // Summary table
    s.addShape(pptx.shapes.RECTANGLE,{x:0.3,y:4.85,w:12.7,h:2.35,fill:{color:C.white},line:{color:C.g200},shadow:mkSh()});
    s.addShape(pptx.shapes.RECTANGLE,{x:0.3,y:4.85,w:12.7,h:0.38,fill:{color:C.mid},line:{color:C.mid}});
    const hdrs=["Edición","Total","Categoría","IFT","PLG","GST","IDP","Críticos"];
    const hx=[0.38,1.55,2.45,4.15,5.35,6.55,7.75,9.0];
    const hw=[1.1,0.85,1.65,1.15,1.15,1.15,1.15,1.2];
    hdrs.forEach((h,hi)=>s.addText(h,{x:hx[hi],y:4.85,w:hw[hi],h:0.38,fontSize:8.5,bold:true,color:C.white,valign:"middle",align:hi>1?"center":"left"}));
    allEditions.forEach((a,ri)=>{
      const ry=5.27+ri*0.46;
      const bg=ri%2===0?C.white:"F0F4FA";
      const isCur=a.edicion===curAudit.edicion;
      s.addShape(pptx.shapes.RECTANGLE,{x:0.3,y:ry,w:12.7,h:0.44,fill:{color:isCur?catC+"22":bg},line:{color:isCur?catC:C.g100,width:isCur?1:0.5}});
      const acat=recomputeCategory(a);
      const acatC=CAT_C[acat]||C.g500;
      s.addText(a.edicion||'',{x:hx[0],y:ry,w:hw[0],h:0.44,fontSize:9,bold:isCur,color:isCur?catC:C.g700,valign:"middle"});
      s.addText(`${((a.scores?.total||0)*100).toFixed(1)}%`,{x:hx[1],y:ry,w:hw[1],h:0.44,fontSize:9,bold:true,color:acatC,valign:"middle"});
      s.addShape(pptx.shapes.RECTANGLE,{x:hx[2]+0.05,y:ry+0.09,w:1.55,h:0.26,fill:{color:acatC},line:{color:acatC}});
      s.addText(acat,{x:hx[2]+0.05,y:ry+0.09,w:1.55,h:0.26,fontSize:7.5,bold:true,color:C.white,align:"center",valign:"middle"});
      AREAS.forEach((area,ai)=>{
        const v=((a.scores?.areas||{})[area]||0)*100;
        s.addText(`${v.toFixed(0)}%`,{x:hx[3+ai],y:ry,w:hw[3+ai],h:0.44,fontSize:9,color:AREA_C[area],align:"center",valign:"middle",bold:isCur});
      });
      s.addText(`${a.scores?.critMet||0}/${auditTotalCrits(a)}`,{x:hx[7],y:ry,w:hw[7],h:0.44,fontSize:9,color:C.g700,align:"center",valign:"middle"});
    });
  }

  // ── SLIDE 6: CIERRE ──────────────────────────────────────────
  {
    const s=pptx.addSlide();s.background={color:C.offwhite};
    // Banda inferior catC (espejo de la portada invertido)
    s.addShape(pptx.shapes.RECTANGLE,{x:0,y:H-3.2,w:W,h:3.2,fill:{color:C.dark},line:{color:C.dark}});
    s.addShape(pptx.shapes.RECTANGLE,{x:0,y:H-3.2,w:W,h:0.05,fill:{color:catC},line:{color:catC}});
    s.addShape(pptx.shapes.RECTANGLE,{x:0,y:H-0.06,w:W,h:0.06,fill:{color:catC},line:{color:catC}});

    // ÁREA SUPERIOR: Nombre distribuidor + score
    s.addText(curAudit.distribuidor,{x:0.5,y:0.55,w:W-1.0,h:1.1,fontSize:28,bold:true,color:C.dark,fontFace:"Calibri",wrap:true,valign:"top"});
    s.addShape(pptx.shapes.LINE,{x:0.5,y:1.85,w:12.3,h:0,line:{color:catC,width:1.5}});
    // Badge categoría en área blanca
    s.addShape(pptx.shapes.RECTANGLE,{x:0.5,y:2.05,w:4.0,h:1.1,fill:{color:catC},line:{color:catC}});
    s.addText(cat,{x:0.65,y:2.1,w:3.7,h:0.6,fontSize:22,bold:true,color:C.white,fontFace:"Calibri"});
    s.addText(pct,{x:0.65,y:2.7,w:3.7,h:0.35,fontSize:18,color:C.white,fontFace:"Calibri"});
    // Texto RED Activa
    s.addText(`RED Activa 2.0 · ${PAIS} · Edición ${curAudit.edicion}`,{x:4.8,y:2.15,w:8.0,h:0.45,fontSize:14,color:C.g500,fontFace:"Calibri"});

    // ÁREA INFERIOR (dark): logos + cierre
    s.addText("Estamos para ayudarte",{x:0.5,y:H-2.9,w:8.0,h:0.6,fontSize:20,bold:true,color:C.white,fontFace:"Calibri"});
    s.addText("BAP Partners Consultoría Empresarial",{x:0.5,y:H-2.28,w:8.0,h:0.42,fontSize:13,color:C.accentSoft,fontFace:"Calibri"});
    if(logos.bap) s.addImage({data:`image/png;base64,${logos.bap}`,x:0.5,y:H-1.8,w:2.8,h:1.02});
    if(logos.arcor) s.addImage({data:`image/png;base64,${logos.arcor}`,x:W-4.1,y:H-3.0,w:3.7,h:2.65});
  }

  // Save
  const fileName=`${curAudit.distribuidor.substring(0,30).replace(/[^a-zA-Z0-9]/g,'_')}_${curAudit.edicion}_Informe.pptx`;
  try{
    if(window.electronAPI?.savePptx){
      const ab=await pptx.write({outputType:'arraybuffer'});
      const u8=Array.from(new Uint8Array(ab));
      const res=await window.electronAPI.savePptxDirect(u8,fileName);
      if(res?.success) showToast('✅ Informe guardado: '+res.filePath.split('\\').pop());
      else showToast('⚠️ Guardado cancelado');
    }else{
      // Fallback: browser download
      const ab2=await pptx.write({outputType:'arraybuffer'});
      const blob=new Blob([ab2],{type:'application/vnd.openxmlformats-officedocument.presentationml.presentation'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url; a.download=fileName;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      showToast('✅ Descargando: '+fileName);
    }
  }catch(e){
    console.error('PPTX dist error:',e);
    showToast('❌ Error PPTX: '+(e.message||String(e)));
    alert('Error generando PPTX distribuidor:\n\n'+e.message+'\n\nStack: '+e.stack?.substring(0,200));
  }
}

// ── MINI MODAL (reemplaza prompt() en Electron) ─────────
let _miniResolve = null;

function miniPrompt(title, placeholder){
  return new Promise(resolve=>{
    _miniResolve = resolve;
    const overlay = document.getElementById('mini-modal-overlay');
    const inp = document.getElementById('mini-modal-input');
    document.getElementById('mini-modal-title').textContent = title;
    inp.value = '';
    inp.placeholder = placeholder || '';
    overlay.style.display = 'flex';
    setTimeout(()=>inp.focus(), 50);
    inp.onkeydown = e => {
      if(e.key === 'Enter') miniModalOk();
      if(e.key === 'Escape') miniModalCancel();
    };
  });
}
function miniModalOk(){
  const val = document.getElementById('mini-modal-input').value.trim();
  document.getElementById('mini-modal-overlay').style.display = 'none';
  if(_miniResolve){ _miniResolve(val||null); _miniResolve=null; }
}
function miniModalCancel(){
  document.getElementById('mini-modal-overlay').style.display = 'none';
  if(_miniResolve){ _miniResolve(null); _miniResolve=null; }
}

// ── PANEL HISTÓRICO DE DISTRIBUIDOR ─────────────────────

let _histPanelOpen = false;

function toggleHistPanel(){
  _histPanelOpen = !_histPanelOpen;
  const panel = document.getElementById('hist-panel');
  const toggle = document.getElementById('hist-toggle');
  panel.classList.toggle('open', _histPanelOpen);
  toggle.classList.toggle('panel-open', _histPanelOpen);
  document.body.classList.toggle('hist-open', _histPanelOpen);
  if(_histPanelOpen) renderHistPanel();
}

function updateHistPanelForDist(dist){
  const toggle = document.getElementById('hist-toggle');
  const selEd  = document.getElementById('hist-sel-ed');
  const curEd  = document.getElementById('sel-edicion').value;

  if(!dist){
    toggle.style.display = 'none';
    if(_histPanelOpen) toggleHistPanel();
    return;
  }

  // Get prior editions for this distribuidor
  const priorAudits = saved
    .filter(a => a.distribuidor === dist && a.edicion !== curEd)
    .sort((a,b) => (b.edicion||'').localeCompare(a.edicion||''));

  if(!priorAudits.length){
    toggle.style.display = 'none';
    if(_histPanelOpen) toggleHistPanel();
    return;
  }

  // Show toggle button
  toggle.style.display = 'block';

  // Populate edition selector
  selEd.innerHTML = '<option value="">— Seleccioná edición —</option>' +
    priorAudits.map(a =>
      `<option value="${a.edicion}">${a.edicion} · ${a.scores ? ((a.scores.total||0)*100).toFixed(1)+'%' : '—'} · ${a.scores ? (recomputeCategory(a)||'') : ''}</option>`
    ).join('');

  // Auto-select the most recent prior edition
  if(priorAudits.length) selEd.value = priorAudits[0].edicion;

  // Update title
  document.getElementById('hist-panel-title').textContent = dist;

  if(_histPanelOpen) renderHistPanel();
}

function renderHistPanel(){
  const dist   = document.getElementById('sel-dist').value;
  const ed     = document.getElementById('hist-sel-ed').value;
  const onlyDiff = document.getElementById('hist-only-diff').checked;
  const body   = document.getElementById('hist-body');
  const summary = document.getElementById('hist-summary');

  if(!dist || !ed){
    body.innerHTML = '<div style="padding:30px;text-align:center;color:var(--g400);font-size:12px">Seleccioná una edición para comparar.</div>';
    summary.innerHTML = '';
    return;
  }

  const histAudit = saved.find(a => a.distribuidor === dist && a.edicion === ed);
  if(!histAudit){
    body.innerHTML = '<div style="padding:30px;text-align:center;color:var(--g400);font-size:12px">No se encontró la auditoría.</div>';
    return;
  }

  const histAns  = histAudit.answers || {};
  const histSc   = histAudit.scores  || {};
  const sheets   = SHEETS();

  // ── Summary KPIs ──
  const curEd = document.getElementById('sel-edicion').value;
  summary.innerHTML = `
    <div style="font-size:10px;color:var(--g500);margin-bottom:6px;font-weight:700">
      EDICIÓN ${ed} vs ACTUAL (${curEd})
    </div>
    <div class="hist-kpi-row" style="background:#fff;border:1px solid var(--g200);border-radius:7px;overflow:hidden">
      <div class="hist-kpi">
        <div class="hist-kpi-val" style="color:${semColor(histSc.total||0)}">${((histSc.total||0)*100).toFixed(1)}%</div>
        <div class="hist-kpi-lbl">Total ${ed}</div>
      </div>
      <div class="hist-kpi">
        <div class="hist-kpi-val" style="color:${semColor(histSc.total||0)};font-size:14px;font-weight:900">${recomputeCategory(histAudit)||'—'}</div>
        <div class="hist-kpi-lbl">Categoría</div>
      </div>
      <div class="hist-kpi">
        <div class="hist-kpi-val" style="color:${(histSc.critMet||0)===CRIT_LIST.length?'#2e7d32':'#c62828'}">${histSc.critMet||0}/${CRIT_LIST.length}</div>
        <div class="hist-kpi-lbl">Críticos</div>
      </div>
      <div class="hist-kpi">
        <div class="hist-kpi-val" style="font-size:12px">${Object.values(histAns).filter(v=>v).length}/${Q.length}</div>
        <div class="hist-kpi-lbl">Respondidas</div>
      </div>
    </div>
    ${sheets.map(sh=>{
      const v = (histSc.areas||{})[sh]||0;
      const col = AC[sh]||'#607d8b';
      return `<div style="display:flex;align-items:center;gap:6px;margin-top:5px">
        <div style="font-size:10px;font-weight:800;color:${col};min-width:36px">${sh}</div>
        <div style="flex:1;background:var(--g100);border-radius:5px;height:8px;overflow:hidden">
          <div style="height:100%;width:${(v*100).toFixed(0)}%;background:${col};border-radius:5px"></div>
        </div>
        <div style="font-size:10px;font-weight:800;color:${semColor(v)};min-width:36px;text-align:right">${(v*100).toFixed(1)}%</div>
      </div>`;
    }).join('')}
  `;

  // ── Question by question ──
  let html = '';
  sheets.forEach(sh => {
    const shQ = Q.filter(q => q.sheet === sh);
    if(!shQ.length) return;
    const color = AC[sh]||'#607d8b';

    // Group by bpl
    const bplNums = [...new Set(shQ.map(q=>q.bpl_num))];
    let areaHtml = '';
    let areaHasDiff = false;

    bplNums.forEach(bk => {
      const bkQ = shQ.filter(q => q.bpl_num === bk);
      const bplName = bkQ[0]&&bkQ[0].bpl_name ? bkQ[0].bpl_name : '';
      let bplHtml = '';
      let bplHasDiff = false;

      bkQ.forEach(q => {
        const histResp = histAns[q.comp_num] || '';
        const curResp  = ans[q.comp_num]     || '';
        const isDiff   = histResp !== curResp && (histResp || curResp);
        const isCrit   = !!q.critico;

        if(onlyDiff && !isDiff && !isCrit) return;

        bplHasDiff = bplHasDiff || isDiff;
        areaHasDiff = areaHasDiff || isDiff;

        const respClass = histResp==='si'?'hq-si':histResp==='no'?'hq-no':histResp==='na'?'hq-na':'hq-empty';
        const respLabel = histResp==='si'?'SI':histResp==='no'?'NO':histResp==='na'?'N/A':'—';

        // Current answer badge
        const curClass = curResp==='si'?'hq-si':curResp==='no'?'hq-no':curResp==='na'?'hq-na':'hq-empty';
        const curLabel = curResp==='si'?'SI':curResp==='no'?'NO':curResp==='na'?'N/A':'—';

        const rowClass = isDiff ? 'hq-row hq-diff' :
                         histResp==='si' ? 'hq-row hq-yes' :
                         histResp==='no' ? 'hq-row hq-no' : 'hq-row';

        bplHtml += `<div class="${rowClass}" ${isCrit?'style="border-left:3px solid #c62828"':''}>
          <div class="hq-comp">${q.comp_num}${isCrit?'<div style="color:#c62828;font-size:8px">●CRIT</div>':''}</div>
          <div class="hq-text">${q.question}</div>
          <div style="display:flex;flex-direction:column;gap:3px;align-items:flex-end">
            <span class="hq-badge ${respClass}" title="Edición ${ed}">${respLabel}</span>
            ${isDiff ? `<span class="hq-badge ${curClass}" style="opacity:.6;font-size:9px" title="Actual">${curLabel}▶</span>` : ''}
          </div>
        </div>`;
      });

      if(bplHtml){
        areaHtml += `<div style="padding:5px 14px 3px;background:var(--g50);font-size:10px;font-weight:700;color:var(--g600);border-bottom:1px solid var(--g100)">
          ${bk}. ${bplName}
        </div>${bplHtml}`;
      }
    });

    if(areaHtml){
      html += `<div class="hq-area-hd" style="background:${color}18;color:${color};border-color:${color}40">
        ${sh} · ${AN[sh]||''}
      </div>${areaHtml}`;
    }
  });

  if(!html){
    html = '<div style="padding:24px;text-align:center;color:var(--g400);font-size:12px">'+
           (onlyDiff ? 'No hay diferencias entre ediciones 🎉' : 'Sin respuestas en esta edición.')+
           '</div>';
  }

  body.innerHTML = html;
}

// ── MERGE SNAPSHOT (add audits from another snapshot) ────
function mergeSnapshot(){
  if(window.electronAPI){
    // Electron: use native file dialog
    window.electronAPI.openFileDialog().then(filePath=>{
      if(filePath) mergeSnapshotFromFile(filePath);
    });
  } else {
    // Browser: use file input
    const input=document.createElement('input');
    input.type='file'; input.accept='.html';
    input.onchange=e=>{
      const file=e.target.files[0]; if(!file) return;
      const reader=new FileReader();
      reader.onload=ev=>mergeSnapshotFromHTML(ev.target.result);
      reader.readAsText(file);
    };
    input.click();
  }
}

function mergeSnapshotFromFile(filePath){
  window.electronAPI.readFile(filePath).then(res=>{
    if(!res.success){ showToast('❌ No se pudo leer el archivo'); return; }
    mergeSnapshotFromHTML(res.content, filePath);
  });
}

function mergeSnapshotFromHTML(html, label){
  const parser=new DOMParser();
  const doc=parser.parseFromString(html,'text/html');
  const snapEl=doc.getElementById('__snap_embed__');
  if(!snapEl||snapEl.textContent.trim()==='/* __SNAP_PLACEHOLDER__ */'){
    showToast('❌ No es un snapshot válido de RED Activa'); return;
  }
  try{
    const d=JSON.parse(snapEl.textContent);
    if(!d.saved||!d.saved.length){
      showToast('⚠️ El snapshot no tiene auditorías guardadas'); return;
    }

    // Check for edition conflicts
    const incomingEds=[...new Set(d.saved.map(a=>a.edicion).filter(Boolean))];
    const currentEds=[...new Set(saved.map(a=>a.edicion).filter(Boolean))];
    const conflicts=incomingEds.filter(ed=>currentEds.includes(ed));

    const proceed=()=>{
      // Save current program config before merging (must not change)
      const _savedPais = cfg.pais;
      const _savedAnio = cfg.anio;
      const _savedAw   = {...AW};
      let added=0, replaced=0, skipped=0;

      d.saved.forEach(incoming=>{
        // Each audit keeps its OWN weight snapshot (historical integrity)
        // If no weight snapshot, attach the weights from the incoming snapshot
        if(!incoming.weights && d.aw){
          incoming.weights={ aw:{...d.aw}, wcfg:d.wcfg||{} };
        }

        // Check for duplicate (same distribuidor + same edicion)
        const existIdx=saved.findIndex(
          a=>a.distribuidor===incoming.distribuidor && a.edicion===incoming.edicion
        );

        if(existIdx>=0){
          // Replace existing with incoming (incoming is authoritative for its edition)
          saved[existIdx]=incoming;
          replaced++;
        } else {
          saved.push(incoming);
          added++;
        }
      });

      // Restore cfg that might have been affected
      cfg.pais = _savedPais;
      cfg.anio = _savedAnio;
      Object.assign(AW, _savedAw);
      persist();
      rebuildDistSelect();
      renderSaved(); updateAudCnt(); renderGlobal();
      loadPaisAnio();

      const pais=d.cfg&&d.cfg.pais?d.cfg.pais:'?';
      const anio=d.cfg&&d.cfg.anio?d.cfg.anio:'?';
      showToast(
        '✅ Fusión — Edición '+anio+
        ': '+added+' agregadas, '+replaced+' actualizadas'
      );

      // Switch to Global tab to show the combined data
      setTimeout(()=>goTab('global'), 300);
    };

    // Warn if there are edition conflicts
    if(conflicts.length){
      if(confirm('Ya hay auditorias de la edicion: ' + conflicts.join(', ') + '. Reemplazar con las del snapshot importado?')){
        proceed();
      }
    } else {
      proceed();
    }

  }catch(e){
    showToast('❌ Error al leer snapshot: '+e.message);
    console.error(e);
  }
}

// ── EXPORT SNAPSHOT (self-contained shareable HTML) ─────
function exportSnapshot(){
  if(!saved.length && !DISTRIBUTORS.length){
    if(!confirm('No hay auditorías ni distribuidores cargados. ¿Exportar igual como template?')) return;
  }

  // Package all current data
  const snapData = JSON.stringify({
    saved:        saved,
    cfg:          cfg,
    distributors: DISTRIBUTORS,
    aw:           AW,
    wcfg:         WCfg,
    matrixCfg:    MATRIX_CFG,
    qCustom:      JSON.stringify(Q),
    areasCfg:     JSON.stringify({ac:{...AC},an:{...AN}}),
  });

  // Get raw HTML source and inject data into the placeholder <script> tag
  // We use outerHTML but replace the placeholder text — which the browser never modifies
  // because it's inside a <script> tag (treated as raw text)
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

