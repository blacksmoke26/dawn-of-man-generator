/**
 * Environment `eurasia_glacial`
 * This scenario tailored to some challenges too
 * @link http://madrugaworks.com/dawnofman/files/BuiltinEnvironments.zip
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

/** Environment info */
export const info = {
	label: 'Eurasia Glacial',
	value: 'eurasia_glacial',
	desc: 'This scenario tailored to some of the challenges too',
};

/** Environment raw data */
const environmentData = {
	environment: {
		resource_factor: {
			value: 0.6
		},
		sun_angle_factor: {
			value: 0.8
		},
		trees: {
			values: 'Fir Pine Spruce Blackberry Blueberry Raspberry Strawberry Chestnut Pear Cherry Service'
		},
		deposits: {
			values: ''
		},
		tree_override_prototypes: {
			tree_override_prototype: [
				{
					id: {
						value: 'Fir'
					},
					min_altitude: {
						value: 0
					},
					max_altitude: {
						value: 14
					}
				},
				{
					id: {
						value: 'Spruce'
					},
					min_altitude: {
						value: 0
					},
					max_altitude: {
						value: 14
					}
				},
				{
					id: {
						value: 'Pine'
					},
					min_altitude: {
						value: 2
					},
					max_altitude: {
						value: 16
					}
				}
			]
		},
		seasons: {
			season: [
				{
					id: 'Spring',
					setup_id: 'Spring',
					duration: 0.2,
					precipitation_chance: 0.25,
					windy_chance: 0.5,
					very_windy_chance: 0.1,
					fish_boost: 0.25,
					min_temperature: {
						value: 5
					},
					max_temperature: {
						value: 25
					}
				},
				{
					id: 'Summer',
					setup_id: 'Summer',
					duration: 0.2,
					precipitation_chance: 0,
					windy_chance: 0.25,
					min_temperature: {
						value: 20
					},
					max_temperature: {
						value: 35
					},
					min_wind: {
						value: 0
					},
					max_wind: {
						value: 5
					}
				},
				{
					id: 'Fall',
					setup_id: 'Fall',
					duration: 0.2,
					precipitation_chance: 0.25,
					windy_chance: 0.5,
					very_windy_chance: 0.1,
					min_temperature: {
						value: 5
					},
					max_temperature: {
						value: 25
					}
				},
				{
					id: 'Winter',
					setup_id: 'Winter',
					snow_setup_id: 'WinterSnow',
					duration: 0.4,
					precipitation_chance: 1,
					windy_chance: 0.5,
					very_windy_chance: 0.5,
					reduced_fish: true,
					reduced_fauna: true,
					min_temperature: {
						value: -15
					},
					max_temperature: {
						value: 10
					}
				}
			]
		}
	}
};

/** Get environment data */
export default function getData() {
	return Object.assign({}, environmentData);
}
