package com.app.service;

import com.app.dto.GetUserDto;
import com.app.dto.Signup;
import com.app.entities.User;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {
//sign up
	Signup userRegistration(Signup reqDTO);
	void resetPassword(User user, String newPassword);
	User findByEmail(String email);
	boolean verifyPassword(Long userId, String oldPassword);
	void changePassword(Long userId, String newPassword);
	User getUserById(Long userId);
	List<GetUserDto> getClients();
}
