"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Dices } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const diceTypes = [
  { value: 4, label: "D4" },
  { value: 6, label: "D6" },
  { value: 8, label: "D8" },
  { value: 10, label: "D10" },
  { value: 12, label: "D12" },
  { value: 20, label: "D20" },
  { value: 100, label: "D100" },
];

const diceRollerSchema = z.object({
  diceType: z.coerce.number().min(1),
  numberOfDice: z.coerce.number().min(1).max(100),
});

type DiceRollerFormValues = z.infer<typeof diceRollerSchema>;

const defaultValues: Partial<DiceRollerFormValues> = {
  diceType: 20,
  numberOfDice: 1,
};

interface DiceRollResult {
  id: string;
  rolls: number[];
  total: number;
  diceType: number;
  timestamp: Date;
}

export function DiceRollerForm() {
  const [results, setResults] = useState<DiceRollResult[]>([]);
  const [currentRolls, setCurrentRolls] = useState<number[]>([]);
  const [currentTotal, setCurrentTotal] = useState<number>(0);
  const [isRolling, setIsRolling] = useState(false);

  const form = useForm<DiceRollerFormValues>({
    resolver: zodResolver(diceRollerSchema),
    defaultValues,
  });

  const onSubmit = (data: DiceRollerFormValues) => {
    setIsRolling(true);
    const rolls: number[] = [];
    let total = 0;
    for (let i = 0; i < data.numberOfDice; i++) {
      const roll = Math.floor(Math.random() * data.diceType) + 1;
      rolls.push(roll);
      total += roll;
    }
    
    setCurrentRolls([]); // Clear previous rolls for animation effect
    setCurrentTotal(0);

    // Simulate dice rolling animation
    setTimeout(() => {
      setCurrentRolls(rolls);
      setCurrentTotal(total);
      
      const newResult: DiceRollResult = {
        id: crypto.randomUUID(),
        rolls,
        total,
        diceType: data.diceType,
        timestamp: new Date()
      };
      setResults(prevResults => [newResult, ...prevResults.slice(0, 4)]); // Keep last 5 results
      setIsRolling(false);
    }, 500); // Animation duration
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Dice Roller</CardTitle>
          <CardDescription>Roll virtual dice of various sizes.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="diceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dice Type</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dice type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {diceTypes.map((dice) => (
                            <SelectItem key={dice.value} value={String(dice.value)}>
                              {dice.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfDice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Dice</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <div className="mt-6 p-4 border rounded-lg bg-muted min-h-[120px] flex flex-col items-center justify-center">
                {isRolling && <Dices className="h-10 w-10 animate-spin text-primary" />}
                {!isRolling && currentRolls.length > 0 && (
                  <>
                    <div className="flex flex-wrap gap-2 mb-2 justify-center">
                      {currentRolls.map((roll, index) => (
                        <Badge key={index} variant="secondary" className="text-lg px-3 py-1 animate-in fade-in zoom-in-50 duration-500">
                          {roll}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-2xl font-bold text-primary">Total: {currentTotal}</p>
                  </>
                )}
                {!isRolling && currentRolls.length === 0 && (
                    <p className="text-muted-foreground">Roll the dice to see results here.</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isRolling}>
                <Dices className="mr-2 h-4 w-4" /> {isRolling ? "Rolling..." : "Roll Dice"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {results.length > 0 && (
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Roll History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-3">
              <ul className="space-y-3">
                {results.map(result => (
                  <li key={result.id} className="p-3 border rounded-md bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-primary">D{result.diceType} x {result.rolls.length}</span>
                      <span className="text-xs text-muted-foreground">{result.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {result.rolls.map((roll, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{roll}</Badge>
                      ))}
                    </div>
                    <p className="text-md font-medium">Total: {result.total}</p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
