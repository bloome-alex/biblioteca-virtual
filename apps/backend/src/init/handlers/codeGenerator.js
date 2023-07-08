export function generarCodigos(cantidad, codigosYaExistentes = []) {
    const codigos = new Set(codigosYaExistentes)
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  
    while (codigos.size < cantidad) {
      let codigo = ''

      for (let i = 0; i < 6; i++) {
        let indice = Math.floor(Math.random() * caracteres.length)
        codigo += caracteres[indice]
      }
      codigos.add(codigo)
    }
  
    return Array.from(codigos)
  }
  