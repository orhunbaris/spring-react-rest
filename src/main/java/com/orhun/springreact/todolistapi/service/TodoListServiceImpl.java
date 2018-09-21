package com.orhun.springreact.todolistapi.service;


import com.orhun.springreact.todolistapi.domain.TodoList;
import com.orhun.springreact.todolistapi.repositories.TodoListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoListServiceImpl implements TodoListService {


    @Autowired
    TodoListRepository todoListRepository;

    @Override
    public List<TodoList> findAll(){
        return todoListRepository.findAll();
    }


    @Override
    public List<TodoList> findByName(String name) {
        return todoListRepository.findByName(name);
    }

    @Override
    public void saveOrUpdateTodoList(TodoList expense) {
        todoListRepository.save(expense);
    }

    @Override
    public void deleteTodoList(String id) {
        todoListRepository.deleteById(id);
    }




}
