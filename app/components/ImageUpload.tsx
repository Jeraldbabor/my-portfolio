"use client";

import { useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";

export function ImageUpload({
    value,
    onChange,
    label,
}: {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
}) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("portfolio")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from("portfolio").getPublicUrl(filePath);
            onChange(data.publicUrl);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error("Error uploading image:", error);
            if (error.message === "Bucket not found") {
                alert("Error: The 'portfolio' storage bucket does not exist. Please create it in your Supabase dashboard.");
            } else {
                alert("Error uploading image: " + (error.message || "Unknown error"));
            }
        } finally {
            setUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }

    return (
        <div className="space-y-2">
            {label && <span className="text-xs text-zinc-500 dark:text-zinc-500">{label}</span>}
            <div className="flex items-start gap-4">
                {value && (
                    <div className="relative w-20 h-20 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="flex-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        disabled={uploading}
                        className="hidden"
                        id={`image-upload-${label?.replace(/\s+/g, "-")}`}
                    />
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={`image-upload-${label?.replace(/\s+/g, "-")}`}
                            className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors w-fit ${uploading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            {uploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
                        </label>
                        {value && (
                            <input
                                type="text"
                                value={value}
                                readOnly
                                className="w-full text-xs text-zinc-500 bg-transparent border-none p-0 focus:ring-0"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
