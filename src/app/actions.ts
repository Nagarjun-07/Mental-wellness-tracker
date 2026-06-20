"use server";

import { db } from "@/lib/firebase";
import { ai } from "@/lib/gemini";
import { collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from "firebase/firestore";

// Helper to structure journal analysis prompt
const JOURNAL_ANALYSIS_PROMPT = `
You are an expert clinical psychologist and AI wellness engine. 
Analyze the following journal entry from a student preparing for exams.
Extract the following in JSON format:
{
  "dominantEmotions": ["Emotion 1", "Emotion 2"],
  "stressIndicators": ["Indicator 1", "Indicator 2"],
  "burnoutRisk": 0-100 (integer),
  "confidenceLevel": 0-100 (integer),
  "emotionalIntensity": 0-100 (integer),
  "hiddenTriggers": ["Trigger 1", "Trigger 2"]
}
Only return the raw JSON object.
`;

export async function analyzeJournalEntry(userId: string, entryText: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${JOURNAL_ANALYSIS_PROMPT}\n\nJournal Entry: ${entryText}`,
    });

    const text = response.text || "{}";
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(cleanedText);

    // Save to Firestore
    const journalRef = collection(db, "journals");
    await addDoc(journalRef, {
      userId,
      text: entryText,
      analysis,
      createdAt: new Date(), // using local date instead of serverTimestamp for simpler serialization back to client if needed
    });

    return { success: true, analysis };
  } catch (error) {
    console.error("Error analyzing journal:", error);
    return { success: false, error: "Failed to analyze journal entry." };
  }
}

export async function getBurnoutScore(userId: string) {
  // Try to fetch latest 5 journals to determine trend
  try {
    const q = query(collection(db, "journals"), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { 
        score: 0, 
        explanation: "Not enough data yet. Keep journaling to build your profile." 
      };
    }

    const journals = querySnapshot.docs.map(doc => doc.data().analysis);
    const avgBurnout = journals.reduce((acc, curr) => acc + (curr?.burnoutRisk || 0), 0) / journals.length;
    
    const prompt = `
      Based on the following recent emotional data of a student, provide a 1-sentence supportive explanation for their current burnout score of ${Math.round(avgBurnout)}.
      Data: ${JSON.stringify(journals)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return {
      score: Math.round(avgBurnout),
      explanation: response.text || "",
    };
  } catch (error) {
    console.error("Error getting burnout score:", error);
    return { score: 0, explanation: "Unable to calculate burnout score at the moment." };
  }
}

export async function getTriggerInsights(userId: string) {
  try {
    const q = query(collection(db, "journals"), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(15));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.docs.length < 2) {
      return [];
    }

    const journals = querySnapshot.docs.map(doc => ({ text: doc.data().text, analysis: doc.data().analysis }));
    
    const prompt = `
      Analyze these recent journal entries and their emotional data.
      Identify 3 distinct behavioral or environmental patterns (triggers) affecting the student.
      Return ONLY a JSON array of objects with this structure:
      [
        {
          "trigger": "Brief name of trigger",
          "confidencePercent": 85,
          "evidence": "Why you think this is a trigger based on data",
          "suggestedAction": "One actionable advice"
        }
      ]
      Data: ${JSON.stringify(journals)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "[]";
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);

  } catch (error) {
    console.error("Error getting trigger insights:", error);
    return [];
  }
}

export async function chatWithCompanion(userId: string, message: string, history: {role: string, content: string}[]) {
  try {
    const formattedHistory = history.map(h => `${h.role}: ${h.content}`).join('\n');
    const prompt = `
      You are an AI Wellness Companion for students preparing for high-stress exams.
      You are empathetic, supportive, and clinical-psychology informed.
      Context: User ID ${userId} is talking to you.
      
      Conversation History:
      ${formattedHistory}
      
      User's New Message:
      ${message}
      
      Provide a helpful, concise, and emotionally intelligent response.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error chatting with companion:", error);
    return "I'm having trouble connecting right now, but please know I'm here for you. Take a deep breath.";
  }
}

export async function getEmotionalTimeline(userId: string) {
  try {
    const q = query(collection(db, "journals"), where("userId", "==", userId), orderBy("createdAt", "asc"), limit(30));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        stress: data.analysis?.burnoutRisk || 0,
        confidence: data.analysis?.confidenceLevel || 0
      };
    });
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return [];
  }
}

export async function evaluateStudyBalance(studyHours: number, sleepHours: number, exerciseMin: number) {
  try {
    const prompt = `
      Evaluate the study-wellness balance for a student with:
      - ${studyHours} hours of study
      - ${sleepHours} hours of sleep
      - ${exerciseMin} minutes of exercise
      
      Return ONLY a JSON object:
      {
        "score": 0-100 (integer representing how healthy this balance is),
        "feedback": "One sentence personalized feedback",
        "recommendation": "One specific actionable advice"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "{}";
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error evaluating balance:", error);
    return { score: 50, feedback: "Unable to evaluate at the moment.", recommendation: "Maintain a steady routine." };
  }
}
