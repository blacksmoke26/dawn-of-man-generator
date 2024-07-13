/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-15
 * @version 2.1.1
 */

//<editor-fold desc="Taken from https://stackoverflow.com/questions/55539387/deep-omit-with-typescript">
/** Union of primitives to skip with deep omit utilities. */
type Primitive = string | Function | number | boolean | Symbol | undefined | null

/** Deeply omit members of an array of interface or array of type. */
export type DeepOmitArray<T extends any[], K> = {
  [P in keyof T]: DeepOmit<T[P], K>
}

/** Deeply omit members of an interface or type. */
export type DeepOmit<T, K> = T extends Primitive ? T : {
  [P in Exclude<keyof T, K>]: //extra level of indirection needed to trigger homomorhic behavior
  T[P] extends infer TP ? // distribute over unions
    TP extends Primitive ? TP : // leave primitives and functions alone
      TP extends any[] ? DeepOmitArray<TP, K> : // Array special handling
        DeepOmit<TP, K>
    : never
}

/** Deeply omit members of an array of interface or array of type, making all members optional. */
export type PartialDeepOmitArray<T extends any[], K> = Partial<{
  [P in Partial<keyof T>]: Partial<PartialDeepOmit<T[P], K>>
}>

/** Deeply omit members of an interface or type, making all members optional. */
export type PartialDeepOmit<T, K> = T extends Primitive ? T : Partial<{
  [P in Exclude<keyof T, K>]: //extra level of indirection needed to trigger homomorhic behavior
  T[P] extends infer TP ? // distribute over unions
    TP extends Primitive ? TP : // leave primitives and functions alone
      TP extends any[] ? PartialDeepOmitArray<TP, K> : // Array special handling
        Partial<PartialDeepOmit<TP, K>>
    : never
}>
//</editor-fold>

//<editor-fold desc="Copied from: https://dev.to/pffigueiredo/typescript-utility-keyof-nested-object-2pa3">
export type NestedKeyOf<ObjectType extends object> =
  {[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
  }[keyof ObjectType & (string | number)];
//</editor-fold>
