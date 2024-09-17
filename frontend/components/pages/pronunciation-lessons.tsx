'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { VolumeIcon } from "lucide-react"

const pronunciationLessons = [
  { title: "The Spanish Alphabet", content: "Learn how to pronounce each letter in Spanish." },
  { title: "Vowel Sounds", content: "Master the five vowel sounds in Spanish." },
  { title: "R and RR Sounds", content: "Practice the trilled 'r' sound unique to Spanish." },
  { title: "Stress and Accent Marks", content: "Understand how stress works in Spanish words and when to use accent marks." },
  { title: "Common Pronunciation Pitfalls", content: "Avoid common mistakes made by English speakers when pronouncing Spanish words." },
]

export function PronunciationLessons() {
  return (
    <div className="h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Spanish Pronunciation Lessons</h1>
      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="space-y-4">
          {pronunciationLessons.map((lesson, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{lesson.content}</p>
                <Button variant="outline" size="sm">
                  <VolumeIcon className="h-4 w-4 mr-2" />
                  Listen to Pronunciation
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}