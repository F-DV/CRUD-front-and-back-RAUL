package co.com.CRUD.RAUL.crudBackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;

@RestController
public class TodoController {

    /**
     * Anotamos la dependencia del service
     */
    @Autowired
    private TodoService service;


    /**
     *
     * @return : retornamos los datos de todos los Todos
     */
    @GetMapping(value = "api/todos")
    private Iterable<Todo> list(){
        return service.list();
    }


    /**
     * Guardamos el todo_ ingresado en un cuerpo Json
     * @param todo enviamos el que vamos a guardar por un cuerpo
     * @return : retornamos el tod guardado
     */
    @PostMapping(value = "api/todo")
    public Todo save(@RequestBody Todo todo){

        return service.save(todo);
    }

    /**
     * Enviamos un Todo_ y verificamos si existe para poder actualizarlo
     * @param todo
     * @return : el todo_ actualizado
     */
    @PostMapping(value = "api/todo")
    public Todo update(@RequestBody Todo todo){

        /*
            Si el id es null, lanzará una exception
            y no modificará
        */
        if(todo.getId() != null){

        }
        throw new RuntimeException("No existe el usuario a actualizar");
    }

    /**
     * Ingresamos un id y eliminamos el todo_ que tiene asociado este id.
     * Este metodo devuelve una exception si no encuentra el id especificado
     * @param id : id asociado al todo_ que queremos eliminar
     */
    @DeleteMapping(value = "api/{id}/todo")
    public void delete(@PathParam("id") Long id){
        service.delete(id);

    }

    /**
     * Regresamos un todo_ asociado al id igresado en el ruta http,
     * el id ingresado es convertido en un parametro para ser operado dentro del
     * metodo
     * @param id
     * @return : retorna el id ingresado en el path
     */
    @GetMapping(value = "api/{id}/todo")
    public Todo get(@PathParam("id") Long id){
        return service.get(id);
    }

}
