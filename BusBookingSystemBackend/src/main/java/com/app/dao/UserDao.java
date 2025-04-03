package com.app.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entities.User;
import org.springframework.data.jpa.repository.Query;

public interface UserDao extends JpaRepository<User,Long>{
//derived finder 
	Optional<User> findByEmail(String email);

	@Query("SELECT u FROM User u WHERE u.role = 'ROLE_CUSTOMER'")
	List<User> findAllClients();
	
}
