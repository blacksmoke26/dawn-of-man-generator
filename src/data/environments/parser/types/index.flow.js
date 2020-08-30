/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-30
 */

/** `jsonToRedux` options argument type */
export type JsonToReduxOptions = {
	/** Null or none-exist value transformer (Defaults to {}) */
	nullResolver?: ?( wrapperKey: string ) => any,
}
