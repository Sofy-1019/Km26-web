// ================================================
// KM26 PERFORMANCE - PANEL DE GESTIÓN
// Backend en Google Apps Script (gratis)
// ================================================

// Cambiá este PIN por el que quieras usar para entrar al panel
const PIN = "190";

function doGet(e) {

  const action = e.parameter.action;
  const pin = e.parameter.pin;

  if (pin !== PIN) {
    return respond({ error: "PIN incorrecto" });
  }

  try {

    if (action === "listarClientes") return respond(listarClientes());
    if (action === "buscar") return respond(buscar(e.parameter.q || ""));
    if (action === "agregarCliente") return respond(agregarCliente(e.parameter));
    if (action === "editarCliente") return respond(editarCliente(e.parameter));
    if (action === "eliminarCliente") return respond(eliminarCliente(e.parameter.id));
    if (action === "vehiculosDeCliente") return respond(vehiculosDeCliente(e.parameter.clienteId));
    if (action === "agregarMovimiento") return respond(agregarMovimiento(e.parameter));
    if (action === "movimientosCaja") return respond(movimientosCaja());
    if (action === "resumenCaja") return respond(resumenCaja());
    if (action === "listarStock") return respond(listarStock());
    if (action === "agregarProducto") return respond(agregarProducto(e.parameter));
    if (action === "ajustarStock") return respond(ajustarStock(e.parameter));
    if (action === "obtenerProducto") return respond(obtenerProducto(e.parameter.id));

    return respond({ error: "Acción no reconocida: " + action });

  } catch (err) {
    return respond({ error: err.toString() });
  }

}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet(nombre) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombre.toUpperCase());
}

function nextId(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return 1;
  let max = 0;
  for (let i = 1; i < data.length; i++) {
    if (Number(data[i][0]) > max) max = Number(data[i][0]);
  }
  return max + 1;
}

// ---------- Clientes y vehículos ----------

function listarClientes() {
  const data = getSheet("Clientes").getDataRange().getValues();
  const filas = data.slice(1).reverse().slice(0, 8);
  return filas.map(r => ({
    id: r[0], nombre: r[1], apellido: r[2], telefono: r[3], email: r[4]
  }));
}

function buscar(q) {
  q = q.toLowerCase().trim();
  const clientes = getSheet("Clientes").getDataRange().getValues().slice(1);
  const vehiculos = getSheet("Vehiculos").getDataRange().getValues().slice(1);
  const resultados = [];

  clientes.forEach(c => {
    const nombreCompleto = (c[1] + " " + c[2]).toLowerCase();
    if (nombreCompleto.includes(q)) {
      resultados.push({
        tipo: "cliente", id: c[0], nombre: c[1], apellido: c[2],
        telefono: c[3], email: c[4]
      });
    }
  });

  vehiculos.forEach(v => {
    const patente = String(v[2]).toLowerCase().replace(/\s/g, "");
    if (patente.includes(q.replace(/\s/g, ""))) {
      const cliente = clientes.find(c => c[0] == v[1]);
      resultados.push({
        tipo: "vehiculo", id: v[0], patente: v[2], marca: v[3], modelo: v[4], anio: v[5],
        clienteId: v[1],
        clienteNombre: cliente ? (cliente[1] + " " + cliente[2]) : "(sin datos)",
        clienteNombreSolo: cliente ? cliente[1] : "",
        clienteApellido: cliente ? cliente[2] : "",
        clienteTelefono: cliente ? cliente[3] : "",
        clienteEmail: cliente ? cliente[4] : ""
      });
    }
  });

  return resultados;
}

function agregarCliente(p) {
  const sheet = getSheet("Clientes");
  const id = nextId(sheet);
  sheet.appendRow([id, p.nombre, p.apellido, p.telefono, p.email || "", new Date()]);

  let vehiculoId = null;
  if (p.patente) {
    vehiculoId = agregarVehiculoInterno(id, p.patente, p.marca, p.modelo, p.anio);
  }

  return { id: id, vehiculoId: vehiculoId };
}

function agregarVehiculoInterno(clienteId, patente, marca, modelo, anio) {
  const sheet = getSheet("Vehiculos");
  const id = nextId(sheet);
  sheet.appendRow([id, clienteId, String(patente).toUpperCase(), marca || "", modelo || "", anio || "", new Date()]);
  return id;
}

