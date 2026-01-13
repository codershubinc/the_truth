import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ADJECTIVES, NOUNS, VERBS, ENDINGS, PREFIXES, SUBJECTS } from './chaos.data';

@Injectable()
export class AppService {

  // --- 1. PURE TYPESCRIPT GENERATOR ---
  generateFact(subject: string) {
    // Pick random components
    const verb = this.getRandom(VERBS);
    const noun = this.getRandom(NOUNS);
    const adj = this.getRandom(ADJECTIVES);
    const ending = this.getRandom(ENDINGS);
    const prefix = this.getRandom(PREFIXES);

    if (subject === 'Random') {
      subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    }


    // Define random sentence structures
    const templates = [
      // Structure 1: Subject is actually a [Adj] [Noun]
      `${subject} is actually a ${adj} ${noun}.`,

      // Structure 2: Subject [Verb] [Noun] [Ending]
      `${subject} ${verb} ${noun} ${ending}`,

      // Structure 3: Subject refuses to acknowledge [Noun]
      `${subject} refuses to acknowledge ${noun} ${ending}`,

      // Structure 4: Subject [Verb] a [Adj] [Noun]
      `${subject} ${verb} a ${adj} ${noun}.`
    ];

    const rawFact = templates[Math.floor(Math.random() * templates.length)];

    // Combine Prefix + Fact
    return {
      fact: `${prefix} ${rawFact}`,
      subject: subject
    };
  }

  // Helper to get random item
  private getRandom(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }

  // --- 2. SAVE LOGIC (Note for Vercel) ---
  saveFact(animal: string, fact: string) {
    // NOTE: On Vercel, this file will disappear after the function finishes.
    // To save permanently on Vercel, you must use a Database (like Vercel KV or MongoDB).
    // For local testing, this works fine.

    const safeName = animal.replace(/[^a-zA-Z0-9]/g, '_');
    // Using /tmp for Vercel compatibility (ephemeral storage)
    const dirPath = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');

    if (!fs.existsSync(dirPath) && !process.env.VERCEL) {
      fs.mkdirSync(dirPath);
    }

    const filePath = path.join(dirPath, `${safeName}.json`);

    let fileData = { subject: animal, facts: [] as { fact: string; timestamp: number }[] };

    if (fs.existsSync(filePath)) {
      try {
        fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (e) { }
    }

    fileData.facts.push({
      fact,
      timestamp: Date.now()
    });

    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
    return { status: 'success', path: filePath };
  }
}