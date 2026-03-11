package com.p2pconnect.controller;

import com.p2pconnect.config.PathConfig;
import com.p2pconnect.model.Product;
import com.p2pconnect.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/products")
public class ProductsController {

    private final ProductRepository repo;
    private final Path uploadsDir;

    public ProductsController(ProductRepository repo, PathConfig.PathsHolder pathsHolder) {
        this.repo = repo;
        this.uploadsDir = pathsHolder.uploadsDir();
    }

    @GetMapping("")
    public ResponseEntity<List<Product>> list(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size
    ) {
        int p = (page != null && page >= 0) ? page : 0;
        int s = (size != null && size > 0 && size <= 100) ? size : 20;
        Pageable pageable = PageRequest.of(p, s, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(repo.findPage(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") long id) {
        Optional<Product> p = repo.findById(id);
        return p.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Not found")));
    }

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestPart(value = "name", required = false) String name,
            @RequestPart(value = "price", required = false) String price,
            @RequestPart(value = "description", required = false) String description,
            @RequestPart(value = "category", required = false) String category,
            @RequestPart(value = "condition", required = false) String condition,
            @RequestPart(value = "mfgDate", required = false) String mfgDate,
            @RequestPart(value = "expirationDate", required = false) String expirationDate,
            @RequestPart(value = "stock", required = false) String stock,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        double numericPrice = 0.0;
        int numericStock = 0;
        try { if (price != null) numericPrice = Double.parseDouble(price); } catch (Exception ignored) {}
        try { if (stock != null) numericStock = Integer.parseInt(stock); } catch (Exception ignored) {}

        if (name == null || name.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "name is required"));
        }
        if (numericPrice <= 0.0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "price must be a positive number"));
        }
        if (numericStock < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "stock cannot be negative"));
        }

        String imagePath = "";
        if (image != null && !image.isEmpty()) {
            try {
                String original = image.getOriginalFilename();
                String ext = ".jpg";
                if (original != null && !original.isBlank()) {
                    int dot = original.lastIndexOf('.');
                    if (dot >= 0) ext = original.substring(dot);
                }
                String filename = System.currentTimeMillis() + "-" + Math.round(Math.random() * 1_000_000_000L) + ext;
                Path target = uploadsDir.resolve(filename);
                Files.createDirectories(uploadsDir);
                Files.copy(image.getInputStream(), target);
                imagePath = "/uploads/" + filename;
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to save image"));
            }
        }

        Product p = new Product();
        p.setName(name != null ? name : "");
        p.setPrice(numericPrice);
        p.setDescription(description != null ? description : "");
        p.setCategory(category != null ? category : "");
        p.setCondition(condition != null ? condition : "");
        LocalDate mfg = (mfgDate != null && !mfgDate.isBlank()) ? LocalDate.parse(mfgDate) : null;
        LocalDate exp = (expirationDate != null && !expirationDate.isBlank()) ? LocalDate.parse(expirationDate) : null;
        p.setMfgDate(mfg);
        p.setExpirationDate(exp);
        p.setStock(numericStock);
        p.setImage(imagePath);

        Product created = repo.save(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}

