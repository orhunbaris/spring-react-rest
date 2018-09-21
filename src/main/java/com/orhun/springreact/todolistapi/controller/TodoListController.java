package com.orhun.springreact.todolistapi.controller;


import com.orhun.springreact.todolistapi.domain.TodoList;
import com.orhun.springreact.todolistapi.service.TodoListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/todolist")
public class TodoListController {

    @Autowired
    TodoListService todoListService;


    @GetMapping
    public ResponseEntity<?> getAll() {
        List<TodoList> result = todoListService.findAll();
        return new ResponseEntity(result, HttpStatus.OK);
    }


    @GetMapping("/{name}")
    public ResponseEntity<?> getByMonthYear(@PathVariable("name") String name) {
        List<TodoList> result = new ArrayList<>();

            result = todoListService.findByName(name);



        return new ResponseEntity(result, HttpStatus.OK);
    }


    @PostMapping
    public ResponseEntity<?> addorUpdateExpense(@RequestBody TodoList todolist) {
        todoListService.saveOrUpdateTodoList(todolist);
        return new ResponseEntity("TodoList added succcessfully", HttpStatus.OK);
    }


    @DeleteMapping
    public void deleteExpense(@RequestParam("name") String name) {
        todoListService.deleteTodoList(name);
    }



}
