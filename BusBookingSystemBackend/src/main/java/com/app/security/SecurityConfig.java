package com.app.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@EnableWebSecurity
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

	@Autowired
	private PasswordEncoder enc;

	@Autowired
	private JwtAuthenticationFilter jwtFilter;

	@Autowired
	private CustomAuthenticationEntryPoint authEntry;

	@Bean
	public SecurityFilterChain authorizeRequests(HttpSecurity http) throws Exception {
		http.cors().and().csrf().disable().exceptionHandling().authenticationEntryPoint(authEntry).and()
				.authorizeRequests().antMatchers(
						// user
						"/user/signup", "/user/signin", "/password-reset/reset", "/password-reset/request","/user/{userId}",
						// station
						"/station/getstations", "/station/deletestation",
						//route
						"/route/allroutes",
						// bus
						"/bus/getbuses","/bus/getallbuses", 
						//seats
						"/seats/bus/{busId}",
						"/seat/lock","/seat/unlock","/seat/{busid}",
						//bookings
						"/bookings/book","/bookings/getbookings/{userid}","/bookings/getbooking/{bookingId}","/bookings/getbookings",
						//seatAllocation
						"/passenger/bus/{busId}/seat-list",
						//backendstatuscheck
						"/check-backend-status",
						"/payment/razorpay","/payment/verify-payment","/payment/refund",
						//drivers
						"/drivers/all",
						//other
						"/v*/api-doc*/**", "/swagger-ui/**")
				.permitAll().antMatchers(HttpMethod.OPTIONS).permitAll().antMatchers("/products/add", "/drivers/add", "/drivers/update/**", "/drivers/delete/**").hasRole("ADMIN")
				.anyRequest().authenticated().and().sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000","http://localhost:3001", "http://localhost:3002", "http://localhost:8081", "http://localhost:19006"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
