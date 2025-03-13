import { useState } from 'react';
import { Slider } from '@rneui/themed';

function CostCalculator() {
  const [sliderValue, setSliderValue] = useState(0);
  
  return (
    <View>
      <Slider
        value={sliderValue}
        onValueChange={setSliderValue}
        minimumValue={0}
        maximumValue={100}
        step={1}
      />
    </View>
  );
}

export default CostCalculator; 