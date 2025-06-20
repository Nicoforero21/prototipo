import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-bold font-headline">Cultiva Colombia</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Cultiva Colombia. Fomentando la soberanía alimentaria.
          </p>
        </div>
      </div>
    </footer>
  );
}
