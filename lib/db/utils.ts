
import { sql, type Column, type ColumnBaseConfig } from 'drizzle-orm';

/**
 * Sistema de comparação segura para IDs (VARCHAR)
 * Resolve erros de "Illegal mix of collations" forçando a collation correta.
 * Use isso no lugar de eq(col1, col2) quando fizer JOINs.
 */
export function safeEq(left: Column<ColumnBaseConfig<"string", string>>, right: Column<ColumnBaseConfig<"string", string>>) {
  return sql`${left} = ${right} COLLATE utf8mb4_0900_ai_ci`;
}

/**
 * Sistema de comparação segura para valores fixos
 */
export function safeEqValue(left: Column<ColumnBaseConfig<"string", string>>, value: string) {
  return sql`${left} = ${value} COLLATE utf8mb4_0900_ai_ci`;
}
