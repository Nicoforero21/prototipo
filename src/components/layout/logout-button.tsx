
'use client';

import { LogOut } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { logoutAction } from '@/lib/auth-actions';

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <DropdownMenuItem asChild>
        <button type="submit" className="w-full text-left">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </button>
      </DropdownMenuItem>
    </form>
  );
}

    