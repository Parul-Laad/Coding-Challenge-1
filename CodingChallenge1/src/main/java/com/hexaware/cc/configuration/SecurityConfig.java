package com.hexaware.cc.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.hexaware.cc.filter.JwtAuthFilter;
import com.hexaware.cc.service.UserDataService;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter authFilter;

    // User Creation
    @Bean
    public UserDetailsService userDetailsService() {
    	 return new UserDataService();
    }
    
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                    // Allow access to Swagger endpoints
                    //    .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                    // Allow access to these endpoints without authentication
                    .requestMatchers("/auth/welcome", "/auth/addNewUser", "/auth/generateToken").permitAll()
                    // Allow access to book endpoints with ROLE_USER or ROLE_ADMIN authority
                    .requestMatchers("/api/books/getallbooks", "/api/books/getbookbyisbn/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                    .requestMatchers("/api/books/addbook", "/api/books/updatebookbyisbn/**", "/api/books/deletebookbyisbn/**").hasAuthority("ROLE_ADMIN")
                    // All other endpoints require authentication
                    .anyRequest().authenticated())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
    
    
/*
    // Configuring HttpSecurity
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.requestMatchers("/auth/welcome", "/auth/addNewUser", "/auth/generateToken").permitAll())
                .authorizeHttpRequests(auth -> auth.requestMatchers("/auth/user/**").authenticated())
                .authorizeHttpRequests(auth -> auth.requestMatchers("/auth/admin/**").authenticated())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
    */
    
//    
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        return http.csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(auth -> auth
//                    // Allow access to Swagger endpoints
//                //    .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
//                    // Allow access to these endpoints without authentication
//                    .requestMatchers("/auth/welcome", "/auth/addNewUser", "/auth/generateToken").permitAll()
//                    // All other endpoints require authentication
//                    .anyRequest().authenticated())
//                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .authenticationProvider(authenticationProvider())
//                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
//                .build();
//    }
    
    

    // Password Encoding
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


}