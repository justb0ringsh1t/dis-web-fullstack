$(() => {
  const limpiarErrores = inputs => {
    inputs.forEach(input => {
      const spanError = $(`#error-${input.attr('id')}`);
      spanError.html(`a`);
      spanError.attr('data-visible', 'false');
    });
  };

  const $estudiante = $('#estudiante');
  const $practico = $('#practico');
  const $oral = $('#oral');
  const $escrito = $('#escrito');

  $('#btn-aceptar').on('click', () => {
    const validarVacios = inputs => {
      const vacios = inputs
        .map(input => {
          const valor = input.val();
          return valor?.replaceAll(' ', '') === ''
            ? input.attr('id')
            : undefined;
        })
        .filter(input => input !== undefined);

      vacios?.forEach(id => {
        const spanError = $(`#error-${id}`);
        spanError.html(`El campo '${id}' es obligatorio.`);
        spanError.attr('data-visible', 'true');
      });

      return vacios.length === 0;
    };

    limpiarErrores([$estudiante, $practico, $oral, $escrito]);

    if (!validarVacios([$estudiante, $practico, $oral, $escrito])) return;

    let errores = 0;
    [$estudiante].forEach(input => {
      const valor = input.val();
      if (!valor.match(/^[a-zA-Z\s]*$/)) {
        const $spanError = $(`#error-${input.attr('id')}`);
        $spanError.html('El nombre solo puede contener letras y espacios');
        $spanError.attr('data-visible', 'true');

        errores += 1;
      }
    });
    [$practico, $oral, $escrito].forEach(input => {
      const valor = input.val();
      if (valor < 1 || valor > 12) {
        const $spanError = $(`#error-${input.attr('id')}`);
        $spanError.html('La nota tiene que estar entre 1 y 12.');
        $spanError.attr('data-visible', 'true');

        errores += 1;
      }
    });

    if (errores > 0) return;

    const obtenerDatos = () => [
      $estudiante.val(),
      Number($practico.val()),
      Number($oral.val()),
      Number($escrito.val())
    ];

    const calcularPromedio = notas => {
      const promedio = notas.reduce((a, b) => a + b, 0) / notas.length;
      return Math.floor(promedio);
    };

    const calcularJuicio = promedio => {
      if (promedio >= 8) return 'Exonerado';
      if (promedio <= 4) return 'Febrero';
      return 'Diciembre';
    };

    const mostrarResultado = ({ estudiante, promedio, juicio }) => {
      const $resultado = $('#resultado');

      if (juicio === 'Exonerado') {
        return $resultado.html(
          `<span class="underline decoration-green-500 decoration-4">${estudiante} tiene ${promedio} de promedio (${juicio}).</span>`
        );
      }
      if (juicio === 'Febrero') {
        return $resultado.html(
          `<span class="underline decoration-red-500 decoration-4">${estudiante} tiene ${promedio} de promedio (${juicio}).</span>`
        );
      }
      return $resultado.html(
        `<span class="underline decoration-orange-500 decoration-4">${estudiante} tiene ${promedio} de promedio (${juicio}).</span>`
      );
    };

    const [estudiante, ...notas] = obtenerDatos();
    const promedio = calcularPromedio(notas);

    const juicio = calcularJuicio(promedio);

    mostrarResultado({ estudiante, promedio, juicio });
  });

  $('#btn-limpiar').on('click', () => {
    limpiarErrores([$estudiante, $practico, $oral, $escrito]);

    const $inputs = $(':input');
    $inputs.val('');

    const $resultado = $('#resultado');
    $resultado.html('...');
  });
});
