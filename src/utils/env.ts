/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-24
 * @version 2.3.0
 */

/** Current environment as production */
export const ENV_PROD: boolean = process.env.NODE_ENV === 'production';

/** Current environment as development (non-production) */
export const ENV_DEV: boolean = !ENV_PROD;
