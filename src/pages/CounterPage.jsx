import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';

const CounterPage = () => {
  const [countInput, setCountInput] = useState(0);

  const countSelector = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  return (
    <main className="min-h-[80vh] max-w-screen-md mx-auto px-4 mt-8 flex flex-col justify-center items-center gap-4">
      <p className="text-5xl font-bold">count: {countSelector.count}</p>

      <div className="flex items-center gap-4">
        <Button onClick={() => dispatch({ type: 'DECREMENT' })} size="icon">
          <Minus className="h-6 w-6" />
        </Button>

        <Button onClick={() => dispatch({ type: 'INCREMENT' })} size="icon">
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex gap-2 mt-8">
        <Input type="number" onChange={(e) => setCountInput(e.target.value)} />
        <Button
          onClick={() => dispatch({ type: 'SET_COUNT', payload: countInput })}
        >
          Submit
        </Button>
      </div>
    </main>
  );
};

export default CounterPage;
