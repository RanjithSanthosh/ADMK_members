// app/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react"; // For the loading spinner
import { toast } from "sonner"; // Using the new 'sonner' toast

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// 1. Create the Validation Schema with Zod
// This regex is for a basic 10-digit Indian phone number, optionally with +91
const phoneRegex = new RegExp(/^(?:\+91)?[6-9]\d{9}$/);

const formSchema = z.object({
  name: z.string().min(2, {
    message: "பெயர் குறைந்தது 2 எழுத்துகள் இருக்க வேண்டும்.",
  }),
  phone: z.string().regex(phoneRegex, {
    message: "சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்.",
  }),
  booth: z.string().min(1, {
    message: "பூத் எண் தேவை.",
  }),
  position: z.string().min(2, {
    message: "பதவி தேவை.",
  }),
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  // 2. Define the form with useForm and Zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      booth: "",
      position: "",
    },
  });

  // 3. Create the onSubmit function
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Map form data to your Google Sheet keys
    const backendData = {
      fullName: values.name,
      phoneNumber: values.phone,
      constituency: values.booth,
      partyRole: values.position,
    };

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendData),
      });

      const result = await response.json();

      if (!response.ok || result.result !== "success") {
        throw new Error(result.error || "Submission failed");
      }

      // --- SUCCESS TOAST (using Sonner) ---
      toast.success("வெற்றி!", {
        description: "உங்கள் பதிவு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.",
      });
      form.reset(); // Reset the form fields
    } catch (err: any) {
      // --- ERROR TOAST (using Sonner) ---
      toast.error("பிழை", {
        description:
          "சமர்ப்பிப்பதில் தோல்வி ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // 4. Build the new UI to match the image
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-4 font-noto-sans-tamil">
      {/* Header Section */}
      <div className="mb-6 text-center">
        {/* Pill Logo from Image */}
        <div>
          <Image
            src="/logo.png" // Change this to your logo in /public
            alt="AIADMK Logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
            priority
          />
        </div>

        {/* Header Text */}
        <h1
          className="my-2 text-2xl font-bold"
          style={{ color: "#0B9421" }} // Inline style for green
        >
          அனைத்திந்திய அண்ணா திராவிட முன்னேற்ற கழகம்
        </h1>
        <h1
          className="my-2 text-2xl font-bold"
          style={{ color: "#0B9421" }} // Inline style for green
        >
          திருவண்ணாமலை தெற்கு மாவட்டம்
        </h1>
        <h2
          className="my-2 text-xl font-bold"
          style={{ color: "#d91c1c" }} // Inline style for red
        >
          அ.தி.மு.க வருகை பதிவேடு
        </h2>
      </div>

      {/* Form Container (Replaces the Card) */}
      <div
        className="w-full max-w-md rounded-lg p-6 shadow-md"
        style={{ borderWidth: "2px", borderColor: "#0B9421" }} // Inline style for green border
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-black text-lg">
                    பெயர்:
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="உங்கள் பெயரை உள்ளிடவும்"
                      {...field}
                      disabled={isLoading}
                      className=" text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-black text-lg">
                    தொலைபேசி எண்:
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்"
                      {...field}
                      disabled={isLoading}
                      className=" text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="booth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-black text-lg">
                    பூத் எண்:
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="உங்கள் பூத் எண்ணை உள்ளிடவும்"
                      {...field}
                      disabled={isLoading}
                      className=" text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-black text-lg">
                    பதவி:
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="உங்கள் பதவியை உள்ளிடவும்"
                      {...field}
                      disabled={isLoading}
                      className=" text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              // Inline style for the gradient
              style={{
                backgroundImage: isLoading
                  ? "linear-gradient(to right, #9CA3AF, #6B7280)" // Gray
                  : "linear-gradient(to right, #0B9421, #d91c1c)", // Green-to-Red
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "சமர்ப்பிக்கிறது..." : "சமர்ப்பிக்க"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Footer */}
      <footer
        className="mt-8 text-base font-bold"
        style={{ color: "#0B9421" }} // Inline style for green
      >
        © 2025 அ.தி.மு.க - திருவண்ணாமலை தெற்கு மாவட்டம்
      </footer>
    </main>
  );
}
