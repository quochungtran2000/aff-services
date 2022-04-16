export class CreateRolePermissionDTO {
  roleId: number;
  permissionId: number;

  public static from(roleId: number, permissionId: number) {
    const result = new CreateRolePermissionDTO();
    result.roleId = roleId;
    result.permissionId = permissionId;
    return result;
  }

  public static toBeCreated(roleId: number, permissionIds: number[]) {
    const result: CreateRolePermissionDTO[] = [];
    for (const permissionId of permissionIds) {
      const temp = new CreateRolePermissionDTO();
      temp.roleId = roleId;
      temp.permissionId = permissionId;
      result.push(temp);
    }
    return result;
  }
}
