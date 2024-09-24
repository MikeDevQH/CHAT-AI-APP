import ThemeToggle from "@/components/ui/ThemeToggle"; // Asegúrate de importar el ThemeToggle  

export default function ChatHeader() {  
  return (  
    <header className="relative text-center py-4 bg-[var(--header-background)] shadow-md">  
      <h1 className="text-4xl font-bold text-[var(--header-text)]">ChatAI App</h1>  
      <div className="absolute top-4 right-4">  
        <ThemeToggle />  
      </div>  
    </header>  
  );  
}