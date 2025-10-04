// ✅ NUEVA: obtener el personaje asignado a un slot (lee store "slots" -> personajeId -> "personajes")
// ✅ GLOBAL: obtener el personaje asignado a un slot
window.getPersonajeBySlot = async function (slot) {
  const personajeId = await new Promise((resolve, reject) => {
    const tx = db.transaction("slots", "readonly");
    const st = tx.objectStore("slots");
    const req = st.get(slot);
    req.onsuccess = e => resolve(e.target.result?.personajeId ?? null);
    req.onerror = () => reject(req.error);
  });
  if (!personajeId) return null;

  return await new Promise((resolve, reject) => {
    const tx = db.transaction("personajes", "readonly");
    const st = tx.objectStore("personajes");
    const req = st.get(personajeId);
    req.onsuccess = e => resolve(e.target.result || null);
    req.onerror = () => reject(req.error);
  });
};

// ✅ NUEVA: persistir cambios de un personaje
// ✅ GLOBAL: persistir cambios de un personaje
window.savePersonaje = function (p) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("personajes", "readwrite");
    const st = tx.objectStore("personajes");
    const req = st.put(p);
    req.onsuccess = () => { if (typeof mostrarPersonajes === 'function') mostrarPersonajes(); resolve(); };
    req.onerror = () => reject(req.error);
  });
};


// ✅ NUEVA: abrir editor Inventario con SweetAlert2 + tippy tooltips
// ✅ GLOBAL: abrir el editor (usa SweetAlert2 + Tippy)
//    *idéntica a la que tenías*, solo cambia la cabecera para quedar en window.*
// ✅ Reemplaza íntegramente tu openInventarioEditor por esta versión (sin redeclaraciones)




