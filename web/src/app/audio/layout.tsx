import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Provider } from "jotai";
import { PlayerContextProvider } from "@/store";
import { WordList } from "@/components/read/WordList";

export default function AudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <PlayerContextProvider>
        <section className="w-screen h-screen">{children}</section>
      </PlayerContextProvider>
    </Provider>
  );
}
