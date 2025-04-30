import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { useEffect, useState } from "react";

const DiceLoading = ({
  size = 48,
  speed = 800,
  color = "currentColor",
}: {
  size?: number;
  speed?: number;
  color?: string;
}) => {
  const diceFaces = [
    <Dice1 key={1} size={size} color={color} />,
    <Dice2 key={2} size={size} color={color} />,
    <Dice3 key={3} size={size} color={color} />,
    <Dice4 key={4} size={size} color={color} />,
    <Dice5 key={5} size={size} color={color} />,
    <Dice6 key={6} size={size} color={color} />,
  ];

  const [currentFace, setCurrentFace] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFace((prev) => (prev + 1) % diceFaces.length);
    }, speed);

    return () => clearInterval(interval);
  }, [speed, diceFaces.length]);

  return (
    <div className="flex items-center justify-center">
      <div className="animate-pulse">{diceFaces[currentFace]}</div>
    </div>
  );
};

export default DiceLoading;
