
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registroLink = document.querySelector('.registro-link');
const botonesLogin = document.querySelectorAll('.btlogin');
const iconClose = document.querySelector('.icono-close');

const panelPrivado = document.querySelector('#panel-privado');
const inicioPublico = document.querySelector('.inicio-publico');
const headerPublico = document.querySelector('.header-publico');

const formLogin = document.querySelector('#form-login');
const formRegistro = document.querySelector('#form-registro');

const contenidoVista = document.querySelector('#contenido-vista');
const tituloVista = document.querySelector('#titulo-vista');
const nombreUsuario = document.querySelector('#nombre-usuario');
const avatarUsuario = document.querySelector('#avatar-usuario');
const listaRutaPublica = document.querySelector('#lista-ruta-publica');

const PRECIO_VIAJE = 5;

let usuarioActual = null;

// ======================================
// RUTAS DISPONIBLES
// Puedes modificar los nombres y paradas
// ======================================

const RUTAS = {
    centro: {
        nombre: 'Ruta Centro',
        paradas: [
            'Terminal Central',
            'Mercado Municipal',
            'Parque Central',
            'Hospital General',
            'Universidad'
        ]
    },

    norte: {
        nombre: 'Ruta Norte',
        paradas: [
            'Terminal Norte',
            'Colonia Las Flores',
            'Centro Comercial',
            'Zona Industrial',
            'Universidad'
        ]
    },

    sur: {
        nombre: 'Ruta Sur',
        paradas: [
            'Terminal Sur',
            'Colonia El Carmen',
            'Mercado Sur',
            'Hospital Regional',
            'Parque Central'
        ]
    }
};

// ======================================
// FUNCIONES DE USUARIOS
// ======================================

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('busUrbanoUsuarios') || '[]');
}

function guardarUsuarios(usuarios) {
    localStorage.setItem('busUrbanoUsuarios', JSON.stringify(usuarios));
}

function guardarSesion(usuario) {
    localStorage.setItem('busUrbanoSesion', usuario.correo);
    usuarioActual = usuario;
    mostrarPanel();
}

function actualizarUsuario() {
    const usuarios = obtenerUsuarios();

    const indice = usuarios.findIndex(
        usuario => usuario.id === usuarioActual.id
    );

    if (indice >= 0) {
        usuarios[indice] = usuarioActual;
        guardarUsuarios(usuarios);
    }
}

function mostrarMensaje(id, texto, correcto = false) {
    const elemento = document.querySelector(id);

    if (elemento) {
        elemento.textContent = texto;
        elemento.style.color = correcto ? '#18794e' : '#b54735';
    }
}

// ======================================
// MOSTRAR RUTA PÚBLICA
// ======================================

function crearRutaPublica() {
    const ruta = RUTAS.centro;

    listaRutaPublica.innerHTML = ruta.paradas.map((parada, indice) => `
        <div class="parada">
            <div class="punto"></div>
            <div>
                <strong>${parada}</strong>
                <small>Parada ${indice + 1}</small>
            </div>
        </div>
    `).join('');
}

crearRutaPublica();

// ======================================
// LOGIN Y REGISTRO
// ======================================

botonesLogin.forEach(boton => {
    boton.addEventListener('click', () => {
        wrapper.classList.remove('active');
        wrapper.classList.add('active-po');

        mostrarMensaje('#mensaje-login', '');
    });
});

registroLink.addEventListener('click', evento => {
    evento.preventDefault();

    wrapper.classList.add('active');

    mostrarMensaje('#mensaje-registro', '');
});

loginLink.addEventListener('click', evento => {
    evento.preventDefault();

    wrapper.classList.remove('active');

    mostrarMensaje('#mensaje-login', '');
});

function cerrarModal() {
    wrapper.classList.remove('active-po', 'active');
}

iconClose.addEventListener('click', cerrarModal);

iconClose.addEventListener('keydown', evento => {
    if (evento.key === 'Enter' || evento.key === ' ') {
        cerrarModal();
    }
});

// REGISTRAR USUARIO

