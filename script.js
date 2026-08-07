document.addEventListener("DOMContentLoaded", () => {
    const modalExistente = document.getElementById("admin-modal");
    if (modalExistente) modalExistente.style.display = "none";

    const splash = document.getElementById("splash-screen");
    if (splash) {
        setTimeout(() => {
            splash.style.opacity = "0";
            splash.style.visibility = "hidden";
            setTimeout(() => splash.style.display = "none", 500);
        }, 1000);
    }

    const timeEl = document.getElementById("current-time");
    if (timeEl) {
        const now = new Date();
        timeEl.textContent = now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0');
    }

    renderAgenda();
});

// Datos de Agenda Semanal Lunes a Sábado
const agendaSemanal = [
    { dia: "Lunes", slots: [{ hora: "10:00 AM", bloqueado: false }, { hora: "12:00 PM", bloqueado: false }, { hora: "04:00 PM", bloqueado: false }, { hora: "06:00 PM", bloqueado: false }] },
    { dia: "Martes", slots: [{ hora: "11:00 AM", bloqueado: false }, { hora: "01:00 PM", bloqueado: false }, { hora: "04:30 PM", bloqueado: false }, { hora: "06:30 PM", bloqueado: false }] },
    { dia: "Miércoles", slots: [{ hora: "10:00 AM", bloqueado: false }, { hora: "01:30 PM", bloqueado: false }, { hora: "05:00 PM", bloqueado: false }, { hora: "07:00 PM", bloqueado: false }] },
    { dia: "Jueves", slots: [{ hora: "11:00 AM", bloqueado: false }, { hora: "02:00 PM", bloqueado: false }, { hora: "04:30 PM", bloqueado: false }, { hora: "06:00 PM", bloqueado: false }] },
    { dia: "Viernes", slots: [{ hora: "09:30 AM", bloqueado: false }, { hora: "12:00 PM", bloqueado: false }, { hora: "03:30 PM", bloqueado: false }, { hora: "06:00 PM", bloqueado: false }] },
    { dia: "Sábado", slots: [{ hora: "10:00 AM", bloqueado: false }, { hora: "12:30 PM", bloqueado: false }, { hora: "03:00 PM", bloqueado: false }, { hora: "05:00 PM", bloqueado: false }] }
];

let diaSeleccionadoIndex = 0;
let citaSeleccionada = { fecha: "Lunes", hora: "10:00 AM", servicios: "" };
let adminAutenticado = false;
const PIN_ADMIN_CORRECTO = "1234"; // Demo only — ver nota de seguridad en el resumen

