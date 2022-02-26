import React, {createContext, useContext, useReducer, useEffect, useRef, useState} from 'react';

/*Creamos constante que se encargara de nuestro endPoint, el puerto 8080 es por donde se 
exibe nuestro backend /api es nuestro contesto*/
const HOST_API = "http//localhost:8080/api"

/* Variables iniciales para el contexto que sera un array de lista vacia*/
const initialState = {
  list: []
};
/* Creamos Store como un contexto y le damos un estado inicial*/
const Store = createContext(initialState)

/* Creamos un metodo que servira como componente para crear un formulario basico */
const Form = () => {
  /* Le damos funcionalidad al hook de react useRef()
  que sirve para identificar las propiedades de un componente en especifico, en este caso
  la referencia sera de formulario, lo inicializamos en null y el se crea cuando el componente es 
  montado o pintado, cuadno es montado el carga sus propiedades y se puede usar*/
  const formRef = useRef(null);

  /* Usamos un contexto para usar el dispatch , el necesita un contexto */
  const {dispatch} = useContext(Store);

  /* Declaramos el useState*/
  const [state, setState] = useState({})
  /* Creamos el metodo onAdd como una funcion interna del componente formulario.
  Este evento va a tener un request y va a tener un fetch que especifica que es un post*/
  const onAdd = (event) => {
    event.preventDefaul();

    const request = {
      name: state.name,
      id: null,
      isCompleted: false
    };

    /* Este fetch() especifica que es un POST, este POST recibe un body, este
    body es el que preparamos con la funcion request. el headers especifica que va a transportar un json
    a travez de la red, luego mapea a json, luego obtiene el todo que es el objeto en particula.
    despues dispatch o despacha el evento dependiendo del contexto y luego usamos el setState que es un hook
    muy utilizado que nos permite tener estados internos dentro de componentes
    */
    fetch(HOST_API +"/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then(response => response.json())
      .then((todo) => {
        dispatch({type: "add-item" , 
                  item: todo});
        setState({name: ""}); //se borran los campos dentro del fpormulario
        formRef.current.reset();
      });

  }

  return <form ref={formRef}>
      <input type="text" 
            name = "name"
            onChange={(event) =>{ 
            setState({...state, name: event.target.value })
            }} ></input>

      <button onClick={onAdd}>Agregar</button>
    </form>
}
/*Creamos funcion arrow donde nos retornara un listado en particular,
nos sirve para listar toda la informacion */
const  List = () => {
  /*Utulizamos useContext que es del concepto de hooks en react que sirve para trabajar
    con mecanismos internos de react, utilizamos como contexto un store, pueden haber diferentes 
    contextos, en este contexto store lo usaremos para almacenar los diferentes estados internos
    de la aplicación

  */
    const {dispatch, state} = useContext(Store);

    /* UseEffect nos va a permitir trabajar en backGround (No bloquea el render)
      para no bloquear cuando obtenga la consulta, dentor tenemos:
      fetch : es basicamente una forma de poder consultar algo por hattp o recursos en 
      la web en general, es una promesa de javascript que se neceista resolver, con el
      primer then resolvemos la promera y con el .json parseamos a tipo json para poder ser tratado,
      despues con el dispatch que se tiene en el contexto, actualizamos
      dependiendo del tipo de accion. Con esto ya tenemos el listado de nuesra consulta para listar nuestros
      objetos dentro del backent

    */
    useEffect(() => {
      fetch(HOST_API + "/todos")
      .then(response => response.json())
      .then((list) => {
        dispatch({type: "update-list" , list})
      })
    }, [state.list.length, dispatch]);  //Esta linea es una condicion o regla del useEffect y es que la lista debe tener valores
  
  return<div>
    <table>
      <tr>
        <td>ID</td>
        <td>Nombre</td>
        <td>Descripcion</td>
      </tr>
      <thead>
        <tbody>
          {state.list.map((todo) => {
            return <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>{todo.name}</td>
              <td>{todo.descripcion}</td>
              <td>{todo.isComplete}</td>
            </tr>
          })}
        </tbody>
      </thead>
    </table>
  </div>
}

/* Una funcion reduce es una funcion pura, que significa que dado una entrada
siempre devuelve la salida de esa entrada.
Tiene dos argumentos de entrada que son el estado y la accion,
la accion se evalua para saber el tipo y una vez identificado ese tipo , realiza
la accion correspondiente y va a tener un body, playload o contenido.*/
function reducer(state, action) {
  switch (action.type){
    case 'update-list':
      return {...state, list: action.list }
    case 'add-item':
      const newList = state.list;
      newList.push(action.item);
      return {...state, list: newList }
    default:
      return state;
  }
}

/* Dentro de nuestro contexto debemos dener un provider, este nos va a servir para
poder conectar entre si diferentes componentes */
const StoreProvider = ({ children}) => {
  
  /*El useReducer es una funcion o hook de React que nos ayuda a administrar nuestro reducer,
    el metodo que implementa la logica para los state  y dispach seria el reducer.
    El reduce se esta usando con los estados iniciales que son los mismos del contexto
  */
const [state,dispatch] = useReducer(reducer, initialState);

/* Vamos a inyectarle dos argumentos, uno es el estado y el otro el dispatch, el estado es como esta actualmente
y el dispatch es el metodo que nos permite enviar o notificar al reduce que cambios quiere que pasen en el sistema
orientado a una acción, el StoreProvider se inyectara en APP() como un contenedor de componentes*/
   return <Store.Provider value ={{state, dispatch}}>
     {children}
     </Store.Provider>
}

function App() {
  return (
    <StoreProvider>
      <Form />
      <List />
    </StoreProvider>

  );
}

export default App;

