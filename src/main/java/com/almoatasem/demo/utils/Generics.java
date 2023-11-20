package com.almoatasem.demo.utils;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class Generics {
    public <T> void printList(List<T> list) {
        list.forEach(System.out::println);
    }
}