function renderAgenda() {
    const container = document.getElementById("dynamic-schedule-container");
    if (!container) return;

    const diaActual = agendaSemanal[diaSeleccionadoIndex];

    let html = `
        <div class="aesthetic-card" style="padding: 20px; margin: 15px 0; background: linear-gradient(145deg, rgba(20, 20, 22, 0.9), rgba(12, 12, 14, 0.95)); border: 1px solid rgba(247, 214, 216, 0.25); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); border-radius: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <span class="card-top-tag" style="background: rgba(247, 214, 216, 0.12); border: 1px solid rgba(247, 214, 216, 0.3); padding: 5px 12px; border-radius: 20px; font-size: 10.5px; font-weight: 700; color: #f7d6d8;">
                    📅 AGENDA SEMANAL VIP
                </span>
                <span style="font-size: 11px; color: rgba(255, 255, 255, 0.45);">Sincronizado 4K</span>
            </div>

            <h4 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 700; color: #fff;">Horarios Exclusivos Atelier</h4>
            <p style="margin: 0 0 16px 0; font-size: 13px; color: rgba(255, 255, 255, 0.65);">Selecciona tu día y espacio para una valoración personalizada:</p>

            <div id="days-scroll-container" style="display: flex; gap: 8px; overflow-x: auto; padding: 2px 2px 12px 2px; margin-bottom: 12px; scrollbar-width: none;">
    `;

    agendaSemanal.forEach((item, idx) => {
        const esActivo = idx === diaSeleccionadoIndex;
        html += `
            <button onclick="cambiarDiaAgenda(${idx})" class="${esActivo ? 'btn-confirm' : ''}" style="
                flex: 0 0 auto;
                padding: 9px 16px;
                border-radius: 14px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.25s ease;
                ${!esActivo ? 'background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); color: rgba(255, 255, 255, 0.75);' : ''}
            ">
                ${item.dia}
            </button>
        `;
    });

    html += `</div><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">`;

    diaActual.slots.forEach(slot => {
        if (slot.bloqueado) {
            html += `
                <button disabled style="
                    width: 100%; padding: 13px 10px; font-size: 13px; font-weight: 600;
                    background: rgba(255, 255, 255, 0.05); border: 1px dashed rgba(255, 255, 255, 0.2);
                    color: rgba(255, 255, 255, 0.3); border-radius: 16px; cursor: not-allowed;
                ">🚫 Ocupado</button>
            `;
        } else {
            html += `
                <button class="btn-confirm" onclick="seleccionarHorario('${diaActual.dia}', '${slot.hora}')" style="
                    width: 100%; padding: 13px 10px; font-size: 14px; font-weight: 700;
                    cursor: pointer; border-radius: 16px;
                ">${slot.hora}</button>
            `;
        }
    });

    html += `</div></div>`;
    container.innerHTML = html;
}

function cambiarDiaAgenda(idx) {
    diaSeleccionadoIndex = idx;
    renderAgenda();
}

function seleccionarHorario(fecha, hora) {
    citaSeleccionada = { fecha, hora, servicios: "" };
    const modal = document.getElementById("booking-modal");
    const subtext = document.getElementById("modal-subtext");
    if (subtext) subtext.textContent = `Cita seleccionada: ${fecha} a las ${hora}`;
    if (modal) modal.style.display = "flex";
}

// Panel Admin
function solicitarPinAdmin() {
    const modal = document.getElementById("admin-modal");
    if (modal) modal.style.display = "flex";
    renderAdminModalContent();
}

function renderAdminModalContent() {
    const modal = document.getElementById("admin-content-area");
    if (!modal) return;

    if (!adminAutenticado) {
        modal.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 40px; margin-bottom: 10px;">🔒</div>
                <p style="margin: 0 0 20px 0; color: rgba(255,255,255,0.6); font-size: 13px;">Ingresa el PIN de acceso:</p>
                <input type="password" id="admin-pin-input" placeholder="••••" maxlength="4" inputmode="numeric" style="
                    width: 100%; padding: 14px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.25);
                    background: rgba(0,0,0,0.6); color: #fff; font-size: 22px; text-align: center;
                    letter-spacing: 8px; margin-bottom: 10px; outline: none; box-sizing: border-box;
                ">
                <p id="admin-pin-error" class="input-error-msg" style="text-align:center;">PIN incorrecto. Inténtalo de nuevo.</p>
                <button class="btn-confirm" onclick="verificarPinAdmin()" style="width:100%; margin-top: 10px;">Entrar</button>
            </div>
        `;
        const inp = document.getElementById("admin-pin-input");
        if (inp) {
            inp.focus();
            inp.addEventListener("keydown", (e) => { if (e.key === "Enter") verificarPinAdmin(); });
        }
    } else {
        const diaActual = agendaSemanal[diaSeleccionadoIndex];
        let slotsHtml = '';

        diaActual.slots.forEach((s, idx) => {
            slotsHtml += `
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 12px 14px; border-radius: 14px; margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.08);">
                    <span style="color: #fff; font-size: 14px; font-weight: 600;">${s.hora}</span>
                    <button onclick="toggleBloqueoSlot(${idx})" style="
                        padding: 7px 14px; border-radius: 10px; border: none; font-size: 11px; font-weight: 700;
                        cursor: pointer; transition: all 0.2s ease;
                        ${s.bloqueado ? 'background: #e74c3c; color: #fff; box-shadow: 0 2px 10px rgba(231,76,60,0.4);' : 'background: #2ecc71; color: #111; box-shadow: 0 2px 10px rgba(46,204,113,0.4);'}
                    ">${s.bloqueado ? 'BLOQUEADO' : 'DISPONIBLE'}</button>
                </div>
            `;
        });

        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <h4 style="margin: 0; color: #fff; font-size: 15px; font-weight: 700;">⚙️ Gestión de Espacios</h4>
                <span style="font-size: 11px; background: rgba(46, 204, 113, 0.2); color: #2ecc71; padding: 4px 10px; border-radius: 10px; font-weight:700;">ADMIN ACTIVO</span>
            </div>
            <p style="color: rgba(255,255,255,0.6); font-size: 13px; margin-bottom: 14px;">Administra los horarios para el día: <b style="color: #f7d6d8;">${diaActual.dia}</b></p>
            <div style="max-height: 250px; overflow-y: auto; padding-right: 4px; margin-bottom: 16px;">${slotsHtml}</div>
            <button class="btn-cancel" style="width:100%;" onclick="cerrarSesionAdmin()">Cerrar sesión de administrador</button>
        `;
    }
}

