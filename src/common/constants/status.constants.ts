export const STATUS = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
};


export const MESSAGES = {
    INVALID_CREDENTIALS: 'Invalid credentials',
    LOGIN_SUCCESS: 'Login successful',
    ADMIN_NOTFOUND: 'Admin not found',
    PASSWORD_RESET: 'Password reset link sent to email',
    INVALID_TOKEN: 'Invalid token',
    PASSWORD_SUCCESS: 'Password reset successful',
    OLD_PASSWORD_INCORRECT: 'Old password incorrect',
    PASSWORD_CHANGED: 'Password changed successfully',
    OTP_VERIFY_SUCCESS: 'OTP verified successfully',
    OTP_SENT_TO_MAIL: 'OTP sent to registered email',
    OTP_SENT_NEW_MOBILE: 'OTP sent to new mobile number',
    INVALID_OTP: 'Invalid or expired OTP',
    PROFILE_UPDATED_SUCCESSFULLY: 'Profile updated successfully',
    ACCOUNT_DELETED_SUCCESS: 'Account deleted successfully',
    PROFILE_IMAGE_REQUIRED: 'Profile Image is required',
    ACCOUNT_DELETED: 'Your account has been deleted. Please contact support if you want to restore it.',
    OTP_NOTFOUND: 'OTP Not Found',
    OTP_EXPIRED: 'OTP Expired',
    NEW_OLD_PASSWORD: 'New password cannot be the same as the old password',
    CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
    ICON_REQUIRED: "Icon required",
    PLEASE_SELECT_RECORDS: 'Please select records.',
    NO_VALID_RECORDS_FOUND: 'No valid records found',
    TILE_CONTAIN_NUMBERS: 'Title cannot contain only numbers',


    //state
    STATE_ALREADY_EXISTS: 'State already exists',
    STATE_CREATED: 'State created successfully',
    STATE_NOT_FOUND: 'State not found',
    STATE_UPDATED: 'State updated successfully',
    STATE_DELETED: 'State deleted successfully',
    STATE_FETCHED_SUCCESS: 'State fetched successfully',

    //district
    DISTRICT_ALREADY_EXISTS: 'District already exists',
    DISTRICT_CREATED: 'District created successfully',
    DISTRICT_NOT_FOUND: 'District not found',
    DISTRICT_UPDATED: 'District updated successfully',
    DISTRICT_DELETED: 'District deleted successfully',
    DISTRICT_FETCHED_SUCCESS: 'Distrcit fetched successfully',

    //service types
    SERVICE_TYPE_ALREADY_EXISTS: 'Service type already exists',
    SERVICE_TYPE_CREATED: 'Service type created successfully',
    SERVICE_TYPE_NOT_FOUND: 'Service type not found',
    SERVICE_TYPE_UPDATED: 'Service type updated successfully',
    SERVICE_TYPE_DELETED: 'Service type deleted successfully',
    SERVICE_TYPE_FETCHED_SUCCESS: 'Service type fetched successfully',

    //service categories
    SERVICE_CATEGORY_ALREADY_EXISTS: 'Service category already exists',
    SERVICE_CATEGORY_CREATED: 'Service category created successfully',
    SERVICE_CATEGORY_NOT_FOUND: 'Service category not found',
    SERVICE_CATEGORY_UPDATED: 'Service category updated successfully',
    SERVICE_CATEGORY_DELETED: 'Service category deleted successfully',
    SERVICE_CATEGORY_FETCHED_SUCCESS: 'Service category fetched successfully',

    //service sub categories
    SERVICE_SUB_CATEGORY_ALREADY_EXISTS: 'Service sub category already exists',
    SERVICE_SUB_CATEGORY_CREATED: 'Service sub category created successfully',
    SERVICE_SUB_CATEGORY_NOT_FOUND: 'Service sub category not found',
    SERVICE_SUB_CATEGORY_UPDATED: 'Service sub category updated successfully',
    SERVICE_SUB_CATEGORY_DELETED: 'Service sub category deleted successfully',
    SERVICE_SUB_CATEGORY_FETCHED_SUCCESS: 'Service sub category fetched successfully',
}