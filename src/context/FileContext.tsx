// context/FileContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface SheetDetail {
  description: string;
  amount: number;
}

export interface SheetData {
  sheetCode: string;
  sheetDescription: string;
  sheetDetails: SheetDetail[];
  sumOfSheet: number;
}

export interface SheetSummaryDetail {
  sheetCategoryCode: string;
  sheetCategoryDescription: string;
  sumOfSheetCategory: number;
  sheetCategoryDetails: SheetDetail[];
}

export interface PLData {
  grossProfit: number;
  earningBeforeTax: number;
  earningAfterTax: number;
  sheetSummaryDetails: SheetSummaryDetail[];
}

export interface BSDetailedItem {
  description: string;
  amount: number;
  sheetDetails?: SheetDetail[]; // for nested breakdowns
}

export interface BSCategory {
  sheetCategoryDescription: string;
  sumOfSheetCategory: number;
  sheetCategoryDetails: BSDetailedItem[];
}

export interface FileData {
  sheetsList: SheetData[];
  "P&L"?: PLData;
  BS?: BSCategory[];
  id?: number;
  companyDescription?: string;
  yearDescription?: string;
  monthDescription?: string;
}

interface FileContextType {
  fileData: FileData | null;
  setFileData: (data: FileData) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [fileData, setFileData] = useState<FileData | null>(null);

  useEffect(() => {
    console.log("Context fileData updated:", fileData);
  }, [fileData]);

  return (
    <FileContext.Provider value={{ fileData, setFileData }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context)
    throw new Error("useFileContext must be used within FileProvider");
  return context;
};