function verificarPinAdmin() {
    const input = document.getElementById("admin-pin-input");
    const errorMsg = document.getElementById("admin-pin-error");
    if (input && input.value === PIN_ADMIN_CORRECTO) {
        adminAutenticado = true;
        renderAdminModalContent();
    } else {
        if (errorMsg) errorMsg.classList.add("visible");
        if (input) { input.value = ""; input.focus(); }
    }
}

function cerrarSesionAdmin() {
    adminAutenticado = false;
    renderAdminModalContent();
}

function toggleBloqueoSlot(slotIndex) {
    agendaSemanal[diaSeleccionadoIndex].slots[slotIndex].bloqueado = !agendaSemanal[diaSeleccionadoIndex].slots[slotIndex].bloqueado;
    renderAgenda();
    renderAdminModalContent();
}

function cerrarAdminModal() {
    const modal = document.getElementById("admin-modal");
    if (modal) modal.style.display = "none";
}

// Navegación de Pestañas
function cambiarTab(tabId, event) {
    document.querySelectorAll(".tab-item, .tab-content").forEach(el => el.classList.remove("active"));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add("active");
    }
    const target = document.getElementById("tab-" + tabId);
    if (target) target.classList.add("active");
}

// Cambiar Tema
function ciclarTema() {
    const themes = ["rosegold", "gold", "platinum"];
    const current = document.documentElement.getAttribute("data-theme") || "rosegold";
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    document.documentElement.setAttribute("data-theme", next);
}

// Cotizador
function calcularCotizacion() {
    let total = 0;
    let nombres = [];
    document.querySelectorAll('.cotizador-options input[type="checkbox"]:checked').forEach(chk => {
        total += parseInt(chk.value, 10);
        nombres.push(chk.dataset.name);
    });
    const totalEl = document.getElementById("cotizacion-total");
    if (totalEl) totalEl.textContent = `$${total.toLocaleString()} MXN`;

    const btn = document.getElementById("btn-cotizar");
    if (btn) btn.disabled = nombres.length === 0;

    calcularCotizacion.seleccion = nombres;
}
calcularCotizacion.seleccion = [];

function pasarCotizacionAgenda() {
    const servicios = calcularCotizacion.seleccion.join(", ");
    citaSeleccionada = { fecha: "Cotizador VIP", hora: "Protocolo Personalizado", servicios };
    const modal = document.getElementById("booking-modal");
    const subtext = document.getElementById("modal-subtext");
    if (modal && subtext) {
        subtext.textContent = servicios
            ? `Reserva del Cotizador VIP: ${servicios}`
            : "Reserva basada en tu selección del Cotizador VIP";
        modal.style.display = "flex";
    }
}

