
const userRoles = {
    SUPER_ADMIN: "SUPER ADMIN",
    PROJECT_MANAGER: "PROJECT MANAGER",
    CONTRACT_MANAGER: "CONTRACT MANAGER",
    PROJECT_ASSISTANT: "PROJECT ASSISTANT",
    PROJECT_VIEWER: "PROJECT VIEWER",
    USER: "USER",
}

module.exports = {
    userRoles,
    LOGIN_SUCCESS_MESSAGE: "",
    SIGNUP_SUCCESS_MESSAGE: "User created successfully",
    CURRENT_USER_MESSAGE: "",
    CREATE_USER_SUCCESS: 'User created successfully',
    DELETE_USER_SUCCESS: 'User deleted successfully',
    UPDATE_USER_SUCCESS: 'User updated successfully',
    ACCOUNT_NOT_FOUND: 'Account not found',
    INVALID_PASSWORD: 'Invalid password',
    EMAIL_ALREADY_EXIST: 'Email already exists',
    ONLY_SA_CAN_ACCESS: 'only SA can access',
    ONLY_AO_CAN_ACCESS: 'only AO can access',
    USER_NOT_FOUND: 'User not found',
}
