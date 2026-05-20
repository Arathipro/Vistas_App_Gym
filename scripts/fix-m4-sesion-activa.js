const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'modules', 'mod4_sesion', 'screens', 'SesionActivaScreen.js');
let src = fs.readFileSync(filePath, 'utf8');

function replaceOnce(from, to, label) {
  if (!src.includes(from)) {
    throw new Error(`No se encontró el bloque esperado: ${label}`);
  }
  src = src.replace(from, to);
}

replaceOnce(
  "  const [prep, setPrep] = useState(PREP_DEFAULT);",
  "  const [prepConfig, setPrepConfig] = useState(PREP_DEFAULT);\n  const [prep, setPrep] = useState(PREP_DEFAULT);",
  'estado prepConfig'
);

replaceOnce(
  "  function detenerSerie() { setEstado('descanso'); setDescansoSeg(descansoDe(ejercicio)); }",
  "  function detenerSerie() { setEstado('descanso'); setDescansoSeg(descansoDe(ejercicio)); }\n  function resetPreparacion() { setSerieActual(1); setPrep(prepConfig); setSerieSeg(0); setDescansoSeg(0); setPeso(''); setReps(''); setNotaSerie(''); setSerieGuardada(null); setMostrarVideo(false); setEstado('preparacion'); }\n  function cambiarPrepConfig(delta) { const nuevo = Math.min(10, Math.max(3, prepConfig + delta)); setPrepConfig(nuevo); if (estado === 'preparacion') setPrep(nuevo); }",
  'helpers preparación'
);

replaceOnce(
  "setPrep(PREP_DEFAULT); setSerieSeg(0); setDescansoSeg(0); setEstado('preparacion');",
  "setPrep(prepConfig); setSerieSeg(0); setDescansoSeg(0); setEstado('preparacion');",
  'avanzar usa prepConfig'
);

replaceOnce(
  "  function aplicarOrden(nuevoOrden) { const actualKey = keyEj(ejercicio); const normalizado = nuevoOrden.map((e, i) => ({ ...e, ordenSesion: i + 1 })); setEjerciciosSesion(normalizado); const nuevoIndex = normalizado.findIndex(e => keyEj(e) === actualKey); if (nuevoIndex >= 0) setEjIndex(nuevoIndex); }",
  "  function aplicarOrden(nuevoOrden) { const actualKey = keyEj(ejercicio); const normalizado = nuevoOrden.map((e, i) => ({ ...e, ordenSesion: i + 1 })); const regsActual = ejercicio ? seriesDe(ejercicio, registros) : 0; const nuevoIndexActual = normalizado.findIndex(e => keyEj(e) === actualKey); const debeReasignarPorPosicion = ejercicio && regsActual === 0 && (estado === 'preparacion' || estado === 'serie') && nuevoIndexActual !== -1 && nuevoIndexActual !== ejIndex; setEjerciciosSesion(normalizado); if (debeReasignarPorPosicion) { const sigMismaPosicion = siguienteIndice(ejIndex, normalizado); if (sigMismaPosicion !== -1) { setEjIndex(sigMismaPosicion); resetPreparacion(); return; } const primeroActivo = siguienteIndice(0, normalizado); if (primeroActivo !== -1) { setEjIndex(primeroActivo); resetPreparacion(); return; } ejecutarFinalizar(); return; } if (nuevoIndexActual >= 0) setEjIndex(nuevoIndexActual); }",
  'aplicarOrden corregido'
);

replaceOnce(
  "setSerieActual(1); setPrep(PREP_DEFAULT); setSerieSeg(0); setDescansoSeg(0); setEstado('preparacion'); } }",
  "resetPreparacion(); } }",
  'cancelarEjercicio usa resetPreparacion'
);

replaceOnce(
  "setSerieActual(1); setPrep(PREP_DEFAULT); setSerieSeg(0); setDescansoSeg(0); setEstado('preparacion'); } }",
  "resetPreparacion(); } }",
  'sustituirEjercicio usa resetPreparacion'
);

replaceOnce(
  "</View>{estado === 'serie' && <TouchableOpacity style={s.btnPrimary} onPress={detenerSerie}>",
  "</View>{estado === 'preparacion' && <View style={s.prepConfigBox}><Text style={s.prepConfigLabel}>Tiempo de preparación</Text><View style={s.prepConfigControls}><TouchableOpacity style={[s.prepConfigBtn, prepConfig <= 3 && s.iconDisabled]} onPress={() => cambiarPrepConfig(-1)}><Text style={s.prepConfigBtnText}>−</Text></TouchableOpacity><Text style={s.prepConfigValue}>{prepConfig}s</Text><TouchableOpacity style={[s.prepConfigBtn, prepConfig >= 10 && s.iconDisabled]} onPress={() => cambiarPrepConfig(1)}><Text style={s.prepConfigBtnText}>+</Text></TouchableOpacity></View><Text style={s.prepConfigHint}>Se aplicará a las siguientes preparaciones.</Text></View>}{estado === 'serie' && <TouchableOpacity style={s.btnPrimary} onPress={detenerSerie}>",
  'UI configuración preparación'
);

replaceOnce(
  "bigTimerHint:{color:'#777',fontSize:12,textAlign:'center'},warningText:",
  "bigTimerHint:{color:'#777',fontSize:12,textAlign:'center'},prepConfigBox:{marginTop:12,backgroundColor:'rgba(124,111,205,0.10)',borderWidth:1,borderColor:'rgba(124,111,205,0.35)',borderRadius:12,padding:12},prepConfigLabel:{color:'#aaa',fontSize:11,fontWeight:'900',textTransform:'uppercase',textAlign:'center'},prepConfigControls:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:14,marginTop:8},prepConfigBtn:{width:34,height:34,borderRadius:10,backgroundColor:'#2a2a35',borderWidth:1,borderColor:'#3a3a45',alignItems:'center',justifyContent:'center'},prepConfigBtnText:{color:'#5eead4',fontSize:20,fontWeight:'900'},prepConfigValue:{color:'white',fontSize:18,fontWeight:'900',minWidth:44,textAlign:'center'},prepConfigHint:{color:'#777',fontSize:11,marginTop:8,textAlign:'center'},warningText:",
  'estilos preparación configurable'
);

fs.writeFileSync(filePath, src, 'utf8');
console.log('✅ SesionActivaScreen.js actualizado: reordenamiento corregido y preparación configurable 3–10s.');
