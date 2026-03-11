package com.p2pconnect.controller;

import com.p2pconnect.service.OrdersService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {

    private final OrdersService ordersService;

    public OrdersController(OrdersService ordersService) {
        this.ordersService = ordersService;
    }

    // POST /api/orders { userId, items: [{ productId, quantity }] }
    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        Object userIdObj = body.get("userId");
        Object itemsObj = body.get("items");
        if (!(userIdObj instanceof Number) || !(itemsObj instanceof List<?> list) || list.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Missing userId or items"));
        }
        long userId = ((Number) userIdObj).longValue();
        if (userId <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "userId must be positive"));
        }

        List<OrdersService.OrderItemInput> items = new ArrayList<>();
        for (Object o : list) {
            if (o instanceof Map<?,?> m) {
                OrdersService.OrderItemInput it = new OrdersService.OrderItemInput();
                Object pidObj = m.get("productId");
                Object qtyObj = m.get("quantity");
                it.productId = (pidObj instanceof Number) ? ((Number) pidObj).longValue() : -1;
                it.quantity = (qtyObj instanceof Number) ? ((Number) qtyObj).intValue() : 0;
                items.add(it);
            }
        }

        try {
            OrdersService.CreatedOrder created = ordersService.createOrder(userId, items);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}

