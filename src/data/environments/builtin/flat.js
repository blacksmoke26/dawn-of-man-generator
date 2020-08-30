// @flow

/**
 * Environment `flat`
 * Flat land with specific resources
 * @link http://madrugaworks.com/dawnofman/files/BuiltinEnvironments.zip
 * @author Junaid Atari <mj.atari@gmail.com>
 * @since 2020-08-29
 */

/** Environment info */
export const info = {
	label: 'Flat',
	value: 'flat',
	desc: 'Flat land with specific resources',
};

/** Environment raw data */
const environmentData: Object = {
	'environment': {
		'noise_amplitudes': {
			'values': 0
		},
		'trees': {
			'values': 'Oak'
		},
		'trees_everywhere': {
			'value': true
		},
		'seasons': {
			'season': [
				{
					'id': 'Spring',
					'setup_id': 'Spring',
					'duration': 0.25,
					'precipitation_chance': 0,
					'windy_chance': 0,
					'very_windy_chance': 0,
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
					'windy_chance': 0,
					'very_windy_chance': 0,
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
					'precipitation_chance': 0,
					'windy_chance': 0,
					'very_windy_chance': 0,
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
					'precipitation_chance': 0,
					'windy_chance': 0,
					'very_windy_chance': 0,
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

export default function getData (): Object {
	return {...environmentData};
}
