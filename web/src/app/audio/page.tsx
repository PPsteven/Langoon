"use client";

import type React from "react";
import dynamic from "next/dynamic";
import { Dict } from "@/components/read/Dict";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const Transcript = dynamic(() => import("@/components/read/Transcript"), {
  ssr: false,
});
const Control = dynamic(() => import("@/components/read/Control"), {
  ssr: false,
});
const SentencePanel = dynamic(() => import("@/components/read/SentencePanel"), {
  ssr: false,
});

export default function Audio() {
  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={80}>
        <div className="flex flex-col h-full p-2">
          <div className="w-full grow flex justify-start items-center">
            <SentencePanel />
          </div>
          <div className="w-full grow-0 h-20">
            <Control />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={20} minSize={20}>
        <div className="h-full p-2">
          <Transcript />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
