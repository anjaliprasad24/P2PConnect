package com.p2pconnect.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final PathConfig.PathsHolder paths;

    public WebConfig(PathConfig.PathsHolder paths) {
        this.paths = paths;
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Only serve uploads from filesystem
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(paths.uploadsDir().toUri().toString());
        // Remove the frontEnd path lines — Spring Boot serves static/ automatically
    }

    @Override
    public void addViewControllers(@NonNull ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/HTML/LoginPage_02.html");
    }
}