import { connectDatabase, disconnectDatabase } from '../src/infrastructure/database/mongoose.js';
import { seedRoles } from './seed-roles.js';

try {
  await connectDatabase();
  await seedRoles();
} catch (error) {
  console.error('Unable to seed roles:', error);
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
