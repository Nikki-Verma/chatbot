import {Buffer} from 'buffer';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, View} from 'react-native';
import Svg, {Line} from 'react-native-svg';

const {width: screenWidth} = Dimensions.get('window');

const AudioVisualizer = ({base64AudioData, isAgent}: any) => {
  const [waveform, setWaveform] = useState<
    {x: number; y1: number; y2: number}[]
  >([]);
  const svgRef = useRef(null);

  const containerWidth = screenWidth * 0.5;
  const containerHeight = 100;
  const minHeight = 20; // Set minimum height to 20
  const lineSpacing = 4; // Increase this value to add more space between lines

  useEffect(() => {
    if (base64AudioData) {
      const decodedData = decodeBase64ToPCM(base64AudioData);
      const newWaveform = generateWaveform(decodedData);
      setWaveform(newWaveform);
    }
  }, [base64AudioData]);

  const decodeBase64ToPCM = (base64Data: any) => {
    const buffer = Buffer.from(base64Data, 'base64');
    const pcmData = new Int16Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength / Int16Array.BYTES_PER_ELEMENT,
    );
    return pcmData;
  };

  const generateWaveform = (pcmData: Int16Array) => {
    const step = Math.floor(pcmData.length / (containerWidth / lineSpacing));

    return pcmData.reduce<{x: number; y1: number; y2: number}[]>(
      (result, value, index) => {
        if (index % step === 0) {
          const x = (index / step) * lineSpacing;
          const normalizedValue = Math.abs(value) / 32768; // Normalize value to range [0, 1]
          const amplitude =
            (normalizedValue * (containerHeight - minHeight)) / 2; // Calculate amplitude based on the normalized value
          const y1 = containerHeight / 2 - (minHeight / 2 + amplitude);
          const y2 = containerHeight / 2 + (minHeight / 2 + amplitude);
          result.push({x, y1, y2});
        }
        return result;
      },
      [],
    );
  };

  return (
    <View
      style={{
        width: containerWidth,
        height: containerHeight,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Svg
        ref={svgRef}
        height={containerHeight}
        width={containerWidth}
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}>
        {waveform.map((point, index) => (
          <Line
            key={index}
            x1={point.x}
            y1={point.y1}
            x2={point.x}
            y2={point.y2}
            stroke={isAgent ? '#C266E7' : '#20D1DC'}
            strokeWidth="2"
          />
        ))}
      </Svg>
    </View>
  );
};

export default AudioVisualizer;
