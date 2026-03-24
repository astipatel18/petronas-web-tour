"use client";
import React from "react";
import { Button } from "../ui/button";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-black flex items-center justify-center text-center p-6">
          <div>
            <h2 className="text-3xl font-serif text-white mb-4">A Structural Anomaly Occurred</h2>
            <p className="text-slate-400 mb-8">The engineering team has been notified. Please refresh.</p>
            <Button onClick={() => window.location.reload()}>Retry Experience</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}