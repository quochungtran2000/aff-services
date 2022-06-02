export enum CMD {
  // Auth
  LOGIN = 'login',
  REGISTER = 'register',
  MY_PROFILE = 'my_profile',
  CHANGE_PASSWORD = 'change_password',
  FORGOT_PASSWORD = 'forgot_password',
  CHECK_REQUEST_RESET_PASSWORD = 'check_request_reset_password',
  RESET_PASSWORD = 'reset_password',

  // Welcome
  WELCOME_TO_USER = 'welcome_to_user',

  // Admin
  ADMIN_GET_PERMISSION = 'admin_get_permission',
  ADMIN_GET_USERS = 'admin_get_users',
  ADMIN_GET_ROLES = 'admin_get_roles',
  ADMIN_CREATE_ROLE = 'admin_create_role',
  ADMIN_UPDATE_ROLE = 'admin_update_role',
  ADMIN_ASSIGNN_PERMISSON = 'admin_assign_permission',
  ADMIN_GET_PRODUCTS = 'admin_get_products',
  ADMIN_UPDATE_PRODUCT_TEMPLATE = 'admin_update_product_template',
  ADMIN_GET_PRODUCT_TEMPLATE = 'admin_get_product_template',
  ADMIN_GET_PRODUCT_TEMPLATE_DETAIL = 'admin_get_product_template_detail',
  ADMIN_GET_ECOMMERCE_CATEGORY = 'admin_get_ecommerce_category',
  ADMIN_UPDATE_ECOMMERCE_CATEGORY = 'admin_update_ecommerce_category',
  ADMIN_GET_CATEGORY = 'admin_get_category',
  ADMIN_CREATE_CATEGORY = 'admin_create_category',
  ADMIN_DELETE_CATEGORY = 'admin_delete_category',
  ADMIN_UPDATE_CATEGORY = 'admin_update_category',

  // Webiste
  WEBSITE_GET_PRODUCT = 'website_get_product',
  WEBSITE_GET_PRODUCTS = 'website_get_products',
  GET_APPLICATIONS_CATEGORY = 'get_applications_category',

  // Mobile
  MOBILE_GET_PRODUCTS = 'mobile_get_products',
  MOBILE_GET_PRODUCT = 'mobile_get_product',

  // Crawl
  CRAWL_DATA = 'crawl_data',
  CRAWL_CATEGORY = 'crawl_category',

  //Config
  GET_CONFIG = 'get_config',
  GET_CATEGORY = 'get_category',

  // Comment
  GET_ECOMMERCE_COMMENT = 'get_ecommerce_comment',

  // User
  USER_SAVE_PRODUCT = 'user_save_product',
  GET_SAVE_PRODUCT = 'get_save_product',
  UPLOAD_FILE = 'upload_file',
}
