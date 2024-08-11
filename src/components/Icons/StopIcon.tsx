import React from 'react';
import Svg, { G, Path, ClipPath, Defs, Rect } from 'react-native-svg';

const StopLogo = ({ style }: { style?: any }) => (
    <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    style={style}
    >
    <Path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M12 1.75C6.343 1.75 1.75 6.343 1.75 12C1.75 17.657 6.343 22.25 12 22.25C17.657 22.25 22.25 17.657 22.25 12C22.25 6.343 17.657 1.75 12 1.75ZM12 3.25C16.8295 3.25 20.75 7.1705 20.75 12C20.75 16.8295 16.8295 20.75 12 20.75C7.1705 20.75 3.25 16.8295 3.25 12C3.25 7.1705 7.1705 3.25 12 3.25ZM15.75 14.0005V10.0005C15.75 9.03399 14.9665 8.25049 14 8.25049H10C9.0335 8.25049 8.25 9.03399 8.25 10.0005V14.0005C8.25 14.967 9.0335 15.7505 10 15.7505H14C14.9665 15.7505 15.75 14.967 15.75 14.0005Z"
    fill="#444444"
    />
    </Svg>
);

const StopIcon = ({ style }: { style?: any }) => {
  return <StopLogo style={style} />;
};

export default StopIcon;