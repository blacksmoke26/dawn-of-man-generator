// @flow

/**
 * Environment `eurasia_flatlands`
 * This scenario tailored to some of the challenges too
 * @link http://madrugaworks.com/dawnofman/files/BuiltinEnvironments.zip
 * @author Junaid Atari <mj.atari@gmail.com>
 * @since 2020-08-29
 */

/** Environment info */
export const info = {
	label: 'Eurasia Flatlands',
	value: 'eurasia_flatlands',
	desc: 'This scenario tailored to some of the challenges too',
};

/** Environment raw data */
const environmentData: Object = {
	'environment': {
		'noise_amplitudes': {
			'values': '0.0 0.03 0.2 0.154 0.097 0.045 0.025 0.005'
		},
		'trees': {
			'values': 'Oak Birch Beech Rye Einkorn Emmer Flax BitterVetch Chickpeas Lentils Peas Blackberry Blueberry Raspberry Strawberry Chestnut Pear Cherry Service'
		},
		'deposits': {
			'values': 'Flint'
		},
		'distance_height_offset': {
			'value': 0.02
		},
		'seasons': {
			'season': [
				{
					'id': 'Spring',
					'setup_id': 'Spring',
					'duration': 0.25,
					'precipitation_chance': 0.25,
					'windy_chance': 0.5,
					'very_windy_chance': 0.1,
					'fish_boost': 0.5,
					'min_temperature': {
						'value': 5
					},
					'max_temperature': {
						'value': 25
					}
				},
				{
					'id': 'Summer',
					'setup_id': 'Summer',
					'duration': 0.25,
					'precipitation_chance': 0,
					'windy_chance': 0.25,
					'min_temperature': {
						'value': 20
					},
					'max_temperature': {
						'value': 35
					},
					'min_wind': {
						'value': 0
					},
					'max_wind': {
						'value': 5
					}
				},
				{
					'id': 'Fall',
					'setup_id': 'Fall',
					'duration': 0.25,
					'precipitation_chance': 0.25,
					'windy_chance': 0.5,
					'very_windy_chance': 0.1,
					'min_temperature': {
						'value': 5
					},
					'max_temperature': {
						'value': 25
					}
				},
				{
					'id': 'Winter',
					'setup_id': 'Winter',
					'snow_setup_id': 'WinterSnow',
					'duration': 0.25,
					'precipitation_chance': 0.5,
					'windy_chance': 0.5,
					'very_windy_chance': 0.5,
					'reduced_fauna': true,
					'min_temperature': {
						'value': -15
					},
					'max_temperature': {
						'value': 10
					}
				}
			]
		}
	}
};

/** Get environment data */
export default function getData (): Object {
	return {...environmentData};
}
