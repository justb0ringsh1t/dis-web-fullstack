$(() => {
  const obtenerDatos = form => {
    const datos = {};

    for (const { id, type } of form) {
      if (type === 'button' || type === 'submit' || type === 'reset') continue;

      if (type === 'file') {
        const files = Object.values($(`#${id}`).prop('files'));
        datos[`${id}`] = files.map(file => file.name) ?? [];
        continue;
      }

      datos[`${id}`] = $(`#${id}`).val();
    }

    return datos;
  };

  const limpiarDatos = form => {
    for (const { id, type } of form) {
      $(`#${id}`).val('');
    }
  };

  $('#form').on('submit', e => {
    e.preventDefault();

    const { target } = e;

    const empleado = new Empleado(obtenerDatos(target));
    if (!empleado) return;

    $('#tabla').append(empleado.render());

    // limpiarDatos(target);
  });

  $('#form').on('reset', e => {
    e.preventDefault();

    const { target } = e;

    limpiarDatos(target);
  });

  function Empleado({ foto, nombre, apellido, entrada, salida }) {
    this.foto = foto[0];
    this.nombre = nombre;
    this.apellido = apellido;
    this.entrada = new Date(entrada);
    this.salida = new Date(salida);

    this.calcularTotal = function () {
      const { salida, entrada } = this;

      const diferenciaDias = (salida.getDate() - entrada.getDate()) * 24 * 60;
      const diferenciaHoras = (salida.getHours() - entrada.getHours()) * 60;
      const diferenciaMinutos = salida.getMinutes() - entrada.getMinutes();

      const diferenciaTotal =
        diferenciaDias + diferenciaHoras + diferenciaMinutos;

      const minutos = diferenciaTotal % 60;
      const horas = Math.floor(diferenciaTotal / 60);
      const dias = Math.floor(horas / 24);

      const displayEn2Digitos = valor => (valor < 9 ? `0${valor}` : `${valor}`);

      const minutosFormateados = displayEn2Digitos(minutos);
      const horasFormateadas = displayEn2Digitos(horas - dias * 24);
      const diasFormateados = displayEn2Digitos(dias);

      return `${diasFormateados}d ${horasFormateadas}h ${minutosFormateados}m`;
    };

    this.total = this.calcularTotal();

    this.formatearFecha = function (fechaSinFormato) {
      const displayEn2Digitos = valor => (valor < 9 ? `0${valor}` : `${valor}`);

      const dia = displayEn2Digitos(fechaSinFormato.getDate());
      const mes = displayEn2Digitos(fechaSinFormato.getMonth());
      const anio = displayEn2Digitos(fechaSinFormato.getFullYear());

      const horas = displayEn2Digitos(fechaSinFormato.getHours());
      const minutos = displayEn2Digitos(fechaSinFormato.getMinutes());

      const fecha = `${dia}/${mes}/${anio}`;
      const hora = `${horas}:${minutos}`;

      return `${fecha} ${hora}`;
    };

    this.render = function () {
      const { foto, nombre, apellido, entrada, salida, total } = this;
      const { formatearFecha } = this;

      return `
        <tr>
          <td class="imagen-funcionario">
            <img src="./img/${foto}" alt="Foto de perfil de ${nombre} ${apellido}"/>
          </td>
          <td>${nombre}</td>
          <td>${apellido}</td>
          <td class="hidden md:table-cell">${formatearFecha(entrada)}</td>
          <td class="hidden md:table-cell">${formatearFecha(salida)}</td>
          <td>${total}</td>
        </tr>
      `;
    };
  }
});
