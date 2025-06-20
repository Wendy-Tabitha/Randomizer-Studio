"use client";

import React, { useState, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw } from "lucide-react";

const passwordFormSchema = z.object({
  length: z.number().min(8).max(128),
  uppercase: z.boolean().default(true),
  lowercase: z.boolean().default(true),
  numbers: z.boolean().default(true),
  symbols: z.boolean().default(false),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const defaultValues: Partial<PasswordFormValues> = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
};

export function PasswordGeneratorForm() {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const { toast } = useToast();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues,
  });

  const generatePassword = useCallback((values: PasswordFormValues) => {
    const { length, uppercase, lowercase, numbers, symbols } = values;
    let charset = "";
    if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) charset += "0123456789";
    if (symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (!charset) {
      setGeneratedPassword("");
      toast({
        title: "Error",
        description: "Please select at least one character type.",
        variant: "destructive",
      });
      return;
    }

    let password = "";
    // Ensure all selected character types are included
    if (uppercase) password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * "ABCDEFGHIJKLMNOPQRSTUVWXYZ".length)];
    if (lowercase) password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * "abcdefghijklmnopqrstuvwxyz".length)];
    if (numbers) password += "0123456789"[Math.floor(Math.random() * "0123456789".length)];
    if (symbols) password += "!@#$%^&*()_+~`|}{[]:;?><,./-="[Math.floor(Math.random() * "!@#$%^&*()_+~`|}{[]:;?><,./-=".length)];
    
    const remainingLength = length - password.length;
    for (let i = 0; i < remainingLength; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password to ensure randomness of initial characters
    setGeneratedPassword(password.split('').sort(() => 0.5 - Math.random()).join(''));

  }, [toast]);

  useEffect(() => {
    generatePassword(form.getValues());
  }, [form, generatePassword]);
  
  const onSubmit = (data: PasswordFormValues) => {
    generatePassword(data);
  };

  const copyToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword)
        .then(() => {
          toast({
            title: "Copied!",
            description: "Password copied to clipboard.",
          });
        })
        .catch(err => {
          toast({
            title: "Error",
            description: "Failed to copy password.",
            variant: "destructive",
          });
          console.error('Failed to copy: ', err);
        });
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Password Generator</CardTitle>
        <CardDescription>Create a strong and secure password.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2 bg-muted p-3 rounded-md min-h-[60px]">
              <Input
                readOnly
                value={generatedPassword}
                className="flex-grow text-lg font-mono tracking-wider border-0 bg-transparent shadow-none focus-visible:ring-0"
                aria-label="Generated Password"
              />
              <Button type="button" variant="ghost" size="icon" onClick={copyToClipboard} aria-label="Copy password">
                <Copy className="h-5 w-5" />
              </Button>
            </div>

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel>Password Length</FormLabel>
                    <span className="text-sm font-medium text-primary">{field.value}</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={8}
                      max={128}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      aria-label="Password length slider"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="uppercase"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Include Uppercase (A-Z)</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lowercase"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Include Lowercase (a-z)</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numbers"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Include Numbers (0-9)</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symbols"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Include Symbols (!@#)</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <RefreshCw className="mr-2 h-4 w-4" /> Generate Password
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
