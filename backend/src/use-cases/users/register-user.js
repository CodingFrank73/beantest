const { UserDAO } = require("../../db-access");
const { makeUser } = require("../../domain/User");



// const Sercurity = require("../../utils/security");

async function registerUser({ email, dogName, gender, dateOfBirth, size, bigImage }) {

    const foundUser = await UserDAO.findByEmail(email)

    if (foundUser) {
        const errorMessage = "Account with this email already exists"
        throw new Error(errorMessage)
    }

    // const salt = Sercurity.createRandomSalt();
    // const pwHash = Sercurity.createHashedPasswort(password, salt);
    // const verifyCode = Sercurity.generateRandomSixDigitCode();

    const user = await makeUser({ dogName, email, gender, dateOfBirth, size, bigImage });

    const insertResult = await UserDAO.insert(user);

    const isRegSuccessfully =
        insertResult.acknowledged === true &&
        insertResult.insertedId;

    if (!isRegSuccessfully) {
        throw new Error("Registration failed")
    }

    const registeredUser = await UserDAO.findById(insertResult.insertedId);
    return registeredUser

}

module.exports = {
    registerUser
}