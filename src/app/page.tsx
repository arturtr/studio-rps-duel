
"use client";

import type { NextPage } from 'next';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RotateCcw, ThumbsUp, ThumbsDown, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

type Choice = 'rock' | 'paper' | 'scissors';
type OutcomeMessage = 'You Win!' | 'Computer Wins!' | "It's a Tie!" | null;

const choices: Choice[] = ['rock', 'paper', 'scissors'];
const hotkeyMap: Record<Choice, string[]> = {
  rock: ['R', '1'],
  paper: ['P', '2'],
  scissors: ['S', '3'],
};

const getEmojiForChoice = (choice: Choice | null): string => {
  if (choice === 'rock') return '🪨';
  if (choice === 'paper') return '🧻';
  if (choice === 'scissors') return '✂️';
  return '?';
};

const getOutcomeIcon = (outcome: OutcomeMessage) => {
  if (outcome === 'You Win!') return <ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />;
  if (outcome === 'Computer Wins!') return <ThumbsDown className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />;
  if (outcome === "It's a Tie!") return <Scale className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />;
  return null;
};

const RpsPage: NextPage = () => {
  const [userChoice, setUserChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [outcome, setOutcome] = useState<OutcomeMessage>(null);
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [ties, setTies] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUserScore = localStorage.getItem('rpsUserScore');
      const storedComputerScore = localStorage.getItem('rpsComputerScore');
      const storedTies = localStorage.getItem('rpsTies');

      if (storedUserScore) setUserScore(parseInt(storedUserScore, 10));
      if (storedComputerScore) setComputerScore(parseInt(storedComputerScore, 10));
      if (storedTies) setTies(parseInt(storedTies, 10));
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      setUserScore(0);
      setComputerScore(0);
      setTies(0);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('rpsUserScore', userScore.toString());
        localStorage.setItem('rpsComputerScore', computerScore.toString());
        localStorage.setItem('rpsTies', ties.toString());
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  }, [userScore, computerScore, ties, isLoading]);

  const determineWinner = useCallback((player: Choice, computer: Choice): OutcomeMessage => {
    if (player === computer) {
      setTies(prev => prev + 1);
      return "It's a Tie!";
    }
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'scissors' && computer === 'paper') ||
      (player === 'paper' && computer === 'rock')
    ) {
      setUserScore(prev => prev + 1);
      return 'You Win!';
    }
    setComputerScore(prev => prev + 1);
    return 'Computer Wins!';
  }, []);


  const handleUserChoice = useCallback((choice: Choice) => {
    setUserChoice(choice);
    const compChoice = choices[Math.floor(Math.random() * choices.length)];
    setComputerChoice(compChoice);
    setOutcome(determineWinner(choice, compChoice));
  }, [determineWinner]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement && ['INPUT', 'TEXTAREA', 'BUTTON'].includes(document.activeElement.tagName.toUpperCase())) {
        if (document.activeElement.tagName.toUpperCase() === 'BUTTON' && (event.key === 'Enter' || event.key === ' ')) {
           // Allow space/enter on focused buttons
        } else if (document.activeElement.tagName.toUpperCase() !== 'BUTTON') {
           return; // If typing in input/textarea, ignore
        }
      }
      switch (event.key.toLowerCase()) {
        case 'r':
        case '1':
          handleUserChoice('rock');
          break;
        case 'p':
        case '2':
          handleUserChoice('paper');
          break;
        case 's':
        case '3':
          handleUserChoice('scissors');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUserChoice]);

  const resetScores = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setOutcome(null);
    setUserScore(0);
    setComputerScore(0);
    setTies(0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-foreground">Loading Game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8 text-foreground">
      <Card className="w-full max-w-2xl shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="p-6 sm:p-8 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex-grow mb-4 sm:mb-0">
              <CardTitle className="text-3xl sm:text-4xl font-bold text-primary">RPS Duel</CardTitle>
              <CardDescription className="text-md sm:text-lg text-muted-foreground mt-1">
                Choose your weapon wisely!
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase">You</p>
                <p className="text-xl font-bold text-foreground">{userScore}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase">CPU</p>
                <p className="text-xl font-bold text-foreground">{computerScore}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase">Ties</p>
                <p className="text-xl font-bold text-foreground">{ties}</p>
              </div>
              <Button onClick={resetScores} variant="destructive" size="icon" aria-label="Reset All Scores" className="shadow-md hover:shadow-lg transition-shadow ml-2 sm:ml-4">
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {choices.map((choice) => (
              <Button
                key={choice}
                onClick={() => handleUserChoice(choice)}
                variant="outline"
                className="h-auto py-4 sm:py-6 text-sm sm:text-md capitalize transition-all duration-200 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-accent shadow-md hover:shadow-lg focus:shadow-lg flex flex-col items-center justify-center p-2 group border-2 hover:border-accent hover:bg-accent"
                aria-label={`Choose ${choice}`}
              >
                <span className="text-4xl md:text-5xl text-primary group-hover:text-accent-foreground transition-colors duration-200" role="img" aria-label={choice}>
                  {getEmojiForChoice(choice)}
                </span>
                <span className="mt-2 font-medium text-foreground group-hover:text-accent-foreground transition-colors duration-200">{choice}</span>
                <div className="mt-1.5 flex items-center justify-center space-x-1">
                  {hotkeyMap[choice].map((key, index) => (
                    <React.Fragment key={key}>
                      {index > 0 && <span className="mx-1 text-xs text-muted-foreground group-hover:text-accent-foreground transition-colors duration-200">or</span>}
                      <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground group-hover:text-accent-foreground bg-muted group-hover:bg-primary/20 border border-input rounded-md shadow-sm transition-colors duration-200">
                        {key}
                      </kbd>
                    </React.Fragment>
                  ))}
                </div>
              </Button>
            ))}
          </div>

          <div className="pt-6 border-t">
            <div className="min-h-72 flex flex-col justify-center">
              {userChoice || computerChoice || outcome ? (
                <div className="space-y-6 text-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
                    <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg shadow-sm bg-secondary/50">
                      <h3 className="text-lg sm:text-xl font-semibold text-secondary-foreground">Your Choice</h3>
                      <span className="text-5xl md:text-6xl text-secondary-foreground" role="img" aria-label={userChoice || undefined}>
                        {getEmojiForChoice(userChoice)}
                      </span>
                      <p className="text-md sm:text-lg capitalize text-secondary-foreground font-medium">{userChoice || 'Waiting...'}</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg shadow-sm bg-secondary/50">
                      <h3 className="text-lg sm:text-xl font-semibold text-secondary-foreground">Computer's Choice</h3>
                      <span className="text-5xl md:text-6xl text-secondary-foreground" role="img" aria-label={computerChoice || undefined}>
                        {getEmojiForChoice(computerChoice)}
                      </span>
                      <p className="text-md sm:text-lg capitalize text-secondary-foreground font-medium">{computerChoice || 'Waiting...'}</p>
                    </div>
                  </div>
                  {outcome && (
                    <div className={cn(
                      "mt-4 p-4 sm:p-5 rounded-lg shadow-md text-center flex items-center justify-center",
                      outcome === 'You Win!' && "bg-accent text-accent-foreground",
                      outcome === 'Computer Wins!' && "bg-destructive text-destructive-foreground",
                      outcome === "It's a Tie!" && "bg-muted text-muted-foreground"
                    )}>
                      {getOutcomeIcon(outcome)}
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{outcome}</h2>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <Scale className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-lg font-medium text-foreground">Let the duel begin!</p>
                  <p className="text-sm text-muted-foreground">Choose your weapon to see the outcome.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RpsPage;
