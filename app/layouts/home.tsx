import { Button } from "@ui/button";
import { ButtonGroup } from "@ui/button-group";
import { useState } from "react";
import { MinusIcon, PlusIcon, RefreshCwIcon } from "lucide-react";
import AppTooltip from "@components/app/appTooltip";

const HomePageLayout = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const resetCount = () => setCount(0);

  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-4xl capitalize">Basic counter app</h1>
      <h3 className="text-2xl">{count}</h3>
      <div>
        <ButtonGroup>
          <AppTooltip message="Decrement" side="left">
            <Button onClick={decrement}>
              <MinusIcon />
            </Button>
          </AppTooltip>
          <AppTooltip message="Reset">
            <Button onClick={resetCount}>
              <RefreshCwIcon />
            </Button>
          </AppTooltip>
          <AppTooltip message="Increment" side="right">
            <Button onClick={increment}>
              <PlusIcon />
            </Button>
          </AppTooltip>
        </ButtonGroup>
      </div>
    </main>
  );
};
export default HomePageLayout;
