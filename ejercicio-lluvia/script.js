$(() => {
  $('#finalizar').attr('disabled', '');

  const $dias = $('#dias');
  const $resultado = $('#resultado');
  const $error = $('#error');

  const obtenerDatos = form => {
    const datos = {};
    for (const { type, id, value } of form) {
      if (type !== 'number') continue;
      datos[`${id}`] = Number(value);
    }
    return datos;
  };

  const limpiarDatos = form => {
    for (const input of form) input.value = '';
  };

  const dias = [];
  const mes = 9;

  $('#form').on('submit', e => {
    e.preventDefault();

    $error.html('');

    const datos = obtenerDatos(e.target);
    const { fecha } = datos;

    limpiarDatos(e.target);

    if (dias.find(dia => dia.fecha === fecha))
      return $error.html(`El dia ${fecha} ya fue ingresado.`);

    dias.push(datos);

    $dias.html(
      dias
        .map(dia => {
          const { fecha } = dia;

          return `
            <li class="dia" data-fecha="${fecha}">
              <span class="dia__fecha">${fecha}</span>
              <span class="dia__boton">X</span>
            </li>`;
        })
        .join('')
    );

    $('.dia').on('click', e => {
      const { target } = e;
      const { nodeName, parentNode } = target;

      const li = nodeName !== 'LI' ? parentNode : target;
      const fecha = li.getAttribute('data-fecha');
      const diasFiltrados = dias.filter(dia => dia.fecha !== Number(fecha));

      console.log(diasFiltrados);
    });

    if (dias.length > 0) $('#finalizar').removeAttr('disabled');
  });

  $('#finalizar').on('click', () => {
    //#region total
    const totalDias = dias.filter(dia => dia.acumulacion > 0).length;
    $resultado.html(
      totalDias
        ? `<p class="total">Llovio un total de ${totalDias} dia/s.</p>`
        : `<p class="total">No llovio ningun dia.</p>`
    );
    //#endregion

    if (!totalDias) return;

    //#region mayor
    const mayorAcumulacion = Math.max(...dias.map(dia => dia.acumulacion));
    const listaDiasMasLluviosos = dias
      .filter(dia => dia.acumulacion === mayorAcumulacion)
      .map(dia => {
        const { fecha, acumulacion } = dia;
        const mensaje = `El ${fecha}/${mes} llovio ${acumulacion}mm/h.`;
        return `<li>${mensaje}</li>`;
      })
      .join('');
    $resultado.append(`
      <p>Dias con mayor acumulacion:</p>
      <ul class="mas-lluviosos">${listaDiasMasLluviosos}</ul>
    `);
    //#endregion

    //#region menor
    const menorAcumulacion = Math.min(...dias.map(dia => dia.acumulacion));
    const listaDiasMenosLluviosos = dias
      .filter(dia => dia.acumulacion === menorAcumulacion)
      .map(dia => {
        const { fecha, acumulacion } = dia;
        const mensaje = `El ${fecha}/${mes} llovio ${acumulacion}mm/h.`;
        return `<li>${mensaje}</li>`;
      })
      .join('');
    $resultado.append(`
      <p>Dias con menor acumulacion:</p>
      <ul class="menos-lluviosos">${listaDiasMenosLluviosos}</ul>
    `);
    //#endregion

    //#region dias
    const listaDias = dias
      .filter(dia => dia.acumulacion > 0)
      .map(dia => {
        const { fecha, acumulacion } = dia;
        const mensaje = `El ${fecha}/${mes} llovio ${acumulacion}mm/h.`;
        return `<li>${mensaje}</li>`;
      })
      .join('');
    $resultado.append(`
    <p>Dias con lluvia:</p>  
    <ul class="dias-lluvia">${listaDias}</ul>
    `);
    //#endregion
  });
});
