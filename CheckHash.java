import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class CheckHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = "$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq";
        if (encoder.matches("password123", hash)) {
            System.out.println("It is password123");
        } else if (encoder.matches("password", hash)) {
            System.out.println("It is password");
        } else {
            System.out.println("Unknown");
        }
    }
}
