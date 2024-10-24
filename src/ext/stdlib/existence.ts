import { Guards } from "@ts-belt"

/**
 * Returns true if the given value exists (is neither `undefined` nor `null`).
 *
 * Short replacement for somewhat unclean `if (value != null)` checks which use coercion and `null`
 * and unsafe `if (value)` checks which use coercion and match `""`, `0`, and `NaN` as well.
 *
 * Coercion to boolean and mixing `null` and `undefined` often lead to hard-to-spot bugs.
 *
 * The opposite of {@link nil}.
 */
export const def = Guards.isNotNullable

/**
 * Returns true if the given value doesn't exist (is `undefined` or `null`).
 *
 * Short replacement for somewhat unclean `if (value == null)` checks which use coercion and `null`
 * or unsafe `if (!value)` checks which use coercion and match `""`, `0`, and `NaN` as well.
 *
 * Coercion to boolean and mixing `null` and `undefined` often lead to hard-to-spot bugs.
 *
 * The opposite of {@link def}.
 */
export const nil = Guards.isNullable
