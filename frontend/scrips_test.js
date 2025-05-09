export function transform_clientes(clientes) {
  const array_clientes = clientes
    .filter((x) => x[0] !== "") // Filtra los vacíos
    .map((x) => x[0]); // Extrae el valor

  //objeto donde se alamcenan clientes y sus subclientes
  let clientes_subclientes = {
    clientes_base: [],
  };
  for (let i = 0; i < array_clientes.length; i++) {
    let cliente = array_clientes[i].split("|")[0];
    let subcliente = array_clientes[i].split("|")[1];

    if (!clientes_subclientes.clientes_base.includes(cliente)) {
      clientes_subclientes.clientes_base.push(cliente);
    }

    if (cliente in clientes_subclientes) {
      clientes_subclientes[cliente].push(subcliente);
    } else {
      clientes_subclientes[cliente] = [subcliente];
    }
  }

  return clientes_subclientes;
}
