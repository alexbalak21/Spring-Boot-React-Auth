package app.service;

import net.coobird.thumbnailator.Thumbnails;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import app.model.User;
import app.model.UserProfileImage;
import app.repository.UserProfileImageRepository;

@Service
public class UserProfileImageService {

    private final UserProfileImageRepository repository;

    public UserProfileImageService(UserProfileImageRepository repository) {
        this.repository = repository;
    }

    /**
     * Save or update compressed profile image for a user.
     */
    public UserProfileImage saveCompressedImage(User user, MultipartFile file) throws IOException {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        // Compress and resize
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Thumbnails.of(originalImage)
                  .size(120, 120)        // resize to 120x120
                  .outputQuality(0.8)    // compression quality
                  .outputFormat("jpg")
                  .toOutputStream(baos);

        byte[] compressedData = baos.toByteArray();

        // If user already has an image, update it
        Optional<UserProfileImage> existing = repository.findByUserId(user.getId());
        UserProfileImage profileImage = existing.orElseGet(UserProfileImage::new);

        profileImage.setUser(user);
        profileImage.setImageData(compressedData);

        return repository.save(profileImage);
    }

    /**
     * Get Base64-encoded profile image for a user.
     */
    public String getBase64Image(Long userId) {
        return repository.findByUserId(userId)
                .map(img -> Base64.getEncoder().encodeToString(img.getImageData()))
                .orElse(null);
    }

    /**
     * Delete profile image for a user.
     */
    public void deleteImage(Long userId) {
        repository.findByUserId(userId).ifPresent(repository::delete);
    }
}