// ✅ NUEVA: renderizado de tablas de Objetos / Armaduras / Armas con edición inline
// ✅ GLOBAL: renderizado de tablas del inventario
// ✅ GLOBAL: renderizado de tablas del inventario (orden alfabético al pintar)
window.renderInventarioLists = function (personaje) {
  const mkOpts = (n, sel) => Array.from({ length: n }, (_, i) => `<option value="${i}" ${i == sel ? 'selected' : ''}>${i}</option>`).join('');

  // --- helpers de ordenación sin mutar el inventario original ---
  const byStr = (get) => (a, b) => {
    const A = (get(a) || '').toString().trim().toLowerCase();
    const B = (get(b) || '').toString().trim().toLowerCase();
    if (A && B) return A.localeCompare(B, 'es', { sensitivity: 'base' });
    if (!A && B) return 1;   // vacíos al final
    if (A && !B) return -1;
    return 0;
  };

  const objetosOrden = Array.isArray(personaje.inventario?.objetos)
    ? personaje.inventario.objetos.slice().sort(byStr(o => o.nombre))
    : [];

  const armadurasOrden = Array.isArray(personaje.inventario?.armaduras)
    ? personaje.inventario.armaduras.slice().sort(byStr(a => a.armadura))
    : [];

  const armasOrden = Array.isArray(personaje.inventario?.armas)
    ? personaje.inventario.armas.slice().sort(byStr(w => w.arma))
    : [];

  // Objetos
  const objHtml = `
      <table class="table table-sm align-middle">
        <thead><tr>
          
          <th>Nombre</th>
          <th>Lugar</th>
          <th  style="width:80px;">Cant.</th>
          <th>Peso</th>
          <th>Durabilidad</th>
          <th>Uso</th>
          <th style="width:80px;"></th>
          <th style="width:80px;"></th>
        </tr></thead>
        <tbody>
        ${objetosOrden.map(o => `
          <tr data-itemid="${o.id}">
            <td><input class="form-control form-control-sm" name="nombre" value="${o.nombre || ''}"></td>
            <td>
  <select class="form-select form-select-sm" name="lugar">
    ${['','Mochila','Atajo 1','Atajo 2','Atajo 3','Atajo 4','Atajo 5','Atajo 6','Atajo 7']
      .map(l => `<option value="${l}" ${o.lugar===l?'selected':''}>${l || '--Lugar--'}</option>`)
      .join('')}
  </select>
</td>
            <td><input class="form-control form-control-sm" type="number" min="0" name="cantidad" value="${o.cantidad ?? 0}"></td>
            <td><input class="form-control form-control-sm" type="number" step="0.1" min="0" name="peso" value="${o.peso ?? 0}"></td>
            <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, o.durabilidad ?? 0)}</select></td>
            <td><input class="form-control form-control-sm" name="uso" value="${o.uso || ''}"></td>
            <td><button class="btn btn-sm btn-danger" data-action="eliminar">🗑️</button></td>
            <td><button class="btn btn-sm btn-secondary" data-action="traspasar">⇄</button></td>
          </tr>`).join('')}
        </tbody>
      </table>`;

  // Armaduras (Cobertura como <p> con lista unida por comas)
  const armHtml = `
      <table class="table table-sm align-middle">
        <thead><tr>
          <th style="width:120px;">Equipado</th>
          <th>Armadura</th><th>Cobertura</th><th>Defensa</th><th>Especial</th><th>Durabilidad</th><th>Peso</th><th style="width:80px;"></th><th style="width:80px;"></th>
        </tr></thead>
        <tbody>
        ${armadurasOrden.map(a => `
          <tr data-itemid="${a.id}">
            <td><input type="checkbox" name="equipado" ${a.equipado ? 'checked' : ''}></td>
            <td><input class="form-control form-control-sm" name="armadura" value="${a.armadura || ''}"></td>
            <td><p class="mb-0">${Array.isArray(a.cobertura) ? a.cobertura.join(', ') : ''}</p></td>
            <td><select class="form-select form-select-sm" name="defensa">${mkOpts(11, a.defensa ?? 0)}</select></td>
            <td><input class="form-control form-control-sm" name="especial" value="${a.especial || ''}"></td>
            <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, a.durabilidad ?? 0)}</select></td>
            <td><input class="form-control form-control-sm" type="number" step="0.1" min="0" name="peso" value="${a.peso ?? 0}"></td>
            <td><button class="btn btn-sm btn-danger" data-action="eliminar">🗑️</button></td>
            <td><button class="btn btn-sm btn-secondary" data-action="traspasar">⇄</button></td>
          </tr>`).join('')}
        </tbody>
      </table>`;

  // Armas
  const armasHtml = `
      <table class="table table-sm align-middle">
        <thead><tr>
          <th style="width:120px;">Equipado</th>
          <th>Arma</th><th>Mano</th><th>Daño</th><th>Durabilidad</th><th>Especial</th><th>Peso</th><th style="width:80px;"></th><th style="width:80px;"></th>
        </tr></thead>
        <tbody>
        ${armasOrden.map(w => `
          <tr data-itemid="${w.id}">
            <td><input type="checkbox" name="equipado" ${w.equipado ? 'checked' : ''}></td>
            <td><input class="form-control form-control-sm" name="arma" value="${w.arma || ''}"></td>
            <td>
              <select class="form-select form-select-sm" name="mano">
                ${['Izquierda', 'Derecha', 'Ambas'].map(m => `<option value="${m}" ${w.mano === m ? 'selected' : ''}>${m}</option>`).join('')}
              </select>
            </td>
            <td><input class="form-control form-control-sm" name="danio" value="${w.danio || ''}"></td>
            <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, w.durabilidad ?? 0)}</select></td>
            <td><input class="form-control form-control-sm" name="especial" value="${w.especial || ''}"></td>
            <td><input class="form-control form-control-sm" type="number" step="0.1" min="0" name="peso" value="${w.peso ?? 0}"></td>
            <td><button class="btn btn-sm btn-danger" data-action="eliminar">🗑️</button></td>
            <td><button class="btn btn-sm btn-secondary" data-action="traspasar">⇄</button></td>
          </tr>`).join('')}
        </tbody>
      </table>`;

  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  set('listObjetos', objHtml);
  set('listArmaduras', armHtml);
  set('listArmas', armasHtml);
};
