"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { toast } from 'sonner';
import { Search, X, RefreshCw, Download } from "lucide-react";
// --- NEW IMPORTS ---
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ta } from "date-fns/locale/ta"; // Import Tamil locale
// --- END NEW IMPORTS ---

// Shadcn UI Components (Removed Popover and Calendar)
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Define the data row structure
interface SheetRow {
  Timestamp: string;
  FullName: string;
  PhoneNumber: string;
  Constituency: string;
  PartyRole: string;
  [key: string]: any;
}

interface AdminTableProps {
  initialData: SheetRow[];
}

export default function AdminTable({ initialData }: AdminTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // DatePicker likes null for "empty"

  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      toast.error("No data to export");
      return;
    }

    // 1. Create CSV Header
    const csvHeader = headers.join(",");

    // 2. Create CSV Rows
    const csvRows = filteredData.map((row) => {
      const values = headers.map((header) => {
        let value = String(row[header]);
        // Handle values with commas by wrapping them in double quotes
        if (value.includes(",")) {
          value = `"${value}"`;
        }
        return value;
      });
      return values.join(",");
    });

    // 3. Join Header and Rows
    // This is the NEW, corrected line
    const csvContent = "\uFEFF" + [csvHeader, ...csvRows].join("\n");

    // 4. Create Blob
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // 5. Create Timestamped Filename
    const timestamp = format(new Date(), "yyyy-MM-dd_HHmm");
    const filename = `ATMK_Export_${timestamp}.csv`;

    // 6. Trigger Download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const headers = useMemo(() => {
    if (initialData.length === 0) {
      return [
        "Timestamp",
        "FullName",
        "PhoneNumber",
        "Constituency",
        "PartyRole",
      ];
    }
    return Object.keys(initialData[0]);
  }, [initialData]);

  const filteredData = useMemo(() => {
    let filtered = initialData;

    // 1. Filter by Search Query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(lowerCaseQuery)
        )
      );
    }

    // 2. Filter by Selected Date
    if (selectedDate) {
      filtered = filtered.filter((row) => {
        try {
          const rowDate = new Date(row.Timestamp);
          if (isNaN(rowDate.getTime())) return false;
          return isSameDay(rowDate, selectedDate);
        } catch (e) {
          return false;
        }
      });
    }

    return filtered;
  }, [initialData, searchQuery, selectedDate]);

  return (
    <>
      {/* --- ADD THIS STYLE TO FIX react-datepicker STYLING --- */}
      <style>
        {`
          .react-datepicker-wrapper { width: 100%; }
          .react-datepicker__input-container { display: block; }
          .react-datepicker__input-container input {
            width: 100%;
            border: 1px solid hsl(var(--border));
            border-radius: 0.375rem; /* rounded-md */
            padding: 0.5rem 0.75rem; /* px-3 py-2 */
            font-size: 0.875rem; /* text-sm */
          }
          .react-datepicker__clear-button {
            right: 10px !important;
          }
        `}
      </style>

      <Card>
        <CardHeader>
          <div className="flex sm:flex-auto items-center justify-between" >
            <CardTitle>உறுப்பினர் பதிவுகள்</CardTitle>
            <Button
              variant="default" // Main action color
              onClick={handleExportCSV}
               // Take remaining space on mobile
            >
              பதிவிறக்கம் <Download className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="பெயர், தொலைபேசி மூலம் தேடவும்..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>

            {/* --- NEW DATE PICKER --- */}
            <div className="w-full sm:w-[240px] border border-input rounded-xl shadow-sm">
              <DatePicker
                locale="ta"
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                isClearable
                placeholderText="தேதியைத் தேர்ந்தெடுக்கவும்"
                className="w-full  " // The style tag above will target this
                dateFormat="dd/MM/yyyy"
              />
            </div>
            {/* --- END NEW DATE PICKER --- */}

            {/* Clear Button */}
            {(searchQuery || selectedDate) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDate(null); // Use null
                }}
              >
                Clear <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto relative border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {headers.map((header) => (
                        <TableCell key={header}>
                          {header === "Timestamp"
                            ? (() => {
                                const date = new Date(row[header]);

                                if (!isNaN(date.getTime())) {
                                  return (
                                    <>
                                      <div className="font-medium">
                                        {format(date, "dd MMM yyyy")}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {format(date, "p")}
                                      </div>
                                    </>
                                  );
                                } else {
                                  return (
                                    <span className="text-red-500">
                                      Invalid Date
                                    </span>
                                  );
                                }
                              })()
                            : row[header]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={headers.length}
                      className="h-24 text-center"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
