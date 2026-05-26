import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// Acepta un array de números (ej: 1 para dueño, 2 para admin, 3 para trabajador)
export const Roles = (...roles: number[]) => SetMetadata(ROLES_KEY, roles);