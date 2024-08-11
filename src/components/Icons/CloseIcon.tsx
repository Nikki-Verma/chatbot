import React from 'react';
import Svg, { G, Path, ClipPath, Defs, Rect } from 'react-native-svg';

const CloseLogo = ({ style }: { style?: any }) => (
<Svg width="19" height="19" viewBox="0 0 19 19" fill="none" style={style}>
  <Path fill-rule="evenodd" clip-rule="evenodd" d="M4.09141 13.4546C3.79726 13.7488 3.79731 14.2257 4.0915 14.5199C4.38569 14.814 4.86261 14.814 5.15675 14.5198L9.36381 10.312L13.5712 14.5194C13.8654 14.8136 14.3423 14.8136 14.6365 14.5194C14.9306 14.2253 14.9306 13.7483 14.6365 13.4542L10.429 9.24668L14.6362 5.03876C14.9302 4.74457 14.9302 4.26764 14.636 3.97351C14.3419 3.67937 13.8649 3.67941 13.5708 3.9736L9.36366 8.18144L5.15623 3.97396C4.86208 3.6798 4.38514 3.6798 4.09099 3.97396C3.79682 4.26813 3.79682 4.74505 4.09099 5.03922L8.29857 9.24676L4.09141 13.4546Z" fill="white"/>
</Svg>
);

const CloseIcon = ({ style }: { style?: any }) => {
  return <CloseLogo style={style} />;
};

export default CloseIcon;