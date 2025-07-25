
'use client';

import { LogOut } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { logoutAction } from '@/lib/auth-actions';

const auth = getAuth(app);

export function LogoutButton() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // Sign out from the client-side Firebase instance
      await signOut(auth);
      // Call the server action to clear the session cookie
      await logoutAction();
      
      toast({
        title: 'Cierre de sesión exitoso',
        description: 'Has cerrado tu sesión.',
      });

      // Redirect to home and refresh the page to clear server component cache
      router.push('/');
      router.refresh();

    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cerrar la sesión. Por favor, intenta de nuevo.',
      });
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout} onSelect={(e) => e.preventDefault()}>
      <button className="w-full text-left flex items-center">
        <LogOut className="mr-2 h-4 w-4" />
        <span>Cerrar Sesión</span>
      </button>
    </DropdownMenuItem>
  );
}