function vehiculosDeCliente(clienteId) {
  const data = getSheet("Vehiculos").getDataRange().getValues().slice(1);
  return data
    .filter(v => v[1] == clienteId)
    .map(v => ({ id: v[0], patente: v[2], marca: v[3], modelo: v[4], anio: v[5] }));
}

function editarCliente(p) {
  const sheet = getSheet("Clientes");
  const data = sheet.getDataRange().getValues();
  const id = Number(p.id);

  for (let i = 1; i < data.length; i++) {
    if (Number(data[i][0]) === id) {
      sheet.getRange(i + 1, 2, 1, 4).setValues([[p.nombre, p.apellido, p.telefono, p.email || ""]]);
      return { id: id };
    }
  }

  return { error: "Cliente no encontrado" };
}

function eliminarCliente(id) {
  id = Number(id);

  const sheetClientes = getSheet("Clientes");
  const dataClientes = sheetClientes.getDataRange().getValues();

  for (let i = 1; i < dataClientes.length; i++) {
    if (Number(dataClientes[i][0]) === id) {
      sheetClientes.deleteRow(i + 1);
      break;
    }
  }

  // Borra también los vehículos asociados a ese cliente
  const sheetVehiculos = getSheet("Vehiculos");
  const dataVehiculos = sheetVehiculos.getDataRange().getValues();

  for (let i = dataVehiculos.length - 1; i >= 1; i--) {
    if (Number(dataVehiculos[i][1]) === id) {
      sheetVehiculos.deleteRow(i + 1);
    }
  }

  return { ok: true };
}

// ---------- Caja ----------

function agregarMovimiento(p) {
  const sheet = getSheet("Caja");
  const id = nextId(sheet);
  sheet.appendRow([id, new Date(), p.tipo, p.descripcion, parseFloat(p.monto)]);
  return { id: id };
}

function movimientosCaja() {
  const data = getSheet("Caja").getDataRange().getValues();
  const filas = data.slice(1).reverse().slice(0, 15);
  return filas.map(r => ({
    id: r[0], fecha: r[1], tipo: r[2], descripcion: r[3], monto: r[4]
  }));
}

function resumenCaja() {
  const data = getSheet("Caja").getDataRange().getValues().slice(1);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - hoy.getDay());

  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  let totalHoy = 0, totalSemana = 0, totalMes = 0;

  data.forEach(r => {
    const fecha = new Date(r[1]);
    const signo = r[2] === "Ingreso" ? 1 : -1;
    const monto = signo * parseFloat(r[4] || 0);

    if (fecha >= hoy) totalHoy += monto;
    if (fecha >= inicioSemana) totalSemana += monto;
    if (fecha >= inicioMes) totalMes += monto;
  });

  return { hoy: totalHoy, semana: totalSemana, mes: totalMes };
}

// ---------- Stock ----------

function listarStock() {
  const data = getSheet("Stock").getDataRange().getValues().slice(1);
  return data.map(r => ({ id: r[0], nombre: r[1], cantidad: Number(r[2]) || 0 }));
}

function agregarProducto(p) {
  const sheet = getSheet("Stock");
  const id = nextId(sheet);
  sheet.appendRow([id, p.nombre, parseInt(p.cantidad, 10) || 0, new Date()]);
  return { id: id };
}

function ajustarStock(p) {
  const sheet = getSheet("Stock");
  const data = sheet.getDataRange().getValues();
  const id = Number(p.id);
  const delta = Number(p.delta);

  for (let i = 1; i < data.length; i++) {
    if (Number(data[i][0]) === id) {
      const nuevaCantidad = Math.max(0, Number(data[i][2]) + delta);
      sheet.getRange(i + 1, 3).setValue(nuevaCantidad);
      return { id: id, cantidad: nuevaCantidad };
    }
  }

  return { error: "Producto no encontrado" };
}

function obtenerProducto(id) {
  const data = getSheet("Stock").getDataRange().getValues().slice(1);
  const fila = data.find(r => Number(r[0]) === Number(id));

  if (!fila) return { error: "Producto no encontrado" };

  return { id: fila[0], nombre: fila[1], cantidad: Number(fila[2]) || 0 };
}

