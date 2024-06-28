/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @version 2.2
 */

// components
import {Container} from 'react-bootstrap';

// types
import type { Preview } from "@storybook/react";

// styles
import '~/styles/uikit/bootstrap.min.css';
import '~/styles/uikit/bootstrap_limitless.min.css';
import '~/styles/uikit/layout.min.css';
import '~/styles/uikit/colors.min.css';
import 'rc-slider/assets/index.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import '~/styles/custom.css';
import '~/styles/global.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <Container style={{width: 900, minHeight: 400}}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </Container>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
