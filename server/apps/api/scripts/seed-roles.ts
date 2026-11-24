import { Role } from "../src/modules/roles/models/role.model.js"
import { PERMISSIONS } from "../src/modules/constants/permissions.js";

const allPermissions = Object.values(PERMISSIONS);

const defaultRoles = [
  {
    name: "Super Admin",
    slug: "super-admin",
    description: "System administrator",
    permissions: allPermissions,
    isSystem: true,
  },

  {
    name: "Store Manager",
    slug: "store-manager",
    description: "Manages store operations",
    permissions: [
      "products.create",
      "products.read",
      "products.update",
      "categories.read",
      "orders.read",
      "orders.update",
      "inventory.read",
      "inventory.update",
      "users.read",
      "reports.read",
    ],
    isSystem: true,
  },

  {
    name: "Inventory Manager",
    slug: "inventory-manager",
    description: "Manages inventory operations",
    permissions: [
      "products.read",
      "inventory.read",
      "inventory.update",
      "inventory.transfer",
    ],
    isSystem: true,
  },

  {
    name: "Sales Staff",
    slug: "sales-staff",
    description: "Handles POS sales",
    permissions: [
      "products.read",
      "orders.read",
      "pos.access",
      "pos.sales.create",
    ],
    isSystem: true,
  },

  {
    name: "Customer",
    slug: "customer",
    description: "Regular customer account",
    permissions: [],
    isSystem: true,
  },
];

export const seedRoles = async () => {
  for (const role of defaultRoles) {
    await Role.updateOne(
      { slug: role.slug },
      { $set: role },
      { upsert: true }
    );
  }

  console.log("Default roles seeded successfully");
};