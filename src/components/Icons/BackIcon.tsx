import React from 'react';
import Svg, { G, Path, ClipPath, Defs, Rect } from 'react-native-svg';

const BackLogo = ({ style }: { style?: any }) => (
<Svg width="19" height="19" viewBox="0 0 19 19" fill="none" style={style}>
  <Path d="M6.24681 9.24655C6.24681 9.10207 6.30203 8.95744 6.41233 8.84714L12.0617 3.19779C12.2824 2.97704 12.6399 2.97704 12.8605 3.19779C13.0811 3.41854 13.0812 3.776 12.8605 3.99661L7.61056 9.24655L12.8605 14.4965C13.0812 14.7172 13.0812 15.0747 12.8605 15.2953C12.6398 15.5159 12.2823 15.5161 12.0617 15.2953L6.41233 9.64596C6.30203 9.53565 6.24681 9.39103 6.24681 9.24655Z" fill="white"/>
</Svg>
);

const BackIcon = ({ style }: { style?: any }) => {
  return <BackLogo style={style} />;
};

export default BackIcon;