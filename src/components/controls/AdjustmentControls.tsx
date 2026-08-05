import React from 'react';
import { useImageStore } from '../../store/useImageStore';
import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';

export const AdjustmentControls: React.FC = () => {
  const adjustmentSettings = useImageStore((state) => state.adjustmentSettings);
  const updateAdjustmentSettings = useImageStore((state) => state.updateAdjustmentSettings);

  return (
    <div className="flex flex-col gap-4">
      <Slider
        label="Brightness"
        min={0}
        max={200}
        step={5}
        unit="%"
        value={adjustmentSettings.brightness}
        onChange={(val) => updateAdjustmentSettings({ brightness: val })}
        marks={[
          { value: 0, label: '0%' },
          { value: 100, label: 'Normal (100%)' },
          { value: 200, label: '200%' },
        ]}
      />

      <Slider
        label="Contrast"
        min={0}
        max={200}
        step={5}
        unit="%"
        value={adjustmentSettings.contrast}
        onChange={(val) => updateAdjustmentSettings({ contrast: val })}
        marks={[
          { value: 0, label: '0%' },
          { value: 100, label: 'Normal (100%)' },
          { value: 200, label: '200%' },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 pt-1">
        <Toggle
          checked={adjustmentSettings.grayscale}
          onChange={(checked) => updateAdjustmentSettings({ grayscale: checked })}
          label="Grayscale"
          description="B&W Filter"
        />

        <Toggle
          checked={adjustmentSettings.sepia}
          onChange={(checked) => updateAdjustmentSettings({ sepia: checked })}
          label="Sepia"
          description="Vintage Filter"
        />
      </div>
    </div>
  );
};
