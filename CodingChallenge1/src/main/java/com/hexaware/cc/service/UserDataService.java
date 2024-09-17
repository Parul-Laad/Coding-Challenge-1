package com.hexaware.cc.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hexaware.cc.dao.UserDataRepository;
import com.hexaware.cc.entity.UserData;


@Service
public class UserDataService implements UserDetailsService {

	
	@Autowired
	private PasswordEncoder encoder;
	
	@Autowired
	private UserDataRepository repository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		 System.out.println("Loading user by username: " + username);   
		Optional<UserData> userDetail = repository.findByName(username);
		
		  System.out.println("UserDetail: " + userDetail);
		
	        // Converting userDetail to UserDetails
	        return userDetail.map(UserDataDetails::new)
	                .orElseThrow(() -> new UsernameNotFoundException("User not found " + username));
      
	}
	
	public String addUser(UserData userData) {
		userData.setPassword(encoder.encode(userData.getPassword()));
		repository.save(userData);
		return "User Added Successfully...";
	}
	
	 public boolean authenticateUser(String username, String password) {
		    System.out.println("Authenticating user: " + username + ", " + password);

		 UserDetails userDetails = loadUserByUsername(username);
		    System.out.println("UserDetails: " + userDetails);
		    if (userDetails == null) {
		        return false;
		    }
		    return encoder.matches(password, userDetails.getPassword());
	    }

}