formRegistro.addEventListener('submit', evento => {
    evento.preventDefault();

    const nombre = document.querySelector('#registro-nombre').value.trim();

    const correo = document.querySelector('#registro-correo')
        .value.trim().toLowerCase();

    const password = document.querySelector('#registro-password').value;

    const usuarios = obtenerUsuarios();

    if (usuarios.some(usuario => usuario.correo === correo)) {
        mostrarMensaje(
            '#mensaje-registro',
            'Ese correo ya tiene una cuenta. Inicia sesión.'
        );

        return;
    }

    const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre,
        correo: correo,
        password: password,
        tarjeta: null,
        historial: []
    };

    usuarios.push(nuevoUsuario);

    guardarUsuarios(usuarios);

    formRegistro.reset();

    cerrarModal();

    guardarSesion(nuevoUsuario);
});

// INICIAR SESIÓN

formLogin.addEventListener('submit', evento => {
    evento.preventDefault();

    const correo = document.querySelector('#login-correo')
        .value.trim().toLowerCase();

    const password = document.querySelector('#login-password').value;

    const usuario = obtenerUsuarios().find(item =>
        item.correo === correo && item.password === password
    );

    if (!usuario) {
        mostrarMensaje(
            '#mensaje-login',
            'Correo o contraseña incorrectos. Verifica tus datos.'
        );

        return;
    }

    formLogin.reset();

    cerrarModal();

    guardarSesion(usuario);
});

// ======================================
// MOSTRAR PANEL PRIVADO
// ======================================

function mostrarPanel() {
    inicioPublico.classList.add('oculto');
    headerPublico.classList.add('oculto');

    wrapper.classList.remove('active-po', 'active');

    panelPrivado.classList.remove('oculto');

    nombreUsuario.textContent = usuarioActual.nombre;

    avatarUsuario.textContent =
        usuarioActual.nombre.charAt(0).toUpperCase();

    mostrarVista('resumen');
}

// ======================================
// FUNCIONES PARA LAS RUTAS
// ======================================

function opcionesRutas(rutaSeleccionada = 'centro') {
    return Object.keys(RUTAS).map(clave => `
        <option value="${clave}"
            ${clave === rutaSeleccionada ? 'selected' : ''}>
            ${RUTAS[clave].nombre}
        </option>
    `).join('');
}

function opcionesParadas(ruta, paradaSeleccionada = '') {
    return RUTAS[ruta].paradas.map(parada => `
        <option value="${parada}"
            ${parada === paradaSeleccionada ? 'selected' : ''}>
            ${parada}
        </option>
    `).join('');
}

function mostrarParadas(ruta) {
    return RUTAS[ruta].paradas.map((parada, indice) => `
        <div class="parada">
            <div class="punto"></div>
            <div>
                <strong>${parada}</strong>
                <small>Parada ${indice + 1}</small>
            </div>
        </div>
    `).join('');
}

// ======================================
// CAMBIAR VISTAS DEL PANEL
// ======================================

