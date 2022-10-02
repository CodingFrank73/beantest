
const { registerUser } = require("./users/register-user");


// const { refreshUserToken } = require("./users/refresh-user-token");
// const { showMyProfile } = require("./users/show-profile");
// const { editAvatar } = require("./users/edit-avatar");
// const { editProfileSettings } = require("./users/edit-profile-settings");
// const { editLanguage } = require("./users/edit-language")
// const { editMaxDistance } = require("./users/edit-max-distance")
// const { editAgeRange } = require("./users/edit-age-range")
// const { editImageMain } = require("./users/edit-image-main")



const UserService = {
    registerUser
    // refreshUserToken,
    // showMyProfile,
    // editAvatar,
    // editProfileSettings,
    // editLanguage,
    // editMaxDistance,
    // editAgeRange,
    // editImageMain
}


module.exports = {
    UserService
}