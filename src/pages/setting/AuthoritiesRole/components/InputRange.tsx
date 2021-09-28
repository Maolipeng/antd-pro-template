import { Input, Space } from 'antd';
import { useRef, useState } from 'react';

const InputRange: React.FC<{
  value?: any[];
  onChange?: (value: any) => void;
}> = ({ value, onChange }) => {
  const ref1 = useRef<Input | null>(null);
  const ref2 = useRef<Input | null>(null);
  const [input1Value, setInput1Value] = useState<string>('');
  const [input2Value, setInput2Value] = useState<string>('');
  const handleInputConfirm = () => {
    let tempsInputs = value ? [...value] : [];
    if (input1Value || input2Value) {
      tempsInputs = [input1Value, input2Value];
    }
    onChange?.(tempsInputs);
  };

  return (
    <Space>
      <Input
        ref={ref1}
        type="text"
        size="small"
        style={{ width: 78 }}
        value={input1Value}
        onChange={(e) => setInput1Value(e.target.value)}
        onBlur={handleInputConfirm}
      />
      ~
      <Input
        ref={ref2}
        type="text"
        size="small"
        style={{ width: 78 }}
        value={input2Value}
        onChange={(e) => setInput2Value(e.target.value)}
        onBlur={handleInputConfirm}
      />
    </Space>
  );
};

export default InputRange;
