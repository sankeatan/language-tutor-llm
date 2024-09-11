import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

const userProgress = [
  { skill: "Grammar", progress: 75, feedback: "Great progress! Focus on advanced tenses." },
  { skill: "Vocabulary", progress: 60, feedback: "Good effort. Try to incorporate more academic words." },
  { skill: "Listening", progress: 80, feedback: "Excellent! Practice with more diverse accents." },
  { skill: "Speaking", progress: 70, feedback: "Well done. Work on fluency in longer conversations." },
  { skill: "Reading", progress: 85, feedback: "Outstanding! Challenge yourself with scientific texts." },
  { skill: "Writing", progress: 65, feedback: "Improving. Pay attention to essay structure." },
]

export function UserFeedback() {
  return (
    <div className="h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Your Progress</h1>
      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="space-y-4">
          {userProgress.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{item.skill}</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={item.progress} className="mb-2" />
                <p className="text-sm text-gray-600">{item.feedback}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}