"use client";

import type React from "react";
import { useState } from "react";
import { Text } from "@/components/read/Text";
import { Dict } from "@/components/read/Dict";
import { Control } from "@/components/read/Control";
import { PlayerContextProvider } from "@/store";
import "../../styles/theme.css";

export default function Audio() {
  return (
    <div className="w-full h-screen">
      <PlayerContextProvider>
        <div className="h-full flex flex-col">
          <div className="w-full bg-white flex justify-center grow overflow-y-auto">
            <div className="w-1/2 flex justify-center">
              <Text/>
            </div>
            <Dict/>
          </div>
          <Control />
        </div>
      </PlayerContextProvider>
    </div>
  );
}
