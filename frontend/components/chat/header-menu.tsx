import { Button } from "@/components/ui/button"
import { UserDropdownMenu } from './dropdown-menu'  // Assuming you already modularized the dropdown
import { MessageCircleIcon, BarChartIcon, ContactIcon } from "lucide-react"
import axios from "axios";

interface HeaderMenuProps {
  setCurrentView: (view: 'feedback' | 'contacts' | 'messages') => void;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({ setCurrentView }) => {
  const handleLogout = async () => {
    try {
      // Call backend logout to clear the cookie
      await axios.post('http://localhost:4000/auth/logout', {}, { withCredentials: true });

      // Clear token from client-side cookies
      document.cookie = 'token=; Max-Age=0; path=/';

    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Buttons */}
      <Button variant="ghost" size="icon" onClick={() => setCurrentView('messages')}>
        <MessageCircleIcon className="h-6 w-6" />
        <span className="sr-only">Messages</span>
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setCurrentView('feedback')}>
        <BarChartIcon className="h-6 w-6" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setCurrentView('contacts')}>
        <ContactIcon className="h-6 w-6" />
        <span className="sr-only">Contact List</span>
      </Button>
      <UserDropdownMenu handleLogout={handleLogout} />
    </div>
  );
};
