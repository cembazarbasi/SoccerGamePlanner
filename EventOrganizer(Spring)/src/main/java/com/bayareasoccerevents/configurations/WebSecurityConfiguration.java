package com.bayareasoccerevents.configurations;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.bayareasoccerevents.filters.JwtRequestFilter;
import com.bayareasoccerevents.services.JwtLogoutSuccessHandler;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfiguration {

    @Autowired
    private JwtRequestFilter requestFilter;

    @Autowired
    private JwtLogoutSuccessHandler jwtLogoutSuccessHandler;
    
    
    public WebSecurityConfiguration(JwtRequestFilter requestFilter, JwtLogoutSuccessHandler jwtLogoutSuccessHandler) {
        this.requestFilter = requestFilter;
        this.jwtLogoutSuccessHandler = jwtLogoutSuccessHandler;
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public LogoutSuccessHandler logoutSuccessHandler() {
        return new SimpleUrlLogoutSuccessHandler();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests()
                    .requestMatchers(
                        "/register", "/login", "/logout", "/profile", "/addEvent", "/events",
                        "/dashboard", "/users", "/events/getEventById/{id}",
                        "/participants/getParticipantsByEventId/{eventId}",
                        "/deleteAttendee/{eventId}/{attendee}", "addParticipant",
                        "/reset-password/request", "/reset-password/reset/{token}", "/reset-password/reset"
                    ).permitAll()
                    .requestMatchers(HttpMethod.DELETE, "/deleteAttendee/{eventId}/{attendee}").permitAll()
                    .requestMatchers("/api/**").authenticated()
                    .anyRequest().authenticated()
                .and()
                .sessionManagement(management -> management
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(requestFilter, UsernamePasswordAuthenticationFilter.class)
                .logout()
                    .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                    .logoutSuccessHandler(jwtLogoutSuccessHandler)
                    .addLogoutHandler(logoutHandler())
                .and()
                .build();
    }

    
  


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
    
    @Bean
    public LogoutHandler logoutHandler() {
        return new SecurityContextLogoutHandler();
    }
    
}
    