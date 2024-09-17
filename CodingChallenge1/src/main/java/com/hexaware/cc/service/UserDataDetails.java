package com.hexaware.cc.service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.hexaware.cc.entity.UserData;



public class UserDataDetails implements UserDetails {

	 private String name;
	    private String password;
	    private List<GrantedAuthority> authorities;

	    public UserDataDetails(UserData userInfo) {
	        name = userInfo.getName();
	        password = userInfo.getPassword();
	        if (userInfo.getRoles() != null && !userInfo.getRoles().isEmpty()) {
	            this.authorities = Collections.singletonList(new SimpleGrantedAuthority(userInfo.getRoles()));
	        } else {
	            // Handle the case where roles are not set or empty
	            this.authorities = Collections.emptyList();
	        }
	    }

	    @Override
	    public Collection<? extends GrantedAuthority> getAuthorities() {
	        return authorities;
	    }

	    @Override
	    public String getPassword() {
	        return password;
	    }

	    @Override
	    public String getUsername() {
	        return name;
	    }

	    @Override
	    public boolean isAccountNonExpired() {
	        return true;
	    }

	    @Override
	    public boolean isAccountNonLocked() {
	        return true;
	    }

	    @Override
	    public boolean isCredentialsNonExpired() {
	        return true;
	    }

	    @Override
	    public boolean isEnabled() {
	        return true;
	    }
}
