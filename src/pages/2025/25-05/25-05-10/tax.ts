/**
 * Tax file for NumberTossClock (25-05-10)
 * This file contains tax-related information that can be displayed in the clock component
 */

export interface ClockTax {
  title: string;
  content: string;
  metadata?: {
    created: string;
    version: string;
  };
}

const clockTax: ClockTax = {
  title: "Number Toss Clock Tax Information",
  content: "hello world",
  metadata: {
    created: "2025-05-10",
    version: "1.0.0"
  }
};

export default clockTax;
