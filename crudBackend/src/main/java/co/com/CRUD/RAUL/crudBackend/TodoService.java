package co.com.CRUD.RAUL.crudBackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodoService {
    @Autowired
    private TodoRepository repository;

    public Iterable<Todo> list(){
        return repository.findAll();
    }

    public Todo save(Todo todo){

        return repository.save(todo);
    }

    /**
     * Utilizamos el metodo que declaramos get(), para buscar el id
     * y saber si este existe id para poder eliminarlo
     * @param id
     */
    public void delete(Long id){
        repository.delete(get(id));

    }

    /**
     * Este metodo tambien sera usado de manera interna para el metodo
     * delete()
     * Esta funcion pide un tipo opcional, para resolver esto podemos
     * agregar orElseThrow(), el cual arroja una excepcion si el metodo
     * findById no encuenta el id especificado
     * @param id
     * @return :
     */
    public Todo get(Long id){
        return repository.findById(id).orElseThrow();
    }

}
