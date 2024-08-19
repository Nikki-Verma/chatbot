import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';

const AudioVisualizer = ({audioData, isAgent = false}: any) => {
  const [visualData, setVisualData] = useState<number[]>([]);

  useEffect(() => {
    if (audioData) {
      // Normalize the audio data for visualization purposes
      // const buffer = new Uint8Array(audioData);
      // console.log(`ui audio buffer `,buffer)
      // const normalizedData = Array.from(buffer).map(value => value / 255);
      // setVisualData(normalizedData);
      // console.log(`normalised audio data`,normalizedData)

      console.log(`audio data`, audioData);
    }
  }, [audioData]);

  const renderBars = () => {
    const barWidth = 10;
    const barSpacing = 5;
    const bars = visualData.map((value, index) => {
      const barHeight = value * 100;
      const x = index * (barWidth + barSpacing);
      const gradientId = `grad${index}`;

      return (
        <React.Fragment key={index}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={isAgent ? '#C266E7' : '#3E5AEC'} />
              <Stop offset="1" stopColor={isAgent ? '#602EDF' : '#20D1DC'} />
            </LinearGradient>
          </Defs>
          <Rect
            x={x}
            y={50 - barHeight / 2}
            width={barWidth}
            height={barHeight}
            rx={3.75}
            ry={3.75}
            fill={`url(#${gradientId})`}
          />
        </React.Fragment>
      );
    });
    return bars;
  };

  return (
    <View style={{width: '100%', height: 60}}>
      <Svg width="100%" height="100%">
        {renderBars()}
      </Svg>
    </View>
  );
};

export default AudioVisualizer;
