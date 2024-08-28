import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Provider } from "jotai";
import { AudioContextProvider } from "@/store";

export default function AudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <AudioContextProvider>
        <section className="w-screen h-screen">{children}</section>
      </AudioContextProvider>
    </Provider>
  );
}