function mostrarVista(vista) {

    document.querySelectorAll('.opcion-menu[data-vista]').forEach(boton => {
        boton.classList.toggle(
            'seleccionada',
            boton.dataset.vista === vista
        );
    });

    const titulos = {
        resumen: 'Resumen',
        saldo: 'Mi saldo',
        recargar: 'Cargar tarjeta',
        comprar: 'Comprar tarjeta',
        rutas: 'Rutas del bus',
        historial: 'Historial de viajes'
    };

    tituloVista.textContent = titulos[vista];

    // ==================================
    // RESUMEN
    // ==================================

    if (vista === 'resumen') {

        contenidoVista.innerHTML = `
            <section class="bienvenida-panel">
                <span class="etiqueta">TU ESPACIO PERSONAL</span>

                <h2>¡Hola, ${escapar(usuarioActual.nombre)}!</h2>

                <p>
                    Administra tu tarjeta y consulta tus viajes desde aquí.
                </p>
            </section>

            <div class="tarjetas-resumen">

                <article class="dato-card">
                    <small>Saldo disponible</small>
                    <strong>
                        ${formatoQ(usuarioActual.tarjeta ? usuarioActual.tarjeta.saldo : 0)}
                    </strong>
                </article>

                <article class="dato-card">
                    <small>Estado de tarjeta</small>
                    <strong style="font-size:1.25rem">
                        ${usuarioActual.tarjeta ? 'Activa' : 'Sin tarjeta'}
                    </strong>
                </article>

                <article class="dato-card">
                    <small>Viajes registrados</small>
                    <strong>${usuarioActual.historial.length}</strong>
                </article>

            </div>

            <section class="panel-card">

                <h3>Registrar ingreso al bus</h3>

                <p class="texto-ayuda">
                    Selecciona la ruta y la parada donde abordarás.
                    El ingreso tiene una tarifa de Q5.00.
                </p>

                <div class="selector-ruta">
                    <label for="ruta-ingreso">Seleccionar ruta</label>

                    <select id="ruta-ingreso">
                        ${opcionesRutas()}
                    </select>
                </div>

                <div class="parada-seleccionada">
                    <label for="parada-ingreso">
                        Seleccionar parada de abordaje
                    </label>

                    <select id="parada-ingreso">
                        ${opcionesParadas('centro')}
                    </select>
                </div>

                <button id="registrar-ingreso" class="btn" type="button">
                    Pagar ingreso · Q5.00
                </button>

                <p id="mensaje-ingreso" class="mensaje"></p>

            </section>

            <section class="panel-card">
                <h3>Acceso rápido</h3>

                <p class="texto-ayuda">
                    Utiliza el menú lateral para consultar tu saldo,
                    cargar tu tarjeta, comprar una tarjeta o revisar
                    tu historial de viajes.
                </p>
            </section>
        `;

        // CAMBIAR LAS PARADAS CUANDO CAMBIE LA RUTA

        const selectorRuta = document.querySelector('#ruta-ingreso');
        const selectorParada = document.querySelector('#parada-ingreso');

        selectorRuta.addEventListener('change', () => {
            selectorParada.innerHTML = opcionesParadas(selectorRuta.value);
        });

        // REGISTRAR INGRESO Y DESCONTAR Q5

        const botonIngreso = document.querySelector('#registrar-ingreso');

        botonIngreso.addEventListener('click', () => {

            const mensaje = document.querySelector('#mensaje-ingreso');

            if (!usuarioActual.tarjeta) {
                mensaje.textContent = 'Primero debes comprar una tarjeta.';
                return;
            }

            if (usuarioActual.tarjeta.saldo < PRECIO_VIAJE) {
                mensaje.textContent = 'Saldo insuficiente. Recarga tu tarjeta para viajar.';
                return;
            }

            const rutaElegida = selectorRuta.value;
            const paradaElegida = selectorParada.value;

            usuarioActual.tarjeta.saldo = Number(
                (usuarioActual.tarjeta.saldo - PRECIO_VIAJE).toFixed(2)
            );

            usuarioActual.historial.unshift({
                fecha: new Date().toLocaleString('es-GT'),
                ruta: RUTAS[rutaElegida].nombre,
                parada: paradaElegida
            });

            actualizarUsuario();

            mostrarVista('resumen');

            const mensajeNuevo = document.querySelector('#mensaje-ingreso');

            mensajeNuevo.textContent =
                `Ingreso registrado en ${paradaElegida}, ${RUTAS[rutaElegida].nombre}. Se descontaron Q5.00.`;

            mensajeNuevo.style.color = '#18794e';
        });
    }

    // ==================================
    // MI SALDO
    // ==================================

    else if (vista === 'saldo') {

        contenidoVista.innerHTML = `
            <section class="panel-card">

                <h3>Saldo de mi tarjeta</h3>

                ${usuarioActual.tarjeta ? `

                    <p class="texto-ayuda">
                        Este es el saldo disponible de tu tarjeta
                        ${escapar(usuarioActual.tarjeta.numero)}.
                    </p>

                    <div class="saldo-grande">
                        ${formatoQ(usuarioActual.tarjeta.saldo)}
                    </div>

                ` : `

                    <div class="estado-vacio">
                        Todavía no tienes una tarjeta asociada a tu cuenta.
                        Entra en «Comprar tarjeta» para adquirir una.
                    </div>

                `}

            </section>
        `;
    }

    // ==================================
    // CARGAR TARJETA
    // ==================================

    else if (vista === 'recargar') {

        contenidoVista.innerHTML = `
            <section class="panel-card formulario-panel">

                <h3>Cargar tarjeta</h3>

                ${usuarioActual.tarjeta ? `

                    <p class="texto-ayuda">
                        Tarjeta:
                        <strong>${escapar(usuarioActual.tarjeta.numero)}</strong>
                        · Saldo actual:
                        <strong>${formatoQ(usuarioActual.tarjeta.saldo)}</strong>
                    </p>

                    <form id="form-recarga">

                        <label for="monto-recarga">
                            Monto a recargar (Q)
                        </label>

                        <input
                            id="monto-recarga"
                            type="number"
                            min="1"
                            max="5000"
                            step="0.01"
                            placeholder="Ej. 50.00"
                            required
                        >

                        <button class="btn" type="submit">
                            Confirmar recarga
                        </button>

                        <p id="mensaje-recarga" class="mensaje"></p>

                    </form>

                ` : `

                    <div class="estado-vacio">
                        Necesitas comprar una tarjeta antes de realizar una recarga.
                    </div>

                `}

            </section>
        `;

        const form = document.querySelector('#form-recarga');

        if (form) {

            form.addEventListener('submit', evento => {

                evento.preventDefault();

                const monto = Number(
                    document.querySelector('#monto-recarga').value
                );

                if (!Number.isFinite(monto) || monto <= 0 || monto > 5000) {

                    document.querySelector('#mensaje-recarga').textContent =
                        'Ingresa un monto mayor que Q0 y no superior a Q5,000.';

                    return;
                }

                usuarioActual.tarjeta.saldo = Number(
                    (usuarioActual.tarjeta.saldo + monto).toFixed(2)
                );

                actualizarUsuario();

                mostrarVista('recargar');

                const mensaje = document.createElement('p');

                mensaje.className = 'aviso';

                mensaje.textContent =
                    `¡Recarga realizada! Tu nuevo saldo es ${formatoQ(usuarioActual.tarjeta.saldo)}.`;

                contenidoVista.querySelector('.panel-card').appendChild(mensaje);
            });
        }
    }

    // ==================================
    // COMPRAR TARJETA
    // ==================================

    else if (vista === 'comprar') {

        contenidoVista.innerHTML = `
            <section class="panel-card formulario-panel">

                <h3>Comprar tarjeta</h3>

                ${usuarioActual.tarjeta ? `

                    <p class="texto-ayuda">
                        Ya tienes una tarjeta asociada a tu cuenta.
                    </p>

                    <div class="saldo-grande" style="font-size:1.5rem">
                        ${escapar(usuarioActual.tarjeta.numero)}
                    </div>

                    <p class="texto-ayuda">
                        Saldo actual:
                        ${formatoQ(usuarioActual.tarjeta.saldo)}
                    </p>

                ` : `

                    <p class="texto-ayuda">
                        Adquiere tu tarjeta personal para comenzar a viajar.
                        La tarjeta se asociará automáticamente a tu cuenta
                        y tendrá saldo inicial de Q0.00.
                    </p>

                    <button id="btn-comprar-tarjeta" class="btn" type="button">
                        Comprar tarjeta
                    </button>

                    <p id="mensaje-compra" class="mensaje"></p>

                `}

            </section>
        `;

        const boton = document.querySelector('#btn-comprar-tarjeta');

        if (boton) {

            boton.addEventListener('click', () => {

                usuarioActual.tarjeta = {
                    numero: 'BU-' + String(Date.now()).slice(-6),
                    saldo: 0
                };

                actualizarUsuario();

                mostrarVista('comprar');
            });
        }
    }

    // ==================================
    // RUTAS DEL BUS
    // ==================================

    else if (vista === 'rutas') {

        contenidoVista.innerHTML = `
            <section class="panel-card">

                <h3>Rutas disponibles</h3>

                <p class="texto-ayuda">
                    Selecciona el recorrido que deseas consultar.
                    Cada ruta cuenta con sus propias paradas.
                </p>

                <div class="selector-ruta">

                    <label for="selector-ruta-panel">
                        Elegir recorrido
                    </label>

                    <select id="selector-ruta-panel">
                        ${opcionesRutas()}
                    </select>

                </div>

                <div id="paradas-ruta-panel" class="ruta-panel">
                    ${mostrarParadas('centro')}
                </div>

                <p class="aviso">
                    Tarifa por ingreso al bus: Q5.00.
                </p>

            </section>
        `;

        const selector = document.querySelector('#selector-ruta-panel');

        const contenedorParadas = document.querySelector('#paradas-ruta-panel');

        selector.addEventListener('change', () => {

            const rutaSeleccionada = selector.value;

            contenedorParadas.innerHTML =
                mostrarParadas(rutaSeleccionada);
        });
    }

    // ==================================
    // HISTORIAL
    // ==================================

    else if (vista === 'historial') {

        const filas = usuarioActual.historial.map(viaje => `
            <tr>
                <td>${escapar(viaje.fecha)}</td>
                <td>${escapar(viaje.ruta || 'Ruta Centro')}</td>
                <td>${escapar(viaje.parada)}</td>
                <td>-${formatoQ(PRECIO_VIAJE)}</td>
            </tr>
        `).join('');

        contenidoVista.innerHTML = `
            <section class="panel-card">

                <h3>Mis viajes</h3>

                ${usuarioActual.historial.length ? `

                    <table class="tabla-historial">

                        <thead>
                            <tr>
                                <th>Fecha y hora</th>
                                <th>Ruta</th>
                                <th>Parada</th>
                                <th>Cobro</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${filas}
                        </tbody>

                    </table>

                ` : `

                    <div class="estado-vacio">
                        Todavía no tienes viajes registrados.
                    </div>

                `}

            </section>
        `;
    }
}

