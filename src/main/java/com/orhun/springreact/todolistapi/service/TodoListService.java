package com.orhun.springreact.todolistapi.service;

import com.orhun.springreact.todolistapi.domain.TodoList;

import java.util.List;

public interface TodoListService {

    List<TodoList> findAll();

    List<TodoList> findByName(String name);


    void saveOrUpdateTodoList(TodoList todoList);

    void deleteTodoList(String id);
}
