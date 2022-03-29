const img_cartas = [
    {"src" : "/img/cob.jpg", emparejada:false},
    {"src" : "/img/goj.jpg", emparejada:false},
    {"src" : "/img/meg.jpg", emparejada:false},
    {"src" : "/img/ope.jpg", emparejada:false},
    {"src" : "/img/pan.jpg", emparejada:false},
    {"src" : "/img/pth.jpg", emparejada:false},
    {"src" : "/img/soad.jpg", emparejada:false},
    {"src" : "/img/syl.jpg", emparejada:false}
]
// Variable necesdaria apra guardar el valor de cartas
let cartas_en_juego;
let turnos;
//Vuelk


const App = () =>{

    // La app se encarga de poner las cartas y de ver los turnos
    
    const [cartas, setCartas] = React.useState([])
    const desordenar_cartas = () => {

        turnos = 0
        const cartas_desordenadas = [...img_cartas, ...img_cartas]
        .sort( () => Math.random() - 0.5 )
        .map( (carta, index) => ( { ...carta, id : index += 1  } ))

        setCartas(cartas_desordenadas)
        setVueltas(0)
    }

    // Darle un valor para poder usarla en otros componentes
    cartas_en_juego = cartas

    const [vueltas, setVueltas] = React.useState(0)

    //Deshabilitar cartas
    const [deshabilitada, setDeshabilitada] = React.useState(false)

    const pasarTurno = () => {
        setDosEleccion(null)
        setUnoEleccion(null)
        //Aumentar turnos
        setVueltas(turnosActuales => turnosActuales + 1)
        setDeshabilitada(false)
    }


    const[unoEleccion, setUnoEleccion] = React.useState(null)
    const[dosEleccion, setDosEleccion] = React.useState(null)

    const eleccion = (carta) => {
        //If simplificado   Null -> False
        unoEleccion ? setDosEleccion(carta) : setUnoEleccion(carta)
        // Si no se ha elegido a una carta, pues se asignara a unoEleccion, en caso de que no, se asignara a la eleccion dos
    }

    //Comparar cartas usando useEffect, si se cambia a los valores de arriba, se dispara esta funcion
    React.useEffect(() => {
        //Chequear si ambas cartas tienen valores
        if (unoEleccion && dosEleccion){
            //Mientras se chequean las deshabilito
            setDeshabilitada(true)
            if(unoEleccion.src == dosEleccion.src){

                setCartas( //Tomamos el valor del estado anterior y a partir de él actualizamos
                    cartasPrevias => { //Se utiliza un map para devolver un array, que se usará para darle ese valor a setCartas
                        return cartasPrevias.map( 
                            carta => { //Del resultado anterior, cambiar los resultados
                                if(carta.src == unoEleccion.src){
                                    //Extraer las propiedades de carta
                                    return {...carta, emparejada: true}
                                } else{
                                    return carta
                                }
                            }
                        )
                    }
                )
                //Utilizar el setCartas para alterar el valor de las mismas
                pasarTurno()
            }
            else{
                console.log("no son iguales")
                //Darle tuiempo al usuario para ver la carta
                setTimeout( () => pasarTurno(), 1000)
            }
        }
    }, [unoEleccion, dosEleccion])

    // Pasar los turnos
    // useEffect -> 2 parametros. La funcion que queremos que se ejecute
    // y entre corchetes los valores que cambian, que son estados
    React.useEffect(() => {
        turnos = vueltas
    }, [vueltas])
    

    return(
        <div className="app">
            <h1>Heaby Metal Memory</h1>
            <button onClick = {desordenar_cartas}>New Game</button>
                <div className = "tablero">
                {//Utilizar map para argar todos los del JSON
                    cartas_en_juego.map( carta => (
                        
                        //Recibir cada elemento del JSON para trabajar con el
                        <Carta carta = {carta}
                        // Mandar la funcion como propiedad, para poder comunicar ambos componentes
                        // Hint: SE PUEDEN MANDAR OBJETOS COMO PROPIEDADES 
                        eleccion = {eleccion}
                        // "mira si la eleccion 1 es iguala  al carta a la que se ha clickado"
                        // Se devuelve un booleano que nos indicara cuando la carta este girada
                        girada = {carta === unoEleccion || carta === dosEleccion || carta.emparejada}
                        //Propiedad para desactivar cartas mientras las que se eligieron se muestran
                        deshabilitada = {deshabilitada}/>
                        
                    ))
                }
            </div>
            <h1>{turnos}</h1>
        </div>
    )
}

const Carta = ( {carta, eleccion, girada, deshabilitada} ) => {
    // Carta -> elemento del JSON cartas que la carta tiene


    // elección -> función que se pasa como paraametro necesaria para poder pasar la informacion de la carta a la app
    const meEligieron = () => {

        deshabilitada ? null : eleccion(carta)
        // Devolver la carta que tiene la carta

    }

    // La idea para que nos e pueda elegir la misma carta es -> elegir una carta solo funciona cuando se le da click
    // a la imagen de atras de la tarjeta, por lo que al aparecer encima de ella algo no se le puede dar click
    
    return(
        <div className = "carta" >
            <div className = {girada ? "yes" : "no"}>
                <img className = "arriba" src = {carta.src}/>
                <img className = "abajo" src = {"/img/abajo.jpg"} onClick = {meEligieron}/>
            </div>
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)