package com.app.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.ChangePasswordRequest;
import com.app.dto.GetUserDto;
import com.app.dto.SigninRequest;
import com.app.dto.SigninResponse;
import com.app.dto.Signup;
import com.app.entities.User;
import com.app.security.CustomUserDetails;
import com.app.security.JwtUtils;
import com.app.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/user")

public class UserController {
	@Autowired
	private UserService userService;
	@Autowired
	private JwtUtils utils;
	@Autowired
	private AuthenticationManager mgr;

	// sign up
	@PostMapping("/signup")
	public ResponseEntity<?> userSignup(@RequestBody @Valid Signup dto) {
			System.out.println("in sign up " + dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(userService.userRegistration(dto));
	}

	// sign in
	/*
	 * request payload : Auth req DTO : email n password resp payload : In case of
	 * success : Auth Resp DTO : mesg + JWT token + SC 200 IN case of failure : SC
	 * 401
	 */
	@PostMapping("/signin")
	public ResponseEntity<?> signinUser(@RequestBody @Valid SigninRequest reqDTO) {
		System.out.println("in signin " + reqDTO);
		// simply invoke authentucate(...) on AuthMgr
		// i/p : Authentication => un verifed credentials
		// i/f --> Authentication --> imple by UsernamePasswordAuthToken
		// throws exc OR rets : verified credentials (UserDetails i.pl class: custom
		// user details)

		Authentication verifiedAuth = mgr
				.authenticate(new UsernamePasswordAuthenticationToken(reqDTO.getEmail(), reqDTO.getPassword()));
		// Extract user details from CustomUserDetails
		CustomUserDetails userDetails = (CustomUserDetails) verifiedAuth.getPrincipal();
		Long userId = userDetails.getUserId(); // Assuming getId() method exists in CustomUserDetails

		// => auth success
		return ResponseEntity
				.ok(new SigninResponse(userId, utils.generateJwtToken(verifiedAuth), "Successful Authentication!!!"));

	}

	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping("/change-password")
	public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
		// Get the authenticated user details using userId
		Long userId = changePasswordRequest.getId(); // Fetch the userId from the request or any other secure means

		// Verify the old password
		if (!userService.verifyPassword(userId, changePasswordRequest.getOldPassword())) {
			return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Incorrect old password");
		}

		// Change the password
		userService.changePassword(userId, changePasswordRequest.getNewPassword());

		return ResponseEntity.ok("Password changed successfully");
	}

	@GetMapping("/clients")
	public ResponseEntity<List<GetUserDto>> getClients(){
		return ResponseEntity.ok(userService.getClients());
	}

	@GetMapping("/{userId}")
	public ResponseEntity<GetUserDto> getUserById(@PathVariable Long userId) {
		User user = userService.getUserById(userId);
		if (user != null) {
			GetUserDto userdto=new GetUserDto();
			userdto.setAge(user.getAge());
			userdto.setEmail(user.getEmail());
			userdto.setFirstName(user.getFirstName());
			userdto.setLastName(user.getLastName());
			userdto.setGender(user.getGender());
			userdto.setMobile(user.getMobile());
			return ResponseEntity.ok(userdto);
		} else {
			return ResponseEntity.notFound().build();
		}

//	
//	@PutMapping("/updateprofile/{userid}")
//	public UpdateUserDto updateEmpDetails(@PathVariable long userid,@RequestBody UpdateUserDto user) {
//		return userService.updateEmpDetails(user,userid);
//	}

	}
}
