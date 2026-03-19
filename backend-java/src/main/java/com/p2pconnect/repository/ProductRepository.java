package com.p2pconnect.repository;

import com.p2pconnect.model.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p ORDER BY p.id DESC")
    List<Product> findPage(Pageable pageable);

    @Query("SELECT p.id, p.price FROM Product p WHERE p.id IN :ids")
    List<Object[]> findIdAndPriceByIdIn(@Param("ids") Iterable<Long> ids);
}

