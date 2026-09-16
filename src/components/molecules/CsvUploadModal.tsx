"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, X, Loader2, FileSpreadsheet } from "lucide-react";
import Papa from "papaparse";
import { getAuthHeaders } from "@/lib/auth";

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CsvUploadModal({ isOpen, onClose, onSuccess }: CsvUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewStats, setPreviewStats] = useState<{
    total: number;
    sampleHeaders: string[];
    validGstinCount: number;
    invalidGstinCount: number;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const processFilePreview = (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMsg(null);
    setUploadResult(null);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      preview: 500,
      complete: (results) => {
        const rows = results.data as Array<Record<string, string>>;
        const headers = results.meta.fields || [];
        let validCount = 0;
        let invalidCount = 0;

        rows.forEach((r) => {
          const gstin = (r.gstin || r.GSTIN || "").trim().toUpperCase();
          if (GSTIN_REGEX.test(gstin)) {
            validCount++;
          } else {
            invalidCount++;
          }
        });

        setPreviewStats({
          total: rows.length,
          sampleHeaders: headers.slice(0, 6),
          validGstinCount: validCount,
          invalidGstinCount: invalidCount,
        });
      },
      error: (err) => {
        setErrorMsg(`Failed to parse CSV: ${err.message}`);
      },
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".csv")) {
        processFilePreview(droppedFile);
      } else {
        setErrorMsg("Please upload a standard CSV file (.csv)");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFilePreview(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/analytics/upload", {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to process upload");
      }

      setUploadResult("Successfully ingested store logs and retrained ML pipeline!");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1800);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Upload processing failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#222E3A] bg-[#12181D] p-6 shadow-2xl text-[#EDE6D9]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#8A949E] hover:bg-[#1A232C] hover:text-[#EDE6D9] transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9A15B]/15 text-[#D9A15B] border border-[#D9A15B]/30">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#EDE6D9]">Ingest Store Transaction Logs</h3>
            <p className="text-xs text-[#8A949E]">
              CSV data with 15-char Indian GSTIN verification and ML retraining
            </p>
          </div>
        </div>

        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-7 text-center transition-all cursor-pointer ${
            dragActive
              ? "border-[#D9A15B] bg-[#D9A15B]/10"
              : "border-[#222E3A] bg-[#0A0E12] hover:border-[#D9A15B]/50 hover:bg-[#151C23]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <UploadCloud className="h-10 w-10 text-[#8A949E] mb-2" />
          <p className="text-sm font-medium text-[#EDE6D9]">
            Click to browse or drag & drop Kaggle/retail CSV here
          </p>
          <p className="text-xs text-[#8A949E] mt-1">
            Required fields: <span className="text-[#D9A15B] font-mono">gstin, total_amount, order_date, shop_name</span>
          </p>
          {file && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#141C24] px-3 py-1.5 text-xs text-[#4E9B8F] border border-[#4E9B8F]/40">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}
        </div>

        {/* Client-Side Validation Preview */}
        {previewStats && (
          <div className="mt-4 rounded-xl border border-[#222E3A] bg-[#0A0E12] p-3.5 text-xs">
            <p className="font-semibold text-[#8A949E] mb-1.5">Pre-flight Validation Preview:</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-[#141C24] border border-[#222E3A] p-2">
                <span className="text-[#8A949E] block">Rows Inspected</span>
                <span className="text-sm font-bold text-[#EDE6D9]">{previewStats.total}</span>
              </div>
              <div className="rounded-lg bg-[#4E9B8F]/10 border border-[#4E9B8F]/40 p-2">
                <span className="text-[#4E9B8F] block">Valid GSTIN</span>
                <span className="text-sm font-bold text-[#4E9B8F]">{previewStats.validGstinCount}</span>
              </div>
              <div className="rounded-lg bg-[#C4695A]/10 border border-[#C4695A]/40 p-2">
                <span className="text-[#C4695A] block">Flagged / Invalid</span>
                <span className="text-sm font-bold text-[#C4695A]">{previewStats.invalidGstinCount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error / Success Messages */}
        {errorMsg && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#C4695A]/15 border border-[#C4695A]/30 p-3 text-xs text-[#E8998C]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {uploadResult && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#4E9B8F]/15 border border-[#4E9B8F]/30 p-3 text-xs text-[#73BFB3]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{uploadResult}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-[#8A949E] hover:bg-[#1A232C] hover:text-[#EDE6D9] transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!file || isUploading}
            onClick={handleUploadSubmit}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-[#D9A15B] hover:bg-[#E5AF6D] disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 shadow-lg shadow-[#D9A15B]/20 transition-all"
          >
            {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isUploading ? "Validating & Retraining..." : "Ingest & Retrain Model"}
          </button>
        </div>
      </div>
    </div>
  );
}
