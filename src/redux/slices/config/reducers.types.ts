/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-24
 * @version 2.3.0
 */

export interface ConfigurationState {
  initiated: boolean;
  panels: {
    showXmlToJson?: boolean;
    showXmlToScenario?: boolean;
    showXmlToEnvironment?: boolean;
  };
  session: {
    activeTab: string;
    environment: {
      template: string;
      strings: string;
      filename: string;
      resizeLayout: [number, number];
      panelsShown: {
        noiseAmplitudes: boolean;
        terrain: boolean;
        deposit: boolean;
        detail: boolean;
        prop: boolean;
        trees: boolean;
        seasons: boolean;
      }
    };
    scenario: {
      template: string;
      strings: string;
      filename: string;
      resizeLayout: [number, number];
      resizeViewer: [number, number];
      panelsShown: {
        general: boolean;
        disasters: boolean;
        milestones: boolean;
        goals: boolean;
        events: boolean;
        locations: boolean;
      }
    };
    xmlEditor: {
      template: string;
      filename: string;
    };
    xmlJson: {
      template: string;
      resizeLayout: [number, number];
    };
    xmlEnvironment: {
      template: string;
      resizeLayout: [number, number];
    };
    xmlScenario: {
      template: string;
      resizeLayout: [number, number];
    };
  };
}