// ======================================
// NAVEGACIÓN DEL MENÚ
// ======================================

document.querySelectorAll('.opcion-menu[data-vista]').forEach(boton => {

    boton.addEventListener('click', () => {

        mostrarVista(boton.dataset.vista);

    });

});

// ======================================
// CERRAR SESIÓN
// ======================================

document.querySelector('#cerrar-sesion').addEventListener('click', () => {

    localStorage.removeItem('busUrbanoSesion');

    usuarioActual = null;

    panelPrivado.classList.add('oculto');

    inicioPublico.classList.remove('oculto');

    headerPublico.classList.remove('oculto');

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

});

// ======================================
// FUNCIONES GENERALES
// ======================================

function formatoQ(valor) {

    return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: 'GTQ'
    }).format(valor);

}

function escapar(valor) {

    return String(valor).replace(/[&<>"']/g, caracter => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[caracter]));

}

// ======================================
// RECUPERAR SESIÓN GUARDADA
// ======================================

const correoSesion = localStorage.getItem('busUrbanoSesion');

if (correoSesion) {

    const usuarioGuardado = obtenerUsuarios().find(
        usuario => usuario.correo === correoSesion
    );

    if (usuarioGuardado) {

        guardarSesion(usuarioGuardado);

    } else {

        localStorage.removeItem('busUrbanoSesion');

    }
}


// ======================================
// PANEL DE ADMINISTRADOR
// ======================================

const botonAdministrador = document.querySelector('#btn-administrador');

let panelAdministrador = null;

// CREDENCIALES DEL ADMINISTRADOR
const ADMIN_USUARIO = 'admin';
const ADMIN_PASSWORD = '2026';

// ABRIR ACCESO DE ADMINISTRADOR
botonAdministrador.addEventListener('click', () => {

    const usuario = prompt('Ingrese el usuario del administrador:');

    if (usuario === null) return;

    const password = prompt('Ingrese la contraseña:');

    if (password === null) return;

    if (usuario === ADMIN_USUARIO && password === ADMIN_PASSWORD) {

        mostrarPanelAdministrador();

    } else {

        alert('Usuario o contraseña incorrectos.');

    }

});

// CREAR Y MOSTRAR EL PANEL
function mostrarPanelAdministrador() {

    inicioPublico.classList.add('oculto');
    headerPublico.classList.add('oculto');
    panelPrivado.classList.add('oculto');

    wrapper.classList.remove('active-po', 'active');

    if (!panelAdministrador) {

        panelAdministrador = document.createElement('section');

        panelAdministrador.id = 'panel-administrador';
        panelAdministrador.className = 'panel-administrador';

        document.body.appendChild(panelAdministrador);

    }

    panelAdministrador.classList.remove('oculto');

    actualizarDatosAdministrador();

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

}

// CONSULTAR Y MOSTRAR LOS DATOS
function actualizarDatosAdministrador() {

    const usuarios = obtenerUsuarios();

    // TOTAL DE TARJETAS REGISTRADAS
    const totalTarjetas = usuarios.filter(
        usuario => usuario.tarjeta !== null
    ).length;

    // TOTAL DE INGRESOS AL BUS
    const totalIngresos = usuarios.reduce(
        (total, usuario) => total + (usuario.historial || []).length,
        0
    );

    // SUMAR EL SALDO DE TODAS LAS TARJETAS
    const saldoTotal = usuarios.reduce(
        (total, usuario) => {

            if (usuario.tarjeta) {
                return total + Number(usuario.tarjeta.saldo || 0);
            }

            return total;

        },
        0
    );

    // GENERAR FILAS DE USUARIOS
    const filas = usuarios.map(usuario => {

        const tarjeta = usuario.tarjeta;

        const numeroTarjeta = tarjeta
            ? escapar(tarjeta.numero)
            : 'Sin tarjeta';

        const saldo = tarjeta
            ? formatoQ(tarjeta.saldo)
            : formatoQ(0);

        const viajes = (usuario.historial || []).length;

        return `
            <tr>
                <td>${escapar(usuario.nombre)}</td>

                <td>${escapar(usuario.correo)}</td>

                <td>
                    ${numeroTarjeta}
                </td>

                <td>
                    ${saldo}
                </td>

                <td>
                    ${viajes}
                </td>
            </tr>
        `;

    }).join('');

    // CONTENIDO DEL PANEL
    panelAdministrador.innerHTML = `

        <header class="admin-encabezado">

            <div>

                <span class="etiqueta">BUSURBANO</span>

                <h1>Panel de administrador</h1>

                <p class="admin-subtitulo">
                    Control general de tarjetas y operaciones del sistema.
                </p>

            </div>

            <button
                id="admin-cerrar"
                class="admin-boton-salir"
                type="button"
            >
                Cerrar administrador
            </button>

        </header>


        <button
            id="admin-actualizar"
            class="admin-actualizar"
            type="button"
        >
            ↻ Actualizar información
        </button>


        <section class="admin-estadisticas">

            <article class="admin-estadistica">

                <small>Tarjetas registradas</small>

                <strong>${totalTarjetas}</strong>

            </article>


            <article class="admin-estadistica">

                <small>Ingresos al bus</small>

                <strong>${totalIngresos}</strong>

            </article>


            <article class="admin-estadistica">

                <small>Saldo total disponible</small>

                <strong>${formatoQ(saldoTotal)}</strong>

            </article>

        </section>


        <section class="admin-tabla-contenedor">

            <h2>Tarjetas y usuarios registrados</h2>

            ${usuarios.length > 0 ? `

                <table class="admin-tabla">

                    <thead>

                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Número de tarjeta</th>
                            <th>Saldo</th>
                            <th>Ingresos</th>
                        </tr>

                    </thead>

                    <tbody>

                        ${filas}

                    </tbody>

                </table>

            ` : `

                <div class="estado-vacio">
                    Todavía no existen usuarios registrados.
                </div>

            `}

        </section>

    `;

    // BOTÓN PARA ACTUALIZAR
    document.querySelector('#admin-actualizar')
        .addEventListener('click', actualizarDatosAdministrador);

    // BOTÓN PARA CERRAR ADMINISTRADOR
    document.querySelector('#admin-cerrar')
        .addEventListener('click', cerrarPanelAdministrador);

}

// CERRAR PANEL DE ADMINISTRADOR
function cerrarPanelAdministrador() {

    panelAdministrador.classList.add('oculto');

    inicioPublico.classList.remove('oculto');
    headerPublico.classList.remove('oculto');

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

}

