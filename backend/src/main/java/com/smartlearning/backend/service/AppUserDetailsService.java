package com.smartlearning.backend.service;

import com.smartlearning.backend.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AppUserDetailsService implements UserDetailsService {
    private final UserRepository users;

    public AppUserDetailsService(UserRepository users) {
        this.users = users;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = users.findByUsername(username)
                .or(() -> users.findByEmail(username))
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new org.springframework.security.core.userdetails.User(
                user.username,
                user.password,
                List.of(new SimpleGrantedAuthority("ROLE_" + user.role.name()))
        );
    }
}
