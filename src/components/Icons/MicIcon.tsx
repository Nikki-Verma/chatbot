import React from 'react';
import Svg, { G, Path, ClipPath, Defs, Rect } from 'react-native-svg';

const MicLogo = ({ style }: { style?: any }) => (
<Svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={style}>
  <G clip-path="url(#clip0_7058_13184)">
    <Path d="M20.1837 11.5485C20.1837 11.1743 19.8804 10.8711 19.5063 10.8711C19.1321 10.8711 18.8288 11.1743 18.8288 11.5485C18.8288 15.2495 15.8178 18.2606 12.1168 18.2606C8.41579 18.2606 5.40475 15.2494 5.40475 11.5485C5.40475 11.1743 5.10145 10.8711 4.72734 10.8711C4.35323 10.8711 4.04993 11.1743 4.04993 11.5485C4.04993 15.7685 7.3071 19.2414 11.4394 19.5867V21.9834H8.42202C8.04791 21.9834 7.74461 22.2866 7.74461 22.6608C7.74461 23.035 8.04791 23.3382 8.42202 23.3382H15.8115C16.1856 23.3382 16.4889 23.035 16.4889 22.6608C16.4889 22.2866 16.1856 21.9834 15.8115 21.9834H12.7941V19.5867C16.9264 19.2414 20.1837 15.7685 20.1837 11.5485Z" fill="black"/>
    <Path d="M12.1161 15.921C14.527 15.921 16.4883 13.9596 16.4883 11.5489V5.11331C16.4883 2.70254 14.527 0.741211 12.1161 0.741211C9.70535 0.741211 7.74402 2.70254 7.74402 5.11331V11.5489C7.74402 13.9597 9.70535 15.921 12.1161 15.921ZM9.09884 5.11331C9.09884 3.44959 10.4524 2.09603 12.1161 2.09603C13.7799 2.09603 15.1335 3.44959 15.1335 5.11331V11.5489C15.1335 13.2126 13.7799 14.5662 12.1161 14.5662C10.4524 14.5662 9.09884 13.2126 9.09884 11.5489V5.11331Z" fill="black"/>
  </G>
  <Defs>
    <ClipPath id="clip0_7058_13184">
      <Rect width="22.5974" height="22.5974" fill="white" transform="translate(0.818115 0.741211)"/>
    </ClipPath>
  </Defs>
</Svg>
);

const MicIcon = ({ style }: { style?: any }) => {
  return <MicLogo style={style} />;
};

export default MicIcon;