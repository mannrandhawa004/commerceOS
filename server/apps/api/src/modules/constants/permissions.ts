export const PERMISSIONS = {
  // Products
  PRODUCT_CREATE: "products.create",
  PRODUCT_READ: "products.read",
  PRODUCT_UPDATE: "products.update",
  PRODUCT_DELETE: "products.delete",

  // Categories
  CATEGORY_CREATE: "categories.create",
  CATEGORY_READ: "categories.read",
  CATEGORY_UPDATE: "categories.update",
  CATEGORY_DELETE: "categories.delete",

  // Orders
  ORDER_CREATE: "orders.create",
  ORDER_READ: "orders.read",
  ORDER_UPDATE: "orders.update",
  ORDER_CANCEL: "orders.cancel",

  // Inventory
  INVENTORY_READ: "inventory.read",
  INVENTORY_UPDATE: "inventory.update",
  INVENTORY_TRANSFER: "inventory.transfer",

  // Users
  USER_CREATE: "users.create",
  USER_READ: "users.read",
  USER_UPDATE: "users.update",
  USER_DELETE: "users.delete",

  // Roles
  ROLE_CREATE: "roles.create",
  ROLE_READ: "roles.read",
  ROLE_UPDATE: "roles.update",
  ROLE_DELETE: "roles.delete",

  // POS
  POS_ACCESS: "pos.access",
  POS_SALE_CREATE: "pos.sales.create",

  // Reports
  REPORT_READ: "reports.read",
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];