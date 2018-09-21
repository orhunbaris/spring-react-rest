package com.orhun.springreact.todolistapi.repositories;

import com.orhun.springreact.todolistapi.domain.TodoList;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TodoListRepository extends MongoRepository<TodoList, String> {

    List<TodoList> findByName(String name);
}
