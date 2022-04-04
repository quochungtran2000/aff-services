export enum CMD {
  // Auth
  LOGIN = 'login',
  REGISTER = 'register',
  MY_PROFILE = 'my_profile',
  CHANGE_PASSWORD = 'change_password',

  // Welcome
  WELCOME_TO_USER = 'welcome_to_user',

  // Admin
  ADMIN_GET_PERMISSION = 'admin_get_permission',
  ADMIN_GET_USERS = 'admin_get_users',
  ADMIN_GET_ROLES = 'admin_get_roles',
  ADMIN_CREATE_ROLE = 'admin_create_role',
  ADMIN_UPDATE_ROLE = 'admin_update_role',
  ADMIN_ASSIGNN_PERMISSON = 'admin_assign_permission',
}