function cerrarModal() {
    const modal = document.getElementById("booking-modal");
    if (modal) modal.style.display = "none";
    const err = document.getElementById("nombre-error");
    if (err) err.classList.remove("visible");
    const input = document.getElementById("input-nombre");
    if (input) input.classList.remove("input-error");
}

// Before & After
let isAfterView = true;
function toggleBeforeAfter() {
    const badge = document.getElementById("ba-badge-label");
    const art = document.getElementById("ba-art");
    if (!badge || !art) return;
    isAfterView = !isAfterView;
    if (!isAfterView) {
        badge.textContent = "ESTADO INICIAL (BEFORE)";
        badge.className = "ba-badge before";
        art.textContent = "🦷 Antes del Tratamiento";
        art.style.background = "#444";
    } else {
        badge.textContent = "RESULTADO FINAL (AFTER)";
        badge.className = "ba-badge after";
        art.textContent = "✨ Sonrisa Armonizada 4K";
        art.style.background = "linear-gradient(45deg, #e6c5c8, #d4a3a6)";
    }
}

// Generar Pase VIP
function generarPaseVIP() {
    const nombreInput = document.getElementById("input-nombre");
    const errorMsg = document.getElementById("nombre-error");
    const nombre = nombreInput ? nombreInput.value.trim() : "";

    if (!nombre) {
        if (errorMsg) errorMsg.classList.add("visible");
        if (nombreInput) nombreInput.classList.add("input-error");
        return;
    }

    cerrarModal();

    const nombrePass = document.getElementById("pass-nombre-cliente");
    const fechaPass = document.getElementById("pass-fecha");
    const horaPass = document.getElementById("pass-hora");
    const serviciosPass = document.getElementById("pass-servicios");
    const qrImg = document.getElementById("qr-code-img");

    if (nombrePass) nombrePass.textContent = nombre;
    if (fechaPass) fechaPass.textContent = citaSeleccionada.fecha;
    if (horaPass) horaPass.textContent = citaSeleccionada.hora;
    if (serviciosPass) {
        if (citaSeleccionada.servicios) {
            serviciosPass.textContent = `Tratamientos: ${citaSeleccionada.servicios}`;
            serviciosPass.classList.add("visible");
        } else {
            serviciosPass.classList.remove("visible");
        }
    }
    if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VIP-${encodeURIComponent(nombre)}-${encodeURIComponent(citaSeleccionada.fecha)}`;
    }

    const passScreen = document.getElementById("vip-pass-screen");
    if (passScreen) passScreen.style.display = "flex";

    if (nombreInput) nombreInput.value = "";
}

function cerrarPase() {
    const passScreen = document.getElementById("vip-pass-screen");
    if (passScreen) passScreen.style.display = "none";
}

// Descarga .ics
function descargarICS() {
    const nombre = document.getElementById("pass-nombre-cliente")?.textContent || "Invitado VIP";
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Cita VIP - Dra. Daniela Muñoz\nDESCRIPTION:Valoración para ${nombre}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'cita-dra-daniela-munoz.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
}

// Envío WhatsApp
function enviarPaseWhatsApp() {
    const nombre = document.getElementById("pass-nombre-cliente")?.textContent || "Cliente VIP";
    const fecha = document.getElementById("pass-fecha")?.textContent || citaSeleccionada.fecha;
    const hora = document.getElementById("pass-hora")?.textContent || citaSeleccionada.hora;
    const servicios = citaSeleccionada.servicios ? `\nTratamientos: ${citaSeleccionada.servicios}` : "";

    const texto = `Hola Dra. Daniela, mi pase VIP para el Atelier está confirmado. 💎\n\nNombre: ${nombre}\nFecha: ${fecha}\nHorario: ${hora}${servicios}\n\n¡Nos vemos en el Studio!`;
    const telefono = "525656691886";
    const waUrl = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(texto)}`;

    window.open(waUrl, "_blank");
}
