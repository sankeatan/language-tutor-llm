'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const grammarLessons = [
  { title: "Present Tense Conjugation", content: "Learn how to conjugate regular verbs in the present tense." },
  { title: "Ser vs. Estar", content: "Understand the difference between 'ser' and 'estar', both meaning 'to be'." },
  { title: "Gender and Number Agreement", content: "Learn how adjectives change to match the gender and number of nouns." },
  { title: "Object Pronouns", content: "Master the use of direct and indirect object pronouns in Spanish." },
  { title: "Preterite vs. Imperfect", content: "Understand when to use these two past tenses in Spanish." },
]

export function GrammarLessons() {
  return (
    <div className="h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Spanish Grammar Lessons</h1>
      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="space-y-4">
          {grammarLessons.map((lesson, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{lesson.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}