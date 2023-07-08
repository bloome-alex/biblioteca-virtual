import Sorteador from '../../../../src/modules/sorteo/Sorteador' //TODO: Cambiar archivo

describe('Sorteador', () => {

  // Hago que deje de ser un singletone durante los test completos
  beforeEach(()=>{
    Sorteador._instance = null
  })
  // Caso de prueba positivo: Verificar si una instancia de Sorteador contiene una prop codigos con la cantidad total de codigos segun las chances
  it('La instancia de Sorteador debería contener 5 codigos en la prop codigos si tiene codigos con diferentes chances', () => {
    const codigos = [
      { codigo: 'ABC123', chances: 2 },
      { codigo: 'DEF456', chances: 2 },
      { codigo: 'GHI789', chances: 1 },
    ]
    // 2 + 2 + 1 = 5
    const instance = new Sorteador(codigos)
    expect(instance.codigos.length === 5).toBe(true)
  })

  it('El metodo obtenerCodigoAleatorio debería devolver un código aleatorio de la lista', () => {
    const codigos = [
      { codigo: 'ABC123', chances: 3 },
      { codigo: 'DEF456', chances: 5 },
      { codigo: 'GHI789', chances: 2 },
    ]

    const instance = new Sorteador(codigos)

    const codigoAleatorio = instance.obtenerCodigoAleatorio([])

    expect(codigos).toContain(codigoAleatorio)
  })

  // Caso de prueba negativo: Verificar si se devuelve null cuando no hay códigos en la lista
  it('Debería devolver null si la lista de códigos está vacía', () => {
    const codigos = []

    const instance = new Sorteador(codigos)

    const codigoAleatorio = instance.obtenerCodigoAleatorio([])

    expect(codigoAleatorio).toBeNull()
  })

  // Caso de prueba negativo: Verificar si se devuelve null cuando todas las chances son cero
  it('Debería devolver null si todas las chances son cero', () => {
    const codigos = [
      { codigo: 'ABC123', chances: 0 },
      { codigo: 'DEF456', chances: 0 },
      { codigo: 'GHI789', chances: 0 },
    ]

    const instance = new Sorteador(codigos)

    const codigoAleatorio = instance.obtenerCodigoAleatorio([])

    expect(codigoAleatorio).toBeNull()
  })

  // Caso de prueba positivo: Verificar si se devuelve un código aleatorio correctamente cuando hay más de un código
  it('Debería devolver un código aleatorio cuando hay más de un código en la lista', () => {
    const codigos = [
      { codigo: 'ABC123', chances: 2 },
      { codigo: 'DEF456', chances: 1 },
      { codigo: 'GHI789', chances: 4 },
    ]

    const instance = new Sorteador(codigos)

    const codigoAleatorio = instance.obtenerCodigoAleatorio([])

    expect(codigos).toContain(codigoAleatorio)
  })

  // Caso de prueba negativo: Verificar si se devuelve null cuando todas las chances son negativas
  it('Debería devolver null si todas las chances son negativas', () => {
    const codigos = [
      { codigo: 'ABC123', chances: -1 },
      { codigo: 'DEF456', chances: -2 },
      { codigo: 'GHI789', chances: -3 },
    ]

    const instance = new Sorteador(codigos)

    const codigoAleatorio = instance.obtenerCodigoAleatorio([])

    expect(codigoAleatorio).toBeNull()
  })
})

it('Si se le añaden menos codigos de los que se piden sortear debe retornar un error "Insuficientes codigos"', () => {
  const codigos = [
    { codigo: 'ABC123', chances: 1 },
    { codigo: 'DEF456', chances: 1 },
    { codigo: 'GHI789', chances: 1 },
  ] 

  const instance = new Sorteador(codigos)
  try {
    const sorteo = instance.sortear(5) //Mayor a la cantidad de sorteos
    throw new Error('No tiró error en sorteo')
  } catch (error) {
    expect(error.message === 'Insuficientes codigos').toBe(true)
  }
})

it('Los codigos que se cuentan son solo los que son mayor a 1 sinó tiraría el mismo error', () => {
  const codigos = [
    { codigo: 'ABC123', chances: 0 },
    { codigo: 'DEF456', chances: 0 },
    { codigo: 'GHI789', chances: 0 },
  ] 

  const instance = new Sorteador(codigos)
  try {
    const sorteo = instance.sortear(1)
    throw new Error('No tiró error en sorteo')
  } catch (error) {
    expect(error.message === 'Insuficientes codigos').toBe(true)
  }
})

it('obtenerCodigoAleatorio ignorará los códigos que se le envie por parametro', () => {
  const codigos = [
    { codigo: 'ABC123', chances: 10 }, // Añado más probabilidades
    { codigo: 'DEF456', chances: 1 },
    { codigo: 'GHI789', chances: 1 },
  ] 

  const instance = new Sorteador(codigos)

  const codigoAleatorio = instance.obtenerCodigoAleatorio([codigos[0], codigos[1]])
  
  expect(codigoAleatorio === codigos[2]).toBe(true)
})

it('El metodo sortear Debería devolver dos ganadores distintos', () => {
  const codigos = [
    { codigo: 'ABC123', chances: 10 }, // Añado más probabilidades
    { codigo: 'DEF456', chances: 1 },
    { codigo: 'GHI789', chances: 1 },
  ] 

  const instance = new Sorteador(codigos)

  const sorteo = instance.sortear(2)
  
  expect(sorteo.length === 2).toBe(true)
  expect(sorteo[0] != sorteo[1]).toBe(true)
})

it('El metodo sortear Debería devolver 3 ganadores distintos', () => {
  const codigos = [
    { codigo: 'ABC123', chances: 10 }, // Añado más probabilidades
    { codigo: 'DEF456', chances: 1 },
    { codigo: 'GHI789', chances: 1 },
  ] 

  const instance = new Sorteador(codigos)

  const sorteo = instance.sortear(3)
  
  expect(sorteo[0] != sorteo[1] != sorteo[2]).toBe(true)
})

it('El metodo sortear Debería devolver el error "cantidad invalida" si se envía una cantidad menor a cero', () => {
  const codigos = [
    { codigo: 'ABC123', chances: 10 }, // Añado más probabilidades
    { codigo: 'DEF456', chances: 1 },
    { codigo: 'GHI789', chances: 1 },
  ] 

  const instance = new Sorteador(codigos)

  try {
    const sorteo = instance.sortear(-1)
    throw new Error('Error no incluido')
  } catch (error) {
    expect(error.message).toBe("cantidad invalida")
  }
})