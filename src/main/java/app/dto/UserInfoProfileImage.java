package app.dto;

public class UserInfoProfileImage {
    private UserInfo user;
    private String profileImage;

    public UserInfoProfileImage(UserInfo user, String profileImage) {
        this.user = user;
        this.profileImage = profileImage;
    }

    public UserInfo getUser() {
        return user;
    }

    public String getProfileImage() {
        return profileImage;
    }
}
