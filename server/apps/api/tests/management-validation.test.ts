import { test } from "node:test";
import assert from "node:assert/strict";
import { createOrganization, updateOrganization } from "../src/modules/organizations/validators/organization.validator.js";
import { createStore } from "../src/modules/stores/validators/store.validator.js";
import { assignRole, createEmployee } from "../src/modules/employees/validators/employee.validator.js";

const id = "507f1f77bcf86cd799439011";
test("organization validation rejects invalid timezone and unknown fields", () => {
  const body = { name: "Example", slug: "example", currency: "usd", timezone: "UTC" };
  assert.equal(createOrganization.safeParse({ body }).success, true);
  assert.equal(createOrganization.safeParse({ body: { ...body, timezone: "invalid/zone" } }).success, false);
  assert.equal(createOrganization.safeParse({ body: { ...body, status: "active" } }).success, false);
  assert.equal(updateOrganization.safeParse({ params: { id }, body: { name: "New" } }).success, false);
});
test("store creation requires a valid organization and rejects privileged fields", () => {
  const body = { organizationId: id, code: "main", name: "Main", address: "123 Main Street" };
  assert.equal(createStore.safeParse({ body }).success, true);
  assert.equal(createStore.safeParse({ body: { ...body, organizationId: "bad" } }).success, false);
  assert.equal(createStore.safeParse({ body: { ...body, status: "archived" } }).success, false);
});
test("role assignments enforce store scope and reject global assignments", () => {
  const body = { roleId: id, organizationId: id, scope: "store", storeIds: [id] };
  assert.equal(assignRole.safeParse({ params: { id }, body }).success, true);
  assert.equal(assignRole.safeParse({ params: { id }, body: { ...body, storeIds: [] } }).success, false);
  assert.equal(assignRole.safeParse({ params: { id }, body: { ...body, storeIds: [id, id] } }).success, false);
  assert.equal(assignRole.safeParse({ params: { id }, body: { ...body, scope: "global" } }).success, false);
  assert.equal(assignRole.safeParse({ params: { id }, body: { ...body, scope: "organization", storeIds: [id] } }).success, false);
});
test("employee input rejects extra privilege fields and bcrypt inputs over 72 bytes", () => {
  const body = { firstName: "Jane", lastName: "Doe", email: "jane@example.com", password: "password123" };
  assert.equal(createEmployee.safeParse({ body }).success, true);
  assert.equal(createEmployee.safeParse({ body: { ...body, isEmployee: false } }).success, false);
  assert.equal(createEmployee.safeParse({ body: { ...body, password: "x".repeat(73) } }).success, false);
});
