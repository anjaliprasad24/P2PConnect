package com.p2pconnect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Files;
import java.nio.file.Path;
@Configuration
public class PathConfig {
    @Bean
    public PathsHolder pathsHolder() {
        Path base = Path.of("").toAbsolutePath().normalize();
        // Keep serving frontend from project root, but store uploads inside backend-java to avoid OneDrive restrictions
        Path projectDir = base.getParent();
        if (projectDir == null) projectDir = base;
        Path frontEndDir = projectDir.resolve("frontEnd");
        Path htmlDir = frontEndDir.resolve("HTML");
        Path uploadsDir = base.resolve("uploads");
        try {
            Files.createDirectories(uploadsDir);
        } catch (Exception ignored) {}
        return new PathsHolder(projectDir, frontEndDir, htmlDir, uploadsDir);
    }

    public record PathsHolder(Path projectDir, Path frontEndDir, Path htmlDir, Path uploadsDir) {}
}
