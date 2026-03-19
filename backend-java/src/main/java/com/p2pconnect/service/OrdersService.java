package com.p2pconnect.service;

import com.p2pconnect.model.Order;
import com.p2pconnect.model.OrderItem;
import com.p2pconnect.model.Product;
import com.p2pconnect.model.User;
import com.p2pconnect.repository.OrderItemRepository;
import com.p2pconnect.repository.OrderRepository;
import com.p2pconnect.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class OrdersService {

    private final ProductRepository products;
    private final OrderRepository orders;
    private final OrderItemRepository orderItems;
    private final EntityManager em;

    public OrdersService(ProductRepository products, OrderRepository orders, OrderItemRepository orderItems, EntityManager em) {
        this.products = products;
        this.orders = orders;
        this.orderItems = orderItems;
        this.em = em;
    }

    public static class OrderItemInput {
        public long productId;
        public int quantity;
    }

    public static class CreatedOrder {
        public long id;
        public long userId;
        public double total;
        public List<Map<String, Object>> items;
    }

    @Transactional
    public CreatedOrder createOrder(long userId, List<OrderItemInput> items) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("items must be provided and not be empty");
        }

        // Build price map from DB in a single query
        Set<Long> ids = new HashSet<>();
        for (OrderItemInput i : items) {
            if (i == null) {
                throw new IllegalArgumentException("item cannot be null");
            }
            if (i.productId <= 0) {
                throw new IllegalArgumentException("productId must be positive");
            }
            if (i.quantity <= 0) {
                throw new IllegalArgumentException("quantity must be positive");
            }
            ids.add(i.productId);
        }
        Map<Long, Double> priceMap = new HashMap<>();
        if (!ids.isEmpty()) {
            List<Object[]> rows = products.findIdAndPriceByIdIn(ids);
            for (Object[] r : rows) {
                Long id = (Long) r[0];
                Double price = (Double) r[1];
                priceMap.put(id, price);
            }
        }

        BigDecimal totalBD = BigDecimal.ZERO;
        List<Map<String, Object>> normalized = new ArrayList<>();
        for (OrderItemInput it : items) {
            Double priceEach = priceMap.get(it.productId);
            if (priceEach == null || priceEach <= 0.0) {
                throw new IllegalArgumentException("Unknown productId or non-positive price for productId=" + it.productId);
            }
            BigDecimal price = BigDecimal.valueOf(priceEach);
            BigDecimal line = price.multiply(BigDecimal.valueOf(it.quantity));
            totalBD = totalBD.add(line);

            Map<String, Object> out = new LinkedHashMap<>();
            out.put("productId", it.productId);
            out.put("quantity", it.quantity);
            out.put("priceEach", priceEach);
            normalized.add(out);
        }

        if (normalized.isEmpty()) {
            throw new IllegalArgumentException("No valid items to create order");
        }

        // Round total to 2 decimals for currency representation
        totalBD = totalBD.setScale(2, RoundingMode.HALF_EVEN);

        // Persist order with JPA
        Order order = new Order();
        // Attach user reference without loading fully
        User userRef = em.getReference(User.class, userId);
        order.setUser(userRef);
        order.setTotal(totalBD);
        order = orders.save(order);
        long orderId = order.getId();

        // Persist order_items
        List<OrderItem> toSave = new ArrayList<>();
        for (Map<String, Object> it : normalized) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            Product prodRef = em.getReference(Product.class, ((Number) it.get("productId")).longValue());
            oi.setProduct(prodRef);
            oi.setQuantity(((Number) it.get("quantity")).intValue());
            oi.setPriceEach(((Number) it.get("priceEach")).doubleValue());
            toSave.add(oi);
        }
        orderItems.saveAll(toSave);

        CreatedOrder co = new CreatedOrder();
        co.id = orderId;
        co.userId = userId;
        co.total = totalBD.doubleValue();
        co.items = normalized;
        return co;
    }
}

