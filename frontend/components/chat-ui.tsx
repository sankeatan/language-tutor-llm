'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MenuIcon, SendIcon, MicIcon, PaperclipIcon, UserIcon, StopCircleIcon, PlusIcon, BookOpenIcon, VolumeIcon, BarChartIcon, MessageCircleIcon, TrashIcon } from "lucide-react"
import { format } from 'date-fns'
import { GrammarLessons } from './grammar-lessons'
import { PronunciationLessons } from './pronunciation-lessons'
import { UserFeedback } from './user-feedback'

type Message = {
  role: 'user' | 'ai'
  content: string
}

type Conversation = {
  id: number
  title: string
  messages: Message[]
  lastUsed: Date
}

export function ChatUi() {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, title: 'Basic Greetings', messages: [
      { role: 'ai', content: '¡Hola! ¿Cómo estás? (Hello! How are you?)' },
      { role: 'user', content: 'Estoy bien, gracias. ¿Y tú? (I\'m fine, thank you. And you?)' },
      { role: 'ai', content: 'Muy bien, gracias. Let\'s practice some basic Spanish greetings!' },
    ], lastUsed: new Date(2023, 5, 15) },
    { id: 2, title: 'Numbers 1-10', messages: [
      { role: 'ai', content: 'Let\'s learn to count from 1 to 10 in Spanish!' },
      { role: 'user', content: 'Great! How do I say "one" in Spanish?' },
      { role: 'ai', content: '"One" in Spanish is "uno". Can you try counting from 1 to 3?' },
    ], lastUsed: new Date(2023, 5, 14) },
  ])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [input, setInput] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const recordingInterval = useRef<NodeJS.Timeout | null>(null)
  const [currentView, setCurrentView] = useState<'chat' | 'grammar' | 'pronunciation' | 'feedback'>('chat')
  const [newConversationMethod, setNewConversationMethod] = useState<'voice' | 'media' | 'text' | null>(null)

  const handleSend = () => {
    if (input.trim() && currentConversation) {
      const newMessage: Message = { role: 'user', content: input }
      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, newMessage],
        lastUsed: new Date()
      }
      setCurrentConversation(updatedConversation)
      setConversations(conversations.map(conv => 
        conv.id === currentConversation.id ? updatedConversation : conv
      ))
      setInput('')
    }
  }

  const handleConversationSelect = (conversation: Conversation) => {
    setCurrentConversation(conversation)
    setIsSidebarOpen(false)
  }

  const handleNewConversation = () => {
    setCurrentConversation(null)
    setNewConversationMethod(null)
    setIsSidebarOpen(false)
  }

  const handleDeleteConversation = (id: number) => {
    setConversations(conversations.filter(conv => conv.id !== id))
    if (currentConversation && currentConversation.id === id) {
      setCurrentConversation(null)
    }
  }

  const handleMicrophoneStart = () => {
    setIsRecording(true)
    setRecordingTime(0)
    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const handleMicrophoneEnd = () => {
    setIsRecording(false)
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current)
    }
    // Here you would typically process the recorded audio
    console.log('Recording ended')
  }

  const handlePaperclipClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*, video/*, audio/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Here you would typically handle the file upload
        console.log('File selected:', file.name)
      }
    }
    input.click()
  }

  const startNewConversation = (method: 'voice' | 'media' | 'text') => {
    const newConversation: Conversation = {
      id: conversations.length + 1,
      title: `New Spanish Lesson ${conversations.length + 1}`,
      messages: [],
      lastUsed: new Date()
    }
    setConversations([...conversations, newConversation])
    setCurrentConversation(newConversation)
    setNewConversationMethod(method)
  }

  useEffect(() => {
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-white dark:bg-gray-800">
              <h2 className="text-lg font-semibold mb-4">Conversations</h2>
              <Button 
                variant="outline" 
                className="w-full mb-4"
                onClick={handleNewConversation}
              >
                <PlusIcon className="mr-2 h-4 w-4" /> New Conversation
              </Button>
              <ScrollArea className="h-[calc(100vh-180px)]">
                {conversations.map((conv) => (
                  <div key={conv.id} className="flex items-center mb-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start mr-2"
                      onClick={() => handleConversationSelect(conv)}
                    >
                      <div className="flex flex-col items-start">
                        <span>{conv.title}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(conv.lastUsed, 'MMM d, yyyy')}
                        </span>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteConversation(conv.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </SheetContent>
          </Sheet>
          {currentView === 'chat' ? (
            <>
              <Button variant="ghost" size="icon" className="ml-2" onClick={() => setCurrentView('grammar')}>
                <BookOpenIcon className="h-6 w-6" />
                <span className="sr-only">Grammar Lessons</span>
              </Button>
              <Button variant="ghost" size="icon" className="ml-2" onClick={() => setCurrentView('pronunciation')}>
                <VolumeIcon className="h-6 w-6" />
                <span className="sr-only">Pronunciation Lessons</span>
              </Button>
              <Button variant="ghost" size="icon" className="ml-2" onClick={() => setCurrentView('feedback')}>
                <BarChartIcon className="h-6 w-6" />
                <span className="sr-only">Your Progress</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" className="ml-2" onClick={() => setCurrentView('chat')}>
                <MessageCircleIcon className="h-6 w-6" />
                <span className="sr-only">Back to Chat</span>
              </Button>
              {currentView !== 'grammar' && (
                <Button variant="ghost" size="icon" className="ml-2" onClick={() => setCurrentView('grammar')}>
                  <BookOpenIcon className="h-6 w-6" />
                  <span className="sr-only">Grammar Lessons</span>
                </Button>
              )}
              {currentView !== 'pronunciation' && (
                <Button variant="ghost" size="icon" className="ml-2" onClick={() => setCurrentView('pronunciation')}>
                  <VolumeIcon className="h-6 w-6" />
                  <span className="sr-only">Pronunciation Lessons</span>
                </Button>
              )}
              {currentView !== 'feedback' && (
                <Button variant="ghost" size="icon" className="ml-2" onClick={() => setCurrentView('feedback')}>
                  <BarChartIcon className="h-6 w-6" />
                  <span className="sr-only">Your Progress</span>
                </Button>
              )}
            </>
          )}
        </div>
        <h1 className="text-lg font-semibold">GPTutor</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <UserIcon className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main content area */}
      {currentView === 'chat' && (
        <>
          {currentConversation ? (
            <>
              {/* Chat messages */}
              <ScrollArea className="flex-grow p-4">
                {currentConversation.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </ScrollArea>

              {/* Input area */}
              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                {isRecording ? (
                  <div className="flex items-center justify-between bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse" />
                      <span>Recording: {recordingTime}s</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleMicrophoneEnd}>
                      <StopCircleIcon className="h-6 w-6 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onMouseDown={handleMicrophoneStart}
                      onMouseUp={handleMicrophoneEnd}
                      onTouchStart={handleMicrophoneStart}
                      onTouchEnd={handleMicrophoneEnd}
                    >
                      <MicIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handlePaperclipClick}>
                      <PaperclipIcon className="h-4 w-4" />
                    </Button>
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-grow mx-2"
                    />
                    <Button onClick={handleSend} disabled={!input.trim()}>
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // New Conversation screen
            <div className="flex flex-col items-center justify-center h-full space-y-4 sm:space-y-8">
              {newConversationMethod === null ? (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center text-center p-4"
                    onClick={() => startNewConversation('voice')}
                  >
                    <MicIcon className="h-8 w-8 sm:h-12 sm:w-12 mb-2" />
                    <span className="text-xs sm:text-sm">Start a voice conversation</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center text-center p-4"
                    onClick={() => startNewConversation('media')}
                  >
                    <PaperclipIcon className="h-8 w-8 sm:h-12 sm:w-12 mb-2" />
                    <span className="text-xs sm:text-sm">Upload media for your tutor</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center text-center p-4"
                    onClick={() => startNewConversation('text')}
                  >
                    <SendIcon className="h-8 w-8 sm:h-12 sm:w-12 mb-2" />
                    <span className="text-xs sm:text-sm">Send a text message</span>
                  </Button>
                </>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">New Conversation Started</h2>
                  <p>You chose to start a new conversation using {newConversationMethod}.</p>
                  <p>Your tutor will be with you shortly.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {currentView === 'grammar' && <GrammarLessons />}
      {currentView === 'pronunciation' && <PronunciationLessons />}
      {currentView === 'feedback' && <UserFeedback />}
    </div>
  )
}